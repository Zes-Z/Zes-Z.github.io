import type { Language, LocalizedText } from './types';

/**
 * Central site configuration for the Zest theme.
 * Most site-level customization happens in this file.
 */
export const siteConfig = {
  /** Site name shown in the footer and <title>. */
  title: 'Zest',

  /** 主页左下角欢迎文字块(点击进入站内介绍页)。 */
  welcomeText: 'Welcome to this site!',
  /** 主页左下角欢迎文字块的链接目标。 */
  welcomeHref: (lang: Language) => `/${lang}/about-site`,
  /** 主页右下角“About Zes”文字块(后续另建个人展示站后替换 href 即可)。 */
  aboutZes: {
    text: 'About Zes',
    // TODO: 个人展示站上线后替换成对应地址
    href: (lang: Language) => `/${lang}/about`,
  },
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

// Production site URL (RSS links, canonical URLs).
  siteUrl: 'https://zes-z.github.io/',

  author: 'Zes',

// Default language: visitors of / are redirected here.
  defaultLang: 'zh' as Language,
// Language cycle order for the single-click switcher: zh → en → ja → zh.
  langs: ['zh', 'en', 'ja'] as const,
// 网站小图标，默认存放在public下
  favicon: '/favicon.ico',

  /**
   * Top navigation (modular). Add / remove / reorder entries freely.
   *
   *   label    : display text (supports three languages)
   *   href     : URL string, or a function of the current language
   *              (e.g. (lang) => `/${lang}/archive`)
   *   external : open in a new tab
   *   icon     : 导航图标名(home | archive | recipe | photos | friends)
   */
  nav: [
    { label: { eng: 'Home', cn: '首页', jap: 'ホーム' }, href: (lang: Language) => `/${lang}`, external: false, icon: 'home' },
    { label: { eng: 'Archive', cn: '归档', jap: 'アーカイブ' }, href: (lang: Language) => `/${lang}/archive`, external: false, icon: 'archive' },
    { label: { eng: 'Recipe', cn: '菜单', jap: '料理' }, href: (lang: Language) => `/${lang}/recipes`, external: false, icon: 'recipe' },
    { label: { eng: 'Photos', cn: '相册', jap: '写真' }, href: (lang: Language) => `/${lang}/photos`, external: false, icon: 'photos' },
    { label: { eng: 'Friends', cn: '友链', jap: '友達' }, href: (lang: Language) => `/${lang}/links`, external: false, icon: 'friends' },
      { label: { eng: 'Unknown', cn: '未知', jap: '未知' }, href: (lang: Language) => `/${lang}/unknown`, external: false, icon: 'unknown' },
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
      icon: 'cloud',
      // 云盘链接:换成你自己的网盘地址(如夸克/百度/蓝奏/OD 等)
      href: 'https://www.alipan.com/s/X4GEM51VBnM',
      // 提取码:3z3q
      label: { eng: 'Cloud Drive', cn: '云盘', jap: 'クラウドドライブ' },
    },
    {
      icon: 'wechat',
      // 点击图标后自动复制 wechatId 中配置的微信号,不会跳转
      wechatId: 'Zes234-INTJ',
      href: '#',
      label: { eng: 'WeChat', cn: '微信', jap: 'WeChat' },
    },

    {
      icon: 'rss',
      href: (lang: Language) => `/${lang}/rss.xml`,
      label: { eng: 'RSS', cn: 'RSS', jap: 'RSS' },
    },
  ] as const,

  /** Fullscreen hero images (soft crossfade). */
  heroImages: [
    '/wallpapers/saber花间意.jpg',
    '/wallpapers/海浪海鸥.jpg',
    '/wallpapers/碧海蓝天.jpg',
    '/wallpapers/晴川万里.jpg',

  ],
 
  /** 主页轮播主图切换间隔(毫秒)。大约 3000 = 3 秒。 */
  heroInterval: 6000,

 /** 友链页主图:images = 轮播图片,interval = 切换间隔(毫秒)。 */
  linksHero: {
    images: [
      // '/images/线条小狗西瓜游泳池.jpg', 
      '/wallpapers/海绵宝宝自拍合照.jpg',
      '/wallpapers/郊外旅行线条小狗.jpg',
    ],
    interval: 4000,
  },

  /** How many pinned posts the home page shows (1 large + the rest). */
  pinnedMax: 3,

  /** Ratio cycle used by the archive masonry cards (3 列时对应实际显示 4/6·9/6·6/6,可密铺)。 */
  masonryRatios: ['3 / 2', '2 / 3', '1 / 1'] as const,


//  * 相册"所有"板块的图片:true = 默认淡黑白、悬停变彩色;
//  * 仅作用于"所有"(photos)板块,作品集板块始终全彩。
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






// ============================================================
//   外观/布局参数速查表(调整文件 + 位置)
// ============================================================
 
//   以下各项的样式/逻辑不在本文件,而是分散在各 .astro / .ts 中。
//   需要调整时,直接到对应文件改对应选择器即可。
 
//   1) 顶部导航栏
//      文件:src/components/Header.astro
//      - 胶囊尺寸/毛玻璃/悬停展开:`.site-header`、`.header-inner`、`.nav-label`
 
//   2) 瀑布流(归档/菜单/相册统一)
//      - 比例集(CSS 宽:高 3/2·2/3·1/1):src/utils/ratio.ts 的 MASONRY_RATIOS
//        以及 site.config.ts 上方 `masonryRatios`
//      - 布局算法(列数/列宽/gap=列宽/6):src/scripts/masonry.ts 的 initMasonry
//      - 图片块元素(应用 aspect-ratio):
//         归档   → src/components/ArchivePanel.astro(.masonry-media)
//         菜单   → src/pages/[lang]/recipes.astro(.recipe-media)
//         相册   → src/pages/[lang]/photos.astro(.photo-item / .portfolio-cover)

//   3) 友链页
//      文件:src/pages/[lang]/links.astro
//      - 标题与卡片块间距:`.links-group-header` 的 margin-bottom
//      - 卡片墙宽度/列数/间距:`.links-grid`(grid-template-columns / max-width / gap)
//      - 卡片高度:`.friend-avatar`(width/height)、`.friend-card`(padding)
 
//   4) 底部导航栏
//      文件:src/components/Footer.astro
//      - 高度/间距/顶部渐变细线:`.site-footer`、`.footer-inner`
 
//   5) 全站配色/主题变量
//      文件:src/styles/global.css 的 html[data-theme='light'] / html[data-theme='dark']
//      - --bg / --text / --sky / --surface / --border / --hover 等
 
//   6) 文章页
//      文件:src/pages/[lang]/posts/[slug].astro
//      - 文章标题字号:`.post-title` 的 font-size
//      - 代码块:src/utils/markdown.ts(rehypeCodeBlocks)、global.css 的 .code-block
// ============================================================ */
