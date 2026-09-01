import React, { useState } from 'react';
import {
  UserRole,
  ClosedPeriod,
  ClosedReason,
  Product,
  Customer,
  Supplier,
  Sale,
} from '../types';
import { CLOSED_REASONS } from '../utils/constants';
import {
  formatCurrency,
  formatDate,
  formatMonthYear,
  calculateDayTargetsForMonth,
  getDayWeightAndTier,
  DAY_OF_WEEK_NAMES,
} from '../utils/calculations';
import { NotificationService } from '../utils/notifications';
import {
  Target,
  Calendar as CalendarIcon,
  Trash2,
  CheckCircle,
  Lock,
  Sparkles,
  Layers,
  Info,
} from 'lucide-react';

interface SettingsViewProps {
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  currentGoal: number;
  onSaveGoal: (month: string, target: number) => void;
  closedPeriods?: ClosedPeriod[];
  onAddClosedPeriod: (period: Omit<ClosedPeriod, 'id' | 'monthKeys'>) => void;
  onDeleteClosedPeriod: (id: string) => void;
  products?: Product[];
  onAddProduct?: (product: Omit<Product, 'id'>) => void;
  onDeleteProduct?: (id: string) => void;
  customers?: Customer[];
  onAddCustomer?: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onDeleteCustomer?: (id: string) => void;
  suppliers?: Supplier[];
  onAddSupplier?: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  onDeleteSupplier?: (id: string) => void;
  sales?: Sale[];
  onResetDemoData?: () => void;
  onResetToZeroed?: () => void;
}

type SettingsSection = 'meta' | 'dias_fechados';

