import { ThemeColorKey, ThemeColorConfig } from '../types';

export const THEME_COLORS: Record<ThemeColorKey, ThemeColorConfig> = {
  blue: {
    key: 'blue',
    nameJa: '青',
    nameEn: 'Blue (Indigo)',
    subJa: '藍色・勝色',
    primaryHex: '#2563eb',
    primaryDarkHex: '#1d4ed8',
    primaryLightHex: '#eff6ff',
    contrastText: '#ffffff',
    borderHex: '#2563eb',
    rgb: '37, 99, 235',
  },
  red: {
    key: 'red',
    nameJa: '赤',
    nameEn: 'Red (Vermilion)',
    subJa: '茜・朱華',
    primaryHex: '#dc2626',
    primaryDarkHex: '#b91c1c',
    primaryLightHex: '#fef2f2',
    contrastText: '#ffffff',
    borderHex: '#dc2626',
    rgb: '220, 38, 38',
  },
  yellow: {
    key: 'yellow',
    nameJa: 'ゴールド・黄色',
    nameEn: 'Gold / Yellow',
    subJa: '山吹・金茶',
    primaryHex: '#f39c12',
    primaryDarkHex: '#d68910',
    primaryLightHex: '#fef9e7',
    contrastText: '#ffffff',
    borderHex: '#f39c12',
    rgb: '243, 156, 18',
  },
  orange: {
    key: 'orange',
    nameJa: 'オレンジ',
    nameEn: 'Warm Orange',
    subJa: '柿色・弁柄',
    primaryHex: '#e67e22',
    primaryDarkHex: '#d35400',
    primaryLightHex: '#fdf2e9',
    contrastText: '#ffffff',
    borderHex: '#e67e22',
    rgb: '230, 126, 34',
  },
  cyan: {
    key: 'cyan',
    nameJa: '水色',
    nameEn: 'Cyan (Asagi)',
    subJa: '浅葱・新橋',
    primaryHex: '#0284c7',
    primaryDarkHex: '#0369a1',
    primaryLightHex: '#f0f9ff',
    contrastText: '#ffffff',
    borderHex: '#0284c7',
    rgb: '2, 132, 199',
  },
  black: {
    key: 'black',
    nameJa: '黒',
    nameEn: 'Black (Sumi)',
    subJa: '漆黒・黒漆喰',
    primaryHex: '#18181b',
    primaryDarkHex: '#09090b',
    primaryLightHex: '#f4f4f5',
    contrastText: '#ffffff',
    borderHex: '#3f3f46',
    rgb: '24, 24, 27',
  },
  white: {
    key: 'white',
    nameJa: '白',
    nameEn: 'White (Gofun)',
    subJa: '胡粉・白磁',
    primaryHex: '#ffffff',
    primaryDarkHex: '#e2e8f0',
    primaryLightHex: '#f8fafc',
    contrastText: '#0f172a', // dark text for contrast on white
    borderHex: '#cbd5e1',
    rgb: '255, 255, 255',
  },
  green: {
    key: 'green',
    nameJa: '緑',
    nameEn: 'Green (Matcha)',
    subJa: '常磐・抹茶',
    primaryHex: '#16a34a',
    primaryDarkHex: '#15803d',
    primaryLightHex: '#f0fdf4',
    contrastText: '#ffffff',
    borderHex: '#16a34a',
    rgb: '22, 163, 74',
  },
  purple: {
    key: 'purple',
    nameJa: '紫',
    nameEn: 'Purple (Beniaka)',
    subJa: '紅赤芋・古代紫',
    primaryHex: '#9333ea',
    primaryDarkHex: '#7e22ce',
    primaryLightHex: '#faf5ff',
    contrastText: '#ffffff',
    borderHex: '#9333ea',
    rgb: '147, 51, 234',
  },
};

/**
 * Apply the 9-color theme variables to document root / elements
 */
export function applyThemeVariables(config: ThemeColorConfig) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', config.primaryHex);
  root.style.setProperty('--theme-primary-dark', config.primaryDarkHex);
  root.style.setProperty('--theme-primary-light', config.primaryLightHex);
  root.style.setProperty('--theme-contrast-text', config.contrastText);
  root.style.setProperty('--theme-border', config.borderHex);
  root.style.setProperty('--theme-rgb', config.rgb);
}
