import React from 'react';
import { X } from 'lucide-react';

import {
  Coupon,
  Language,
  ThemeColorConfig,
} from '../types';

interface CouponRedeemModalProps {
  coupon: Coupon | null;
  language: Language;
  themeConfig: ThemeColorConfig;
  onClose: () => void;
  walletBalance?: number;
  onPayWithWallet?: (
    amount: number,
    shopJa: string,
    shopEn: string
  ) => void;
}

export const CouponRedeemModal: React.FC<CouponRedeemModalProps> = ({
  coupon,
  language,
  onClose,
}) => {
  if (!coupon) return null;

  const couponName =
    language === 'ja'
      ? coupon.titleJa
      : coupon.titleEn;

  const barcodeNumber =
    `KWG-${coupon.id.toUpperCase()}-2026`;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        p-4
        bg-black/60
        backdrop-blur-sm
      "
    >
      <div
        className="
          relative
          w-full
          max-w-md
          bg-white
          rounded-3xl
          shadow-2xl
          overflow-hidden
        "
      >

        {/* =========================
            上部
            商品名を赤枠の位置に表示
        ========================== */}

        <div
          className="
            relative
            flex
            items-center
            justify-center
            min-h-[90px]
            px-16
            border-b
            border-stone-200
          "
        >

          {/* 商品名 */}
          <h2
            className="
              text-2xl
              font-bold
              text-stone-900
              text-center
              leading-tight
            "
          >
            {couponName}
          </h2>


          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              w-12
              h-12
              rounded-full
              bg-stone-100
              hover:bg-stone-200
              text-stone-600
              flex
              items-center
              justify-center
              transition-colors
            "
          >
            <X className="w-7 h-7" />
          </button>

        </div>


        {/* =========================
            バーコード
        ========================== */}

        <div className="p-6">

          <div
            className="
              bg-white
              border-2
              border-stone-300
              rounded-2xl
              p-6
              shadow-sm
            "
          >

            {/* バーコード本体 */}
            <div
              className="
                flex
                items-center
                justify-center
                gap-[2px]
                h-40
                overflow-hidden
                bg-white
              "
            >

              {[...Array(42)].map((_, i) => (

                <div
                  key={i}
                  className={`
                    bg-black
                    h-32
                    shrink-0

                    ${
                      i % 7 === 0
                        ? 'w-2'
                        : i % 5 === 0
                        ? 'w-1.5'
                        : i % 3 === 0
                        ? 'w-1'
                        : 'w-0.5'
                    }
                  `}
                />

              ))}

            </div>


            {/* バーコード番号 */}
            <p
              className="
                mt-4
                text-center
                text-base
                font-mono
                font-bold
                tracking-wider
                text-stone-900
              "
            >
              {barcodeNumber}
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};