# Zest

一个清新的三语 Astro 博客主题。One theme, three languages, two color moods.

- **三语切换** — English / 中文 / 日本語,URL 前缀路由(`/en` `/zh` `/ja`),UI 文案与正文同步切换
- **文件夹式多语内容** — 每篇文章一个文件夹,内含各语种 `.md` 与文章图片,便于管理
- **明亮 / 暗黑双模式** — localStorage 持久化,无闪烁加载
- **正则搜索** — 顶部导航搜索按钮弹出面板,支持普通/正则两种模式、命中高亮与键盘导航
- **archive 归档页** — 左右 1:3 布局;左侧标签(多选,同时最多 3 个),右侧顶部为分类胶囊(单选),二者交集筛选;右侧默认时间线,筛选后切换为瀑布流(每行 1–3 个文章块,2:3 / 3:2 / 1:1 三种图片比例,角落显示文章名与日期)
- **Home 首页** — 全屏图柔和淡入淡出 → 置顶文章块(主图展示)→ 单篇欢迎文章块
- **about 页** — 默认渲染 `about me.md`,附共存的 resume 子页,箭头点击折叠/展开
- **友链页** — 全屏淡入图 + 好友块(每行 2–3 列,左图右两行文字)
- **RSS 订阅** — 三语各生成 RSS 2.0 订阅源,页脚 RSS 入口 + `<head>` 自动发现
- **页脚(居中)** — 
+ 纯图标栏(条目可在 `site.config.ts` 自由增改)
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
  { label: { cn: '首页', eng: 'Home', jap: 'ホーム' }, href: (lang) => `/${lang}`, external: false },
  { label: { cn: '归档', eng: 'Archive', jap: 'アーカイブ' }, href: (lang) => `/${lang}/archive`, external: false },
  { label: { cn: '菜单', eng: 'Recipe', jap: 'レシピ' }, href: 'https://your.recipe.site/', external: true },
],
```

`href` 可以是字符串,也可以是接收当前语言的函数;`external: true` 会在新标签页打开。

### 页脚图标

页脚图标栏由 `site.config.ts` 的 `footer` 数组驱动,可自由增改条目(仅显示图标,`label` 用于悬停提示与无障碍):

```ts
footer: [
  { icon: 'github', href: 'https://github.com/you', label: { cn: 'GitHub' } },
  { icon: 'email', href: 'mailto:you@example.com', label: { cn: '邮箱' } },
  { icon: 'rss', href: (lang) => `/${lang}/rss.xml`, label: { cn: 'RSS' } },
  { icon: 'link', href: 'https://example.com', label: { cn: '任意外链' } },
],
```

`icon` 可选 `github` / `email` / `rss` / `link`(link 为通用图标);`href` 可以是字符串,也可以是接收当前语言的函数。

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

`welcome`(首页欢迎块)、`about`(about 页默认内容)、`resume`(about 页共存附属页),同为文件夹 + `zh.md` / `en.md` / `ja.md`。

### 友链数据(`src/content/friends.json`)

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
- 每页 `<head>` 带 RSS 自动发现标签,页脚提供 RSS 入口
- 频道与条目使用当前语言的文章标题/简介,`pubDate` 为 RFC 822 格式

## archive 交互

- 右侧顶部:分类**胶囊单选**;左侧:标签**多选**(同时最多 `site.config.ts` 的 `maxSelectedTags`,默认 3 个);二者**交集**过滤,取消全部选中回到时间线
- 右侧:无筛选时按年份倒序时间线;有筛选时切换为瀑布流(宽屏 3 列 / 中屏 2 列 / 小屏 1 列)
- 瀑布流图片比例按文章 id 稳定分配于 2:3 / 3:2 / 1:1

## 页面路由

| 路径 | 说明 |
| --- | --- |
| `/` | 重定向到默认语言首页 |
| `/{lang}` | 首页(全屏淡入图 + 置顶 + 欢迎) |
| `/{lang}/archive` | 归档(时间线 / 瀑布流) |
| `/{lang}/about` | 关于 + resume 折叠 |
| `/{lang}/photos` | 相册(三个可切换板块:瀑布流墙 / 作品集 / 待定) |
| `/{lang}/photos/{slug}` | 单个作品集(说明 + 内部照片) |
| `/{lang}/links` | 友链 |
| `/{lang}/rss.xml` | RSS 2.0 订阅源(当前语言) |
| `/{lang}/posts/{slug}` | 文章页 |
| `/{lang}/search-index.json` | 搜索索引(构建产物) |

## 相册页

相册是独立页,顶部三个**可切换板块**(仿归档的"类别"切换):

1. **瀑布流展示墙** — `src/content/wall/*` 里的图片,瀑布流铺开;
2. **作品集** — `src/content/portfolios/<slug>/` 一个作品集一个文件夹:
   - `zh.md` / `en.md` / `ja.md`(标题 + 说明正文)
   - `main.svg`(封面)+ 若干编号照片,页面瀑布流展示,点进去看说明和内部照片;
3. **待定** — 占位板块。

- **灯箱**:相册墙与作品集详情里的照片点击可全屏查看,支持 ←/→ 切换、键盘方向键、Esc 关闭;
- **黑白悬停彩色**:`site.config.ts` 的 `photosGrayscaleHover`(`true` 默认黑白悬停彩色,`false` 关闭)控制。

示例内容由 `scripts/generate-photos.mjs` 生成,可删除/替换。

## 技术栈

Astro 7 · TypeScript · Tailwind CSS 4 · @astrojs/rss · unified(remark-gfm / remark-math / rehype-katex / rehype-raw / @shikijs/rehype)· 零前端框架(原生 JS 交互)。

结构上参考了 astro-astrofly(语言前缀路由与友链数据)、astro-theme-misthaven(主题切换与翻译表)、astro-tone(置顶网格与搜索面板)等开源模板的实现思路。

## 示例内容

`pnpm run` 之外,示例内容由 `scripts/generate-samples.mjs` 生成(文章文件夹 + 三语文件 + 封面图),可随时删除或替换为自己的文章。
