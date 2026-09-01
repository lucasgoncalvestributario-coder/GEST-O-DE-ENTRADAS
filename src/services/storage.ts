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
} from '../types';

const STORAGE_KEYS = {
  SALES: 'fronteira_sales_v3',
  EXPENSES: 'fronteira_expenses_v3',
  PRODUCTS: 'fronteira_products_v3',
  CUSTOMERS: 'fronteira_customers_v3',
  SUPPLIERS: 'fronteira_suppliers_v3',
  GOALS: 'fronteira_goals_v3',
  CLOSED_PERIODS: 'fronteira_closed_periods_v3',
  GORDURA_USAGES: 'fronteira_gordura_usages_v3',
  ACTIVE_ROLE: 'fronteira_active_role_v3',
  NOTIFICATIONS_ENABLED: 'fronteira_notifications_enabled_v3',
};

// Initial Seed Data tailored for Fronteira Cutelaria
const INITIAL_GOALS: MonthlyGoal[] = [
  { id: 'goal-2026-08', monthKey: '2026-08', targetAmount: 20000, updatedAt: Date.now() },
  { id: 'goal-2026-09', monthKey: '2026-09', targetAmount: 25000, updatedAt: Date.now() },
  { id: 'goal-2026-10', monthKey: '2026-10', targetAmount: 30000, updatedAt: Date.now() },
];

const INITIAL_CLOSED_PERIODS: ClosedPeriod[] = [
  {
    id: 'closed-farroupilha',
    name: 'Evento da Farroupilha',
    startDate: '2026-09-02',
    endDate: '2026-09-06',
    reason: 'evento',
    notes: 'Acampamento e celebração da Semana Farroupilha',
    monthKeys: ['2026-09'],
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Faca Gaúcha 8" Aço 1070 Fosfatizada',
    code: 'FC-101',
    category: 'facas',
    costPrice: 120,
    sellingPrice: 380,
    stock: 6,
    minStock: 3,
    isService: false,
  },
  {
    id: 'prod-2',
    name: 'Faca Campeira 10" Damasco Padrão Chuva',
    code: 'FC-102',
    category: 'facas',
    costPrice: 380,
    sellingPrice: 1250,
    stock: 2,
    minStock: 2,
    isService: false,
  },
  {
    id: 'prod-3',
    name: 'Faca Picanheira 7" Cabo de Imbuia e Osso',
    code: 'FC-103',
    category: 'facas',
    costPrice: 95,
    sellingPrice: 290,
    stock: 8,
    minStock: 4,
    isService: false,
  },
  {
    id: 'prod-4',
    name: 'Tábua Rústica em Muiracatiara Nobre 50x30cm',
    code: 'TB-201',
    category: 'tabuas',
    costPrice: 70,
    sellingPrice: 220,
    stock: 5,
    minStock: 3,
    isService: false,
  },
  {
    id: 'prod-5',
    name: 'Tábua de Corte com Canaleta e Resina Bronze',
    code: 'TB-202',
    category: 'tabuas',
    costPrice: 110,
    sellingPrice: 340,
    stock: 1, // low stock alert!
    minStock: 3,
    isService: false,
  },
  {
    id: 'prod-6',
    name: 'Copo Térmico 473ml Personalizado a Laser',
    code: 'CP-301',
    category: 'copos',
    costPrice: 45,
    sellingPrice: 135,
    stock: 12,
    minStock: 5,
    isService: false,
  },
  {
    id: 'prod-7',
    name: 'Afiação Artesanal em Pedras Japonesas Naniwa',
    code: 'SRV-01',
    category: 'servicos',
    costPrice: 5,
    sellingPrice: 45,
    stock: 999,
    minStock: 0,
    isService: true,
  },
  {
    id: 'prod-8',
    name: 'Restauração Completa de Faca Antiga com Cabo Novo',
    code: 'SRV-02',
    category: 'servicos',
    costPrice: 35,
    sellingPrice: 180,
    stock: 999,
    minStock: 0,
    isService: true,
  },
  {
    id: 'prod-9',
    name: 'Polimento Espelhado e Rejuvenescimento de Lâmina',
    code: 'SRV-03',
    category: 'servicos',
    costPrice: 15,
    sellingPrice: 90,
    stock: 999,
    minStock: 0,
    isService: true,
  },
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Dr. Rodrigo Silveira',
    phone: '(51) 99882-1200',
    birthDate: '1982-05-14',
    notes: 'Colecionador de peças em damasco',
    createdAt: Date.now() - 40 * 86400000,
  },
  {
    id: 'cust-2',
    name: 'Marcelo Guimarães (Rancho do Gaúcho)',
    phone: '(51) 99341-8890',
    birthDate: '1979-11-20',
    notes: 'Compra lotes de copos térmicos e facas para eventos',
    createdAt: Date.now() - 30 * 86400000,
  },
  {
    id: 'cust-3',
    name: 'Eduardo Fontoura',
    phone: '(55) 98112-4433',
    birthDate: '1990-08-04',
    notes: 'Cliente frequente de afiações e restaurações',
    createdAt: Date.now() - 20 * 86400000,
  },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'supp-1',
    name: 'Aços Villares & Forja Especial',
    phone: '(11) 3211-9000',
    cnpjCpf: '12.345.678/0001-90',
    notes: 'Barras de aço carbono 1070, 5160 e 15N20',
    createdAt: Date.now() - 60 * 86400000,
  },
  {
    id: 'supp-2',
    name: 'Madeiras Nobres & Cabos RS',
    phone: '(54) 99120-7766',
    cnpjCpf: '98.765.432/0001-11',
    notes: 'Blocos de imbuia, jacarandá e guajuvira',
    createdAt: Date.now() - 60 * 86400000,
  },
  {
    id: 'supp-3',
    name: 'Deerfos Cintas Abrasivas Brasil',
    phone: '(47) 3344-5500',
    cnpjCpf: '45.678.901/0001-22',
    notes: 'Lixas cerâmicas grãos 36, 60, 120, 220, 400',
    createdAt: Date.now() - 60 * 86400000,
  },
];

