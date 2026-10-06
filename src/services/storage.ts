import {
  Sale,
  Expense,
  Product,
  Customer,
  Supplier,
  MonthlyGoal,
  ClosedPeriod,
  UserProfile,
  UserRole,
  SaleCategory,
  GorduraUsage,
  DailyRegisterRecord,
} from '../types';

const STORAGE_KEYS = {
  SALES: 'fronteira_sales_v4',
  EXPENSES: 'fronteira_expenses_v4',
  PRODUCTS: 'fronteira_products_v4',
  CUSTOMERS: 'fronteira_customers_v4',
  SUPPLIERS: 'fronteira_suppliers_v4',
  GOALS: 'fronteira_goals_v4',
  CLOSED_PERIODS: 'fronteira_closed_periods_v4',
  GORDURA_USAGES: 'fronteira_gordura_usages_v4',
  DAILY_REGISTERS: 'fronteira_daily_registers_v4',
  ACTIVE_ROLE: 'fronteira_active_role_v4',
  NOTIFICATIONS_ENABLED: 'fronteira_notifications_enabled_v4',
};

// Initial Seed Data tailored strictly for Fronteira Cutelaria
const INITIAL_GOALS: MonthlyGoal[] = [
  { id: 'goal-2026-10', monthKey: '2026-10', targetAmount: 15000, updatedAt: Date.now() },
];

const INITIAL_CLOSED_PERIODS: ClosedPeriod[] = [];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-faca',
    name: 'Faca Artesanal',
    code: 'FC-101',
    category: 'facas',
    costPrice: 90,
    sellingPrice: 220,
    stock: 18,
    minStock: 3,
    isService: false,
  },
  {
    id: 'prod-copo',
    name: 'Copo Térmico Personalizado',
    code: 'CP-301',
    category: 'copos',
    costPrice: 25,
    sellingPrice: 59.90,
    stock: 24,
    minStock: 5,
    isService: false,
  },
  {
    id: 'prod-afiacao',
    name: 'Serviço de Afiação',
    code: 'SRV-01',
    category: 'servicos',
    costPrice: 10,
    sellingPrice: 125,
    stock: 999,
    minStock: 0,
    isService: true,
  },
  {
    id: 'prod-rest',
    name: 'Serviço de Restauração',
    code: 'SRV-02',
    category: 'servicos',
    costPrice: 20,
    sellingPrice: 100,
    stock: 999,
    minStock: 0,
    isService: true,
  },
  {
    id: 'prod-other',
    name: 'Outro Item / Acessório',
    code: 'ACS-01',
    category: 'outros',
    costPrice: 10,
    sellingPrice: 25,
    stock: 35,
    minStock: 5,
    isService: false,
  },
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Cliente Balcão',
    phone: '(55) 99999-0000',
    notes: 'Atendimento direto na cutelaria',
    createdAt: Date.now() - 30 * 86400000,
  },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'supp-1',
    name: 'Fornecedor Aços & Materiais',
    phone: '(54) 99999-1111',
    notes: 'Insumos e abrasivos para cutelaria',
    createdAt: Date.now() - 30 * 86400000,
  },
];

