import React from 'react';
import { Home, Ticket, MapPin, User } from 'lucide-react';
import { MainTab, Language, ThemeColorConfig } from '../types';
import { translations } from '../data/translations';

interface BottomNavBarProps {
  activeTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
  language: Language;
  themeConfig: ThemeColorConfig;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  language,
}) => {
  const t = translations[language];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-stone-200 shadow-[0_-3px_12px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 items-center px-2">
        {/* 1. ホーム */}
        <button
          type="button"
          onClick={() => onChangeTab('home')}
          className="flex flex-col items-center justify-center min-h-[50px] py-1 transition-all active:scale-95 group w-full"
        >
          <Home
            className={`w-5 h-5 transition-colors ${
              activeTab === 'home' ? 'text-stone-900' : 'text-stone-400 group-hover:text-stone-600'
            }`}
          />
          <span
            className="text-[10px] tracking-tight whitespace-nowrap mt-1 font-bold"
            style={{
              color: activeTab === 'home' ? '#1c1917' : '#78716c',
            }}
          >
            {t.tabHome}
          </span>
          {activeTab === 'home' && (
            <span
              className="w-3.5 h-0.5 rounded-full mt-0.5"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            />
          )}
        </button>

        {/* 2. クーポン */}
        <button
          type="button"
          onClick={() => onChangeTab('coupons')}
          className="flex flex-col items-center justify-center min-h-[50px] py-1 transition-all active:scale-95 group w-full"
        >
          <Ticket
            className={`w-5 h-5 transition-colors ${
              activeTab === 'coupons' ? 'text-stone-900' : 'text-stone-400 group-hover:text-stone-600'
            }`}
          />
          <span
            className="text-[10px] tracking-tight whitespace-nowrap mt-1 font-bold"
            style={{
              color: activeTab === 'coupons' ? '#1c1917' : '#78716c',
            }}
          >
            {t.tabCoupons}
          </span>
          {activeTab === 'coupons' && (
            <span
              className="w-3.5 h-0.5 rounded-full mt-0.5"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            />
          )}
        </button>

        {/* 3. マップ */}
        <button
          type="button"
          onClick={() => onChangeTab('map')}
          className="flex flex-col items-center justify-center min-h-[50px] py-1 transition-all active:scale-95 group w-full"
        >
          <MapPin
            className={`w-5 h-5 transition-colors ${
              activeTab === 'map' ? 'text-stone-900' : 'text-stone-400 group-hover:text-stone-600'
            }`}
          />
          <span
            className="text-[10px] tracking-tight whitespace-nowrap mt-1 font-bold"
            style={{
              color: activeTab === 'map' ? '#1c1917' : '#78716c',
            }}
          >
            {t.tabMap}
          </span>
          {activeTab === 'map' && (
            <span
              className="w-3.5 h-0.5 rounded-full mt-0.5"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            />
          )}
        </button>

        {/* 4. アカウント */}
        <button
          type="button"
          onClick={() => onChangeTab('account')}
          className="flex flex-col items-center justify-center min-h-[50px] py-1 transition-all active:scale-95 group w-full"
        >
          <User
            className={`w-5 h-5 transition-colors ${
              activeTab === 'account' ? 'text-stone-900' : 'text-stone-400 group-hover:text-stone-600'
            }`}
          />
          <span
            className="text-[10px] tracking-tight whitespace-nowrap mt-1 font-bold"
            style={{
              color: activeTab === 'account' ? '#1c1917' : '#78716c',
            }}
          >
            {t.tabAccount}
          </span>
          {activeTab === 'account' && (
            <span
              className="w-3.5 h-0.5 rounded-full mt-0.5"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            />
          )}
        </button>
      </div>
    </nav>
  );
};