// Seed sales for July 2026 (past comparison month = R$ 17.500)
const JULY_SALES: Sale[] = [
  {
    id: 'jul-sale-1',
    date: '2026-07-08',
    monthKey: '2026-07',
    category: 'faca',
    productName: 'Faca Gaúcha 8"',
    quantity: 15,
    unitPrice: 380,
    totalAmount: 5700,
    paymentMethod: 'pix',
    createdAt: new Date('2026-07-08T14:20:00').getTime(),
  },
  {
    id: 'jul-sale-2',
    date: '2026-07-16',
    monthKey: '2026-07',
    category: 'faca',
    productName: 'Faca Damasco Exclusiva',
    quantity: 5,
    unitPrice: 1250,
    totalAmount: 6250,
    paymentMethod: 'credito',
    createdAt: new Date('2026-07-16T17:10:00').getTime(),
  },
  {
    id: 'jul-sale-3',
    date: '2026-07-22',
    monthKey: '2026-07',
    category: 'tabua',
    productName: 'Tábuas Nobres',
    quantity: 10,
    unitPrice: 340,
    totalAmount: 3400,
    paymentMethod: 'pix',
    createdAt: new Date('2026-07-22T11:00:00').getTime(),
  },
  {
    id: 'jul-sale-4',
    date: '2026-07-28',
    monthKey: '2026-07',
    category: 'afiacao',
    productName: 'Afiação em Lote',
    quantity: 48,
    unitPrice: 45,
    totalAmount: 2150,
    paymentMethod: 'dinheiro',
    createdAt: new Date('2026-07-28T16:45:00').getTime(),
  },
];

