export interface KisekaeTheme {
  id: string;
  nameJa: string;
  nameEn: string;
  imagePath: string; // src/assets/images/ からのパス、またはPublicからのパス
}

export const KISEKAE_THEMES: KisekaeTheme[] = [
  {
    id: 'tokinokane',
    nameJa: '時の鐘',
    nameEn: 'Toki no Kane',
    imagePath: '/src/assets/images/tokinokane.png',
  },
  {
    id: 'matsuri',
    nameJa: '川越祭り',
    nameEn: 'Kawagoe Festival',
    imagePath: '/src/assets/images/festevial.png',
  },
  {
    id: 'hikawa',
    nameJa: '氷川神社',
    nameEn: 'Hikawa Shrine',
    imagePath: '/src/assets/images/hikawazinnjya.png',
  },
  {
    id: 'sweets',
    nameJa: 'スイーツ',
    nameEn: 'Sweets',
    imagePath: '/src/assets/images/suitu.png',
  },
  {
    id: 'matinami',
    nameJa: '川越の街並み',
    nameEn: 'Kurazukuri Street',
    imagePath: '/src/assets/images/matinami.png',
  },
];