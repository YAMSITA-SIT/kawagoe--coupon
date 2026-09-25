import React, { useState } from 'react';
import { Search, Clock, ArrowUpDown, Plus, Sparkles, MapPin } from 'lucide-react';
import { Coupon, Language, ThemeColorConfig } from '../types';
import { translations } from '../data/translations';

interface CouponsTabProps {
  coupons: Coupon[];
  language: Language;
  themeConfig: ThemeColorConfig;
  onSelectCoupon: (coupon: Coupon) => void;
  onOpenNewCouponModal: () => void;
}

export const CouponsTab: React.FC<CouponsTabProps> = ({
  coupons,
  language,
  themeConfig,
  onSelectCoupon,
  onOpenNewCouponModal,
}) => {
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'time' | 'food_loss'>('all');
  const [sortBy, setSortBy] = useState<'near' | 'deadline' | 'discount'>('near');

  // フィルタリングと並び替えロジック
  const filteredCoupons = coupons.filter((coupon) => {
    const query = searchQuery.toLowerCase();
    const shopName = (language === 'ja' ? coupon.shop.nameJa : coupon.shop.nameEn).toLowerCase();
    const title = (language === 'ja' ? coupon.titleJa : coupon.titleEn).toLowerCase();
    const area = (language === 'ja' ? coupon.shop.areaJa : coupon.shop.areaEn).toLowerCase();
    
    const matchesSearch = shopName.includes(query) || title.includes(query) || area.includes(query);
    
    if (filterType === 'time') return matchesSearch && coupon.type === 'time';
    if (filterType === 'food_loss') return matchesSearch && coupon.type === 'food_loss';
    return matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'near') return a.shop.walkingMinutes - b.shop.walkingMinutes;
    if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
    return 0;
  });

  const timeCount = coupons.filter(c => c.type === 'time').length;
  const foodLossCount = coupons.filter(c => c.type === 'food_loss').length;

  return (
    <div className="pb-24 space-y-4 px-4 pt-3 max-w-md mx-auto">
      
      {/* 画面タイトル */}
      <div className="text-center pb-1">
        <h2 className="text-sm font-bold text-stone-800 tracking-wider">
          {language === 'ja' ? 'クーポン一覧' : 'Coupon List'}
        </h2>
      </div>

      {/* 新着クーポン追加ボタン */}
      <button
        type="button"
        onClick={onOpenNewCouponModal}
        className="w-full h-12 rounded-2xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
        style={{ backgroundColor: themeConfig.primaryHex }}
      >
        <Plus className="w-4 h-4" />
        <span>{language === 'ja' ? '+新着クーポン・特典を探す' : '+ Find New Coupons'}</span>
      </button>

      {/* 検索バー */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'ja' ? '店舗名・メニュー・エリアで絞り込み' : 'Search by shop, menu, area'}
          className="w-full h-11 pl-10 pr-4 bg-white rounded-2xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>

      {/* 修正1：タブボタン（すべて、タイムクーポン、フードロスクーポン）の見やすさ改善 */}
      <div className="bg-stone-200/70 p-1 rounded-2xl grid grid-cols-3 gap-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`py-2 rounded-xl transition-all text-center ${
            filterType === 'all' 
              ? 'bg-white text-stone-900 shadow-xs' 
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          すべて ({coupons.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('time')}
          className={`py-2 rounded-xl transition-all text-center px-1 ${
            filterType === 'time' 
              ? 'bg-white text-stone-900 shadow-xs' 
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          タイム ({timeCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('food_loss')}
          className={`py-2 rounded-xl transition-all text-center px-1 ${
            filterType === 'food_loss' 
              ? 'bg-white text-stone-900 shadow-xs' 
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          フードロス ({foodLossCount})
        </button>
      </div>

      {/* 並び替えフィルター */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1 shrink-0">
          <ArrowUpDown className="w-3 h-3" /> 
          {language === 'ja' ? '並び順:' : 'Sort:'}
        </span>
        <button
          type="button"
          onClick={() => setSortBy('near')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            sortBy === 'near' 
              ? 'bg-amber-600 text-white shadow-xs' 
              : 'bg-white text-stone-700 border border-stone-200'
          }`}
        >
          {language === 'ja' ? '近い順' : 'Nearest'}
        </button>
        <button
          type="button"
          onClick={() => setSortBy('deadline')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            sortBy === 'deadline' 
              ? 'bg-amber-600 text-white shadow-xs' 
              : 'bg-white text-stone-700 border border-stone-200'
          }`}
        >
          {language === 'ja' ? '締め切り順' : 'Deadline'}
        </button>
        <button
          type="button"
          onClick={() => setSortBy('discount')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            sortBy === 'discount' 
              ? 'bg-amber-600 text-white shadow-xs' 
              : 'bg-white text-stone-700 border border-stone-200'
          }`}
        >
          {language === 'ja' ? '割引率順' : 'Highest Discount'}
        </button>
      </div>

      <div className="text-[11px] font-bold text-stone-500 px-1">
        {filteredCoupons.length} {language === 'ja' ? '件のクーポンを表示中' : 'coupons found'}
      </div>

      {/* クーポン一覧リスト */}
      <div className="space-y-3">
        {filteredCoupons.map((coupon) => (
          <div
            key={coupon.id}
            onClick={() => onSelectCoupon(coupon)}
            // 修正3：右側の不要な丸い矢印アイコンを削除し、カード全体をクリックしやすくしました
            className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-sm hover:shadow-md transition-all flex items-center gap-3.5 cursor-pointer"
          >
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0">
              <img
                src={coupon.imageUrl}
                alt={coupon.titleJa}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div 
                className="absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded text-white shadow-xs"
                style={{ backgroundColor: themeConfig.primaryHex }}
              >
                {coupon.discountPercent}%
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {/* 修正2：店舗名が途切れずにしっかり表示されるように修正 */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-stone-800 leading-tight">
                  {language === 'ja' ? coupon.shop.nameJa : coupon.shop.nameEn}
                </span>
                <span className="text-[10px] text-stone-500 shrink-0 ml-1">
                  徒歩{coupon.shop.walkingMinutes}分
                </span>
              </div>

              <h4 className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug">
                {language === 'ja' ? coupon.titleJa : coupon.titleEn}
              </h4>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-sm font-bold text-stone-900 tabular-nums">
                  ¥{coupon.discountPrice.toLocaleString()}
                </span>
                {coupon.originalPrice && (
                  <span className="text-[10px] text-stone-400 line-through tabular-nums">
                    ¥{coupon.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-[10px] font-semibold text-stone-600 ml-auto">
                  {coupon.type === 'time' 
                    ? (language === 'ja' ? coupon.timeSlotJa : coupon.timeSlotEn)
                    : `残り${coupon.remainingStock}点`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};