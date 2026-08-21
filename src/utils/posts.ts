import { getCollection } from 'astro:content';
import type { Language } from '../types';
import { siteConfig } from '../site.config';

export type PostEntry = Awaited<ReturnType<typeof getCollection<'posts'>>>[number];

/** URL slug of a post entry (id is `<lang>/<slug>`). */
export function slugOf(post: PostEntry, lang: Language): string {
  return post.id.startsWith(`${lang}/`) ? post.id.slice(lang.length + 1) : post.id;
}

/** All published posts of a language, newest first. */
export async function getPublishedPosts(lang: Language): Promise<PostEntry[]> {
  const posts = await getCollection('posts', (post) => post.id.startsWith(`${lang}/`));
  return posts
    .filter((p) => !p.data.draft)
    .sort((a, b) => {
      const da = a.data.pubDate?.getTime() ?? 0;
      const db = b.data.pubDate?.getTime() ?? 0;
      return db - da;
    });
}

/** Pinned posts of a language for the home page. */
export async function getPinnedPosts(
  lang: Language,
  limit = siteConfig.pinnedMax
): Promise<PostEntry[]> {
  const posts = await getPublishedPosts(lang);
  return posts
    .filter((p) => p.data.homepined)
    .sort((a, b) => {
      const order = (a.data.pinedOrder ?? 0) - (b.data.pinedOrder ?? 0);
      if (order !== 0) return order;
      return (b.data.pubDate?.getTime() ?? 0) - (a.data.pubDate?.getTime() ?? 0);
    })
    .slice(0, limit);
}

export function categoriesOf(posts: PostEntry[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const post of posts) {
    const c = post.data.category;
    if (c) map.set(c, (map.get(c) ?? 0) + 1);
  }
  return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
}

export function tagsOf(posts: PostEntry[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const t of post.data.tag ?? []) {
      if (t) map.set(t, (map.get(t) ?? 0) + 1);
    }
  }
  return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
}

/** Stable ratio key (0–2) for the archive masonry card of a post. */
export function ratioIndexFor(id: string, count = 3): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash % count;
}
