/**
 * Zest portfolio CLI
 *
 * Usage:
 *   pnpm newport "portfolio name"
 *   pnpm newport
 *
 * Creates:
 *   src/content/gallery/<portfolio name>/portfolio.md
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
const galleryDir = join(root, 'src', 'content', 'gallery');
const customCategory = '__create_category__';

const onCancel = () => {
  console.log('Cancelled.');
  process.exit(0);
};

function isValidName(value: string): boolean | string {
  const name = value.trim();
  if (!name) return 'Portfolio name is required.';
  if (name === '.' || name === '..' || /[\\/\0]/.test(name)) {
    return 'Use a folder name without path separators.';
  }
  return true;
}

function categoriesIn(value: unknown, found: Set<string>): void {
  if (Array.isArray(value)) {
    value.forEach((item) => categoriesIn(item, found));
    return;
  }
  if (!value || typeof value !== 'object') return;

  const record = value as Record<string, unknown>;
  if (typeof record.category === 'string' && record.category.trim()) {
    found.add(record.category.trim());
  }
  Object.values(record).forEach((item) => categoriesIn(item, found));
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
        categoriesIn(JSON.parse(readFileSync(path, 'utf8')), found);
      } catch {
        // Ignore invalid metadata and let the gallery sync command report it.
      }
    } else if (entry.name === 'portfolio.md') {
      try {
        const parsed = matter(readFileSync(path, 'utf8'));
        const data = parsed.data;
        const category = data.category;
        if (typeof category === 'string' && category.trim()) found.add(category.trim());
        categoriesIn(data.photos, found);
        photoRecordsFromBody(parsed.content).forEach((record) => categoriesIn(record, found));
      } catch {
        // Ignore incomplete Markdown templates.
      }
    }
  }

  return [...found].sort((a, b) => a.localeCompare(b));
}

async function askPortfolioName(initial: string): Promise<string> {
  if (initial) {
    const valid = isValidName(initial);
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
      validate: isValidName,
    },
    { onCancel },
  );

  return String(response.name).trim();
}

async function askCategory(categories: string[]): Promise<string> {
  const response = await prompts(
    [
      {
        type: 'select',
        name: 'categoryPreset',
        message: 'Choose an existing category or create one',
        choices: [
          ...categories.map((category) => ({ title: category, value: category })),
          { title: 'Create a new category', value: customCategory },
        ],
        initial: 0,
      },
      {
        type: (previous: string) => previous === customCategory ? 'text' : null,
        name: 'categoryCustom',
        message: 'New category name',
        validate: (value: string) => value.trim() ? true : 'Category is required.',
      },
    ],
    { onCancel },
  );

  return response.categoryPreset === customCategory
    ? String(response.categoryCustom).trim()
    : String(response.categoryPreset).trim();
}

async function newPortfolio(): Promise<void> {
  const name = await askPortfolioName(process.argv.slice(2).join(' ').trim());
  const folder = join(galleryDir, name);
  const markdownPath = join(folder, 'portfolio.md');

  if (existsSync(folder)) {
    console.error(`Portfolio folder already exists: ${folder}`);
    process.exit(1);
  }

  const category = await askCategory(existingCategories(galleryDir));
  mkdirSync(folder, { recursive: false });
  writeFileSync(
    markdownPath,
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

await newPortfolio();
