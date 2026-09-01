import React from 'react';
import { TabType, UserRole } from '../types';
import {
  Home,
  DollarSign,
  TrendingDown,
  BarChart3,
  Settings,
} from 'lucide-react';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userRole?: UserRole;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  userRole = 'admin',
}) => {
  const tabs: Array<{
    id: TabType;
    label: string;
    emoji: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'dashboard', label: 'Início', emoji: '🏠', icon: Home },
    { id: 'sales', label: 'Vendas', emoji: '💰', icon: DollarSign },
    { id: 'expenses', label: 'Saídas', emoji: '💸', icon: TrendingDown },
    { id: 'reports', label: 'Relatórios', emoji: '📊', icon: BarChart3 },
    {
      id: 'settings',
      label: userRole === 'admin' ? 'Configurações' : 'Ajustes',
      emoji: '⚙️',
      icon: Settings,
    },
  ];

  return (
    <nav className="bg-[#12151d]/95 backdrop-blur-md border-t border-[#23293a] fixed bottom-0 left-0 right-0 z-40 shadow-2xl md:relative md:border-t-0 md:border-b md:top-0">
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <div className="flex items-center justify-around sm:justify-start sm:gap-2 py-1.5 sm:py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all relative cursor-pointer select-none ${
                  isActive
                    ? 'bg-amber-600/25 text-amber-400 border border-amber-500/50 shadow-[0_0_15px_rgba(217,119,6,0.2)] font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1f2c] border border-transparent'
                }`}
              >
                <span className="text-base sm:text-lg leading-none">{tab.emoji}</span>
                <span className="tracking-wide text-[11px] sm:text-xs md:text-sm whitespace-nowrap">{tab.label}</span>
                {isActive && (
                  <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-amber-500 ml-1 shadow-[0_0_8px_#f59e0b]"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

