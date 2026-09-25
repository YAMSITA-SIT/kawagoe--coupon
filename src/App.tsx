import React, { useState, useEffect } from 'react';
import { 
  Language, 
  ThemeColorKey, 
  MainTab, 
  UserProfile, 
  Coupon,
  WalletState,
  WalletTransaction
} from './types';
import { THEME_COLORS, applyThemeVariables } from './utils/theme';
import { ALL_COUPONS } from './data/coupons';
import { translations } from './data/translations';
import { INITIAL_WALLET } from './data/initialWallet';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeTab } from './components/HomeTab';
import { CouponsTab } from './components/CouponsTab';
import { KawagoeMapTab } from './components/KawagoeMapTab';
import { AccountTab } from './components/AccountTab';
import { AuthScreen } from './components/AuthScreen';
import { CouponRedeemModal } from './components/CouponRedeemModal';
import { ChargeModal } from './components/ChargeModal';
import { PaymentBarcodeModal } from './components/PaymentBarcodeModal';
import { TransactionHistoryModal } from './components/TransactionHistoryModal';
import { Bell } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('ja');
  const [currentThemeKey, setCurrentThemeKey] = useState<ThemeColorKey>(() => {
    try {
      const saved = localStorage.getItem('kawagoe_theme_color');
      return (saved as ThemeColorKey) in THEME_COLORS ? (saved as ThemeColorKey) : 'orange';
    } catch {
      return 'orange';
    }
  });

  const [activeTab, setActiveTab] = useState<MainTab>('home');

  // ユーザー名を「山下 暉登」に固定
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    return { isLoggedIn: false, isGuest: true, name: '山下 暉登', email: 'user@kawagoe-smart.jp', favoriteArea: '一番街・蔵造りの町並み' };
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const [walletState, setWalletState] = useState<WalletState>(() => {
    try {
      const saved = localStorage.getItem('kawagoe_wallet_state');
      return saved ? JSON.parse(saved) : INITIAL_WALLET;
    } catch {
      return INITIAL_WALLET;
    }
  });

  const [isChargeOpen, setIsChargeOpen] = useState(false);
  const [isPaymentQrOpen, setIsPaymentQrOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('kawagoe_wallet_state', JSON.stringify(walletState));
    } catch {}
  }, [walletState]);

  const handleCharge = (amount: number, methodJa: string, methodEn: string) => {
    const pointsBonus = Math.floor(amount * 0.10);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'charge',
      amount,
      pointsEarned: pointsBonus,
      descriptionJa: `口座・カードチャージ（${methodJa}）`,
      descriptionEn: `Top-up (${methodEn})`,
      timestamp: new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
      methodOrShopJa: methodJa,
      methodOrShopEn: methodEn,
      balanceAfter: walletState.balance + amount,
    };

    setWalletState((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      points: prev.points + pointsBonus,
      transactions: [newTx, ...prev.transactions],
    }));
  };

  const handlePayment = (amount: number, storeJa: string, storeEn: string) => {
    const pointsEarned = Math.floor(amount * 0.01);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'payment',
      amount,
      pointsEarned,
      descriptionJa: `${storeJa} お支払い`,
      descriptionEn: `${storeEn} Payment`,
      timestamp: new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
      methodOrShopJa: storeJa,
      methodOrShopEn: storeEn,
      balanceAfter: Math.max(0, walletState.balance - amount),
    };

    setWalletState((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
      points: prev.points + pointsEarned,
      transactions: [newTx, ...prev.transactions],
    }));
  };

  const activeThemeConfig = THEME_COLORS[currentThemeKey];

  useEffect(() => {
    applyThemeVariables(activeThemeConfig);
    try {
      localStorage.setItem('kawagoe_theme_color', currentThemeKey);
    } catch {}
  }, [currentThemeKey, activeThemeConfig]);

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile({ ...newProfile, name: '山下 暉登' });
  };

  return (
    <div className="min-h-screen bg-[#ebebee] text-stone-900 flex flex-col items-center selection:bg-amber-100">
      
      <div 
        className={`w-full transition-all duration-300 ${
          isMobileFrame 
            ? 'max-w-[420px] my-0 sm:my-3 sm:rounded-[36px] sm:border sm:border-stone-300 sm:shadow-2xl overflow-hidden bg-[#f9f9f9]' 
            : 'max-w-3xl bg-[#f9f9f9]'
        } relative min-h-screen flex flex-col pb-20`}
      >
        <header 
          className="sticky top-0 z-30 text-white px-4 py-3.5 flex items-center justify-between shadow-xs transition-colors rounded-b-[24px]"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        >
          <div className="w-8" />
          <div className="text-center">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white font-shippori">
              川越スマートクーポン
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowNotificationToast(true);
              setTimeout(() => setShowNotificationToast(false), 2500);
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors shadow-2xs"
            title="お知らせ"
          >
            <Bell className="w-4.5 h-4.5" />
          </button>
        </header>

        {showNotificationToast && (
          <div className="mx-4 mt-2 p-2.5 rounded-xl bg-white text-stone-900 text-xs flex items-center justify-between border border-stone-200 shadow-md animate-in fade-in duration-200 z-40">
            <span className="font-medium">🔔 本日のフードロスクーポン（2店舗）が更新されました。</span>
            <button onClick={() => setShowNotificationToast(false)} className="text-stone-400 pl-2 font-bold">✕</button>
          </div>
        )}

        {activeTab === 'home' && (
          <main className="flex-grow">
            <HomeTab
              coupons={ALL_COUPONS}
              language={language}
              themeConfig={activeThemeConfig}
              onSelectCoupon={(c) => setSelectedCoupon(c)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenQr={() => setIsPaymentQrOpen(true)}
              walletBalance={walletState.balance}
              walletPoints={walletState.points}
              onOpenCharge={() => setIsChargeOpen(true)}
              onOpenHistory={() => setIsHistoryOpen(true)}
            />
          </main>
        )}

        {activeTab === 'coupons' && (
          <main className="flex-grow">
            <CouponsTab
              coupons={ALL_COUPONS}
              language={language}
              themeConfig={activeThemeConfig}
              onSelectCoupon={(c) => setSelectedCoupon(c)}
              onOpenNewCouponPrompt={() => setSelectedCoupon(ALL_COUPONS[0])}
            />
          </main>
        )}

        {activeTab === 'map' && (
          <main className="flex-grow">
            <KawagoeMapTab
              coupons={ALL_COUPONS}
              language={language}
              themeConfig={activeThemeConfig}
              onSelectCoupon={(c) => setSelectedCoupon(c)}
            />
          </main>
        )}

        {activeTab === 'account' && (
          <main className="flex-grow">
            <AccountTab
              language={language}
              onSetLanguage={setLanguage}
              currentThemeKey={currentThemeKey}
              onSetThemeColor={setCurrentThemeKey}
              userProfile={{ ...userProfile, name: '山下 暉登' }}
              onUpdateProfile={handleUpdateProfile}
              walletBalance={walletState.balance}
              walletPoints={walletState.points}
              onOpenCharge={() => setIsChargeOpen(true)}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onOpenQr={() => setIsPaymentQrOpen(true)}
            />
          </main>
        )}

        <BottomNavBar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenQr={() => setIsPaymentQrOpen(true)}
          language={language}
          themeConfig={activeThemeConfig}
        />

        <CouponRedeemModal
          coupon={selectedCoupon}
          language={language}
          themeConfig={activeThemeConfig}
          onClose={() => setSelectedCoupon(null)}
          walletBalance={walletState.balance}
          onPayWithWallet={handlePayment}
        />

        <ChargeModal
          isOpen={isChargeOpen}
          onClose={() => setIsChargeOpen(false)}
          currentBalance={walletState.balance}
          onCharge={handleCharge}
          language={language}
          themeConfig={activeThemeConfig}
        />

        <PaymentBarcodeModal
          isOpen={isPaymentQrOpen}
          onClose={() => setIsPaymentQrOpen(false)}
          balance={walletState.balance}
          points={walletState.points}
          onSimulatePay={handlePayment}
          language={language}
          themeConfig={activeThemeConfig}
        />

        <TransactionHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          transactions={walletState.transactions}
          balance={walletState.balance}
          points={walletState.points}
          language={language}
          themeConfig={activeThemeConfig}
          onOpenCharge={() => setIsChargeOpen(true)}
        />
      </div>
    </div>
  );
}