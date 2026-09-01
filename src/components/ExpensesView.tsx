import React, { useState } from 'react';
import { Expense, ExpenseCategory, PaymentMethod } from '../types';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/calculations';
import {
  Plus,
  Search,
  Trash2,
  Calendar,
  CreditCard,
  Building2,
  TrendingDown,
} from 'lucide-react';

interface ExpensesViewProps {
  expenses?: Expense[];
  selectedMonth: string;
  onOpenNewExpense: () => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses = [],
  selectedMonth,
  onOpenNewExpense,
  onDeleteExpense,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const safeExpenses = expenses || [];

  const filteredExpenses = safeExpenses.filter((exp) => {
    const matchesMonth = searchQuery.trim() ? true : exp.monthKey === selectedMonth;
    const matchesCategory = categoryFilter === 'all' || exp.category === categoryFilter;
    const matchesPayment = paymentFilter === 'all' || exp.paymentMethod === paymentFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      exp.description.toLowerCase().includes(q) ||
      (exp.supplierName && exp.supplierName.toLowerCase().includes(q)) ||
      exp.category.toLowerCase().includes(q);

    return matchesMonth && matchesCategory && matchesPayment && matchesSearch;
  });

  const totalFilteredAmount = filteredExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);

  const getCategoryInfo = (catId: ExpenseCategory) => {
    return EXPENSE_CATEGORIES.find((c) => c.id === catId) || {
      name: 'OUTRO',
      emoji: '💸',
    };
  };

  const getPaymentBadge = (pmId: PaymentMethod) => {
    const found = PAYMENT_METHODS.find((p) => p.id === pmId);
    return found ? found.badgeColor : 'bg-slate-700 text-slate-300';
  };

  return (
    <div className="space-y-5 pb-12 animate-fade-in">
      {/* Top Action & Summary Bar */}
      <div className="bg-[#151923] border border-[#283144] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💸</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100">
              Controle de Saídas e Custos
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Total filtrado:{' '}
            <strong className="text-rose-400 font-mono text-sm sm:text-base font-bold">
              {formatCurrency(totalFilteredAmount)}
            </strong>{' '}
            ({filteredExpenses.length} despesas)
          </p>
        </div>

        <button
          id="btn-expenses-nova-saida"
          onClick={onOpenNewExpense}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold px-5 py-3 rounded-xl sm:rounded-2xl shadow-lg active:scale-95 transition-all text-sm sm:text-base"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>＋ NOVA SAÍDA</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#151923] border border-[#262f43] rounded-2xl p-3 sm:p-4 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por descrição ou fornecedor..."
              className="w-full bg-[#11141c] border border-[#283248] rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-rose-500 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#11141c] border border-[#283248] rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-rose-500 focus:outline-none"
          >
            <option value="all">Todas as Despesas</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[#11141c] border border-[#283248] rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-rose-500 focus:outline-none"
          >
            <option value="all">Todos os Pagamentos</option>
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="bg-[#141822] border border-[#262e40] rounded-3xl p-8 sm:p-12 text-center">
          <TrendingDown className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">
            Nenhuma saída encontrada
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Não há registros correspondentes aos filtros selecionados.
          </p>
          <button
            onClick={onOpenNewExpense}
            className="mt-4 inline-flex items-center gap-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/40 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Primeira Saída</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredExpenses.map((exp) => {
            const catInfo = getCategoryInfo(exp.category);
            const paymentBadge = getPaymentBadge(exp.paymentMethod);

            return (
              <div
                key={exp.id}
                className="bg-[#151923] hover:bg-[#191e2b] border border-[#262f43] hover:border-rose-500/30 rounded-2xl p-3.5 sm:p-4 shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Left: Icon & Description */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#1d2332] border border-[#2f3950] flex items-center justify-center text-xl flex-shrink-0">
                    {catInfo.emoji}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base font-bold text-slate-100">
                        {exp.description}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#222a3d] text-slate-400 uppercase font-semibold">
                        {catInfo.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {formatDate(exp.date)}
                      </span>

                      {exp.supplierName && (
                        <span className="flex items-center gap-1 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-rose-400" />
                          {exp.supplierName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Payment badge, Amount & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#22293b]">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border uppercase ${paymentBadge}`}
                  >
                    {exp.paymentMethod}
                  </span>

                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-black text-rose-400 font-mono">
                      {formatCurrency(exp.amount)}
                    </span>
                  </div>

                  <button
                    onClick={() => setExpenseToDelete(exp)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Excluir Saída"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal (Rule #49) */}
      {expenseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171b26] border border-[#2e374e] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold text-slate-100">
              Confirmar Exclusão de Saída
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tem certeza que deseja excluir a despesa{' '}
              <strong className="text-rose-400">
                "{expenseToDelete.description}"
              </strong>{' '}
              no valor de{' '}
              <strong className="text-slate-100 font-mono font-bold">
                {formatCurrency(expenseToDelete.amount)}
              </strong>
              ?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setExpenseToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-[#232a3d] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteExpense(expenseToDelete.id);
                  setExpenseToDelete(null);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-md"
              >
                Excluir Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
