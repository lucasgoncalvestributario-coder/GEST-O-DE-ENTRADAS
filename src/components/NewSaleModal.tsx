import React, { useState } from 'react';
import { SaleCategory, PaymentMethod, Product, Customer } from '../types';
import { SALE_CATEGORIES, PAYMENT_METHODS } from '../utils/constants';
import { formatCurrency } from '../utils/calculations';
import { NotificationService } from '../utils/notifications';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle,
  Sparkles,
  ShoppingBag,
  User,
  Plus,
} from 'lucide-react';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSale: (sale: {
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
  }) => void;
  products?: Product[];
  customers?: Customer[];
  selectedMonth: string;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({
  isOpen,
  onClose,
  onSaveSale,
  products = [],
  customers = [],
  selectedMonth,
}) => {
  // Today's date default
  const todayStr = new Date().toISOString().split('T')[0];

  const [category, setCategory] = useState<SaleCategory>('faca');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productName, setProductName] = useState<string>('Faca Artesanal');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(380);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [saleDate, setSaleDate] = useState<string>(todayStr);

  // Sync date with selectedMonth on modal open
  React.useEffect(() => {
    if (isOpen) {
      if (todayStr.startsWith(selectedMonth)) {
        setSaleDate(todayStr);
      } else {
        setSaleDate(`${selectedMonth}-01`);
      }
      setSavedSuccess(null);
    }
  }, [isOpen, selectedMonth, todayStr]);

  // Success state
  const [savedSuccess, setSavedSuccess] = useState<{
    value: number;
    category: string;
  } | null>(null);

  if (!isOpen) return null;

  const totalAmount = (quantity || 1) * (unitPrice || 0);

  // When category changes, suggest default item name & price
  const handleSelectCategory = (cat: SaleCategory) => {
    setCategory(cat);
    setSelectedProductId('');

    // Default prices and descriptions
    switch (cat) {
      case 'faca':
        setProductName('Faca Artesanal');
        setUnitPrice(380);
        break;
      case 'tabua':
        setProductName('Tábua de Corte Nobre');
        setUnitPrice(220);
        break;
      case 'copo':
        setProductName('Copo Térmico Personalizado');
        setUnitPrice(135);
        break;
      case 'afiacao':
        setProductName('Serviço de Afiação');
        setUnitPrice(45);
        break;
      case 'restauracao':
        setProductName('Serviço de Restauração');
        setUnitPrice(180);
        break;
      case 'polimento':
        setProductName('Polimento de Lâmina');
        setUnitPrice(90);
        break;
      case 'outro':
      default:
        setProductName('Outro Item / Acessório');
        setUnitPrice(100);
        break;
    }
  };

  // When selecting existing product from stock
  const handleSelectProduct = (prodId: string) => {
    setSelectedProductId(prodId);
    if (!prodId) return;
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setProductName(prod.name);
      setUnitPrice(prod.sellingPrice);
      // set category match
      if (prod.category === 'facas') setCategory('faca');
      else if (prod.category === 'tabuas') setCategory('tabua');
      else if (prod.category === 'copos') setCategory('copo');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitPrice || unitPrice <= 0) return;

    const monthKey = saleDate.substring(0, 7);

    onSaveSale({
      category,
      productName: productName.trim() || 'Item Cutelaria',
      productId: selectedProductId || undefined,
      quantity: quantity || 1,
      unitPrice,
      totalAmount,
      paymentMethod,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      date: saleDate,
      monthKey,
    });

    // Sound chime & confetti
    NotificationService.playSuccessChime();
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }

    setSavedSuccess({
      value: totalAmount,
      category: category.toUpperCase(),
    });

    setTimeout(() => {
      setSavedSuccess(null);
      onClose();
    }, 1400);
  };

  // Filter available products for current category
  const filteredProducts = (products || []).filter((p) => {
    if (category === 'faca') return p.category === 'facas';
    if (category === 'tabua') return p.category === 'tabuas';
    if (category === 'copo') return p.category === 'copos';
    if (category === 'afiacao' || category === 'restauracao' || category === 'polimento')
      return p.isService;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#141822] border border-[#2b3348] rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#252d40] bg-[#171b26]">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <h2 className="text-lg font-extrabold text-slate-100">
              Registrar Nova Venda
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-[#232a3d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Splash */}
        {savedSuccess ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-100">
              ✅ Venda registrada!
            </h3>
            <p className="text-3xl font-black text-amber-400 font-mono">
              {formatCurrency(savedSuccess.value)}
            </p>
            <p className="text-xs text-slate-400">
              O Dashboard e as metas foram atualizados automaticamente.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
            {/* 1. O QUE FOI VENDIDO? (Sec. 14) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-amber-500 mb-2.5">
                1. O QUE FOI VENDIDO?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SALE_CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
                        isSelected
                          ? 'bg-amber-600 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(217,119,6,0.3)] scale-[1.02]'
                          : 'bg-[#1b202c] text-slate-200 border-[#2b3348] hover:border-amber-500/50 hover:bg-[#222938]'
                      }`}
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Stock Product Picker */}
            {filteredProducts.length > 0 && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Item do Catálogo / Estoque (Opcional):
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleSelectProduct(e.target.value)}
                  className="w-full bg-[#1b202c] border border-[#2b3348] rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- Personalizado / Venda Rápida --</option>
                  {filteredProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatCurrency(p.sellingPrice)}{' '}
                      {!p.isService && `• Estoque: ${p.stock}`})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 2. VALOR DA VENDA & QUANTIDADE (Sec. 15) */}
            <div className="bg-[#191e2b] p-4 rounded-2xl border border-[#283246] space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                2. VALOR DA VENDA
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <span className="text-[11px] text-slate-400 font-medium block mb-1">
                    Valor Unitário (R$)
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
                      value={unitPrice || ''}
                      onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                      className="w-full bg-[#12151e] border border-[#2e374e] rounded-xl pl-10 pr-3 py-2.5 text-base sm:text-lg font-bold text-amber-400 focus:border-amber-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 font-medium block mb-1">
                    Quantidade
                  </span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full bg-[#12151e] border border-[#2e374e] rounded-xl px-3 py-2.5 text-center text-base sm:text-lg font-bold text-slate-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="flex items-center justify-between pt-2 border-t border-[#252c3f]">
                <span className="text-xs text-slate-400 font-bold uppercase">
                  Total a Receber:
                </span>
                <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {/* 3. FORMA DE PAGAMENTO (Sec. 16) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-amber-500 mb-2">
                3. FORMA DE PAGAMENTO
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-md'
                          : 'bg-[#1b202c] text-slate-300 border-[#2b3348] hover:border-amber-500/40 hover:bg-[#222938]'
                      }`}
                    >
                      {pm.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. CLIENTE & DATA (Sec. 17 - Opcional) */}
            <div className="bg-[#181d2a] p-3.5 rounded-2xl border border-[#262f43] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  Cliente (Opcional)
                </span>
                <span className="text-[10px] text-slate-500">Deixe em branco se não quiser</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nome do cliente"
                  className="bg-[#12151f] border border-[#293248] rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
                />

                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Telefone / WhatsApp (opcional)"
                  className="bg-[#12151f] border border-[#293248] rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400">Data da Venda:</span>
                <input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  className="bg-[#12151f] border border-[#293248] rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 5. FINALIZAR VENDA (Sec. 18) */}
            <button
              id="btn-confirm-salvar-venda"
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black py-3.5 sm:py-4 rounded-2xl shadow-[0_4px_25px_rgba(217,119,6,0.35)] active:scale-[0.98] transition-all text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-2"
            >
              <span>SALVAR VENDA</span>
              <span>•</span>
              <span className="font-mono">{formatCurrency(totalAmount)}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
