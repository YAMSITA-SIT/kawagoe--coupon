import React, { useEffect, useState } from 'react';

import {
  Language,
  ThemeColorKey,
  MainTab,
  UserProfile,
  Coupon,
  WalletState,
  WalletTransaction,
} from './types';

import {
  THEME_COLORS,
  applyThemeVariables,
} from './utils/theme';

import { ALL_COUPONS } from './data/coupons';
import { INITIAL_WALLET } from './data/initialWallet';

import { BottomNavBar } from './components/BottomNavBar';
import { HomeTab } from './components/HomeTab';
import { CouponsTab } from './components/CouponsTab';
import { KawagoeMapTab } from './components/KawagoeMapTab';
import { AccountTab } from './components/AccountTab';

import { CouponRedeemModal } from './components/CouponRedeemModal';
import { ChargeModal } from './components/ChargeModal';
import { PaymentBarcodeModal } from './components/PaymentBarcodeModal';
import { TransactionHistoryModal } from './components/TransactionHistoryModal';

export default function App() {
  // =========================================================
  // 言語
  // =========================================================

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(
        'kawagoe_language'
      );

      if (saved === 'ja' || saved === 'en') {
        return saved;
      }

      return 'ja';
    } catch {
      return 'ja';
    }
  });

  // =========================================================
  // マップモード
  // =========================================================

  const [mapMode, setMapMode] =
    useState<'normal' | 'night'>('normal');

  // =========================================================
  // クーポン・ホーム画面からマップへ渡す対象ID
  // =========================================================

  const [
    mapTargetCouponId,
    setMapTargetCouponId,
  ] = useState<string | null>(null);

  // =========================================================
  // テーマカラー
  // =========================================================

  const [
    currentThemeKey,
    setCurrentThemeKey,
  ] = useState<ThemeColorKey>(() => {
    try {
      const saved = localStorage.getItem(
        'kawagoe_theme_color'
      );

      return (saved as ThemeColorKey) in THEME_COLORS
        ? (saved as ThemeColorKey)
        : 'orange';
    } catch {
      return 'orange';
    }
  });

  // =========================================================
  // 現在のタブ
  // =========================================================

  const [activeTab, setActiveTab] =
    useState<MainTab>('home');

  // =========================================================
  // ユーザー
  // =========================================================

  const [userProfile, setUserProfile] =
    useState<UserProfile>(() => ({
      isLoggedIn: false,
      isGuest: true,
      name: '山下 暉登',
      email: 'user@kawagoe-smart.jp',
      favoriteArea: '一番街・蔵造りの町並み',
    }));

  // =========================================================
  // クーポン
  // =========================================================

  const [
    selectedCoupon,
    setSelectedCoupon,
  ] = useState<Coupon | null>(null);

  // =========================================================
  // ウォレット
  // =========================================================

  const [walletState, setWalletState] =
    useState<WalletState>(() => {
      try {
        const saved = localStorage.getItem(
          'kawagoe_wallet_state'
        );

        return saved
          ? JSON.parse(saved)
          : INITIAL_WALLET;
      } catch {
        return INITIAL_WALLET;
      }
    });

  // =========================================================
  // モーダル
  // =========================================================

  const [isChargeOpen, setIsChargeOpen] =
    useState(false);

  const [
    isPaymentQrOpen,
    setIsPaymentQrOpen,
  ] = useState(false);

  const [isHistoryOpen, setIsHistoryOpen] =
    useState(false);

  // =========================================================
  // 言語保存
  // =========================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        'kawagoe_language',
        language
      );
    } catch {
      // 保存できない場合は何もしない
    }

    document.documentElement.lang =
      language === 'ja' ? 'ja' : 'en';
  }, [language]);

  // =========================================================
  // ウォレット保存
  // =========================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        'kawagoe_wallet_state',
        JSON.stringify(walletState)
      );
    } catch {
      // 保存できない場合は何もしない
    }
  }, [walletState]);

  // =========================================================
  // テーマ
  // =========================================================

  const activeThemeConfig =
    THEME_COLORS[currentThemeKey];

  useEffect(() => {
    applyThemeVariables(activeThemeConfig);

    try {
      localStorage.setItem(
        'kawagoe_theme_color',
        currentThemeKey
      );
    } catch {
      // 保存できない場合は何もしない
    }
  }, [
    currentThemeKey,
    activeThemeConfig,
  ]);

  // =========================================================
  // チャージ
  // =========================================================

  const handleCharge = (
    amount: number,
    methodJa: string,
    methodEn: string
  ) => {
    const pointsBonus =
      Math.floor(amount * 0.1);

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'charge',
      amount,
      pointsEarned: pointsBonus,

      descriptionJa:
        `口座・カードチャージ（${methodJa}）`,

      descriptionEn:
        `Top-up (${methodEn})`,

      timestamp: new Date()
        .toLocaleString(
          language === 'ja'
            ? 'ja-JP'
            : 'en-US',
          {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }
        )
        .replace(/\//g, '-'),

      methodOrShopJa: methodJa,
      methodOrShopEn: methodEn,

      balanceAfter:
        walletState.balance + amount,
    };

    setWalletState((prev) => ({
      ...prev,

      balance:
        prev.balance + amount,

      points:
        prev.points + pointsBonus,

      transactions: [
        newTx,
        ...prev.transactions,
      ],
    }));
  };

  // =========================================================
  // 支払い
  // =========================================================

  const handlePayment = (
    amount: number,
    storeJa: string,
    storeEn: string
  ) => {
    const pointsEarned =
      Math.floor(amount * 0.01);

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'payment',
      amount,
      pointsEarned,

      descriptionJa:
        `${storeJa} お支払い`,

      descriptionEn:
        `${storeEn} Payment`,

      timestamp: new Date()
        .toLocaleString(
          language === 'ja'
            ? 'ja-JP'
            : 'en-US',
          {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }
        )
        .replace(/\//g, '-'),

      methodOrShopJa: storeJa,
      methodOrShopEn: storeEn,

      balanceAfter:
        Math.max(
          0,
          walletState.balance - amount
        ),
    };

    setWalletState((prev) => ({
      ...prev,

      balance:
        Math.max(
          0,
          prev.balance - amount
        ),

      points:
        prev.points + pointsEarned,

      transactions: [
        newTx,
        ...prev.transactions,
      ],
    }));
  };

  // =========================================================
  // プロフィール更新
  // =========================================================

  const handleUpdateProfile = (
    newProfile: UserProfile
  ) => {
    setUserProfile({
      ...newProfile,
      name: '山下 暉登',
    });
  };

  // =========================================================
  // 夜マップ
  // =========================================================

  const handleOpenNightMap = () => {
    // クーポン指定を解除
    setMapTargetCouponId(null);

    // 夜マップ
    setMapMode('night');

    // マップタブへ
    setActiveTab('map');
  };

  // =========================================================
  // ★ クーポンの店舗をマップで表示
  // ホーム・クーポン画面の両方から使用
  // =========================================================

  const handleOpenCouponMap = (
    coupon: Coupon
  ) => {
    // 押されたクーポンのIDを保存
    setMapTargetCouponId(coupon.id);

    // 通常マップを表示
    setMapMode('normal');

    // マップタブへ移動
    setActiveTab('map');
  };

  // =========================================================
  // 下部ナビ
  // =========================================================

  const handleChangeTab = (
    tab: MainTab
  ) => {
    if (tab === 'map') {
      // 下部ナビから直接マップを押した場合は
      // 通常マップを表示する
      setMapMode('normal');

      // 特定クーポンへのジャンプは解除
      setMapTargetCouponId(null);
    }

    setActiveTab(tab);
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#ebebee]
        text-stone-900
        flex
        flex-col
        items-center
        selection:bg-amber-100
      "
    >
      <div
        className="
          w-full
          max-w-[420px]
          my-0
          sm:my-3
          sm:rounded-[36px]
          sm:border
          sm:border-stone-300
          sm:shadow-2xl
          overflow-hidden
          bg-[#f9f9f9]
          relative
          min-h-screen
          flex
          flex-col
          pb-20
        "
      >
        {/* ===================================================
            ヘッダー
        =================================================== */}

        <header
          className="
            sticky
            top-0
            z-30
            text-white
            px-4
            py-3.5
            flex
            items-center
            justify-between
            shadow-xs
            transition-colors
            rounded-b-[24px]
          "
          style={{
            backgroundColor:
              'var(--theme-primary)',
          }}
        >
          <div className="w-8" />

          <div className="text-center">
            <h1
              className="
                text-base
                sm:text-lg
                font-black
                tracking-tight
                text-white
                font-shippori
              "
            >
              {language === 'ja'
                ? '川越スマートクーポン'
                : 'Kawagoe Smart Coupon'}
            </h1>
          </div>

          <div className="w-8" />
        </header>

        {/* ===================================================
            HOME
        =================================================== */}

        {activeTab === 'home' && (
          <main className="flex-grow">
            <HomeTab
              coupons={ALL_COUPONS}
              language={language}
              themeConfig={
                activeThemeConfig
              }
              walletBalance={
                walletState.balance
              }
              walletPoints={
                walletState.points
              }
              onSelectCoupon={(coupon) =>
                setSelectedCoupon(coupon)
              }
              onOpenNightMap={
                handleOpenNightMap
              }

              // ★ ホーム画面の
              // 「マップ表示」ボタン用
              onOpenMap={
                handleOpenCouponMap
              }
            />
          </main>
        )}

        {/* ===================================================
            COUPONS
        =================================================== */}

        {activeTab === 'coupons' && (
          <main className="flex-grow">
            <CouponsTab
              coupons={ALL_COUPONS}
              language={language}
              themeConfig={
                activeThemeConfig
              }
              onSelectCoupon={(coupon) =>
                setSelectedCoupon(coupon)
              }

              // クーポン画面の
              // 「マップ表示」ボタン
              onOpenMap={
                handleOpenCouponMap
              }
            />
          </main>
        )}

        {/* ===================================================
            MAP
        =================================================== */}

        {activeTab === 'map' && (
          <main className="flex-grow">
            <KawagoeMapTab
              coupons={ALL_COUPONS}
              language={language}
              themeConfig={
                activeThemeConfig
              }
              onSelectCoupon={(coupon) =>
                setSelectedCoupon(coupon)
              }
              mapMode={mapMode}

              // ★ ホームまたはクーポン画面から
              // 選択されたクーポンID
              initialCouponId={
                mapTargetCouponId
              }
            />
          </main>
        )}

        {/* ===================================================
            ACCOUNT
        =================================================== */}

        {activeTab === 'account' && (
          <main className="flex-grow">
            <AccountTab
              language={language}
              onSetLanguage={setLanguage}
              currentThemeKey={
                currentThemeKey
              }
              onSetThemeColor={
                setCurrentThemeKey
              }
              userProfile={{
                ...userProfile,
                name: '山下 暉登',
              }}
              onUpdateProfile={
                handleUpdateProfile
              }
              walletBalance={
                walletState.balance
              }
              walletPoints={
                walletState.points
              }
              onOpenCharge={() =>
                setIsChargeOpen(true)
              }
              onOpenHistory={() =>
                setIsHistoryOpen(true)
              }
              onOpenQr={() =>
                setIsPaymentQrOpen(true)
              }
            />
          </main>
        )}

        {/* ===================================================
            下部ナビ
        =================================================== */}

        <BottomNavBar
          activeTab={activeTab}
          onChangeTab={
            handleChangeTab
          }
          onOpenQr={() =>
            setIsPaymentQrOpen(true)
          }
          language={language}
          themeConfig={
            activeThemeConfig
          }
        />

        {/* ===================================================
            クーポン利用
        =================================================== */}

        <CouponRedeemModal
          coupon={selectedCoupon}
          language={language}
          themeConfig={
            activeThemeConfig
          }
          onClose={() =>
            setSelectedCoupon(null)
          }
          walletBalance={
            walletState.balance
          }
          onPayWithWallet={
            handlePayment
          }
        />

        {/* ===================================================
            チャージ
        =================================================== */}

        <ChargeModal
          isOpen={isChargeOpen}
          onClose={() =>
            setIsChargeOpen(false)
          }
          currentBalance={
            walletState.balance
          }
          onCharge={handleCharge}
          language={language}
          themeConfig={
            activeThemeConfig
          }
        />

        {/* ===================================================
            支払いバーコード
        =================================================== */}

        <PaymentBarcodeModal
          isOpen={isPaymentQrOpen}
          onClose={() =>
            setIsPaymentQrOpen(false)
          }
          balance={
            walletState.balance
          }
          points={
            walletState.points
          }
          onSimulatePay={
            handlePayment
          }
          language={language}
          themeConfig={
            activeThemeConfig
          }
        />

        {/* ===================================================
            取引履歴
        =================================================== */}

        <TransactionHistoryModal
          isOpen={isHistoryOpen}
          onClose={() =>
            setIsHistoryOpen(false)
          }
          transactions={
            walletState.transactions
          }
          balance={
            walletState.balance
          }
          points={
            walletState.points
          }
          language={language}
          themeConfig={
            activeThemeConfig
          }
          onOpenCharge={() =>
            setIsChargeOpen(true)
          }
        />
      </div>
    </div>
  );
}