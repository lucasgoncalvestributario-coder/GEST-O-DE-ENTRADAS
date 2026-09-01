import { SaleCategory, ExpenseCategory, PaymentMethod, ClosedReason } from '../types';

export const OFFICIAL_LOGO_URL = 'https://i.ibb.co/NgSQ0Fvt/Chat-GPT-Image-30-de-ago-de-2026-14-51-51.png';

export const SALE_CATEGORIES: Array<{
  id: SaleCategory;
  name: string;
  emoji: string;
  isPhysical: boolean;
  color: string;
  defaultProductCategory?: 'facas' | 'tabuas' | 'copos' | 'outros' | 'servicos';
}> = [
  { id: 'faca', name: 'FACA', emoji: '🔪', isPhysical: true, color: 'from-amber-600 to-amber-700', defaultProductCategory: 'facas' },
  { id: 'tabua', name: 'TÁBUA', emoji: '🪵', isPhysical: true, color: 'from-amber-700 to-amber-900', defaultProductCategory: 'tabuas' },
  { id: 'copo', name: 'COPO', emoji: '🥤', isPhysical: true, color: 'from-amber-500 to-amber-600', defaultProductCategory: 'copos' },
  { id: 'afiacao', name: 'AFIAÇÃO', emoji: '🔧', isPhysical: false, color: 'from-blue-600 to-blue-700', defaultProductCategory: 'servicos' },
  { id: 'restauracao', name: 'RESTAURAÇÃO', emoji: '🛠️', isPhysical: false, color: 'from-purple-600 to-purple-700', defaultProductCategory: 'servicos' },
  { id: 'polimento', name: 'POLIMENTO', emoji: '✨', isPhysical: false, color: 'from-emerald-600 to-teal-700', defaultProductCategory: 'servicos' },
  { id: 'outro', name: 'OUTRO', emoji: '➕', isPhysical: false, color: 'from-zinc-600 to-zinc-700', defaultProductCategory: 'outros' },
];

export const EXPENSE_CATEGORIES: Array<{
  id: ExpenseCategory;
  name: string;
  emoji: string;
  color: string;
}> = [
  { id: 'fornecedor', name: 'FORNECEDOR', emoji: '🏭', color: 'from-red-600 to-red-700' },
  { id: 'aluguel', name: 'ALUGUEL', emoji: '🏠', color: 'from-orange-600 to-orange-700' },
  { id: 'ferramenta', name: 'FERRAMENTA', emoji: '🔨', color: 'from-amber-600 to-amber-700' },
  { id: 'material', name: 'MATERIAL', emoji: '🔩', color: 'from-yellow-600 to-yellow-700' },
  { id: 'frete', name: 'FRETE', emoji: '🚚', color: 'from-blue-600 to-blue-700' },
  { id: 'divulgacao', name: 'DIVULGAÇÃO', emoji: '📢', color: 'from-pink-600 to-pink-700' },
  { id: 'pagamento', name: 'PAGAMENTO', emoji: '💰', color: 'from-emerald-600 to-emerald-700' },
  { id: 'contas', name: 'CONTAS', emoji: '💡', color: 'from-cyan-600 to-cyan-700' },
  { id: 'outro', name: 'OUTRO', emoji: '➕', color: 'from-zinc-600 to-zinc-700' },
];

export const PAYMENT_METHODS: Array<{
  id: PaymentMethod;
  name: string;
  badgeColor: string;
}> = [
  { id: 'pix', name: 'PIX', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'dinheiro', name: 'DINHEIRO', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'debito', name: 'DÉBITO', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'credito', name: 'CRÉDITO', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'outro', name: 'OUTRO', badgeColor: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30' },
];

export const CLOSED_REASONS: Array<{
  id: ClosedReason;
  label: string;
  icon: string;
}> = [
  { id: 'evento', label: 'Evento de Cutelaria', icon: '🎪' },
  { id: 'ferias', label: 'Férias', icon: '🏖️' },
  { id: 'feira', label: 'Feira / Exposição', icon: '🏬' },
  { id: 'viagem', label: 'Viagem', icon: '✈️' },
  { id: 'manutencao', label: 'Manutenção da Oficina', icon: '🛠️' },
  { id: 'feriado', label: 'Feriado', icon: '📅' },
  { id: 'outro', label: 'Outro Motivo', icon: '🔒' },
];

export const MONTH_NAMES_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
