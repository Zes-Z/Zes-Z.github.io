import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { withBase } from './paths';

/**
 * Post folders may contain images (cover + body illustrations) next to
 * the language `.md` files. Relative references like `./cover.png` are
 * resolved against the post folder at build time and optimized.
 * Supported formats: png, jpg/jpeg (any letter case), webp, gif, svg, avif.
 */

const postAssets = import.meta.glob(
  '/src/content/posts/**/*.{png,jpg,jpeg,PNG,JPG,JPEG,webp,gif,svg,avif}'
);

// 不区分大小写的索引:解决照片常见的 .JPG / .PNG 大写扩展名问题
const assetIndex = new Map<string, () => Promise<unknown>>(
  Object.entries(postAssets).map(([key, loader]) => [key.toLowerCase(), loader])
);

const cache = new Map<string, Promise<ImageMetadata | undefined>>();

/** Resolve a relative asset reference inside a post folder. */
export async function resolvePostAsset(
  slug: string,
  ref: string
): Promise<ImageMetadata | undefined> {
  if (!ref || /^(https?:|\/|data:|#)/.test(ref)) return undefined;
  const key = `/src/content/posts/${slug}/${ref.replace(/^\.\//, '')}`.toLowerCase();
  const loader = assetIndex.get(key);
  if (!loader) return undefined;

  let promise = cache.get(key);
  if (!promise) {
    promise = loader()
      .then((mod) => (mod as { default: ImageMetadata }).default)
      .catch(() => undefined);
    cache.set(key, promise);
  }
  return promise;
}

/**
 * Resolve a post's cover image (`postImage` frontmatter) to a ready-to-use
 * URL. Absolute URLs and root paths pass through untouched; relative
 * references are resolved from the post folder and optimized.
 */
export async function resolvePostImage(
  slug: string,
  ref: string | undefined | null,
  width = 800
): Promise<string | undefined> {
  if (!ref || !ref.trim()) return undefined;
  if (/^(https?:|data:)/.test(ref)) return ref;
  if (/^\//.test(ref)) return withBase(ref);
  const meta = await resolvePostAsset(slug, ref);
  if (!meta) return withBase(ref); // unresolved: keep the raw reference for the author
  try {
    const optimized = await getImage({ src: meta, width });
    return optimized.src;
  } catch {
    return withBase(ref);
  }
}

/**
 * Responsive cover image: a fallback `src` plus a `srcset` of several widths.
 *
 * Why this exists: `resolvePostImage` renders ONE width, and an `<img>` with a
 * single source gives the browser nothing to choose from. On a 2x (Retina)
 * screen a large card needs roughly twice its CSS width in real pixels, so a
 * single 800px file gets upscaled and looks soft. Emitting several widths lets
 * the browser download the sharpest one it actually needs — without forcing
 * small cards (archive, adjacent nav) to pay for a huge file.
 *
 * Callers must also set `sizes` so the browser can pick correctly.
 */
export async function postImageCandidates(
  slug: string,
  ref: string | undefined | null,
  widths: number[],
  /**
   * `resolvePostImage` 的默认档(widths 未包含它时会额外生成一次,
   * 用作不支持 srcset 时的回退 src)。
   */
  fallbackWidth = 800
): Promise<{ src: string; srcset?: string } | undefined> {
  const src = await resolvePostImage(slug, ref, fallbackWidth);
  if (!src) return undefined;

  // 外链 / 绝对路径无法在构建期派生尺寸,只能原样使用
  if (!ref || !ref.trim() || /^(https?:|data:|\/)/.test(ref)) return { src };

  const meta = await resolvePostAsset(slug, ref);
  if (!meta?.width) return { src };

  const unique = [...new Set(widths)].sort((a, b) => a - b);
  const entries = await Promise.all(
    unique.map(async (w) => {
      // 不放大到超过原图宽度,避免生成更大的假尺寸
      if (w > meta.width) return undefined;
      try {
        const optimized = await getImage({ src: meta, width: w });
        return `${optimized.src} ${w}w`;
      } catch {
        return undefined;
      }
    })
  );

  const srcset = entries.filter(Boolean).join(', ');
  return srcset ? { src, srcset } : { src };
}

/**
 * Pick the archive masonry card ratio from the ORIGINAL image aspect ratio,
 * mapping it to the nearest of the allowed ratios (e.g. 3/2, 2/3, 1/1).
 * A 3:2 image becomes `3 / 2`; remote/absolute refs fall back.
 */
export async function postImageRatio(
  slug: string,
  ref: string | undefined | null,
  allowed: readonly string[],
  fallback = '3 / 2'
): Promise<string> {
  if (!ref || /^(https?:|\/|data:)/.test(ref)) return fallback;
  const meta = await resolvePostAsset(slug, ref);
  if (!meta?.width || !meta.height) return fallback;

  const targets = allowed.map((ratio) => {
    const [w, h] = ratio.split('/').map((n) => Number(n.trim()));
    return { value: w / h, label: ratio };
  });
  const aspect = meta.width / meta.height;
  let best = targets[0]!;
  for (const t of targets) {
    if (Math.abs(aspect - t.value) < Math.abs(aspect - best.value)) best = t;
  }
  return best.label;
}
