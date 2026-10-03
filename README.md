# Zest

一个清新的三语 Astro 博客主题。One theme, three languages, two color moods.

- **三语切换** — English / 中文 / 日本語,URL 前缀路由(`/en` `/zh` `/ja`),UI 文案与正文同步切换
- **文件夹式多语内容** — 每篇文章一个文件夹,内含各语种 `.md` 与文章图片,便于管理
- **明亮 / 暗黑双模式** — localStorage 持久化,无闪烁加载
- **正则搜索** — 顶部导航搜索按钮弹出面板,支持普通/正则两种模式、命中高亮与键盘导航
- **archive 归档页** — 顶部**分类胶囊(单选,含每类篇数)**;未筛选时按年份倒序的时间线,选中某个分类后切换为瀑布流(每行 1–3 个文章块,2:3 / 3:2 / 1:1 三种图片比例,角落显示文章名与日期)
- **菜单页** — 与归档同构:固定分类胶囊(来源 `site.config.ts` 的 `recipeCategories`)+ 瀑布流卡片
- **Home 首页** — 全屏图柔和淡入淡出 → 置顶文章块(主图展示)
- **about 页** — 独立的海洋蓝个人页(`SelfLayout`),含首页 / 关于 / 技能 / 作品 / 留言墙分节与锚点导航
- **友链页** — 全屏淡入图 + 好友块(每行 2–3 列,左图右两行文字)
- **RSS 订阅** — 三语各生成 RSS 2.0 订阅源,顶栏链接块提供 RSS 入口 + `<head>` 自动发现
- **顶栏链接块** — 顶栏最左侧带「链接」文字的按钮,展开后竖向排出一列彩色图标,收纳 GitHub / 邮箱 / 云盘 / 微信 / RSS(条目可在 `site.config.ts` 自由增改)
- **文章能力** — Markdown + GFM、数学公式(KaTeX)、图片、视频、Shiki 代码高亮;支持 callout 提示框、定义列表、任务清单、脚注
- **阅读体验** — 文章页顶部细进度条 + 右侧吸顶大纲(TOC),随滚动高亮
- **全局** — 所有页面保留比例侧边留白;所有板块化对象统一圆角

## 快速开始

```bash
pnpm install        # 安装依赖
pnpm dev            # 开发服务器 http://localhost:4321
pnpm build          # astro check + astro build
pnpm preview        # 预览生产构建
pnpm newpost        # 交互式新建文章(自动盖章 pubDate)
```

要求 Node >= 22.12、pnpm(项目使用 pnpm 11;`pnpm-workspace.yaml` 中已放行 esbuild/sharp 构建脚本)。

## 部署到 GitHub Pages

项目自带自动部署工作流 `.github/workflows/deploy.yml`:push 到 `main`(或手动触发)即构建并发布到 Pages。

使用前:

1. 仓库 **Settings → Pages → Source** 选择 **GitHub Actions**;
2. **base 自动推导**:构建时会根据仓库自动加子路径——项目页(`user.github.io/<repo>`)自动用 `/<repo>/`,用户页(`user.github.io`)用 `/`;也可用环境变量 `ASTRO_BASE` 手动指定;
3. 建议把 `src/site.config.ts` 的 **`siteUrl`** 改成你的真实站点地址(RSS 与规范链接会用到,如 `https://user.github.io/<repo>/`)。

## 站点配置

所有站点级自定义集中在 `src/site.config.ts`:站点名称/副标题/描述(三语)、favicon、默认语言、全屏图、置顶数量等。

### 顶部导航

导航栏由 `site.config.ts` 的 `nav` 数组驱动,可自由增改条目(内置页面用函数生成各语言路径,外链直接写 URL):

```ts
nav: [
  { label: { cn: '首页', eng: 'Home', jap: 'ホーム' }, href: (lang) => `/${lang}`, external: false, icon: 'home' },
  { label: { cn: '归档', eng: 'Archive', jap: 'アーカイブ' }, href: (lang) => `/${lang}/archive`, icon: 'archive' },
  // 带 children 的条目 = 一个"可向下展开的块",点击在顶栏下方弹出面板
  {
    label: { cn: '生活', eng: 'Life', jap: '暮らし' },
    icon: 'photos',
    children: [
      { label: { cn: '相册' }, href: (lang) => `/${lang}/photos`, icon: 'photos' },
      { label: { cn: '菜单' }, href: (lang) => `/${lang}/recipes`, icon: 'recipe' },
    ],
  },
],
```

