import React, { useState } from 'react';
import { DailyClosingData, Sale, Expense } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';
import {
  Moon,
  X,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Calendar,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface DailyClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  closingData: DailyClosingData;
  sales?: Sale[];
  expenses?: Expense[];
  onOpenGorduraModal?: () => void;
  onQuickCompleteWithGordura?: (date: string, missingAmount: number) => void;
}

export const DailyClosingModal: React.FC<DailyClosingModalProps> = ({
  isOpen,
  onClose,
  closingData,
  sales = [],
  expenses = [],
  onOpenGorduraModal,
  onQuickCompleteWithGordura,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !closingData) return null;

  const safeSales = sales || [];
  const safeExpenses = expenses || [];

  const daySales = safeSales.filter((s) => s.date === closingData.date);
  const dayExpenses = safeExpenses.filter((e) => e.date === closingData.date);

  const availableGordura = closingData.availableGordura || 0;
  const gorduraUsed = closingData.gorduraUsedToday || 0;
  const effectiveSales = closingData.effectiveSalesToday ?? (closingData.salesToday + gorduraUsed);

  const generateWhatsAppSummary = () => {
    let statusText = '';
    if (closingData.isDailyTargetMet) {
      if (gorduraUsed > 0) {
        statusText = `✅ Meta do dia batida com auxílio de ${formatCurrency(gorduraUsed)} da Gordura!`;
      } else {
        statusText = '✅ Meta do dia atingida!';
      }
    } else {
      statusText = `⚠️ Ficamos ${formatCurrency(closingData.diff)} abaixo da meta de hoje.`;
    }

    const tierBadge = closingData.dayTier === 'alta'
      ? '🔥 Meta Alta (Sexta a Domingo)'
      : closingData.dayTier === 'media'
      ? '⚡ Meta Média (Segunda-feira)'
      : '🌱 Meta Baixa (Terça a Quinta)';

    return `*🌙 FECHAMENTO DO DIA — FRONTEIRA CUTELARIA*
📅 Data: ${formatDate(closingData.date)} (${closingData.dayOfWeekName || ''})
🎯 Tipo de Meta: ${tierBadge}

💰 *Vendas reais hoje:* ${formatCurrency(closingData.salesToday)} (${closingData.salesCount} vendas)${
      gorduraUsed > 0 ? `\n🛡️ *Gordura resgatada:* +${formatCurrency(gorduraUsed)} (Total efetivo: ${formatCurrency(effectiveSales)})` : ''
    }
💸 *Saídas hoje:* ${formatCurrency(closingData.expensesToday)} (${closingData.expensesCount} saídas)
💵 *Resultado do dia:* ${formatCurrency(closingData.resultToday)}

🎯 *Meta do dia:* ${formatCurrency(closingData.dailyTarget)}
📌 *Status:* ${statusText}`;
  };

  const handleCopy = () => {
    const text = generateWhatsAppSummary();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#141822] border border-[#2b3348] rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#252d40] bg-[#171b26]">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-extrabold text-slate-100">
              🌙 Fechamento do Dia
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-[#232a3d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          <div className="flex items-center justify-between text-xs text-slate-400 bg-[#1a202d] px-3.5 py-2 rounded-xl border border-[#2c354a]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              Data de Referência:
            </span>
            <strong className="text-slate-200 font-mono text-sm">
              {formatDate(closingData.date)}
            </strong>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#181d2a] border border-[#283246] p-3.5 rounded-2xl">
              <span className="text-xs text-slate-400 font-bold block uppercase">
                Vendas Hoje
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">
                {formatCurrency(closingData.salesToday)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {closingData.salesCount} vendas realizadas
              </span>
            </div>

            <div className="bg-[#181d2a] border border-[#283246] p-3.5 rounded-2xl">
              <span className="text-xs text-slate-400 font-bold block uppercase">
                Saídas Hoje
              </span>
              <span className="text-xl font-black text-rose-400 font-mono mt-0.5 block">
                {formatCurrency(closingData.expensesToday)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {closingData.expensesCount} despesas pagas
              </span>
            </div>
          </div>

          {/* Net Result & Daily Goal */}
          <div className="bg-[#191f2d] border border-[#2d374d] p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">
                Resultado Líquido do Dia:
              </span>
              <span
                className={`text-2xl font-black font-mono ${
                  closingData.resultToday >= 0 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {formatCurrency(closingData.resultToday)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#262f43] text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span>Meta Diária</span>
                {closingData.dayOfWeekName && (
                  <span className="text-[10px] text-slate-500">
                    ({closingData.dayOfWeekName})
                  </span>
                )}
                {closingData.dayTier && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    closingData.dayTier === 'alta'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : closingData.dayTier === 'media'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {closingData.dayTierLabel || (closingData.dayTier === 'alta' ? 'Meta Alta' : closingData.dayTier === 'media' ? 'Meta Média' : 'Meta Baixa')}
                  </span>
                )}
              </span>
              <div className="text-right">
                <span className="font-mono font-bold text-slate-200">
                  {formatCurrency(closingData.dailyTarget)}
                </span>
                {gorduraUsed > 0 && (
                  <span className="block text-[11px] text-amber-300 font-mono">
                    (+{formatCurrency(gorduraUsed)} da Gordura)
                  </span>
                )}
                {effectiveSales > 0 && !closingData.isDailyTargetMet && (
                  <span className="block text-[11px] text-amber-400 font-mono">
                    (Falta: {formatCurrency(closingData.remainingDailyTarget)})
                  </span>
                )}
                {closingData.isDailyTargetMet && (
                  <span className="block text-[11px] text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Meta Atingida!</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Gordura Option when target is not met */}
          {!closingData.isDailyTargetMet && availableGordura > 0 && (
            <div className="bg-gradient-to-r from-amber-500/20 via-amber-600/15 to-transparent border-2 border-amber-500/40 p-4 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
                    Usar Reserva do Banco de Gordura
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300">
                  Saldo: {formatCurrency(availableGordura)}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Você pode usar o saldo de gordura acumulado dos dias anteriores para bater a meta de hoje ({formatCurrency(closingData.remainingDailyTarget)} restantes).
              </p>
              <div className="flex items-center gap-2 pt-1">
                {onQuickCompleteWithGordura && (
                  <button
                    type="button"
                    onClick={() => onQuickCompleteWithGordura(closingData.date, closingData.remainingDailyTarget)}
                    className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow"
                  >
                    🎯 Completar com Gordura ({formatCurrency(Math.min(closingData.remainingDailyTarget, availableGordura))})
                  </button>
                )}
                {onOpenGorduraModal && (
                  <button
                    type="button"
                    onClick={onOpenGorduraModal}
                    className="py-2 px-3 bg-[#242c3f] hover:bg-[#303a52] text-slate-200 border border-[#374462] rounded-xl text-xs font-bold transition-all"
                  >
                    Personalizar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Status Message */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              closingData.isDailyTargetMet
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}
          >
            {closingData.isDailyTargetMet ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-sm">
                {closingData.isDailyTargetMet
                  ? gorduraUsed > 0
                    ? `✅ Meta do dia batida com auxílio da Gordura!`
                    : '✅ Meta do dia atingida!'
                  : `⚠️ Ficamos ${formatCurrency(closingData.diff)} abaixo da meta de hoje.`}
              </h4>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                {closingData.isDailyTargetMet
                  ? 'Excelente trabalho! O faturamento do dia atingiu a meta planejada.'
                  : 'A meta diária é uma referência de ritmo para distribuir os objetivos do mês.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-[#252d40] hover:bg-[#303a52] text-slate-100 font-bold py-3 px-4 rounded-xl text-xs transition-colors border border-[#374462]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">Copiado para o WhatsApp!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>Copiar Resumo (WhatsApp)</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="bg-amber-600 hover:bg-amber-700 text-slate-950 font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
