import type { ImageMetadata } from 'astro';

/**
 * Photo helpers for the photos page.
 *
 *   wall        : flat photos in `src/content/wall/*`
 *   portfolios  : each portfolio lives in `src/content/portfolios/<slug>/`
 *                 (photo files named main.*, 1.*, 2.* …)
 *
 * Photos are served as ORIGINAL files (no downscaling), so the quality is
 * not reduced; only the aspect ratio is detected for masonry layout.
 */

const wallGlob = import.meta.glob(
  '/src/content/wall/*.{png,jpg,jpeg,PNG,JPG,JPEG,webp,gif,avif,svg}'
);
const portfolioGlob = import.meta.glob(
  '/src/content/portfolios/**/*.{png,jpg,jpeg,PNG,JPG,JPEG,webp,gif,avif,svg}'
);

export interface Photo {
  src: string;
  /** 横屏图片(width > height),用于在瀑布流中放大两倍与竖屏协调 */
  landscape: boolean;
}

const cache = new Map<string, Promise<Photo | undefined>>();

async function resolvePhoto(path: string, loader: () => Promise<unknown>) {
  let promise = cache.get(path);
  if (!promise) {
    promise = loader()
      .then((mod) => {
        const meta = (mod as { default: ImageMetadata }).default;
        return { src: meta.src, landscape: (meta.width ?? 0) > (meta.height ?? 0) } as Photo;
      })
      .catch(() => undefined);
    cache.set(path, promise);
  }
  return promise;
}

/** Photos for the "wall" view. */
export async function wallPhotos(): Promise<Photo[]> {
  const out: Photo[] = [];
  for (const [path, loader] of Object.entries(wallGlob)) {
    const photo = await resolvePhoto(path, loader);
    if (photo) out.push(photo);
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

  const out: Photo[] = [];
  for (const [path, loader] of files) {
    const photo = await resolvePhoto(path, loader);
    if (photo) out.push(photo);
  }
  return out;
}

function basename(path: string): string {
  return path.split('/').pop() ?? '';
}

/** Cover (first photo) of a portfolio, for the portfolio card grid. */
export async function portfolioCover(slug: string): Promise<string | undefined> {
  const photos = await portfolioPhotos(slug);
  return photos[0]?.src;
}
