import React, { useState } from 'react';

import {

  Search,

  ArrowUpDown,

  MapPin,

} from 'lucide-react';



import {

  Coupon,

  Language,

  ThemeColorConfig,

} from '../types';



interface CouponsTabProps {

  coupons: Coupon[];

  language: Language;

  themeConfig: ThemeColorConfig;

  onSelectCoupon: (coupon: Coupon) => void;



  // 選択したクーポンをマップで表示

  onOpenMap: (coupon: Coupon) => void;

}



export const CouponsTab: React.FC<CouponsTabProps> = ({

  coupons,

  language,

  themeConfig,

  onSelectCoupon,

  onOpenMap,

}) => {

  const [searchQuery, setSearchQuery] = useState('');



  const [filterType, setFilterType] = useState<

    'all' | 'time' | 'food_loss'

  >('all');



  const [sortBy, setSortBy] = useState<

    'near' | 'deadline' | 'discount'

  >('near');



  // =====================================================

  // フィルタリング・並び替え

  // =====================================================



  const filteredCoupons = coupons

    .filter((coupon) => {

      const query = searchQuery.toLowerCase();



      const shopName = (

        language === 'ja'

          ? coupon.shop.nameJa

          : coupon.shop.nameEn

      ).toLowerCase();



      const title = (

        language === 'ja'

          ? coupon.titleJa

          : coupon.titleEn

      ).toLowerCase();



      const area = (

        language === 'ja'

          ? coupon.shop.areaJa

          : coupon.shop.areaEn

      ).toLowerCase();



      const matchesSearch =

        shopName.includes(query) ||

        title.includes(query) ||

        area.includes(query);



      if (filterType === 'time') {

        return (

          matchesSearch &&

          coupon.type === 'time'

        );

      }



      if (filterType === 'food_loss') {

        return (

          matchesSearch &&

          coupon.type === 'food_loss'

        );

      }



      return matchesSearch;

    })

    .sort((a, b) => {

      if (sortBy === 'near') {

        return (

          a.shop.walkingMinutes -

          b.shop.walkingMinutes

        );

      }



      if (sortBy === 'discount') {

        return (

          b.discountPercent -

          a.discountPercent

        );

      }



      return 0;

    });



  const timeCount = coupons.filter(

    (coupon) => coupon.type === 'time'

  ).length;



  const foodLossCount = coupons.filter(

    (coupon) => coupon.type === 'food_loss'

  ).length;



  return (

    <div

      className="

        w-full

        max-w-md

        mx-auto

        px-3

        sm:px-4

        pt-3

        pb-24

        space-y-3

        overflow-x-hidden

      "

    >

      {/* =====================================================

          検索

      ====================================================== */}



      <div className="relative w-full min-w-0">

        <Search

          className="

            absolute

            left-3

            top-1/2

            -translate-y-1/2

            w-4

            h-4

            text-stone-400

            pointer-events-none

          "

        />



        <input

          type="text"

          value={searchQuery}

          onChange={(e) =>

            setSearchQuery(e.target.value)

          }

          placeholder={

            language === 'ja'

              ? '店舗名・メニュー・エリアで検索'

              : 'Search shops, menu, area'

          }

          className="

            w-full

            min-w-0

            h-11

            pl-9

            pr-3

            bg-white

            rounded-2xl

            border

            border-stone-200

            text-sm

            text-stone-900

            placeholder:text-stone-400

            shadow-sm

            focus:outline-none

            focus:ring-2

            focus:ring-stone-300

          "

        />

      </div>



      {/* =====================================================

          クーポン種類

      ====================================================== */}



      <div

        className="

          w-full

          min-w-0

          bg-stone-200/70

          p-1

          rounded-2xl

          grid

          grid-cols-3

          gap-1

          font-bold

        "

      >

        <button

          type="button"

          onClick={() => setFilterType('all')}

          className={`

            min-w-0

            px-1

            py-2.5

            rounded-xl

            transition-all

            text-center

            text-xs

            min-[380px]:text-sm

            ${

              filterType === 'all'

                ? 'bg-white text-stone-900 shadow-sm'

                : 'text-stone-600 hover:text-stone-900'

            }

          `}

        >

          {language === 'ja'

            ? `すべて (${coupons.length})`

            : `All (${coupons.length})`}

        </button>



        <button

          type="button"

          onClick={() => setFilterType('time')}

          className={`

            min-w-0

            px-1

            py-2.5

            rounded-xl

            transition-all

            text-center

            text-xs

            min-[380px]:text-sm

            ${

              filterType === 'time'

                ? 'bg-white text-stone-900 shadow-sm'

                : 'text-stone-600 hover:text-stone-900'

            }

          `}

        >

          {language === 'ja'

            ? `タイム (${timeCount})`

            : `Time (${timeCount})`}

        </button>



        <button

          type="button"

          onClick={() =>

            setFilterType('food_loss')

          }

          className={`

            min-w-0

            px-1

            py-2.5

            rounded-xl

            transition-all

            text-center

            text-[11px]

            min-[380px]:text-sm

            ${

              filterType === 'food_loss'

                ? 'bg-white text-stone-900 shadow-sm'

                : 'text-stone-600 hover:text-stone-900'

            }

          `}

        >

          {language === 'ja'

            ? `フードロス (${foodLossCount})`

            : `Food Loss (${foodLossCount})`}

        </button>

      </div>



      {/* =====================================================

          並び替え

      ====================================================== */}



      <div className="w-full min-w-0">

        <div

          className="

            flex

            items-center

            gap-1.5

            overflow-x-auto

            pb-1

            no-scrollbar

          "

        >

          <span

            className="

              text-xs

              font-bold

              text-stone-500

              flex

              items-center

              gap-1

              shrink-0

            "

          >

            <ArrowUpDown className="w-3.5 h-3.5" />



            {language === 'ja'

              ? '並び順'

              : 'Sort'}

          </span>



          <button

            type="button"

            onClick={() => setSortBy('near')}

            className={`

              px-2.5

              py-1.5

              rounded-full

              text-xs

              font-bold

              transition-all

              shrink-0

              ${

                sortBy === 'near'

                  ? 'text-white shadow-sm'

                  : 'bg-white text-stone-700 border border-stone-200'

              }

            `}

            style={

              sortBy === 'near'

                ? {

                    backgroundColor:

                      themeConfig.primaryHex,

                  }

                : undefined

            }

          >

            {language === 'ja'

              ? '近い順'

              : 'Nearest'}

          </button>



          <button

            type="button"

            onClick={() =>

              setSortBy('deadline')

            }

            className={`

              px-2.5

              py-1.5

              rounded-full

              text-xs

              font-bold

              transition-all

              shrink-0

              ${

                sortBy === 'deadline'

                  ? 'text-white shadow-sm'

                  : 'bg-white text-stone-700 border border-stone-200'

              }

            `}

            style={

              sortBy === 'deadline'

                ? {

                    backgroundColor:

                      themeConfig.primaryHex,

                  }

                : undefined

            }

          >

            {language === 'ja'

              ? '締め切り順'

              : 'Deadline'}

          </button>



          <button

            type="button"

            onClick={() =>

              setSortBy('discount')

            }

            className={`

              px-2.5

              py-1.5

              rounded-full

              text-xs

              font-bold

              transition-all

              shrink-0

              ${

                sortBy === 'discount'

                  ? 'text-white shadow-sm'

                  : 'bg-white text-stone-700 border border-stone-200'

              }

            `}

            style={

              sortBy === 'discount'

                ? {

                    backgroundColor:

                      themeConfig.primaryHex,

                  }

                : undefined

            }

          >

            {language === 'ja'

              ? '割引率順'

              : 'Discount'}

          </button>

        </div>

      </div>



      {/* =====================================================

          件数

      ====================================================== */}



      <div

        className="

          px-1

          text-xs

          min-[380px]:text-sm

          font-bold

          text-stone-500

        "

      >

        {filteredCoupons.length}

        {language === 'ja'

          ? '件のクーポンを表示中'

          : ' coupons found'}

      </div>



      {/* =====================================================
          クーポン一覧
      ====================================================== */}

      <div className="space-y-3">
        {filteredCoupons.map((coupon) => (
          <div
            key={coupon.id}
            onClick={() => onSelectCoupon(coupon)}
            className="
              w-full min-w-0 overflow-hidden bg-white rounded-2xl
              p-3 min-[380px]:p-4 border border-stone-200 shadow-sm
              hover:shadow-md active:scale-[0.99] transition-all cursor-pointer
            "
          >
            {/* 上段：画像 + 商品情報 */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-24 h-24 min-[380px]:w-28 min-[380px]:h-28 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                <img
                  src={coupon.imageUrl}
                  alt={language === 'ja' ? coupon.titleJa : coupon.titleEn}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div
                  className="absolute bottom-1 left-1 text-xs font-bold px-2 py-1 rounded-lg text-white shadow-sm"
                  style={{ backgroundColor: themeConfig.primaryHex }}
                >
                  {coupon.discountPercent}%
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="flex-1 min-w-0 text-sm font-bold text-stone-600 leading-snug break-words">
                    {language === 'ja' ? coupon.shop.nameJa : coupon.shop.nameEn}
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-xs text-stone-500">
                    {language === 'ja'
                      ? `徒歩${coupon.shop.walkingMinutes}分`
                      : `${coupon.shop.walkingMinutes} min`}
                  </span>
                </div>

                <h4 className="mt-1 text-xl font-black text-stone-900 leading-tight break-words">
                  {language === 'ja' ? coupon.titleJa : coupon.titleEn}
                </h4>

                <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl font-black text-stone-900 tabular-nums whitespace-nowrap">
                    ¥{coupon.discountPrice.toLocaleString()}
                  </span>
                  {coupon.originalPrice && (
                    <span className="text-sm text-stone-400 line-through tabular-nums whitespace-nowrap">
                      ¥{coupon.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 下段：残数/時間 + マップ表示 */}
            <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
              <span className="min-w-0 text-sm font-bold text-stone-600 leading-snug">
                {coupon.type === 'time'
                  ? language === 'ja'
                    ? coupon.timeSlotJa
                    : coupon.timeSlotEn
                  : language === 'ja'
                    ? `残り${coupon.remainingStock}点`
                    : `${coupon.remainingStock} left`}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenMap(coupon);
                }}
                className="
                  shrink-0 h-11 px-4 rounded-xl flex items-center justify-center
                  gap-1.5 text-white text-sm font-black shadow-sm
                  active:scale-95 transition-all
                "
                style={{ backgroundColor: themeConfig.primaryHex }}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">
                  {language === 'ja' ? 'マップ表示' : 'View Map'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================

          検索結果なし

      ====================================================== */}



      {filteredCoupons.length === 0 && (

        <div

          className="

            bg-white

            rounded-2xl

            border

            border-stone-200

            py-12

            px-5

            text-center

          "

        >

          <p

            className="

              text-sm

              min-[380px]:text-base

              font-bold

              text-stone-700

            "

          >

            {language === 'ja'

              ? '該当するクーポンが見つかりませんでした。'

              : 'No coupons found.'}

          </p>

        </div>

      )}

    </div>

  );

};