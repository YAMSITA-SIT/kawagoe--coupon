import React, { useState } from 'react';
import { Clock, Footprints, ChevronRight, Filter, Sparkles, MapPin } from 'lucide-react';
import { Coupon, Language, ThemeColorConfig } from '../types';
import { translations } from '../data/translations';

interface TimeCouponsTabProps {
  coupons: Coupon[];
  language: Language;
  themeConfig: ThemeColorConfig;
  onSelectCoupon: (coupon: Coupon) => void;
}

export const TimeCouponsTab: React.FC<TimeCouponsTabProps> = ({
  coupons,
  language,
  themeConfig,
  onSelectCoupon,
}) => {
  const t = translations[language];
  const [filterType, setFilterType] = useState<string>('all');

  const timeCoupons = coupons.filter((c) => c.type === 'time');

  const filtered = timeCoupons.filter((c) => {
    if (filterType === 'all') return true;
    if (filterType === 'weekday' && c.timeSlotType === 'weekday_afternoon') return true;
    if (filterType === 'night' && c.timeSlotType === 'evening_night') return true;
    if (filterType === 'remote' && c.shop.walkingMinutes >= 12) return true;
    return true;
  });

  return (
    <div className="pb-8 space-y-4 bg-[#f9f9f9]">
      {/* Top Banner: Warm Orange/Gold Theme Fill */}
      <div 
        className="p-5 shadow-sm text-white transition-colors"
        style={{
          backgroundColor: 'var(--theme-primary)',
          color: 'var(--theme-contrast-text)',
        }}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock className="w-5 h-5 shrink-0" style={{ color: 'var(--theme-contrast-text)' }} />
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              {t.timeHeaderTitle}
            </h2>
          </div>
          <p className="text-xs leading-relaxed max-w-sm opacity-95">
            {t.timeHeaderDesc}
          </p>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
            {[
              { id: 'all', label: t.timeFilterAll },
              { id: 'weekday', label: t.timeFilterWeekday },
              { id: 'night', label: t.timeFilterNight },
              { id: 'remote', label: t.timeFilterRemote },
            ].map((item) => {
              const isActive = filterType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilterType(item.id)}
                  className="h-8 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm active:scale-95"
                  style={{
                    backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.22)',
                    color: isActive ? '#1c1917' : '#ffffff',
                    border: isActive ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cards list: Clean White Cards with Right Arrow ▶ */}
      <div className="px-4 max-w-md mx-auto space-y-3.5">
        {filtered.map((coupon) => (
          <article
            key={coupon.id}
            onClick={() => onSelectCoupon(coupon)}
            className="group bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-stone-400 hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col active:scale-[0.99]"
          >
            {/* Image banner */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
              <img
                src={coupon.imageUrl}
                alt={coupon.titleJa}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Time slot discount badge */}
              <div 
                className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-lg shadow-sm text-white"
                style={{
                  backgroundColor: 'var(--theme-primary)',
                }}
              >
                {language === 'ja' ? coupon.discountBadgeJa : coupon.discountBadgeEn}
              </div>

              {/* Station distance badge */}
              <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] flex items-center gap-1.5 font-medium bg-black/75 backdrop-blur-sm px-2.5 py-1.5 rounded-xl border border-white/20">
                <Footprints className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">
                  {language === 'ja' ? coupon.shop.distanceFromStationJa : coupon.shop.distanceFromStationEn}
                </span>
              </div>
            </div>

            {/* Card text body in clean Gothic typography */}
            <div className="p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-bold text-stone-800">
                  {language === 'ja' ? coupon.shop.nameJa : coupon.shop.nameEn}
                </span>
                <span className="text-[11px] text-stone-500">
                  {language === 'ja' ? coupon.shop.areaJa : coupon.shop.areaEn}
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

              {/* Off-Peak Time Slot Highlight Box */}
              <div 
                className="rounded-xl p-3 border border-amber-200/90 bg-amber-50/70 text-xs shadow-xs"
              >
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{language === 'ja' ? coupon.timeSlotJa : coupon.timeSlotEn}</span>
                </div>
                <p className="text-[11px] text-amber-900 mt-1 leading-relaxed">
                  {language === 'ja' ? coupon.offPeakReasonJa : coupon.offPeakReasonEn}
                </p>
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
                    <span className="text-xs font-bold text-amber-600 ml-1.5">
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
                  <span>{language === 'ja' ? '詳細・利用' : 'View & Use'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
