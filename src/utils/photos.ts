import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import type { Language } from '../types';
import { withBase } from './paths';
import { nearestRatio, DEFAULT_RATIO } from './ratio';

/**
 * Photo helpers for the photos page.
 *
 *   photos     : flat photos in `src/content/photos/*`
 *   portfolios : each portfolio lives in `src/content/portfolios/<slug>/`
 *                (photo files named main.*, 1.*, 2.* …)
 *
 * The gallery wall and detail page share one build-time WebP thumbnail
 * (≈900px) so the shared-element transition never swaps images. The zoom
 * popover uses a 2600px variant. A tiny inline blur-up placeholder is
 * generated for the detail hero and zoom view to avoid an empty gray box
 * while the browser decodes the larger frame.
 */

const photosGlob = import.meta.glob(
  '/src/content/photos/*.{png,jpg,jpeg,PNG,JPG,JPEG,webp,gif,avif,svg}'
);
const portfolioGlob = import.meta.glob(
  '/src/content/portfolios/**/*.{png,jpg,jpeg,PNG,JPG,JPEG,webp,gif,avif,svg}'
);

export interface PhotoVariant {
  src: string;
  width: number;
  height: number;
}

/** One card rendered by `GalleryWall.astro`. */
export interface GalleryWallItem {
  href: string;
  photo: Photo;
  /** Card title; defaults to the photo title. */
  title?: string;
  /** Small line under the title (category / album / photo count). */
  subtitle?: string;
  /** Shared element name used by cross-document view transitions. */
  transitionName?: string;
}

export interface Photo {
  /** Original asset URL. */
  src: string;
  /**
   * Gallery thumbnail (~900px WebP). The detail page reuses this exact file
   * so the shared-element transition never swaps in a second image.
   */
  thumb: PhotoVariant;
  /** Full-screen zoom image (~2600px WebP). */
  large: PhotoVariant;
  /** Tiny inline WebP data URI used as a blur-up backdrop. */
  placeholder?: string;
  /** Original pixel dimensions. */
  width: number;
  height: number;
  /** 横屏图片(width > height) */
  landscape: boolean;
  orientation: 'landscape' | 'portrait' | 'square';
  /** 实际显示比例(CSS 宽:高):3 / 2 · 2 / 3 · 1 / 1 */
  ratio: string;
  /** URL segment inside the gallery / album. */
  slug: string;
  /** Human-readable label derived from the filename. */
  title: string;
  /** Original filename, shown in the detail metadata. */
  filename: string;
  /** File modification time, used as a lightweight capture date. */
  date?: string;
  /** Album slug, set by `portfolioPhotos()`. */
  album?: string;
}

type Loader = () => Promise<unknown>;

const cache = new Map<string, Promise<Photo | undefined>>();

/** Raster formats that can safely be re-encoded as WebP. */
const RASTER = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif']);

function basename(path: string): string {
  return path.split('/').pop() ?? '';
}

function stemOf(path: string): string {
  return basename(path).replace(/\.[^.]+$/, '');
}

/** "IMG_0621_1" → "IMG 0621 1"; keeps non-Latin names intact. */
function titleOf(path: string): string {
  const stem = stemOf(path);
  return stem.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim() || 'Photo';
}

