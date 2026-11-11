import friendsData from './content/friends.json';
import type { Language, LocalizedText, FriendGroup } from './types';

/**
 * Central site configuration for the Zest theme.
 * Most site-level customization happens in this file.
 */
export const siteConfig = {
  /** Site name shown in the footer and <title>. */
  title: 'Zest',

  /**
   * 主页左下角的欢迎文字块 —— 列表结构。
   *
   * 首页会用打字机效果逐条轮播:逐字打出 → 停留 → 逐字删除 → 下一条。
   * 只有一条时只打一遍,不循环。整块始终是一个链接:
   * 显示哪一条,点它就跳该条自己的 href。
   *
   *   text : 逐字打出的文字
   *   href : 点击跳转目标(函数则按当前语言生成)
   */

welcome: [
  {
    text: '自分はきっと想像以上だ。',
    href: (lang: Language) => `/${lang}/welcome-site`,
  },
  {
    text: 'C\'est la vie.',
    href: (lang: Language) => `/${lang}/welcome-site`,
  },
  {
    text: '做我想做，说我想说。',
    href: (lang: Language) => `/${lang}/welcome-site`,
  },
  {
    text: 'To someone it may concern.',
    href: (lang: Language) => `/${lang}/welcome-site`,
  },
] satisfies { text: string; href: (lang: Language) => string }[],


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
    eng: 'Zes\'s blog',
    cn: '在时的博客',
    jap: '在時のブログ',
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
   *              A GROUP entry (one with `children`) has no href of its own —
   *              clicking it only opens/closes its panel.
   *   external : open in a new tab
   *   icon     : 导航图标名(home | archive | friends | ,
   *              见 public/icon/)
   *   children : 可选。带 children 的条目渲染成"可向下展开的块",点开后在
   *              顶栏下方弹出面板列出子项(子项结构与顶层条目相同)。
   */
  nav: [
    {
      label: {
        eng: 'Home',
        cn: '首页',
        jap: 'ホーム',
      },
      href: (lang: Language) => `/${lang}`,
      external: false,
      icon: 'home',
    },

    {
      label: {
        eng: 'Friends',
        cn: '友链',
        jap: '友達',
      },
      href: (lang: Language) => `/${lang}/links`,
      external: false,
      icon: 'friends',
    },

    {
      label: {
        eng: 'Archive',
        cn: '归档',
        jap: 'アーカイブ',
      },
      href: (lang: Language) => `/${lang}/archive`,
      external: false,
      icon: 'database',
    }, 
    // “相册”暂未重构 
    {
      label: {
        eng: 'Album',
        cn: '相册',
        jap: '写真集',
      },
      href: (lang: Language) => `/${lang}/album`,
      external: false,
      icon: 'album',
    },
    {
      label: {
        eng: 'Mess',
        cn: '留言',
        jap: '伝言',
      },
      href: (lang: Language) => `/${lang}/message`,
      external: false,
      icon: 'message',
    },
    

    // 以下为带有可展开子节点的导航块，如“联系”
    {
      label: {
        eng: 'contact',
        cn: '联系',
        jap: '連絡',
      },
      icon: 'link',
      children: [
        {
          label: {
          eng: 'GitHub',
          cn: 'GitHub',
          jap: 'GitHub',
          },
          href: 'https://github.com/Zes-Z',
          external: true,
          icon: 'github',
        },
        {
          label: {
          eng: 'Email',
          cn: '邮箱',
          jap: 'メール',
          },
          href: 'mailto:zzs234@yeah.net',
          external: true,
          icon: 'email',
        },
        {
        label: {
        eng: 'WeChat',
        cn: '微信',
        jap: 'WeChat',
        },
        wechatId: 'Zes234-INTJ',
        href: '#',
        icon: 'wechat',
        },
        {
        label: {
        eng: 'Cloud Drive',
        cn: '云盘',
        jap: 'クラウドドライブ',
        },
        // 云盘链接:换成你自己的网盘地址(如夸克/百度/蓝奏/OD 等)
        href: 'https://www.alipan.com/s/X4GEM51VBnM', // 提取码:3z3q
        external: true,
        icon: 'cloud',
        },
        {
        label: {
        eng: 'RSS',
        cn: 'RSS',
        jap: 'RSS',
        },
        href: (lang: Language) => `/${lang}/rss.xml`,
        external: true,
        icon: 'rss',
        },
      ],
    },

  ] as const,



  /** 首页轮播媒体:图片、视频、iPhone Live Photos(柔和淡入淡出)。
   *  视频按扩展名自动识别(mp4/webm/ogv/ogg/mov/m4v),会静音、内联播放,
   *  并在结束前 0.3 秒切走,避免最后一帧参与淡出时闪屏。
   *  Live Photo 用法(静帧 + iPhone 导出的实况 .mov):
   *    { src: '/wallpaper/IMG_1234.jpg', live: '/wallpaper/IMG_1234.mov' },
   *  可选 duration(毫秒)自定义停留时间;duration: 0 表示一直停留不自动切。 */
  heroImages: [
    // '/wallpaper/太阳-房屋-朗朗晴空.mp4',
    '/wallpaper/樱花树风景.jpg',
    '/wallpaper/治愈田园雪山落日小桥.jpg',
    
    '/wallpaper/山岚晴昼.jpg',
  ],

  /** 首页普通静态图片的轮播间隔(毫秒)。视频/Live Photo 按自身时长播放。 */
  heroInterval: 6000,

  /** 友链页主图:独立于首页,可放其他图片/视频/Live Photo。
   *  写法与 heroImages 完全一致(共用 Hero 组件),interval 为友链页自己的间隔。 */
  linksHero: {
    images: [
      '/wallpaper/线条小狗 夏日树荫.jpg',
      '/wallpaper/线条小狗 西瓜游泳池.jpg',
      '/wallpaper/郊外旅行线条小狗.jpg',
      '/wallpaper/Q版-云朵-卡通.jpg',
    ],
    interval: 4000,
  },

  /** How many pinned posts the home page shows (1 large + the rest). */
  pinnedMax: 3,

  /** Ratio cycle used by the archive masonry cards (3 列时对应实际显示 4/6·9/6·6/6,可密铺)。 */
  masonryRatios: ['3 / 2', '2 / 3', '1 / 1'] as const,


  
  // ============================================================
  // 友链
  // ============================================================
  friends: friendsData as FriendGroup[],

  // ============================================================
  // 自定义网站主题背景色
  // ============================================================

  theme: {
    light: {
      bg: '#f2fff166',
    },
    dark: {
      bg: '#101218e0',
    },
  },

  /**
   * 英雄区(Hero)斜体标题使用的圆润艺术字体。
   * 设为 false 可整体去掉网页字体请求,退回系统字体栈(少一次外部请求,
   * 但斜体标题的字形会变成系统默认)。
   */
  heroFont: true,

} as const;