// Seed sales for August 2026 (matching prompt example R$ 12.450,00 so far)
const AUGUST_SALES: Sale[] = [
  {
    id: 'aug-sale-1',
    date: '2026-08-02',
    monthKey: '2026-08',
    category: 'faca',
    productId: 'prod-1',
    productName: 'Faca Gaúcha 8" Aço 1070',
    quantity: 3,
    unitPrice: 380,
    totalAmount: 1140,
    paymentMethod: 'pix',
    customerName: 'Dr. Rodrigo Silveira',
    createdAt: new Date('2026-08-02T10:15:00').getTime(),
  },
  {
    id: 'aug-sale-2',
    date: '2026-08-05',
    monthKey: '2026-08',
    category: 'faca',
    productId: 'prod-2',
    productName: 'Faca Campeira Damasco',
    quantity: 2,
    unitPrice: 1250,
    totalAmount: 2500,
    paymentMethod: 'credito',
    customerName: 'Marcelo Guimarães',
    createdAt: new Date('2026-08-05T15:30:00').getTime(),
  },
  {
    id: 'aug-sale-3',
    date: '2026-08-09',
    monthKey: '2026-08',
    category: 'tabua',
    productId: 'prod-4',
    productName: 'Tábua Rústica Muiracatiara',
    quantity: 4,
    unitPrice: 220,
    totalAmount: 880,
    paymentMethod: 'pix',
    createdAt: new Date('2026-08-09T11:45:00').getTime(),
  },
  {
    id: 'aug-sale-4',
    date: '2026-08-11',
    monthKey: '2026-08',
    category: 'faca',
    productId: 'prod-3',
    productName: 'Faca Picanheira 7"',
    quantity: 4,
    unitPrice: 290,
    totalAmount: 1160,
    paymentMethod: 'debito',
    createdAt: new Date('2026-08-11T16:00:00').getTime(),
  },
  {
    id: 'aug-sale-5',
    date: '2026-08-19',
    monthKey: '2026-08',
    category: 'copo',
    productId: 'prod-6',
    productName: 'Copo Térmico Personalizado',
    quantity: 10,
    unitPrice: 135,
    totalAmount: 1350,
    paymentMethod: 'pix',
    customerName: 'Rancho do Gaúcho',
    createdAt: new Date('2026-08-19T14:10:00').getTime(),
  },
  {
    id: 'aug-sale-6',
    date: '2026-08-22',
    monthKey: '2026-08',
    category: 'afiacao',
    productId: 'prod-7',
    productName: 'Afiação Artesanal',
    quantity: 12,
    unitPrice: 45,
    totalAmount: 540,
    paymentMethod: 'dinheiro',
    createdAt: new Date('2026-08-22T17:20:00').getTime(),
  },
  {
    id: 'aug-sale-7',
    date: '2026-08-25',
    monthKey: '2026-08',
    category: 'restauracao',
    productId: 'prod-8',
    productName: 'Restauração de Faca Antiga',
    quantity: 3,
    unitPrice: 180,
    totalAmount: 540,
    paymentMethod: 'pix',
    createdAt: new Date('2026-08-25T11:00:00').getTime(),
  },
  {
    id: 'aug-sale-8',
    date: '2026-08-27',
    monthKey: '2026-08',
    category: 'faca',
    productId: 'prod-2',
    productName: 'Faca Campeira Damasco',
    quantity: 2,
    unitPrice: 1250,
    totalAmount: 2500,
    paymentMethod: 'credito',
    createdAt: new Date('2026-08-27T18:00:00').getTime(),
  },
  {
    id: 'aug-sale-9',
    date: '2026-08-30',
    monthKey: '2026-08',
    category: 'polimento',
    productId: 'prod-9',
    productName: 'Polimento Espelhado',
    quantity: 6,
    unitPrice: 90,
    totalAmount: 540,
    paymentMethod: 'pix',
    createdAt: new Date('2026-08-30T10:30:00').getTime(),
  },
  {
    id: 'aug-sale-10',
    date: '2026-08-31',
    monthKey: '2026-08',
    category: 'faca',
    productId: 'prod-1',
    productName: 'Faca Gaúcha 8"',
    quantity: 2,
    unitPrice: 380,
    totalAmount: 760,
    paymentMethod: 'pix',
    createdAt: new Date('2026-08-31T09:15:00').getTime(),
  },
  {
    id: 'aug-sale-11',
    date: '2026-08-31',
    monthKey: '2026-08',
    category: 'tabua',
    productId: 'prod-4',
    productName: 'Tábua Rústica',
    quantity: 2,
    unitPrice: 220,
    totalAmount: 440,
    paymentMethod: 'debito',
    createdAt: new Date('2026-08-31T10:45:00').getTime(),
  },
  {
    id: 'aug-sale-12',
    date: '2026-08-31',
    monthKey: '2026-08',
    category: 'copo',
    productId: 'prod-6',
    productName: 'Copo Térmico',
    quantity: 1,
    unitPrice: 100,
    totalAmount: 100,
    paymentMethod: 'dinheiro',
    createdAt: new Date('2026-08-31T11:20:00').getTime(),
  },
  // Total August sales = 1140 + 2500 + 880 + 1160 + 1350 + 540 + 540 + 2500 + 540 + 760 + 440 + 100 = 12450.00!
];

