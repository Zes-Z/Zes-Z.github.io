/**
 * Zest Content CLI
 *
 * Usage:
 *   pnpm newpost "文章名"
 *
 * Creates:
 *
 *   src/content/posts/<文章名>/
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

if (command !== 'newpost') {
  console.error(
    [
      'Usage:',
      '  pnpm newpost "文章名"',
    ].join('\n')
  );

  process.exit(1);
}

const name = process.argv.slice(3).join(' ').trim();

if (!name) {
  console.error('Usage: pnpm newpost "文章名"');

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
 * Run
 * ======================================================= */

if (command === 'newpost') {
  await newPost();
}