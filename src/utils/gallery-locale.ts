export type GalleryLanguage =
  | 'en'
  | 'zh'
  | 'ja';

export interface GalleryLocaleData {
  title?: string;
  location?: string;
  desc?: string;
  text?: string;
}

export type GalleryLocalizedData = Record<
  GalleryLanguage,
  GalleryLocaleData
>;

/**
 * Resolve localized metadata.
 *
 * Priority:
 * 1. Current language
 * 2. Other languages in the supplied fallback order
 *
 * Fallback is performed independently for each field.
 */
export function resolveGalleryLocale(
  locales: GalleryLocalizedData,
  currentLang: GalleryLanguage,
  fallbackOrder: readonly GalleryLanguage[],
) {
  const order = [
    ...new Set([
      currentLang,
      ...fallbackOrder,
    ]),
  ];

  function pick(
    key: keyof GalleryLocaleData,
  ): string {
    for (const lang of order) {
      const value = locales[lang]?.[key];

      if (
        typeof value === 'string' &&
        value.trim()
      ) {
        return value.trim();
      }
    }

    return '';
  }

  return {
    title: pick('title'),
    location: pick('location'),
    desc: pick('desc'),
    text: pick('text'),
  };
}