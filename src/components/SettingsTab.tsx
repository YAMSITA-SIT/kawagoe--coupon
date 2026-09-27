import React from 'react';
import { 
  Globe, 
  Palette, 
  User, 
  LogOut, 
  LogIn, 
  Check, 
  Info, 
  ShieldCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Language, ThemeColorKey, ThemeColorConfig, UserProfile } from '../types';
import { translations } from '../data/translations';
import { THEME_COLORS } from '../utils/theme';

interface SettingsTabProps {
  language: Language;
  onSetLanguage: (lang: Language) => void;
  currentThemeKey: ThemeColorKey;
  onSetThemeColor: (colorKey: ThemeColorKey) => void;
  userProfile: UserProfile;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  language,
  onSetLanguage,
  currentThemeKey,
  onSetThemeColor,
  userProfile,
  onOpenAuth,
  onLogout,
}) => {
  const t = translations[language];
  const activeConfig = THEME_COLORS[currentThemeKey];

  // Strictly the 9 required colors:
  // 青, 赤, 黄色, オレンジ, 水色, 黒, 白, 緑, 紫
  const colorKeys: ThemeColorKey[] = [
    'blue',    // 青
    'red',     // 赤
    'yellow',  // 黄色
    'orange',  // オレンジ
    'cyan',    // 水色
    'black',   // 黒
    'white',   // 白
    'green',   // 緑
    'purple',  // 紫
  ];

  return (
    <div className="pb-10 px-4 pt-4 space-y-5 max-w-lg mx-auto text-stone-100">
      {/* Title */}
      <div className="p-3 bg-[#1e1e24] rounded-2xl border border-[#2e2e36]">
        <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
          <span 
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          />
          <span>{t.settingsHeaderTitle}</span>
        </h2>
      </div>

      {/* 1. Account Section */}
      <section className="bg-[#1f1f26] rounded-2xl border border-[#30303c] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md"
              style={{
                backgroundColor: 'var(--theme-primary)',
                color: 'var(--theme-contrast-text)',
              }}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {userProfile.name}
              </h3>
              <p className="text-xs text-stone-400">
                {userProfile.isLoggedIn ? userProfile.email : t.settingsGuest}
              </p>
            </div>
          </div>

          <div>
            {userProfile.isLoggedIn ? (
              <button
                type="button"
                onClick={onLogout}
                className="h-8 px-3 rounded-lg text-xs font-medium text-stone-400 hover:text-white border border-stone-700 flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.settingsLogoutBtn}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="h-8 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md transition-all active:scale-95"
                style={{
                  backgroundColor: 'var(--theme-primary)',
                  color: 'var(--theme-contrast-text)',
                }}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.settingsLoginBtn}</span>
              </button>
            )}
          </div>
        </div>

        {!userProfile.isLoggedIn && (
          <div className="bg-[#17171d] rounded-xl p-2.5 text-xs text-stone-300 leading-relaxed border border-stone-800">
            {t.settingsGuestNotice}
          </div>
        )}
      </section>

      {/* 2. Language Selection (Multilingual Support) */}
      <section className="bg-[#1f1f26] rounded-2xl border border-[#30303c] p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-stone-400" />
          <h3 className="text-xs font-bold text-white">
            {t.settingsLanguageTitle}
          </h3>
        </div>
        <p className="text-xs text-stone-400">
          {t.settingsLanguageDesc}
        </p>

        {/* 2-option Segmented toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#141418] rounded-xl border border-stone-800">
          <button
            type="button"
            onClick={() => onSetLanguage('ja')}
            className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              language === 'ja'
                ? 'shadow-md text-white'
                : 'text-stone-400 hover:text-white'
            }`}
            style={{
              backgroundColor: language === 'ja' ? 'var(--theme-primary)' : 'transparent',
              color: language === 'ja' ? 'var(--theme-contrast-text)' : undefined,
            }}
          >
            <span>🇯🇵</span>
            <span>{t.settingsLangJa}</span>
            {language === 'ja' && <Check className="w-3.5 h-3.5 ml-1 stroke-[3]" />}
          </button>

          <button
            type="button"
            onClick={() => onSetLanguage('en')}
            className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              language === 'en'
                ? 'shadow-md text-white'
                : 'text-stone-400 hover:text-white'
            }`}
            style={{
              backgroundColor: language === 'en' ? 'var(--theme-primary)' : 'transparent',
              color: language === 'en' ? 'var(--theme-contrast-text)' : undefined,
            }}
          >
            <span>🌐</span>
            <span>{t.settingsLangEn}</span>
            {language === 'en' && <Check className="w-3.5 h-3.5 ml-1 stroke-[3]" />}
          </button>
        </div>
      </section>

      {/* 3. Theme Color Customization (9 Colors: 青, 赤, 黄色, オレンジ, 水色, 黒, 白, 緑, 紫) */}
      <section className="bg-[#1f1f26] rounded-2xl border border-[#30303c] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-stone-400" />
            <h3 className="text-xs font-bold text-white">
              {t.settingsThemeTitle}
            </h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#141418] border border-stone-700">
            {language === 'ja' ? activeConfig.nameJa : activeConfig.nameEn} ({activeConfig.subJa})
          </span>
        </div>

        <p className="text-xs text-stone-400 leading-relaxed">
          {t.settingsThemeDesc}
        </p>

        {/* Live Color Impact Demo Banner - FILLED with Theme Color */}
        <div 
          className="p-3.5 rounded-2xl flex items-center justify-between text-xs shadow-lg transition-all"
          style={{
            backgroundColor: 'var(--theme-primary)',
            color: 'var(--theme-contrast-text)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <span 
              className="w-4 h-4 rounded-full border-2 border-current shadow-sm"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            />
            <span className="font-bold">
              {language === 'ja' 
                ? 'テーマ連動: 枠内の塗りつぶし・ボタン・タブ' 
                : 'Theme Active: Filled Frames, Buttons & Tabs'}
            </span>
          </div>
          <span 
            className="text-[10px] font-black px-2.5 py-1 rounded-lg backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.22)',
              color: 'var(--theme-contrast-text)',
            }}
          >
            {language === 'ja' ? `${activeConfig.nameJa} 適用中` : 'ACTIVE'}
          </span>
        </div>

        {/* 9 Color Swatches Grid (青, 赤, 黄色, オレンジ, 水色, 黒, 白, 緑, 紫) */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {colorKeys.map((key) => {
            const config = THEME_COLORS[key];
            const isSelected = currentThemeKey === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSetThemeColor(key)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 active:scale-95 shadow-md ${
                  isSelected
                    ? 'ring-2 ring-white/90 scale-[1.02] shadow-xl'
                    : 'border-[#383846] hover:border-stone-400 bg-[#16161c]'
                }`}
                style={{
                  backgroundColor: isSelected ? config.primaryHex : '#16161c',
                  borderColor: isSelected ? config.primaryHex : '#383846',
                  color: isSelected ? config.contrastText : '#ffffff',
                }}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={`w-6 h-6 rounded-full shadow-inner flex items-center justify-center border ${
                      isSelected ? 'border-black/30' : 'border-white/20'
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? (config.contrastText === '#ffffff' ? '#ffffff' : '#18181b')
                        : config.primaryHex,
                    }}
                  >
                    {isSelected && (
                      <Check 
                        className="w-3.5 h-3.5 stroke-[3]" 
                        style={{
                          color: config.contrastText === '#ffffff' ? config.primaryHex : '#ffffff',
                        }}
                      />
                    )}
                  </span>
                  {isSelected && (
                    <span 
                      className="text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm"
                      style={{
                        backgroundColor: config.contrastText === '#ffffff' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)',
                        color: config.contrastText,
                      }}
                    >
                      適用中
                    </span>
                  )}
                </div>

                <div>
                  <div 
                    className="text-xs font-bold leading-tight"
                    style={{ color: isSelected ? config.contrastText : '#ffffff' }}
                  >
                    {language === 'ja' ? config.nameJa : config.nameEn.split(' ')[0]}
                  </div>
                  <div 
                    className="text-[10px] mt-0.5 truncate"
                    style={{ 
                      color: isSelected 
                        ? (config.contrastText === '#ffffff' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)') 
                        : '#a1a1aa' 
                    }}
                  >
                    {config.subJa}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. App Info Section */}
      <section className="bg-[#1f1f26] rounded-2xl border border-[#30303c] p-4 shadow-sm space-y-2 text-xs text-stone-400">
        <h3 className="font-bold text-white mb-2">
          {t.settingsAppInfoTitle}
        </h3>
        <p className="flex justify-between py-1 border-b border-stone-800 text-stone-300">
          <span>{t.settingsVersion}</span>
        </p>
        <p className="flex justify-between py-1 border-b border-stone-800 text-stone-300">
          <span>{t.settingsTerms}</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        </p>
        <p className="pt-2 text-[11px] text-stone-400 leading-relaxed">
          {t.settingsCityInitiative}
        </p>
      </section>
    </div>
  );
};
