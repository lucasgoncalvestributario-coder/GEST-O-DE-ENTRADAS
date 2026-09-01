import React from 'react';
import { TargetCalculation, UserRole, DailyClosingData, Product, Sale, Expense, ClosedPeriod } from '../types';
import { formatCurrency, formatMonthYear } from '../utils/calculations';
import { triggerCelebrationEffect } from '../utils/celebration';
import {
  TrendingUp,
  Target,
  Plus,
  Sparkles,
  Lock,
  Trophy,
  PartyPopper,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react';

interface DashboardViewProps {
  calc: TargetCalculation;
  userRole?: UserRole;
  selectedMonth: string;
  dailyClosing?: DailyClosingData;
  products?: Product[];
  closedPeriods?: ClosedPeriod[];
  sales?: Sale[];
  expenses?: Expense[];
  previousMonthSalesTotal?: number;
  previousMonthName?: string;
  onOpenNewSale: () => void;
  onOpenNewExpense: () => void;
  onOpenDailyClosing?: () => void;
  onOpenGorduraModal?: () => void;
  onQuickCompleteTodayWithGordura?: () => void;
  onNavigateTab?: (tab: 'vendas' | 'saidas' | 'relatorios' | 'configuracoes' | 'dashboard' | 'sales' | 'expenses' | 'reports' | 'settings') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  calc,
  selectedMonth,
  onOpenNewSale,
  onOpenNewExpense,
  onOpenGorduraModal,
  onQuickCompleteTodayWithGordura,
}) => {
  const gordura = calc.gorduraBalance;
  const availableGordura = gordura?.available || 0;
  // Status color styles
  const getStatusStyles = () => {
    switch (calc.status) {
      case 'target_achieved':
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300',
          dot: 'bg-emerald-400',
          gradient: 'from-emerald-600 to-teal-700',
        };
      case 'above_pace':
        return {
          bg: 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-400',
          gradient: 'from-emerald-600 to-emerald-700',
        };
      case 'on_pace':
        return {
          bg: 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300',
          dot: 'bg-emerald-400',
          gradient: 'from-emerald-600 to-amber-600',
        };
      case 'attention':
        return {
          bg: 'bg-amber-950/30 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400',
          gradient: 'from-amber-600 to-orange-700',
        };
      case 'behind_pace':
      default:
        return {
          bg: 'bg-rose-950/30 border-rose-500/40 text-rose-300',
          dot: 'bg-rose-400',
          gradient: 'from-rose-600 to-red-700',
        };
    }
  };

  const statusStyle = getStatusStyles();

  return (
    <div className="space-y-5 sm:space-y-6 pb-12 animate-fade-in">
      {/* 1. Header Greeting & Quick Action Buttons */}
      <div className="bg-gradient-to-r from-[#171b26] via-[#1c2230] to-[#171b26] border border-[#2d364c] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 relative z-10">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center justify-center sm:justify-start gap-2">
              <span>Olá! 👋</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1 font-medium">
              Acompanhamento operacional de{' '}
              <span className="text-amber-400 font-bold">
                {formatMonthYear(selectedMonth)}
              </span>
            </p>
          </div>

          {/* Quick Action Big Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              id="btn-main-nova-venda"
              onClick={onOpenNewSale}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-extrabold px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-[0_4px_20px_rgba(217,119,6,0.35)] active:scale-95 transition-all text-sm sm:text-base tracking-wide"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>＋ NOVA VENDA</span>
            </button>

            <button
              id="btn-main-nova-saida"
              onClick={onOpenNewExpense}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#222838] hover:bg-[#2b3347] text-rose-400 hover:text-rose-300 font-bold border border-rose-500/30 px-3.5 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl active:scale-95 transition-all text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>＋ NOVA SAÍDA</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. CARD PRINCIPAL DA META */}
      <div className="bg-[#151924] border-2 border-amber-600/30 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252c3e] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
              <Target className="w-4 h-4" />
              <span>META DO MÊS</span>
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 font-mono tracking-tight">
              {formatCurrency(calc.targetAmount)}
            </div>
          </div>

          {/* Status Badge Indicator */}
          <div
            className={`inline-flex flex-col sm:items-end p-3 sm:p-3.5 rounded-2xl border ${statusStyle.bg}`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${statusStyle.dot} animate-ping`} />
              <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase">
                {calc.statusTitle}
              </span>
            </div>
            <p className="text-xs sm:text-sm mt-0.5 opacity-90 font-medium">
              {calc.statusMessage}
            </p>
          </div>
        </div>

        {/* Progress & Sold so far */}
        <div className="mt-5 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs sm:text-sm text-slate-400 font-medium block">
                Vendido até agora
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                {formatCurrency(calc.totalSales)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-slate-100 font-mono">
                {calc.progressPercentage.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400 block font-medium">
                da meta atingida
              </span>
            </div>
          </div>

          {/* Large Visual Progress Bar */}
          <div className="w-full bg-[#202636] h-4 sm:h-5 rounded-full overflow-hidden p-0.5 border border-[#2f384d]">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${statusStyle.gradient} transition-all duration-700 shadow-md`}
              style={{ width: `${Math.min(100, Math.max(calc.progressPercentage > 0 ? 3 : 0, calc.progressPercentage))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>0%</span>
            <span>50%</span>
            <span>Meta (100%)</span>
          </div>
        </div>
      </div>

      {/* 3. DUAL METRICS: QUANTO PRECISAMOS VENDER HOJE & PROJEÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Card: Para Bater a Meta */}
        <div className="bg-[#151923] border border-[#283044] hover:border-amber-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>PARA BATER A META</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#22293b] text-slate-300 border border-[#2f3950]">
                {calc.remainingOperationalDays} dias operacionais restantes
              </span>
            </div>

            <div className="mt-3">
              {calc.isTargetMet ? (
                <div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-amber-400" />
                      <span>🎉 META DO MÊS ATINGIDA!</span>
                    </div>
                    <button
                      id="btn-celebrate-month"
                      onClick={() => triggerCelebrationEffect('month')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                    >
                      <PartyPopper className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Comemorar! 🎊</span>
                    </button>
                  </div>
                  <p className="text-slate-300 text-sm mt-1">
                    Você já ultrapassou a meta mensal em{' '}
                    <strong className="text-emerald-300">
                      {formatCurrency(calc.surplusAmount)}
                    </strong>
                    .
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <div className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
                      calc.isTodayTargetMet
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}>
                      {formatCurrency(calc.todayRemainingTarget)}
                    </div>
                    {calc.todayTier && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                        calc.todayTier === 'alta'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : calc.todayTier === 'media'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {calc.todayTier === 'alta' ? '🔥 ' : calc.todayTier === 'media' ? '⚡ ' : '🌱 '}
                        {calc.todayDayOfWeekName}: {calc.todayTierLabel}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
                      <span>Meta ajustada de hoje: <strong className="text-slate-100 font-mono">{formatCurrency(calc.todayTarget)}</strong></span>
                      {calc.todayDeficitAdded !== undefined && calc.todayDeficitAdded > 0 && (
                        <span className="text-amber-400/90 text-[11px] bg-amber-950/40 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                          (Base: {formatCurrency(calc.todayBaseTarget || calc.todayTarget)} + {formatCurrency(calc.todayDeficitAdded)} redistribuído)
                        </span>
                      )}
                      <span className="text-slate-500">•</span>
                      <span>Vendido hoje: <strong className="text-emerald-400 font-mono">{formatCurrency(calc.todaySales)}</strong></span>
                      {calc.todayGorduraUsed > 0 && (
                        <>
                          <span className="text-slate-500">•</span>
                          <span>Gordura resgatada: <strong className="text-amber-300 font-mono">+{formatCurrency(calc.todayGorduraUsed)}</strong></span>
                        </>
                      )}
                    </div>

                    {calc.isTodayTargetMet ? (
                      <div className="flex items-center justify-between flex-wrap gap-2 bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-xl">
                        <p className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>
                            {calc.todayGorduraUsed > 0
                              ? `Meta de hoje batida com auxílio de ${formatCurrency(calc.todayGorduraUsed)} da gordura!`
                              : `Meta de hoje batida (+${formatCurrency(calc.todaySurplus)} no Banco de Gordura)!`}
                          </span>
                        </p>
                        <button
                          id="btn-celebrate-day"
                          onClick={() => triggerCelebrationEffect('day')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wide active:scale-95 transition-all shadow"
                        >
                          <PartyPopper className="w-3 h-3 stroke-[2.5]" />
                          <span>Comemorar! 🎊</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-400">
                          <p>
                            Falta vender <strong className="text-amber-300 font-mono">{formatCurrency(calc.todayRemainingTarget)}</strong> hoje para atingir o objetivo do dia.
                          </p>
                          <span className="text-[11px] text-slate-500">
                            (Se não bater, o valor faltante é redistribuído nos dias restantes)
                          </span>
                        </div>

                        {/* Fast 1-Click Gordura Rescue Button */}
                        {availableGordura > 0 && onQuickCompleteTodayWithGordura && (
                          <div className="bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent border border-amber-500/30 p-2.5 rounded-xl flex items-center justify-between gap-2 flex-wrap">
                            <div className="text-xs text-amber-200">
                              <span className="font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                                Saldo de Gordura: {formatCurrency(availableGordura)}
                              </span>
                            </div>
                            <button
                              id="btn-quick-gordura-rescue"
                              type="button"
                              onClick={onQuickCompleteTodayWithGordura}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg uppercase tracking-wide shadow-md active:scale-95 transition-all flex items-center gap-1"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>
                                {availableGordura >= calc.todayRemainingTarget
                                  ? `Completar Meta (${formatCurrency(calc.todayRemainingTarget)})`
                                  : `Usar Gordura (${formatCurrency(availableGordura)})`}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Operational Days Info */}
          {calc.closedDaysCount > 0 && (
            <div className="mt-4 pt-3 border-t border-[#232a3d] flex items-center gap-2 text-xs text-amber-300/90 bg-amber-500/10 px-3 py-2 rounded-xl">
              <Lock className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
              <span>
                Considerando {calc.closedDaysCount} dias com loja fechada neste mês.
              </span>
            </div>
          )}
        </div>

        {/* Card: Projeção do Mês */}
        <div className="bg-[#151923] border border-[#283044] hover:border-amber-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>PROJEÇÃO DO MÊS</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#22293b] text-slate-300 border border-[#2f3950]">
                Média diária: {formatCurrency(calc.operationalDailyAverage)}
              </span>
            </div>

            <div className="mt-3">
              <div className="text-3xl sm:text-4xl font-black text-slate-100 font-mono tracking-tight text-emerald-400">
                {formatCurrency(calc.projectionAmount)}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Se continuarmos nesse ritmo, essa é a previsão de faturamento para o final do mês.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#232a3d] flex items-center justify-between text-xs text-slate-400">
            <span>
              {calc.elapsedOperationalDays} dias operacionais decorridos
            </span>
            <span className="font-semibold text-slate-300">
              Total do mês: {calc.operationalDaysTotal} dias úteis
            </span>
          </div>
        </div>
      </div>

      {/* 4. BANCO DE GORDURA (RESERVA DE METAS) OVERVIEW CARD */}
      <div className="bg-gradient-to-r from-[#171d2b] via-[#1a2233] to-[#171d2b] border-2 border-amber-500/30 hover:border-amber-500/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                BANCO DE GORDURA (RESERVA DE METAS)
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
                {formatCurrency(availableGordura)}
              </div>
              <span className="text-xs text-slate-400">
                saldo livre disponível para socorrer metas diárias
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gerado no mês: <strong className="text-emerald-400 font-mono font-bold">{formatCurrency(gordura?.totalGenerated || 0)}</strong></span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                <span>Utilizado no mês: <strong className="text-rose-400 font-mono font-bold">{formatCurrency(gordura?.totalUsed || 0)}</strong></span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {onOpenGorduraModal && (
              <button
                id="btn-open-gordura-modal"
                onClick={onOpenGorduraModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Gerenciar Gordura</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
