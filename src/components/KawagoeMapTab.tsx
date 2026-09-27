import React, { useEffect, useRef, useState } from 'react';



import mapboxgl from 'mapbox-gl';



import 'mapbox-gl/dist/mapbox-gl.css';



import {



  Search,



  ChevronLeft,



  ChevronRight,



  X,



  Moon,



  MapPin,



  ExternalLink,



  Globe,

  SlidersHorizontal,

  Clock,

  Wallet,

  Navigation,

  Sparkles,
  CalendarDays,



} from 'lucide-react';



import {



  Coupon,



  Language,



  ThemeColorConfig,



} from '../types';



import { translations } from '../data/translations';



// ============================================================



// Mapbox



// ============================================================



mapboxgl.accessToken =



  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';



// ============================================================



// Props



// ============================================================



interface KawagoeMapTabProps {
  coupons: Coupon[];
  language: Language;
  themeConfig: ThemeColorConfig;
  onSelectCoupon: (coupon: Coupon) => void;
  mapMode?: 'normal' | 'night';

  // クーポン画面から指定されたクーポン
  initialCouponId?: string | null;
}


// ============================================================



// 夜スポットの型



// ============================================================



type NightSpotCategory =



  | 'view'



  | 'restaurant'



  | 'cafe'
  | 'event';



interface NightSpot {
  id: string;
  nameJa: string;
  nameEn: string;
  descriptionJa: string;
  descriptionEn: string;
  category: NightSpotCategory;
  longitude: number;
  latitude: number;

  // 営業時間など
  hoursJa?: string;
  hoursEn?: string;

  // 公式Webサイト
  websiteUrl?: string;

  // おすすめ検索用（予算は1人あたりの目安）
  estimatedMinPrice?: number;
  openHour?: number;
  closeHour?: number;

  // 期間限定イベント用
  eventStartDate?: string;
  eventEndDate?: string;

  // イベントの出典
  sourceUrl?: string;

  // Googleマップ
  googleMapsUrl?: string;
}


// ============================================================



// 夜の川越スポット



// ============================================================