- `href` 可以是字符串,也可以是接收当前语言的函数;`external: true` 会在新标签页打开;
- `icon` 取值见下方「图标」一节;
- **分组条目**(带 `children`)自身不带 `href`——点击它只负责开合面板;
  当子项之一正好是当前页时,父项也会高亮。

两个展开面板**共用同一套代码与样式**:触发按钮都是 `.icon-btn--label`(38px 胶囊、图标 + 文字),
面板都是 `.nav-submenu.nav-submenu--icons`(竖向、图标-only、宽度自适应、水平居中于触发块)。

- **不常驻**:只有点击才展开;页面一滚动(超过 `20px`)就自动收回;
  另外点击别处、按 `Esc`、点击面板内链接也会收回;
- 触发按钮上的文字滚动后会像导航项一样收起,悬停胶囊时再滑出;窄屏(≤700px)只留图标。

### 搜索右侧的链接块

原来位于页脚的图标栏已移除,其条目由 `site.config.ts` 的 `menu` 数组驱动,
在顶栏右侧渲染成一个带「链接」文字的按钮,点开向下弹出面板:

顶栏控件顺序为:**「链接」→ 语言 → 搜索 → 主题**。

```ts
menu: [
  { icon: 'github', href: 'https://github.com/you', label: { cn: 'GitHub' } },
  { icon: 'email', href: 'mailto:you@example.com', label: { cn: '邮箱' } },
  { icon: 'rss', href: (lang) => `/${lang}/rss.xml`, label: { cn: 'RSS' } },
  { icon: 'link', href: 'https://example.com', label: { cn: '任意外链' } },
  // 微信:点击复制微信号,不做跳转
  { icon: 'wechat', wechatId: 'your-wechat-id', href: '#', label: { cn: '微信' } },
],
```

这个面板是**图标-only** 的:展开后竖向排出一列圆形图标按钮,不显示文字。
`label` 仍然必须写——它只用于无障碍(`aria-label` / 读屏),不会显示在页面上。

`icon` 可选 `github` / `email` / `cloud` / `wechat` / `rss` / `link`(link 为通用图标);
`href` 可以是字符串,也可以是接收当前语言的函数。

> 顶栏控件一律不给 `title`(避免出现浏览器悬停提示),可访问名称统一走 `aria-label`。

### 面板背景(与顶栏"同源但不同款")

展开面板沿用主导航的视觉语言,但刻意做出区分,避免看起来像顶栏的复制品:

| | 顶栏胶囊(滚动后) | 展开面板 |
| --- | --- | --- |
| 底色 | `color-mix(--bg 72%, transparent)` | `color-mix(--surface 80%, --bg)`(更实) |
| 模糊 | `blur(12px)` | `blur(14px) saturate(1.35)` |
| 圆角 | `999px`(胶囊) | `var(--radius-lg)`(24px) |

要调整就改 `src/components/Header.astro` 里 `.nav-submenu` 的这几项。

## 内容格式

### 文章(`src/content/posts/<slug>/`)

**每篇文章一个文件夹**,里面是各语种的 `.md` 文件与文章图片:

```text
src/content/posts/
└─ hello-zest/
   ├─ zh.md      ← 中文
   ├─ en.md      ← English
   ├─ ja.md      ← 日本語
   ├─ cover.svg  ← 文章封面(及正文用到的图片)
   └─ ...
```

每个语言文件的 YAML 导言区:

```markdown
---
title: 你好,Zest        # 本语言标题
category: 技术          # 必填,且只能有一个(三个文件保持一致)
tag: [Astro, 主题]      # 可为空,支持多个
description: 文章简介……
pubDate: 2026-08-21     # 可省略:自动读取文件创建时间(如 2026/8/21)
postImage: ./cover.svg  # 封面图,相对路径指向本文件夹
homepined: true         # 首页置顶区以主图展示
pinedOrder: 1           # 置顶顺序(越小越靠前)
draft: false
---
(正文 Markdown……)
```

说明:

