import type { APIRoute } from 'astro';
import type { SearchIndexItem } from '../../types';
import { siteConfig } from '../../site.config';
import { getPublishedPosts, slugOf } from '../../utils/posts';
import { postHref } from '../../utils/paths';
import { markdownToText } from '../../utils/markdown';

export const prerender = true;

export async function getStaticPaths() {
  const result: { params: { lang: string }; props: { items: SearchIndexItem[] } }[] = [];
  for (const lang of siteConfig.langs) {
    const posts = await getPublishedPosts(lang);
    const items: SearchIndexItem[] = posts.map((post) => {
      const date = post.data.pubDate ?? new Date(0);
      return {
        title: post.data.title,
        description: post.data.description ?? '',
        category: post.data.category,
        tags: post.data.tag ?? [],
        date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
        href: postHref(lang, slugOf(post, lang)),
        body: markdownToText(post.body ?? ''),
      };
    });
    result.push({ params: { lang }, props: { items } });
  }
  return result;
}

export const GET: APIRoute<{ items: SearchIndexItem[] }> = ({ props }) =>
  new Response(JSON.stringify(props.items), {
    headers: { 'Content-Type': 'application/json' },
  });
