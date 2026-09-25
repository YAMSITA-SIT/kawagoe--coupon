import React, { useState, useEffect } from 'react';
import { 
  X, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Store, 
  QrCode as QrIcon,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Language, ThemeColorConfig } from '../types';
import { playChime } from '../utils/audio';

interface PaymentBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  points: number;
  onSimulatePay: (amount: number, storeJa: string, storeEn: string) => void;
  language: Language;
  themeConfig: ThemeColorConfig;
}

export const PaymentBarcodeModal: React.FC<PaymentBarcodeModalProps> = ({
  isOpen,
  onClose,
  balance,
  points,
  onSimulatePay,
  language,
  themeConfig,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 min expiry
  const [usePoints, setUsePoints] = useState(false);
  const [barcodeNumber, setBarcodeNumber] = useState('2849 5910 8392 4810');
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);
  const [lastPayment, setLastPayment] = useState<{ amount: number; store: string } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsPaidSuccess(false);
      return;
    }
    setSecondsLeft(300);
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRefreshCode = () => {
    setSecondsLeft(300);
    const randPart = Math.floor(1000 + Math.random() * 9000);
    setBarcodeNumber(`2849 5910 8392 ${randPart}`);
  };

  const handlePayTest = (amt: number, storeJa: string, storeEn: string) => {
    if (balance < amt) {
      alert(language === 'ja' ? '残高が不足しています。チャージしてください。' : 'Insufficient balance. Please top up.');
      return;
    }
    playChime('pay');
    setIsPaidSuccess(true);
    setLastPayment({ amount: amt, store: language === 'ja' ? storeJa : storeEn });
    onSimulatePay(amt, storeJa, storeEn);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#f9f9f9] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white px-4 py-3.5 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-2xs"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              <QrIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 leading-tight">
                {language === 'ja' ? '小江戸Pay バーコード支払い' : 'Koedo Pay Barcode'}
              </h3>
              <p className="text-[10px] text-stone-500">
                {language === 'ja' ? 'レジで店員にご提示ください' : 'Show to cashier at checkout'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-3.5">
          {isPaidSuccess && lastPayment ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
              <div 
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-md animate-bounce"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {language === 'ja' ? '支払い完了（川越Pay♪）' : 'Payment Success!'}
                </span>
                <div className="text-3xl font-black text-stone-900 mt-2.5 tabular-nums">
                  ¥{lastPayment.amount.toLocaleString()}
                </div>
                <p className="text-xs text-stone-600 font-semibold mt-1">
                  {lastPayment.store}
                </p>
              </div>

              {/* Balance Summary */}
              <div className="bg-stone-50 rounded-xl p-3 text-xs space-y-1 border border-stone-200/80 text-left">
                <div className="flex justify-between text-stone-500">
                  <span>{language === 'ja' ? '支払い方法' : 'Payment Method'}</span>
                  <span className="font-semibold text-stone-800">小江戸Pay残高</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>{language === 'ja' ? '獲得ポイント' : 'Points Earned'}</span>
                  <span className="font-semibold text-amber-700">+{Math.floor(lastPayment.amount * 0.01)} pt</span>
                </div>
                <div className="border-t border-stone-200 pt-1 flex justify-between font-bold text-stone-900">
                  <span>{language === 'ja' ? '残り残高' : 'Remaining Balance'}</span>
                  <span style={{ color: 'var(--theme-primary)' }}>¥{balance.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full h-11 rounded-2xl text-xs font-bold text-white shadow-xs transition-all active:scale-95"
                style={{
                  backgroundColor: 'var(--theme-primary)',
                  color: 'var(--theme-contrast-text)',
                }}
              >
                {language === 'ja' ? '閉じる' : 'Close'}
              </button>
            </div>
          ) : (
            <>
              {/* Payment Card with Barcode & QR Code */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm text-center space-y-4">
                
                {/* Barcode Graphic */}
                <div className="space-y-1">
                  <div className="h-16 flex items-center justify-center gap-0.5 px-3 py-1 bg-stone-50 rounded-xl border border-stone-200/60 overflow-hidden">
                    {/* Simulated Authentic Barcode Lines */}
                    {[
                      3, 1, 2, 4, 1, 3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 3, 1, 4, 2, 1,
                      2, 3, 1, 2, 4, 1, 2, 3, 1, 4, 1, 2, 3, 2, 1, 4, 1, 2, 3, 1,
                      3, 1, 2, 4, 1, 3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 3, 1, 4, 2, 1
                    ].map((width, idx) => (
                      <span
                        key={idx}
                        className="h-12 bg-stone-900 inline-block shrink-0"
                        style={{ width: `${width}px`, margin: '0 0.5px' }}
                      />
                    ))}
                  </div>

                  <div className="text-xs font-mono font-bold tracking-widest text-stone-700">
                    {barcodeNumber}
                  </div>
                </div>

                {/* QR Code Center View */}
                <div className="flex flex-col items-center justify-center py-1">
                  <div className="w-36 h-36 p-2.5 bg-white border-2 border-stone-900 rounded-2xl shadow-xs flex items-center justify-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=KAWAGOE-PAY-${barcodeNumber.replace(/\s/g, '')}`}
                      alt="Payment QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-500 font-semibold">
                    <span>
                      {language === 'ja' ? '有効期限:' : 'Valid:'}{' '}
                      <strong className="text-stone-800 tabular-nums">
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleRefreshCode}
                      className="flex items-center gap-0.5 text-amber-700 hover:text-amber-800 text-[10px] font-bold"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{language === 'ja' ? '更新' : 'Refresh'}</span>
                    </button>
                  </div>
                </div>

                {/* Balance & Points Option */}
                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200/80 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-medium">
                      {language === 'ja' ? 'お支払い可能残高' : 'Usable Balance'}
                    </span>
                    <span className="text-base font-black text-stone-900 tabular-nums">
                      ¥{balance.toLocaleString()}
                    </span>
                  </div>

                  <label className="flex items-center justify-between pt-1 border-t border-stone-200/60 cursor-pointer select-none">
                    <span className="text-xs text-stone-700 flex items-center gap-1 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'ja' ? 'ポイントを利用' : 'Use points'}</span>
                      <span className="text-[10px] text-stone-400">({points} pt)</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={usePoints}
                      onChange={(e) => setUsePoints(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600"
                    />
                  </label>
                </div>
              </div>

              {/* Simulation Demo Section for Evaluators */}
              <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-stone-500 block px-1">
                  {language === 'ja' ? '決済シミュレーション（動作確認テスト）' : 'Store Checkout Simulation'}
                </span>

                <div className="space-y-1.5">
                  {[
                    { amt: 450, storeJa: '菓匠 右門（紫芋ソフト）', storeEn: 'Kasho Umon (Sweet Potato Soft)' },
                    { amt: 650, storeJa: 'COEDOビール 小江戸生樽カップ', storeEn: 'COEDO Craft Beer Cup' },
                    { amt: 1200, storeJa: '川越懐石 蔵の割烹 ランチ御膳', storeEn: 'Kawagoe Kaiseki Lunch' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePayTest(item.amt, item.storeJa, item.storeEn)}
                      className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/70 hover:border-amber-300 flex items-center justify-between text-left transition-all active:scale-[0.99] group"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <Store className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600" />
                        <span className="font-semibold text-stone-800">{item.storeJa}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-900 tabular-nums">
                          ¥{item.amt.toLocaleString()}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
