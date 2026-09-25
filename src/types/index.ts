export type Language = 'ja' | 'en';

export type ThemeColorKey = 
  | 'blue'    // 青
  | 'red'     // 赤
  | 'yellow'  // 黄色
  | 'orange'  // オレンジ
  | 'cyan'    // 水色
  | 'black'   // 黒
  | 'white'   // 白
  | 'green'   // 緑
  | 'purple'; // 紫

export interface ThemeColorConfig {
  key: ThemeColorKey;
  nameJa: string;
  nameEn: string;
  subJa: string;
  primaryHex: string;
  primaryDarkHex: string;
  primaryLightHex: string;
  contrastText: string;
  borderHex: string;
  rgb: string; // e.g. "30, 58, 138"
}

export type MainTab = 'home' | 'coupons' | 'map' | 'account';

export type CouponCategoryFilter = 'all' | 'time' | 'food_loss';
export type CouponSortOption = 'distance' | 'deadline' | 'discount';

export interface WalletTransaction {
  id: string;
  type: 'charge' | 'payment';
  amount: number;
  pointsEarned?: number;
  descriptionJa: string;
  descriptionEn: string;
  timestamp: string;
  methodOrShopJa: string;
  methodOrShopEn: string;
  balanceAfter: number;
}

export interface WalletState {
  balance: number;
  points: number;
  transactions: WalletTransaction[];
}

export interface UserProfile {
  isLoggedIn: boolean;
  isGuest: boolean;
  name: string;
  email: string;
  favoriteArea?: string;
}

export interface MapCoordinates {
  x: number; // percentage 0-100 on Kawagoe vector map
  y: number; // percentage 0-100 on Kawagoe vector map
}

export interface Shop {
  id: string;
  nameJa: string;
  nameEn: string;
  categoryJa: string;
  categoryEn: string;
  distanceFromStationJa: string;
  distanceFromStationEn: string;
  walkingMinutes: number;
  isFarFromStation: boolean;
  areaJa: string;
  areaEn: string;
  addressJa: string;
  addressEn: string;
  accessTipJa: string;
  accessTipEn: string;
  mapCoords: MapCoordinates;
  dietaryFeatures: ('vegetarian' | 'halal_friendly' | 'english_menu' | 'cashless' | 'coedo_beer' | 'sweet_potato')[];
}

export interface Coupon {
  id: string;
  shopId: string;
  type: 'time' | 'food_loss';
  titleJa: string;
  titleEn: string;
  descriptionJa: string;
  descriptionEn: string;
  discountBadgeJa: string;
  discountBadgeEn: string;
  discountPercent?: number;
  originalPrice?: number;
  discountPrice: number;
  imageUrl: string;
  
  // Time coupon specific
  timeSlotJa?: string;
  timeSlotEn?: string;
  timeSlotType?: 'weekday_afternoon' | 'evening_night' | 'morning';
  offPeakReasonJa?: string;
  offPeakReasonEn?: string;

  // Food Loss coupon specific
  remainingStock?: number;
  foodLossDeadline?: string; // e.g. "19:30"
  expiresInSeconds?: number;
  foodLossNoteJa?: string;
  foodLossNoteEn?: string;

  rating: number;
  reviewCount: number;
  shop: Shop;
}
