import type { Language } from '../types';
import { siteConfig } from '../site.config';

/**
 * 站点部署子路径(base,如 GitHub Pages 项目页的 `/repo/`)。
 * 所有站内绝对路径都应经过 withBase 处理,否则项目页部署会 404。
 */
export function basePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, '');
}

/** 给站内绝对路径加上部署 base 前缀。 */
export function withBase(path: string): string {
  if (/^(https?:|mailto:|#|data:)/.test(path)) return path;
  return `${basePath()}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Prefix a path with its language segment. */
export function withLang(lang: Language, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${clean === '/' ? '' : clean}`;
}

export function homeHref(lang: Language): string {
  return withBase(`/${lang}`);
}

export function postHref(lang: Language, slug: string): string {
  return withBase(`/${lang}/posts/${slug}`);
}

export function archiveHref(lang: Language): string {
  return withBase(`/${lang}/archive`);
}

export function aboutHref(lang: Language): string {
  return withBase(`/${lang}/about`);
}

export function linksHref(lang: Language): string {
  return withBase(`/${lang}/links`);
}

export function rssHref(lang: Language): string {
  return withBase(`/${lang}/rss.xml`);
}

/** Route segments that exist identically in every language. */
const SHARED_SEGMENTS = new Set(['archive', 'about', 'links', 'photos']);

/**
 * Translate a URL of the current language into the same page in another
 * language. Unknown routes fall back to the target language home page.
 */
export function localizePath(pathname: string, targetLang: Language): string {
  const stripped = pathname.replace(basePath(), '');
  const segments = stripped.split('/').filter(Boolean);
  if (segments[0] === 'en' || segments[0] === 'zh' || segments[0] === 'ja') {
    segments.shift();
  }
  if (segments.length === 0) return homeHref(targetLang);
  if (SHARED_SEGMENTS.has(segments[0])) return withBase(withLang(targetLang, `/${segments.join('/')}`));
  if (segments[0] === 'posts' && segments[1]) {
    return withBase(withLang(targetLang, `/posts/${segments[1]}`));
  }
  return homeHref(targetLang);
}

/** Default language entry used by the root redirect. */
export function defaultHome(): string {
  return homeHref(siteConfig.defaultLang);
}
