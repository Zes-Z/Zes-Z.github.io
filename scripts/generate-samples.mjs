/**
 * Generates the sample content for the Zest theme.
 * Run with: node scripts/generate-samples.mjs
 *
 * Layout — one folder per post:
 *   src/content/posts/<slug>/{en,zh,ja}.md + cover.svg (+ other images)
 *   src/content/pages/<name>/{en,zh,ja}.md
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const out = (relPath, content) => {
  const target = join(root, relPath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, 'utf8');
  console.log('wrote', relPath);
};

/** Build a plain Markdown content file: YAML frontmatter + body. */
function mdFile(frontmatter, body) {
  const fm = Object.entries(frontmatter)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      if (Array.isArray(value)) return `${key}: [${value.join(', ')}]`;
      if (value === true) return `${key}: true`;
      if (value === false) return `${key}: false`;
      if (typeof value === 'number') return `${key}: ${value}`;
      return `${key}: ${JSON.stringify(value)}`;
    })
    .join('\n');
  return `---\n${fm}\n---\n${body.trim()}\n`;
}

/** Write one post: a folder with en/zh/ja .md files + a cover image. */
function post(slug, meta, localized) {
  out(`src/content/posts/${slug}/cover.svg`, cover(...meta.cover));
  for (const [lang, l] of Object.entries(localized)) {
    out(
      `src/content/posts/${slug}/${lang}.md`,
      mdFile(
        {
          title: l.title,
          category: meta.category,
          tag: meta.tag,
          description: l.desc,
          pubDate: meta.pubDate,
          postImage: './cover.svg',
          homepined: meta.homepined,
          pinedOrder: meta.pinedOrder,
          draft: false,
        },
        l.body
      )
    );
  }
}

/** Write a standalone page (welcome/about/resume). */
function page(name, localized) {
  for (const [lang, l] of Object.entries(localized)) {
    out(
      `src/content/pages/${name}/${lang}.md`,
      mdFile({ title: l.title, description: l.desc }, l.body)
    );
  }
}

/* ------------------------------------------------------------------ */
/* Public assets                                                       */
/* ------------------------------------------------------------------ */

