import React, { useState } from 'react';
import { TargetCalculation, Sale, Expense, ClosedPeriod } from '../types';
import { OFFICIAL_LOGO_URL, SALE_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_METHODS, MONTH_NAMES_PT } from '../utils/constants';
import { formatCurrency, formatPercentage, formatDate, formatMonthYear } from '../utils/calculations';
import { exportReportToPDF } from '../services/pdfExport';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  DollarSign,
  TrendingDown,
  Target,
  Lock,
  PieChart,
  CheckCircle2,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface ReportsViewProps {
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  calc: TargetCalculation;
  sales: Sale[];
  expenses: Expense[];
  closedPeriods: ClosedPeriod[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  selectedMonth,
  onSelectMonth,
  calc,
  sales = [],
  expenses = [],
  closedPeriods = [],
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const safeSales = sales || [];
  const safeExpenses = expenses || [];
  const safeClosedPeriods = closedPeriods || [];

  const monthSales = safeSales.filter((s) => s.monthKey === selectedMonth);
  const monthExpenses = safeExpenses.filter((e) => e.monthKey === selectedMonth);
  const monthClosed = safeClosedPeriods.filter((p) => p.monthKeys && p.monthKeys.includes(selectedMonth));

  // Sales by Category
  const salesByCategory = SALE_CATEGORIES.map((cat) => {
    const items = monthSales.filter((s) => s.category === cat.id);
    const count = items.reduce((acc, s) => acc + (s.quantity || 1), 0);
    const total = items.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
    return { ...cat, count, total };
  }).filter((c) => c.total > 0 || c.count > 0);

  // Sales by Payment Method
  const salesByPayment = PAYMENT_METHODS.map((pm) => {
    const items = monthSales.filter((s) => s.paymentMethod === pm.id);
    const count = items.length;
    const total = items.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
    return { ...pm, count, total };
  }).filter((p) => p.total > 0);

  // Expenses by Category
  const expensesByCategory = EXPENSE_CATEGORIES.map((cat) => {
    const items = monthExpenses.filter((e) => e.category === cat.id);
    const count = items.length;
    const total = items.reduce((acc, e) => acc + (e.amount || 0), 0);
    return { ...cat, count, total };
  }).filter((c) => c.total > 0);

  // Date range of this month
  const [yearStr, monthStr] = selectedMonth.split('-');
  const totalDays = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10), 0).getDate();
  const periodText = `01/${monthStr}/${yearStr} a ${totalDays}/${monthStr}/${yearStr}`;

  const handleGeneratePDF = async () => {
    setIsExporting(true);
    try {
      await exportReportToPDF('printable-monthly-report', selectedMonth);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Top Action Header */}
      <div className="bg-[#151923] border border-[#283144] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100">
              Relatório Mensal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Período:{' '}
            <strong className="text-amber-400 font-semibold">{periodText}</strong>
          </p>
        </div>

        {/* Action Buttons: PDF & Print */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-gerar-pdf"
            onClick={handleGeneratePDF}
            disabled={isExporting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg active:scale-95 transition-all text-xs sm:text-sm disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>📄 GERAR PDF</span>
          </button>

          <button
            id="btn-imprimir-relatorio"
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-[#202738] hover:bg-[#2a3349] text-slate-100 font-bold border border-[#313c54] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl active:scale-95 transition-all text-xs sm:text-sm"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>🖨️ IMPRIMIR</span>
          </button>
        </div>
      </div>

      {/* Main Report Preview Container (Styled for both Screen & High-Res Print/PDF) */}
      <div
        id="printable-monthly-report"
        className="bg-[#13161f] border border-[#262f43] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-slate-200 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none"
      >
        {/* PDF Header with Official Logo */}
        <div className="border-b border-[#2a3449] print:border-slate-300 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <img
              src={OFFICIAL_LOGO_URL}
              alt="Fronteira Cutelaria"
              className="h-16 sm:h-20 w-auto object-contain drop-shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-500 print:text-amber-800 tracking-wider">
                FRONTEIRA CUTELARIA
              </h2>
              <span className="text-xs sm:text-sm uppercase tracking-widest text-slate-400 print:text-slate-600 font-bold block">
                Relatório Operacional e Financeiro Mensal
              </span>
            </div>
          </div>

          <div className="text-center sm:text-right bg-[#1a202d] print:bg-slate-100 p-3 rounded-2xl border border-[#2d374d] print:border-slate-300">
            <span className="text-xs text-slate-400 print:text-slate-600 block">
              Mês de Referência
            </span>
            <span className="text-base sm:text-lg font-black text-slate-100 print:text-slate-900">
              {formatMonthYear(selectedMonth)}
            </span>
            <span className="text-[11px] text-amber-400 print:text-amber-700 block mt-0.5">
              {periodText}
            </span>
          </div>
        </div>

        {/* 1. RESUMO GERAL */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 print:text-amber-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>1. RESUMO EXECUTIVO</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-[#181e2b] print:bg-slate-50 border border-[#283246] print:border-slate-200 p-3.5 rounded-2xl">
              <span className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 font-bold block uppercase">
                Faturamento
              </span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-400 print:text-emerald-700 font-mono">
                {formatCurrency(calc.totalSales)}
              </span>
            </div>

            <div className="bg-[#181e2b] print:bg-slate-50 border border-[#283246] print:border-slate-200 p-3.5 rounded-2xl">
              <span className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 font-bold block uppercase">
                Despesas
              </span>
              <span className="text-base sm:text-lg font-extrabold text-rose-400 print:text-rose-700 font-mono">
                {formatCurrency(calc.totalExpenses)}
              </span>
            </div>

            <div className="bg-[#181e2b] print:bg-slate-50 border border-[#283246] print:border-slate-200 p-3.5 rounded-2xl">
              <span className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 font-bold block uppercase">
                Resultado
              </span>
              <span
                className={`text-base sm:text-lg font-extrabold font-mono ${
                  calc.netResult >= 0
                    ? 'text-amber-400 print:text-amber-700'
                    : 'text-rose-400 print:text-rose-700'
                }`}
              >
                {formatCurrency(calc.netResult)}
              </span>
            </div>

            <div className="bg-[#181e2b] print:bg-slate-50 border border-[#283246] print:border-slate-200 p-3.5 rounded-2xl">
              <span className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 font-bold block uppercase">
                Meta do Mês
              </span>
              <span className="text-base sm:text-lg font-extrabold text-slate-100 print:text-slate-900 font-mono">
                {formatCurrency(calc.targetAmount)}
              </span>
            </div>

            <div className="bg-[#181e2b] print:bg-slate-50 border border-[#283246] print:border-slate-200 p-3.5 rounded-2xl">
              <span className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 font-bold block uppercase">
                % da Meta
              </span>
              <span className="text-base sm:text-lg font-extrabold text-amber-400 print:text-amber-700 font-mono">
                {calc.progressPercentage.toFixed(1)}%
              </span>
            </div>

            <div className="bg-[#181e2b] print:bg-slate-50 border border-[#283246] print:border-slate-200 p-3.5 rounded-2xl">
              <span className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 font-bold block uppercase">
                Projeção
              </span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-400 print:text-emerald-700 font-mono">
                {formatCurrency(calc.projectionAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. VENDAS POR CATEGORIA (Sec. 22) & PAGAMENTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categorias de Vendas */}
          <div className="bg-[#171c28] print:bg-slate-50 border border-[#283247] print:border-slate-200 rounded-2xl p-4 sm:p-5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 print:text-slate-800 mb-3 flex items-center justify-between">
              <span>💰 Vendas por Categoria</span>
              <span className="text-amber-500 print:text-amber-700 font-mono">
                {calc.salesCount} vendas
              </span>
            </h4>

            {salesByCategory.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">Nenhuma venda registrada.</p>
            ) : (
              <div className="space-y-2">
                {salesByCategory.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-[#242b3c] print:border-slate-200 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span>{c.emoji}</span>
                      <span className="font-bold text-slate-200 print:text-slate-900">
                        {c.name}
                      </span>
                      <span className="text-[11px] text-slate-400 print:text-slate-600 font-mono">
                        ({c.count} un)
                      </span>
                    </div>
                    <span className="font-mono font-bold text-amber-400 print:text-amber-700">
                      {formatCurrency(c.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formas de Pagamento */}
          <div className="bg-[#171c28] print:bg-slate-50 border border-[#283247] print:border-slate-200 rounded-2xl p-4 sm:p-5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 print:text-slate-800 mb-3">
              💳 Formas de Pagamento Recebidas
            </h4>

            {salesByPayment.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">Sem transações no período.</p>
            ) : (
              <div className="space-y-2">
                {salesByPayment.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-[#242b3c] print:border-slate-200 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 print:text-slate-900">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-slate-400 print:text-slate-600 font-mono">
                        ({p.count}x)
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 print:text-emerald-700">
                      {formatCurrency(p.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. SAÍDAS POR CATEGORIA (Sec. 23) */}
        <div className="bg-[#171c28] print:bg-slate-50 border border-[#283247] print:border-slate-200 rounded-2xl p-4 sm:p-5">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 print:text-slate-800 mb-3 flex items-center justify-between">
            <span>💸 Saídas e Despesas por Categoria</span>
            <span className="text-rose-400 print:text-rose-700 font-mono">
              Total: {formatCurrency(calc.totalExpenses)}
            </span>
          </h4>

          {expensesByCategory.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">Nenhuma despesa registrada.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {expensesByCategory.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-[#242b3c] print:border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <span>{c.emoji}</span>
                    <span className="font-bold text-slate-200 print:text-slate-900">
                      {c.name}
                    </span>
                    <span className="text-[11px] text-slate-400 print:text-slate-600 font-mono">
                      ({c.count})
                    </span>
                  </div>
                  <span className="font-mono font-bold text-rose-400 print:text-rose-700">
                    {formatCurrency(c.total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. DIAS FECHADOS & CALENDÁRIO OPERACIONAL */}
        <div className="bg-[#171c28] print:bg-slate-50 border border-[#283247] print:border-slate-200 rounded-2xl p-4 sm:p-5">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 print:text-slate-800 mb-2 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Períodos com Loja Fechada no Mês</span>
          </h4>

          {monthClosed.length === 0 ? (
            <p className="text-xs text-slate-400 print:text-slate-600 py-1">
              Nenhum período de fechamento cadastrado. Todos os dias do mês foram operacionais ({calc.operationalDaysTotal} dias).
            </p>
          ) : (
            <div className="space-y-2 mt-2">
              {monthClosed.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-xs bg-[#121620] print:bg-white border border-[#283246] print:border-slate-300 p-2.5 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 print:text-amber-800 font-bold text-[10px]">
                      🔒 FECHADO
                    </span>
                    <span className="font-bold text-slate-200 print:text-slate-900">
                      {p.name}
                    </span>
                  </div>
                  <span className="text-slate-400 print:text-slate-600 font-mono">
                    {formatDate(p.startDate)} até {formatDate(p.endDate)}
                  </span>
                </div>
              ))}
              <p className="text-[11px] text-slate-400 print:text-slate-600 mt-1">
                Dias operacionais totais calculados: <strong>{calc.operationalDaysTotal} dias</strong>.
              </p>
            </div>
          )}
        </div>

        {/* 5. DISTRIBUIÇÃO PONDERADA DE METAS DIÁRIAS */}
        {calc.dayTargets && calc.dayTargets.length > 0 && (
          <div className="bg-[#171c28] print:bg-slate-50 border border-[#283247] print:border-slate-200 rounded-2xl p-4 sm:p-5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 print:text-slate-800 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>Distribuição Ponderada das Metas Diárias</span>
              </span>
              <span className="text-amber-400 print:text-amber-800 font-mono text-[11px]">
                Meta Mensal: {formatCurrency(calc.targetAmount)}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 text-xs">
              <div className="bg-[#12151f] print:bg-white p-2.5 rounded-xl border border-[#293246] print:border-slate-300">
                <span className="text-amber-400 font-bold block">⚡ Segunda-feira</span>
                <span className="text-[11px] text-slate-400 print:text-slate-600">Meta Média ponderada</span>
              </div>
              <div className="bg-[#12151f] print:bg-white p-2.5 rounded-xl border border-[#293246] print:border-slate-300">
                <span className="text-emerald-400 font-bold block">🌱 Terça a Quinta</span>
                <span className="text-[11px] text-slate-400 print:text-slate-600">Meta Baixa (foco produção)</span>
              </div>
              <div className="bg-[#12151f] print:bg-white p-2.5 rounded-xl border border-[#293246] print:border-slate-300">
                <span className="text-rose-400 font-bold block">🔥 Sexta a Domingo</span>
                <span className="text-[11px] text-slate-400 print:text-slate-600">Meta Alta (pico de vendas)</span>
              </div>
            </div>
          </div>
        )}

        {/* 5.5 BANCO DE GORDURA (RESERVA DE METAS) SUMMARY */}
        <div className="bg-[#171c28] print:bg-slate-50 border border-[#283247] print:border-slate-200 rounded-2xl p-4 sm:p-5">
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 print:text-amber-800 mb-3 flex items-center justify-between">
            <span>🛡️ Banco de Gordura (Reserva de Metas)</span>
            <span className="font-mono text-sm">
              Disponível: {formatCurrency(calc.gorduraBalance?.available || 0)}
            </span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-[#12151f] print:bg-white p-3 rounded-xl border border-[#293246] print:border-slate-300">
              <span className="text-slate-400 print:text-slate-600 block text-[11px] font-bold uppercase">
                Gordura Gerada (+)
              </span>
              <span className="text-sm font-bold text-emerald-400 print:text-emerald-700 font-mono mt-0.5 block">
                {formatCurrency(calc.gorduraBalance?.totalGenerated || 0)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Vendas excedentes nos dias que superaram a meta
              </span>
            </div>

            <div className="bg-[#12151f] print:bg-white p-3 rounded-xl border border-[#293246] print:border-slate-300">
              <span className="text-slate-400 print:text-slate-600 block text-[11px] font-bold uppercase">
                Gordura Utilizada (-)
              </span>
              <span className="text-sm font-bold text-rose-400 print:text-rose-700 font-mono mt-0.5 block">
                {formatCurrency(calc.gorduraBalance?.totalUsed || 0)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Resgates para completar metas em dias de baixo movimento
              </span>
            </div>

            <div className="bg-[#12151f] print:bg-white p-3 rounded-xl border border-[#293246] print:border-slate-300">
              <span className="text-slate-400 print:text-slate-600 block text-[11px] font-bold uppercase">
                Saldo Livre Atual
              </span>
              <span className="text-sm font-bold text-amber-300 print:text-amber-800 font-mono mt-0.5 block">
                {formatCurrency(calc.gorduraBalance?.available || 0)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Reserva disponível para resgate
              </span>
            </div>
          </div>
        </div>

        {/* 6. RESULTADO FINAL CLARO (Sec. 26) */}
        <div className="border-2 border-amber-500/40 print:border-amber-700 bg-gradient-to-r from-[#171b26] via-[#1c2230] to-[#171b26] print:bg-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 print:text-amber-800 mb-4 text-center">
            RESULTADO FINANCEIRO FINAL
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-[#131620] print:bg-white rounded-2xl border border-[#283144] print:border-slate-300">
              <span className="text-xs text-slate-400 print:text-slate-600 font-bold block uppercase">
                TOTAL VENDIDO
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 print:text-emerald-700 font-mono mt-1 block">
                {formatCurrency(calc.totalSales)}
              </span>
            </div>

            <div className="p-3 bg-[#131620] print:bg-white rounded-2xl border border-[#283144] print:border-slate-300">
              <span className="text-xs text-slate-400 print:text-slate-600 font-bold block uppercase">
                TOTAL GASTO
              </span>
              <span className="text-2xl sm:text-3xl font-black text-rose-400 print:text-rose-700 font-mono mt-1 block">
                {formatCurrency(calc.totalExpenses)}
              </span>
            </div>

            <div className="p-3 bg-[#131620] print:bg-white rounded-2xl border border-[#283144] print:border-slate-300">
              <span className="text-xs text-slate-400 print:text-slate-600 font-bold block uppercase">
                RESULTADO
              </span>
              <span
                className={`text-2xl sm:text-3xl font-black font-mono mt-1 block ${
                  calc.netResult >= 0
                    ? 'text-amber-400 print:text-amber-700'
                    : 'text-rose-400 print:text-rose-700'
                }`}
              >
                {formatCurrency(calc.netResult)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer info on print */}
        <div className="text-center text-[11px] text-slate-500 pt-4 border-t border-[#22293b] print:border-slate-200">
          Fronteira Cutelaria • Sistema de Gestão e Cutelaria Artesanal • Gerado em{' '}
          {new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })} às{' '}
          {new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