// OFFICIAL SALES FOR FRONTEIRA CUTELARIA (Exactly 16 sales = R$ 2.852,80)
const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-05-1',
    code: 'VND-1016',
    date: '2026-10-05',
    time: '18:40',
    monthKey: '2026-10',
    category: 'outro',
    productName: 'Outro Item / Acessório',
    quantity: 1,
    unitPrice: 25.00,
    totalAmount: 25.00,
    paymentMethod: 'credito',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-05T18:40:00-03:00').getTime(),
  },
  {
    id: 'sale-05-2',
    code: 'VND-1015',
    date: '2026-10-05',
    time: '16:15',
    monthKey: '2026-10',
    category: 'faca',
    productName: 'Faca Artesanal',
    quantity: 2,
    unitPrice: 220.00,
    totalAmount: 440.00,
    paymentMethod: 'pix',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-05T16:15:00-03:00').getTime(),
  },
  {
    id: 'sale-05-3',
    code: 'VND-1014',
    date: '2026-10-05',
    time: '11:20',
    monthKey: '2026-10',
    category: 'outro',
    productName: 'Outro Item / Acessório',
    quantity: 1,
    unitPrice: 20.00,
    totalAmount: 20.00,
    paymentMethod: 'dinheiro',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-05T11:20:00-03:00').getTime(),
  },
  {
    id: 'sale-03-1',
    code: 'VND-1013',
    date: '2026-10-03',
    time: '17:30',
    monthKey: '2026-10',
    category: 'restauracao',
    productName: 'Serviço de Restauração',
    quantity: 1,
    unitPrice: 100.00,
    totalAmount: 100.00,
    paymentMethod: 'pix',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-03T17:30:00-03:00').getTime(),
  },
  {
    id: 'sale-03-2',
    code: 'VND-1012',
    date: '2026-10-03',
    time: '16:45',
    monthKey: '2026-10',
    category: 'faca',
    productName: 'Faca Artesanal',
    quantity: 1,
    unitPrice: 149.90,
    totalAmount: 149.90,
    paymentMethod: 'debito',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-03T16:45:00-03:00').getTime(),
  },
  {
    id: 'sale-03-3',
    code: 'VND-1011',
    date: '2026-10-03',
    time: '15:20',
    monthKey: '2026-10',
    category: 'restauracao',
    productName: 'Serviço de Restauração',
    quantity: 1,
    unitPrice: 100.00,
    totalAmount: 100.00,
    paymentMethod: 'debito',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-03T15:20:00-03:00').getTime(),
  },
  {
    id: 'sale-03-4',
    code: 'VND-1010',
    date: '2026-10-03',
    time: '14:30',
    monthKey: '2026-10',
    category: 'faca',
    productName: 'Faca Artesanal',
    quantity: 1,
    unitPrice: 320.00,
    totalAmount: 320.00,
    paymentMethod: 'pix',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-03T14:30:00-03:00').getTime(),
  },
  {
    id: 'sale-03-5',
    code: 'VND-1009',
    date: '2026-10-03',
    time: '13:50',
    monthKey: '2026-10',
    category: 'faca',
    productName: 'Faca Artesanal',
    quantity: 1,
    unitPrice: 350.00,
    totalAmount: 350.00,
    paymentMethod: 'credito',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-03T13:50:00-03:00').getTime(),
  },
  {
    id: 'sale-03-6',
    code: 'VND-1008',
    date: '2026-10-03',
    time: '12:15',
    monthKey: '2026-10',
    category: 'copo',
    productName: 'Copo Térmico Personalizado',
    quantity: 1,
    unitPrice: 59.90,
    totalAmount: 59.90,
    paymentMethod: 'debito',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-03T12:15:00-03:00').getTime(),
  },
  {
    id: 'sale-03-7',
    code: 'VND-1007',
    date: '2026-10-03',
    time: '11:40',
    monthKey: '2026-10',
    category: 'outro',
    productName: 'Outro Item / Acessório',
    quantity: 1,
    unitPrice: 25.00,
    totalAmount: 25.00,
    paymentMethod: 'debito',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-03T11:40:00-03:00').getTime(),
  },
  {
    id: 'sale-03-8',
    code: 'VND-1006',
    date: '2026-10-03',
    time: '10:10',
    monthKey: '2026-10',
    category: 'afiacao',
    productName: 'Serviço de Afiação',
    quantity: 1,
    unitPrice: 125.00,
    totalAmount: 125.00,
    paymentMethod: 'debito',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-03T10:10:00-03:00').getTime(),
  },
  {
    id: 'sale-02-1',
    code: 'VND-1005',
    date: '2026-10-02',
    time: '17:20',
    monthKey: '2026-10',
    category: 'faca',
    productName: 'Faca Artesanal',
    quantity: 1,
    unitPrice: 250.00,
    totalAmount: 250.00,
    paymentMethod: 'pix',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-02T17:20:00-03:00').getTime(),
  },
  {
    id: 'sale-02-2',
    code: 'VND-1004',
    date: '2026-10-02',
    time: '14:45',
    monthKey: '2026-10',
    category: 'faca',
    productName: 'Faca Artesanal',
    quantity: 1,
    unitPrice: 270.00,
    totalAmount: 270.00,
    paymentMethod: 'pix',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-02T14:45:00-03:00').getTime(),
  },
  {
    id: 'sale-01-1',
    code: 'VND-1003',
    date: '2026-10-01',
    time: '16:50',
    monthKey: '2026-10',
    category: 'faca',
    productName: 'Faca Artesanal',
    quantity: 1,
    unitPrice: 249.00,
    totalAmount: 249.00,
    paymentMethod: 'pix',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-01T16:50:00-03:00').getTime(),
  },
  {
    id: 'sale-01-2',
    code: 'VND-1002',
    date: '2026-10-01',
    time: '15:10',
    monthKey: '2026-10',
    category: 'faca',
    productName: 'Faca Artesanal',
    quantity: 1,
    unitPrice: 149.00,
    totalAmount: 149.00,
    paymentMethod: 'pix',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-01T15:10:00-03:00').getTime(),
  },
  {
    id: 'sale-01-3',
    code: 'VND-1001',
    date: '2026-10-01',
    time: '11:30',
    monthKey: '2026-10',
    category: 'faca',
    productName: 'Faca Artesanal',
    quantity: 1,
    unitPrice: 220.00,
    totalAmount: 220.00,
    paymentMethod: 'pix',
    customerName: 'Cliente Balcão',
    sellerName: 'Fronteira Cutelaria',
    createdAt: new Date('2026-10-01T11:30:00-03:00').getTime(),
  },
];

