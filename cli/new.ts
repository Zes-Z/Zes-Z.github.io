/**
 * Content creation CLI.
 *
 * Usage:
 *   pnpm newpost "post name"
 *   pnpm newport [portfolio name]
 */

import prompts from 'prompts';
import matter from 'gray-matter';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(root, 'src', 'content', 'posts');
const galleryDir = join(root, 'src', 'content', 'gallery');
const customPostCategory = '__custom__';
const customPortfolioCategory = '__create_category__';

const onCancel = () => {
  console.log('Cancelled.');
  process.exit(0);
};

function today(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function usage(): never {
  console.error('Usage:\n  pnpm newpost "post name"\n  pnpm newport [portfolio name]');
  process.exit(1);
}

async function newPost(name: string): Promise<void> {
  if (!name) {
    console.error('Usage: pnpm newpost "post name"');
    process.exit(1);
  }

  const folder = join(postsDir, name);
  if (existsSync(folder)) {
    console.error(`Folder already exists: ${folder}`);
    process.exit(1);
  }

  const response = await prompts(
    [
      {
        type: 'text',
        name: 'titleEn',
        message: 'English title',
        validate: (value: string) => value.trim() ? true : 'English title is required',
      },
      {
        type: 'text',
        name: 'titleJa',
        message: 'Japanese title (日本語タイトル)',
        validate: (value: string) => value.trim() ? true : 'Japanese title is required',
      },
      {
        type: 'select',
        name: 'categoryPreset',
        message: 'Category',
        choices: [
          { title: 'Musing', value: 'Musing' },
          { title: 'Math & Coding', value: 'Math & Coding' },
          { title: 'Ling.', value: 'Ling.' },
          { title: '输入以新建', value: customPostCategory },
        ],
        initial: 0,
      },
      {
        type: (previous: string) => previous === customPostCategory ? 'text' : null,
        name: 'categoryCustom',
        message: 'New category',
        validate: (value: string) => value.trim() ? true : 'Category is required',
      },
      {
        type: 'text',
        name: 'tags',
        message: 'Tags (comma separated, may be empty)',
        initial: '',
      },
      {
        type: 'text',
        name: 'description',
        message: 'Description (may be empty)',
        initial: '',
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
    { onCancel },
  ) as {
    titleEn: string;
    titleJa: string;
    categoryPreset: string;
    categoryCustom?: string;
    tags: string;
    description: string;
    draft: boolean;
  };

  const category = response.categoryPreset === customPostCategory
    ? response.categoryCustom?.trim() ?? ''
    : response.categoryPreset;
  if (!category) {
    console.error('Category is required.');
    process.exit(1);
  }

  const tags = response.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  const common = [
    `description: ${JSON.stringify(response.description)}`,
    `pubDate: "${today()}"`,
    `category: ${JSON.stringify(category)}`,
    tags.length ? `tag: [${tags.map((tag) => JSON.stringify(tag)).join(', ')}]` : 'tag: []',
    'postImage:',
    'homepined: false',
    'pinedOrder: 0',
    `draft: ${response.draft}`,
  ].join('\n');
  const body = `## 



---

## 



---

## 




`;
  const files = {
    'zh.md': { title: name },
    'en.md': { title: response.titleEn.trim() },
    'ja.md': { title: response.titleJa.trim() },
  };

  mkdirSync(folder, { recursive: true });
  for (const [fileName, file] of Object.entries(files)) {
    const frontmatter = [`title: ${JSON.stringify(file.title)}`, common].join('\n');
    writeFileSync(join(folder, fileName), `---\n${frontmatter}\n---\n\n${body}`, 'utf8');
    console.log(`wrote ${join('src/content/posts', name, fileName)}`);
  }

  console.log(`\nCreated post folder: src/content/posts/${name}/\n`);
  console.log('Default values:');
  console.log(`  pubDate: ${today()}`);
  console.log('  postImage:');
  console.log('  homepined: false');
  console.log('  pinedOrder: 0');
  console.log(`  draft: ${response.draft}`);
}

function isValidPortfolioName(value: string): boolean | string {
  const name = value.trim();
  if (!name) return 'Portfolio name is required.';
  if (name === '.' || name === '..' || /[\\/\0]/.test(name)) {
    return 'Use a folder name without path separators.';
  }
  return true;
}

function collectCategories(value: unknown, found: Set<string>): void {
  if (Array.isArray(value)) {
    value.forEach((item) => collectCategories(item, found));
    return;
  }
  if (!value || typeof value !== 'object') return;

  const record = value as Record<string, unknown>;
  if (typeof record.category === 'string' && record.category.trim()) {
    found.add(record.category.trim());
  }
  Object.values(record).forEach((item) => collectCategories(item, found));
}

function photoRecordsFromBody(body: string): Record<string, unknown>[] {
  const records: Record<string, unknown>[] = [];
  const pattern = /"((?:\\.|[^"\\])+\.(?:jpe?g|png|webp|avif|gif|mp4|webm|mov|m4v))"\s*:\s*\{/giu;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(body))) {
    const start = match.index + match[0].lastIndexOf('{');
    let depth = 0;
    let inString = false;
    let escaped = false;
    let end = -1;

    for (let index = start; index < body.length; index += 1) {
      const char = body[index];
      if (inString) {
        if (escaped) escaped = false;
        else if (char === '\\') escaped = true;
        else if (char === '"') inString = false;
        continue;
      }
      if (char === '"') inString = true;
      else if (char === '{') depth += 1;
      else if (char === '}' && --depth === 0) {
        end = index + 1;
        break;
      }
    }

    if (end < 0) continue;
    try {
      const record: unknown = JSON.parse(body.slice(start, end));
      if (record && typeof record === 'object' && !Array.isArray(record)) {
        records.push(record as Record<string, unknown>);
      }
    } catch {
      // Ignore prose and examples that only resemble photo metadata.
    }
    pattern.lastIndex = end;
  }

  return records;
}