const svg = (w, h, defs) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}</svg>\n`;

const gradientScene = (from, to, accent, circles) =>
  svg(
    1920,
    1080,
    `<defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#g)"/>
  ${circles.map(([cx, cy, r, fill, opacity]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${opacity}"/>`).join('')}
  <circle cx="1560" cy="220" r="180" fill="${accent}" opacity="0.16"/>
  <circle cx="320" cy="860" r="260" fill="${accent}" opacity="0.10"/>`
  );

out('public/images/hero-1.svg', gradientScene('#a8c8f0', '#e8dff5', '#2f6bed', [[960, 540, 420, '#ffffff', 0.22], [700, 300, 200, '#ffffff', 0.16]]));
out('public/images/hero-2.svg', gradientScene('#b8e0d2', '#e6e9f0', '#3f7d4e', [[500, 600, 360, '#ffffff', 0.24], [1300, 700, 240, '#ffffff', 0.14]]));
out('public/images/hero-3.svg', gradientScene('#f3d9b8', '#e9d8ea', '#b45309', [[1100, 400, 300, '#ffffff', 0.22], [420, 760, 220, '#ffffff', 0.15]]));
out('public/images/avatar-fallback.svg', svg(200, 200, `<rect width="200" height="200" rx="40" fill="#c9d4e8"/><text x="100" y="120" font-family="sans-serif" font-size="60" fill="#5c6b85" text-anchor="middle">?</text>`));
out('public/favicon.svg', svg(64, 64, `<rect width="64" height="64" rx="14" fill="#2f6bed"/><text x="32" y="44" font-family="sans-serif" font-size="38" font-weight="800" fill="#ffffff" text-anchor="middle">z</text>`));

const cover = (from, to, label) =>
  svg(
    960,
    720,
    `<defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="960" height="720" fill="url(#g)"/>
  <circle cx="760" cy="180" r="150" fill="#ffffff" opacity="0.22"/>
  <circle cx="200" cy="600" r="190" fill="#ffffff" opacity="0.14"/>
  <text x="480" y="380" font-family="sans-serif" font-size="64" font-weight="700" fill="#ffffff" opacity="0.9" text-anchor="middle">${label}</text>`
  );

// cover used by the video poster demo (absolute public URL)
out('public/images/posts/cover-2.svg', cover('#4f9d7c', '#7cc0a8', 'Markdown'));

/* ------------------------------------------------------------------ */
/* Posts                                                               */
/* ------------------------------------------------------------------ */

const MATH = String.raw`$$\int_{-\infty}^{+\infty} e^{-x^2}\,dx = \sqrt{\pi}$$`;

post(
  'hello-zest',
  {
    category: '技术',
    tag: ['Astro', '主题', '博客'],
    pubDate: '2026-08-21',
    homepined: true,
    pinedOrder: 1,
    cover: ['#5b8def', '#9d7ff0', 'Zest'],
  },
  {
    zh: {
      title: '你好,Zest',
      desc: 'Zest 主题的第一篇文章,带你快速了解多语言多文件的内容组织方式。',
      body: `欢迎来到 **Zest**,一个清新的三语 Astro 博客主题。

每篇文章是一个**文件夹**(\`src/content/posts/<slug>/\`),里面放着各语种的 \`.md\` 文件与文章图片:

\`\`\`text
hello-zest/
├─ zh.md      ← 中文
├─ en.md      ← English
├─ ja.md      ← 日本語
└─ cover.svg  ← 封面(以及正文用到的图片)
\`\`\`

## 数学公式

行内公式开箱即用:$e^{i\\pi} + 1 = 0$。

独立公式自动居中:

${MATH}

## 文件夹内图片

图片放在文章文件夹里,正文直接写相对路径:

![内联示例](./inline-1.svg)

> 一个文件夹,三种语言,图片都在一起。`,
    },
    en: {
      title: 'Hello, Zest',
      desc: 'The first post of the Zest theme, a quick tour of its folder-based multilingual layout.',
      body: `Welcome to **Zest**, a fresh trilingual Astro blog theme.

Every post is a **folder** (\`src/content/posts/<slug>/\`) that keeps the per-language \`.md\` files and the article images together:

\`\`\`text
hello-zest/
├─ zh.md      ← 中文
├─ en.md      ← English
├─ ja.md      ← 日本語
└─ cover.svg  ← cover (and any image used in the article)
\`\`\`

## Math support

Inline math works out of the box: $e^{i\\pi} + 1 = 0$.

Display math is centered:

${MATH}

## Images inside the post folder

Keep images in the post folder and reference them relatively:

![Inline demo](./inline-1.svg)

> One folder, three languages, images included.`,
    },
    ja: {
      title: 'こんにちは、Zest',
      desc: 'Zest テーマの最初の記事。フォルダ単位の多言語構成を紹介します。',
      body: `**Zest** へようこそ。爽やかな三言語 Astro ブログテーマです。

各記事は一つの**フォルダ**(\`src/content/posts/<slug>/\`)で、言語別の \`.md\` ファイルと記事の画像をまとめて管理します:

\`\`\`text
hello-zest/
├─ zh.md      ← 中文
├─ en.md      ← English
├─ ja.md      ← 日本語
└─ cover.svg  ← カバー(記事で使う画像もここに)
\`\`\`

## 数式

インライン数式もそのまま使えます:$e^{i\\pi} + 1 = 0$。

ディスプレイ数式は中央揃えです:

${MATH}

## フォルダ内の画像

画像は記事フォルダに置き、本文では相対パスで参照します:

![インライン例](./inline-1.svg)

> 一つのフォルダ、三つの言語、画像も一緒に。`,
    },
  }
);

out('src/content/posts/hello-zest/inline-1.svg', svg(800, 300, `<rect width="800" height="300" rx="18" fill="#e3ecfa"/><text x="400" y="150" font-family="monospace" font-size="28" fill="#2f6bed" text-anchor="middle">relative image → /src/content/posts/hello-zest/inline-1.svg</text>`));

post(
  'markdown-everything',
  {
    category: '技术',
    tag: ['Markdown', '演示'],
    pubDate: '2026-06-14',
    homepined: true,
    pinedOrder: 2,
    cover: ['#4f9d7c', '#7cc0a8', 'Markdown'],
  },
  {
    zh: {
      title: 'Markdown 全家桶',
      desc: '表格、引用、视频与代码——正文支持的全部语法演示。',
      body: `## 表格

| 功能 | 状态 |
| --- | --- |
| 数学公式(KaTeX) | ✅ |
| 图片 | ✅ |
| 视频 | ✅ |
| 代码高亮 | ✅ |

## 引用

> Zest 让每篇文章一个文件夹,同时完整支持三语。

## 视频

正文中直接使用 HTML 标签:

<video controls poster="/images/posts/cover-2.svg" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"></video>

## 图片

封面图片就在本文件夹里,直接相对引用:

![封面](./cover.svg)

## 行内代码

使用 \`pnpm newpost\` 新建文章,自动生成文件夹与三个语种文件。`,
    },
    en: {
      title: 'Everything Markdown',
      desc: 'Tables, blockquotes, videos and code — everything a post body supports.',
      body: `## Tables

| Feature | Status |
| --- | --- |
| Math (KaTeX) | ✅ |
| Images | ✅ |
| Video | ✅ |
| Code highlighting | ✅ |

## Blockquote

> Zest keeps every post in one folder while staying fully trilingual.

## Video

Videos are plain HTML inside the body:

<video controls poster="/images/posts/cover-2.svg" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"></video>

## Images

The cover lives in this very folder — reference it relatively:

![Cover](./cover.svg)

## Inline code

Use \`pnpm newpost\` to create a new post folder with all three language files.`,
    },
    ja: {
      title: 'Markdown のすべて',
      desc: '表・引用・動画・コード——本文がサポートする構文のデモ。',
      body: `## 表

| 機能 | 状態 |
| --- | --- |
| 数式(KaTeX) | ✅ |
| 画像 | ✅ |
| 動画 | ✅ |
| コードハイライト | ✅ |

## 引用

> Zest は各記事を一つのフォルダに保ちながら、完全な三言語対応を実現します。

## 動画

本文には HTML タグをそのまま書けます:

<video controls poster="/images/posts/cover-2.svg" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"></video>

## 画像

カバーはこのフォルダ内にあります——相対パスで参照できます:

![カバー](./cover.svg)

## インラインコード

\`pnpm newpost\` で 3 言語ファイル入りの記事フォルダを新規作成できます。`,
    },
  }
);

post(
  'first-photo-walk',
  {
    category: '摄影',
    tag: ['摄影', '城市'],
    pubDate: '2026-03-02',
    homepined: true,
    pinedOrder: 3,
    cover: ['#d9965f', '#e8b98a', 'Photo'],
  },
  {
    zh: {
      title: '第一次扫街',
      desc: '带着相机慢慢走,记下镜头留住的东西。',
      body: `傍晚的光变化得很快。同一条街走了三遍,每一遍都不一样。

![街景一](./cover.svg)

## 笔记

- 黄金时刻拍摄,阴影更柔和。
- 保持地平线平直。
- 少带器材,多走路。

> 最好的相机,是你随身带着的那一台。`,
    },
    en: {
      title: 'First Photo Walk',
      desc: 'A slow walk with a camera, and what the lens kept.',
      body: `Light changes fast in the evening. I walked the same street three times and every pass looked different.

![Street one](./cover.svg)

## Notes

- Shoot at golden hour for soft shadows.
- Keep the horizon straight.
- Less gear, more walking.

> The best camera is the one you carry.`,
    },
    ja: {
      title: '初めてのフォトウォーク',
      desc: 'カメラと歩いた午後、レンズが残したもの。',
      body: `夕方の光はあっという間に変わる。同じ道を三度歩いたが、一度として同じ景色はなかった。

![街角その一](./cover.svg)

## メモ

- ゴールデンアワーは影が柔らかい。
- 水平線はまっすぐに。
- 機材は少なく、歩く距離は長く。

> 最高のカメラは、持ち歩いているカメラ。`,
    },
  }
);

post(
  'reading-notes-2024',
  {
    category: '生活',
    tag: ['阅读', '笔记'],
    pubDate: '2024-12-30',
    homepined: false,
    pinedOrder: 0,
    cover: ['#7a86b8', '#b8bddc', 'Reading'],
  },
  {
    zh: {
      title: '2024 读书笔记',
      desc: '十本书,三本留下印象,每本带走一个收获。',
      body: `年末整理这一年读过、并留下来的书。

1. **《深度工作》**——守护大段不被打断的时间。
2. **《设计心理学》**——好的设计少道歉。
3. **《走路的历史》**——走路就是时速三公里的思考。

> 读书,是借来别人多年的思考。`,
    },
    en: {
      title: 'Reading Notes 2024',
      desc: 'Ten books, three that stayed with me, and one lesson from each.',
      body: `A year-end list of what I read and what remained.

1. **Deep Work** — protect long, uninterrupted hours.
2. **The Design of Everyday Things** — good design apologises less.
3. **A Philosophy of Walking** — walking is thinking at three kilometres per hour.

> Reading is borrowing someone else's years of thinking.`,
    },
    ja: {
      title: '2024 年の読書メモ',
      desc: '10 冊の本、心に残った 3 冊と、それぞれの学び。',
      body: `今年読んで、心に残った本の記録。

1. **『Deep Work』**——まとまった時間を守る。
2. **『誰のためのデザイン?』**——よいデザインは謝らない。
3. **『歩く哲学』**——歩くことは時速 3 キロの思考。

> 読書とは、誰かの長年の思考を借りること。`,
    },
  }
);

post(
  'coffee-brewing',
  {
    category: '生活',
    tag: ['咖啡', '手冲'],
    pubDate: undefined, // no pubDate → loader reads file creation time
    homepined: false,
    pinedOrder: 0,
    cover: ['#b08050', '#d9b78f', 'Coffee'],
  },
  {
    zh: {
      title: '手冲咖啡笔记',
      desc: '水温、研磨度与耐心——一份小小的冲煮记录。',
      body: `这篇文章的导言区没有写 \`pubDate\`——Zest 自动读取了文件创建时间。

| 变量 | 数值 |
| --- | --- |
| 粉水比 | 1:15 |
| 水温 | 92 °C |
| 研磨度 | 中 |
| 时间 | 2:30 |

第一次闷蒸,是早晨最响的一段。`,
    },
    en: {
      title: 'Coffee Brewing Notes',
      desc: 'Water temperature, grind size and patience — a small brewing log.',
      body: `No \`pubDate\` in this file's frontmatter — Zest read the file creation time automatically.

| Variable | Value |
| --- | --- |
| Ratio | 1:15 |
| Water | 92 °C |
| Grind | medium |
| Time | 2:30 |

The first bloom is the loudest part of the morning.`,
    },
    ja: {
      title: 'ハンドドリップのメモ',
      desc: '湯温・挽き目・忍耐——小さな抽出ログ。',
      body: `この記事のフロントマターに \`pubDate\` はありません——Zest がファイルの作成日時を自動的に読み取りました。

| 項目 | 値 |
| --- | --- |
| 比率 | 1:15 |
| 湯温 | 92 °C |
| 挽き目 | 中 |
| 時間 | 2:30 |

最初の蒸らしは、朝でいちばん静かでにぎやかな瞬間。`,
    },
  }
);

post(
  'astro-theme-notes',
  {
    category: '技术',
    tag: ['Astro', '开发'],
    pubDate: '2024-09-11',
    homepined: false,
    pinedOrder: 0,
    cover: ['#5f7fd9', '#8fa8e8', 'Astro'],
  },
  {
    zh: {
      title: '这个主题的搭建笔记',
      desc: '内容层、unified 渲染管线,以及 Zest 背后的取舍。',
      body: `Zest 建立在三个想法之上:

- **一篇文章一个文件夹。** 各语种 \`.md\` 与图片同处一室,便于管理。
- **构建期渲染。** unified 管线把 Markdown 渲染成 HTML,支持公式、代码与原生 HTML。
- **零框架交互。** 搜索、归档筛选与主题切换都是轻量的原生脚本。

\`\`\`js
// 整条渲染管线,一口气看完
unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeKatex)
  .use(rehypeShiki, { themes: { light: 'github-light', dark: 'github-dark' } })
  .use(rehypeStringify, { allowDangerousHtml: true });
\`\`\``,
    },
    en: {
      title: 'Notes on Building This Theme',
      desc: 'Content layer, unified pipeline, and the decisions behind Zest.',
      body: `Zest is built on three ideas:

- **One folder per post.** Per-language \`.md\` files and images live together.
- **Render at build time.** A unified pipeline turns Markdown into HTML with math, code and raw HTML support.
- **Zero framework islands.** Search, archive filters and theme switching are small vanilla scripts.

\`\`\`js
// the whole pipeline in one breath
unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeKatex)
  .use(rehypeShiki, { themes: { light: 'github-light', dark: 'github-dark' } })
  .use(rehypeStringify, { allowDangerousHtml: true });
\`\`\``,
    },
    ja: {
      title: 'このテーマの制作メモ',
      desc: 'コンテンツレイヤー、unified パイプライン、Zest の設計判断。',
      body: `Zest は三つの考えでできています:

- **記事ごとに一つのフォルダ。** 言語別 \`.md\` と画像をまとめて管理。
- **ビルド時に描画。** unified パイプラインが Markdown を HTML に変換し、数式・コード・生 HTML をサポートします。
- **フレームワーク不要の UI。** 検索・アーカイブ・テーマ切替はすべて軽量なバニラスクリプトです。

\`\`\`js
// パイプライン全体をひと息で
unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeKatex)
  .use(rehypeShiki, { themes: { light: 'github-light', dark: 'github-dark' } })
  .use(rehypeStringify, { allowDangerousHtml: true });
\`\`\``,
    },
  }
);

/* ------------------------------------------------------------------ */
/* Pages: welcome / about / resume                                     */
/* ------------------------------------------------------------------ */

page('welcome', {
  zh: {
    title: '欢迎',
    desc: '',
    body: `你好,欢迎来到 **Zest** 👋

这是首页的单篇欢迎文章块。编辑 \`src/content/pages/welcome/zh.md\` 就能改成你自己的内容。

- **归档**——时间线与瀑布流筛选
- **搜索**——点击 🔍 按钮,支持正则表达式
- **主题**——明亮与暗黑两种模式`,
  },
  en: {
    title: 'Welcome',
    desc: '',
    body: `Hello and welcome to **Zest** 👋

This is the single welcome article block of the home page. Edit \`src/content/pages/welcome/en.md\` to make it yours.

- **Archive** — timeline and masonry filters
- **Search** — press the 🔍 button, regular expressions supported
- **Themes** — light and dark modes`,
  },
  ja: {
    title: 'ようこそ',
    desc: '',
    body: `こんにちは、**Zest** へようこそ 👋

これはホームページの「ようこそ」記事ブロックです。\`src/content/pages/welcome/ja.md\` を編集すれば自分のものにできます。

- **アーカイブ**——タイムラインとギャラリー絞り込み
- **検索**——🔍 ボタン、正規表現対応
- **テーマ**——ライトとダークの 2 モード`,
  },
});

page('about', {
  zh: {
    title: '关于我',
    desc: '',
    body: `我是 **Zest** 的作者——一个喜欢安静工具、长距离散步和整齐笔记的开发者。

本页默认渲染 \`src/content/pages/about/zh.md\`。下方是一个与本页共存的 **简历** 附属页面,点击箭头即可折叠或展开。

- 2016 年开始做 Web 开发
- 用三种语言写作:中文 / English / 日本語
- 住在一个有好咖啡的地方`,
  },
  en: {
    title: 'About me',
    desc: '',
    body: `I'm the author of **Zest** — a developer who likes quiet tools, long walks and well-kept notes.

This page renders \`src/content/pages/about/en.md\` by default. The block below is a **resume** attached to the same page; click the arrow to collapse or expand it.

- Building for the web since 2016
- Writing in three languages: 中文 / English / 日本語
- Based somewhere with good coffee`,
  },
  ja: {
    title: '私について',
    desc: '',
    body: `**Zest** の作者です。静かな道具と長い散歩、きちんとしたメモが好きな開発者です。

このページはデフォルトで \`src/content/pages/about/ja.md\` を表示します。下のブロックはこのページに同居する **履歴書** です。矢印をクリックすると折りたたみ・展開できます。

- 2016 年から Web 開発
- 三言語で執筆:中文 / English / 日本語
- おいしいコーヒーのある街に在住`,
  },
});

page('resume', {
  zh: {
    title: '简历',
    desc: '',
    body: `## 经历

| 时间 | 职位 |
| --- | --- |
| 2022 — 至今 | 独立开发者,开源 |
| 2019 — 2022 | 设计工作室前端工程师 |
| 2016 — 2019 | 自由职业 Web 开发者 |

## 技能

TypeScript、Astro、Node.js、设计系统、写作。

## 联系

见页脚——邮箱与 GitHub 随时欢迎。`,
  },
  en: {
    title: 'Resume',
    desc: '',
    body: `## Experience

| Period | Role |
| --- | --- |
| 2022 — now | Independent developer, open source |
| 2019 — 2022 | Frontend engineer at a design studio |
| 2016 — 2019 | Web developer, freelance |

## Skills

TypeScript, Astro, Node.js, design systems, writing.

## Contact

See the footer — email and GitHub are always open.`,
  },
  ja: {
    title: '履歴書',
    desc: '',
    body: `## 職歴

| 期間 | 役割 |
| --- | --- |
| 2022 — 現在 | 独立開発者・オープンソース |
| 2019 — 2022 | デザインスタジオのフロントエンドエンジニア |
| 2016 — 2019 | フリーランス Web 開発者 |

## スキル

TypeScript、Astro、Node.js、デザインシステム、執筆。

## 連絡先

フッターのメール・GitHub からどうぞ。`,
  },
});

/* ------------------------------------------------------------------ */
/* Friends data                                                        */
/* ------------------------------------------------------------------ */

const friends = [
  {
    name: { eng: 'Bloggers', cn: '博主', jap: 'ブロガー' },
    desc: { eng: 'Blogs I read regularly.', cn: '我常读的博客。', jap: 'よく読むブログ。' },
    items: [
      {
        name: { eng: "Mox's Blog", cn: 'Mox 的博客', jap: 'Mox のブログ' },
        desc: { eng: 'Notes on programming and life.', cn: '编程与生活笔记。', jap: 'プログラミングと生活のメモ。' },
        avatar: 'https://avatars.githubusercontent.com/u/57286919',
        link: 'https://example.com',
      },
      {
        name: { eng: 'Quiet Pages', cn: '安静的书页', jap: '静かなページ' },
        desc: { eng: 'Essays on the calm craft of writing.', cn: '关于安静写作的随笔。', jap: '静かな執筆についての随筆。' },
        avatar: 'https://avatars.githubusercontent.com/u/9919',
        link: 'https://example.com',
      },
      {
        name: { eng: 'Field Notes', cn: '田野笔记', jap: 'フィールドノート' },
        desc: { eng: 'A small harbour of everyday observations.', cn: '日常观察的小小港湾。', jap: '日々の観察の小さな港。' },
        avatar: 'https://avatars.githubusercontent.com/u/1',
        link: 'https://example.com',
      },
    ],
  },
  {
    name: { eng: 'Tools', cn: '工具', jap: 'ツール' },
    desc: { eng: 'Useful tools worth keeping.', cn: '值得收藏的实用工具。', jap: '手元に置きたい便利なツール。' },
    items: [
      {
        name: { eng: 'Astro', cn: 'Astro', jap: 'Astro' },
        desc: { eng: 'The framework this theme is built on.', cn: '本主题所基于的框架。', jap: 'このテーマの土台となったフレームワーク。' },
        avatar: 'https://avatars.githubusercontent.com/u/44914786',
        link: 'https://astro.build',
      },
      {
        name: { eng: 'KaTeX', cn: 'KaTeX', jap: 'KaTeX' },
        desc: { eng: 'Fast math typesetting for the web.', cn: '为 Web 打造的快速数学排版。', jap: 'Web のための高速数式組版。' },
        avatar: 'https://avatars.githubusercontent.com/u/14904029',
        link: 'https://katex.org',
      },
    ],
  },
];

out('src/content/friends.json', JSON.stringify(friends, null, 2) + '\n');

console.log('done.');
