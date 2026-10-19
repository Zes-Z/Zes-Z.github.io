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
   *   icon     : 导航图标名(home | archive | recipe | photos | friends | ,
   *              见 src/icons/)
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


    // 以下为带有可展开子节点的导航块，如“生活”和“联系”
    {
      label: {
        eng: 'Life',
        cn: '生活',
        jap: '暮らし',
      },
      icon: 'photos',
      children: [
        {
          label: {
            eng: 'Photos',
            cn: '相册',
            jap: '写真',
          },
          href: (lang: Language) => `/${lang}/photos`,
          external: false,
          icon: 'photos',
        },
        {
          label: {
            eng: 'Recipes',
            cn: '菜单',
            jap: '料理',
          },
          href: (lang: Language) => `/${lang}/recipes`,
          external: false,
          icon: 'recipe',
        },
      ],
    },

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



  /** Fullscreen hero images (soft crossfade). */
  heroImages: [
    // '/wallpaper/saber花间意.jpg',
    '/wallpaper/樱花树风景.jpg',
    '/wallpaper/治愈田园雪山落日小桥.jpg',
    
    '/wallpaper/山岚晴昼.jpg',
  ],

  /** 主页轮播主图切换间隔(毫秒)。大约 3000 = 3 秒。 */
  heroInterval: 6000,

  /** 友链页主图:images = 轮播图片,interval = 切换间隔(毫秒)。 */
  linksHero: {
    images: [
      '/wallpaper/线条小狗 夏日树荫.jpg',
      '/wallpaper/线条小狗 西瓜游泳池.jpg',
      '/wallpaper/郊外旅行线条小狗.jpg',
      '/wallpaper/Q版-云朵-卡通.jpg'
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
  friends: [
    {
      name: {
        eng: 'friends',
        cn: '朋友',
        jap: '友達',
      },

      desc: {
        eng: 'Friendship forever.',
        cn: '常联系。',
        jap: '一期一会。',
      },

      items: [
        {
          name: {
            eng: 'cyou daii',
            cn: 'cyou daii',
            jap: 'cyou daii',
          },

          desc: {
            eng: 'It takes many.',
            cn: '感谢他的协作。',
            jap: '三人寄れば文殊の知恵。',
          },

          avatar: '/avatar/cyou daii.jpg',
          link: 'https://davis-blog.vercel.app/',
        },

        {
          name: {
            eng: 'kosame',
            cn: 'kosame',
            jap: 'kosame',
          },

          desc: {
            eng: 'It starts raining.',
            cn: '感谢她的倾听。',
            jap: '言うより聞く。',
          },

          avatar: '/avatar/kosame.jpg',
          link: 'https://example.com',
        },

        {
          name: {
            eng: 'cyou shiyu',
            cn: 'cyou shiyu',
            jap: 'cyou shiyu',
          },

          desc: {
            eng: 'The same wavelength.',
            cn: '感谢她的同理心。',
            jap: '情けは人のためならず。',
          },

          avatar: '/avatar/cyou shiyu.jpg',
          link: 'https://example.com',
        },

        {
          name: {
            eng: 'kim',
            cn: 'kim',
            jap: 'kim',
          },

          desc: {
            eng: '.',
            cn: '感谢她的存在。',
            jap: '。',
          },

          avatar: '',
          link: 'https://example.com',
        },
      ],
    },

    // // 以下为自定义区块，与“朋友”同级显示
    // {
    //   name: {
    //     eng: '外链',
    //     cn: '外链',
    //     jap: '外链',
    //   },

    //   desc: {
    //     eng: 'Useful pages worth keeping.',
    //     cn: '值得收藏的网页。',
    //     jap: '甲斐のあるページ。',
    //   },

    //   items: [
    //     {
    //       name: {
    //         eng: 'Astro',
    //         cn: 'Astro',
    //         jap: 'Astro',
    //       },
    //       desc: {
    //         eng: 'The framework this theme is built on.',
    //         cn: '本主题所基于的框架。',
    //         jap: 'このテーマの土台となったフレームワーク。',
    //       },
    //       avatar: 'https://avatars.githubusercontent.com/u/44914786',
    //       link: 'https://astro.build',
    //     },

    //   ],
    // },

    
  ] satisfies FriendGroup[],

  // ============================================================
  // 自定义网站主题背景色
  // ============================================================
  //
  //  这两个值是"首屏防闪屏"的唯一来源:BaseLayout 会在 <head> 最前面把它们
  //  内联成 CSS 变量,内联脚本再据此设置背景色。改这里的颜色即可,
  //  不要再把颜色硬编码进 BaseLayout 的脚本里。
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

  /** 菜单页的固定分类(与 `pnpm newreci` 的可选项共用同一份数据)。 */
  recipeCategories: ['蔬菜', '禽类', '海鲜', '猪牛羊', '汤', '黑暗料理'] as const,

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
//   需要调整时,直接到对应文件改对应选择器即可.

//   1) 顶部导航栏
//      文件:src/components/Header.astro
//      - 胶囊尺寸/毛玻璃/悬停展开:`.site-header`、`.header-inner`、`.nav-label`
//      - 向下弹出的块(导航分组 + 搜索右侧条目块):`.nav-submenu`
//      - 分组内容:上方 `nav[].children` 与 `menu`

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