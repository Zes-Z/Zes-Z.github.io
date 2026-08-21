/**
 * Interactive "new post" CLI for Zest.
 * Run with: pnpm newpost
 *
 * Creates ONE folder per post:
 *
 *   src/content/posts/<slug>/
 *     zh.md        Chinese article
 *     en.md        English article
 *     ja.md        Japanese article
 *     cover.png    ← put the article cover image here and reference it
 *                    as `postImage: ./cover.png`
 *
 * pubDate is stamped automatically from the creation time.
 */
import prompts from 'prompts';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(root, 'src', 'content', 'posts');

function today(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

const response = await prompts(
  [
    {
      type: 'text',
      name: 'slug',
      message: 'Slug (post folder name)',
      initial: (_prev: unknown) => `${today()}-post`,
      validate: (value: string) =>
        /^[a-z0-9][a-z0-9-]*$/.test(value) ? true : 'Lowercase letters, digits and dashes only',
    },
    {
      type: 'text',
      name: 'titleZh',
      message: 'Chinese title (中文标题)',
      validate: (value: string) => (value.trim() ? true : 'Chinese title is required'),
    },
    {
      type: 'text',
      name: 'titleEn',
      message: 'English title',
      initial: (_prev: unknown, values: { titleZh?: string }) => values.titleZh ?? '',
    },
    {
      type: 'text',
      name: 'titleJa',
      message: 'Japanese title (日本語タイトル)',
      initial: (_prev: unknown, values: { titleZh?: string }) => values.titleZh ?? '',
    },
    {
      type: 'text',
      name: 'category',
      message: 'Category (required, exactly one)',
      validate: (value: string) => (value.trim() ? true : 'Category is required'),
    },
    {
      type: 'text',
      name: 'tags',
      message: 'Tags (comma separated, may be empty)',
    },
    {
      type: 'text',
      name: 'description',
      message: 'Description (may be empty)',
    },
    {
      type: 'text',
      name: 'postImage',
      message: 'Cover image (relative to the post folder, e.g. ./cover.png)',
    },
    {
      type: 'toggle',
      name: 'homepined',
      message: 'Pin on the home page?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    },
    {
      type: 'number',
      name: 'pinedOrder',
      message: 'Pinned order (smaller = earlier)',
      initial: 0,
    },
    {
      type: 'toggle',
      name: 'draft',
      message: 'Draft?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    },
  ],
  {
    onCancel: () => {
      console.log('Cancelled.');
      process.exit(0);
    },
  }
) as {
  slug: string;
  titleZh: string;
  titleEn: string;
  titleJa: string;
  category: string;
  tags: string;
  description: string;
  postImage: string;
  homepined: boolean;
  pinedOrder: number;
  draft: boolean;
};

const folder = join(postsDir, response.slug);
if (existsSync(folder)) {
  console.error(`Folder already exists: ${folder}`);
  process.exit(1);
}

const tags = response.tags
  .split(',')
  .map((t) => t.trim())
  .filter(Boolean);

const common = [
  `category: ${JSON.stringify(response.category)}`,
  tags.length ? `tag: [${tags.map((t) => JSON.stringify(t)).join(', ')}]` : 'tag: []',
  `description: ${JSON.stringify(response.description)}`,
  `pubDate: ${today()} # auto-stamped at creation`,
  response.postImage ? `postImage: ${JSON.stringify(response.postImage)}` : 'postImage:',
  `homepined: ${response.homepined}`,
  `pinedOrder: ${response.pinedOrder}`,
  `draft: ${response.draft}`,
].join('\n');

const files = {
  'zh.md': {
    title: response.titleZh,
    body: `# ${response.titleZh}\n\n在这里开始写作…\n\n- 提示:公式 \`$e^{i\\pi}+1=0$\`、图片 \`![alt](./img.png)\`(放在本文件夹内)、视频直接写 HTML。\n`,
  },
  'en.md': {
    title: response.titleEn || response.titleZh,
    body: `# ${response.titleEn || response.titleZh}\n\nStart writing here…\n\n- Tips: math \`$e^{i\\pi}+1=0$\`, images \`![alt](./img.png)\` (keep them in this folder), videos as raw HTML.\n`,
  },
  'ja.md': {
    title: response.titleJa || response.titleZh,
    body: `# ${response.titleJa || response.titleZh}\n\nここに書き始める…\n\n- ヒント:数式 \`$e^{i\\pi}+1=0$\`、画像 \`![alt](./img.png)\`(このフォルダに置く)、動画は生 HTML で。\n`,
  },
};

mkdirSync(folder, { recursive: true });
for (const [name, file] of Object.entries(files)) {
  const frontmatter = [`title: ${JSON.stringify(file.title)}`, common].join('\n');
  writeFileSync(join(folder, name), `---\n${frontmatter}\n---\n${file.body}`, 'utf8');
  console.log(`wrote ${join('src/content/posts', response.slug, name)}`);
}

console.log(`\nCreated post folder: src/content/posts/${response.slug}/`);
console.log(
  `Put the cover image in the folder${response.postImage ? ` (referenced as ${response.postImage})` : ''} and fill each language file.`
);
