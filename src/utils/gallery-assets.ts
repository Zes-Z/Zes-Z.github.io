import type { ImageMetadata } from 'astro';

const galleryAssets = import.meta.glob<string>(
  '/src/content/gallery/**/*.{jpg,jpeg,png,webp,avif,gif,mp4,webm,mov,m4v}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
);

const galleryImageMetadata = import.meta.glob<ImageMetadata>(
  '/src/content/gallery/**/*.{jpg,jpeg,png,webp,avif,gif}',
  { eager: true, import: 'default' },
);

/**
 * Resolve a Gallery asset path to its built URL.
 *
 * Examples:
 * photo1.jpg
 * portfolio1/photo4.jpg
 * portfolio1/video2.mp4
 */
export function getGalleryAssetUrl(
  assetPath: string,
): string {
  if (typeof assetPath !== 'string' || !assetPath.trim()) {
    throw new TypeError(
      `[Gallery] Expected an asset path string, received: ${String(assetPath)}`,
    );
  }

  const normalized = assetPath
    .replace(/^\/+/, '')
    .replaceAll('\\', '/');

  const key = `/src/content/gallery/${normalized}`;

  const url = galleryAssets[key];

  if (!url) {
    throw new Error(
      `[Gallery] Asset not found: ${assetPath}`,
    );
  }

  return url;
}

export function getGalleryImageDimensions(assetPath: string): { width: number; height: number } | undefined {
  if (typeof assetPath !== 'string' || !assetPath.trim()) return undefined;

  const normalized = assetPath.replace(/^\/+/, '').replaceAll('\\', '/');
  const metadata = galleryImageMetadata[`/src/content/gallery/${normalized}`];
  return metadata ? { width: metadata.width, height: metadata.height } : undefined;
}
