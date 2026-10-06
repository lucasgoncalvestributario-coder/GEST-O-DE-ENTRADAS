import React, { useState, useEffect, useMemo } from 'react';
import {
  TabType,
  UserRole,
  Sale,
  Expense,
  Goal,
  ClosedPeriod,
  Product,
  Customer,
  Supplier,
  SaleCategory,
  ExpenseCategory,
  PaymentMethod,
  GorduraUsage,
} from './types';
import { appStorage } from './services/storage';
import { calculateMonthTarget, calculateDailyClosing, formatMonthYear, formatDate, formatCurrency } from './utils/calculations';
import {
  getBrasiliaDateParts,
  getTodayBrasilia,
  getCurrentMonthBrasilia,
  getCurrentTimeBrasilia,
  formatBrasiliaDateTime,
} from './utils/dateUtils';
import { NotificationService } from './utils/notifications';
import { triggerCelebrationEffect } from './utils/celebration';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { SalesView } from './components/SalesView';
import { ExpensesView } from './components/ExpensesView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { NewSaleModal } from './components/NewSaleModal';
import { NewExpenseModal } from './components/NewExpenseModal';
import { DailyClosingModal } from './components/DailyClosingModal';
import { GorduraModal } from './components/GorduraModal';
import { CelebrationModal, CelebrationInfo } from './components/CelebrationModal';
import { CloudSyncModal } from './components/CloudSyncModal';