// OFFICIAL EXPENSES FOR FRONTEIRA CUTELARIA (Exactly 9 expenses = R$ 1.852,00)
const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-05-1',
    date: '2026-10-05',
    time: '17:15',
    monthKey: '2026-10',
    category: 'outro',
    description: 'farmácia',
    amount: 68.00,
    paymentMethod: 'pix',
    createdAt: new Date('2026-10-05T17:15:00-03:00').getTime(),
  },
  {
    id: 'exp-05-2',
    date: '2026-10-05',
    time: '12:30',
    monthKey: '2026-10',
    category: 'outro',
    description: 'mercado',
    amount: 310.00,
    paymentMethod: 'pix',
    createdAt: new Date('2026-10-05T12:30:00-03:00').getTime(),
  },
  {
    id: 'exp-03-1',
    date: '2026-10-03',
    time: '18:10',
    monthKey: '2026-10',
    category: 'outro',
    description: 'Despesa operacional',
    amount: 100.00,
    paymentMethod: 'pix',
    createdAt: new Date('2026-10-03T18:10:00-03:00').getTime(),
  },
  {
    id: 'exp-03-2',
    date: '2026-10-03',
    time: '16:00',
    monthKey: '2026-10',
    category: 'outro',
    description: 'mercado',
    amount: 720.00,
    paymentMethod: 'pix',
    createdAt: new Date('2026-10-03T16:00:00-03:00').getTime(),
  },
  {
    id: 'exp-03-3',
    date: '2026-10-03',
    time: '14:20',
    monthKey: '2026-10',
    category: 'outro',
    description: 'Despesa operacional',
    amount: 50.00,
    paymentMethod: 'pix',
    createdAt: new Date('2026-10-03T14:20:00-03:00').getTime(),
  },
  {
    id: 'exp-03-4',
    date: '2026-10-03',
    time: '11:15',
    monthKey: '2026-10',
    category: 'outro',
    description: 'Despesa operacional',
    amount: 300.00,
    paymentMethod: 'pix',
    createdAt: new Date('2026-10-03T11:15:00-03:00').getTime(),
  },
  {
    id: 'exp-03-5',
    date: '2026-10-03',
    time: '09:30',
    monthKey: '2026-10',
    category: 'contas',
    description: 'Energia trifásica / Água / Internet',
    amount: 100.00,
    paymentMethod: 'pix',
    createdAt: new Date('2026-10-03T09:30:00-03:00').getTime(),
  },
  {
    id: 'exp-02-1',
    date: '2026-10-02',
    time: '10:00',
    monthKey: '2026-10',
    category: 'material',
    description: 'Lixas, resinas e abrasivos',
    amount: 150.00,
    paymentMethod: 'pix',
    createdAt: new Date('2026-10-02T10:00:00-03:00').getTime(),
  },
  {
    id: 'exp-01-1',
    date: '2026-10-01',
    time: '08:45',
    monthKey: '2026-10',
    category: 'outro',
    description: 'Copos',
    amount: 54.00,
    paymentMethod: 'pix',
    createdAt: new Date('2026-10-01T08:45:00-03:00').getTime(),
  },
];

