import { WalletState } from '../types';

export const INITIAL_WALLET: WalletState = {
  balance: 5000,
  points: 350,
  transactions: [
    {
      id: 'tx-init-1',
      type: 'charge',
      amount: 5000,
      pointsEarned: 500,
      descriptionJa: '口座チャージ（埼玉りそな銀行）',
      descriptionEn: 'Bank Account Top-up (Saitama Resona Bank)',
      timestamp: '2026-09-25 10:15',
      methodOrShopJa: '埼玉りそな銀行 (***1234)',
      methodOrShopEn: 'Saitama Resona Bank (***1234)',
      balanceAfter: 5000,
    },
    {
      id: 'tx-init-2',
      type: 'payment',
      amount: 680,
      pointsEarned: 7,
      descriptionJa: '菓匠 右門 一番街店 お会計',
      descriptionEn: 'Kasho Umon Ichibangai Payment',
      timestamp: '2026-09-24 15:42',
      methodOrShopJa: '菓匠 右門 一番街店',
      methodOrShopEn: 'Kasho Umon Ichibangai',
      balanceAfter: 4320,
    },
    {
      id: 'tx-init-3',
      type: 'charge',
      amount: 3000,
      pointsEarned: 300,
      descriptionJa: 'セブン銀行ATM 現金チャージ',
      descriptionEn: 'Seven Bank ATM Cash Charge',
      timestamp: '2026-09-23 11:20',
      methodOrShopJa: 'セブン銀行ATM（本川越駅前）',
      methodOrShopEn: 'Seven Bank ATM (Hon-Kawagoe Stn)',
      balanceAfter: 5000,
    }
  ]
};
