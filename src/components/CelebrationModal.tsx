import React, { useEffect } from 'react';
import { formatCurrency } from '../utils/calculations';
import { triggerCelebrationEffect } from '../utils/celebration';
import { Trophy, Sparkles, X, Flame, CheckCircle2, ArrowRight } from 'lucide-react';

export interface CelebrationInfo {
  type: 'month' | 'day';
  title: string;
  targetAmount: number;
  totalAchieved: number;
  surplusAmount: number;
  dateOrMonthLabel: string;
}

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  celebrationData: CelebrationInfo | null;
  onNewSale?: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  celebrationData,
  onNewSale,
}) => {
  useEffect(() => {
    if (isOpen && celebrationData) {
      triggerCelebrationEffect(celebrationData.type);
    }
  }, [isOpen, celebrationData]);

  if (!isOpen || !celebrationData) return null;

  const isMonth = celebrationData.type === 'month';

  const handleReplayConfetti = () => {
    triggerCelebrationEffect(celebrationData.type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#1c2232] via-[#151923] to-[#10131b] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.35)] text-center overflow-hidden animate-scale-up">
        {/* Background Radiant Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-[#252d3d] rounded-xl transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Animated Badge Icon */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 via-amber-400 to-emerald-400 rounded-full animate-spin [animation-duration:8s] opacity-80 blur-md" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#141824] border-2 border-amber-400/80 rounded-full flex items-center justify-center shadow-xl">
            {isMonth ? (
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 animate-bounce [animation-duration:2s]" />
            ) : (
              <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 animate-bounce [animation-duration:2s]" />
            )}
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-7 h-7 text-amber-300 animate-pulse" />
          <Sparkles className="absolute -bottom-1 -left-1 w-6 h-6 text-emerald-300 animate-pulse" />
        </div>

        {/* Headline */}
        <div className="space-y-1 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Sparkles className="w-3.5 h-3.5" />
            {isMonth ? 'CONQUISTA HISTÓRICA' : 'MISSÃO DO DIA CUMPRIDA'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight mt-2">
            {isMonth ? '🎉 META DO MÊS BATIDA!' : '🎯 META DO DIA CONCLUÍDA!'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            {isMonth
              ? `A Fronteira Cutelaria superou o objetivo estabelecido para ${celebrationData.dateOrMonthLabel}!`
              : `Parabéns! O faturamento de hoje (${celebrationData.dateOrMonthLabel}) atingiu a meta planejada.`}
          </p>
        </div>

        {/* Metrics Box */}
        <div className="my-5 p-4 sm:p-5 bg-[#121520]/80 border border-[#2b354b] rounded-2xl space-y-3 text-left relative z-10">
          <div className="flex items-center justify-between border-b border-[#232c40] pb-2.5">
            <span className="text-xs text-slate-400 font-bold uppercase">Meta Definida:</span>
            <span className="text-sm font-black text-slate-200 font-mono">
              {formatCurrency(celebrationData.targetAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-[#232c40] pb-2.5">
            <span className="text-xs text-slate-400 font-bold uppercase">Total Faturado:</span>
            <span className="text-base font-black text-amber-400 font-mono">
              {formatCurrency(celebrationData.totalAchieved)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs text-emerald-400 font-bold uppercase flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Ultrapassou em:
            </span>
            <span className="text-sm font-black text-emerald-300 font-mono">
              +{formatCurrency(Math.max(0, celebrationData.surplusAmount))}
            </span>
          </div>
        </div>

        {/* Motivational phrase */}
        <p className="text-xs text-slate-400 italic mb-6 relative z-10 px-2">
          "O aço de qualidade se forja com consistência e precisão. Excelente trabalho da equipe!" ⚔️
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
          <button
            onClick={handleReplayConfetti}
            className="w-full sm:w-auto flex-1 bg-[#22293b] hover:bg-[#2c354c] text-amber-400 font-bold py-3 px-4 rounded-xl border border-amber-500/30 text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>🎊 Soltar Mais Confetes</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onNewSale) onNewSale();
            }}
            className="w-full sm:w-auto flex-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black py-3 px-5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Continuar Vendendo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
