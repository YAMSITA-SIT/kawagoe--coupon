import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  CreditCard, 
  Banknote, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Language, ThemeColorConfig } from '../types';
import { playChime } from '../utils/audio';

interface ChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onCharge: (amount: number, methodJa: string, methodEn: string) => void;
  language: Language;
  themeConfig: ThemeColorConfig;
}

type ChargeMethod = 'bank' | 'card' | 'atm' | 'voucher';

export const ChargeModal: React.FC<ChargeModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  onCharge,
  language,
  themeConfig,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<ChargeMethod>('bank');
  const [selectedBank, setSelectedBank] = useState('埼玉りそな銀行（川越支店 ***1234）');
  const [chargeAmount, setChargeAmount] = useState<number>(3000);
  const [customInput, setCustomInput] = useState<string>('3000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [chargedDetails, setChargedDetails] = useState<{ amount: number; points: number } | null>(null);

  if (!isOpen) return null;

  const quickAmounts = [1000, 3000, 5000, 10000, 20000];
  const pointsToEarn = Math.floor(chargeAmount * 0.10); // 10% promotional campaign bonus

  const handleSelectQuickAmount = (amt: number) => {
    setChargeAmount(amt);
    setCustomInput(amt.toString());
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomInput(val);
    const num = parseInt(val, 10);
    setChargeAmount(isNaN(num) ? 0 : num);
  };

  const handleConfirmCharge = () => {
    if (chargeAmount <= 0) return;
    setIsProcessing(true);

    let methodJa = '埼玉りそな銀行 口座チャージ';
    let methodEn = 'Saitama Resona Bank Top-up';

    if (selectedMethod === 'bank') {
      methodJa = `${selectedBank.split('（')[0]} 口座振替`;
      methodEn = `Bank Transfer (${selectedBank.split('（')[0]})`;
    } else if (selectedMethod === 'card') {
      methodJa = 'クレジットカード チャージ（VISA ***5678）';
      methodEn = 'Credit Card Top-up (VISA ***5678)';
    } else if (selectedMethod === 'atm') {
      methodJa = 'セブン銀行ATM 現金チャージ';
      methodEn = 'Seven Bank ATM Cash Charge';
    } else if (selectedMethod === 'voucher') {
      methodJa = '川越市デジタル商品券・ポイント交換';
      methodEn = 'Kawagoe Municipal Voucher Exchange';
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setChargedDetails({ amount: chargeAmount, points: pointsToEarn });
      playChime('charge');
      onCharge(chargeAmount, methodJa, methodEn);
    }, 700);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setChargedDetails(null);
    onClose();
  };

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
              ¥
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 leading-tight">
                {language === 'ja' ? 'お金をチャージ（小江戸Pay）' : 'Top up Koedo Pay'}
              </h3>
              <p className="text-[10px] text-stone-500">
                {language === 'ja' ? 'PayPay感覚で即時チャージ・決済' : 'Instant wallet top-up & payment'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          
          {/* Success Screen */}
          {isSuccess && chargedDetails ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
              <div 
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-md animate-bounce"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {language === 'ja' ? 'チャージ完了！' : 'Top-up Successful!'}
                </span>
                <div className="text-3xl font-black text-stone-900 mt-3 tabular-nums">
                  +¥{chargedDetails.amount.toLocaleString()}
                </div>
                <div className="text-xs font-semibold text-amber-700 mt-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {language === 'ja' 
                      ? `川越ポイント +${chargedDetails.points.toLocaleString()} pt 獲得！` 
                      : `Earned +${chargedDetails.points.toLocaleString()} pts!`}
                  </span>
                </div>
              </div>

              {/* Balance Summary Box */}
              <div className="bg-stone-50 rounded-xl p-3.5 text-xs space-y-1.5 border border-stone-200/80 text-left">
                <div className="flex justify-between text-stone-500">
                  <span>{language === 'ja' ? 'チャージ前残高' : 'Previous Balance'}</span>
                  <span>¥{currentBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>{language === 'ja' ? 'チャージ金額' : 'Top-up Amount'}</span>
                  <span className="font-bold text-stone-900">+¥{chargedDetails.amount.toLocaleString()}</span>
                </div>
                <div className="border-t border-stone-200 pt-1.5 flex justify-between font-bold text-stone-900 text-sm">
                  <span>{language === 'ja' ? '現在のチャージ残高' : 'New Balance'}</span>
                  <span style={{ color: 'var(--theme-primary)' }}>
                    ¥{(currentBalance + chargedDetails.amount).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full h-11 rounded-2xl text-xs font-bold text-white shadow-xs transition-all active:scale-95"
                style={{
                  backgroundColor: 'var(--theme-primary)',
                  color: 'var(--theme-contrast-text)',
                }}
              >
                {language === 'ja' ? '完了（お買い物へ戻る）' : 'Done (Back to shopping)'}
              </button>
            </div>
          ) : (
            <>
              {/* Current Balance Bar */}
              <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-2xs flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-stone-500 font-medium block text-[11px]">
                    {language === 'ja' ? '現在の小江戸Pay残高' : 'Current Balance'}
                  </span>
                  <span className="text-xl font-black text-stone-900 tabular-nums">
                    ¥{currentBalance.toLocaleString()}
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  {language === 'ja' ? '即時反映' : 'Instant'}
                </span>
              </div>

              {/* 10% Campaign Notice Banner */}
              <div 
                className="rounded-2xl p-3 text-white text-xs shadow-2xs flex items-start gap-2.5 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
                }}
              >
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-200" />
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>{language === 'ja' ? '川越市 地域通貨 振興キャンペーン中！' : 'Kawagoe Local Currency Campaign!'}</span>
                    <span className="bg-white text-orange-700 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                      10%還元
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90 mt-0.5 leading-tight">
                    {language === 'ja'
                      ? 'チャージ金額の10%を「川越ポイント」として即時プレゼント。小江戸の飲食店・お土産店で1pt=1円で使えます。'
                      : 'Get 10% back in Kawagoe Points instantly. 1pt = ¥1 at local merchants.'}
                  </p>
                </div>
              </div>

              {/* Charge Method Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 px-1 block">
                  {language === 'ja' ? 'チャージ方法を選択' : 'Select Charge Source'}
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'bank', icon: Building2, labelJa: '銀行口座', labelEn: 'Bank Account', subJa: '埼玉りそな・武蔵野など' },
                    { id: 'card', icon: CreditCard, labelJa: 'クレジットカード', labelEn: 'Credit Card', subJa: 'VISA・JCB・Master' },
                    { id: 'atm', icon: Banknote, labelJa: 'コンビニATM', labelEn: 'Seven ATM', subJa: 'セブン・ローソン現金' },
                    { id: 'voucher', icon: Gift, labelJa: '地域振興券・ポイント', labelEn: 'City Voucher', subJa: '川越市デジタル商品券' },
                  ].map((m) => {
                    const isSelected = selectedMethod === m.id;
                    const IconComp = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMethod(m.id as ChargeMethod)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-20 active:scale-98 ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-500 shadow-2xs ring-1 ring-amber-400'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div 
                            className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                              isSelected ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-stone-900 block leading-none">
                            {language === 'ja' ? m.labelJa : m.labelEn}
                          </span>
                          <span className="text-[9px] text-stone-500 mt-1 block truncate">
                            {language === 'ja' ? m.subJa : m.labelEn}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-selector if Bank */}
                {selectedMethod === 'bank' && (
                  <div className="bg-white rounded-xl border border-stone-200 p-2.5 text-xs">
                    <label className="text-[10px] text-stone-400 font-bold block mb-1">
                      {language === 'ja' ? '連携口座' : 'Linked Account'}
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs font-semibold text-stone-800 focus:outline-none"
                    >
                      <option value="埼玉りそな銀行（川越支店 ***1234）">埼玉りそな銀行（川越支店 ***1234）</option>
                      <option value="武蔵野銀行（川越支店 ***5678）">武蔵野銀行（川越支店 ***5678）</option>
                      <option value="ゆうちょ銀行（〇二八支店 ***9012）">ゆうちょ銀行（〇二八支店 ***9012）</option>
                      <option value="三井住友銀行（川越支店 ***3456）">三井住友銀行（川越支店 ***3456）</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Amount Selection */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-bold text-stone-800">
                    {language === 'ja' ? 'チャージ金額' : 'Top-up Amount'}
                  </label>
                  <span className="text-[11px] text-stone-500">
                    {language === 'ja' ? '手数料 0円' : 'Free of charge'}
                  </span>
                </div>

                {/* Quick Select Buttons (PayPay style) */}
                <div className="grid grid-cols-5 gap-1.5">
                  {quickAmounts.map((amt) => {
                    const isSelected = chargeAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSelectQuickAmount(amt)}
                        className={`h-9 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        +{amt >= 10000 ? `${amt / 10000}万` : `${amt.toLocaleString()}`}
                      </button>
                    );
                  })}
                </div>

                {/* Amount Input Display */}
                <div className="bg-white rounded-2xl border border-stone-200 p-3 flex items-center justify-between shadow-2xs">
                  <span className="text-sm font-bold text-stone-400">¥</span>
                  <input
                    type="text"
                    value={customInput}
                    onChange={handleCustomInputChange}
                    placeholder="金額を入力"
                    className="w-full text-right text-2xl font-black text-stone-900 px-2 focus:outline-none tabular-nums"
                  />
                  <span className="text-xs font-bold text-stone-500 pl-1">円</span>
                </div>

                {/* Bonus Calculation Card */}
                {chargeAmount > 0 && (
                  <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200/80 text-xs flex items-center justify-between text-amber-900 font-medium">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'ja' ? '還元ポイント（10%）:' : 'Reward Points:'}</span>
                    </span>
                    <span className="font-bold text-amber-700">
                      +{pointsToEarn.toLocaleString()} pt
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button: チャージする */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={chargeAmount <= 0 || isProcessing}
                  onClick={handleConfirmCharge}
                  className="w-full h-12 rounded-2xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--theme-primary)',
                    color: 'var(--theme-contrast-text)',
                  }}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{language === 'ja' ? 'チャージ処理中...' : 'Processing...'}</span>
                    </div>
                  ) : (
                    <>
                      <span>
                        {language === 'ja' 
                          ? `¥${chargeAmount.toLocaleString()} をチャージする` 
                          : `Charge ¥${chargeAmount.toLocaleString()}`}
                      </span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-stone-400 text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{language === 'ja' ? '暗号化通信により安全に保護されています' : 'Secured 256-bit bank encryption'}</span>
                </p>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