// August Expenses
const AUGUST_EXPENSES: Expense[] = [
  {
    id: 'aug-exp-1',
    date: '2026-08-01',
    monthKey: '2026-08',
    category: 'aluguel',
    description: 'Aluguel do Galpão e Oficina',
    amount: 1200,
    paymentMethod: 'pix',
    createdAt: new Date('2026-08-01T08:00:00').getTime(),
  },
  {
    id: 'aug-exp-2',
    date: '2026-08-06',
    monthKey: '2026-08',
    category: 'fornecedor',
    supplierName: 'Aços Villares & Forja',
    description: 'Compra de barras de Aço 1070 e 5160',
    amount: 850,
    paymentMethod: 'pix',
    createdAt: new Date('2026-08-06T14:30:00').getTime(),
  },
  {
    id: 'aug-exp-3',
    date: '2026-08-10',
    monthKey: '2026-08',
    category: 'material',
    supplierName: 'Deerfos Cintas Abrasivas',
    description: 'Lixas cerâmicas e cintas Deerfos',
    amount: 420,
    paymentMethod: 'credito',
    createdAt: new Date('2026-08-10T11:00:00').getTime(),
  },
  {
    id: 'aug-exp-4',
    date: '2026-08-18',
    monthKey: '2026-08',
    category: 'contas',
    description: 'Energia Elétrica Trifásica Oficina',
    amount: 380,
    paymentMethod: 'pix',
    createdAt: new Date('2026-08-18T10:00:00').getTime(),
  },
  {
    id: 'aug-exp-5',
    date: '2026-08-24',
    monthKey: '2026-08',
    category: 'frete',
    description: 'Frete de insumos e entregas especiais',
    amount: 150,
    paymentMethod: 'pix',
    createdAt: new Date('2026-08-24T16:00:00').getTime(),
  },
  {
    id: 'aug-exp-6',
    date: '2026-08-31',
    monthKey: '2026-08',
    category: 'divulgacao',
    description: 'Anúncios Instagram e feira',
    amount: 350,
    paymentMethod: 'pix',
    createdAt: new Date('2026-08-31T09:00:00').getTime(),
  },
];

type StorageListener = () => void;

