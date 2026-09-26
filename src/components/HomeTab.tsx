import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  X, 
  MapPin, 
  Utensils, 
  Camera, 
  Clock, 
  Coins,
  Users,
  SlidersHorizontal,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Language, ThemeColorConfig, Coupon } from '../types';
import { GoogleGenAI } from '@google/genai';

interface HomeTabProps {
  coupons: Coupon[];
  language: Language;
  themeConfig: ThemeColorConfig;
  onNavigateMap: (filterType?: string, targetCouponId?: string) => void;
  onSelectCoupon?: (coupon: Coupon) => void;
}

interface Spot {
  id: string;
  category: 'food' | 'sightseeing';
  nameJa: string;
  areaJa: string;
  requiredMinutes: number;
  costPerPerson: number;
  descriptionJa: string;
}

export function HomeTab({
  coupons,
  language,
  themeConfig,
  onNavigateMap,
  onSelectCoupon,
}: HomeTabProps) {
  const [activeModal, setActiveModal] = useState<'search' | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  
  const [purpose, setPurpose] = useState<'food' | 'sightseeing'>('food');
  const [timeLimitHours, setTimeLimitHours] = useState<number>(2.0);
  const [budgetPerPerson, setBudgetPerPerson] = useState<number>(3000);
  const [peopleCount, setPeopleCount] = useState<number>(1);
  
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [matchedSpots, setMatchedSpots] = useState<Spot[]>([]);

  // 着せ替え機能で選ばれた画像をローカルストレージから取得
  const [currentKisekaeImg, setCurrentKisekaeImg] = useState(() => {
    try {
      return localStorage.getItem('kawagoe_kisekae_image') || '/src/assets/images/tokinokane.png';
    } catch {
      return '/src/assets/images/tokinokane.png';
    }
  });

  useEffect(() => {
    const checkKisekae = () => {
      try {
        const saved = localStorage.getItem('kawagoe_kisekae_image');
        if (saved) setCurrentKisekaeImg(saved);
      } catch {}
    };
    window.addEventListener('storage', checkKisekae);
    const interval = setInterval(checkKisekae, 1000);
    return () => {
      window.removeEventListener('storage', checkKisekae);
      clearInterval(interval);
    };
  }, []);

  const timeOptions = [];
  for (let i = 0.5; i <= 6.0; i += 0.5) {
    const h = Math.floor(i);
    const m = i % 1 !== 0 ? '30分' : '00分';
    const label = h > 0 ? `${h}時間${i % 1 !== 0 ? '30分' : ''}` : `${m}`;
    timeOptions.push({ value: i, label });
  }

  const budgetOptions = [];
  for (let b = 500; b <= 10000; b += 500) {
    budgetOptions.push({ value: b, label: `〜${b.toLocaleString()}円 (1人)` });
  }

  const peopleOptions = [];
  for (let p = 1; p <= 10; p++) {
    peopleOptions.push({ value: p, label: `${p}人` });
  }

  const handleCalculatePlan = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setShowResult(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('APIキーが設定されていません。.envファイルを確認してください。');
      }

      const ai = new GoogleGenAI({ apiKey });

      const categoryText = purpose === 'food' ? '飲食店、カフェ、グルメ、食べ歩きスポット' : '観光スポット、景色、歴史的建造物、イベント';
      const maxMinutes = timeLimitHours * 60;

      const prompt = `
あなたは埼玉県川越市のリアルタイム観光案内AIです。
以下の条件に完全に合致する、**川越に実在する具体的な店舗や観光スポット**をGoogle検索で最新情報を調べて3〜5件提案してください。

【ユーザーの条件】
- 目的: ${categoryText}
- 1人あたりの予算上限: ${budgetPerPerson}円以下（景色や無料スポットの場合は0円でも可）
- 最大滞在時間の目安: ${maxMinutes}分以内
- 人数: ${peopleCount}人

必ず以下のJSON形式の配列（Array）のみで回答してください。余計な解説文やマークダウンのバッククォート（\`\`\`）は含めず、純粋なJSON文字列だけを返してください。

JSONスキーマ構造:
[
  {
    "id": "string (ユニークな英数字ID)",
    "category": "${purpose}",
    "nameJa": "店舗名またはスポット名 (実際の名所・店舗名)",
    "areaJa": "川越市内のエリア名 (例: 菓子屋横丁近く、時の鐘通り など)",
    "requiredMinutes": 滞在目安の分数(数値),
    "costPerPerson": 1人あたりの平均予算(数値),
    "descriptionJa": "魅力や特徴の説明文 (50文字以内)"
  }
]
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.3,
        },
      });

      const textResponse = response.text;
      if (!textResponse) {
        throw new Error('AIから有効な応答が得られませんでした。');
      }

      let cleanedJson = textResponse.trim();
      cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
      
      const parsedSpots: Spot[] = JSON.parse(cleanedJson);
      setMatchedSpots(parsedSpots);

    } catch (err: any) {
      console.error('Gemini search error:', err);
      setErrorMessage(err.message || '店舗情報の取得中にエラーが発生しました。もう一度お試しください。');
      setMatchedSpots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setActiveModal(null);
    setTimeout(() => {
      setShowResult(false);
      setMatchedSpots([]);
    }, 300);
  };

  return (
    <div className="w-full min-h-full flex flex-col bg-gray-50 pb-36 px-4 pt-4 space-y-4">
      
      {/* 上部バナー（着せ替え画像のみ表示、文字は非表示） */}
      <div className="rounded-2xl overflow-hidden w-full bg-stone-900 shadow-md border border-stone-200 flex items-center justify-center shrink-0">
        <img 
          src={currentKisekaeImg} 
          alt="Selected Kisekae Theme" 
          className="w-full h-auto max-h-48 object-contain bg-stone-950"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 「周辺地から探す」ボタン */}
      <div className="space-y-3 shrink-0">
        <button
          type="button"
          onClick={() => setActiveModal('search')}
          className="w-full p-4 rounded-2xl shadow-lg flex items-center justify-between text-white transition-transform active:scale-95 text-left"
          style={{ backgroundColor: themeConfig.primaryHex }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="text-base font-bold tracking-wide">
              周辺地から探す
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>

      {/* クーポンリスト */}
      <div className="space-y-3 pt-2">
        <div className="space-y-3">
          {coupons && coupons.length > 0 ? (
            coupons.map((coupon) => (
              <div
                key={coupon.id}
                onClick={() => {
                  if (onSelectCoupon) {
                    try {
                      onSelectCoupon(coupon);
                    } catch (e) {}
                  }
                  setSelectedCoupon(coupon);
                }}
                className="bg-white rounded-2xl p-3.5 border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex gap-3.5 cursor-pointer relative overflow-hidden group text-left"
              >
                {/* クーポン画像と割引率バッジ */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                  <img
                    src={coupon.imageUrl}
                    alt={language === 'ja' ? coupon.titleJa : coupon.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-1.5 left-1.5 bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                    {coupon.discountPercent}% OFF
                  </div>
                </div>

                {/* クーポン詳細情報 */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-stone-500 truncate">
                        {language === 'ja' ? coupon.shop.nameJa : coupon.shop.nameEn}
                      </span>
                      <span className="text-[10px] text-stone-400 shrink-0 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {language === 'ja' ? coupon.shop.distanceFromStationJa : coupon.shop.distanceFromStationEn}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug">
                      {language === 'ja' ? coupon.titleJa : coupon.titleEn}
                    </h4>
                  </div>

                  {/* 価格と残り情報 */}
                  <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-stone-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-rose-600">
                        ¥{coupon.discountPrice.toLocaleString()}
                      </span>
                      {coupon.originalPrice && (
                        <span className="text-[10px] text-stone-400 line-through">
                          ¥{coupon.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {coupon.remainingStock !== undefined && coupon.type === 'food_loss' ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                        残り{coupon.remainingStock}点
                      </span>
                    ) : coupon.deadlineTextJa ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {coupon.deadlineTextJa}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-4 rounded-2xl text-center text-xs text-stone-500 border border-stone-200">
              クーポン読み込み中...
            </div>
          )}
        </div>
      </div>

      {/* クーポン利用画面（バーコードモーダル） */}
      {selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95">
            
            {/* ヘッダー */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-stone-900">クーポン利用画面</h3>
              <button 
                onClick={() => setSelectedCoupon(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 bg-stone-50"
              >
                <X className="w-4 h-4 text-stone-600" />
              </button>
            </div>

            {/* モーダルの中身 */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-100 text-pink-700">
                  {language === 'ja' ? selectedCoupon.shop.nameJa : selectedCoupon.shop.nameEn}
                </span>
                <h4 className="text-xs font-bold text-stone-900 mt-1 leading-snug">
                  {language === 'ja' ? selectedCoupon.titleJa : selectedCoupon.titleEn}
                </h4>
              </div>

              {/* クーポン画像 */}
              <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src={selectedCoupon.imageUrl}
                  alt={selectedCoupon.titleJa}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-rose-600 text-white text-xs font-black px-2 py-1 rounded-lg shadow">
                  {selectedCoupon.discountPercent}% OFF
                </div>
              </div>

              {/* バーコード表示エリア */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center space-y-2">
                <div className="bg-white p-3 rounded-xl shadow-xs w-full flex justify-center">
                  <div className="flex justify-between items-center h-16 w-[220px] bg-white px-2 overflow-hidden select-none">
                    <div className="w-[3px] bg-black h-full"></div>
                    <div className="w-[1px] bg-black h-full"></div>
                    <div className="w-[2px] bg-black h-full"></div>
                    <div className="w-[4px] bg-black h-full"></div>
                    <div className="w-[1px] bg-black h-full"></div>
                    <div className="w-[3px] bg-black h-full"></div>
                    <div className="w-[2px] bg-black h-full"></div>
                    <div className="w-[1px] bg-black h-full"></div>
                    <div className="w-[5px] bg-black h-full"></div>
                    <div className="w-[2px] bg-black h-full"></div>
                    <div className="w-[1px] bg-black h-full"></div>
                    <div className="w-[3px] bg-black h-full"></div>
                    <div className="w-[2px] bg-black h-full"></div>
                    <div className="w-[4px] bg-black h-full"></div>
                    <div className="w-[1px] bg-black h-full"></div>
                    <div className="w-[3px] bg-black h-full"></div>
                    <div className="w-[2px] bg-black h-full"></div>
                    <div className="w-[1px] bg-black h-full"></div>
                    <div className="w-[4px] bg-black h-full"></div>
                    <div className="w-[3px] bg-black h-full"></div>
                  </div>
                </div>
                <div className="text-xs font-bold text-stone-600 font-mono">
                  KWG-CPN-C4-8829
                </div>
                <p className="text-xs font-bold text-amber-800 pt-1">
                  レジでこの画面（バーコード）をご提示ください
                </p>
              </div>
            </div>

            {/* 閉じるボタン */}
            <div className="pt-4 mt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setSelectedCoupon(null)}
                className="w-full py-3 rounded-2xl bg-stone-900 text-white text-xs font-bold shadow hover:bg-stone-800 transition-all"
              >
                閉じる
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 条件入力＆提案結果モーダル */}
      {activeModal === 'search' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full sm:max-w-sm bg-white sm:rounded-3xl rounded-t-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] transition-all animate-in slide-in-from-bottom-10">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-stone-700" />
                <h3 className="text-sm font-bold text-stone-900">
                  条件を指定して検索
                </h3>
              </div>
              <button onClick={resetAndClose} className="p-1.5 rounded-full hover:bg-stone-100 bg-stone-50">
                <X className="w-4 h-4 text-stone-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" /> 目的は？
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPurpose('food')}
                    className="flex-1 py-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all"
                    style={{
                      backgroundColor: purpose === 'food' ? themeConfig.primaryHex : '#ffffff',
                      color: purpose === 'food' ? themeConfig.contrastText : '#57534e',
                      borderColor: purpose === 'food' ? themeConfig.primaryHex : '#e7e5e4',
                    }}
                  >
                    <Utensils className="w-4 h-4" />
                    <span className="text-[11px] font-bold">食事・カフェ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurpose('sightseeing')}
                    className="flex-1 py-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all"
                    style={{
                      backgroundColor: purpose === 'sightseeing' ? themeConfig.primaryHex : '#ffffff',
                      color: purpose === 'sightseeing' ? themeConfig.contrastText : '#57534e',
                      borderColor: purpose === 'sightseeing' ? themeConfig.primaryHex : '#e7e5e4',
                    }}
                  >
                    <Camera className="w-4 h-4" />
                    <span className="text-[11px] font-bold">景色・イベント</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-500" /> 時間
                  </label>
                  <select
                    value={timeLimitHours}
                    onChange={(e) => setTimeLimitHours(Number(e.target.value))}
                    className="w-full h-8 px-1 bg-white border border-stone-300 rounded-lg text-[11px] font-bold text-stone-900 focus:outline-none"
                  >
                    {timeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 flex items-center gap-1">
                    <Coins className="w-3 h-3 text-stone-500" /> 予算/人
                  </label>
                  <select
                    value={budgetPerPerson}
                    onChange={(e) => setBudgetPerPerson(Number(e.target.value))}
                    className="w-full h-8 px-1 bg-white border border-stone-300 rounded-lg text-[11px] font-bold text-stone-900 focus:outline-none"
                  >
                    {budgetOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>~{opt.value.toLocaleString()}円</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 flex items-center gap-1">
                    <Users className="w-3 h-3 text-stone-500" /> 人数
                  </label>
                  <select
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(Number(e.target.value))}
                    className="w-full h-8 px-1 bg-white border border-stone-300 rounded-lg text-[11px] font-bold text-stone-900 focus:outline-none"
                  >
                    {peopleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="pt-1">
                <button 
                  type="button"
                  onClick={handleCalculatePlan}
                  disabled={isLoading}
                  className="w-full h-11 text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: themeConfig.primaryHex }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" /> 検索中...
                    </>
                  ) : (
                    <>
                      {showResult ? '条件を変えて再検索する' : 'リアルタイム検索'}
                    </>
                  )}
                </button>
              </div>

              {showResult && (
                <div className="space-y-3 pt-3 border-t border-stone-100 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 検索結果
                    </span>
                    <span className="text-[10px] text-stone-500">総予算目安: ~{(budgetPerPerson * peopleCount).toLocaleString()}円</span>
                  </div>

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-2 text-stone-500">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                      <span className="text-xs font-medium">最新情報を検索しています...</span>
                    </div>
                  ) : errorMessage ? (
                    <div className="bg-red-50 p-4 rounded-2xl text-center text-xs text-red-700 space-y-1">
                      <p className="font-bold">エラーが発生しました</p>
                      <p className="text-[10px]">{errorMessage}</p>
                    </div>
                  ) : matchedSpots.length > 0 ? (
                    <div className="space-y-2">
                      {matchedSpots.map((spot) => (
                        <div key={spot.id} className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                              {spot.areaJa} (目安 {spot.requiredMinutes}分)
                            </span>
                            <h4 className="text-xs font-bold text-stone-900 truncate mt-0.5">{spot.nameJa}</h4>
                            <p className="text-[10px] text-stone-500 leading-tight mt-0.5">{spot.descriptionJa}</p>
                            <div className="text-xs font-bold text-stone-900 mt-1">
                              {spot.costPerPerson > 0 ? `1人あたり ¥${spot.costPerPerson.toLocaleString()}` : '入場・見学無料'}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => { resetAndClose(); onNavigateMap(); }}
                            className="h-8 px-3 rounded-xl text-[11px] font-bold text-white shrink-0 shadow-sm"
                            style={{ backgroundColor: themeConfig.primaryHex }}
                          >
                            マップ表示
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-amber-50 p-4 rounded-2xl text-center text-xs text-amber-800 space-y-1">
                      <p className="font-bold">条件に合う店舗が見つかりませんでした</p>
                      <p className="text-[10px] opacity-80">時間や予算の条件を少し変えて再検索してみてください。</p>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}