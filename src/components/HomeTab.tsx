import React, { useEffect, useState } from 'react';

import {
  Moon,
  ChevronRight,
  MapPin,
} from 'lucide-react';

import {
  Coupon,
  Language,
  ThemeColorConfig,
} from '../types';

interface HomeTabProps {
  coupons: Coupon[];
  language: Language;
  themeConfig: ThemeColorConfig;
  walletBalance: number;
  walletPoints: number;

  onSelectCoupon: (coupon: Coupon) => void;

  // 夜スポットだけのマップを開く
  onOpenNightMap: () => void;

  // クーポンのお店をマップで表示
  onOpenMap: (coupon: Coupon) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  coupons,
  language,
  themeConfig,
  walletBalance,
  walletPoints,
  onSelectCoupon,
  onOpenNightMap,
  onOpenMap,
}) => {
  // ============================================
  // 着せ替え画像
  // ============================================

  const [currentKisekaeImg, setCurrentKisekaeImg] =
    useState(() => {
      try {
        return (
          localStorage.getItem(
            'kawagoe_kisekae_image'
          ) ||
          '/src/assets/images/tokinokane.png'
        );
      } catch {
        return '/src/assets/images/tokinokane.png';
      }
    });

  // ============================================
  // 着せ替え変更を検知
  // ============================================

  useEffect(() => {
    const checkKisekae = () => {
      try {
        const saved = localStorage.getItem(
          'kawagoe_kisekae_image'
        );

        if (saved) {
          setCurrentKisekaeImg(saved);
        }
      } catch {
        // localStorageが使えない場合は何もしない
      }
    };

    window.addEventListener(
      'storage',
      checkKisekae
    );

    const interval = setInterval(
      checkKisekae,
      1000
    );

    return () => {
      window.removeEventListener(
        'storage',
        checkKisekae
      );

      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="
        pb-8
        space-y-5
        px-3
        sm:px-4
        pt-3
        max-w-md
        mx-auto
      "
    >
      {/* ========================================
          1. 着せ替え画像
      ======================================== */}

      <div>
        <div
          className="
            relative
            rounded-2xl
            overflow-hidden
            h-40
            w-full
            bg-stone-900
            shadow-sm
            border
            border-stone-300
          "
        >
          <img
            src={currentKisekaeImg}
            alt="Kisekae Theme Background"
            className="
              w-full
              h-full
              object-cover
            "
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* ========================================
          2. 夜の川越
      ======================================== */}

      <div>
        <button
          type="button"
          onClick={onOpenNightMap}
          className="
            w-full
            min-h-[110px]
            rounded-2xl
            px-4
            sm:px-5
            py-4
            bg-amber-400
            hover:bg-amber-500
            shadow-md
            border
            border-amber-500
            flex
            items-center
            gap-3
            sm:gap-4
            text-left
            active:scale-[0.98]
            transition-all
          "
        >
          {/* 月アイコン */}

          <div
            className="
              w-14
              h-14
              rounded-full
              bg-white/30
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <Moon
              className="
                w-8
                h-8
                text-stone-900
              "
            />
          </div>

          {/* 文字 */}

          <div className="flex-1 min-w-0">
            <div
              className="
                text-lg
                sm:text-xl
                font-black
                text-stone-900
                leading-tight
              "
            >
              {language === 'ja'
                ? '夜の川越'
                : 'Enjoy Kawagoe at Night'}
            </div>

            {language !== 'ja' && (
              <div
                className="
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-stone-700
                  mt-1.5
                  leading-relaxed
                "
              >
                Find restaurants and night views
                to enjoy after dark
              </div>
            )}
          </div>

          <ChevronRight
            className="
              w-7
              h-7
              sm:w-8
              sm:h-8
              text-stone-900
              shrink-0
            "
          />
        </button>
      </div>

      {/* ========================================
          3. おすすめの小江戸クーポン
      ======================================== */}

      <div className="space-y-3 pt-2">
        <h3
          className="
            text-base
            font-bold
            text-stone-700
            px-1
          "
        >
          {language === 'ja'
            ? 'おすすめの小江戸クーポン'
            : 'Featured Koedo Coupons'}
        </h3>

        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              onClick={() =>
                onSelectCoupon(coupon)
              }
              className="
                w-full
                min-w-0
                bg-white
                rounded-2xl
                p-3
                sm:p-4
                border
                border-stone-200
                shadow-sm
                hover:shadow-md
                active:scale-[0.99]
                transition-all
                cursor-pointer
                overflow-hidden
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  min-[380px]:gap-3
                  min-w-0
                "
              >
                {/* 商品画像 */}

                <img
                  src={coupon.imageUrl}
                  alt={
                    language === 'ja'
                      ? coupon.titleJa
                      : coupon.titleEn
                  }
                  className="
                    w-16
                    h-16
                    min-[380px]:w-20
                    min-[380px]:h-20
                    rounded-xl
                    object-cover
                    shrink-0
                    bg-stone-100
                  "
                  referrerPolicy="no-referrer"
                />

                {/* 商品情報 */}

                <div
                  className="
                    flex-1
                    min-w-0
                    overflow-hidden
                  "
                >
                  {/* 店舗名 */}

                  <div className="mb-0.5 min-w-0">
                    <span
                      className="
                        block
                        w-full
                        text-[11px]
                        min-[380px]:text-sm
                        font-bold
                        text-stone-500
                        truncate
                      "
                    >
                      {language === 'ja'
                        ? coupon.shop.nameJa
                        : coupon.shop.nameEn}
                    </span>
                  </div>

                  {/* 商品名 */}

                  <h4
                    className="
                      text-sm
                      min-[380px]:text-lg
                      font-bold
                      text-stone-900
                      line-clamp-2
                      leading-snug
                      break-words
                    "
                  >
                    {language === 'ja'
                      ? coupon.titleJa
                      : coupon.titleEn}
                  </h4>

                  {/* 価格 */}

                  <div className="mt-1.5 min-w-0">
                    <div
                      className="
                        flex
                        items-baseline
                        gap-x-1.5
                        gap-y-0.5
                        min-w-0
                        flex-wrap
                      "
                    >
                      <span
                        className="
                          text-base
                          min-[380px]:text-xl
                          font-bold
                          text-stone-900
                          whitespace-nowrap
                        "
                      >
                        ¥
                        {coupon.discountPrice.toLocaleString()}
                      </span>

                      {coupon.originalPrice && (
                        <span
                          className="
                            text-[10px]
                            min-[380px]:text-sm
                            text-stone-400
                            line-through
                            whitespace-nowrap
                          "
                        >
                          ¥
                          {coupon.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* 割引率 */}

                    {coupon.discountPercent && (
                      <div
                        className="
                          mt-0.5
                          min-w-0
                        "
                      >
                        <span
                          className="
                            text-[10px]
                            min-[380px]:text-sm
                            text-rose-600
                            font-bold
                            whitespace-nowrap
                          "
                        >
                          {coupon.discountPercent}%
                          OFF
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ==================================
                    マップ表示ボタン
                =================================== */}

                <button
                  type="button"
                  onClick={(e) => {
                    // 商品詳細を開かないようにする
                    e.stopPropagation();

                    // この商品の店舗をマップで表示
                    onOpenMap(coupon);
                  }}
                  className="
                    shrink-0
                    w-[68px]
                    min-[380px]:w-[78px]
                    min-h-[64px]
                    rounded-2xl
                    px-1.5
                    py-2.5
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    text-white
                    shadow-md
                    active:scale-95
                    transition-all
                  "
                  style={{
                    backgroundColor:
                      themeConfig.primaryHex,
                  }}
                >
                  <MapPin
                    className="
                      w-5
                      h-5
                      text-white
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      min-[380px]:text-[11px]
                      font-black
                      whitespace-nowrap
                    "
                  >
                    {language === 'ja'
                      ? 'マップ表示'
                      : 'View Map'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};