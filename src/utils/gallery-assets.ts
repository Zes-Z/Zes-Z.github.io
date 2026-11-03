const galleryAssets = import.meta.glob<string>(
  '/src/content/gallery/**/*.{jpg,jpeg,png,webp,avif,gif,mp4,webm,mov,m4v}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
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