import type { Loader } from 'astro/loaders';
import { readFile, stat, glob as fsGlob } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import matter from 'gray-matter';

/**
 * Parse one Zest Markdown file.
 *
 * - Normalize `tag` to string[]
 * - Use file creation time as the fallback for `pubDate`
 */
export async function parseZestFile(
  content: string,
  filePath: string,
): Promise<{
  frontmatter: Record<string, unknown>;
  body: string;
}> {
  const parsed = matter(content);
  const frontmatter: Record<string, unknown> = parsed.data ?? {};

  const rawTag = frontmatter.tag;

  const tag = Array.isArray(rawTag)
    ? rawTag.map((t) => String(t).trim()).filter(Boolean)
    : typeof rawTag === 'string'
      ? rawTag
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  let pubDate: Date | undefined;
  const rawDate = frontmatter.pubDate;

  if (rawDate instanceof Date) {
    pubDate = rawDate;
  } else if (typeof rawDate === 'string' && rawDate !== '') {
    const date = new Date(rawDate);

    if (!Number.isNaN(date.getTime())) {
      pubDate = date;
    }
  }

  if (!pubDate && filePath) {
    try {
      const info = await stat(filePath);
      pubDate = info.birthtime || info.ctime;
    } catch {
      // Let the schema handle the missing date.
    }
  }

  return {
    frontmatter: {
      ...frontmatter,
      tag,
      pubDate,
    },
    body: parsed.content,
  };
}

/**
 * Custom content loader for Zest Markdown files.
 *
 * Structure:
 *
 *   src/content/posts/<slug>/<lang>.md
 *   src/content/posts/<slug>/<subdir>/<lang>.md
 *   src/content/posts/<slug>/<subdir>/<subdir>/<lang>.md
 *
 * Entry IDs:
 *
 *   <lang>/<path>
 *
 * Examples:
 *
 *   hello-zest/en.md
 *   → en/hello-zest
 *
 *   电路学/一、基本电路观念/zh.md
 *   → zh/电路学/一、基本电路观念
 *
 * `isSubpage` is automatically set to:
 *
 *   false → top-level Markdown
 *   true  → Markdown inside a subdirectory
 */
export function zestLoader(options: { base: string }): Loader {
  return {
    name: 'zest-loader',

    load: async ({
      config,
      store,
      parseData,
      generateDigest,
      watcher,
    }) => {
      const baseDir = fileURLToPath(
        new URL(options.base, config.root),
      );

      const rootDir = fileURLToPath(config.root);
      const stale = new Set(store.keys());

      const relToRoot = (absPath: string) =>
        relative(rootDir, absPath).replaceAll('\\', '/');

      /**
       * Convert:
       *
       *   <path>/<lang>.md
       *
       * into:
       *
       *   <lang>/<path>
       */
      const idOf = (rel: string) => {
        const clean = rel
          .replace(/\.md$/, '')
          .replaceAll('\\', '/');

        const parts = clean.split('/').filter(Boolean);

        if (parts.length < 2) return clean;

        const lang = parts.at(-1)!;
        const slug = parts.slice(0, -1).join('/');

        return `${lang}/${slug}`;
      };

      /**
       * Synchronize one Markdown file.
       */
      const syncFile = async (relFile: string) => {
        if (!relFile.endsWith('.md')) return;

        const normalizedRelFile = relFile.replaceAll('\\', '/');

        const absPath = join(
          baseDir,
          ...normalizedRelFile.split('/'),
        );

        const contents = await readFile(absPath, 'utf8');
        const fileRel = relToRoot(absPath);

        const { frontmatter, body } = await parseZestFile(
          contents,
          absPath,
        );

        const id = idOf(normalizedRelFile);

        stale.delete(id);

        /**
         * A top-level article has:
         *
         *   <slug>/<lang>.md
         *
         * A subpage has:
         *
         *   <slug>/<subdir>/<lang>.md
         *
         * Therefore, more than two path segments means
         * this Markdown file is a subpage.
         */
        const parts = normalizedRelFile
          .split('/')
          .filter(Boolean);

        const isSubpage = parts.length > 2;

        /**
         * Subpages are rendered as independent Markdown pages,
         * but they are not normal articles.
         *
         * The posts collection schema still requires `title`
         * and `category`, so provide sensible fallback values
         * for subpages when those fields are omitted from frontmatter.
         *
         * Example:
         *
         *   电路学/二、进阶电路分析/zh.md
         *
         * automatically gets:
         *
         *   title: "二、进阶电路分析"
         *   category: "Subpage"
         */
        const data = await parseData<Record<string, unknown>>({
          id,
          data: {
            ...frontmatter,

            ...(isSubpage
              ? {
                  title:
                    typeof frontmatter.title === 'string' &&
                    frontmatter.title.trim()
                      ? frontmatter.title
                      : parts.at(-2) ?? 'Untitled',

                  category:
                    typeof frontmatter.category === 'string' &&
                    frontmatter.category.trim()
                      ? frontmatter.category
                      : 'Subpage',
                }
              : {}),

            isSubpage,
          },
          filePath: fileRel,
        });

        store.set({
          id,
          data,
          body,
          filePath: fileRel,
          digest: generateDigest(contents),
        });
      };

      /**
       * Find all Markdown files, including subpages.
       */
      const files: string[] = [];

      for await (const file of fsGlob('**/*.md', {
        cwd: baseDir,
      })) {
        files.push(String(file));
      }

      await Promise.all(
        files.map((file) =>
          syncFile(file.replaceAll('\\', '/')),
        ),
      );

      // Remove deleted or renamed entries.
      stale.forEach((id) => store.delete(id));

      if (!watcher) return;

      /**
       * Watch the content directory.
       */
      watcher.add(baseDir);

      watcher.on('change', (changedPath: string) => {
        const relPath = relative(
          baseDir,
          changedPath,
        ).replaceAll('\\', '/');

        void syncFile(relPath);
      });

      watcher.on('add', (addedPath: string) => {
        const relPath = relative(
          baseDir,
          addedPath,
        ).replaceAll('\\', '/');

        void syncFile(relPath);
      });

      watcher.on('unlink', (deletedPath: string) => {
        const relPath = relative(
          baseDir,
          deletedPath,
        ).replaceAll('\\', '/');

        const id = idOf(relPath);

        if (id) {
          store.delete(id);
        }
      });
    },
  };
}