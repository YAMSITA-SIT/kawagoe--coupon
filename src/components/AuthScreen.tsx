import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Language, ThemeColorConfig, UserProfile } from '../types';
import { translations } from '../data/translations';

interface AuthScreenProps {
  language: Language;
  themeConfig: ThemeColorConfig;
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  language,
  themeConfig,
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const t = translations[language];
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userProfile: UserProfile = {
      isLoggedIn: true,
      isGuest: false,
      name: name.trim() || (isRegisterMode ? (language === 'ja' ? '小江戸散策会員' : 'Koedo Member') : '山下　暉登'),
      email: email.trim() || 'user@kawagoe-smart.jp',
      favoriteArea: language === 'ja' ? '一番街・蔵造りの町並み' : 'Kurazukuri Street',
    };
    onLoginSuccess(userProfile);
    onClose();
  };

  const handleGuestContinue = () => {
    const guestProfile: UserProfile = {
      isLoggedIn: false,
      isGuest: true,
      name: language === 'ja' ? '山下暉登' : 'Guest Visitor',
      email: '',
      favoriteArea: language === 'ja' ? '川越駅周辺' : 'Kawagoe Station Area',
    };
    onLoginSuccess(guestProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col text-stone-900 animate-in zoom-in-95 duration-200">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: 'var(--theme-primary)' }}
            />
            <span className="text-xs font-bold tracking-wider text-stone-700 uppercase">
              {isRegisterMode ? t.authRegisterTitle : t.authLoginTitle}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Brand identity */}
        <div className="px-6 pt-4 pb-2 text-center">
          <h2 className="text-lg font-bold tracking-tight text-stone-900">
            {t.appTitle}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {t.authSubtitle}
          </p>
        </div>

        {/* Tab toggle: Login / Register */}
        <div className="mx-6 p-1 bg-stone-100 rounded-xl flex items-center text-xs font-semibold">
          <button
            type="button"
            onClick={() => setIsRegisterMode(false)}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              !isRegisterMode
                ? 'shadow-sm font-bold text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            style={{
              backgroundColor: !isRegisterMode ? 'var(--theme-primary)' : 'transparent',
              color: !isRegisterMode ? 'var(--theme-contrast-text)' : undefined,
            }}
          >
            {t.authLoginTitle}
          </button>
          <button
            type="button"
            onClick={() => setIsRegisterMode(true)}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              isRegisterMode
                ? 'shadow-sm font-bold text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            style={{
              backgroundColor: isRegisterMode ? 'var(--theme-primary)' : 'transparent',
              color: isRegisterMode ? 'var(--theme-contrast-text)' : undefined,
            }}
          >
            {t.authRegisterTitle}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {isRegisterMode && (
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                {t.authName}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'ja' ? '例: 山下　暉登' : 'e.g. Taro Kawagoe'}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">
              {t.authEmail}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sample@kawagoe-smart.jp"
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">
              {t.authPassword}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--theme-primary)',
              color: 'var(--theme-contrast-text)',
            }}
            className="w-full h-11 rounded-xl text-xs font-bold tracking-wide shadow-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            <span>{isRegisterMode ? t.authSubmitRegister : t.authSubmitLogin}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="relative py-2 flex items-center justify-center">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-2 text-[10px] text-stone-400 uppercase tracking-widest absolute">
              OR
            </span>
          </div>

          {/* Guest Continue Button */}
          <button
            type="button"
            onClick={handleGuestContinue}
            className="w-full h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200 transition-colors flex items-center justify-center gap-1"
          >
            <span>{t.authGuestContinue}</span>
          </button>
          
          <p className="text-[10px] text-stone-500 text-center pt-0.5">
            {t.authGuestHint}
          </p>
        </form>

      </div>
    </div>
  );
};
