import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  Search, 
  Train, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  MapPin 
} from 'lucide-react';
import { Coupon, Language, ThemeColorConfig } from '../types';
import { translations } from '../data/translations';

// ▼ 環境変数からMapboxのアクセストークンを安全に読み込む
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface KawagoeMapTabProps {
  coupons: Coupon[];
  language: Language;
  themeConfig: ThemeColorConfig;
  onSelectCoupon: (coupon: Coupon) => void;
}

export const KawagoeMapTab: React.FC<KawagoeMapTabProps> = ({
  coupons,
  language,
  themeConfig,
  onSelectCoupon,
}) => {
  const t = translations[language];
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'time' | 'food_loss' | 'far'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPinCouponId, setSelectedPinCouponId] = useState<string | null>(coupons[0]?.id || null);

  // Mapbox用のRef
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // 1. フィルターと検索クエリによる店舗の絞り込み
  const mapCoupons = coupons.filter((coupon) => {
    if (selectedFilter === 'time' && coupon.type !== 'time') return false;
    if (selectedFilter === 'food_loss' && coupon.type !== 'food_loss') return false;
    if (selectedFilter === 'far' && coupon.shop.walkingMinutes < 12) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        coupon.shop.nameJa.toLowerCase().includes(q) ||
        coupon.shop.nameEn.toLowerCase().includes(q) ||
        coupon.shop.areaJa.toLowerCase().includes(q) ||
        coupon.shop.categoryJa.toLowerCase().includes(q) ||
        coupon.titleJa.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const activeCouponIndex = mapCoupons.findIndex((c) => c.id === selectedPinCouponId);
  const activeCoupon = mapCoupons[activeCouponIndex >= 0 ? activeCouponIndex : 0] || null;

  // Mapboxの初期化（日本語ラベル対応版）
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [139.4804, 35.9221], // 川越駅周辺
      zoom: 14,
    });

    mapRef.current = map;

    // 地図の読み込みが完了したタイミングで地名を日本語（ja）に切り替える
    map.on('load', () => {
      const layers = map.getStyle().layers;
      layers.forEach((layer) => {
        if (layer.id.includes('poi-label') || layer.id.includes('settlement-label') || layer.id.includes('road-label')) {
          if (map.getLayoutProperty(layer.id, 'text-field')) {
            map.setLayoutProperty(layer.id, 'text-field', [
              'coalesce',
              ['get', 'name_ja'],
              ['get', 'name']
            ]);
          }
        }
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // 絞り込み結果に応じてマップ上にピン（Marker）を動的に配置・更新する
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 既存のピンをすべて削除
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // 新しいピンを生成
    mapCoupons.forEach((coupon) => {
      const lng = 139.47 + (coupon.shop.mapCoords.x / 100) * 0.03;
      const lat = 35.93 - (coupon.shop.mapCoords.y / 100) * 0.03;

      const isSelected = selectedPinCouponId === coupon.id;

      // HTML要素としてカスタムピンを作成
      const el = document.createElement('div');
      el.className = 'cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-full hover:scale-110';
      el.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1 ${
            isSelected ? 'ring-2 ring-stone-900 scale-105 bg-stone-900 text-white' : 'bg-white text-stone-900 border border-stone-300'
          }">
            <div class="flex flex-col">
              <span class="text-[10px] font-bold tracking-tight whitespace-nowrap">
                ${coupon.shop.nameJa.slice(0, 5)}...
              </span>
              <span class="text-[9px] opacity-80">
                ${coupon.discountBadgeJa.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedPinCouponId(coupon.id);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current[coupon.id] = marker;
    });
  }, [mapCoupons, selectedPinCouponId]);

  // ピンが選択されたら地図の中心を移動する
  useEffect(() => {
    if (!mapRef.current || !selectedPinCouponId) return;
    const target = mapCoupons.find((c) => c.id === selectedPinCouponId);
    if (target) {
      const lng = 139.47 + (target.shop.mapCoords.x / 100) * 0.03;
      const lat = 35.93 - (target.shop.mapCoords.y / 100) * 0.03;
      mapRef.current.flyTo({ center: [lng, lat], zoom: 15, essential: true });
    }
  }, [selectedPinCouponId]);

  const handlePrevCoupon = () => {
    if (mapCoupons.length === 0) return;
    const prevIdx = (activeCouponIndex - 1 + mapCoupons.length) % mapCoupons.length;
    setSelectedPinCouponId(mapCoupons[prevIdx].id);
  };

  const handleNextCoupon = () => {
    if (mapCoupons.length === 0) return;
    const nextIdx = (activeCouponIndex + 1) % mapCoupons.length;
    setSelectedPinCouponId(mapCoupons[nextIdx].id);
  };

  return (
    <div className="relative h-[calc(100vh-125px)] w-full overflow-hidden flex flex-col bg-[#e5e3df]">
      
      {/* ヘッダータイトル */}
      <div className="bg-white border-b border-stone-200/80 px-4 py-3 flex items-center justify-center shadow-2xs z-20 shrink-0">
        <h2 className="text-base font-bold text-stone-900 font-shippori">
          {language === 'ja' ? 'お店を探す / マップ' : 'Store Map'}
        </h2>
      </div>

      {/* 検索バー & クーポンフィルター */}
      <div className="px-3 pt-2.5 pb-1 z-20 space-y-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-stone-200 flex items-center px-3.5 h-11 text-stone-900">
          <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.mapSearchPlaceholder}
            className="w-full bg-transparent text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-stone-400 hover:text-stone-600 p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* フィルターボタン群 */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          {[
            { id: 'all', label: t.mapFilterAll },
            { id: 'time', label: t.mapFilterTime },
            { id: 'food_loss', label: t.mapFilterFoodLoss },
            { id: 'far', label: t.mapFilterFar },
          ].map((item) => {
            const isSelected = selectedFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedFilter(item.id as any)}
                className="h-7 px-3 rounded-full text-[11px] font-bold whitespace-nowrap shadow-sm transition-all active:scale-95"
                style={{
                  backgroundColor: isSelected ? '#1c1917' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#57534e',
                  border: isSelected ? '1px solid #1c1917' : '1px solid #e7e5e4',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 本物のMapboxが表示されるエリア */}
      <div className="relative flex-grow w-full overflow-hidden">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* 選択された店舗の詳細カード（下部カルーセル） */}
      {activeCoupon && (
        <div className="absolute bottom-2 left-2 right-2 z-20 pointer-events-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200/90 overflow-hidden text-stone-900 transition-all">
            <div className="p-3 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrevCoupon}
                className="w-7 h-10 flex items-center justify-center text-stone-400 hover:text-stone-700 shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                onClick={() => onSelectCoupon(activeCoupon)}
                className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 cursor-pointer border border-stone-200"
              >
                <img
                  src={activeCoupon.imageUrl}
                  alt={activeCoupon.shop.nameJa}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div
                  className="absolute top-1 left-1 text-[8px] font-bold px-1 rounded shadow-sm text-white"
                  style={{ backgroundColor: 'var(--theme-primary)' }}
                >
                  {activeCoupon.discountBadgeJa.split(' ')[0]}
                </div>
              </div>

              <div
                onClick={() => onSelectCoupon(activeCoupon)}
                className="flex-grow min-w-0 cursor-pointer"
              >
                <div className="text-[10px] text-stone-500 flex items-center gap-1 truncate">
                  <span className="font-bold text-amber-700">川越市</span>
                  <span>·</span>
                  <span className="truncate">{activeCoupon.shop.areaJa}</span>
                </div>
                <h4 className="text-xs font-bold text-stone-900 truncate mt-0.5">
                  {activeCoupon.shop.nameJa}
                </h4>
                <p className="text-[10px] text-stone-600 truncate mt-0.5">
                  {activeCoupon.titleJa}
                </p>
                <div className="text-xs font-bold text-stone-900 mt-1">
                  ¥{activeCoupon.discountPrice.toLocaleString()}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectCoupon(activeCoupon)}
                className="h-8 px-3 rounded-xl text-xs font-bold text-white flex items-center gap-0.5 shrink-0 shadow-sm active:scale-95 transition-all"
                style={{
                  backgroundColor: 'var(--theme-primary)',
                  color: 'var(--theme-contrast-text)',
                }}
              >
                <span>{language === 'ja' ? '詳細' : 'Details'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleNextCoupon}
                className="w-7 h-10 flex items-center justify-center text-stone-400 hover:text-stone-700 shrink-0"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};