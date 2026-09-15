import { getCollection } from 'astro:content';
import type { Language } from '../types';
import { siteConfig } from '../site.config';

export type PostEntry = Awaited<ReturnType<typeof getCollection<'posts'>>>[number];

/** URL slug of a post entry (id is `<lang>/<slug>`). */
export function slugOf(post: PostEntry, lang: Language): string {
  return post.id.startsWith(`${lang}/`) ? post.id.slice(lang.length + 1) : post.id;
}

/**
 * All published top-level posts of a language, newest first.
 *
 * Subpages are kept in the posts collection so they can be rendered
 * directly by their own URL, but they are excluded from normal
 * article lists such as the home page, archive, and prev/next navigation.
 */
export async function getPublishedPosts(lang: Language): Promise<PostEntry[]> {
  const posts = await getCollection(
    'posts',
    (post) =>
      post.id.startsWith(`${lang}/`) &&
      !post.data.draft &&
      !post.data.isSubpage,
  );

  return posts.sort((a, b) => {
    const da = a.data.pubDate?.getTime() ?? 0;
    const db = b.data.pubDate?.getTime() ?? 0;
    return db - da;
  });
}

/** Pinned posts of a language for the home page. */
export async function getPinnedPosts(
  lang: Language,
  limit = siteConfig.pinnedMax,
): Promise<PostEntry[]> {
  const posts = await getPublishedPosts(lang);

  return posts
    .filter((p) => p.data.homepined)
    .sort((a, b) => {
      const order = (a.data.pinedOrder ?? 0) - (b.data.pinedOrder ?? 0);

      if (order !== 0) return order;

      return (
        (b.data.pubDate?.getTime() ?? 0) -
        (a.data.pubDate?.getTime() ?? 0)
      );
    })
    .slice(0, limit);
}

export function categoriesOf(posts: PostEntry[]): Map<string, number> {
  const map = new Map<string, number>();

  for (const post of posts) {
    const c = post.data.category;

    if (c) {
      map.set(c, (map.get(c) ?? 0) + 1);
    }
  }

  return new Map(
    [...map.entries()].sort((a, b) => b[1] - a[1]),
  );
}