- 文件名即语言:`zh.md` / `en.md` / `ja.md`
- `category`、`tag`、`postImage`、`homepined`、`pinedOrder`、`draft` 在三个语言文件中保持一致
- **数学公式**:行内 `$e^{i\pi}+1=0$`,独立公式 `$$\int …$$`(KaTeX 渲染)
- **图片**:放在文章文件夹内,正文写相对路径 `![alt](./img.png)`,构建时自动解析并优化;支持 **jpg / jpeg / png**(含大写扩展名,如 `IMG_001.JPG`)、webp、gif、svg、avif;也可用 `/images/...` 绝对路径或外链
- **视频**:正文直接写 `<video controls src="...">`,也支持 iframe 嵌入
- 没有 `pubDate` 时,自动读取文件创建时间
- `pnpm newpost` 会按此结构一次生成文件夹与三个语言文件

#### 正文支持语法

除标准 Markdown + GFM(表格 / 任务清单 / 脚注 / 删除线)外,还支持:

- **Callout 提示框**(Obsidian 风格,标题用加粗首行):
  ```markdown
  :::tip
  **技巧标题**
  提示内容……
  :::
  ```
  类型:`:::note`(蓝)、`:::tip`(绿)、`:::important`(紫)、`:::warning`(琥珀)、`:::caution`(红)。
- **定义列表**:
  ```markdown
  术语
  : 定义一
  : 定义二
  ```
- **任务清单**:`- [ ] 待办` / `- [x] 已完成`
- **脚注**:`文字[^1]` + 文末 `[^1]: 说明`
- **标题会自动生成锚点 id**,供右侧大纲跳转。
- **代码块增强**:顶栏左侧显示语言标签,支持 `title="文件名"` 显示文件名,右上角复制按钮:
  ````markdown
  ```python title="main.py"
  # 代码……
  ```
  ````
- **图片**:`![alt](./图片.jpg)` 相对路径指向文章文件夹内与 `.md` 同级别的图片(支持 jpg/png/webp 等与中文文件名),构建时自动解析优化;绝对路径 `/images/...` 或外链也可。

### 阅读体验(文章页)

- **顶部进度条**:阅读时顶部有一条细进度条,随滚动位置填充;
- **右侧大纲(TOC)**:文章 h2–h4 标题生成吸顶大纲,随滚动高亮当前章节;窄屏(<1024px)自动隐藏。

### 独立页面(`src/content/pages/<name>/`)

供 `/{lang}/welcome-site` 这类"内容驱动"的静态页使用:一个页面一个文件夹,内含
`zh.md` / `en.md` / `ja.md`,由 `getEntry('pages', '<lang>/<name>')` 读取后渲染 Markdown。

目前仓库里只有 `welcome-site`(首页左下角欢迎块指向的介绍页)。
`about` 页**不**走这套机制——它是 `src/pages/[lang]/about.astro` 里的独立个人页,
使用 `SelfLayout` + `self.css`,与内容集合无关。

### 友链数据(`src/site.config.ts` 的 `friends`)

友链数据**不在** `src/content/` 下,而是与其它站点配置一起放在 `src/site.config.ts` 的 `friends` 数组里:

```json
[
  {
    "name": { "cn": "博主", "eng": "Bloggers", "jap": "ブロガー" },
    "desc": { "cn": "我常读的博客。" },
    "items": [
      { "name": { "cn": "某博客" }, "desc": { "cn": "描述" }, "avatar": "https://…", "link": "https://…" }
    ]
  }
]
```

## 语言与主题切换

- **语言**:右上角地球图标按钮,**单击轮换** zh → en → ja → zh,直接跳转到当前页面的对应语言版本(无需弹列表)
- **主题**:太阳/月亮按钮,**单击切换** 明亮 ⇄ 暗黑;未手动选择时跟随系统偏好,选择持久化于 localStorage,并在 `BaseLayout` 中以内联脚本防闪屏

## 搜索

导航栏 🔍 按钮打开搜索面板:

- 默认**普通匹配**(子串、不区分大小写)
- 点击 `.*` 切换**正则模式**,按正则表达式实时匹配(非法表达式会提示)
- 命中片段高亮,↑↓ 选择、回车跳转、Esc 关闭
- 索引按语言生成于 `/zh/search-index.json` 等,面板按当前语言懒加载

## RSS 订阅

