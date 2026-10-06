import { appStorage } from './storage';
import {
  Sale,
  Expense,
  Product,
  Customer,
  Supplier,
  Goal,
  ClosedPeriod,
  GorduraUsage,
  DailyRegisterRecord,
} from '../types';

export interface FullCutelariaDatabase {
  sales: Sale[];
  expenses: Expense[];
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  goals: Goal[];
  closedPeriods: ClosedPeriod[];
  gorduraUsages: GorduraUsage[];
  dailyRegisters: DailyRegisterRecord[];
  updatedAt: number;
  sourceDevice?: string;
}

export class CloudSyncService {
  private static isSyncing = false;
  private static lastKnownServerUpdate = 0;
  private static listeners: Set<() => void> = new Set();

  public static subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('CloudSync listener error', err);
      }
    });
  }

  /**
   * Bundles all current local storage data into a single payload
   */
  public static getLocalPayload(): FullCutelariaDatabase {
    return {
      sales: appStorage.getSales(),
      expenses: appStorage.getExpenses(),
      products: appStorage.getProducts(),
      customers: appStorage.getCustomers(),
      suppliers: appStorage.getSuppliers(),
      goals: appStorage.getGoals(),
      closedPeriods: appStorage.getClosedPeriods(),
      gorduraUsages: appStorage.getGorduraUsages(),
      dailyRegisters: appStorage.getDailyRegisters(),
      updatedAt: Date.now(),
      sourceDevice: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node',
    };
  }

  /**
   * Applies a complete database payload into local storage
   */
  public static applyPayloadLocally(data: FullCutelariaDatabase, notify: boolean = true) {
    if (data.sales) appStorage.setSales(data.sales);
    if (data.expenses) appStorage.setExpenses(data.expenses);
    if (data.products) appStorage.setProducts(data.products);
    if (data.customers) appStorage.setCustomers(data.customers);
    if (data.suppliers) appStorage.setSuppliers(data.suppliers);
    if (data.goals) appStorage.setGoals(data.goals);
    if (data.closedPeriods) appStorage.setClosedPeriods(data.closedPeriods);
    if (data.gorduraUsages) appStorage.setGorduraUsages(data.gorduraUsages);
    if (data.dailyRegisters) appStorage.setDailyRegisters(data.dailyRegisters);
    if (notify) {
      this.notify();
    }
  }

  /**
   * Pushes local notebook data up to the shared cloud server
   */
  public static async pushLocalToCloud(): Promise<{ success: boolean; updatedAt?: number; error?: string }> {
    try {
      this.isSyncing = true;
      const payload = this.getLocalPayload();

      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Falha no servidor (${response.status})`);
      }

      const res = await response.json();
      this.lastKnownServerUpdate = res.updatedAt || Date.now();
      return { success: true, updatedAt: this.lastKnownServerUpdate };
    } catch (err: any) {
      console.warn('Could not push to cloud server:', err.message);
      return { success: false, error: err.message };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Pulls latest database from the shared server
   */
  public static async pullFromCloud(): Promise<{ updated: boolean; count?: number }> {
    if (this.isSyncing) return { updated: false };

    try {
      const response = await fetch('/api/data');
      if (!response.ok) return { updated: false };

      const json = await response.json();
      if (!json.initialized || !json.data) {
        // Server database is empty or not yet seeded: push current notebook data so it seeds the cloud!
        const localSales = appStorage.getSales();
        if (localSales.length > 0) {
          console.log('[CloudSync] Servidor sem banco inicial. Enviando dados deste notebook para a nuvem...');
          await this.pushLocalToCloud();
          return { updated: true, count: localSales.length };
        }
        return { updated: false };
      }

      const serverData = json.data as FullCutelariaDatabase;
      if (serverData.updatedAt && serverData.updatedAt > this.lastKnownServerUpdate) {
        this.lastKnownServerUpdate = serverData.updatedAt;
        this.applyPayloadLocally(serverData, true);
        return { updated: true, count: serverData.sales?.length || 0 };
      }

      return { updated: false };
    } catch (err) {
      // In offline mode or local dev without server, silently keep local storage
      return { updated: false };
    }
  }

  /**
   * Initializes real-time background synchronization (every 3 seconds + window focus)
   */
  public static startAutoSync(onUpdate?: () => void): () => void {
    if (onUpdate) {
      this.subscribe(onUpdate);
    }

    // Immediate first pull/push
    this.pullFromCloud();

    const intervalId = setInterval(() => {
      this.pullFromCloud();
    }, 4000);

    const onFocus = () => {
      this.pullFromCloud();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', onFocus);
    }

    return () => {
      clearInterval(intervalId);
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', onFocus);
      }
    };
  }

  /**
   * Export JSON file to local computer disk
   */
  public static exportBackupFile() {
    const payload = this.getLocalPayload();
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `backup_fronteira_cutelaria_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Import JSON file and update both local and cloud
   */
  public static async importBackupFile(fileContent: string): Promise<{ success: boolean; salesCount: number; error?: string }> {
    try {
      const parsed = JSON.parse(fileContent) as FullCutelariaDatabase;
      if (!parsed || !Array.isArray(parsed.sales)) {
        throw new Error('Arquivo de backup inválido ou formato incorreto.');
      }

      this.applyPayloadLocally(parsed, true);
      await this.pushLocalToCloud();

      return { success: true, salesCount: parsed.sales.length };
    } catch (err: any) {
      return { success: false, salesCount: 0, error: err.message || 'Erro ao processar arquivo' };
    }
  }
}
