import React, { useState } from 'react';

import {
  Palette,
  User,
  Volume2,
  Type,
  X,
  Check,
  Layers,
  Languages,
} from 'lucide-react';

import {
  Language,
  ThemeColorKey,
  UserProfile,
} from '../types';

import { THEME_COLORS } from '../utils/theme';


// =========================================================
// Props
// =========================================================

interface AccountTabProps {
  language: Language;

  onSetLanguage: (lang: Language) => void;

  currentThemeKey: ThemeColorKey;

  onSetThemeColor: (
    colorKey: ThemeColorKey
  ) => void;

  userProfile: UserProfile;

  onUpdateProfile: (
    profile: UserProfile
  ) => void;

  walletBalance: number;

  walletPoints: number;

  onOpenCharge: () => void;

  onOpenHistory: () => void;

  onOpenQr: () => void;
}


// =========================================================
// 着せ替え
// =========================================================

const KISEKAE_OPTIONS = [
  {
    id: 'tokinokane',
    nameJa: '時の鐘',
    nameEn: 'Toki no Kane',
    path: '/src/assets/images/tokinokane.png',
  },

  {
    id: 'matsuri',
    nameJa: '川越祭り',
    nameEn: 'Kawagoe Festival',
    path: '/src/assets/images/festevial.png',
  },

  {
    id: 'hikawa',
    nameJa: '氷川神社',
    nameEn: 'Kawagoe Hikawa Shrine',
    path: '/src/assets/images/hikawazinnjya.png',
  },

  {
    id: 'matinami',
    nameJa: '蔵造りの街並み',
    nameEn: 'Warehouse District',
    path: '/src/assets/images/matinami.png',
  },

  {
    id: 'suitu',
    nameJa: '川越スイーツ',
    nameEn: 'Kawagoe Sweets',
    path: '/src/assets/images/suitu.png',
  },

  {
    id: 'beer',
    nameJa: 'COEDOビール',
    nameEn: 'COEDO Beer',
    path: '/src/assets/images/beer.png',
  },

  {
    id: 'koedoterrace',
    nameJa: 'コエドテラス',
    nameEn: 'Koedo Terrace',
    path: '/src/assets/images/koedoterasu.png',
  },

  {
    id: 'kawagoejyou',
    nameJa: '川越城',
    nameEn: 'Kawagoe Castle',
    path: '/src/assets/images/kawagoejyou.png',
  },

  {
    id: 'kawagoeeki',
    nameJa: '川越駅',
    nameEn: 'Kawagoe Station',
    path: '/src/assets/images/kawagoeseki.png',
  },

  {
    id: 'honkawagoeeki',
    nameJa: '本川越駅',
    nameEn: 'Hon-Kawagoe Station',
    path: '/src/assets/images/honkawagoeeki .png',
  },

  {
    id: 'huurin',
    nameJa: '氷川神社 風鈴',
    nameEn: 'Hikawa Shrine Wind Chimes',
    path: '/src/assets/images/huurin.png',
  },

  {
    id: 'ice',
    nameJa: '川越ソフトクリーム',
    nameEn: 'Kawagoe Soft Serve',
    path: '/src/assets/images/ice.png',
  },

  {
    id: 'naight',
    nameJa: '川越の夜',
    nameEn: 'Kawagoe at Night',
    path: '/src/assets/images/naight.png',
  },

  {
    id: 'yuugata',
    nameJa: '川越の夕方',
    nameEn: 'Kawagoe at Sunset',
    path: '/src/assets/images/yuugata.png',
  },

  {
    id: 'sakura',
    nameJa: '川越の桜',
    nameEn: 'Kawagoe Cherry Blossoms',
    path: '/src/assets/images/sakura.png',
  },
];


// =========================================================
// AccountTab
// =========================================================

export const AccountTab: React.FC<
  AccountTabProps
