import { LANGUAGES, type Language } from '../types';

/**
 * 站点部署子路径(base,如 GitHub Pages 项目页的 `/repo/`)。
 * 所有站内绝对路径都应经过 withBase 处理,否则项目页部署会 404。
 */
function basePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, '');
}

/** 给站内绝对路径加上部署 base 前缀。 */
export function withBase(path: string): string {
  if (/^(https?:|mailto:|#|data:)/.test(path)) return path;
  return `${basePath()}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * 站点静态资源路径(如 siteConfig 里配置的 `/avatar/x.jpg`、`/wallpaper/x.jpg`)。
 *
 * 与 withBase 的区别:空值直接返回 `fallback`,便于"未配置头像/封面"这类
 * 可选字段安全地退回到占位资源;外链与已带 base 的路径原样返回(idempotent)。
 */
export function assetHref(
  path: string | undefined | null,
  fallback = ''
): string {
  const value = path?.trim();
  if (!value) return fallback;
  if (/^(https?:|mailto:|#|data:)/.test(value)) return value;
  const base = basePath();
  if (base && value.startsWith(`${base}/`)) return value;
  return withBase(value);
}

/** Build-time AVIF preview for images stored under public/wallpaper or public/avatar. */
export function publicPreviewHref(
  path: string | undefined | null,
  width: 160 | 960 | 1600,
): string | undefined {
  const value = path?.trim();
  if (!value || !/^\/(wallpaper|avatar)\/[^?#]+\.(?:jpe?g|png|webp|avif)$/i.test(value)) {
    return undefined;
  }
  return withBase(`/previews${value}.${width}.avif`);
}

/**
 * 图片加载失败时使用的占位图(内联 SVG data URI)。
 *
 * 刻意不放在 `public/` 下:data URI 不产生额外请求、在任何部署子路径下都有效,
 * 也不会因为占位图自身 404 而再次触发 error。
 */
export const IMAGE_FALLBACK =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
      '<circle cx="12" cy="12" r="12" fill="#dfe7e3"/>' +
      '<circle cx="12" cy="9.6" r="3.9" fill="#93a89c"/>' +
      '<path d="M12 14.9c-4.2 0-7.1 2.5-7.1 5.7V24h14.2v-3.4c0-3.2-2.9-5.7-7.1-5.7Z" fill="#93a89c"/>' +
      '</svg>'
  );

export function postHref(lang: Language, slug: string): string {
  return withBase(`/${lang}/posts/${slug}`);
}

export function archiveHref(lang: Language): string {
  return withBase(`/${lang}/archive`);
}

/** Archive page filtered by a category, e.g. `/zh/archive?category=Musing`. */
export function archiveCategoryHref(lang: Language, category: string): string {
  return `${archiveHref(lang)}?category=${encodeURIComponent(category)}`;
}

/**
 * Translate a URL of the current language into the same page in another
 * language. Page paths and query parameters are kept intact; only the leading
 * language segment changes. This also covers new and nested routes without
 * needing to maintain a separate allowlist.
 */
export function localizePath(
  pathname: string,
  targetLang: Language,
): string {
  const base = basePath();
  const withoutBase = base && (pathname === base || pathname.startsWith(`${base}/`))
    ? pathname.slice(base.length)
    : pathname;
  const suffixAt = withoutBase.search(/[?#]/);
  const pathOnly = suffixAt < 0 ? withoutBase : withoutBase.slice(0, suffixAt);
  const suffix = suffixAt < 0 ? '' : withoutBase.slice(suffixAt);
  const segments = pathOnly.split('/').filter(Boolean);

  if (LANGUAGES.some((lang) => lang === segments[0])) segments.shift();

  const localizedPath = `/${targetLang}${segments.length ? `/${segments.join('/')}` : ''}`;

  return `${withBase(localizedPath)}${suffix}`;
}

export function iconSrc(name: string): string {
  return withBase(`/icon/${name}.svg`);
}
