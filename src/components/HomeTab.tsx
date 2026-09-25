import React from 'react';
import { QrCode, Send, Award, History, PlusCircle, Barcode, ShieldCheck } from 'lucide-react';
import { Coupon, Language, ThemeColorConfig } from '../types';
import { translations } from '../data/translations';

interface HomeTabProps {
  coupons: Coupon[];
  language: Language;
  themeConfig: ThemeColorConfig;
  walletBalance: number;
  walletPoints: number;
  onSelectCoupon: (coupon: Coupon) => void;
  onOpenCharge: () => void;
  onOpenHistory: () => void;
  onOpenQr: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  coupons,
  language,
  themeConfig,
  walletBalance,
  walletPoints,
  onSelectCoupon,
  onOpenCharge,
  onOpenHistory,
  onOpenQr,
}) => {
  const t = translations[language];

  return (
    <div className="pb-8 space-y-4 px-4 pt-3 max-w-md mx-auto">
      
      {/* 1. PayPay風 バーコード＆QRコード決済カード */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-stone-200 space-y-4">
        {/* バーコード部分 */}
        <div className="bg-stone-50 p-3 rounded-2xl flex flex-col items-center justify-center space-y-1.5 border border-stone-100">
          <div className="flex items-center justify-center gap-0.5 h-14 w-full px-2 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className={`bg-stone-900 h-10 ${
                  i % 4 === 0 ? 'w-1.5' : i % 3 === 0 ? 'w-0.5' : i % 2 === 0 ? 'w-1' : 'w-0.5'
                }`} 
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-stone-500 tracking-widest font-bold">
            KWG-PAY-8829-2026
          </span>
        </div>

        {/* 残高・支払い方法情報 */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs"
              style={{ backgroundColor: themeConfig.primaryHex }}
            >
              ¥
            </div>
            <div>
              <p className="text-[10px] text-stone-500 font-bold">支払い方法</p>
              <p className="text-xs font-bold text-stone-900">小江戸Pay残高 (¥{walletBalance.toLocaleString()})</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {walletPoints} pt
            </span>
          </div>
        </div>
      </div>

      {/* 2. PayPay風 メニューアイコンボタン横並びエリア（サイズ統一・改行防止版） */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 grid grid-cols-5 gap-2 text-center items-start">
        
        {/* スキャン */}
        <button
          type="button"
          onClick={onOpenQr}
          className="flex flex-col items-center justify-center gap-1.5 group active:scale-95 transition-all w-full"
        >
          <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-amber-100 text-stone-800 flex items-center justify-center transition-colors shadow-2xs shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-stone-700 whitespace-nowrap">スキャン</span>
        </button>

        {/* 送る */}
        <button
          type="button"
          onClick={() => alert(language === 'ja' ? '送金・割り勘機能は準備中です' : 'Coming soon')}
          className="flex flex-col items-center justify-center gap-1.5 group active:scale-95 transition-all w-full"
        >
          <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-amber-100 text-stone-800 flex items-center justify-center transition-colors shadow-2xs shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-stone-700 whitespace-nowrap">送る</span>
        </button>

        {/* ポイント */}
        <button
          type="button"
          onClick={() => alert(`保有ポイント: ${walletPoints} pt`)}
          className="flex flex-col items-center justify-center gap-1.5 group active:scale-95 transition-all w-full"
        >
          <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-amber-100 text-stone-800 flex items-center justify-center transition-colors shadow-2xs shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-stone-700 whitespace-nowrap">ポイント</span>
        </button>

        {/* 取引履歴 */}
        <button
          type="button"
          onClick={onOpenHistory}
          className="flex flex-col items-center justify-center gap-1.5 group active:scale-95 transition-all w-full"
        >
          <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-amber-100 text-stone-800 flex items-center justify-center transition-colors shadow-2xs shrink-0">
            <History className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-stone-700 whitespace-nowrap">取引履歴</span>
        </button>

        {/* チャージ */}
        <button
          type="button"
          onClick={onOpenCharge}
          className="flex flex-col items-center justify-center gap-1.5 group active:scale-95 transition-all w-full"
        >
          <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-amber-100 text-stone-800 flex items-center justify-center transition-colors shadow-2xs shrink-0">
            <PlusCircle className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-[11px] font-bold text-stone-700 whitespace-nowrap">チャージ</span>
        </button>

      </div>

      {/* 3. おすすめクーポン一覧 */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider px-1">
          {language === 'ja' ? 'おすすめの小江戸クーポン' : 'Featured Coupons'}
        </h3>
        
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              onClick={() => onSelectCoupon(coupon)}
              className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3.5 cursor-pointer"
            >
              <img
                src={coupon.imageUrl}
                alt={coupon.titleJa}
                className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-100"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-stone-500 truncate">
                    {language === 'ja' ? coupon.shop.nameJa : coupon.shop.nameEn}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug">
                  {language === 'ja' ? coupon.titleJa : coupon.titleEn}
                </h4>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-sm font-bold text-stone-900">
                    ¥{coupon.discountPrice.toLocaleString()}
                  </span>
                  {coupon.originalPrice && (
                    <span className="text-[10px] text-stone-400 line-through">
                      ¥{coupon.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {coupon.discountPercent && (
                    <span className="text-[10px] text-rose-600 font-bold ml-auto">
                      {coupon.discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};