export const SettingsView: React.FC<SettingsViewProps> = ({
  userRole,
  onChangeRole,
  selectedMonth,
  currentGoal,
  onSaveGoal,
  closedPeriods = [],
  onAddClosedPeriod,
  onDeleteClosedPeriod,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('meta');

  // --- Goal state ---
  const [goalInput, setGoalInput] = useState<number>(currentGoal);
  const [goalSavedMsg, setGoalSavedMsg] = useState(false);

  // --- Closed Period Form ---
  const [closedName, setClosedName] = useState('');
  const [closedStart, setClosedStart] = useState(selectedMonth + '-10');
  const [closedEnd, setClosedEnd] = useState(selectedMonth + '-14');
  const [closedReason, setClosedReason] = useState<ClosedReason>('evento');
  const [closedNotes, setClosedNotes] = useState('');

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (goalInput > 0) {
      onSaveGoal(selectedMonth, goalInput);
      setGoalSavedMsg(true);
      NotificationService.playSuccessChime();
      setTimeout(() => setGoalSavedMsg(false), 2000);
    }
  };

  const handleCreateClosedPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closedName || !closedStart || !closedEnd) return;

    onAddClosedPeriod({
      name: closedName.trim(),
      startDate: closedStart,
      endDate: closedEnd,
      reason: closedReason,
      notes: closedNotes.trim() || undefined,
    });

    setClosedName('');
    setClosedNotes('');
    NotificationService.playSuccessChime();
  };

  // Build calendar matrix and day targets for selected month
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const monthIdx = parseInt(monthStr, 10) - 1;
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const firstDayWeekIdx = new Date(year, monthIdx, 1).getDay(); // 0 = Sunday

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Calculate weighted daily targets preview
  const dayTargetsPreview = calculateDayTargetsForMonth(selectedMonth, goalInput || currentGoal, closedPeriods);
  const openDaysCount = dayTargetsPreview.filter((d) => !d.isClosed).length;
  const totalCalculatedTargets = dayTargetsPreview.reduce((sum, d) => sum + d.target, 0);

  // Representative sample daily targets by day of week
  const sampleMonday = dayTargetsPreview.find((d) => d.dayOfWeek === 1 && !d.isClosed)?.target || 0;
  const sampleTueThu = dayTargetsPreview.find((d) => (d.dayOfWeek === 2 || d.dayOfWeek === 3 || d.dayOfWeek === 4) && !d.isClosed)?.target || 0;
  const sampleFriSun = dayTargetsPreview.find((d) => (d.dayOfWeek === 5 || d.dayOfWeek === 6 || d.dayOfWeek === 0) && !d.isClosed)?.target || 0;

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Top Header */}
      <div className="bg-[#151923] border border-[#283144] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100">
              Configurações e Metas
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Definição de metas mensais, distribuição inteligente diária e períodos de fechamento da cutelaria.
          </p>
        </div>

        {/* Role Toggle Pill */}
        <div className="flex items-center gap-2 bg-[#12151e] p-1.5 rounded-2xl border border-[#293248]">
          <button
            onClick={() => onChangeRole('operator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              userRole === 'operator'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Operacional
          </button>
          <button
            onClick={() => onChangeRole('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              userRole === 'admin'
                ? 'bg-amber-600 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Administrador
          </button>
        </div>
      </div>

      {/* Subnavigation Bar (Only Meta & Dias Fechados) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'meta' as SettingsSection, label: '🎯 Meta do Mês & Distribuição Diária' },
          { id: 'dias_fechados' as SettingsSection, label: '📅 Dias Fechados (Eventos / Feiras)' },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
              activeSection === sec.id
                ? 'bg-amber-600/20 text-amber-400 border-amber-500/50 shadow-sm'
                : 'bg-[#151923] text-slate-400 border-[#262f43] hover:text-slate-200 hover:bg-[#1c2230]'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: META DO MÊS */}
      {activeSection === 'meta' && (
        <div className="space-y-6">
          <div className="bg-[#151923] border border-[#283144] rounded-3xl p-5 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-[#242c3f] pb-4">
              <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" />
                <span>Configuração da Meta Mensal</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Defina o objetivo financeiro de faturamento para {formatMonthYear(selectedMonth)}.
              </p>
            </div>

            <form onSubmit={handleSaveGoal} className="max-w-md space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Mês Selecionado
                </label>
                <div className="bg-[#11141d] border border-[#283146] rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-100 font-mono">
                  {formatMonthYear(selectedMonth)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Valor da Meta Mensal (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    R$
                  </span>
                  <input
                    type="number"
                    step="100"
                    min="100"
                    required
                    value={goalInput}
                    onChange={(e) => setGoalInput(parseFloat(e.target.value) || 0)}
                    placeholder="20000"
                    className="w-full bg-[#11141d] border border-[#283146] rounded-xl pl-10 pr-3 py-2.5 text-lg font-black text-amber-400 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  SALVAR META
                </button>

                {goalSavedMsg && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fade-in">
                    <CheckCircle className="w-4 h-4" />
                    Meta atualizada com sucesso!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Intelligent Day-of-Week Distribution Card */}
          <div className="bg-[#151923] border border-[#283144] rounded-3xl p-5 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-[#242c3f] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Distribuição Diária Automática e Ponderada</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  A meta mensal é fracionada automaticamente de acordo com os dias da semana para refletir o movimento real da cutelaria.
                </p>
              </div>

              <span className="text-xs font-bold font-mono px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl w-fit">
                Total Acumulado: {formatCurrency(totalCalculatedTargets)} (100%)
              </span>
            </div>

            {/* 3 Tiers Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Segunda: Meta Média */}
              <div className="bg-[#181d2a] border border-amber-500/30 p-4 sm:p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <span>⚡</span> Segunda-feira
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Meta Média
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-100 font-mono mt-2">
                  ~{formatCurrency(sampleMonday)}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Dia de início da semana, retomada de contatos e encomendas.
                </p>
              </div>

              {/* Terça, Quarta, Quinta: Meta Baixa */}
              <div className="bg-[#181d2a] border border-emerald-500/30 p-4 sm:p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <span>🌱</span> Terça, Quarta & Quinta
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Meta Baixa
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-100 font-mono mt-2">
                  ~{formatCurrency(sampleTueThu)}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Dias de oficina, fabricação, restauração e preparo de lâminas.
                </p>
              </div>

              {/* Sexta, Sábado, Domingo: Meta Alta */}
              <div className="bg-[#181d2a] border border-rose-500/30 p-4 sm:p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
                    <span>🔥</span> Sexta, Sábado & Domingo
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    Meta Alta
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-100 font-mono mt-2">
                  ~{formatCurrency(sampleFriSun)}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pico de vendas presenciais, presentes para churrasco e eventos.
                </p>
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2.5">
              <div className="p-3.5 bg-[#12151e] border border-[#273043] rounded-2xl text-xs text-slate-400 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Garantia Matemática de Fechamento:</strong> Caso a loja esteja fechada em algum dia (ex: feira ou evento), a meta daquele dia é automaticamente redistribuída entre os outros {openDaysCount} dias operacionais abertos, mantendo o faturamento total do mês intacto.
                </div>
              </div>

              <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-xs text-amber-200/90 flex items-start gap-2.5">
                <Target className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Compensação Automática de Metas Não Batidas:</strong> Quando a meta não é batida em algum dia, o valor que faltou é automaticamente distribuído em partes iguais entre todos os dias restantes do mês, mantendo a meta mensal no ritmo certo.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DIAS FECHADOS & CALENDÁRIO */}
      {activeSection === 'dias_fechados' && (
        <div className="space-y-6">
          {/* Add Closed Period Card */}
          <div className="bg-[#151923] border border-[#283144] rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
            <div className="border-b border-[#242c3f] pb-3">
              <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-500" />
                <span>Cadastrar Período Fechado (🔒 Loja Fechada)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                <strong>Regra:</strong> A meta mensal não é reduzida. O sistema redistribui os valores automaticamente entre os dias operacionais abertos.
              </p>
            </div>

            <form onSubmit={handleCreateClosedPeriod} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Nome do Evento / Motivo
                </label>
                <input
                  type="text"
                  required
                  value={closedName}
                  onChange={(e) => setClosedName(e.target.value)}
                  placeholder="Ex: Feira Gaúcha de Cutelaria"
                  className="w-full bg-[#11141d] border border-[#283146] rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Data Inicial
                </label>
                <input
                  type="date"
                  required
                  value={closedStart}
                  onChange={(e) => setClosedStart(e.target.value)}
                  className="w-full bg-[#11141d] border border-[#283146] rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Data Final
                </label>
                <input
                  type="date"
                  required
                  value={closedEnd}
                  onChange={(e) => setClosedEnd(e.target.value)}
                  className="w-full bg-[#11141d] border border-[#283146] rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Categoria
                </label>
                <select
                  value={closedReason}
                  onChange={(e) => setClosedReason(e.target.value as ClosedReason)}
                  className="w-full bg-[#11141d] border border-[#283146] rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
                >
                  {CLOSED_REASONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.icon} {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  Salvar Período Fechado
                </button>
              </div>
            </form>
          </div>

          {/* Interactive Visual Calendar for the month */}
          <div className="bg-[#151923] border border-[#283144] rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-500" />
                <span>Calendário Operacional e Metas Diárias — {formatMonthYear(selectedMonth)}</span>
              </h4>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
                <div key={d} className="font-bold text-slate-500 uppercase text-[10px] py-1">
                  {d}
                </div>
              ))}

              {/* Leading Empty Cells */}
              {Array.from({ length: firstDayWeekIdx }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2 rounded-xl bg-transparent" />
              ))}

              {/* Month Days */}
              {dayTargetsPreview.map((dayInfo) => {
                const isClosed = dayInfo.isClosed;

                return (
                  <div
                    key={dayInfo.dayNumber}
                    title={
                      isClosed
                        ? `${dayInfo.closedReason || 'Fechado'}`
                        : `${dayInfo.dayOfWeekName} (${dayInfo.tierLabel}): Meta ${formatCurrency(dayInfo.target)}`
                    }
                    className={`min-h-[64px] sm:min-h-[76px] p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between text-left transition-all ${
                      isClosed
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 shadow-inner'
                        : dayInfo.tier === 'alta'
                        ? 'bg-[#1b2234] border-rose-500/30 text-slate-200 hover:border-rose-400'
                        : dayInfo.tier === 'media'
                        ? 'bg-[#182030] border-amber-500/30 text-slate-200 hover:border-amber-400'
                        : 'bg-[#161a26] border-[#273045] text-slate-200 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs">{dayInfo.dayNumber}</span>
                      {!isClosed && (
                        <span className="text-[9px] opacity-70">
                          {dayInfo.tier === 'alta' ? '🔥' : dayInfo.tier === 'media' ? '⚡' : '🌱'}
                        </span>
                      )}
                    </div>
                    {isClosed ? (
                      <span className="text-[9px] font-bold text-amber-400 line-clamp-1 flex items-center gap-1">
                        🔒 FECHADO
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-amber-300">
                        {formatCurrency(dayInfo.target)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* List of Registered Closed Periods */}
          <div className="bg-[#151923] border border-[#283144] rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
            <h4 className="text-sm font-black text-slate-100 uppercase tracking-wider">
              Períodos Fechados Cadastrados
            </h4>

            {closedPeriods.length === 0 ? (
              <p className="text-xs text-slate-500">Nenhum período de fechamento cadastrado.</p>
            ) : (
              <div className="space-y-2.5">
                {closedPeriods.map((period) => (
                  <div
                    key={period.id}
                    className="flex items-center justify-between bg-[#191f2c] border border-[#293246] p-3.5 rounded-2xl text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🔒</span>
                      <div>
                        <div className="font-bold text-slate-100">{period.name}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {formatDate(period.startDate)} até {formatDate(period.endDate)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteClosedPeriod(period.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Excluir período"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
