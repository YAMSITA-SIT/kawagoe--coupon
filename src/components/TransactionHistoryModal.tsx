import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  Filter, 
  Sparkles,
  CreditCard,
  Building2,
  Store
} from 'lucide-react';
import { Language, ThemeColorConfig, WalletTransaction } from '../types';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: WalletTransaction[];
  balance: number;
  points: number;
  language: Language;
  themeConfig: ThemeColorConfig;
  onOpenCharge: () => void;
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  transactions,
  balance,
  points,
  language,
  themeConfig,
  onOpenCharge,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'charge' | 'payment'>('all');

  if (!isOpen) return null;

  const filteredList = transactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

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
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 leading-tight">
                {language === 'ja' ? '小江戸Pay 利用履歴・チャージ明細' : 'Transaction History'}
              </h3>
              <p className="text-[10px] text-stone-500">
                {language === 'ja' ? 'チャージとお買い物の全記録' : 'All top-ups and store purchases'}
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

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3.5">
          
          {/* Balance Overview Card */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] text-stone-500 font-medium block">
                {language === 'ja' ? '現在のチャージ残高' : 'Current Balance'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-stone-900 tabular-nums">
                  ¥{balance.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-amber-700">
                  {points} pt
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCharge();
              }}
              className="h-9 px-3.5 rounded-xl text-xs font-bold text-white shadow-2xs transition-all active:scale-95"
              style={{
                backgroundColor: 'var(--theme-primary)',
                color: 'var(--theme-contrast-text)',
              }}
            >
              {language === 'ja' ? '+ チャージ' : '+ Top up'}
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl">
            {[
              { id: 'all', label: language === 'ja' ? 'すべて' : 'All' },
              { id: 'charge', label: language === 'ja' ? 'チャージ' : 'Top-up' },
              { id: 'payment', label: language === 'ja' ? 'お支払い' : 'Payment' },
            ].map((tab) => {
              const isSelected = filterType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterType(tab.id as any)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Transactions List */}
          <div className="space-y-2">
            {filteredList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-400">
                {language === 'ja' ? '利用履歴がありません' : 'No transactions found'}
              </div>
            ) : (
              filteredList.map((item) => {
                const isCharge = item.type === 'charge';
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-stone-200 p-3 shadow-2xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div 
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isCharge ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/70' : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {isCharge ? (
                          <ArrowDownLeft className="w-5 h-5 stroke-[2.2]" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 stroke-[2.2]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {language === 'ja' ? item.descriptionJa : item.descriptionEn}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mt-0.5">
                          <span>{item.timestamp}</span>
                          <span>·</span>
                          <span>{language === 'ja' ? item.methodOrShopJa : item.methodOrShopEn}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-sm font-black tabular-nums ${
                        isCharge ? 'text-emerald-700' : 'text-stone-900'
                      }`}>
                        {isCharge ? '+' : '-'}¥{item.amount.toLocaleString()}
                      </div>
                      {item.pointsEarned && item.pointsEarned > 0 && (
                        <div className="text-[10px] font-semibold text-amber-700">
                          +{item.pointsEarned} pt
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