export default function App() {
  // Live ticker tracking Horário de Brasília (America/Sao_Paulo)
  const [nowBrasilia, setNowBrasilia] = useState<Date>(() => new Date());

  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(() => appStorage.getUserRole());
  const [selectedMonth, setSelectedMonth] = useState<string>(() => getCurrentMonthBrasilia());

  // Core Data Collections
  const [sales, setSales] = useState<Sale[]>(() => appStorage.getSales());
  const [expenses, setExpenses] = useState<Expense[]>(() => appStorage.getExpenses());
  const [gorduraUsages, setGorduraUsages] = useState<GorduraUsage[]>(() => appStorage.getGorduraUsages());
  const [goals, setGoals] = useState<Goal[]>(() => appStorage.getGoals());
  const [closedPeriods, setClosedPeriods] = useState<ClosedPeriod[]>(() => appStorage.getClosedPeriods());
  const [products, setProducts] = useState<Product[]>(() => appStorage.getProducts());
  const [customers, setCustomers] = useState<Customer[]>(() => appStorage.getCustomers());
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => appStorage.getSuppliers());

  // Modals state
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);
  const [isDailyClosingOpen, setIsDailyClosingOpen] = useState(false);
  const [isGorduraModalOpen, setIsGorduraModalOpen] = useState(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<CelebrationInfo | null>(null);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Live ticker that monitors Horário de Brasília and handles the EXACT 00:00:00 midnight calendar turnover
  useEffect(() => {
    let lastDateStr = getTodayBrasilia();

    const intervalId = setInterval(() => {
      const currentNow = new Date();
      setNowBrasilia(currentNow);
      const currentDateStr = getTodayBrasilia(currentNow);

      // Check if a calendar day turnover occurred (EXACTLY at 00:00:00 Brasília time)
      if (currentDateStr !== lastDateStr) {
        console.log(`[Virada de Dia] Transição de ${lastDateStr} para ${currentDateStr} às 00:00:00 BRT`);

        // 1. Automatically consolidate previous day's register if not already manually closed
        const currentSales = appStorage.getSales();
        const currentExpenses = appStorage.getExpenses();
        const prevSales = currentSales.filter((s) => s.date === lastDateStr);
        const prevExpenses = currentExpenses.filter((e) => e.date === lastDateStr);
        const prevSalesTotal = prevSales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
        const prevExpensesTotal = prevExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);

        const existingRecord = appStorage.getDailyRegisterForDate(lastDateStr);
        if (!existingRecord || existingRecord.status === 'aberto') {
          appStorage.closeDailyRegister(
            lastDateStr,
            'Sistema (Virada Automática 00:00:00)',
            true,
            {
              salesTotal: prevSalesTotal,
              salesCount: prevSales.length,
              expensesTotal: prevExpensesTotal,
              expensesCount: prevExpenses.length,
              resultTotal: prevSalesTotal - prevExpensesTotal,
              dailyTarget: 0,
              isDailyTargetMet: true,
              notes: `Encerramento automático na virada de calendário de ${lastDateStr} para ${currentDateStr}.`,
            }
          );
        }

        // 2. Advance to the new day
        const oldDate = lastDateStr;
        lastDateStr = currentDateStr;

        // 3. Keep selectedMonth in sync if following the active month
        const newMonth = currentDateStr.substring(0, 7);
        const oldMonth = oldDate.substring(0, 7);
        setSelectedMonth((curr) => (curr === oldMonth ? newMonth : curr));

        // Refresh state from storage
        setSales(appStorage.getSales());
        setExpenses(appStorage.getExpenses());
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Subscribe to storage changes and perform initial sync with the shared server database
  useEffect(() => {
    appStorage.syncWithServer().then(() => {
      setSales(appStorage.getSales());
      setExpenses(appStorage.getExpenses());
      setGorduraUsages(appStorage.getGorduraUsages());
      setGoals(appStorage.getGoals());
      setClosedPeriods(appStorage.getClosedPeriods());
      setProducts(appStorage.getProducts());
      setCustomers(appStorage.getCustomers());
      setSuppliers(appStorage.getSuppliers());
    });

    const unsubscribe = appStorage.subscribe(() => {
      setSales(appStorage.getSales());
      setExpenses(appStorage.getExpenses());
      setGorduraUsages(appStorage.getGorduraUsages());
      setGoals(appStorage.getGoals());
      setClosedPeriods(appStorage.getClosedPeriods());
      setProducts(appStorage.getProducts());
      setCustomers(appStorage.getCustomers());
      setSuppliers(appStorage.getSuppliers());
    });

    return () => unsubscribe();
  }, []);

  // Sync state changes with storage when modified
  const handleSetUserRole = (role: UserRole) => {
    setUserRole(role);
    appStorage.setUserRole(role);
  };

  // Find target for currently selected month (default R$ 20.000 if not set)
  const currentGoalAmount = useMemo(() => {
    const found = goals.find((g) => g.monthKey === selectedMonth);
    return found ? found.targetAmount : 20000;
  }, [goals, selectedMonth]);

  // Compute live intelligence calculations in Horário de Brasília
  const targetCalculation = useMemo(() => {
    return calculateMonthTarget(
      selectedMonth,
      currentGoalAmount,
      sales,
      expenses,
      closedPeriods,
      nowBrasilia,
      gorduraUsages
    );
  }, [selectedMonth, currentGoalAmount, sales, expenses, closedPeriods, nowBrasilia, gorduraUsages]);

  // Compute daily closing data (strictly respecting America/Sao_Paulo)
  const dailyClosingData = useMemo(() => {
    const todayStr = getTodayBrasilia(nowBrasilia);
    const todayMonth = todayStr.substring(0, 7);

    // If viewing the current calendar month in Brasília, the active cash register date is todayStr
    // If viewing another month, use 15th of that month as reference
    const refDate = selectedMonth === todayMonth ? todayStr : `${selectedMonth}-15`;

    return calculateDailyClosing(refDate, sales, expenses, targetCalculation, closedPeriods, gorduraUsages);
  }, [selectedMonth, sales, expenses, targetCalculation, closedPeriods, gorduraUsages, nowBrasilia]);

  // Compute previous month stats for comparison
  const previousMonthInfo = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1);
    const prevMonthStr = String(prevDate.getMonth() + 1).padStart(2, '0');
    const prevMonthKey = `${prevDate.getFullYear()}-${prevMonthStr}`;

    const prevMonthSales = (sales || []).filter((s) => s.monthKey === prevMonthKey);
    const prevTotal = prevMonthSales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);

    return {
      prevMonthKey,
      prevTotal,
      prevMonthName: formatMonthYear(prevMonthKey),
    };
  }, [selectedMonth, sales]);

  const handleNavigateTab = (tab: string) => {
    if (tab === 'vendas' || tab === 'sales') setActiveTab('sales');
    else if (tab === 'saidas' || tab === 'expenses') setActiveTab('expenses');
    else if (tab === 'relatorios' || tab === 'reports') setActiveTab('reports');
    else if (tab === 'configuracoes' || tab === 'settings') setActiveTab('settings');
    else setActiveTab('dashboard');
  };

  // Handlers for Sale
  const handleSaveSale = (saleData: {
    category: SaleCategory;
    productName: string;
    productId?: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    customerName?: string;
    customerPhone?: string;
    date: string;
    monthKey: string;
  }) => {
    // Current state before adding sale
    const prevSales = sales;
    const saleMonthKey = saleData.monthKey || selectedMonth;
    const goalObj = goals.find((g) => g.monthKey === saleMonthKey);
    const monthGoal = goalObj ? goalObj.targetAmount : 20000;

    const prevCalc = calculateMonthTarget(
      saleMonthKey,
      monthGoal,
      prevSales,
      expenses,
      closedPeriods
    );

    const prevMonthSales = prevSales.filter((s) => s.monthKey === saleMonthKey);
    const prevTotalMonthSales = prevMonthSales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
    const prevDaySales = prevSales
      .filter((s) => s.date === saleData.date)
      .reduce((acc, s) => acc + (s.totalAmount || 0), 0);

    // Save sale
    const newSale = appStorage.addSale(saleData);
    const updatedSales = appStorage.getSales();
    setSales(updatedSales);
    setProducts(appStorage.getProducts()); // updated stock
    setCustomers(appStorage.getCustomers());

    // Calculate new target results
    const newCalc = calculateMonthTarget(
      saleMonthKey,
      monthGoal,
      updatedSales,
      expenses,
      closedPeriods
    );

    const newTotalMonthSales = prevTotalMonthSales + saleData.totalAmount;
    const newDaySales = prevDaySales + saleData.totalAmount;

    // Check if MONTHLY goal was just achieved
    if (prevTotalMonthSales < monthGoal && newTotalMonthSales >= monthGoal) {
      setTimeout(() => {
        setCelebrationData({
          type: 'month',
          title: '🎉 META DO MÊS BATIDA COM SUCESSO!',
          targetAmount: monthGoal,
          totalAchieved: newTotalMonthSales,
          surplusAmount: Math.max(0, newTotalMonthSales - monthGoal),
          dateOrMonthLabel: formatMonthYear(saleMonthKey),
        });
        setIsCelebrationOpen(true);
        triggerCelebrationEffect('month');
      }, 500);
    }
    // Check if DAILY goal was just achieved
    else if (
      newCalc.todayTarget > 0 &&
      prevDaySales < newCalc.todayTarget &&
      newDaySales >= newCalc.todayTarget
    ) {
      setTimeout(() => {
        setCelebrationData({
          type: 'day',
          title: '🎯 META DO DIA CONCLUÍDA!',
          targetAmount: newCalc.todayTarget,
          totalAchieved: newDaySales,
          surplusAmount: Math.max(0, newDaySales - newCalc.todayTarget),
          dateOrMonthLabel: formatDate(saleData.date),
        });
        setIsCelebrationOpen(true);
        triggerCelebrationEffect('day');
      }, 500);
    }
  };

  const handleDeleteSale = (id: string) => {
    appStorage.deleteSale(id);
    setSales(appStorage.getSales());
  };

  // Handlers for Expense
  const handleSaveExpense = (expenseData: {
    category: ExpenseCategory;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
    supplierName?: string;
    supplierId?: string;
    date: string;
    monthKey: string;
  }) => {
    appStorage.addExpense(expenseData);
    setExpenses(appStorage.getExpenses());
  };

  const handleDeleteExpense = (id: string) => {
    appStorage.deleteExpense(id);
    setExpenses(appStorage.getExpenses());
  };

  // Handlers for Settings & Goals
  const handleSaveGoal = (monthKey: string, targetAmount: number) => {
    appStorage.saveGoal(monthKey, targetAmount);
    setGoals(appStorage.getGoals());
  };

  const handleAddClosedPeriod = (period: Omit<ClosedPeriod, 'id' | 'monthKeys'>) => {
    appStorage.addClosedPeriod(period);
    setClosedPeriods(appStorage.getClosedPeriods());
  };

  const handleDeleteClosedPeriod = (id: string) => {
    appStorage.deleteClosedPeriod(id);
    setClosedPeriods(appStorage.getClosedPeriods());
  };

  const handleAddProduct = (prod: Omit<Product, 'id'>) => {
    appStorage.addProduct(prod);
    setProducts(appStorage.getProducts());
  };

  const handleDeleteProduct = (id: string) => {
    appStorage.deleteProduct(id);
    setProducts(appStorage.getProducts());
  };

  const handleAddCustomer = (cust: Omit<Customer, 'id' | 'createdAt'>) => {
    appStorage.addCustomer(cust);
    setCustomers(appStorage.getCustomers());
  };

  const handleDeleteCustomer = (id: string) => {
    appStorage.deleteCustomer(id);
    setCustomers(appStorage.getCustomers());
  };

  const handleAddSupplier = (supp: Omit<Supplier, 'id' | 'createdAt'>) => {
    appStorage.addSupplier(supp);
    setSuppliers(appStorage.getSuppliers());
  };

  const handleDeleteSupplier = (id: string) => {
    appStorage.deleteSupplier(id);
    setSuppliers(appStorage.getSuppliers());
  };

  const handleResetDemoData = () => {
    appStorage.resetToDefaultDemoData();
    setSales(appStorage.getSales());
    setExpenses(appStorage.getExpenses());
    setGorduraUsages(appStorage.getGorduraUsages());
    setGoals(appStorage.getGoals());
    setClosedPeriods(appStorage.getClosedPeriods());
    setProducts(appStorage.getProducts());
    setCustomers(appStorage.getCustomers());
    setSuppliers(appStorage.getSuppliers());
    setSelectedMonth('2026-10');
    NotificationService.playCelebrationFanfare();
  };

  const handleResetToZeroed = () => {
    appStorage.resetToZeroed();
    setSales(appStorage.getSales());
    setExpenses(appStorage.getExpenses());
    setGorduraUsages(appStorage.getGorduraUsages());
    setGoals(appStorage.getGoals());
    setClosedPeriods(appStorage.getClosedPeriods());
    setProducts(appStorage.getProducts());
    setCustomers(appStorage.getCustomers());
    setSuppliers(appStorage.getSuppliers());
    setSelectedMonth('2026-10');
    NotificationService.playSuccessChime();
  };

  // Handlers for Gordura (Surplus / Reserve)
  const handleApplyGordura = (date: string, amount: number, reason?: string) => {
    const monthKey = date.substring(0, 7);
    appStorage.addGorduraUsage({
      date,
      amount,
      monthKey,
      reason: reason || 'Completar meta do dia',
    });
    setGorduraUsages(appStorage.getGorduraUsages());
  };

  const handleDeleteGorduraUsage = (id: string) => {
    appStorage.deleteGorduraUsage(id);
    setGorduraUsages(appStorage.getGorduraUsages());
  };

  const handleQuickCompleteTodayWithGordura = (targetDate?: string, neededAmount?: number) => {
    const dateToUse = targetDate || dailyClosingData.date;
    const available = targetCalculation.gorduraBalance?.available || 0;
    const missing = neededAmount !== undefined ? neededAmount : targetCalculation.todayRemainingTarget;

    if (missing <= 0 || available <= 0) return;

    const amountToApply = Math.min(missing, available);
    handleApplyGordura(dateToUse, amountToApply, 'Completar meta diária com gordura');
    NotificationService.playSuccessChime();

    // Trigger celebration if target is met
    if (amountToApply >= missing) {
      setTimeout(() => {
        triggerCelebrationEffect('day');
      }, 200);
    }
  };

  // Handlers for Cash Register Manual Closing & Reopening
  const handleCloseCashRegister = (date: string, notes?: string) => {
    appStorage.closeDailyRegister(
      date,
      userRole === 'admin' ? 'Administrador' : 'Operador',
      false,
      {
        salesTotal: dailyClosingData.salesToday,
        salesCount: dailyClosingData.salesCount,
        expensesTotal: dailyClosingData.expensesToday,
        expensesCount: dailyClosingData.expensesCount,
        resultTotal: dailyClosingData.resultToday,
        dailyTarget: dailyClosingData.dailyTarget,
        isDailyTargetMet: dailyClosingData.isDailyTargetMet,
        notes,
      }
    );
    NotificationService.playSuccessChime();
    NotificationService.sendNotification(
      'Fronteira Cutelaria',
      `Caixa do dia ${formatDate(date)} fechado com sucesso! Total: ${formatCurrency(dailyClosingData.salesToday)}`
    );
    setNowBrasilia(new Date());
  };

  const handleReopenCashRegister = (date: string) => {
    appStorage.reopenDailyRegister(date);
    NotificationService.playSuccessChime();
    setNowBrasilia(new Date());
  };

  // Daily goal achieved status (for celebratory theme until the day turns)
  const isDailyGoalMet = useMemo(() => {
    return targetCalculation.isTodayTargetMet || dailyClosingData.isDailyTargetMet;
  }, [targetCalculation.isTodayTargetMet, dailyClosingData.isDailyTargetMet]);

  return (
    <div
      className={`min-h-screen text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans antialiased relative transition-all duration-1000 ${
        isDailyGoalMet
          ? 'celebration-bg'
          : 'bg-[#0e1117]'
      }`}
    >
      {/* Festive Background Ambient Glows when Daily Goal is Met */}
      {isDailyGoalMet && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="celebration-glow-orb absolute -top-24 -left-20 w-96 h-96 bg-gradient-to-br from-emerald-500/25 to-teal-500/10 rounded-full blur-3xl" />
          <div className="celebration-glow-orb absolute top-1/4 -right-24 w-[30rem] h-[30rem] bg-gradient-to-bl from-amber-500/25 via-orange-500/15 to-transparent rounded-full blur-3xl" style={{ animationDelay: '-2s' }} />
          <div className="celebration-glow-orb absolute -bottom-32 left-1/3 w-[36rem] h-[36rem] bg-gradient-to-tr from-purple-600/20 via-pink-600/15 to-emerald-600/10 rounded-full blur-3xl" style={{ animationDelay: '-4s' }} />
        </div>
      )}

      {/* Top Celebration Banner when Daily Goal is Met */}
      {isDailyGoalMet && (
        <div className="bg-gradient-to-r from-emerald-600/90 via-amber-600/90 to-emerald-600/90 text-slate-950 px-4 py-2 text-center text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 relative z-50 border-b border-amber-300/40 animate-fade-in">
          <span className="text-base">🎉</span>
          <span>META DO DIA BATIDA COM SUCESSO! HOJE É DIA DE FESTA NA FRONTEIRA CUTELARIA</span>
          <button
            onClick={() => triggerCelebrationEffect('day')}
            className="ml-2 bg-slate-950/80 hover:bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-amber-400/50 active:scale-95 transition-all shadow"
          >
            🎊 Soltar Confetes
          </button>
        </div>
      )}

      {/* Top Header */}

      <Header
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
        userRole={userRole}
        onChangeRole={handleSetUserRole}
        onOpenClosing={() => setIsDailyClosingOpen(true)}
        onOpenNewSale={() => setIsNewSaleOpen(true)}
        onOpenNewExpense={() => setIsNewExpenseOpen(true)}
        onOpenCloudSync={() => setIsCloudSyncOpen(true)}
      />

      {/* Navigation Tabs (Top on Desktop, Bottom on Mobile) */}
      <Navigation activeTab={activeTab} onSelectTab={setActiveTab} userRole={userRole} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-28 md:pb-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            calc={targetCalculation}
            userRole={userRole}
            selectedMonth={selectedMonth}
            dailyClosing={dailyClosingData}
            products={products}
            closedPeriods={closedPeriods}
            sales={sales}
            expenses={expenses}
            previousMonthSalesTotal={previousMonthInfo.prevTotal}
            previousMonthName={previousMonthInfo.prevMonthName}
            onOpenNewSale={() => setIsNewSaleOpen(true)}
            onOpenNewExpense={() => setIsNewExpenseOpen(true)}
            onOpenDailyClosing={() => setIsDailyClosingOpen(true)}
            onOpenGorduraModal={() => setIsGorduraModalOpen(true)}
            onQuickCompleteTodayWithGordura={() => handleQuickCompleteTodayWithGordura()}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'sales' && (
          <SalesView
            sales={sales}
            selectedMonth={selectedMonth}
            onOpenNewSale={() => setIsNewSaleOpen(true)}
            onDeleteSale={handleDeleteSale}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesView
            expenses={expenses}
            selectedMonth={selectedMonth}
            onOpenNewExpense={() => setIsNewExpenseOpen(true)}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            calc={targetCalculation}
            sales={sales}
            expenses={expenses}
            closedPeriods={closedPeriods}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            userRole={userRole}
            onChangeRole={handleSetUserRole}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            currentGoal={currentGoalAmount}
            onSaveGoal={handleSaveGoal}
            closedPeriods={closedPeriods}
            onAddClosedPeriod={handleAddClosedPeriod}
            onDeleteClosedPeriod={handleDeleteClosedPeriod}
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            suppliers={suppliers}
            onAddSupplier={handleAddSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            sales={sales}
            onResetDemoData={handleResetDemoData}
            onResetToZeroed={handleResetToZeroed}
          />
        )}
      </main>

      {/* Sale Registration Modal */}
      <NewSaleModal
        isOpen={isNewSaleOpen}
        onClose={() => setIsNewSaleOpen(false)}
        onSaveSale={handleSaveSale}
        products={products}
        customers={customers}
        selectedMonth={selectedMonth}
      />

      {/* Expense Registration Modal */}
      <NewExpenseModal
        isOpen={isNewExpenseOpen}
        onClose={() => setIsNewExpenseOpen(false)}
        onSaveExpense={handleSaveExpense}
        suppliers={suppliers}
        selectedMonth={selectedMonth}
      />

      {/* Daily Closing Modal */}
      <DailyClosingModal
        isOpen={isDailyClosingOpen}
        onClose={() => setIsDailyClosingOpen(false)}
        closingData={dailyClosingData}
        sales={sales}
        expenses={expenses}
        onOpenGorduraModal={() => {
          setIsDailyClosingOpen(false);
          setIsGorduraModalOpen(true);
        }}
        onQuickCompleteWithGordura={(date, missing) => {
          handleQuickCompleteTodayWithGordura(date, missing);
        }}
        onCloseCashRegister={handleCloseCashRegister}
        onReopenCashRegister={handleReopenCashRegister}
      />

      {/* Gordura (Surplus / Reserve) Modal */}
      <GorduraModal
        isOpen={isGorduraModalOpen}
        onClose={() => setIsGorduraModalOpen(false)}
        calc={targetCalculation}
        todayDateStr={dailyClosingData.date}
        onApplyGordura={handleApplyGordura}
        onDeleteUsage={handleDeleteGorduraUsage}
      />

      {/* Goal Celebration Modal */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        celebrationData={celebrationData}
        onNewSale={() => setIsNewSaleOpen(true)}
      />

      {/* Cloud Sync & Backup Modal */}
      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        onDataRestored={() => {
          setSales(appStorage.getSales());
          setExpenses(appStorage.getExpenses());
          setGorduraUsages(appStorage.getGorduraUsages());
          setGoals(appStorage.getGoals());
          setClosedPeriods(appStorage.getClosedPeriods());
          setProducts(appStorage.getProducts());
          setCustomers(appStorage.getCustomers());
          setSuppliers(appStorage.getSuppliers());
        }}
      />
    </div>
  );
}
