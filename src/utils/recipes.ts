import type { ImageMetadata } from 'astro';
import { nearestRatio, DEFAULT_RATIO } from './ratio';

/**
 * Recipe image helpers.
 *
 * Each recipe lives in `src/content/recipes/<slug>/` and can carry images
 * (cover `main.*` placed first, then numbered photos).
 *
 * Images are served as ORIGINAL files (no downscaling), only the aspect
 * ratio is detected for masonry layout.
 */

const recipeGlob = import.meta.glob(
  '/src/content/recipes/**/*.{png,jpg,jpeg,PNG,JPG,JPEG,webp,gif,avif,svg}'
);

export interface RecipeImage {
  src: string;
  /** 横屏图片(width > height),用于在瀑布流中放大两倍与竖屏协调 */
  landscape: boolean;
  /** 实际显示比例(CSS 宽:高):3 / 2 · 2 / 3 · 1 / 1 */
  ratio: string;
}

const cache = new Map<string, Promise<RecipeImage | undefined>>();

async function resolveImage(path: string, loader: () => Promise<unknown>) {
  let promise = cache.get(path);
  if (!promise) {
    promise = loader()
      .then((mod) => {
        const meta = (mod as { default: ImageMetadata }).default;
        const w = meta.width ?? 0;
        const h = meta.height ?? 0;
        return {
          src: meta.src,
          landscape: w > h,
          ratio: w && h ? nearestRatio(w, h) : DEFAULT_RATIO,
        } as RecipeImage;
      })
      .catch(() => undefined);
    cache.set(path, promise);
  }
  return promise;
}

function basename(path: string): string {
  return path.split('/').pop() ?? '';
}

/** All images of one recipe folder (`main.*` first). */
export async function recipeImages(slug: string): Promise<RecipeImage[]> {
  const prefix = `/src/content/recipes/${slug}/`;
  const files = Object.entries(recipeGlob)
    .filter(([path]) => path.startsWith(prefix))
    .sort((a, b) => {
      const aMain = basename(a[0]).startsWith('main');
      const bMain = basename(b[0]).startsWith('main');
      if (aMain !== bMain) return aMain ? -1 : 1;
      return a[0].localeCompare(b[0]);
    });

  const out: RecipeImage[] = [];
  for (const [path, loader] of files) {
    const image = await resolveImage(path, loader);
    if (image) out.push(image);
  }
  return out;
}

/** Cover (first image) of a recipe, for the recipe card grid. */
export async function recipeCover(
  slug: string
): Promise<{ src: string; ratio: string } | undefined> {
  const images = await recipeImages(slug);
  const first = images[0];
  return first ? { src: first.src, ratio: first.ratio } : undefined;
}