function existingCategories(directory: string, found = new Set<string>()): string[] {
  if (!existsSync(directory)) return [...found].sort((a, b) => a.localeCompare(b));

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      existingCategories(path, found);
      continue;
    }

    if (entry.name.endsWith('.json')) {
      try {
        collectCategories(JSON.parse(readFileSync(path, 'utf8')), found);
      } catch {
        // The gallery sync command reports invalid metadata files.
      }
    } else if (entry.name === 'portfolio.md') {
      try {
        const { data, content } = matter(readFileSync(path, 'utf8'));
        if (typeof data.category === 'string' && data.category.trim()) {
          found.add(data.category.trim());
        }
        collectCategories(data.photos, found);
        photoRecordsFromBody(content).forEach((record) => collectCategories(record, found));
      } catch {
        // Ignore incomplete Markdown templates.
      }
    }
  }

  return [...found].sort((a, b) => a.localeCompare(b));
}

async function askPortfolioName(initial: string): Promise<string> {
  if (initial) {
    const valid = isValidPortfolioName(initial);
    if (valid !== true) {
      console.error(valid);
      process.exit(1);
    }
    return initial.trim();
  }

  const response = await prompts(
    {
      type: 'text',
      name: 'name',
      message: 'Portfolio folder name',
      validate: isValidPortfolioName,
    },
    { onCancel },
  );
  return String(response.name).trim();
}

async function askPortfolioCategory(categories: string[]): Promise<string> {
  const response = await prompts(
    [
      {
        type: 'select',
        name: 'categoryPreset',
        message: 'Choose an existing category or create one',
        choices: [
          ...categories.map((category) => ({ title: category, value: category })),
          { title: 'Create a new category', value: customPortfolioCategory },
        ],
        initial: 0,
      },
      {
        type: (previous: string) => previous === customPortfolioCategory ? 'text' : null,
        name: 'categoryCustom',
        message: 'New category name',
        validate: (value: string) => value.trim() ? true : 'Category is required.',
      },
    ],
    { onCancel },
  );

  return response.categoryPreset === customPortfolioCategory
    ? String(response.categoryCustom).trim()
    : String(response.categoryPreset).trim();
}

async function newPortfolio(initialName: string): Promise<void> {
  const name = await askPortfolioName(initialName);
  const folder = join(galleryDir, name);
  if (existsSync(folder)) {
    console.error(`Portfolio folder already exists: ${folder}`);
    process.exit(1);
  }

  const category = await askPortfolioCategory(existingCategories(galleryDir));
  mkdirSync(folder, { recursive: false });
  writeFileSync(
    join(folder, 'portfolio.md'),
    [
      '---',
      `title: ${JSON.stringify(name)}`,
      'description: ""',
      `pubDate: ${new Date().toISOString().slice(0, 10)}`,
      `category: ${JSON.stringify(category)}`,
      'tag: []',
      'heroImage: " "',
      'draft: false',
      '---',
      '',
      '[',
      '',
      ']',
      '',
    ].join('\n'),
    'utf8',
  );

  console.log(`Created portfolio: src/content/gallery/${name}/`);
  console.log(`Created: src/content/gallery/${name}/portfolio.md`);
  console.log(`Default category: ${category}`);
  console.log('Photo metadata will be synchronized into portfolio.md on dev, build, or gallery:sync.');
}

const [command, ...args] = process.argv.slice(2);
if (command === 'newpost') await newPost(args.join(' ').trim());
else if (command === 'newport') await newPortfolio(args.join(' ').trim());
else usage();
