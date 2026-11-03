import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { nearestRatio, DEFAULT_RATIO } from './ratio';

/**
 * Recipe image helpers.
 *
 * Each recipe lives in `src/content/recipes/<slug>/` and can carry images
 * (cover `main.*` placed first, then numbered photos).
 *
 * The list page uses a ~900px WebP `thumb` for its reference-style image
 * wall; the recipe detail page keeps the original `src` for full quality.
 */

const recipeGlob = import.meta.glob(
  '/src/content/recipes/**/*.{png,jpg,jpeg,PNG,JPG,JPEG,webp,gif,avif,svg}'
);

export interface RecipeImageVariant {
  src: string;
  width: number;
  height: number;
}

export interface RecipeImage {
  /** Original asset URL (detail page). */
  src: string;
  /** Optimized gallery thumbnail. */
  thumb: RecipeImageVariant;
  width: number;
  height: number;
  /** 横屏图片(width > height) */
  landscape: boolean;
  /** 实际显示比例(CSS 宽:高):3 / 2 · 2 / 3 · 1 / 1 */
  ratio: string;
}

type Loader = () => Promise<unknown>;

const cache = new Map<string, Promise<RecipeImage | undefined>>();

/** Raster formats that can safely be re-encoded as WebP. */
const RASTER = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif']);

async function thumbnail(meta: ImageMetadata): Promise<RecipeImageVariant> {
  if (!RASTER.has(meta.format)) {
    return { src: meta.src, width: meta.width, height: meta.height };
  }
  const target = Math.min(900, meta.width);
  const result = await getImage({
    src: meta,
    width: target,
    format: 'webp',
    quality: 82,
  });
  return {
    src: result.src,
    width: Number(result.attributes.width) || target,
    height:
      Number(result.attributes.height) ||
      Math.round((target * meta.height) / meta.width),
  };
}

async function resolveImage(
  path: string,
  loader: Loader
): Promise<RecipeImage | undefined> {
  const promise = cache.get(path);
  if (promise) return promise;

  const next = (async () => {
    try {
      const mod = await loader();
      const meta = (mod as { default: ImageMetadata }).default;
      const w = meta.width ?? 0;
      const h = meta.height ?? 0;
      return {
        src: meta.src,
        thumb: await thumbnail(meta),
        width: w,
        height: h,
        landscape: w > h,
        ratio: w && h ? nearestRatio(w, h) : DEFAULT_RATIO,
      } satisfies RecipeImage;
    } catch {
      return undefined;
    }
  })();

  cache.set(path, next);
  return next;
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
): Promise<RecipeImage | undefined> {
  const images = await recipeImages(slug);
  return images[0];
}
