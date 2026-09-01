import React, { useState } from 'react';
import { UserRole } from '../types';
import { OFFICIAL_LOGO_URL, MONTH_NAMES_PT } from '../utils/constants';
import { formatMonthYear } from '../utils/calculations';
import { NotificationService } from '../utils/notifications';
import {
  Bell,
  BellRing,
  Moon,
  Shield,
  User,
  Calendar,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenClosing?: () => void;
  onOpenNewSale?: () => void;
  onOpenNewExpense?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedMonth,
  onSelectMonth,
  userRole,
  onChangeRole,
  onOpenClosing,
  onOpenNewSale,
  onOpenNewExpense,
}) => {
  const [notificationsActive, setNotificationsActive] = useState<boolean>(
    NotificationService.getPermission() === 'granted'
  );
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const availableMonths = [
    '2026-06',
    '2026-07',
    '2026-08',
    '2026-09',
    '2026-10',
    '2026-11',
    '2026-12',
  ];

  const handleToggleNotification = async () => {
    if (NotificationService.getPermission() !== 'granted') {
      const res = await NotificationService.requestPermission();
      if (res === 'granted') {
        setNotificationsActive(true);
        NotificationService.sendNotification(
          'Fronteira Cutelaria',
          'Notificações ativadas! Você receberá alertas de metas e ritmo diário.'
        );
      }
    } else {
      NotificationService.playSuccessChime();
      NotificationService.sendNotification(
        'Fronteira Cutelaria',
        'Meta do dia: Continue registrando as vendas para acompanhar o ritmo!'
      );
    }
  };

  return (
    <header className="bg-[#141720] border-b border-[#262c3d] sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Official Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer flex items-center">
            <img
              src={OFFICIAL_LOGO_URL}
              alt="Fronteira Cutelaria - Logo Oficial"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] transition-transform duration-200 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden md:block">
            <span className="text-xs tracking-widest text-amber-500 font-bold uppercase block">
              Sistema de Gestão
            </span>
            <span className="text-sm font-semibold text-slate-300">
              Oficina & Vendas
            </span>
          </div>
        </div>

        {/* Center: Month Selector */}
        <div className="relative">
          <button
            id="month-selector-btn"
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="flex items-center gap-2 bg-[#1d2230] hover:bg-[#252b3d] text-slate-100 border border-[#2d354b] px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-inner"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            <span>{formatMonthYear(selectedMonth)}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showMonthDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMonthDropdown(false)}
              />
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#181d28] border border-[#2e374e] rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden backdrop-blur-md">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#252c3f]">
                  Selecione o Mês
                </div>
                {availableMonths.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      onSelectMonth(m);
                      setShowMonthDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center justify-between transition-colors ${
                      m === selectedMonth
                        ? 'bg-amber-600/20 text-amber-400 font-bold'
                        : 'text-slate-200 hover:bg-[#242b3d]'
                    }`}
                  >
                    <span>{formatMonthYear(m)}</span>
                    {m === selectedMonth && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Daily Closing Shortcut */}
          <button
            id="btn-quick-closing"
            onClick={onOpenClosing}
            title="Fechamento do Dia"
            className="flex items-center gap-1.5 bg-[#1a202d] hover:bg-[#22293a] text-slate-200 border border-[#2d364c] px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
            <span className="hidden sm:inline">Fechamento</span>
          </button>

          {/* Daily Target Alerts Push Bell */}
          <button
            id="btn-notifications-bell"
            onClick={handleToggleNotification}
            title="Notificações e Alertas de Metas"
            className="relative p-2 rounded-xl bg-[#1a202d] hover:bg-[#22293a] text-slate-200 border border-[#2d364c] transition-colors"
          >
            {notificationsActive ? (
              <BellRing className="w-4 h-4 text-amber-500 animate-pulse" />
            ) : (
              <Bell className="w-4 h-4 text-slate-400" />
            )}
            <span className="sr-only">Notificações</span>
          </button>

          {/* Role Toggle Pill */}
          <button
            id="btn-toggle-role"
            onClick={() => onChangeRole(userRole === 'admin' ? 'operator' : 'admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all border ${
              userRole === 'admin'
                ? 'bg-amber-600/20 text-amber-400 border-amber-500/40 hover:bg-amber-600/30'
                : 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-600/30'
            }`}
            title={`Perfil atual: ${userRole === 'admin' ? 'Administrador' : 'Operacional'}. Clique para alternar.`}
          >
            {userRole === 'admin' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">Admin</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xs:inline">Operacional</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
