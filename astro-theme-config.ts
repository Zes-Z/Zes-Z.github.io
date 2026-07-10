type NavItem = {
  label: string;
  href: string;
};

/**
 * astro-theme-config.ts
 *
 * Central configuration for the Tone theme.
 * Most site-level customization should happen in this file.
 */

const config = {
  site: {
    /** Production origin, used for canonical links, sitemap, and Open Graph metadata. */
    url: 'https://zesforu.pages.dev',
    /** Subpath such as '/repo-name'. Keep empty when deploying at a domain root. */
    base: '/',
    lang: 'zh',
    locale: 'en_US',
    dateLocale: 'en-US',
    title: 'Zes for u',
    logoLabel: 'Zesforu',
    description: '別の道は別の花.',
    author: 'Zes',
    /** Optional absolute or root-relative image URL for homepage/search/about social previews. */
    defaultOgImage: '/og.png',
  },

  // The logo already links to `/`. Add items here if you want visible header links.
  // Example: [{ label: 'Posts', href: '/posts' }, { label: 'About', href: '/about' }]
  nav: [ 
  { label: 'Home', href: '/' },
  { label: 'Archive', href: '/posts' },
  { label: 'Search', href: '/search' },
  { label: 'Photos', href: 'https://zes-z.github.io/ZesPhotos/' },
  // { label: 'Photos', href: 'https://www.alipan.com/s/rnJsLF2KTtt' },
  { label: 'About', href: '/about' },
  { label: 'とも', href: '/links' },
  
] as NavItem[],

  // Footer links stay visible by default so readers have a stable way to move around.
  footerNav: [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/search' },
    { label: 'About', href: '/about' },
  ] as NavItem[],


// src\ui.ts 用于更改各导航栏页面的左上角题头
// src\styles\pages\home.css 在这里更改字体大小

// src\components\Footer.astro的 const footerLinks = config.footerNav
// .filter((item) => item.href !== '/');用于过滤底部导航栏的"主页"

// src\styles\tokens.css 的 line44
//  --text-caption-1: 1.2rem; 用于控制顶部导航栏大小

// src\styles\pages\about.css的 line35
// font-size: clamp(1.2rem, 5vw, 2.4rem); 用于控制 about 和 友链 页面左上角题头大小

// Links页面为自建, 在下方文件中更改
// src\pages\links.astro



  content: {
    categoryOrder: [
      'Math & Coding',
      'Ling.',
      'Omnium',
    ],
  },

  behavior: {
    smoothScroll: true,
  },

  comments: {
    // One-line switch after you fill the giscus values:
    // mode: 'off'           -> no comments
    // mode: 'giscus'        -> original giscus theme
    // mode: 'giscus-custom' -> Tone custom giscus theme
    // Local preview can also use PUBLIC_GISCUS_MODE and PUBLIC_GISCUS_* in .env.local.
    mode: 'off',
    provider: 'giscus',
    giscus: {
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '0',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme',
      customLightTheme: '/giscus-light.css',
      customDarkTheme: '/giscus-dark.css',
      lang: 'en',
      loading: 'eager',
    },
  },

  social: {
    website: 'https://zes-z.github.io/', // e.g. 'https://your-site.com'
    email: 'zzs234@yeah.net', // e.g. 'hello@your-site.com'
    // linkedin: '', // e.g. 'https://www.linkedin.com/in/yourhandle'
    github: 'https://github.com/Zes-Z', // e.g. 'https://github.com/yourhandle'
  },

  about: {
    /** Profile image URL. Leave empty to use the text-only About layout. */
    profileImage: '/portrait.jpg',
    name: '在时',
    // role: 'Study Maths, Linguistics ing.',
    location: 'Somewhere',
    focus: 'Maths, coding, 日语, 英语, ',
    lead: '感谢相遇, 不论得失.',
    headline: ['关于我'],

    statementLabel: '基本信息',
    statementTitle: 'INFP -> INFJ -> INTJ',
    statement:[
      '長い時間をかけて、今日の私となった。',  
    
    ],



    careerLabel: '教育经历',
    career: [
      {
        period: '2024.9.12 - 今',
        title: '天津外国语大学 日语学院',
        description:
          '专业：日语语言文学　方向：日语语言学理论与实践',
      },
      {
        period: '2019.9 - 2023.6',
        title: '淮北师范大学 外国语学院',
        description:
          '专业：日语',
      },
        {
        period: '2016.9 - 2019.6',
        title: '安徽省 宿松中学',
        description:
          '',
      },
    ],
    


    interestsLabel: '兴趣爱好',
    interestsHeading: 'What keeps life interesting?',
    interests: [
      '当透过取景器观察世界时，我感到眼前清晰',
      '有时专注于阅读和思考，我会忘了翻页',
      '能够不做不想做的事，才是真正的自由',
    ],

  },
};

export default config;