export function siteSubtitle(): LocalizedText | undefined {
  return (siteConfig as { subtitle?: LocalizedText }).subtitle;
}






// ============================================================
//   外观/布局参数速查表(调整文件 + 位置)
// ============================================================

//   以下各项的样式/逻辑不在本文件,而是分散在各 .astro / .ts 中。
//   需要调整时,直接到对应文件改对应选择器即可.

//   1) 顶部导航栏
//      文件:src/components/Header.astro
//      - 胶囊尺寸/毛玻璃/悬停展开:`.site-header`、`.header-inner`、`.nav-label`
//      - 向下弹出的块(导航分组 + 搜索右侧条目块):`.nav-submenu`
//      - 分组内容:上方 `nav[].children` 与 `menu`

//   2) 归档图片墙
//      - 比例集见 src/utils/ratio.ts 的 MASONRY_RATIOS
//      - 布局算法见 src/scripts/masonry.ts 的 initMasonry
//      - 容器见 src/components/ArchivePanel.astro(.masonry-media)

//   3) 友链页
//      文件:src/pages/[lang]/links.astro
//      - 标题与卡片块间距:`.links-group-header` 的 margin-bottom
//      - 卡片墙宽度/列数/间距:`.links-grid`(grid-template-columns / max-width / gap)
//      - 卡片高度:`.friend-avatar`(width/height)、`.friend-card`(padding)

//   4) 复制反馈提示(顶栏展开块内点击微信号后出现)
//      文件:src/styles/global.css 的 `.copy-toast`
//      逻辑:src/layouts/BaseLayout.astro 中的 [data-copy-wechat] 委托监听

//   5) 全站配色/主题变量
//      文件:src/styles/global.css 的 html[data-theme='light'] / html[data-theme='dark']
//      - --bg / --text / --sky / --surface / --border / --hover 等

//   6) 文章页
//      文件:src/pages/[lang]/posts/[slug].astro
//      - 文章标题字号:`.post-title` 的 font-size
//      - 代码块:src/utils/markdown.ts(rehypeCodeBlocks)、global.css 的 .code-block
// ============================================================