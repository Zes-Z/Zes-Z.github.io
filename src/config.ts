import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Zes",  // 主页左上角及网页标题
	subtitle: "blog",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 155, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "assets/images/天空风景.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: true, // Display the credit text of the banner image  是否展示横幅图片信息
			text: "by ...", // Credit text to be displayed   横幅图片文字说明
			url: "", // (Optional) URL link to the original artwork or artist's page  图片链接版权作者
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post  文章目录层级开关
		depth: 3, // Maximum heading depth to show in the table, from 1 to 3   
	},
	favicon: [
		// Leave this array empty to use the default favicon
		{
		  src: '/favicon/favicon-32x32.png',    // Path of the favicon, relative to the /public directory
		  theme: 'dark',       // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		  sizes: '32x32',      // (Optional) Size of the favicon, set only if you have favicons of different sizes
    },
    {
		  src: '/favicon/greenbook-32x32.png',    // Path of the favicon, relative to the /public directory
		  theme: 'light',      // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		  sizes: '32x32',      // (Optional) Size of the favicon, set only if you have favicons of different sizes
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/Zes-Z", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/portrait.jpg", // 头像 Relative to the /src directory. Relative to the /public directory if it starts with '/'  
	name: "Zes",
  bio: "Ephemeral life, love forever.　　別の道は別の花。",  // 头像下方的个签
  links: [
    {
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Zes-Z",
		},
    {
      name: "Weixin",
      icon: "fa6-brands:weixin",
      // url: "/images/WeixinID:Zes234-INTJ.jpg",
      url: "/QRcode-zes.jpg",
    },
		{
			name: "Email",
			icon: "fa6-regular:envelope",
			url: "mailto:zzs234@yeah.net",
    },
    {
       name: "Photos",
       icon: "fa6-solid:camera",
       url: "https://www.alipan.com/s/rnJsLF2KTtt",  // 提取码: 1a1m
       // url: /images/wechat-qrcode.jpg
    },
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,  // 文章版权协议
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark", // 代码高亮主题配置
};



// 主页单页显示文章数量､黑白模式､横幅长宽等,在"D:\fyblog\src\constants\constants.ts"中自定义;
// about页面信息,在"D:\fyblog\src\content\spec\about.md"中修改;
// 侧边栏的"分类"和"标签"折叠阈值,在"D:\fyblog\src\components\widget\Categories|Tags.astro"中设置;