class AppStorage {
  private listeners: Set<StorageListener> = new Set();

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
  }

  // --- GETTERS ---
  public getSales(): Sale[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!raw) {
      this.setSales([]);
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public getExpenses(): Expense[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!raw) {
      this.setExpenses([]);
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public getProducts(): Product[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
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
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!raw) {
      this.setCustomers([]);
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public getSuppliers(): Supplier[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    if (!raw) {
      this.setSuppliers([]);
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public getGoals(): MonthlyGoal[] {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
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
    return found ? found.targetAmount : 20000;
  }

  public getClosedPeriods(): ClosedPeriod[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CLOSED_PERIODS);
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
    const raw = localStorage.getItem(STORAGE_KEYS.GORDURA_USAGES);
    if (!raw) {
      this.setGorduraUsages([]);
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public getUserRole(): UserRole {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
    return (raw as UserRole) || 'admin';
  }

  public isNotificationsEnabled(): boolean {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
    return raw === 'true';
  }

  // --- SETTERS / ACTIONS ---
  public setSales(sales: Sale[]) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    this.notify();
  }

  public setExpenses(expenses: Expense[]) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    this.notify();
  }

  public setGorduraUsages(usages: GorduraUsage[]) {
    localStorage.setItem(STORAGE_KEYS.GORDURA_USAGES, JSON.stringify(usages));
    this.notify();
  }

  public setProducts(products: Product[]) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.notify();
  }

  public setCustomers(customers: Customer[]) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    this.notify();
  }

  public setSuppliers(suppliers: Supplier[]) {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
    this.notify();
  }

  public setGoals(goals: MonthlyGoal[]) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    this.notify();
  }

  public setClosedPeriods(periods: ClosedPeriod[]) {
    localStorage.setItem(STORAGE_KEYS.CLOSED_PERIODS, JSON.stringify(periods));
    this.notify();
  }

  public setUserRole(role: UserRole) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
    this.notify();
  }

  public setNotificationsEnabled(enabled: boolean) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, enabled ? 'true' : 'false');
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

    // Auto deduct product stock if linked to a physical product
    if (saleData.productId) {
      const products = this.getProducts();
      const prodIndex = products.findIndex((p) => p.id === saleData.productId);
      if (prodIndex >= 0 && !products[prodIndex].isService) {
        products[prodIndex].stock = Math.max(0, products[prodIndex].stock - (saleData.quantity || 1));
        this.setProducts(products);
      }
    }

    // Auto update or register customer if provided
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
      goals[index].targetAmount = targetAmount;
      goals[index].updatedAt = Date.now();
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

  public addClosedPeriod(period: Omit<ClosedPeriod, 'id' | 'monthKeys'>): ClosedPeriod {
    const periods = this.getClosedPeriods();
    // Compute month keys covered
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

  public addProduct(productData: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    products.push(newProduct);
    this.setProducts(products);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>) {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index >= 0) {
      products[index] = { ...products[index], ...updates };
      this.setProducts(products);
    }
  }

  public deleteProduct(id: string) {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.setProducts(products);
  }

  public addCustomer(custData: Omit<Customer, 'id' | 'createdAt'>): Customer {
    const customers = this.getCustomers();
    const newCust: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      createdAt: Date.now(),
    };
    customers.push(newCust);
    this.setCustomers(customers);
    return newCust;
  }

  public deleteCustomer(id: string) {
    const customers = this.getCustomers().filter((c) => c.id !== id);
    this.setCustomers(customers);
  }

  public addSupplier(suppData: Omit<Supplier, 'id' | 'createdAt'>): Supplier {
    const suppliers = this.getSuppliers();
    const newSupp: Supplier = {
      ...suppData,
      id: `supp-${Date.now()}`,
      createdAt: Date.now(),
    };
    suppliers.push(newSupp);
    this.setSuppliers(suppliers);
    return newSupp;
  }

  public deleteSupplier(id: string) {
    const suppliers = this.getSuppliers().filter((s) => s.id !== id);
    this.setSuppliers(suppliers);
  }

  public addGorduraUsage(usageData: Omit<GorduraUsage, 'id' | 'createdAt'>): GorduraUsage {
    const usages = this.getGorduraUsages();
    const newUsage: GorduraUsage = {
      ...usageData,
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

  public clearGorduraUsages() {
    this.setGorduraUsages([]);
  }

  public resetToZeroed() {
    this.setSales([]);
    this.setExpenses([]);
    this.setGorduraUsages([]);
    this.setClosedPeriods(INITIAL_CLOSED_PERIODS);
    this.setProducts(INITIAL_PRODUCTS);
    this.setCustomers([]);
    this.setSuppliers([]);
    this.setGoals(INITIAL_GOALS);
    this.setUserRole('admin');
    this.notify();
  }

  public resetToDefaultDemoData() {
    localStorage.clear();
    this.setSales([]);
    this.setExpenses([]);
    this.setGorduraUsages([]);
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