/** Stable, ASCII-safe identifier for CSS `view-transition-name`. */
function ident(text: string): string {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

/** Cross-document view-transition name shared by the wall and detail hero. */
export function photoViewTransitionName(photo: Photo): string {
  return photo.album
    ? `photo-${ident(photo.album)}-${ident(photo.slug)}`
    : `photo-${ident(photo.slug)}`;
}

/** Photo detail route for the current language. */
export function photoHref(lang: Language, photo: Photo): string {
  return withBase(
    photo.album
      ? `/${lang}/photos/${photo.album}/${photo.slug}`
      : `/${lang}/photos/photo/${photo.slug}`
  );
}

/** Portfolio (album) route for the current language. */
export function portfolioHref(lang: Language, slug: string): string {
  return withBase(`/${lang}/photos/${slug}`);
}

async function dateOf(path: string): Promise<string | undefined> {
  try {
    const absolute = join(process.cwd(), path.replace(/^\//, ''));
    const info = await stat(absolute);
    return info.mtime.toISOString();
  } catch {
    return undefined;
  }
}

async function placeholderOf(path: string): Promise<string | undefined> {
  try {
    const absolute = join(process.cwd(), path.replace(/^\//, ''));
    const buffer = await sharp(absolute)
      .resize(24, 24, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 45 })
      .toBuffer();
    return `data:image/webp;base64,${buffer.toString('base64')}`;
  } catch {
    return undefined;
  }
}

async function variant(
  meta: ImageMetadata,
  width: number,
  quality: number
): Promise<PhotoVariant> {
  const format = meta.format;
  if (!RASTER.has(format)) {
    return { src: meta.src, width: meta.width, height: meta.height };
  }
  const target = Math.min(width, meta.width);
  const result = await getImage({
    src: meta,
    width: target,
    format: 'webp',
    quality,
  });
  return {
    src: result.src,
    width: Number(result.attributes.width) || target,
    height:
      Number(result.attributes.height) ||
      Math.round((target * meta.height) / meta.width),
  };
}

async function resolvePhoto(
  path: string,
  loader: Loader
): Promise<Photo | undefined> {
  const promise = cache.get(path);
  if (promise) return promise;

  const next = (async () => {
    try {
      const mod = await loader();
      const meta = (mod as { default: ImageMetadata }).default;
      if (!meta) return undefined;

      const [thumb, large, placeholder, date] = await Promise.all([
        variant(meta, 900, 82),
        variant(meta, 2600, 88),
        RASTER.has(meta.format) ? placeholderOf(path) : undefined,
        dateOf(path),
      ]);

      const landscape = meta.width > meta.height;
      return {
        src: meta.src,
        thumb,
        large,
        placeholder,
        width: meta.width,
        height: meta.height,
        landscape,
        orientation: landscape
          ? 'landscape'
          : meta.width < meta.height
            ? 'portrait'
            : 'square',
        ratio:
          meta.width && meta.height
            ? nearestRatio(meta.width, meta.height)
            : DEFAULT_RATIO,
        slug: stemOf(path),
        title: titleOf(path),
        filename: basename(path),
        date,
      } satisfies Photo;
    } catch {
      return undefined;
    }
  })();

  cache.set(path, next);
  return next;
}

/** Ensure URL segments stay unique even if two albums reuse a filename. */
function uniqueSlug(base: string, used: Set<string>): string {
  let slug = base;
  let i = 2;
  while (used.has(slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  used.add(slug);
  return slug;
}

/** Photos for the "photos" view. */
export async function photosPhotos(): Promise<Photo[]> {
  const used = new Set<string>();
  const out: Photo[] = [];
  const entries = Object.entries(photosGlob).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  for (const [path, loader] of entries) {
    const photo = await resolvePhoto(path, loader);
    if (photo) out.push({ ...photo, slug: uniqueSlug(photo.slug, used) });
  }
  return out;
}

/** All photos of one portfolio (folder images). main.* is placed first. */
export async function portfolioPhotos(slug: string): Promise<Photo[]> {
  const prefix = `/src/content/portfolios/${slug}/`;
  const files = Object.entries(portfolioGlob)
    .filter(([path]) => path.startsWith(prefix))
    .sort((a, b) => {
      const aMain = basename(a[0]).startsWith('main');
      const bMain = basename(b[0]).startsWith('main');
      if (aMain !== bMain) return aMain ? -1 : 1;
      return a[0].localeCompare(b[0]);
    });

  const used = new Set<string>();
  const out: Photo[] = [];
  for (const [path, loader] of files) {
    const photo = await resolvePhoto(path, loader);
    if (photo) {
      out.push({
        ...photo,
        album: slug,
        slug: uniqueSlug(photo.slug, used),
      });
    }
  }
  return out;
}

/** Cover (first photo) of a portfolio, for the portfolio card grid. */
export async function portfolioCover(slug: string): Promise<Photo | undefined> {
  const photos = await portfolioPhotos(slug);
  return photos[0];
}
