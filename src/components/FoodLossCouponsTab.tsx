import React, { useState, useEffect } from 'react';
import { Leaf, Clock, AlertTriangle, ChevronRight, Footprints, ShieldCheck } from 'lucide-react';
import { Coupon, Language, ThemeColorConfig } from '../types';
import { translations } from '../data/translations';

interface FoodLossCouponsTabProps {
  coupons: Coupon[];
  language: Language;
  themeConfig: ThemeColorConfig;
  onSelectCoupon: (coupon: Coupon) => void;
}

export const FoodLossCouponsTab: React.FC<FoodLossCouponsTabProps> = ({
  coupons,
  language,
  themeConfig,
  onSelectCoupon,
}) => {
  const t = translations[language];

  const foodLossCoupons = coupons.filter((c) => c.type === 'food_loss');

  // Live countdown timer state
  const [secondsLeftMap, setSecondsLeftMap] = useState<{ [id: string]: number }>({
    'food-loss-1': 4920,
    'food-loss-2': 3180,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeftMap((prev) => {
        const next: { [id: string]: number } = {};
        for (const key of Object.keys(prev)) {
          next[key] = Math.max(0, prev[key] - 1);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pb-8 space-y-4 bg-[#f9f9f9]">
      {/* Top Banner: Warm Orange/Gold Theme Fill with Clean Japanese Typography */}
      <div 
        className="p-5 shadow-sm text-white transition-colors"
        style={{
          backgroundColor: 'var(--theme-primary)',
          color: 'var(--theme-contrast-text)',
        }}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-1.5">
            <Leaf className="w-5 h-5 shrink-0" style={{ color: 'var(--theme-contrast-text)' }} />
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              {t.foodLossHeaderTitle}
            </h2>
          </div>
          <p className="text-xs leading-relaxed max-w-sm opacity-95">
            {t.foodLossHeaderDesc}
          </p>
        </div>
      </div>

      {/* Cards list: Clean White Cards with Right Arrow ▶ */}
      <div className="px-4 max-w-md mx-auto space-y-3.5">
        {foodLossCoupons.map((coupon) => {
          const currentSec = secondsLeftMap[coupon.id] ?? coupon.expiresInSeconds ?? 3600;
          const isUrgent = (coupon.remainingStock ?? 5) <= 3;

          return (
            <article
              key={coupon.id}
              onClick={() => onSelectCoupon(coupon)}
              className="group bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-stone-400 hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col active:scale-[0.99]"
            >
              {/* Image banner with high contrast badge */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
                <img
                  src={coupon.imageUrl}
                  alt={coupon.titleJa}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Stamped discount tag */}
                <div 
                  className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-lg shadow-sm text-white"
                  style={{
                    backgroundColor: 'var(--theme-primary)',
                  }}
                >
                  {language === 'ja' ? coupon.discountBadgeJa : coupon.discountBadgeEn}
                </div>

                {/* Stock remaining badge */}
                <div className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm ${
                  isUrgent ? 'bg-amber-400 text-stone-950 font-black animate-pulse' : 'bg-white/95 text-stone-900'
                }`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t.foodLossStockLeft} {coupon.remainingStock} {t.foodLossStockUnit}</span>
                </div>

                {/* Live timer overlay */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] bg-black/75 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/20">
                  <span className="flex items-center gap-1.5 font-medium text-stone-200">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t.foodLossTimeLimit} ({coupon.foodLossDeadline ?? '20:00'}迄)</span>
                  </span>
                  <span className="font-mono font-bold tracking-wider text-amber-300 tabular-nums">
                    {formatCountdown(currentSec)}
                  </span>
                </div>
              </div>

              {/* Card text body in clean Gothic typography */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-bold text-stone-800">
                    {language === 'ja' ? coupon.shop.nameJa : coupon.shop.nameEn}
                  </span>
                  <span className="text-[11px] flex items-center gap-1 text-stone-500">
                    <Footprints className="w-3 h-3 text-stone-400" />
                    <span>{language === 'ja' ? coupon.shop.distanceFromStationJa : coupon.shop.distanceFromStationEn}</span>
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-snug">
                    {language === 'ja' ? coupon.titleJa : coupon.titleEn}
                  </h3>
                  {/* Right Arrow Affordance ▶ */}
                  <div className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center shrink-0 transition-colors mt-0.5">
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700" />
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                  {language === 'ja' ? coupon.descriptionJa : coupon.descriptionEn}
                </p>

                {/* Environmental rescue note */}
                <div 
                  className="rounded-xl p-2.5 flex items-center gap-2 text-xs border border-emerald-200/80 bg-emerald-50/70"
                >
                  <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] leading-tight font-medium text-emerald-900">
                    {language === 'ja' ? coupon.foodLossNoteJa : coupon.foodLossNoteEn}
                  </span>
                </div>

                {/* Pricing & action footer */}
                <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    {coupon.originalPrice && (
                      <span className="text-[11px] text-stone-400 line-through mr-2 tabular-nums">
                        ¥{coupon.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-base font-bold text-stone-900 tabular-nums">
                      ¥{coupon.discountPrice.toLocaleString()}
                    </span>
                    {coupon.discountPercent && (
                      <span className="text-xs font-bold text-rose-600 ml-1.5">
                        ({coupon.discountPercent}% OFF)
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCoupon(coupon);
                    }}
                    className="h-8 px-4 rounded-xl text-xs font-bold text-white shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center gap-1"
                    style={{
                      backgroundColor: 'var(--theme-primary)',
                      color: 'var(--theme-contrast-text)',
                    }}
                  >
                    <span>{t.foodLossAction}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
