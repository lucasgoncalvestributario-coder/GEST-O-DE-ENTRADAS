import React, { useState } from 'react';
import { TargetCalculation, GorduraUsage } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';
import { triggerCelebrationEffect } from '../utils/celebration';
import { NotificationService } from '../utils/notifications';
import {
  ShieldCheck,
  X,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  Trash2,
  Calendar,
  Layers,
} from 'lucide-react';

interface GorduraModalProps {
  isOpen: boolean;
  onClose: () => void;
  calc: TargetCalculation;
  todayDateStr: string;
  onApplyGordura: (date: string, amount: number, reason?: string) => void;
  onDeleteUsage: (id: string) => void;
}

export const GorduraModal: React.FC<GorduraModalProps> = ({
  isOpen,
  onClose,
  calc,
  todayDateStr,
  onApplyGordura,
  onDeleteUsage,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);
  const [amountStr, setAmountStr] = useState<string>('');
  const [reason, setReason] = useState<string>('Completar meta diária');
  const [activeTab, setActiveTab] = useState<'use' | 'history'>('use');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const gordura = calc.gorduraBalance;
  const availableGordura = gordura?.available || 0;

  // Find info for selected date
  const dayTargetInfo = calc.dayTargets.find((d) => d.date === selectedDate);
  const dayTarget = dayTargetInfo?.target || 0;

  // Actual sales on selected date
  const daySalesInfo = gordura?.daysWithSurplus.find((d) => d.date === selectedDate);
  const daySales = daySalesInfo?.sales || 0;
  const dayGorduraUsed = daySalesInfo?.gorduraUsed || 0;
  const dayEffective = daySales + dayGorduraUsed;
  const dayMissing = Math.max(0, dayTarget - dayEffective);

  const handleQuickFillMissing = () => {
    if (dayMissing <= 0) {
      setErrorMsg('A meta deste dia já está batida!');
      return;
    }
    const maxUsable = Math.min(dayMissing, availableGordura);
    setAmountStr(maxUsable.toFixed(2));
    setErrorMsg(null);
  };

  const handleQuickFillAllAvailable = () => {
    setAmountStr(availableGordura.toFixed(2));
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr.replace(',', '.'));

    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Informe um valor válido maior que zero.');
      return;
    }

    if (amount > availableGordura) {
      setErrorMsg(`Saldo insuficiente no Banco de Gordura. Disponível: ${formatCurrency(availableGordura)}`);
      return;
    }

    onApplyGordura(selectedDate, amount, reason);
    NotificationService.playSuccessChime();

    // If day was completed, celebrate
    if (daySales + dayGorduraUsed + amount >= dayTarget && dayTarget > 0) {
      triggerCelebrationEffect('day');
    }

    setAmountStr('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#141824] border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#252d42] bg-gradient-to-r from-[#192033] via-[#1c2438] to-[#192033]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                <span>Banco de Gordura</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Reserva de Metas
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                O excedente das vendas acima da meta fica guardado aqui para socorrer dias mais fracos.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-[#252d42] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Balance Banner */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          <div className="bg-gradient-to-br from-[#1a2133] via-[#1e273d] to-[#161a29] border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-400/90 uppercase tracking-wider block">
                  Saldo Disponível no Banco de Gordura
                </span>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tracking-tight mt-1 flex items-center gap-2">
                  <span>{formatCurrency(availableGordura)}</span>
                </div>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#121622]/80 border border-[#2a344d] px-3 py-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    Gerado (+):
                  </span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {formatCurrency(gordura?.totalGenerated || 0)}
                  </span>
                </div>

                <div className="bg-[#121622]/80 border border-[#2a344d] px-3 py-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold flex items-center gap-1">
                    <ArrowDownRight className="w-3 h-3 text-rose-400" />
                    Usado (-):
                  </span>
                  <span className="text-sm font-bold text-rose-400 font-mono">
                    {formatCurrency(gordura?.totalUsed || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center border-b border-[#242c3f]">
            <button
              onClick={() => setActiveTab('use')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'use'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Usar Gordura no Dia</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'history'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Extrato / Histórico ({gordura?.usages.length || 0})</span>
            </button>
          </div>

          {/* TAB 1: USAR GORDURA */}
          {activeTab === 'use' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {availableGordura <= 0 ? (
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Banco de Gordura zerado</strong>
                    <p className="mt-0.5 opacity-90 leading-relaxed">
                      Sempre que você realizar vendas acima da meta de qualquer dia, o valor excedente será automaticamente creditado aqui.
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Date selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Data para aplicar a gordura:</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setErrorMsg(null);
                  }}
                  className="w-full bg-[#181e2b] border border-[#2b354b] focus:border-amber-500 text-slate-100 px-3.5 py-2.5 rounded-xl text-sm font-mono outline-none"
                />
              </div>

              {/* Day info snapshot */}
              <div className="bg-[#171c28] border border-[#273044] p-3.5 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Meta calculada deste dia:</span>
                  <strong className="text-slate-200 font-mono">{formatCurrency(dayTarget)}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Vendas reais realizadas:</span>
                  <strong className="text-emerald-400 font-mono">{formatCurrency(daySales)}</strong>
                </div>
                {dayGorduraUsed > 0 && (
                  <div className="flex items-center justify-between text-amber-300">
                    <span>Gordura já aplicada neste dia:</span>
                    <strong className="font-mono">+{formatCurrency(dayGorduraUsed)}</strong>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-[#232a3d] font-bold">
                  <span className="text-slate-300">Falta para bater a meta:</span>
                  <span
                    className={`font-mono text-sm ${
                      dayMissing > 0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {dayMissing > 0 ? formatCurrency(dayMissing) : 'Meta já batida! 🎉'}
                  </span>
                </div>
              </div>

              {/* Amount input & quick helpers */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Valor a Resgatar da Gordura (R$):
                  </label>
                  {dayMissing > 0 && availableGordura > 0 && (
                    <button
                      type="button"
                      onClick={handleQuickFillMissing}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
                    >
                      Preencher exatamente o que falta ({formatCurrency(Math.min(dayMissing, availableGordura))})
                    </button>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={availableGordura}
                    placeholder="0,00"
                    value={amountStr}
                    onChange={(e) => {
                      setAmountStr(e.target.value);
                      setErrorMsg(null);
                    }}
                    disabled={availableGordura <= 0}
                    className="w-full bg-[#181e2b] border border-[#2b354b] focus:border-amber-500 text-slate-100 pl-10 pr-4 py-3 rounded-xl text-lg font-black font-mono outline-none disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {dayMissing > 0 && availableGordura >= dayMissing && (
                    <button
                      type="button"
                      onClick={handleQuickFillMissing}
                      className="flex-1 py-1.5 px-2.5 bg-[#202738] hover:bg-[#2a344a] text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors"
                    >
                      🎯 Completar Meta ({formatCurrency(dayMissing)})
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleQuickFillAllAvailable}
                    disabled={availableGordura <= 0}
                    className="py-1.5 px-2.5 bg-[#202738] hover:bg-[#2a344a] text-slate-300 border border-[#2e384e] rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    Usar Todo Saldo ({formatCurrency(availableGordura)})
                  </button>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Motivo / Observação:
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Atingimento da meta diária"
                  className="w-full bg-[#181e2b] border border-[#2b354b] focus:border-amber-500 text-slate-100 px-3.5 py-2.5 rounded-xl text-xs outline-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={availableGordura <= 0}
                className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black py-3.5 px-4 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-amber-600/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Aplicar Gordura para o Dia</span>
              </button>
            </form>
          )}

          {/* TAB 2: HISTÓRICO / EXTRATO */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Usages list */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                  <span>Resgates Realizados (Gordura Usada)</span>
                </h4>

                {(!gordura?.usages || gordura.usages.length === 0) ? (
                  <div className="p-4 rounded-xl bg-[#161a26] border border-[#242b3d] text-center text-xs text-slate-500">
                    Nenhum resgate de gordura realizado ainda neste mês.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-44 overflow-y-auto">
                    {gordura.usages.map((u: GorduraUsage) => (
                      <div
                        key={u.id}
                        className="bg-[#171c29] border border-[#273043] p-3 rounded-xl flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-200">
                              {formatDate(u.date)}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(u.createdAt).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {u.reason || 'Completar meta'}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-rose-400 text-sm">
                            -{formatCurrency(u.amount)}
                          </span>
                          <button
                            onClick={() => onDeleteUsage(u.id)}
                            title="Reverter/Excluir resgate"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Surplus Generated Days */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dias que Geraram Gordura (Vendas Acima da Meta)</span>
                </h4>

                {(!gordura?.daysWithSurplus || gordura.daysWithSurplus.filter((d) => d.surplusGenerated > 0).length === 0) ? (
                  <div className="p-4 rounded-xl bg-[#161a26] border border-[#242b3d] text-center text-xs text-slate-500">
                    Ainda não há dias com vendas acima da meta neste mês.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-44 overflow-y-auto">
                    {gordura.daysWithSurplus
                      .filter((d) => d.surplusGenerated > 0)
                      .map((d) => (
                        <div
                          key={d.date}
                          className="bg-[#171c29] border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-slate-200">
                              {formatDate(d.date)} ({d.dayOfWeekName})
                            </span>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Meta: {formatCurrency(d.dailyTarget)} • Vendeu: {formatCurrency(d.sales)}
                            </p>
                          </div>

                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            +{formatCurrency(d.surplusGenerated)}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