const NIGHT_SPOTS: NightSpot[] = [



  {



    id: 'toki-no-kane',



    nameJa: '時の鐘',



    nameEn: 'Toki no Kane',



    descriptionJa:



      '川越を代表するシンボル。夜になると昼とは違った落ち着いた雰囲気の蔵造りの町並みを楽しめます。',



    descriptionEn:



      'One of Kawagoe’s most famous landmarks. Enjoy the historic warehouse district in a quieter nighttime atmosphere.',



    category: 'view',



    longitude: 139.4832,



    latitude: 35.9236,



    hoursJa: '夜の街歩きスポット',



    hoursEn: 'Night walking spot',



    websiteUrl:



      'https\://www.city.kawagoe.saitama.jp/kanko/k-spots/1011557/1011562.html',



  },



  {



    id: 'kurazukuri',



    nameJa: '蔵造りの町並み',



    nameEn: 'Kurazukuri Street',



    descriptionJa:



      '江戸の面影を残す川越の代表的な町並み。夕方から夜にかけて、昼間とは異なる雰囲気を楽しめます。',



    descriptionEn:



      'Kawagoe’s historic warehouse district. The streets take on a different atmosphere after sunset.',



    category: 'view',



    longitude: 139.4822,



    latitude: 35.9227,



    hoursJa: '夜の街歩きスポット',



    hoursEn: 'Night walking spot',



    websiteUrl:



      'https\://www.city.kawagoe.saitama.jp/kanko/k-spots/1011557/1011559.html',



  },



  {



    id: 'kashiya-yokocho',



    nameJa: '菓子屋横丁周辺',



    nameEn: 'Kashiya Yokocho Area',



    descriptionJa:



      '昔ながらの川越らしい町並みを感じられるエリア。店舗閉店後も周辺の街並みを散策できます。',



    descriptionEn:



      'A nostalgic area known for traditional Kawagoe scenery. Shops may close earlier, but the surrounding streets can still be explored.',



    category: 'view',



    longitude: 139.4811,



    latitude: 35.9245,



    hoursJa: '店舗の営業時間は各店舗で異なります',



    hoursEn: 'Shop hours vary',



    websiteUrl:



      'https\://www.city.kawagoe.saitama.jp/kanko/k-spots/1011557/1011568.html',



  },



  {



    id: 'coedo-brewery',



    nameJa: 'COEDO BREWERY THE RESTAURANT',



    nameEn: 'COEDO BREWERY THE RESTAURANT',



    descriptionJa:



      '川越で夜の食事を楽しむ候補のひとつ。川越観光の後のディナーにも利用できます。',



    descriptionEn:



      'A dining option for enjoying an evening meal after sightseeing in Kawagoe.',



    category: 'restaurant',



    longitude: 139.4865,



    latitude: 35.9089,



    hoursJa: '営業時間は公式情報をご確認ください',



    hoursEn: 'Please check the latest opening hours',



    websiteUrl:



      'https\://coedobrewery.com/pages/the-restaurant',



    estimatedMinPrice: 2000,



  },



  {



    id: 'sentiamo',



    nameJa: 'SENTIAMO',



    nameEn: 'SENTIAMO',



    descriptionJa:



      '川越でディナーを楽しめる飲食店の候補です。夜の川越観光と組み合わせて利用できます。',



    descriptionEn:



      'A dinner option that can be combined with an evening trip around Kawagoe.',



    category: 'restaurant',



    longitude: 139.4828,



    latitude: 35.9144,



    hoursJa: '営業時間は公式情報をご確認ください',



    hoursEn: 'Please check the latest opening hours',



    websiteUrl:



      'https\://restaurant-sentiamo.com/',



    estimatedMinPrice: 5000,



  },



  {



    id: 'kawagoe-kou-sushi',



    nameJa: '川越 幸すし',



    nameEn: 'Kawagoe Ko Sushi',



    descriptionJa:



      '川越観光の夜ごはん候補として利用できる寿司店です。',



    descriptionEn:



      'A sushi restaurant that can be an option for dinner during an evening visit to Kawagoe.',



    category: 'restaurant',



    longitude: 139.4827,



    latitude: 35.9211,



    hoursJa: '営業時間は公式情報をご確認ください',



    hoursEn: 'Please check the latest opening hours',



    websiteUrl:



      'https\://www.kawagoe-kousushi.com/',



    estimatedMinPrice: 3000,



  },



  {



    id: 'night-cafe-area',



    nameJa: '本川越駅周辺 夜カフェエリア',



    nameEn: 'Hon-Kawagoe Night Cafe Area',



    descriptionJa:



      '本川越駅周辺には夜まで利用できるカフェや飲食店があります。休憩場所を探すときに便利なエリアです。',



    descriptionEn:



      'The Hon-Kawagoe Station area has cafes and restaurants that stay open into the evening.',



    category: 'cafe',



    longitude: 139.4810,



    latitude: 35.9145,



    hoursJa: '営業時間は店舗ごとに異なります',



    hoursEn: 'Opening hours vary by store',



    estimatedMinPrice: 1000,



    // 特定の1店舗ではないため公式サイトボタンは表示しない



  },



  // ==========================================================

  // 新しく追加する夜スポット

  // ==========================================================



  {

    id: 'nakanaka',

    nameJa: '地もの海もの なかなか 川越店',

    nameEn: 'Nakanaka Kawagoe',

    descriptionJa:

      '川越駅近くの海鮮居酒屋。新鮮な魚介や地元食材、COEDOビールなどを夜に楽しめます。',

    descriptionEn:

      'An evening izakaya near Kawagoe Station serving seafood, local ingredients and COEDO beer.',

    category: 'restaurant',

    longitude: 139.4828,

    latitude: 35.9098,

    hoursJa: '17:00〜翌1:00',

    hoursEn: '5:00 PM - 1:00 AM',

    websiteUrl: 'https\://www.nakanaka-creamall.com/',

    estimatedMinPrice: 2000,

    openHour: 17,

    closeHour: 25,

  },



  {

    id: 'issyokenmei',

    nameJa: '炉端いっしょけんめい',

    nameEn: 'Robata Isshokenmei',

    descriptionJa:

      '本川越駅近くの炉端居酒屋。夜17時から営業し、炉端料理やお酒を楽しめます。',

    descriptionEn:

      'A robata-style izakaya near Hon-Kawagoe Station, open from the evening.',

    category: 'restaurant',

    longitude: 139.4800,

    latitude: 35.9162,

    hoursJa: '月〜土・祝日 17:00〜24:00／日曜定休',

    hoursEn: 'Mon-Sat & holidays 5:00 PM - 12:00 AM / Closed Sun',

    websiteUrl: 'https\://www.take-haru.co.jp/issho',

    estimatedMinPrice: 2000,

    openHour: 17,

    closeHour: 24,

  },



  {

    id: 'vigo',

    nameJa: '夜パフェBAR &VIGO 川越店',

    nameEn: 'Night Parfait BAR &VIGO Kawagoe',

    descriptionJa:

      '夜に楽しむパフェを中心としたカフェバー。川越観光の最後にスイーツを楽しみたい人におすすめの夜スポットです。',

    descriptionEn:

      'A night parfait bar near Hon-Kawagoe Station, ideal for desserts after sightseeing.',

    category: 'cafe',

    longitude: 139.4815,

    latitude: 35.9149,

    hoursJa: '夜営業 ※最新の営業時間は公式サイトをご確認ください',

    hoursEn: 'Evening hours - please check the official website',

    websiteUrl: 'https\://parfait-vigo-kawagoe.foodre.jp/',

    estimatedMinPrice: 1000,

  },



  // ==========================================================
  // 夜イベント（開催期間中のみ地図に表示）
  // ==========================================================

  {
    id: 'blue-hikawa-2026',
    nameJa: '川越氷川神社 ブルーライトアップ',
    nameEn: 'Kawagoe Hikawa Shrine Blue Light-up',
    descriptionJa:
      '「手話言語の国際デー」「手話の日」に合わせ、川越氷川神社の大鳥居を青色にライトアップ。2026年9月27日までの期間限定イベントです。',
    descriptionEn:
      'A limited-time blue illumination of the grand torii at Kawagoe Hikawa Shrine for the International Day of Sign Languages and Sign Language Day.',
    category: 'event',
    longitude: 139.4851,
    latitude: 35.9251,
    hoursJa: '2026/9/19〜9/27 17:30〜22:00',
    hoursEn: 'Sep 19-27, 2026 / 5:30 PM-10:00 PM',
    openHour: 17.5,
    closeHour: 22,
    estimatedMinPrice: 0,
    eventStartDate: '2026-09-19',
    eventEndDate: '2026-09-27',
    websiteUrl: 'https://www.kawagoehikawa.jp/',
    sourceUrl: 'https://www.city.kawagoe.saitama.jp/kenko/fukushi/1006736/1006743/1019033.html',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%E5%B7%9D%E8%B6%8A%E6%B0%B7%E5%B7%9D%E7%A5%9E%E7%A4%BE',
  },

  {
    id: 'blue-coedo-terrace-2026',
    nameJa: 'りそなコエドテラス ブルーライトアップ',
    nameEn: 'Resona Coedo Terrace Blue Light-up',
    descriptionJa:
      'りそなコエドテラスを青色にライトアップする期間限定イベント。2026年9月27日まで、夜23時まで楽しめます。',
    descriptionEn:
      'A limited-time blue illumination at Resona Coedo Terrace, running until 11:00 PM through September 27, 2026.',
    category: 'event',
    longitude: 139.4830,
    latitude: 35.9220,
    hoursJa: '2026/9/18〜9/27 17:00〜23:00',
    hoursEn: 'Sep 18-27, 2026 / 5:00 PM-11:00 PM',
    openHour: 17,
    closeHour: 23,
    estimatedMinPrice: 0,
    eventStartDate: '2026-09-18',
    eventEndDate: '2026-09-27',
    websiteUrl: 'https://www.resona-gr.co.jp/holdings/news/hd_c/detail/20240321_3262.html',
    sourceUrl: 'https://www.city.kawagoe.saitama.jp/kenko/fukushi/1006736/1006743/1019033.html',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%82%8A%E3%81%9D%E3%81%AA%E3%82%B3%E3%82%A8%E3%83%89%E3%83%86%E3%83%A9%E3%82%B9',
  },

  {
    id: 'blue-uplace-2026',
    nameJa: 'U_PLACE ブルーライトアップ',
    nameEn: 'U_PLACE Blue Light-up',
    descriptionJa:
      '川越駅西口のU_PLACEを青色にライトアップ。2026年9月27日までの夜限定イベントです。',
    descriptionEn:
      'A limited-time blue illumination at U_PLACE near the west exit of Kawagoe Station.',
    category: 'event',
    longitude: 139.4812,
    latitude: 35.9065,
    hoursJa: '2026/9/19〜9/27 18:00〜23:00',
    hoursEn: 'Sep 19-27, 2026 / 6:00 PM-11:00 PM',
    openHour: 18,
    closeHour: 23,
    estimatedMinPrice: 0,
    eventStartDate: '2026-09-19',
    eventEndDate: '2026-09-27',
    websiteUrl: 'https://www.u-place.jp/',
    sourceUrl: 'https://www.city.kawagoe.saitama.jp/kenko/fukushi/1006736/1006743/1019033.html',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=U_PLACE+%E5%B7%9D%E8%B6%8A',
  },

  {
    id: 'blue-westa-2026',
    nameJa: 'ウェスタ川越 ブルーライトアップ',
    nameEn: 'Westa Kawagoe Blue Light-up',
    descriptionJa:
      'ウェスタ川越を青色にライトアップ。2026年9月27日まで、18時から23時まで実施されます。',
    descriptionEn:
      'A limited-time blue illumination at Westa Kawagoe from 6:00 PM to 11:00 PM through September 27, 2026.',
    category: 'event',
    longitude: 139.4776,
    latitude: 35.9067,
    hoursJa: '2026/9/19〜9/27 18:00〜23:00',
    hoursEn: 'Sep 19-27, 2026 / 6:00 PM-11:00 PM',
    openHour: 18,
    closeHour: 23,
    estimatedMinPrice: 0,
    eventStartDate: '2026-09-19',
    eventEndDate: '2026-09-27',
    websiteUrl: 'https://www.westa-kawagoe.jp/',
    sourceUrl: 'https://www.city.kawagoe.saitama.jp/kenko/fukushi/1006736/1006743/1019033.html',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%82%A6%E3%82%A7%E3%82%B9%E3%82%BF%E5%B7%9D%E8%B6%8A',
  },

  {
    id: 'blue-unicus-2026',
    nameJa: 'ウニクス川越 ブルーライトアップ',
    nameEn: 'UNICUS Kawagoe Blue Light-up',
    descriptionJa:
      'ウニクス川越を青色にライトアップ。2026年9月27日まで、18時から23時まで実施されます。',
    descriptionEn:
      'A limited-time blue illumination at UNICUS Kawagoe from 6:00 PM to 11:00 PM through September 27, 2026.',
    category: 'event',
    longitude: 139.4768,
    latitude: 35.9060,
    hoursJa: '2026/9/19〜9/27 18:00〜23:00',
    hoursEn: 'Sep 19-27, 2026 / 6:00 PM-11:00 PM',
    openHour: 18,
    closeHour: 23,
    estimatedMinPrice: 0,
    eventStartDate: '2026-09-19',
    eventEndDate: '2026-09-27',
    websiteUrl: 'https://www.unicus-sc.jp/kawagoe/',
    sourceUrl: 'https://www.city.kawagoe.saitama.jp/kenko/fukushi/1006736/1006743/1019033.html',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%E3%82%A6%E3%83%8B%E3%82%AF%E3%82%B9%E5%B7%9D%E8%B6%8A',
  },

  {
    id: 'kawagoe-festival-2026',
    nameJa: '2026 川越まつり（宵山）',
    nameEn: '2026 Kawagoe Festival Evening',
    descriptionJa:
      '川越最大のお祭り。10月17日は18時〜19時頃に宵山が予定されています。開催前は「開催予定」として夜イベントに表示します。',
    descriptionEn:
      'Kawagoe’s largest festival. The evening Yoiyama is scheduled for around 6:00-7:00 PM on October 17.',
    category: 'event',
    longitude: 139.4826,
    latitude: 35.9228,
    hoursJa: '2026/10/17 宵山 18:00〜19:00頃',
    hoursEn: 'Oct 17, 2026 / Yoiyama around 6:00-7:00 PM',
    openHour: 18,
    closeHour: 19,
    estimatedMinPrice: 0,
    eventStartDate: '2026-10-17',
    eventEndDate: '2026-10-18',
    websiteUrl: 'https://www.kawagoematsuri.jp/',
    sourceUrl: 'https://koedo.or.jp/event/%E5%B7%9D%E8%B6%8A%E3%81%BE%E3%81%A4%E3%82%8A-4/',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%E5%B7%9D%E8%B6%8A%E3%81%BE%E3%81%A4%E3%82%8A',
  },

  {
    id: 'kawagoe-fireworks-2026',
    nameJa: '第32回小江戸川越花火大会',
    nameEn: '32nd Koedo Kawagoe Fireworks Festival',
    descriptionJa:
      '2026年11月21日に安比奈親水公園で開催予定。約6,500発の打ち上げが予定されている夜イベントです。',
    descriptionEn:
      'A fireworks festival scheduled for November 21, 2026 at Aina Shinsui Park, with approximately 6,500 fireworks planned.',
    category: 'event',
    longitude: 139.4237,
    latitude: 35.9006,
    hoursJa: '2026/11/21 ※詳細時間は公式発表をご確認ください',
    hoursEn: 'Nov 21, 2026 / Check the official page for detailed times',
    estimatedMinPrice: 0,
    eventStartDate: '2026-11-21',
    eventEndDate: '2026-11-21',
    websiteUrl: 'https://koedo.or.jp/event/%E7%AC%AC32%E5%9B%9E%E5%B0%8F%E6%B1%9F%E6%88%B8%E5%B7%9D%E8%B6%8A%E8%8A%B1%E7%81%AB%E5%A4%A7%E4%BC%9A/',
    sourceUrl: 'https://www.city.kawagoe.saitama.jp/kanko/k-other/1018317.html',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%E5%AE%89%E6%AF%94%E5%A5%88%E8%A6%AA%E6%B0%B4%E5%85%AC%E5%9C%92+%E5%B7%9D%E8%B6%8A',
  },

];