const INITIAL_GORDURA_USAGES: GorduraUsage[] = [
  {
    id: 'gordura-usage-1',
    date: '2026-10-04',
    amount: 26.87,
    monthKey: '2026-10',
    reason: 'Resgate para completar meta diária',
    createdAt: new Date('2026-10-04T18:00:00-03:00').getTime(),
  },
];

class MemoryStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

const safeStorage: Storage | MemoryStorage =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
    ? window.localStorage
    : typeof localStorage !== 'undefined'
    ? localStorage
    : new MemoryStorage();

type StorageListener = () => void;

class AppStorage {
  private listeners: Set<StorageListener> = new Set();
  private syncTimeout: any = null;
  private isSyncing: boolean = false;
  private lastSyncedAt: number | null = null;
  private syncStatus: 'idle' | 'syncing' | 'synced' | 'error' = 'idle';

  public subscribe(listener: StorageListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('Listener error', err);
      }
    });

    // Auto-sync debounced changes to server so all link visitors see the updated database
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }
    this.syncTimeout = setTimeout(() => {
      this.pushToServer().catch((err) => console.warn('Background sync error:', err));
    }, 600);
  }

  public getSyncStatus() {
    return {
      status: this.syncStatus,
      lastSyncedAt: this.lastSyncedAt,
      isSyncing: this.isSyncing,
    };
  }

  public async syncWithServer(): Promise<{ success: boolean; source: 'server' | 'local' }> {
    if (typeof window === 'undefined') return { success: false, source: 'local' };
    if (this.isSyncing) return { success: false, source: 'local' };
    this.isSyncing = true;
    this.syncStatus = 'syncing';

    try {
      const res = await fetch('/api/data');
      if (!res.ok) {
        this.syncStatus = 'error';
        this.isSyncing = false;
        return { success: false, source: 'local' };
      }

      const json = await res.json();
      if (json.initialized && json.data) {
        const remote = json.data;
        if (Array.isArray(remote.sales)) safeStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(remote.sales));
        if (Array.isArray(remote.expenses)) safeStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(remote.expenses));
        if (Array.isArray(remote.products)) safeStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(remote.products));
        if (Array.isArray(remote.customers)) safeStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(remote.customers));
        if (Array.isArray(remote.suppliers)) safeStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(remote.suppliers));
        if (Array.isArray(remote.goals)) safeStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(remote.goals));
        if (Array.isArray(remote.closedPeriods)) safeStorage.setItem(STORAGE_KEYS.CLOSED_PERIODS, JSON.stringify(remote.closedPeriods));
        if (Array.isArray(remote.gorduraUsages)) safeStorage.setItem(STORAGE_KEYS.GORDURA_USAGES, JSON.stringify(remote.gorduraUsages));
        if (Array.isArray(remote.dailyRegisters)) safeStorage.setItem(STORAGE_KEYS.DAILY_REGISTERS, JSON.stringify(remote.dailyRegisters));

        this.lastSyncedAt = Date.now();
        this.syncStatus = 'synced';
        this.isSyncing = false;
        this.notifyListenersOnly();
        return { success: true, source: 'server' };
      } else {
        // Server database is empty or new. Seed it with the user's data!
        await this.pushToServer();
        this.lastSyncedAt = Date.now();
        this.syncStatus = 'synced';
        this.isSyncing = false;
        return { success: true, source: 'local' };
      }
    } catch (err) {
      console.warn('Sync with server failed, using local offline storage:', err);
      this.syncStatus = 'error';
      this.isSyncing = false;
      return { success: false, source: 'local' };
    }
  }

  public async pushToServer(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      const payload = this.exportAllData();
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        this.lastSyncedAt = Date.now();
        this.syncStatus = 'synced';
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Push to server failed:', err);
      return false;
    }
  }

  private notifyListenersOnly() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('Listener error', err);
      }
    });
  }

  // --- GETTERS ---
  public getSales(): Sale[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.SALES);
    if (!raw) {
      this.setSales(INITIAL_SALES);
      return INITIAL_SALES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      this.setSales(INITIAL_SALES);
      return INITIAL_SALES;
    }
  }

  public getExpenses(): Expense[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!raw) {
      this.setExpenses(INITIAL_EXPENSES);
      return INITIAL_EXPENSES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      this.setExpenses(INITIAL_EXPENSES);
      return INITIAL_EXPENSES;
    }
  }

  public getProducts(): Product[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      this.setProducts(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public getCustomers(): Customer[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!raw) {
      this.setCustomers(INITIAL_CUSTOMERS);
      return INITIAL_CUSTOMERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public getSuppliers(): Supplier[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    if (!raw) {
      this.setSuppliers(INITIAL_SUPPLIERS);
      return INITIAL_SUPPLIERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public getGoals(): MonthlyGoal[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) {
      this.setGoals(INITIAL_GOALS);
      return INITIAL_GOALS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public getGoalForMonth(monthKey: string): number {
    const goals = this.getGoals();
    const found = goals.find((g) => g.monthKey === monthKey);
    return found ? found.targetAmount : 15000;
  }

  public getClosedPeriods(): ClosedPeriod[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.CLOSED_PERIODS);
    if (!raw) {
      this.setClosedPeriods(INITIAL_CLOSED_PERIODS);
      return INITIAL_CLOSED_PERIODS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public getGorduraUsages(): GorduraUsage[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.GORDURA_USAGES);
    if (!raw) {
      this.setGorduraUsages(INITIAL_GORDURA_USAGES);
      return INITIAL_GORDURA_USAGES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public getUserRole(): UserRole {
    const raw = safeStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
    return (raw as UserRole) || 'admin';
  }

  public isNotificationsEnabled(): boolean {
    const raw = safeStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
    return raw === 'true';
  }

  // --- SETTERS / ACTIONS ---
  public setSales(sales: Sale[]) {
    safeStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    this.notify();
  }

  public setExpenses(expenses: Expense[]) {
    safeStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    this.notify();
  }

  public setGorduraUsages(usages: GorduraUsage[]) {
    safeStorage.setItem(STORAGE_KEYS.GORDURA_USAGES, JSON.stringify(usages));
    this.notify();
  }

  public setProducts(products: Product[]) {
    safeStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.notify();
  }

  public setCustomers(customers: Customer[]) {
    safeStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    this.notify();
  }

  public setSuppliers(suppliers: Supplier[]) {
    safeStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
    this.notify();
  }

  public setGoals(goals: MonthlyGoal[]) {
    safeStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    this.notify();
  }

  public setClosedPeriods(periods: ClosedPeriod[]) {
    safeStorage.setItem(STORAGE_KEYS.CLOSED_PERIODS, JSON.stringify(periods));
    this.notify();
  }

  public setUserRole(role: UserRole) {
    safeStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
    this.notify();
  }

  public setNotificationsEnabled(enabled: boolean) {
    safeStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, enabled ? 'true' : 'false');
    this.notify();
  }

  // --- ENTITY HELPERS ---
  public addSale(saleData: Omit<Sale, 'id' | 'createdAt'>): Sale {
    const sales = this.getSales();
    const newSale: Sale = {
      ...saleData,
      id: `sale-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };

    if (saleData.productId) {
      const products = this.getProducts();
      const prodIndex = products.findIndex((p) => p.id === saleData.productId);
      if (prodIndex >= 0 && !products[prodIndex].isService) {
        products[prodIndex].stock = Math.max(0, products[prodIndex].stock - (saleData.quantity || 1));
        this.setProducts(products);
      }
    }

    if (saleData.customerName && saleData.customerName.trim()) {
      const customers = this.getCustomers();
      const existing = customers.find((c) => c.name.toLowerCase() === saleData.customerName?.toLowerCase());
      if (!existing && saleData.customerName.trim().length >= 2) {
        this.addCustomer({
          name: saleData.customerName.trim(),
          phone: saleData.customerPhone || '',
          notes: `Cadastrado via venda em ${saleData.date}`,
        });
      }
    }

    sales.unshift(newSale);
    this.setSales(sales);
    return newSale;
  }

  public deleteSale(id: string) {
    const sales = this.getSales().filter((s) => s.id !== id);
    this.setSales(sales);
  }

  public addExpense(expenseData: Omit<Expense, 'id' | 'createdAt'>): Expense {
    const expenses = this.getExpenses();
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };

    expenses.unshift(newExpense);
    this.setExpenses(expenses);
    return newExpense;
  }

  public deleteExpense(id: string) {
    const expenses = this.getExpenses().filter((e) => e.id !== id);
    this.setExpenses(expenses);
  }

  public saveGoal(monthKey: string, targetAmount: number) {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.monthKey === monthKey);
    if (index >= 0) {
      goals[index] = { ...goals[index], targetAmount, updatedAt: Date.now() };
    } else {
      goals.push({
        id: `goal-${monthKey}`,
        monthKey,
        targetAmount,
        updatedAt: Date.now(),
      });
    }
    this.setGoals(goals);
  }

  public addClosedPeriod(period: Omit<ClosedPeriod, 'id' | 'monthKeys'>) {
    const periods = this.getClosedPeriods();
    const startMonth = period.startDate.substring(0, 7);
    const endMonth = period.endDate.substring(0, 7);
    const monthKeys = startMonth === endMonth ? [startMonth] : [startMonth, endMonth];

    const newPeriod: ClosedPeriod = {
      ...period,
      id: `closed-${Date.now()}`,
      monthKeys,
    };
    periods.push(newPeriod);
    this.setClosedPeriods(periods);
    return newPeriod;
  }

  public deleteClosedPeriod(id: string) {
    const periods = this.getClosedPeriods().filter((p) => p.id !== id);
    this.setClosedPeriods(periods);
  }

  public addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    products.push(newProduct);
    this.setProducts(products);
    return newProduct;
  }

  public deleteProduct(id: string) {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.setProducts(products);
  }

  public addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Customer {
    const customers = this.getCustomers();
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      createdAt: Date.now(),
    };
    customers.push(newCustomer);
    this.setCustomers(customers);
    return newCustomer;
  }

  public deleteCustomer(id: string) {
    const customers = this.getCustomers().filter((c) => c.id !== id);
    this.setCustomers(customers);
  }

  public addSupplier(supplier: Omit<Supplier, 'id' | 'createdAt'>): Supplier {
    const suppliers = this.getSuppliers();
    const newSupplier: Supplier = {
      ...supplier,
      id: `supp-${Date.now()}`,
      createdAt: Date.now(),
    };
    suppliers.push(newSupplier);
    this.setSuppliers(suppliers);
    return newSupplier;
  }

  public deleteSupplier(id: string) {
    const suppliers = this.getSuppliers().filter((s) => s.id !== id);
    this.setSuppliers(suppliers);
  }

  public addGorduraUsage(usage: Omit<GorduraUsage, 'id' | 'createdAt'>): GorduraUsage {
    const usages = this.getGorduraUsages();
    const newUsage: GorduraUsage = {
      ...usage,
      id: `gordura-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };
    usages.unshift(newUsage);
    this.setGorduraUsages(usages);
    return newUsage;
  }

  public deleteGorduraUsage(id: string) {
    const usages = this.getGorduraUsages().filter((u) => u.id !== id);
    this.setGorduraUsages(usages);
  }

  public getDailyRegisters(): DailyRegisterRecord[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.DAILY_REGISTERS);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public setDailyRegisters(registers: DailyRegisterRecord[]) {
    safeStorage.setItem(STORAGE_KEYS.DAILY_REGISTERS, JSON.stringify(registers));
    this.notify();
  }

  public getDailyRegisterForDate(date: string): DailyRegisterRecord | undefined {
    const registers = this.getDailyRegisters();
    return registers.find((r) => r.date === date);
  }

  public saveDailyRegister(record: DailyRegisterRecord): void {
    const registers = this.getDailyRegisters();
    const index = registers.findIndex((r) => r.date === record.date);
    if (index >= 0) {
      registers[index] = { ...record, updatedAt: Date.now() };
    } else {
      registers.unshift({ ...record, updatedAt: Date.now() });
    }
    this.setDailyRegisters(registers);
  }

  public closeDailyRegister(
    date: string,
    closedBy: string = 'Operador',
    isAutoClosed: boolean = false,
    summary: {
      salesTotal: number;
      salesCount: number;
      expensesTotal: number;
      expensesCount: number;
      resultTotal: number;
      dailyTarget: number;
      isDailyTargetMet: boolean;
      notes?: string;
    }
  ): DailyRegisterRecord {
    const monthKey = date.substring(0, 7);
    const existing = this.getDailyRegisterForDate(date);
    const record: DailyRegisterRecord = {
      id: existing?.id || `reg-${date}`,
      date,
      monthKey,
      status: 'fechado',
      openedAt: existing?.openedAt || Date.now(),
      closedAt: Date.now(),
      closedBy,
      isAutoClosed,
      salesTotal: summary.salesTotal,
      salesCount: summary.salesCount,
      expensesTotal: summary.expensesTotal,
      expensesCount: summary.expensesCount,
      resultTotal: summary.resultTotal,
      dailyTarget: summary.dailyTarget,
      isDailyTargetMet: summary.isDailyTargetMet,
      notes: summary.notes,
      updatedAt: Date.now(),
    };
    this.saveDailyRegister(record);
    return record;
  }

  public reopenDailyRegister(date: string): void {
    const existing = this.getDailyRegisterForDate(date);
    if (existing) {
      existing.status = 'aberto';
      existing.closedAt = undefined;
      existing.isAutoClosed = false;
      existing.updatedAt = Date.now();
      this.saveDailyRegister(existing);
    }
  }

  public clearGorduraUsages() {
    this.setGorduraUsages([]);
  }

  public resetToZeroed() {
    this.setSales([]);
    this.setExpenses([]);
    this.setGorduraUsages([]);
    this.setDailyRegisters([]);
    this.setClosedPeriods([]);
    this.setProducts(INITIAL_PRODUCTS);
    this.setCustomers([]);
    this.setSuppliers([]);
    this.setGoals(INITIAL_GOALS);
    this.setUserRole('admin');
    this.notify();
  }

  public exportAllData() {
    return {
      sales: this.getSales(),
      expenses: this.getExpenses(),
      products: this.getProducts(),
      customers: this.getCustomers(),
      suppliers: this.getSuppliers(),
      goals: this.getGoals(),
      closedPeriods: this.getClosedPeriods(),
      gorduraUsages: this.getGorduraUsages(),
      dailyRegisters: this.getDailyRegisters(),
      exportedAt: new Date().toISOString(),
      version: '4.0',
    };
  }

  public downloadBackupJSON() {
    const data = this.exportAllData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `backup_fronteira_cutelaria_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public async importBackupJSON(jsonStr: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.sales)) safeStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(parsed.sales));
      if (Array.isArray(parsed.expenses)) safeStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(parsed.expenses));
      if (Array.isArray(parsed.products)) safeStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(parsed.products));
      if (Array.isArray(parsed.customers)) safeStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(parsed.customers));
      if (Array.isArray(parsed.suppliers)) safeStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(parsed.suppliers));
      if (Array.isArray(parsed.goals)) safeStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(parsed.goals));
      if (Array.isArray(parsed.closedPeriods)) safeStorage.setItem(STORAGE_KEYS.CLOSED_PERIODS, JSON.stringify(parsed.closedPeriods));
      if (Array.isArray(parsed.gorduraUsages)) safeStorage.setItem(STORAGE_KEYS.GORDURA_USAGES, JSON.stringify(parsed.gorduraUsages));
      if (Array.isArray(parsed.dailyRegisters)) safeStorage.setItem(STORAGE_KEYS.DAILY_REGISTERS, JSON.stringify(parsed.dailyRegisters));

      this.notify();
      await this.pushToServer();
      return true;
    } catch (err) {
      console.error('Failed to import backup JSON:', err);
      return false;
    }
  }

  public resetToDefaultDemoData() {
    safeStorage.clear();
    this.setSales(INITIAL_SALES);
    this.setExpenses(INITIAL_EXPENSES);
    this.setGorduraUsages(INITIAL_GORDURA_USAGES);
    this.setDailyRegisters([]);
    this.setProducts(INITIAL_PRODUCTS);
    this.setCustomers(INITIAL_CUSTOMERS);
    this.setSuppliers(INITIAL_SUPPLIERS);
    this.setGoals(INITIAL_GOALS);
    this.setClosedPeriods(INITIAL_CLOSED_PERIODS);
    this.setUserRole('admin');
    this.notify();
  }
}

export const appStorage = new AppStorage();
