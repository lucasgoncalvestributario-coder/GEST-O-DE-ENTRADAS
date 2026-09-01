import React, { useState } from 'react';
import { ExpenseCategory, PaymentMethod, Supplier } from '../types';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../utils/constants';
import { formatCurrency } from '../utils/calculations';
import { NotificationService } from '../utils/notifications';
import { X, CheckCircle, Plus } from 'lucide-react';

interface NewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: {
    category: ExpenseCategory;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
    supplierName?: string;
    supplierId?: string;
    date: string;
    monthKey: string;
  }) => void;
  suppliers?: Supplier[];
  selectedMonth: string;
}

export const NewExpenseModal: React.FC<NewExpenseModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
  suppliers = [],
  selectedMonth,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [category, setCategory] = useState<ExpenseCategory>('fornecedor');
  const [description, setDescription] = useState<string>('Compra de insumos');
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [supplierId, setSupplierId] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');
  const [expenseDate, setExpenseDate] = useState<string>(todayStr);

  // Sync date with selectedMonth on modal open
  React.useEffect(() => {
    if (isOpen) {
      if (todayStr.startsWith(selectedMonth)) {
        setExpenseDate(todayStr);
      } else {
        setExpenseDate(`${selectedMonth}-01`);
      }
      setSavedSuccess(null);
    }
  }, [isOpen, selectedMonth, todayStr]);

  const [savedSuccess, setSavedSuccess] = useState<{
    value: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleSelectCategory = (cat: ExpenseCategory) => {
    setCategory(cat);
    switch (cat) {
      case 'fornecedor':
        setDescription('Compra de insumos para cutelaria');
        break;
      case 'aluguel':
        setDescription('Aluguel da oficina/galpão');
        break;
      case 'ferramenta':
        setDescription('Manutenção / Compra de ferramentas');
        break;
      case 'material':
        setDescription('Lixas, resinas e abrasivos');
        break;
      case 'frete':
        setDescription('Frete e entregas');
        break;
      case 'divulgacao':
        setDescription('Divulgação e feiras');
        break;
      case 'pagamento':
        setDescription('Pró-labore / Ajudante');
        break;
      case 'contas':
        setDescription('Energia trifásica / Água / Internet');
        break;
      case 'outro':
      default:
        setDescription('Despesa operacional');
        break;
    }
  };

  const handleSelectSupplier = (id: string) => {
    setSupplierId(id);
    if (!id) {
      setSupplierName('');
      return;
    }
    const sup = suppliers.find((s) => s.id === id);
    if (sup) {
      setSupplierName(sup.name);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = typeof amount === 'number' ? amount : parseFloat(amount);
    if (!val || val <= 0) return;

    const monthKey = expenseDate.substring(0, 7);

    onSaveExpense({
      category,
      description: description.trim() || 'Despesa',
      amount: val,
      paymentMethod,
      supplierId: supplierId || undefined,
      supplierName: supplierName.trim() || undefined,
      date: expenseDate,
      monthKey,
    });

    NotificationService.playSuccessChime();

    setSavedSuccess({
      value: val,
    });

    setTimeout(() => {
      setSavedSuccess(null);
      onClose();
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#141822] border border-[#2b3348] rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#252d40] bg-[#171b26]">
          <div className="flex items-center gap-2">
            <span className="text-xl">💸</span>
            <h2 className="text-lg font-extrabold text-slate-100">
              Registrar Nova Saída / Despesa
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-[#232a3d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-100">
              ✅ Saída registrada!
            </h3>
            <p className="text-3xl font-black text-rose-400 font-mono">
              {formatCurrency(savedSuccess.value)}
            </p>
            <p className="text-xs text-slate-400">
              O fluxo de caixa e o resultado foram atualizados.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
            {/* 1. O QUE FOI PAGO? (Sec. 19) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-rose-400 mb-2.5">
                1. O QUE FOI PAGO?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EXPENSE_CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.35)] scale-[1.02]'
                          : 'bg-[#1b202c] text-slate-200 border-[#2b3348] hover:border-rose-500/50 hover:bg-[#222938]'
                      }`}
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. VALOR & DESCRIÇÃO (Sec. 20) */}
            <div className="bg-[#191e2b] p-4 rounded-2xl border border-[#283246] space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                2. VALOR E DESCRIÇÃO
              </label>

              <div>
                <span className="text-[11px] text-slate-400 font-medium block mb-1">
                  Valor Pago (R$)
                </span>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="0,00"
                    className="w-full bg-[#12151e] border border-[#2e374e] rounded-xl pl-10 pr-3 py-2.5 text-base sm:text-lg font-bold text-rose-400 focus:border-rose-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-medium block mb-1">
                  Descrição do que foi pago
                </span>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Compra de aço 1070"
                  className="w-full bg-[#12151e] border border-[#2e374e] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 3. FORNECEDOR (Opcional) */}
            <div className="bg-[#181d2a] p-3.5 rounded-2xl border border-[#262f43] space-y-2.5">
              <span className="text-xs font-bold text-slate-300 block">
                Fornecedor (Opcional)
              </span>

              {suppliers.length > 0 && (
                <select
                  value={supplierId}
                  onChange={(e) => handleSelectSupplier(e.target.value)}
                  className="w-full bg-[#12151f] border border-[#293248] rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-rose-500 focus:outline-none"
                >
                  <option value="">-- Selecionar Fornecedor Cadastrado --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}

              <input
                type="text"
                value={supplierName}
                onChange={(e) => {
                  setSupplierName(e.target.value);
                  setSupplierId('');
                }}
                placeholder="Ou digite o nome do fornecedor/empresa"
                className="w-full bg-[#12151f] border border-[#293248] rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-rose-500 focus:outline-none"
              />

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400">Data da Saída:</span>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="bg-[#12151f] border border-[#293248] rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 4. FORMA DE PAGAMENTO */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
                Forma de Pagamento
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all border text-center ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-400 font-black shadow-md'
                          : 'bg-[#1b202c] text-slate-300 border-[#2b3348] hover:border-rose-500/40'
                      }`}
                    >
                      {pm.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. SALVAR SAÍDA */}
            <button
              id="btn-confirm-salvar-saida"
              type="submit"
              className="w-full bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:from-rose-500 hover:to-rose-800 text-white font-black py-3.5 sm:py-4 rounded-2xl shadow-[0_4px_25px_rgba(225,29,72,0.35)] active:scale-[0.98] transition-all text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-2"
            >
              <span>SALVAR SAÍDA</span>
              {amount !== '' && (
                <>
                  <span>•</span>
                  <span className="font-mono">{formatCurrency(Number(amount))}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
