import type { Loader } from 'astro/loaders';
import { readFile, stat, glob as fsGlob } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import matter from 'gray-matter';

/**
 * Parse one Zest content file: plain YAML frontmatter + Markdown body.
 * Normalizes `tag` and falls back pubDate to the file creation time
 * ("pubDate 自动读取创建时间").
 */
export async function parseZestFile(content: string, filePath: string) {
  const parsed = matter(content);
  const frontmatter: Record<string, unknown> = parsed.data ?? {};

  // Normalize `tag`: string ("a, b"), array, or missing → string[].
  const rawTag = frontmatter.tag;
  let tag: string[] = [];
  if (Array.isArray(rawTag)) {
    tag = rawTag.map((t) => String(t).trim()).filter(Boolean);
  } else if (typeof rawTag === 'string' && rawTag.trim() !== '') {
    tag = rawTag.split(',').map((t) => t.trim()).filter(Boolean);
  }

  // pubDate: frontmatter value, otherwise the file creation time.
  let pubDate: Date | undefined;
  const rawDate = frontmatter.pubDate;
  if (rawDate instanceof Date) {
    pubDate = rawDate;
  } else if (typeof rawDate === 'string' && rawDate !== '') {
    const parsedDate = new Date(rawDate);
    if (!Number.isNaN(parsedDate.getTime())) pubDate = parsedDate;
  }
  if (!pubDate && filePath) {
    try {
      const info = await stat(filePath);
      pubDate = info.birthtime || info.ctime;
    } catch {
      // schema falls back to epoch
    }
  }

  return { frontmatter: { ...frontmatter, tag, pubDate }, body: parsed.content };
}

/**
 * Custom content loader for Zest `.md` files.
 *
 * Layout: one folder per post — `src/content/posts/<slug>/{en,zh,ja}.md`
 * (plus any images used by the post, e.g. `cover.png`, referenced from
 * frontmatter/body as `./cover.png`). Entry ids are `<lang>/<slug>`.
 */
export function zestLoader(options: { base: string }): Loader {
  return {
    name: 'zest-loader',
    load: async ({ config, store, parseData, generateDigest, watcher }) => {
      const baseDir = fileURLToPath(new URL(options.base, config.root));
      const rootDir = fileURLToPath(config.root);

      // 已不在磁盘上的条目(被删除/改名)在本次加载后清除
      const stale = new Set(store.keys());

      const relToRoot = (absPath: string) => relative(rootDir, absPath).replaceAll('\\', '/');
      // File `<slug>/<lang>.md` → id `<lang>/<slug>` (e.g. `hello-zest/en.md` → `en/hello-zest`).
      const idOf = (rel: string) => {
        const clean = rel.replace(/\.md$/, '').replaceAll('\\', '/');
        const parts = clean.split('/').filter(Boolean);
        if (parts.length >= 2) {
          const lang = parts[parts.length - 1];
          const slug = parts.slice(0, -1).join('/');
          return `${lang}/${slug}`;
        }
        return clean;
      };

      const syncFile = async (relFile: string) => {
        if (!relFile.endsWith('.md')) return;
        const absPath = join(baseDir, relFile.replaceAll('/', '\\'));
        const contents = await readFile(absPath, 'utf8');
        const fileRel = relToRoot(absPath);
        const { frontmatter, body } = await parseZestFile(contents, absPath);
        const id = idOf(relFile);
        stale.delete(id);
        const data = await parseData<Record<string, unknown>>({
          id,
          data: frontmatter,
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

      const files: string[] = [];
      for await (const file of fsGlob('**/*.md', { cwd: baseDir })) {
        files.push(String(file));
      }
      await Promise.all(files.map((file) => syncFile(file.replaceAll('\\', '/'))));

      // 清理被删除的文章
      stale.forEach((id) => store.delete(id));

      if (!watcher) return;

      watcher.add(baseDir);
      watcher.on('change', (changedPath: string) => {
        void syncFile(relative(baseDir, changedPath).replaceAll('\\', '/'));
      });
      watcher.on('add', (addedPath: string) => {
        void syncFile(relative(baseDir, addedPath).replaceAll('\\', '/'));
      });
      watcher.on('unlink', (deletedPath: string) => {
        const id = idOf(relative(baseDir, deletedPath).replaceAll('\\', '/'));
        if (id) store.delete(id);
      });
    },
  };
}
