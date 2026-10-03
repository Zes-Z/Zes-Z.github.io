/**
 * Zest Content CLI
 *
 * Usage:
 *   pnpm newpost "文章名"
 *   pnpm newport "项目名"
 *   pnpm newreci "菜名"
 *
 * Creates:
 *
 *   newpost:
 *   src/content/posts/<文章名>/
 *     zh.md
 *     en.md
 *     ja.md
 *
 *   newport:
 *   src/content/portfolios/<项目名>/
 *     zh.md
 *     en.md
 *     ja.md
 *
 *   newreci:
 *   src/content/recipes/<菜名>/
 *     zh.md
 *     en.md
 *     ja.md
 */

import prompts from 'prompts';
import {
  existsSync,
  mkdirSync,
  writeFileSync,
} from 'node:fs';
import {
  join,
  dirname,
} from 'node:path';
import {
  fileURLToPath,
} from 'node:url';
import { siteConfig } from '../src/site.config';

const root = join(
  dirname(fileURLToPath(import.meta.url)),
  '..'
);

function today(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');

  return `${now.getFullYear()}-${pad(
    now.getMonth() + 1
  )}-${pad(now.getDate())}`;
}

const onCancel = () => {
  console.log('Cancelled.');
  process.exit(0);
};

/* =========================================================
 * Command
 * ======================================================= */

const command = process.argv[2];

if (
  command !== 'newpost' &&
  command !== 'newport' &&
  command !== 'newreci'
) {
  console.error(
    [
      'Usage:',
      '  pnpm newpost "文章名"',
      '  pnpm newport "项目名"',
      '  pnpm newreci "菜名"',
    ].join('\n')
  );

  process.exit(1);
}

const name = process.argv.slice(3).join(' ').trim();

if (!name) {
  const label =
    command === 'newpost'
      ? '文章名'
      : command === 'newport'
        ? '项目名'
        : '菜名';

  console.error(
    `Usage: pnpm ${command} "${label}"`
  );

  process.exit(1);
}

/* =========================================================
 * newpost
 * ======================================================= */

