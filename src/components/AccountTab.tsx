import React, { useState } from 'react';
import { 
  Palette, 
  User, 
  Volume2, 
  Type, 
  X, 
  Check 
} from 'lucide-react';
import { Language, ThemeColorKey, UserProfile } from '../types';
import { translations } from '../data/translations';
import { THEME_COLORS } from '../utils/theme';

interface AccountTabProps {
  language: Language;
  onSetLanguage: (lang: Language) => void;
  currentThemeKey: ThemeColorKey;
  onSetThemeColor: (colorKey: ThemeColorKey) => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  walletBalance: number;
  walletPoints: number;
  onOpenCharge: () => void;
  onOpenHistory: () => void;
  onOpenQr: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  language,
  currentThemeKey,
  onSetThemeColor,
}) => {
  const activeConfig = THEME_COLORS[currentThemeKey];

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isFontSizeModalOpen, setIsFontSizeModalOpen] = useState(false);
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // 文字サイズの状態（'standard' | 'large' | 'xlarge'）
  const [fontSize, setFontSize] = useState<'standard' | 'large' | 'xlarge'>(() => {
    return (localStorage.getItem('kawagoe_font_size') as any) || 'standard';
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 文字サイズ変更をアプリ全体（body）に反映させる関数
  const handleSelectFontSize = (size: 'standard' | 'large' | 'xlarge') => {
    setFontSize(size);
    localStorage.setItem('kawagoe_font_size', size);
    
    // bodyのクラスを書き換えて文字サイズを動的に変更
    const rootElement = document.documentElement;
    rootElement.classList.remove('text-size-standard', 'text-size-large', 'text-size-xlarge');
    if (size === 'large') {
      rootElement.style.fontSize = '17px';
    } else if (size === 'xlarge') {
      rootElement.style.fontSize = '19px'; // 超太文字・特大サイズ
    } else {
      rootElement.style.fontSize = '16px'; // 標準
    }
    setIsFontSizeModalOpen(false);
  };

  const colorKeys: ThemeColorKey[] = ['orange', 'yellow', 'red', 'blue', 'cyan', 'green', 'purple', 'black', 'white'];

  return (
    <div className="pb-16 bg-[#f9f9f9] min-h-screen text-stone-900">
      
      {/* 1. トッププロフィールエリア */}
      <div className="bg-white pt-6 pb-5 px-4 text-center border-b border-stone-200/80 shadow-2xs">
        <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-stone-200 flex items-center justify-center mx-auto mb-2 shadow-xs text-stone-700">
          <User className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-stone-900">
          山下 暉登 <span className="text-xs font-normal text-stone-500">さん</span>
        </h3>
        <p className="text-[11px] text-stone-400 mt-0.5">ID: kawagoe-user-2026</p>
      </div>

      {/* 2. 設定メニュー一覧 */}
      <div className="max-w-md mx-auto px-4 space-y-3 pt-4">
        <h4 className="text-[11px] font-bold text-stone-500 px-1 uppercase tracking-wider">設定</h4>

        <div className="bg-white rounded-2xl divide-y divide-stone-100 border border-stone-200/80 shadow-xs overflow-hidden">
          
          <button
            type="button"
            onClick={() => setIsVolumeModalOpen(true)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold text-stone-800">音量設定</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-400">{soundEnabled ? 'オン (標準)' : 'ミュート'}</span>
              <span className="text-amber-600 font-bold text-[10px]">▶</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsFontSizeModalOpen(true)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Type className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold text-stone-800">文字サイズの変更</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-400">
                {fontSize === 'standard' ? '標準' : fontSize === 'large' ? '大文字' : '超太文字 (特大)'}
              </span>
              <span className="text-amber-600 font-bold text-[10px]">▶</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold text-stone-800">テーマカラーの変更</span>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs inline-block"
                style={{ backgroundColor: activeConfig.primaryHex }}
              />
              <span className="text-[11px] text-stone-400">{language === 'ja' ? activeConfig.nameJa : activeConfig.nameEn}</span>
              <span className="text-amber-600 font-bold text-[10px]">▶</span>
            </div>
          </button>

        </div>

        <div className="bg-white rounded-2xl divide-y divide-stone-100 border border-stone-200/80 shadow-xs overflow-hidden mt-3">
          <button
            type="button"
            onClick={() => setIsTermsOpen(true)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
          >
            <span className="text-xs font-bold text-stone-800">利用規約</span>
            <span className="text-amber-600 font-bold text-[10px]">▶</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPrivacyOpen(true)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
          >
            <span className="text-xs font-bold text-stone-800">プライバシーポリシー</span>
            <span className="text-amber-600 font-bold text-[10px]">▶</span>
          </button>
        </div>

        <div className="py-4 text-center text-[11px] text-stone-400">
          バージョン 2.4.4
        </div>
      </div>

      {/* --- モーダル群 --- */}

      {/* 音量設定モーダル */}
      {isVolumeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">音量設定</h3>
            <div className="space-y-2">
              <button onClick={() => { setSoundEnabled(true); setIsVolumeModalOpen(false); }} className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-between px-3 ${soundEnabled ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-stone-100 text-stone-600'}`}>
                <span>効果音・通知音 オン</span>
                {soundEnabled && <Check className="w-4 h-4 text-amber-600" />}
              </button>
              <button onClick={() => { setSoundEnabled(false); setIsVolumeModalOpen(false); }} className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-between px-3 ${!soundEnabled ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-stone-100 text-stone-600'}`}>
                <span>ミュート (オフ)</span>
                {!soundEnabled && <Check className="w-4 h-4 text-amber-600" />}
              </button>
            </div>
            <button onClick={() => setIsVolumeModalOpen(false)} className="w-full h-9 bg-stone-900 text-white rounded-xl text-xs font-bold">閉じる</button>
          </div>
        </div>
      )}

      {/* 文字サイズ変更モーダル（標準・大・超太文字） */}
      {isFontSizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">文字サイズの変更</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleSelectFontSize('standard')} 
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-between px-3 ${fontSize === 'standard' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-stone-100 text-stone-600'}`}
              >
                <span>標準サイズ</span>
                {fontSize === 'standard' && <Check className="w-4 h-4 text-amber-600" />}
              </button>
              <button 
                onClick={() => handleSelectFontSize('large')} 
                className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-between px-3 ${fontSize === 'large' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-stone-100 text-stone-600'}`}
              >
                <span>大文字</span>
                {fontSize === 'large' && <Check className="w-4 h-4 text-amber-600" />}
              </button>
              <button 
                onClick={() => handleSelectFontSize('xlarge')} 
                className={`w-full py-3 rounded-xl text-base font-black flex items-center justify-between px-3 ${fontSize === 'xlarge' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-stone-100 text-stone-600'}`}
              >
                <span>超太文字 (特大)</span>
                {fontSize === 'xlarge' && <Check className="w-4 h-4 text-amber-600" />}
              </button>
            </div>
            <button onClick={() => setIsFontSizeModalOpen(false)} className="w-full h-9 bg-stone-900 text-white rounded-xl text-xs font-bold">閉じる</button>
          </div>
        </div>
      )}

      {/* テーマカラー選択モーダル（各ボタンに色と色名を分かりやすく表示） */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm font-bold text-stone-900">テーマカラーの変更</h3>
              <button onClick={() => setIsThemeModalOpen(false)}><X className="w-4 h-4 text-stone-500" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {colorKeys.map((key) => {
                const config = THEME_COLORS[key];
                const isSelected = currentThemeKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { onSetThemeColor(key); setIsThemeModalOpen(false); }}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs ${
                      isSelected ? 'ring-2 ring-stone-900 scale-105' : 'border-stone-200 hover:border-stone-400'
                    }`}
                    style={{
                      backgroundColor: config.primaryHex,
                      color: config.contrastText,
                    }}
                  >
                    <div className="w-5 h-5 rounded-full border border-black/20 flex items-center justify-center bg-white/30">
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" style={{ color: config.contrastText }} />}
                    </div>
                    <span className="text-xs font-bold tracking-wider drop-shadow-xs">
                      {config.nameJa}
                    </span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setIsThemeModalOpen(false)} className="w-full h-9 bg-stone-900 text-white rounded-xl text-xs font-bold">閉じる</button>
          </div>
        </div>
      )}

      {/* 利用規約モーダル */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">利用規約</h3>
            <p className="text-xs text-stone-600 leading-relaxed max-h-60 overflow-y-auto">本サービスは川越市の観光分散・フードロス削減実証事業として提供されています。</p>
            <button onClick={() => setIsTermsOpen(false)} className="w-full h-9 bg-stone-100 text-stone-800 font-bold text-xs rounded-xl">閉じる</button>
          </div>
        </div>
      )}

      {/* プライバシーポリシーモーダル */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">プライバシーポリシー</h3>
            <p className="text-xs text-stone-600 leading-relaxed max-h-60 overflow-y-auto">取得した情報は本サービスの改善およびクーポン配信以外の目的に使用いたしません。</p>
            <button onClick={() => setIsPrivacyOpen(false)} className="w-full h-9 bg-stone-100 text-stone-800 font-bold text-xs rounded-xl">閉じる</button>
          </div>
        </div>
      )}

    </div>
  );
};