import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Ticket, 
  Barcode 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Coupon, Language, ThemeColorConfig } from '../types';
import { translations } from '../data/translations';

interface CouponRedeemModalProps {
  coupon: Coupon | null;
  language: Language;
  themeConfig: ThemeColorConfig;
  onClose: () => void;
  walletBalance?: number;
  onPayWithWallet?: (amount: number, shopJa: string, shopEn: string) => void;
}

export const CouponRedeemModal: React.FC<CouponRedeemModalProps> = ({
  coupon,
  language,
  themeConfig,
  onClose,
  walletBalance = 5000,
  onPayWithWallet,
}) => {
  const t = translations[language];

  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);

  if (!coupon) return null;

  const handleConfirmRedeem = () => {
    setIsRedeeming(false);
    setIsRedeemed(true);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: [themeConfig.primaryHex, '#f39c12', '#10b981'],
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-stone-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-stone-900 animate-in slide-in-from-bottom duration-300">
        
        {/* Top header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 bg-stone-50 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: 'var(--theme-primary)' }}
            />
            <span className="text-xs font-bold text-stone-800 truncate">
              {language === 'ja' ? coupon.shop.nameJa : coupon.shop.nameEn}
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

        {/* Scrollable body */}
        <div className="overflow-y-auto p-5 space-y-4 no-scrollbar">
          
          {/* バーコード発行前（通常時）だけ表示するエリア */}
          {!isRedeemed && (
            <>
              {/* Hero image & badge */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100 shadow-sm">
                <img
                  src={coupon.imageUrl}
                  alt={coupon.titleJa}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div 
                  className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-lg shadow-sm text-white"
                  style={{ backgroundColor: 'var(--theme-primary)' }}
                >
                  {language === 'ja' ? coupon.discountBadgeJa : coupon.discountBadgeEn}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base font-bold leading-snug">
                    {language === 'ja' ? coupon.titleJa : coupon.titleEn}
                  </h3>
                </div>
              </div>

              {/* Pricing highlight box */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-center justify-between">
                <div>
                  {coupon.originalPrice && (
                    <div className="text-xs text-stone-500 line-through tabular-nums">
                      {t.originalPriceLabel}: ¥{coupon.originalPrice.toLocaleString()}
                    </div>
                  )}
                  <div className="text-xl font-bold text-stone-900 tabular-nums flex items-baseline gap-2">
                    <span>¥{coupon.discountPrice.toLocaleString()}</span>
                    {coupon.discountPercent && (
                      <span className="text-xs text-rose-600 font-bold">
                        ({coupon.discountPercent}% OFF)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {coupon.type === 'time' && (
                    <span className="text-[11px] font-semibold text-stone-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      <span>{language === 'ja' ? coupon.timeSlotJa : coupon.timeSlotEn}</span>
                    </span>
                  )}
                  {coupon.type === 'food_loss' && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      {t.foodLossStockLeft} {coupon.remainingStock} {t.foodLossStockUnit}
                    </span>
                  )}
                </div>
              </div>

              {/* Store Access info (赤枠部分) */}
              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  <span>{language === 'ja' ? coupon.shop.addressJa : coupon.shop.addressEn}</span>
                </div>
                <p className="text-[11px] text-stone-600 pl-5">
                  {language === 'ja' ? coupon.shop.distanceFromStationJa : coupon.shop.distanceFromStationEn}
                </p>
              </div>

              {/* Description (赤枠部分) */}
              <p className="text-xs text-stone-700 leading-relaxed">
                {language === 'ja' ? coupon.descriptionJa : coupon.descriptionEn}
              </p>
            </>
          )}

          {/* Live In-Store Redemption View (バーコード発行後はこれだけが画面に収まるサイズで表示されます) */}
          {isRedeemed ? (
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-300 text-center space-y-3 shadow-md animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">お会計時に店舗スタッフへこの画面をお見せください</h4>
                <p className="text-xs text-emerald-800 mt-0.5">有効なクーポンバーコードが発行されました。</p>
              </div>

              {/* 本物のバーコード風デザイン */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 inline-block shadow-sm mx-auto space-y-2 w-full">
                <div className="flex items-center justify-center gap-0.5 h-16 px-3 bg-stone-50 rounded-xl overflow-hidden">
                  {[...Array(32)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`bg-stone-900 h-12 ${
                        i % 5 === 0 ? 'w-1.5' : i % 3 === 0 ? 'w-0.5' : i % 2 === 0 ? 'w-1' : 'w-0.5'
                      }`} 
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-stone-700 font-bold tracking-widest">
                  <Barcode className="w-4 h-4 text-stone-500" />
                  <span>KWG-{coupon.id.toUpperCase()}-2026</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRedeemed(false)}
                className="w-full h-10 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold transition-colors"
              >
                クーポン詳細に戻る
              </button>
            </div>
          ) : (
            <div className="pt-2 space-y-2.5">
              
              {/* クーポン表示ボタン */}
              <button
                type="button"
                onClick={handleConfirmRedeem}
                className="w-full h-12 rounded-2xl font-bold text-xs text-white bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
              >
                <Ticket className="w-4 h-4" />
                <span>{language === 'ja' ? 'クーポン表示（バーコードを発行）' : 'Show Coupon Barcode'}</span>
              </button>

              {/* Option 1: Pay with Koedo Pay */}
              {onPayWithWallet && (
                <button
                  type="button"
                  onClick={() => {
                    if (walletBalance < coupon.discountPrice) {
                      alert(language === 'ja' ? '小江戸Pay残高が不足しています。チャージしてください。' : 'Insufficient balance.');
                      return;
                    }
                    onPayWithWallet(coupon.discountPrice, coupon.shop.nameJa, coupon.shop.nameEn);
                    handleConfirmRedeem();
                  }}
                  className="w-full h-11 rounded-2xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-[0.98] transition-all"
                  style={{
                    backgroundColor: 'var(--theme-primary)',
                    color: 'var(--theme-contrast-text)',
                  }}
                >
                  <span className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center font-bold text-[11px]">¥</span>
                  <span>
                    {language === 'ja' 
                      ? `小江戸Payで支払う (¥${coupon.discountPrice.toLocaleString()})` 
                      : `Pay with Koedo Pay (¥${coupon.discountPrice.toLocaleString()})`}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};