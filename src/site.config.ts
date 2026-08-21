import type { Language, LocalizedText } from './types';

/**
 * Central site configuration for the Zest theme.
 * Most site-level customization happens in this file.
 */
export const siteConfig = {
  /** Site name shown in the header, footer and <title>. */
  title: 'Zest',
  herostr:'周旋久',
  /** Site subtitle (supports the three languages). */
  // subtitle: {
  //   eng: 'A fresh trilingual blog theme',
  //   cn: '一个清新的三语博客主题',
  //   jap: '爽やかな三言語ブログテーマ',
  // } satisfies LocalizedText,

  description: {
    eng: 'Zest — a trilingual Astro blog theme with light/dark modes, regex search, archives and more.',
    cn: 'Zest — 一个支持三语切换、明亮/暗黑配色、正则搜索与归档瀑布流的 Astro 博客主题。',
    jap: 'Zest — 三言語切り替え・ライト/ダーク配色・正規表現検索・アーカイブを備えた Astro ブログテーマ。',
  } satisfies LocalizedText,

  /** Production site URL (RSS links, canonical URLs). */
  siteUrl: 'https://zes-z.github.io/',

  author: 'Zes',

  /** Default language: visitors of / are redirected here. */
  defaultLang: 'zh' as Language,
  /** Language cycle order for the single-click switcher: zh → en → ja → zh. */
  langs: ['zh', 'en', 'ja'] as const,

  favicon: '/favicon.ico',

  /**
   * Top navigation (modular). Add / remove / reorder entries freely.
   *
   *   label    : display text (supports three languages)
   *   href     : URL string, or a function of the current language
   *              (e.g. (lang) => `/${lang}/archive`)
   *   external : open in a new tab
   */
  nav: [
    { label: { eng: 'Home', cn: '首页', jap: 'ホーム' }, href: (lang: Language) => `/${lang}`, external: false },
    { label: { eng: 'Archive', cn: '归档', jap: 'アーカイブ' }, href: (lang: Language) => `/${lang}/archive`, external: false },
    { label: { eng: 'Recipe', cn: '菜单', jap: 'レシピ' }, href: 'https://zesrecipes.pages.dev/', external: true },
    { label: { eng: 'Photos', cn: '相册', jap: '写真' }, href: (lang: Language) => `/${lang}/photos`, external: false },
    { label: { eng: 'About', cn: '关于', jap: '概要' }, href: (lang: Language) => `/${lang}/about`, external: false },
    { label: { eng: 'Friends', cn: '友链', jap: '友達リンク' }, href: (lang: Language) => `/${lang}/links`, external: false },
  ] as const,

  /**
   * Footer icon bar (icons only — labels are used for hover/accessibility).
   * Add / remove / reorder entries freely.
   *
   *   icon : which icon to render (github | email | rss | link)
   *   href : URL string, or a function of the current language
   *          (e.g. (lang) => `/${lang}/rss.xml`)
   *   label: hover title / aria-label (supports three languages)
   */
  footer: [
    {
      icon: 'github',
      href: 'https://github.com/Zes-Z',
      label: { eng: 'GitHub', cn: 'GitHub', jap: 'GitHub' },
    },
    {
      icon: 'email',
      href: 'mailto:zzs234@yeah.net',
      label: { eng: 'Email', cn: '邮箱', jap: 'メール' },
    },
    {
      icon: 'rss',
      href: (lang: Language) => `/${lang}/rss.xml`,
      label: { eng: 'RSS', cn: 'RSS', jap: 'RSS' },
    },
  ] as const,

  /** Fullscreen hero images (soft crossfade). */
  heroImages: [
    '/images/saber花间意.jpg',
    '/images/海浪海鸥.jpg',
    '/images/码头木桥.jpg',
    '/images/碧海蓝天.jpg',

  ],
  /** Hero images used on the friends page. */
  linksHeroImages: ['/images/saber花间意.jpg', '/images/海浪海鸥.jpg'],

  /** How many pinned posts the home page shows (1 large + the rest). */
  pinnedMax: 3,

  /** Max tags that can be selected at once in the archive filters. */
  maxSelectedTags: 3,

  /** Welcome article rendered as the last home block (content/pages). */
  welcomePage: 'welcome',

  /** Number of masonry columns (1–3) on wide / medium / small screens. */
  masonryColumns: { wide: 3, medium: 2, small: 1 },

  /** Ratio cycle used by the archive masonry cards. */
  masonryRatios: ['2 / 3', '3 / 2', '1 / 1'] as const,

  /**
   * 相册"所有"板块的图片:true = 默认淡黑白、悬停变彩色;
   * 仅作用于"所有"(wall)板块,作品集板块始终全彩。
   */
  photosGrayscaleHover: true,
} as const;

/**
 * Site subtitle, if configured. `subtitle` in siteConfig is optional
 * (it may be commented out by the user); call this helper instead of
 * accessing siteConfig.subtitle directly.
 */
export function siteSubtitle(): LocalizedText | undefined {
  return (siteConfig as { subtitle?: LocalizedText }).subtitle;
}