- 每种语言一个订阅源:`/en/rss.xml`、`/zh/rss.xml`、`/ja/rss.xml`(根 `/rss.xml` 重定向到默认语言)
- 每页 `<head>` 带 RSS 自动发现标签,顶栏链接块提供 RSS 入口
- 频道与条目使用当前语言的文章标题/简介,`pubDate` 为 RFC 822 格式

## archive 交互

- 顶部:分类**胶囊单选**(每组含篇数),选中后只显示该分类;点"全部"回到时间线
- 右侧:无筛选时按年份倒序时间线;有筛选时切换为瀑布流(宽屏 3 列 / 中屏 2 列 / 小屏 1 列)
- 瀑布流图片比例取自封面原图真实宽高比,映射到最近的 3:2 / 2:3 / 1:1
- 分类胶囊是真实链接(`/zh/archive?category=xxx`),可直接分享/收藏带筛选的地址

## 页面路由

| 路径 | 说明 |
| --- | --- |
| `/` | 直接渲染默认语言首页(不做跳转中转) |
| `/{lang}` | 首页(全屏淡入图 + 置顶文章) |
| `/{lang}/archive` | 归档(时间线 / 分类瀑布流) |
| `/{lang}/about` | 关于(独立海洋蓝个人页) |
| `/{lang}/links` | 友链 |
| `/{lang}/photos` | 相册(三个可切换板块:瀑布流墙 / 作品集 / 待定) |
| `/{lang}/photos/{slug}` | 单个作品集(说明 + 内部照片) |
| `/{lang}/recipes` | 菜单(固定分类 + 瀑布流) |
| `/{lang}/recipes/{slug}` | 单个菜谱 |
| `/{lang}/posts/{slug}` | 文章页(`{slug}` 支持多级,如 `电路学笔记/一、基本电路观念`) |
| `/{lang}/unknown` | 占位页 |
| `/{lang}/welcome-site` | 首页左下角欢迎块指向的介绍页 |
| `/{lang}/rss.xml` | RSS 2.0 订阅源(当前语言) |
| `/{lang}/search-index.json` | 搜索索引(构建产物) |
| `/rss.xml` | 301 到默认语言的订阅源 |

## 相册页

相册是独立页,顶部三个**可切换板块**(仿归档的"类别"切换):

1. **瀑布流展示墙** — `src/content/photos/*` 里的图片,瀑布流铺开;
2. **作品集** — `src/content/portfolios/<slug>/` 一个作品集一个文件夹:
   - `zh.md` / `en.md` / `ja.md`(标题 + 说明正文)
   - `main.svg`(封面)+ 若干编号照片,页面瀑布流展示,点进去看说明和内部照片;
3. **待定** — 占位板块。

- **灯箱**:相册墙与作品集详情里的照片点击可全屏查看,支持 ←/→ 切换、键盘方向键、Esc 关闭;
- **黑白悬停彩色**:`site.config.ts` 的 `photosGrayscaleHover`(`true` 默认黑白悬停彩色,`false` 关闭)控制。

> 相册与菜谱的图片**按原图输出**(不做降采样/转码),以保证画质;代价是首屏流量较大,
> 因此代码里对首屏几张用 `loading="eager"`、其余 `lazy`,并配合 `content-visibility`
> 跳过屏幕外图片的渲染。若要真正压缩这些图片,需要引入 `getImage` 生成多档尺寸。

## 技术栈

Astro 7 · TypeScript · Tailwind CSS 4 · @astrojs/rss · unified(remark-gfm / remark-math / rehype-katex / rehype-raw / @shikijs/rehype)· 零前端框架(原生 JS 交互)。

结构上参考了 astro-astrofly(语言前缀路由与友链数据)、astro-theme-misthaven(主题切换与翻译表)、astro-tone(置顶网格与搜索面板)等开源模板的实现思路。

## 图标

图标统一放在 `src/icons/`(每个图标一个 `.svg`),由 `src/icons/index.ts` 通过
`import.meta.glob` 以 `?raw` 方式读成字符串并内联进 HTML(不产生额外请求)。

两套图标,职责不同:

| 目录 | 用途 | 着色方式 |
| --- | --- | --- |
| `src/icons/color/*.svg` | **顶栏在用的图标**(导航项、「链接」按钮、两个展开面板) | 品牌彩色(硬编码 fill) |
| `src/icons/*.svg` | 兜底单色集 | `currentColor` |