> = ({
  language,
  onSetLanguage,
  currentThemeKey,
  onSetThemeColor,
}) => {
  const activeConfig =
    THEME_COLORS[currentThemeKey];


  // =======================================================
  // モーダル
  // =======================================================

  const [
    isThemeModalOpen,
    setIsThemeModalOpen,
  ] = useState(false);

  const [
    isFontSizeModalOpen,
    setIsFontSizeModalOpen,
  ] = useState(false);

  const [
    isVolumeModalOpen,
    setIsVolumeModalOpen,
  ] = useState(false);

  const [
    isKisekaeModalOpen,
    setIsKisekaeModalOpen,
  ] = useState(false);

  const [
    isLanguageModalOpen,
    setIsLanguageModalOpen,
  ] = useState(false);

  const [
    isTermsOpen,
    setIsTermsOpen,
  ] = useState(false);

  const [
    isPrivacyOpen,
    setIsPrivacyOpen,
  ] = useState(false);


  // =======================================================
  // 着せ替え
  // =======================================================

  const [
    selectedKisekae,
    setSelectedKisekae,
  ] = useState(() => {
    try {
      return (
        localStorage.getItem(
          'kawagoe_kisekae_image'
        ) ||
        '/src/assets/images/tokinokane.png'
      );
    } catch {
      return '/src/assets/images/tokinokane.png';
    }
  });


  // =======================================================
  // 文字サイズ
  // =======================================================

  const [
    fontSize,
    setFontSize,
  ] = useState<
    'standard' | 'large' | 'xlarge'
  >(() => {
    try {
      return (
        localStorage.getItem(
          'kawagoe_font_size'
        ) as
          | 'standard'
          | 'large'
          | 'xlarge'
      ) || 'standard';
    } catch {
      return 'standard';
    }
  });


  // =======================================================
  // 音量
  // =======================================================

  const [
    soundEnabled,
    setSoundEnabled,
  ] = useState(true);


  // =======================================================
  // 着せ替え変更
  // =======================================================

  const handleSelectKisekae = (
    path: string
  ) => {
    setSelectedKisekae(path);

    try {
      localStorage.setItem(
        'kawagoe_kisekae_image',
        path
      );
    } catch {
      // 保存できない場合は何もしない
    }

    setIsKisekaeModalOpen(false);
  };


  // =======================================================
  // 文字サイズ変更
  // =======================================================

  const handleSelectFontSize = (
    size:
      | 'standard'
      | 'large'
      | 'xlarge'
  ) => {
    setFontSize(size);

    try {
      localStorage.setItem(
        'kawagoe_font_size',
        size
      );
    } catch {
      // 保存できない場合は何もしない
    }

    const rootElement =
      document.documentElement;

    rootElement.classList.remove(
      'text-size-standard',
      'text-size-large',
      'text-size-xlarge'
    );

    if (size === 'large') {
      rootElement.style.fontSize =
        '17px';
    } else if (size === 'xlarge') {
      rootElement.style.fontSize =
        '19px';
    } else {
      rootElement.style.fontSize =
        '16px';
    }

    setIsFontSizeModalOpen(false);
  };


  // =======================================================
  // 言語変更
  // =======================================================

  const handleSelectLanguage = (
    lang: Language
  ) => {
    onSetLanguage(lang);

    try {
      localStorage.setItem(
        'kawagoe_language',
        lang
      );
    } catch {
      // 保存できない場合は何もしない
    }

    document.documentElement.lang =
      lang === 'ja' ? 'ja' : 'en';

    setIsLanguageModalOpen(false);
  };


  // =======================================================
  // テーマカラー一覧
  // =======================================================

  const colorKeys: ThemeColorKey[] = [
    'orange',
    'yellow',
    'red',
    'blue',
    'cyan',
    'green',
    'purple',
    'black',
    'white',
  ];


  // =======================================================
  // 表示
  // =======================================================

  return (
    <div
      className="
        pb-16
        bg-[#f9f9f9]
        min-h-screen
        text-stone-900
      "
    >

      {/* ===================================================
          1. プロフィール
      ==================================================== */}

      <div
        className="
          bg-white
          pt-6
          pb-5
          px-4
          text-center
          border-b
          border-stone-200/80
          shadow-2xs
        "
      >
        <div
          className="
            w-16
            h-16
            rounded-full
            bg-amber-100
            border-2
            border-stone-200
            flex
            items-center
            justify-center
            mx-auto
            mb-2
            shadow-xs
            text-stone-700
          "
        >
          <User className="w-8 h-8" />
        </div>

        <h3
          className="
            text-base
            font-bold
            text-stone-900
          "
        >
          山下 暉登

          <span
            className="
              text-xs
              font-normal
              text-stone-500
              ml-1
            "
          >
            {language === 'ja'
              ? 'さん'
              : ''}
          </span>
        </h3>

        <p
          className="
            text-[11px]
            text-stone-400
            mt-0.5
          "
        >
          ID: kawagoe-user-2026
        </p>
      </div>


      {/* ===================================================
          2. 設定
      ==================================================== */}

      <div
        className="
          max-w-md
          mx-auto
          px-4
          space-y-3
          pt-4
        "
      >

        <h4
          className="
            text-[11px]
            font-bold
            text-stone-500
            px-1
            uppercase
            tracking-wider
          "
        >
          {language === 'ja'
            ? '設定'
            : 'Settings'}
        </h4>


        {/* =================================================
            メイン設定
        ================================================= */}

        <div
          className="
            bg-white
            rounded-2xl
            divide-y
            divide-stone-100
            border
            border-stone-200/80
            shadow-xs
            overflow-hidden
          "
        >

          {/* 着せ替え */}

          <button
            type="button"
            onClick={() =>
              setIsKisekaeModalOpen(true)
            }
            className="
              w-full
              px-4
              py-3.5
              flex
              items-center
              justify-between
              hover:bg-stone-50
              transition-colors
              text-left
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Layers
                className="
                  w-4
                  h-4
                  text-stone-500
                "
              />

              <span
                className="
                  text-xs
                  font-bold
                  text-stone-800
                "
              >
                {language === 'ja'
                  ? '着せ替え'
                  : 'Appearance'}
              </span>
            </div>

            <span
              className="
                text-stone-400
                font-bold
                text-[10px]
              "
            >
              ▶
            </span>
          </button>


          {/* 音量 */}

          <button
            type="button"
            onClick={() =>
              setIsVolumeModalOpen(true)
            }
            className="
              w-full
              px-4
              py-3.5
              flex
              items-center
              justify-between
              hover:bg-stone-50
              transition-colors
              text-left
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Volume2
                className="
                  w-4
                  h-4
                  text-stone-500
                "
              />

              <span
                className="
                  text-xs
                  font-bold
                  text-stone-800
                "
              >
                {language === 'ja'
                  ? '音量設定'
                  : 'Sound'}
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  text-[11px]
                  text-stone-400
                "
              >
                {soundEnabled
                  ? language === 'ja'
                    ? 'オン (標準)'
                    : 'On'
                  : language === 'ja'
                    ? 'ミュート'
                    : 'Muted'}
              </span>

              <span
                className="
                  text-stone-400
                  font-bold
                  text-[10px]
                "
              >
                ▶
              </span>
            </div>
          </button>


          {/* 文字サイズ */}

          <button
            type="button"
            onClick={() =>
              setIsFontSizeModalOpen(true)
            }
            className="
              w-full
              px-4
              py-3.5
              flex
              items-center
              justify-between
              hover:bg-stone-50
              transition-colors
              text-left
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Type
                className="
                  w-4
                  h-4
                  text-stone-500
                "
              />

              <span
                className="
                  text-xs
                  font-bold
                  text-stone-800
                "
              >
                {language === 'ja'
                  ? '文字サイズの変更'
                  : 'Text Size'}
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  text-[11px]
                  text-stone-400
                "
              >
                {fontSize === 'standard'
                  ? language === 'ja'
                    ? '標準'
                    : 'Standard'
                  : fontSize === 'large'
                    ? language === 'ja'
                      ? '大文字'
                      : 'Large'
                    : language === 'ja'
                      ? '特大'
                      : 'Extra Large'}
              </span>

              <span
                className="
                  text-stone-400
                  font-bold
                  text-[10px]
                "
              >
                ▶
              </span>
            </div>
          </button>


          {/* テーマカラー */}

          <button
            type="button"
            onClick={() =>
              setIsThemeModalOpen(true)
            }
            className="
              w-full
              px-4
              py-3.5
              flex
              items-center
              justify-between
              hover:bg-stone-50
              transition-colors
              text-left
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Palette
                className="
                  w-4
                  h-4
                  text-stone-500
                "
              />

              <span
                className="
                  text-xs
                  font-bold
                  text-stone-800
                "
              >
                {language === 'ja'
                  ? 'テーマカラーの変更'
                  : 'Theme Color'}
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  w-3.5
                  h-3.5
                  rounded-full
                  border
                  border-stone-300
                  shadow-2xs
                  inline-block
                "
                style={{
                  backgroundColor:
                    activeConfig.primaryHex,
                }}
              />

              <span
                className="
                  text-[11px]
                  text-stone-400
                "
              >
                {language === 'ja'
                  ? activeConfig.nameJa
                  : activeConfig.nameEn}
              </span>

              <span
                className="
                  text-stone-400
                  font-bold
                  text-[10px]
                "
              >
                ▶
              </span>
            </div>
          </button>


          {/* =================================================
              ★ 言語設定
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              setIsLanguageModalOpen(true)
            }
            className="
              w-full
              px-4
              py-3.5
              flex
              items-center
              justify-between
              hover:bg-stone-50
              transition-colors
              text-left
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Languages
                className="
                  w-4
                  h-4
                  text-stone-500
                "
              />

              <span
                className="
                  text-xs
                  font-bold
                  text-stone-800
                "
              >
                {language === 'ja'
                  ? '言語 / Language'
                  : 'Language / 言語'}
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  text-[11px]
                  text-stone-400
                "
              >
                {language === 'ja'
                  ? '日本語'
                  : 'English'}
              </span>

              <span
                className="
                  text-stone-400
                  font-bold
                  text-[10px]
                "
              >
                ▶
              </span>
            </div>
          </button>
        </div>


        {/* =================================================
            利用規約・プライバシー
        ================================================= */}

        <div
          className="
            bg-white
            rounded-2xl
            divide-y
            divide-stone-100
            border
            border-stone-200/80
            shadow-xs
            overflow-hidden
            mt-3
          "
        >
          <button
            type="button"
            onClick={() =>
              setIsTermsOpen(true)
            }
            className="
              w-full
              px-4
              py-3.5
              flex
              items-center
              justify-between
              hover:bg-stone-50
              transition-colors
              text-left
            "
          >
            <span
              className="
                text-xs
                font-bold
                text-stone-800
              "
            >
              {language === 'ja'
                ? '利用規約'
                : 'Terms of Service'}
            </span>

            <span
              className="
                text-stone-400
                font-bold
                text-[10px]
              "
            >
              ▶
            </span>
          </button>


          <button
            type="button"
            onClick={() =>
              setIsPrivacyOpen(true)
            }
            className="
              w-full
              px-4
              py-3.5
              flex
              items-center
              justify-between
              hover:bg-stone-50
              transition-colors
              text-left
            "
          >
            <span
              className="
                text-xs
                font-bold
                text-stone-800
              "
            >
              {language === 'ja'
                ? 'プライバシーポリシー'
                : 'Privacy Policy'}
            </span>

            <span
              className="
                text-stone-400
                font-bold
                text-[10px]
              "
            >
              ▶
            </span>
          </button>
        </div>


        {/* バージョン */}

        <div
          className="
            py-4
            text-center
            text-[11px]
            text-stone-400
          "
        >
          {language === 'ja'
            ? 'バージョン 2.4.4'
            : 'Version 2.4.4'}
        </div>
      </div>


      {/* ===================================================
          言語選択モーダル
      ==================================================== */}

      {isLanguageModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
            bg-black/60
            backdrop-blur-2xs
          "
        >
          <div
            className="
              w-full
              max-w-xs
              bg-white
              rounded-3xl
              p-5
              shadow-2xl
              space-y-4
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-stone-100
                pb-3
              "
            >
              <div>
                <h3
                  className="
                    text-base
                    font-bold
                    text-stone-900
                  "
                >
                  {language === 'ja'
                    ? '言語を選択'
                    : 'Select Language'}
                </h3>

                <p
                  className="
                    text-[11px]
                    text-stone-400
                    mt-1
                  "
                >
                  日本語 / English
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsLanguageModalOpen(false)
                }
              >
                <X
                  className="
                    w-5
                    h-5
                    text-stone-500
                  "
                />
              </button>
            </div>


            {/* 日本語 */}

            <button
              type="button"
              onClick={() =>
                handleSelectLanguage('ja')
              }
              className={`
                w-full
                py-3.5
                px-4
                rounded-xl
                font-bold
                flex
                items-center
                justify-between
                ${
                  language === 'ja'
                    ? 'bg-sky-50 border-2 border-sky-500 text-sky-800'
                    : 'bg-stone-100 border-2 border-transparent text-stone-700'
                }
              `}
            >
              <div className="text-left">
                <div className="text-sm">
                  日本語
                </div>

                <div
                  className="
                    text-[10px]
                    font-normal
                    opacity-60
                    mt-0.5
                  "
                >
                  Japanese
                </div>
              </div>

              {language === 'ja' && (
                <Check className="w-5 h-5" />
              )}
            </button>


            {/* English */}

            <button
              type="button"
              onClick={() =>
                handleSelectLanguage('en')
              }
              className={`
                w-full
                py-3.5
                px-4
                rounded-xl
                font-bold
                flex
                items-center
                justify-between
                ${
                  language === 'en'
                    ? 'bg-sky-50 border-2 border-sky-500 text-sky-800'
                    : 'bg-stone-100 border-2 border-transparent text-stone-700'
                }
              `}
            >
              <div className="text-left">
                <div className="text-sm">
                  English
                </div>

                <div
                  className="
                    text-[10px]
                    font-normal
                    opacity-60
                    mt-0.5
                  "
                >
                  英語
                </div>
              </div>

              {language === 'en' && (
                <Check className="w-5 h-5" />
              )}
            </button>


            <button
              type="button"
              onClick={() =>
                setIsLanguageModalOpen(false)
              }
              className="
                w-full
                h-10
                bg-stone-900
                text-white
                rounded-xl
                text-xs
                font-bold
              "
            >
              {language === 'ja'
                ? '閉じる'
                : 'Close'}
            </button>
          </div>
        </div>
      )}


      {/* ===================================================
          着せ替えモーダル
      ==================================================== */}

      {isKisekaeModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
            bg-black/60
            backdrop-blur-2xs
          "
        >
          <div
            className="
              w-full
              max-w-lg
              bg-white
              rounded-3xl
              p-5
              shadow-2xl
              space-y-4
              max-h-[85vh]
              overflow-y-auto
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-stone-100
                pb-2
              "
            >
              <h3
                className="
                  text-sm
                  font-bold
                  text-stone-900
                "
              >
                {language === 'ja'
                  ? '着せ替えデザインの選択'
                  : 'Choose Appearance'}
              </h3>

              <button
                type="button"
                onClick={() =>
                  setIsKisekaeModalOpen(false)
                }
              >
                <X
                  className="
                    w-4
                    h-4
                    text-stone-500
                  "
                />
              </button>
            </div>


            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-3
                gap-2.5
              "
            >
              {KISEKAE_OPTIONS.map(
                (item) => {
                  const isSelected =
                    selectedKisekae ===
                    item.path;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleSelectKisekae(
                          item.path
                        )
                      }
                      className={`
                        group
                        relative
                        rounded-2xl
                        overflow-hidden
                        border
                        text-left
                        transition-all
                        shadow-xs
                        ${
                          isSelected
                            ? 'ring-2 ring-stone-900 border-stone-900 scale-[1.02]'
                            : 'border-stone-200 hover:border-stone-400'
                        }
                      `}
                    >
                      <div
                        className="
                          h-20
                          w-full
                          overflow-hidden
                          bg-stone-100
                          relative
                        "
                      >
                        <img
                          src={item.path}
                          alt={
                            language === 'ja'
                              ? item.nameJa
                              : item.nameEn
                          }
                          className="
                            w-full
                            h-full
                            object-cover
                            group-hover:scale-105
                            transition-transform
                          "
                          referrerPolicy="no-referrer"
                        />

                        {isSelected && (
                          <div
                            className="
                              absolute
                              inset-0
                              bg-black/30
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <span
                              className="
                                bg-stone-900
                                text-white
                                text-[10px]
                                font-bold
                                px-2
                                py-0.5
                                rounded-full
                                flex
                                items-center
                                gap-1
                                shadow-md
                              "
                            >
                              <Check className="w-3 h-3" />

                              {language === 'ja'
                                ? '選択中'
                                : 'Selected'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-2 bg-white">
                        <span
                          className="
                            text-xs
                            font-bold
                            text-stone-800
                            block
                            truncate
                          "
                        >
                          {language === 'ja'
                            ? item.nameJa
                            : item.nameEn}
                        </span>
                      </div>
                    </button>
                  );
                }
              )}
            </div>


            <button
              type="button"
              onClick={() =>
                setIsKisekaeModalOpen(false)
              }
              className="
                w-full
                h-10
                bg-stone-900
                text-white
                rounded-xl
                text-xs
                font-bold
                shadow-sm
              "
            >
              {language === 'ja'
                ? '閉じる'
                : 'Close'}
            </button>
          </div>
        </div>
      )}


      {/* ===================================================
          音量設定モーダル
      ==================================================== */}

      {isVolumeModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
            bg-black/60
            backdrop-blur-2xs
          "
        >
          <div
            className="
              w-full
              max-w-xs
              bg-white
              rounded-3xl
              p-5
              shadow-2xl
              space-y-4
            "
          >
            <h3
              className="
                text-sm
                font-bold
                text-stone-900
                border-b
                border-stone-100
                pb-2
              "
            >
              {language === 'ja'
                ? '音量設定'
                : 'Sound Settings'}
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setSoundEnabled(true);
                  setIsVolumeModalOpen(false);
                }}
                className={`
                  w-full
                  py-2.5
                  rounded-xl
                  text-xs
                  font-bold
                  flex
                  items-center
                  justify-between
                  px-3
                  ${
                    soundEnabled
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-stone-100 text-stone-600'
                  }
                `}
              >
                <span>
                  {language === 'ja'
                    ? '効果音・通知音 オン'
                    : 'Sound Effects On'}
                </span>

                {soundEnabled && (
                  <Check className="w-4 h-4 text-amber-600" />
                )}
              </button>


              <button
                type="button"
                onClick={() => {
                  setSoundEnabled(false);
                  setIsVolumeModalOpen(false);
                }}
                className={`
                  w-full
                  py-2.5
                  rounded-xl
                  text-xs
                  font-bold
                  flex
                  items-center
                  justify-between
                  px-3
                  ${
                    !soundEnabled
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-stone-100 text-stone-600'
                  }
                `}
              >
                <span>
                  {language === 'ja'
                    ? 'ミュート (オフ)'
                    : 'Mute'}
                </span>

                {!soundEnabled && (
                  <Check className="w-4 h-4 text-amber-600" />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsVolumeModalOpen(false)
              }
              className="
                w-full
                h-9
                bg-stone-900
                text-white
                rounded-xl
                text-xs
                font-bold
              "
            >
              {language === 'ja'
                ? '閉じる'
                : 'Close'}
            </button>
          </div>
        </div>
      )}


      {/* ===================================================
          文字サイズモーダル
      ==================================================== */}

      {isFontSizeModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
            bg-black/60
            backdrop-blur-2xs
          "
        >
          <div
            className="
              w-full
              max-w-xs
              bg-white
              rounded-3xl
              p-5
              shadow-2xl
              space-y-3
            "
          >
            <h3
              className="
                text-sm
                font-bold
                text-stone-900
                border-b
                border-stone-100
                pb-2
              "
            >
              {language === 'ja'
                ? '文字サイズの変更'
                : 'Text Size'}
            </h3>


            <div className="space-y-2">

              <button
                type="button"
                onClick={() =>
                  handleSelectFontSize(
                    'standard'
                  )
                }
                className={`
                  w-full
                  py-2.5
                  rounded-xl
                  text-xs
                  font-bold
                  flex
                  items-center
                  justify-between
                  px-3
                  ${
                    fontSize === 'standard'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-stone-100 text-stone-600'
                  }
                `}
              >
                <span>
                  {language === 'ja'
                    ? '標準サイズ'
                    : 'Standard'}
                </span>

                {fontSize === 'standard' && (
                  <Check className="w-4 h-4 text-amber-600" />
                )}
              </button>


              <button
                type="button"
                onClick={() =>
                  handleSelectFontSize(
                    'large'
                  )
                }
                className={`
                  w-full
                  py-2.5
                  rounded-xl
                  text-sm
                  font-bold
                  flex
                  items-center
                  justify-between
                  px-3
                  ${
                    fontSize === 'large'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-stone-100 text-stone-600'
                  }
                `}
              >
                <span>
                  {language === 'ja'
                    ? '大文字'
                    : 'Large'}
                </span>

                {fontSize === 'large' && (
                  <Check className="w-4 h-4 text-amber-600" />
                )}
              </button>


              <button
                type="button"
                onClick={() =>
                  handleSelectFontSize(
                    'xlarge'
                  )
                }
                className={`
                  w-full
                  py-3
                  rounded-xl
                  text-base
                  font-black
                  flex
                  items-center
                  justify-between
                  px-3
                  ${
                    fontSize === 'xlarge'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-stone-100 text-stone-600'
                  }
                `}
              >
                <span>
                  {language === 'ja'
                    ? '超太文字 (特大)'
                    : 'Extra Large'}
                </span>

                {fontSize === 'xlarge' && (
                  <Check className="w-4 h-4 text-amber-600" />
                )}
              </button>

            </div>


            <button
              type="button"
              onClick={() =>
                setIsFontSizeModalOpen(false)
              }
              className="
                w-full
                h-9
                bg-stone-900
                text-white
                rounded-xl
                text-xs
                font-bold
              "
            >
              {language === 'ja'
                ? '閉じる'
                : 'Close'}
            </button>
          </div>
        </div>
      )}


      {/* ===================================================
          テーマカラー
      ==================================================== */}

      {isThemeModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
            bg-black/60
            backdrop-blur-2xs
          "
        >
          <div
            className="
              w-full
              max-w-sm
              bg-white
              rounded-3xl
              p-5
              shadow-2xl
              space-y-4
              max-h-[85vh]
              overflow-y-auto
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-stone-100
                pb-2
              "
            >
              <h3
                className="
                  text-sm
                  font-bold
                  text-stone-900
                "
              >
                {language === 'ja'
                  ? 'テーマカラーの変更'
                  : 'Theme Color'}
              </h3>

              <button
                type="button"
                onClick={() =>
                  setIsThemeModalOpen(false)
                }
              >
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>


            <div
              className="
                grid
                grid-cols-3
                gap-2.5
              "
            >
              {colorKeys.map((key) => {
                const config =
                  THEME_COLORS[key];

                const isSelected =
                  currentThemeKey === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onSetThemeColor(key);
                      setIsThemeModalOpen(
                        false
                      );
                    }}
                    className={`
                      p-3
                      rounded-2xl
                      border
                      text-center
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-1.5
                      transition-all
                      shadow-xs
                      ${
                        isSelected
                          ? 'ring-2 ring-stone-900 scale-105'
                          : 'border-stone-200 hover:border-stone-400'
                      }
                    `}
                    style={{
                      backgroundColor:
                        config.primaryHex,

                      color:
                        config.contrastText,
                    }}
                  >
                    <div
                      className="
                        w-5
                        h-5
                        rounded-full
                        border
                        border-black/20
                        flex
                        items-center
                        justify-center
                        bg-white/30
                      "
                    >
                      {isSelected && (
                        <Check
                          className="
                            w-3.5
                            h-3.5
                            stroke-[3]
                          "
                          style={{
                            color:
                              config.contrastText,
                          }}
                        />
                      )}
                    </div>

                    <span
                      className="
                        text-xs
                        font-bold
                        tracking-wider
                        drop-shadow-xs
                      "
                    >
                      {language === 'ja'
                        ? config.nameJa
                        : config.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>


            <button
              type="button"
              onClick={() =>
                setIsThemeModalOpen(false)
              }
              className="
                w-full
                h-9
                bg-stone-900
                text-white
                rounded-xl
                text-xs
                font-bold
              "
            >
              {language === 'ja'
                ? '閉じる'
                : 'Close'}
            </button>
          </div>
        </div>
      )}


      {/* ===================================================
          利用規約
      ==================================================== */}

      {isTermsOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
            bg-black/60
            backdrop-blur-2xs
          "
        >
          <div
            className="
              w-full
              max-w-sm
              bg-white
              rounded-3xl
              p-5
              shadow-2xl
              space-y-3
            "
          >
            <h3
              className="
                text-sm
                font-bold
                text-stone-900
                border-b
                border-stone-100
                pb-2
              "
            >
              {language === 'ja'
                ? '利用規約'
                : 'Terms of Service'}
            </h3>

            <p
              className="
                text-xs
                text-stone-600
                leading-relaxed
                max-h-60
                overflow-y-auto
              "
            >
              {language === 'ja'
                ? '本サービスは川越市の観光分散・フードロス削減実証事業として提供されています。'
                : 'This service is provided as a demonstration project for tourism dispersion and food-loss reduction in Kawagoe.'}
            </p>

            <button
              type="button"
              onClick={() =>
                setIsTermsOpen(false)
              }
              className="
                w-full
                h-9
                bg-stone-100
                text-stone-800
                font-bold
                text-xs
                rounded-xl
              "
            >
              {language === 'ja'
                ? '閉じる'
                : 'Close'}
            </button>
          </div>
        </div>
      )}


      {/* ===================================================
          プライバシーポリシー
      ==================================================== */}

      {isPrivacyOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
            bg-black/60
            backdrop-blur-2xs
          "
        >
          <div
            className="
              w-full
              max-w-sm
              bg-white
              rounded-3xl
              p-5
              shadow-2xl
              space-y-3
            "
          >
            <h3
              className="
                text-sm
                font-bold
                text-stone-900
                border-b
                border-stone-100
                pb-2
              "
            >
              {language === 'ja'
                ? 'プライバシーポリシー'
                : 'Privacy Policy'}
            </h3>

            <p
              className="
                text-xs
                text-stone-600
                leading-relaxed
                max-h-60
                overflow-y-auto
              "
            >
              {language === 'ja'
                ? '取得した情報は本サービスの改善およびクーポン配信以外の目的に使用いたしません。'
                : 'Information collected through this service will only be used to improve the service and provide coupons.'}
            </p>

            <button
              type="button"
              onClick={() =>
                setIsPrivacyOpen(false)
              }
              className="
                w-full
                h-9
                bg-stone-100
                text-stone-800
                font-bold
                text-xs
                rounded-xl
              "
            >
              {language === 'ja'
                ? '閉じる'
                : 'Close'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};