async function newPost() {
  const postsDir = join(
    root,
    'src',
    'content',
    'posts'
  );

  const folder = join(postsDir, name);

  if (existsSync(folder)) {
    console.error(
      `Folder already exists: ${folder}`
    );

    process.exit(1);
  }

  const response = await prompts(
    [
      {
        type: 'text',
        name: 'titleEn',
        message: 'English title',
        validate: (value: string) =>
          value.trim()
            ? true
            : 'English title is required',
      },

      {
        type: 'text',
        name: 'titleJa',
        message: 'Japanese title (日本語タイトル)',
        validate: (value: string) =>
          value.trim()
            ? true
            : 'Japanese title is required',
      },

      {
        type: 'select',
        name: 'categoryPreset',
        message: 'Category',
        choices: [
          {
            title: 'Omnium',
            value: 'Omnium',
          },
          {
            title: 'Math & Coding',
            value: 'Math & Coding',
          },
          {
            title: 'Ling.',
            value: 'Ling.',
          },
          {
            title: '输入以新建',
            value: '__custom__',
          },
        ],
        initial: 0,
      },

      {
        type: (prev: string) =>
          prev === '__custom__'
            ? 'text'
            : null,

        name: 'categoryCustom',
        message: 'New category',
        validate: (value: string) =>
          value.trim()
            ? true
            : 'Category is required',
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
    { onCancel }
  ) as {
    titleEn: string;
    titleJa: string;
    categoryPreset: string;
    categoryCustom?: string;
    tags: string;
    description: string;
    draft: boolean;
  };

  const category =
    response.categoryPreset === '__custom__'
      ? response.categoryCustom?.trim() ?? ''
      : response.categoryPreset;

  if (!category) {
    console.error('Category is required.');
    process.exit(1);
  }

  const tags = response.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const common = [
    `description: ${JSON.stringify(
      response.description
    )}`,

    `pubDate: "${today()}"`,

    `category: ${JSON.stringify(category)}`,

    tags.length
      ? `tag: [${tags
          .map((tag) => JSON.stringify(tag))
          .join(', ')}]`
      : 'tag: []',

    'postImage:',

    'homepined: false',

    'pinedOrder: 0',

    `draft: ${response.draft}`,
  ].join('\n');

  /*
   * Default Markdown body.
   *
   * Each language file gets the same three
   * heading placeholders.
   */
  const body = `## 



---

## 



---

## 





`;

  const files = {
    'zh.md': {
      title: name,
    },

    'en.md': {
      title: response.titleEn.trim(),
    },

    'ja.md': {
      title: response.titleJa.trim(),
    },
  };

  mkdirSync(folder, {
    recursive: true,
  });

  for (const [fileName, file] of Object.entries(
    files
  )) {
    const frontmatter = [
      `title: ${JSON.stringify(file.title)}`,
      common,
    ].join('\n');

    writeFileSync(
      join(folder, fileName),

      `---\n${frontmatter}\n---\n\n${body}`,

      'utf8'
    );

    console.log(
      `wrote ${join(
        'src/content/posts',
        name,
        fileName
      )}`
    );
  }

  console.log('');
  console.log(
    `Created post folder: src/content/posts/${name}/`
  );

  console.log('');
  console.log('Default values:');
  console.log(`  pubDate: ${today()}`);
  console.log('  postImage:');
  console.log('  homepined: false');
  console.log('  pinedOrder: 0');
  console.log(`  draft: ${response.draft}`);
}



/* =========================================================
 * newport
 * ======================================================= */

async function newPort() {
  const portfoliosDir = join(
    root,
    'src',
    'content',
    'portfolios'
  );

  const folder = join(
    portfoliosDir,
    name
  );

  if (existsSync(folder)) {
    console.error(
      `Folder already exists: ${folder}`
    );

    process.exit(1);
  }

  const response = await prompts(
    [
      {
        type: 'text',
        name: 'titleEn',
        message: 'English title',
        validate: (value: string) =>
          value.trim()
            ? true
            : 'English title is required',
      },

      {
        type: 'text',
        name: 'titleJa',
        message: 'Japanese title (日本語タイトル)',
        validate: (value: string) =>
          value.trim()
            ? true
            : 'Japanese title is required',
      },

      {
        type: 'text',
        name: 'descriptionZh',
        message: 'Chinese description (中文描述)',
        initial: '',
      },

      {
        type: 'text',
        name: 'descriptionEn',
        message: 'English description',
        initial: '',
      },

      {
        type: 'text',
        name: 'descriptionJa',
        message: 'Japanese description (日本語説明)',
        initial: '',
      },
    ],
    { onCancel }
  ) as {
    titleEn: string;
    titleJa: string;
    descriptionZh: string;
    descriptionEn: string;
    descriptionJa: string;
  };

  const files = {
    'zh.md': {
      title: name,
      description:
        response.descriptionZh.trim(),
    },

    'en.md': {
      title: response.titleEn.trim(),
      description:
        response.descriptionEn.trim(),
    },

    'ja.md': {
      title: response.titleJa.trim(),
      description:
        response.descriptionJa.trim(),
    },
  };

  mkdirSync(folder, {
    recursive: true,
  });

  for (const [fileName, file] of Object.entries(
    files
  )) {
    const content = `---
title: ${JSON.stringify(file.title)}
description: ${JSON.stringify(file.description)}
---

`;

    writeFileSync(
      join(folder, fileName),
      content,
      'utf8'
    );

    console.log(
      `wrote ${join(
        'src/content/portfolios',
        name,
        fileName
      )}`
    );
  }

  console.log('');
  console.log(
    `Created portfolio folder: src/content/portfolios/${name}/`
  );
}

/* =========================================================
 * newreci
 * ======================================================= */

/**
 * 固定分类。来源是 site.config.ts 的 recipeCategories,与菜单页共用同一份,
 * 避免"菜单页有某分类、CLI 却选不到"这类不一致。
 */
const RECIPE_CATEGORIES = siteConfig.recipeCategories;

async function newRecipe() {
  const recipesDir = join(
    root,
    'src',
    'content',
    'recipes'
  );

  const folder = join(
    recipesDir,
    name
  );

  if (existsSync(folder)) {
    console.error(
      `Folder already exists: ${folder}`
    );

    process.exit(1);
  }

  const response = await prompts(
    [
      {
        type: 'select',
        name: 'category',
        message: '分类',
        choices: RECIPE_CATEGORIES.map((c) => ({
          title: c,
          value: c,
        })),
        initial: 0,
      },

      {
        type: 'text',
        name: 'tags',
        message: '标签(逗号分隔,可跳过)',
        initial: '',
      },

      {
        type: 'text',
        name: 'description',
        message: '描述(可跳过)',
        initial: '',
      },
    ],
    { onCancel }
  ) as {
    category: string;
    tags: string;
    description: string;
  };

  const tags = response.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const frontmatter = [
    `title: ${JSON.stringify(name)}`,
    `categories: ${JSON.stringify(response.category)}`,
    `description: ${JSON.stringify(response.description.trim())}`,
    `pubDate: "${today()}"`,
    `tags: [${tags
      .map((tag) => JSON.stringify(tag))
      .join(', ')}]`,
    'postImage: ',
    'homepined: true',
    'pinedOrder: 0',
    'draft: false',
  ].join('\n');

  const body = `## 备菜

---

## 



---

## 

`;

  const files = {
    'zh.md': name,
    'en.md': name,
    'ja.md': name,
  };

  mkdirSync(folder, {
    recursive: true,
  });

  for (const fileName of Object.keys(files)) {
    writeFileSync(
      join(folder, fileName),

      `---\n${frontmatter}\n---\n\n${body}`,

      'utf8'
    );

    console.log(
      `wrote ${join(
        'src/content/recipes',
        name,
        fileName
      )}`
    );
  }

  console.log('');
  console.log(
    `Created recipe folder: src/content/recipes/${name}/`
  );
  console.log(
    'Put images (cover main.* + step photos) in the same folder.'
  );
}

/* =========================================================
 * Run
 * ======================================================= */

if (command === 'newpost') {
  await newPost();
}

if (command === 'newport') {
  await newPort();
}

if (command === 'newreci') {
  await newRecipe();
}