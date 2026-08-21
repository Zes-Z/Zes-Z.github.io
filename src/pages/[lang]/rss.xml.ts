import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { siteConfig, siteSubtitle } from '../../site.config';
import { localize } from '../../i18n';
import type { Language } from '../../types';
import { getPublishedPosts, slugOf } from '../../utils/posts';
import { postHref } from '../../utils/paths';

const langCodes: Record<Language, string> = { en: 'en-us', zh: 'zh-cn', ja: 'ja' };

export async function getStaticPaths() {
  return siteConfig.langs.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute<never> = async ({ params, site }) => {
  const lang = params.lang as Language;
  const posts = await getPublishedPosts(lang);

  return rss({
    title: siteConfig.title,
    description: (() => {
      const sub = siteSubtitle();
      return sub ? localize(sub, lang) : localize(siteConfig.description, lang);
    })(),
    site: site ?? new URL(siteConfig.siteUrl),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? '',
      link: new URL(postHref(lang, slugOf(post, lang)), site ?? new URL(siteConfig.siteUrl)).href,
      pubDate: post.data.pubDate ?? new Date(0),
    })),
    customData: `<language>${langCodes[lang]}</language>`,
  });
};
