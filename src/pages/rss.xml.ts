import { siteConfig } from '../site.config';

// Root feed: redirect to the default language's feed.
export const GET = () =>
  new Response(null, {
    status: 301,
    headers: { Location: `/${siteConfig.defaultLang}/rss.xml` },
  });