// ============================================================



// コンポーネント



// ============================================================



export const KawagoeMapTab: React.FC<
  KawagoeMapTabProps
> = ({
  coupons,
  language,
  themeConfig,
  onSelectCoupon,
  mapMode = 'normal',
  initialCouponId = null,
}) => {



  const t = translations[language];



  // ==========================================================



  // 通常マップ



  // ==========================================================



  const [selectedFilter, setSelectedFilter] = useState<



    'all' | 'time' | 'food_loss' | 'far'



  >('all');



  const [searchQuery, setSearchQuery] = useState('');



  const [



    selectedPinCouponId,



    setSelectedPinCouponId,



  ] = useState<string | null>(



    coupons[0]?.id || null



  );
  // ==========================================================
// クーポン画面の「マップ表示」から来た場合
// 指定されたクーポンを選択する
// ==========================================================

useEffect(() => {
  if (
    mapMode === 'normal' &&
    initialCouponId
  ) {
    setSelectedPinCouponId(initialCouponId);
  }
}, [initialCouponId, mapMode]);



  // ==========================================================



  // 夜マップ



  // ==========================================================



  const [



    selectedNightFilter,



    setSelectedNightFilter,



  ] = useState<'all' | NightSpotCategory>('all');



  const [



    selectedNightSpotId,



    setSelectedNightSpotId,



  ] = useState<string | null>(



    NIGHT_SPOTS[0]?.id || null



  );



  // ==========================================================



  // 今からおすすめ検索



  // ==========================================================



  const [showRecommendModal, setShowRecommendModal] = useState(false);

  const [recommendPurpose, setRecommendPurpose] = useState<NightSpotCategory>('restaurant');

  const [recommendBudget, setRecommendBudget] = useState(3000);

  const [currentTime, setCurrentTime] = useState(new Date());

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [recommendResults, setRecommendResults] = useState<Array<NightSpot & { distanceKm?: number }>>([]);



  // ==========================================================



  // Mapbox



  // ==========================================================



  const mapContainerRef =



    useRef<HTMLDivElement>(null);



  const mapRef =



    useRef<mapboxgl.Map | null>(null);



  const markersRef = useRef<{



    [key: string]: mapboxgl.Marker;



  }>({});



  // ==========================================================



  // 通常マップのクーポン絞り込み



  // ==========================================================



  const mapCoupons = coupons.filter((coupon) => {



    if (



      selectedFilter === 'time' &&



      coupon.type !== 'time'



    ) {



      return false;



    }



    if (



      selectedFilter === 'food_loss' &&



      coupon.type !== 'food_loss'



    ) {



      return false;



    }



    if (



      selectedFilter === 'far' &&



      coupon.shop.walkingMinutes < 12



    ) {



      return false;



    }



    if (searchQuery.trim()) {



      const q = searchQuery



        .toLowerCase()



        .trim();



      const match =



        coupon.shop.nameJa



          .toLowerCase()



          .includes(q) ||



        coupon.shop.nameEn



          .toLowerCase()



          .includes(q) ||



        coupon.shop.areaJa



          .toLowerCase()



          .includes(q) ||



        coupon.shop.categoryJa



          .toLowerCase()



          .includes(q) ||



        coupon.titleJa



          .toLowerCase()



          .includes(q) ||



        coupon.titleEn



          .toLowerCase()



          .includes(q);



      if (!match) {



        return false;



      }



    }



    return true;



  });



  // ==========================================================



  // 夜スポット絞り込み



  // ==========================================================



  const filteredNightSpots =



    NIGHT_SPOTS.filter((spot) => {

      // 期間限定イベントは終了日を過ぎたら夜マップから自動的に非表示
      if (spot.category === 'event' && spot.eventEndDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(`${spot.eventEndDate}T23:59:59`);
        if (today > endDate) return false;
      }



      if (



        selectedNightFilter !== 'all' &&



        spot.category !== selectedNightFilter



      ) {



        return false;



      }



      if (searchQuery.trim()) {



        const q = searchQuery



          .toLowerCase()



          .trim();



        const match =



          spot.nameJa



            .toLowerCase()



            .includes(q) ||



          spot.nameEn



            .toLowerCase()



            .includes(q) ||



          spot.descriptionJa



            .toLowerCase()



            .includes(q) ||



          spot.descriptionEn



            .toLowerCase()



            .includes(q);



        if (!match) {



          return false;



        }



      }



      return true;



    });



  // ==========================================================



  // 選択中の通常クーポン



  // ==========================================================



  const activeCouponIndex =



    mapCoupons.findIndex(



      (coupon) =>



        coupon.id === selectedPinCouponId



    );



  const activeCoupon =



    mapCoupons[



      activeCouponIndex >= 0



        ? activeCouponIndex



        : 0



    ] || null;



  // ==========================================================



  // 選択中の夜スポット



  // ==========================================================



  const activeNightSpot =



    filteredNightSpots.find(



      (spot) =>



        spot.id === selectedNightSpotId



    ) ||



    filteredNightSpots[0] ||



    null;



  // ==========================================================



  // Mapbox初期化



  // ==========================================================



  useEffect(() => {



    if (!mapContainerRef.current) {



      return;



    }



    const map = new mapboxgl.Map({



      container: mapContainerRef.current,



      style:



        'mapbox://styles/mapbox/streets-v12',



      center:



        mapMode === 'night'



          ? [139.4825, 35.9205]



          : [139.4804, 35.9221],



      zoom:



        mapMode === 'night'



          ? 14.2



          : 14,



    });



    mapRef.current = map;



    map.addControl(



      new mapboxgl.NavigationControl({



        showCompass: false,



      }),



      'top-right'



    );



    // 地図ラベルを言語に合わせる



    map.on('load', () => {



      const layers =



        map.getStyle().layers || [];



      layers.forEach((layer) => {



        if (



          layer.id.includes('poi-label') ||



          layer.id.includes(



            'settlement-label'



          ) ||



          layer.id.includes('road-label')



        ) {



          if (



            map.getLayoutProperty(



              layer.id,



              'text-field'



            )



          ) {



            map.setLayoutProperty(



              layer.id,



              'text-field',



              [



                'coalesce',



                [



                  'get',



                  language === 'ja'



                    ? 'name_ja'



                    : 'name_en',



                ],



                ['get', 'name'],



              ]



            );



          }



        }



      });



    });



    return () => {



      map.remove();



      mapRef.current = null;



    };



  }, [language, mapMode]);



  // ==========================================================



  // マーカー更新



  // ==========================================================



  useEffect(() => {



    const map = mapRef.current;



    if (!map) {



      return;



    }



    // 古いマーカー削除



    Object.values(



      markersRef.current



    ).forEach((marker) =>



      marker.remove()



    );



    markersRef.current = {};



    // ========================================================



    // 夜マップ



    // ========================================================



    if (mapMode === 'night') {



      filteredNightSpots.forEach(



        (spot) => {



          const isSelected =



            selectedNightSpotId === spot.id;



          const el =



            document.createElement(



              'button'



            );



          el.type = 'button';



          el.className =



            'cursor-pointer transition-all duration-200 hover:scale-110';



          let emoji = '🌙';



          if (



            spot.category === 'restaurant'



          ) {



            emoji = '🍽️';



          }



          if (spot.category === 'cafe') {



            emoji = '☕';



          }



          if (spot.category === 'view') {



            emoji = '🌃';



          }



          const spotName =



            language === 'ja'



              ? spot.nameJa



              : spot.nameEn;



          el.innerHTML = `



            <div



              style="



                display:flex;



                align-items:center;



                gap:5px;



                padding:7px 10px;



                border-radius:14px;



                background:${



                  isSelected



                    ? '#1c1917'



                    : '#ffffff'



                };



                color:${



                  isSelected



                    ? '#ffffff'



                    : '#1c1917'



                };



                border:1px solid ${



                  isSelected



                    ? '#1c1917'



                    : '#d6d3d1'



                };



                box-shadow:



                  0 4px 10px



                  rgba(0,0,0,0.15);



                font-size:11px;



                font-weight:700;



                white-space:nowrap;



              "



            >



              <span



                style="



                  font-size:15px;



                "



              >



                ${emoji}



              </span>



              <span>



                ${spotName}



              </span>



            </div>



          `;



          el.addEventListener(



            'click',



            () => {



              setSelectedNightSpotId(



                spot.id



              );



            }



          );



          const marker =



            new mapboxgl.Marker({



              element: el,



              anchor: 'bottom',



            })



              .setLngLat([



                spot.longitude,



                spot.latitude,



              ])



              .addTo(map);



          markersRef.current[



            spot.id



          ] = marker;



        }



      );



      return;



    }



    // ========================================================



    // 通常クーポンマップ



    // ========================================================



    mapCoupons.forEach((coupon) => {



      const lng =



        139.47 +



        (coupon.shop.mapCoords.x / 100) *



          0.03;



      const lat =



        35.93 -



        (coupon.shop.mapCoords.y / 100) *



          0.03;



      const isSelected =



        selectedPinCouponId ===



        coupon.id;



      const el =



        document.createElement('div');



      el.className =



        'cursor-pointer transition-all duration-300 hover:scale-110';



      const shopName =



        language === 'ja'



          ? coupon.shop.nameJa



          : coupon.shop.nameEn;



      const discountBadge =



        language === 'ja'



          ? coupon.discountBadgeJa



          : coupon.discountBadgeEn;



      el.innerHTML = `



        <div



          style="



            display:flex;



            flex-direction:column;



            align-items:center;



          "



        >



          <div



            style="



              padding:6px 10px;



              border-radius:12px;



              background:${



                isSelected



                  ? '#1c1917'



                  : '#ffffff'



              };



              color:${



                isSelected



                  ? '#ffffff'



                  : '#1c1917'



              };



              border:1px solid ${



                isSelected



                  ? '#1c1917'



                  : '#d6d3d1'



              };



              box-shadow:



                0 4px 10px



                rgba(0,0,0,0.15);



              white-space:nowrap;



            "



          >



            <div



              style="



                font-size:10px;



                font-weight:700;



              "



            >



              ${



                shopName.length > 8



                  ? `${shopName.slice(



                      0,



                      8



                    )}...`



                  : shopName



              }



            </div>



            <div



              style="



                font-size:9px;



                opacity:0.8;



              "



            >



              ${



                discountBadge?.split(



                  ' '



                )[0] || ''



              }



            </div>



          </div>



        </div>



      `;



      el.addEventListener(



        'click',



        () => {



          setSelectedPinCouponId(



            coupon.id



          );



        }



      );



      const marker =



        new mapboxgl.Marker({



          element: el,



          anchor: 'bottom',



        })



          .setLngLat([lng, lat])



          .addTo(map);



      markersRef.current[



        coupon.id



      ] = marker;



    });



  }, [



    mapMode,



    mapCoupons,



    filteredNightSpots,



    selectedPinCouponId,



    selectedNightSpotId,



    language,



  ]);



  // ==========================================================



  // 選択した通常クーポンへ移動



  // ==========================================================



  useEffect(() => {



    if (



      mapMode !== 'normal' ||



      !mapRef.current ||



      !selectedPinCouponId



    ) {



      return;



    }



    const target =



      mapCoupons.find(



        (coupon) =>



          coupon.id ===



          selectedPinCouponId



      );



    if (!target) {



      return;



    }



    const lng =



      139.47 +



      (target.shop.mapCoords.x / 100) *



        0.03;



    const lat =



      35.93 -



      (target.shop.mapCoords.y / 100) *



        0.03;



    mapRef.current.flyTo({



      center: [lng, lat],



      zoom: 15,



      essential: true,



    });



  }, [



    selectedPinCouponId,



    mapMode,



  ]);



  // ==========================================================



  // 選択した夜スポットへ移動



  // ==========================================================



  useEffect(() => {



    if (



      mapMode !== 'night' ||



      !mapRef.current ||



      !activeNightSpot



    ) {



      return;



    }



    mapRef.current.flyTo({



      center: [



        activeNightSpot.longitude,



        activeNightSpot.latitude,



      ],



      zoom: 15.5,



      essential: true,



    });



  }, [



    selectedNightSpotId,



    mapMode,



  ]);



  // ==========================================================



  // 通常クーポン 前



  // ==========================================================



  const handlePrevCoupon = () => {



    if (mapCoupons.length === 0) {



      return;



    }



    const prevIdx =



      (



        activeCouponIndex -



        1 +



        mapCoupons.length



      ) % mapCoupons.length;



    setSelectedPinCouponId(



      mapCoupons[prevIdx].id



    );



  };



  // ==========================================================



  // 通常クーポン 次



  // ==========================================================



  const handleNextCoupon = () => {



    if (mapCoupons.length === 0) {



      return;



    }



    const nextIdx =



      (activeCouponIndex + 1) %



      mapCoupons.length;



    setSelectedPinCouponId(



      mapCoupons[nextIdx].id



    );



  };



  // ==========================================================



  // 今からおすすめ検索



  // ==========================================================



  useEffect(() => {

    const timer = window.setInterval(() => setCurrentTime(new Date()), 60000);

    return () => window.clearInterval(timer);

  }, []);



  const getCurrentLocation = () => {

    if (!navigator.geolocation) {

      setLocationStatus('error');

      return;

    }



    setLocationStatus('loading');

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setUserLocation({

          latitude: position.coords.latitude,

          longitude: position.coords.longitude,

        });

        setLocationStatus('success');

      },

      () => setLocationStatus('error'),

      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }

    );

  };



  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {

    const toRad = (value: number) => (value * Math.PI) / 180;

    const earthRadiusKm = 6371;

    const dLat = toRad(lat2 - lat1);

    const dLon = toRad(lon2 - lon1);

    const a =

      Math.sin(dLat / 2) * Math.sin(dLat / 2) +

      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *

      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  };



  const isKnownOpenNow = (spot: NightSpot, date: Date) => {

    if (spot.openHour == null || spot.closeHour == null) return true;

    const hour = date.getHours() + date.getMinutes() / 60;

    if (spot.closeHour > 24) {

      return hour >= spot.openHour || hour < spot.closeHour - 24;

    }

    return hour >= spot.openHour && hour < spot.closeHour;

  };



  const handleRecommendSearch = () => {

    const results = NIGHT_SPOTS

      .filter((spot) => spot.category === recommendPurpose)

      .filter((spot) => (spot.estimatedMinPrice ?? 0) <= recommendBudget)

      .filter((spot) => isKnownOpenNow(spot, currentTime))

      .map((spot) => ({

        ...spot,

        distanceKm: userLocation

          ? getDistanceKm(

              userLocation.latitude,

              userLocation.longitude,

              spot.latitude,

              spot.longitude

            )

          : undefined,

      }))

      .sort((a, b) => {

        if (a.distanceKm == null && b.distanceKm == null) return 0;

        if (a.distanceKm == null) return 1;

        if (b.distanceKm == null) return -1;

        return a.distanceKm - b.distanceKm;

      });



    setRecommendResults(results);

  };



  const chooseRecommendedSpot = (spot: NightSpot) => {

    setSelectedNightFilter('all');

    setSearchQuery('');

    setSelectedNightSpotId(spot.id);

    setShowRecommendModal(false);

  };



  // ==========================================================



  // Google Maps



  // ==========================================================



  const openGoogleMaps = (



    spot: NightSpot



  ) => {



    const query =



      encodeURIComponent(



        language === 'ja'



          ? `${spot.nameJa} 川越`



          : `${spot.nameEn} Kawagoe`



      );



    window.open(



      `https\://www.google.com/maps/search/?api=1&query=${query}`,



      '_blank',



      'noopener,noreferrer'



    );



  };



  // ==========================================================



  // 公式Webサイト



  // ==========================================================



  const openOfficialWebsite = (



    spot: NightSpot



  ) => {



    if (!spot.websiteUrl) {



      return;



    }



    window.open(



      spot.websiteUrl,



      '_blank',



      'noopener,noreferrer'



    );



  };



  // ==========================================================



  // カテゴリー名



  // ==========================================================



  const getNightCategoryLabel = (



    category: NightSpotCategory



  ) => {



    if (category === 'event') {
      return language === 'ja' ? '夜イベント' : 'Night Event';
    }

    if (category === 'view') {



      return language === 'ja'



        ? '夜景・散策'



        : 'Night View';



    }



    if (



      category === 'restaurant'



    ) {



      return language === 'ja'



        ? '夜ごはん'



        : 'Dinner';



    }



    return language === 'ja'



      ? '夜カフェ'



      : 'Night Cafe';



  };



  // ==========================================================



  // 表示



  // ==========================================================



  return (



    <div



      className="



        relative



        h-[calc(100vh-125px)]



        w-full



        overflow-hidden



        flex



        flex-col



        bg-[#e5e3df]



      "



    >



      {/* =====================================================



          夜マップのときだけヘッダーを表示



      ====================================================== */}



      {/* =====================================================



          検索



      ====================================================== */}



      <div



        className="



          px-3



          pt-2.5



          pb-1



          z-20



          space-y-2



          pointer-events-auto



        "



      >



        {/* 検索バー */}



        <div



          className="



            bg-white/95



            backdrop-blur-md



            rounded-2xl



            shadow-md



            border



            border-stone-200



            flex



            items-center



            px-3.5



            h-11



            text-stone-900



          "



        >



          <Search



            className="



              w-4



              h-4



              text-stone-400



              mr-2



              shrink-0



            "



          />



          <input



            type="text"



            value={searchQuery}



            onChange={(e) =>



              setSearchQuery(



                e.target.value



              )



            }



            placeholder={



              mapMode === 'night'



                ? language === 'ja'



                  ? '夜スポットを検索'



                  : 'Search night spots'



                : t.mapSearchPlaceholder



            }



            className="



              w-full



              bg-transparent



              text-xs



              text-stone-900



              placeholder:text-stone-400



              focus:outline-none



              font-medium



            "



          />



          {searchQuery && (



            <button



              type="button"



              onClick={() =>



                setSearchQuery('')



              }



              className="



                text-stone-400



                hover:text-stone-600



                p-1



              "



            >



              <X



                className="



                  w-3.5



                  h-3.5



                "



              />



            </button>



          )}



        </div>



        {mapMode === 'night' && (

          <button

            type="button"

            onClick={() => {

              setCurrentTime(new Date());

              setRecommendResults([]);

              setShowRecommendModal(true);

            }}

            className="w-full h-10 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"

          >



            {language === 'ja' ? '今からおすすめを探す' : 'Find recommendations for now'}

          </button>

        )}



        {/* ===================================================



            通常マップフィルター



        ==================================================== */}



        {mapMode === 'normal' && (



          <div



            className="



              flex



              items-center



              gap-1.5



              overflow-x-auto



              no-scrollbar



              pt-0.5



            "



          >



            {[



              {



                id: 'all',



                label: t.mapFilterAll,



              },



              {



                id: 'time',



                label: t.mapFilterTime,



              },



              {



                id: 'food_loss',



                label:



                  t.mapFilterFoodLoss,



              },



              {



                id: 'far',



                label: t.mapFilterFar,



              },



            ].map((item) => {



              const isSelected =



                selectedFilter === item.id;



              return (



                <button



                  key={item.id}



                  type="button"



                  onClick={() =>



                    setSelectedFilter(



                      item.id as



                        | 'all'



                        | 'time'



                        | 'food_loss'



                        | 'far'



                    )



                  }



                  className="



                    h-7



                    px-3



                    rounded-full



                    text-[11px]



                    font-bold



                    whitespace-nowrap



                    shadow-sm



                    transition-all



                    active:scale-95



                  "



                  style={{



                    backgroundColor:



                      isSelected



                        ? '#1c1917'



                        : '#ffffff',



                    color:



                      isSelected



                        ? '#ffffff'



                        : '#57534e',



                    border:



                      isSelected



                        ? '1px solid #1c1917'



                        : '1px solid #e7e5e4',



                  }}



                >



                  {item.label}



                </button>



              );



            })}



          </div>



        )}



      </div>



      {/* =====================================================



          MAPBOX



      ====================================================== */}



      <div



        className="



          relative



          flex-grow



          w-full



          overflow-hidden



        "



      >



        <div



          ref={mapContainerRef}



          className="



            absolute



            inset-0



            w-full



            h-full



          "



        />



        {/* 夜モード表示 */}



        {mapMode === 'night' && (



          <div



            className="



              absolute



              top-2



              left-3



              z-10



              pointer-events-none



            "



          >



            <div



              className="



                bg-stone-900/90



                text-white



                rounded-full



                px-3



                py-1.5



                text-[10px]



                font-bold



                shadow-md



                flex



                items-center



                gap-1.5



              "



            >



              <Moon



                className="



                  w-3.5



                  h-3.5



                  text-amber-400



                "



              />



              {language === 'ja'



                ? '夜スポットのみ表示中'



                : 'Showing night spots'}



            </div>



          </div>



        )}



      </div>



      {/* =====================================================
          夜スポット詳細
      ====================================================== */}

      {mapMode === 'night' && activeNightSpot && (
        <div
          className="
            absolute
            bottom-2
            left-2
            right-2
            z-20
            pointer-events-auto
          "
        >
          <div
            className="
              bg-white
              rounded-2xl
              shadow-xl
              border
              border-stone-200/90
              overflow-hidden
              text-stone-900
            "
          >
            <div className="p-3 sm:p-4">
              {/* 上段：カテゴリー + スポット名 */}
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="
                    shrink-0
                    text-[10px]
                    sm:text-xs
                    font-bold
                    text-amber-700
                    bg-amber-50
                    px-2
                    py-1
                    rounded-full
                    whitespace-nowrap
                  "
                >
                  {activeNightSpot.category === 'view'
                    ? '🌃'
                    : activeNightSpot.category === 'restaurant'
                    ? '🍽️'
                    : activeNightSpot.category === 'event'
                    ? '🎪'
                    : '☕'}{' '}
                  {getNightCategoryLabel(activeNightSpot.category)}
                </span>

                <h3
                  className="
                    flex-1
                    min-w-0
                    text-sm
                    sm:text-base
                    font-black
                    text-stone-900
                    truncate
                  "
                >
                  {language === 'ja'
                    ? activeNightSpot.nameJa
                    : activeNightSpot.nameEn}
                </h3>
              </div>

              {/* 説明：スマホでは2行まで */}
              <p
                className="
                  text-[11px]
                  sm:text-xs
                  text-stone-600
                  leading-relaxed
                  mt-2
                  line-clamp-2
                "
              >
                {language === 'ja'
                  ? activeNightSpot.descriptionJa
                  : activeNightSpot.descriptionEn}
              </p>

              {/* 営業時間 */}
              {activeNightSpot.hoursJa && (
                <div
                  className="
                    mt-1.5
                    text-[10px]
                    sm:text-[11px]
                    font-medium
                    text-stone-500
                    truncate
                  "
                >
                  🕒{' '}
                  {language === 'ja'
                    ? activeNightSpot.hoursJa
                    : activeNightSpot.hoursEn}
                </div>
              )}

              {/* スマホでは2ボタンを横並びにして高さを抑える */}
              <div className="grid grid-cols-2 gap-2 mt-2.5">
                <button
                  type="button"
                  onClick={() => openGoogleMaps(activeNightSpot)}
                  className="
                    min-w-0
                    h-9
                    rounded-xl
                    bg-stone-900
                    text-white
                    text-[10px]
                    sm:text-xs
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-1
                    px-2
                    active:scale-[0.98]
                    transition-all
                  "
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {language === 'ja' ? 'Googleマップ' : 'Google Maps'}
                  </span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </button>

                {activeNightSpot.websiteUrl ? (
                  <button
                    type="button"
                    onClick={() => openOfficialWebsite(activeNightSpot)}
                    className="
                      min-w-0
                      h-9
                      rounded-xl
                      bg-white
                      border
                      border-stone-300
                      text-stone-800
                      text-[10px]
                      sm:text-xs
                      font-bold
                      flex
                      items-center
                      justify-center
                      gap-1
                      px-2
                      active:scale-[0.98]
                      hover:bg-stone-50
                      transition-all
                    "
                  >
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {language === 'ja' ? '公式Webサイト' : 'Official Website'}
                    </span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </button>
                ) : (
                  <div />
                )}
              </div>

              {/* イベントの場合だけ出典 */}
              {activeNightSpot.sourceUrl && (
                <button
                  type="button"
                  onClick={() => openSourceWebsite(activeNightSpot)}
                  className="
                    mt-2
                    w-full
                    h-8
                    rounded-lg
                    bg-blue-50
                    border
                    border-blue-200
                    text-blue-800
                    text-[10px]
                    sm:text-xs
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    active:scale-[0.98]
                    hover:bg-blue-100
                    transition-all
                  "
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  {language === 'ja'
                    ? 'イベントの出典を見る'
                    : 'View Event Source'}
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================



          通常クーポン詳細



      ====================================================== */}



      {mapMode === 'normal' &&



        activeCoupon && (



          <div



            className="



              absolute



              bottom-2



              left-2



              right-2



              z-20



              pointer-events-auto



            "



          >



            <div



              className="



                bg-white



                rounded-2xl



                shadow-xl



                border



                border-stone-200/90



                overflow-hidden



                text-stone-900



                transition-all



              "



            >



              <div



                className="



                  p-3



                  flex



                  items-center



                  gap-2.5



                "



              >



                {/* 前へ */}



                <button



                  type="button"



                  onClick={



                    handlePrevCoupon



                  }



                  className="



                    w-7



                    h-10



                    flex



                    items-center



                    justify-center



                    text-stone-400



                    hover:text-stone-700



                    shrink-0



                  "



                >



                  <ChevronLeft



                    className="



                      w-5



                      h-5



                    "



                  />



                </button>



                {/* 商品画像 */}



                <div



                  onClick={() =>



                    onSelectCoupon(



                      activeCoupon



                    )



                  }



                  className="



                    relative



                    w-16



                    h-16



                    rounded-xl



                    overflow-hidden



                    bg-stone-100



                    shrink-0



                    cursor-pointer



                    border



                    border-stone-200



                  "



                >



                  <img



                    src={



                      activeCoupon.imageUrl



                    }



                    alt={



                      language === 'ja'



                        ? activeCoupon.shop



                            .nameJa



                        : activeCoupon.shop



                            .nameEn



                    }



                    className="



                      w-full



                      h-full



                      object-cover



                    "



                    referrerPolicy="no-referrer"



                  />



                  <div



                    className="



                      absolute



                      top-1



                      left-1



                      text-[8px]



                      font-bold



                      px-1



                      rounded



                      shadow-sm



                      text-white



                    "



                    style={{



                      backgroundColor:



                        'var(--theme-primary)',



                    }}



                  >



                    {language === 'ja'



                      ? activeCoupon



                          .discountBadgeJa



                          .split(' ')[0]



                      : activeCoupon



                          .discountBadgeEn



                          .split(' ')[0]}



                  </div>



                </div>



                {/* 店舗情報 */}



                <div



                  onClick={() =>



                    onSelectCoupon(



                      activeCoupon



                    )



                  }



                  className="



                    flex-grow



                    min-w-0



                    cursor-pointer



                  "



                >



                  <div



                    className="



                      text-[10px]



                      text-stone-500



                      flex



                      items-center



                      gap-1



                      truncate



                    "



                  >



                    <span



                      className="



                        font-bold



                        text-amber-700



                      "



                    >



                      {language === 'ja'



                        ? '川越市'



                        : 'Kawagoe'}



                    </span>



                    <span>·</span>



                    <span className="truncate">



                      {language === 'ja'



                        ? activeCoupon.shop



                            .areaJa



                        : activeCoupon.shop



                            .areaEn}



                    </span>



                  </div>



                  <h4



                    className="



                      text-xs



                      font-bold



                      text-stone-900



                      truncate



                      mt-0.5



                    "



                  >



                    {language === 'ja'



                      ? activeCoupon.shop



                          .nameJa



                      : activeCoupon.shop



                          .nameEn}



                  </h4>



                  <p



                    className="



                      text-[10px]



                      text-stone-600



                      truncate



                      mt-0.5



                    "



                  >



                    {language === 'ja'



                      ? activeCoupon.titleJa



                      : activeCoupon.titleEn}



                  </p>



                  <div



                    className="



                      text-xs



                      font-bold



                      text-stone-900



                      mt-1



                    "



                  >



                    ¥



                    {activeCoupon.discountPrice.toLocaleString()}



                  </div>



                </div>



                {/* 詳細 */}



                <button



                  type="button"



                  onClick={() =>



                    onSelectCoupon(



                      activeCoupon



                    )



                  }



                  className="



                    h-8



                    px-3



                    rounded-xl



                    text-xs



                    font-bold



                    text-white



                    flex



                    items-center



                    gap-0.5



                    shrink-0



                    shadow-sm



                    active:scale-95



                    transition-all



                  "



                  style={{



                    backgroundColor:



                      themeConfig.primaryHex,



                    color:



                      'var(--theme-contrast-text)',



                  }}



                >



                  <span>



                    {language === 'ja'



                      ? '詳細'



                      : 'Details'}



                  </span>



                  <ChevronRight



                    className="



                      w-3.5



                      h-3.5



                    "



                  />



                </button>



                {/* 次へ */}



                <button



                  type="button"



                  onClick={



                    handleNextCoupon



                  }



                  className="



                    w-7



                    h-10



                    flex



                    items-center



                    justify-center



                    text-stone-400



                    hover:text-stone-700



                    shrink-0



                  "



                >



                  <ChevronRight



                    className="



                      w-5



                      h-5



                    "



                  />



                </button>



              </div>



            </div>



          </div>



        )}



      {mapMode === 'night' && showRecommendModal && (

        <div className="absolute inset-0 z-50 bg-black/55 flex items-center justify-center px-4">

          <div className="w-full max-w-sm rounded-[28px] bg-white shadow-2xl border border-stone-200 overflow-hidden">

            <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-stone-100">

              <div className="flex items-center gap-2">

                <SlidersHorizontal className="w-5 h-5 text-stone-700" />

                <h3 className="text-base font-black text-stone-900">{language === 'ja' ? '条件を指定して検索' : 'Search by conditions'}</h3>

              </div>

              <button type="button" onClick={() => setShowRecommendModal(false)} className="w-9 h-9 rounded-full bg-stone-50 flex items-center justify-center text-stone-500"><X className="w-5 h-5" /></button>

            </div>



            <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">

              <div>

                <div className="text-xs font-bold text-stone-600 mb-2 flex items-center gap-1.5"><MapPin className="w-4 h-4" />{language === 'ja' ? '目的は？' : 'What do you want to do?'}</div>

                <div className="grid grid-cols-4 gap-2">

                  {[

                    { id: 'restaurant' as NightSpotCategory, icon: '', ja: '夜ごはん', en: 'Dinner' },

                    { id: 'cafe' as NightSpotCategory, icon: '', ja: '夜カフェ', en: 'Cafe' },

                    { id: 'view' as NightSpotCategory, icon: '', ja: '夜景・散策', en: 'Night view' },
                    { id: 'event' as NightSpotCategory, icon: '', ja: '夜イベント', en: 'Events' },

                  ].map((item) => (

                    <button key={item.id} type="button" onClick={() => setRecommendPurpose(item.id)} className={`min-h-16 rounded-2xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${recommendPurpose === item.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-700 border-stone-200'}`}>

                      <span className="text-lg">{item.icon}</span>{language === 'ja' ? item.ja : item.en}

                    </button>

                  ))}

                </div>

              </div>



              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 grid grid-cols-2 gap-3">

                <div>

                  <div className="text-[10px] font-bold text-stone-500 flex items-center gap-1 mb-1"><Clock className="w-3.5 h-3.5" />{language === 'ja' ? '現在時刻' : 'Current time'}</div>

                  <div className="text-sm font-black text-stone-900">{currentTime.toLocaleTimeString(language === 'ja' ? 'ja-JP' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</div>

                </div>

                <div>

                  <div className="text-[10px] font-bold text-stone-500 flex items-center gap-1 mb-1"><Wallet className="w-3.5 h-3.5" />{language === 'ja' ? '予算 / 人' : 'Budget / person'}</div>

                  <select value={recommendBudget} onChange={(e) => setRecommendBudget(Number(e.target.value))} className="w-full h-8 rounded-lg border border-stone-200 bg-white px-2 text-xs font-bold text-stone-800">

                    <option value={1000}>〜1,000円</option><option value={2000}>〜2,000円</option><option value={3000}>〜3,000円</option><option value={5000}>〜5,000円</option><option value={10000}>〜10,000円</option>

                  </select>

                </div>

              </div>



              <div className="rounded-2xl border border-stone-200 p-3">

                <div className="flex items-center justify-between gap-3">

                  <div>

                    <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5"><Navigation className="w-4 h-4" />{language === 'ja' ? '現在位置' : 'Current location'}</div>

                    <div className="text-[10px] text-stone-500 mt-1">

                      {locationStatus === 'success' ? (language === 'ja' ? '取得済み・近い順に並べます' : 'Location acquired') : locationStatus === 'loading' ? (language === 'ja' ? '現在位置を取得中…' : 'Getting location…') : locationStatus === 'error' ? (language === 'ja' ? '位置情報を取得できませんでした' : 'Could not get location') : (language === 'ja' ? '取得すると近いスポットを優先します' : 'Use location to prioritize nearby spots')}

                    </div>

                  </div>

                  <button type="button" onClick={getCurrentLocation} className="shrink-0 h-9 px-3 rounded-xl bg-stone-900 text-white text-[11px] font-bold">{language === 'ja' ? '現在地を取得' : 'Get location'}</button>

                </div>

              </div>



              <button type="button" onClick={handleRecommendSearch} className="w-full h-12 rounded-2xl bg-emerald-600 text-white text-sm font-black flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all">{language === 'ja' ? 'おすすめを検索' : 'Find recommendations'}</button>



              {recommendResults.length > 0 && (

                <div className="space-y-2">

                  <div className="text-xs font-black text-stone-800">{language === 'ja' ? `おすすめ ${recommendResults.length}件` : `${recommendResults.length} recommendations`}</div>

                  {recommendResults.slice(0, 5).map((spot, index) => (

                    <button key={spot.id} type="button" onClick={() => chooseRecommendedSpot(spot)} className="w-full text-left rounded-2xl border border-stone-200 bg-white p-3 hover:bg-stone-50 transition-all">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <div className="text-[10px] font-black text-emerald-700">#{index + 1} {getNightCategoryLabel(spot.category)}</div>

                          <div className="text-sm font-black text-stone-900 truncate mt-0.5">{language === 'ja' ? spot.nameJa : spot.nameEn}</div>

                          <div className="text-[10px] text-stone-500 mt-1">{spot.estimatedMinPrice === 0 ? (language === 'ja' ? '無料' : 'Free') : (language === 'ja' ? `予算目安 ${spot.estimatedMinPrice?.toLocaleString()}円〜` : `From ¥${spot.estimatedMinPrice?.toLocaleString()}`)}{spot.distanceKm != null ? ` ・ 約${spot.distanceKm.toFixed(1)}km` : ''}</div>

                        </div>

                        <ChevronRight className="w-4 h-4 text-stone-400 shrink-0 mt-3" />

                      </div>

                    </button>

                  ))}

                </div>

              )}



              {recommendResults.length === 0 && <p className="text-[10px] leading-relaxed text-stone-400">{language === 'ja' ? '※ 予算は1人あたりの目安です。営業時間をコード上で確認できない店舗は候補に含め、最終確認は公式サイトで行ってください。' : 'Budget values are estimates per person. Please confirm opening hours on each official website.'}</p>}

            </div>

          </div>

        </div>

      )}



    </div>



  );



};