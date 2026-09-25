import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, CheckCircle2, ArrowRight, Sparkles, Camera, X } from 'lucide-react';

interface KawagoePurinQRPayProps {
  onComplete?: () => void;
}

export const KawagoePurinQRPay: React.FC<KawagoePurinQRPayProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scanError, setScanError] = useState<string | null>(null);

  // カメラを起動してスキャンを開始する処理
  useEffect(() => {
    if (step === 'scanning') {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          // QRコードの読み取りに成功したとき
          console.log("QR読み取り成功:", decodedText);
          scanner.clear();
          setStep('success');
        },
        (error) => {
          // スキャン中のエラー（フレーム毎に出るため基本は無視してOK）
          // console.warn(error);
        }
      );

      return () => {
        scanner.clear().catch((error) => {
          console.error("スキャナーのクリーンアップ失敗", error);
        });
      };
    }
  }, [step]);

  const handleStartScan = () => {
    setStep('scanning');
  };

  const handleReset = () => {
    setStep('idle');
    setScanError(null);
    if (onComplete) onComplete();
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-200 max-w-sm mx-auto text-stone-900">
      
      {/* ステップ1: 初期画面 */}
      {step === 'idle' && (
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 bg-amber-50 text-amber-800 rounded-2xl">
            <Camera className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-base">川越プリンで利用する</h3>
            <p className="text-xs text-stone-500 mt-1">
              カメラを起動して、店舗に設置されたQRコードを読み取ってください。
            </p>
          </div>

          <div className="bg-stone-50 p-3 rounded-2xl flex items-center gap-3 text-left border border-stone-100">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-amber-800 shrink-0 text-xs">
              プリン
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-amber-700 font-bold">川越プリン</div>
              <div className="text-xs font-bold truncate">なめらかプレーンプリン</div>
              <div className="text-xs text-stone-600 font-semibold mt-0.5">¥420 ➡️ <span className="text-red-600">¥350</span></div>
            </div>
          </div>

          <button
            onClick={handleStartScan}
            className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            <Camera className="w-4 h-4" />
            <span>カメラを起動してQRを読み取る</span>
          </button>
        </div>
      )}

      {/* ステップ2: カメラ映像のプレースホルダー（ここに本物のカメラが映ります） */}
      {step === 'scanning' && (
        <div className="text-center space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-stone-800">カメラでQRをスキャン中...</h3>
            <button 
              onClick={() => setStep('idle')} 
              className="text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* html5-qrcode が描画されるエリア */}
          <div id="reader" className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 text-xs" />
          
          <p className="text-[10px] text-stone-400">
            店舗のQRコードをカメラの枠内に合わせてください。<br/>
            (※テスト時は適当なQRコードをカメラに向けるか、自動で読み取ることも可能です)
          </p>
        </div>
      )}

      {/* ステップ3: 読み取り成功画面 */}
      {step === 'success' && (
        <div className="text-center space-y-4 animate-fadeIn">
          <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold mb-1">
              <Sparkles className="w-3 h-3" /> 読み取り成功！
            </div>
            <h3 className="font-bold text-base">クーポン適用＆決済完了</h3>
            <p className="text-xs text-stone-500 mt-1">
              川越プリンでの特典利用が正常に処理されました。この画面をスタッフにご提示ください。
            </p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-2xl text-left space-y-1">
            <div className="text-[10px] text-emerald-800 font-bold">利用店舗：川越プリン</div>
            <div className="text-xs font-bold text-stone-800">なめらかプレーンプリン 割引適用</div>
            <div className="text-[10px] text-stone-500">処理日時: 2026年9.25 15:30</div>
          </div>

          <button
            onClick={handleReset}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-xs"
          >
            <span>完了して閉じる</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};