- 顶栏取图标统一走 `panelIcon(name)` = `color/<name>.svg` ?? `<name>.svg`;
- 所以换彩色图标只需在 `src/icons/color/` 放一个同名 `.svg`,**不用改配置或组件**;
- 某个图标想临时退回单色,把 `color/<name>.svg` 删掉或改名即可(会自动落到单色集);
- 新增图标:在 `src/icons/` 放 `<name>.svg`,然后在 `site.config.ts` 里写 `icon: '<name>'`;
- `public/icon/neteasecloudmusic.svg` 是例外:音乐挂件通过 `<img src>` 引用它,保留在 `public/` 下。

### 顶栏图标配色

| 导航项 | 颜色 | | 「链接」面板 | 颜色 |
| --- | --- | --- | --- | --- |
| 首页 home | `#5FA8F5` / `#A8D8FC` | | 链接 link | `#4C6FE0` / `#7E9BF5` |
| 归档 archive | `#F0A93B` / `#FFC96B` | | GitHub | `#181717` (白圆底) |
| 生活 photos | `#6FB2F0` / `#A8D4FB` | | 邮箱 | `#2F6BED` |
| 生活 › 菜单 recipe | `#D9592B` / `#F5A15C` | | 云盘 | `#FF6A00` |
| 友链 friends | `#2FA36B` / `#7BCB9E` | | 微信 | `#07C160` |
| 未知 unknown | `#8E86E8` | | RSS | `#F26522` |
| 语言 globe | `#79AEF5` / `#C6E0FB` | | | |

> 搜索 / 主题 / 汉堡 这几个**功能性按钮**仍是 `currentColor` 单色——
> 跟随文字色才能在大图 Hero 上正确变白。语言按钮已按要求改为彩色;
> 若在浅色壁纸上觉得对比度不足,删掉 `src/icons/color/globe.svg` 即可回到单色。

### 顶栏间距

所有间距收敛到同一套值(改 `src/components/Header.astro` 即可全局生效):

| 位置 | 值 | 选择器 |
| --- | --- | --- |
| 图标 ↔ 文字 | `5px` | `.nav-link`、`.icon-btn--label` 的 `gap` |
| 导航项之间 | `4px` | `.site-nav ul` 的 `gap` |
| 右侧动作按钮之间 | `4px` | `.header-actions` 的 `gap` |
| 导航区 ↔ 动作区 | `8px` | `.header-inner` 的 `gap` |

> 文字"收起 / 滑出"的动画走 `margin-left`,所以这些规则里 `margin-left` 一律为 `0`
> (静止间距只由 `gap` 提供),否则会出现 `gap + margin` 的双重间距。

### 浏览器翻译提示

语言用 URL 前缀路由,Chrome 每次切到另一种语言都会判定为"外语页"并弹翻译提示。
`BaseLayout` / `SelfLayout` 的 `<head>` 里已加:

```html
<meta name="google" content="notranslate" />
```

它告诉浏览器"本页已是正确语言、不需要机器翻译",从根源上抑制该提示。
(站点本身不需要被机器翻译——三语内容都是人手写的。)

## 项目结构要点

- `src/site.config.ts` — 站点级配置(nav / menu / hero 图 / 友链 / 主题背景色 / 菜单分类 …)
- `src/loaders/zest.ts` — 自定义内容 loader:文件夹多语结构 → `id = <lang>/<slug>`,自动判定子文档与 `pubDate`
- `src/utils/markdown.ts` — unified 渲染管线(指令、代码块工具栏、KaTeX、Shiki 双主题、TOC 收集)
- `src/scripts/masonry.ts` — 归档/菜单/相册共用的密铺瀑布流(最短列绝对定位)
- `cli/newpost.ts` — `pnpm newpost` / `newport` / `newreci` 交互式新建内容

## 关于 `pubDate` 的注意事项

导言区没有写 `pubDate` 时,loader 会回落到**文件系统时间**(`birthtime`,不可用时取 `ctime`):

```ts
const info = await stat(filePath);
pubDate = info.birthtime || info.ctime;
```

这套兜底只在"文件本来就在本机创建"时符合预期。`git clone` 或 CI 检出后,
`birthtime` 会变成检出时间,于是所有未写 `pubDate` 的文章都会显示同一个日期,
排序也会一起失准。**建议每篇文章都显式写上 `pubDate`**(`pnpm newpost` 已自动盖章)。
