/**
 * Shared types for the Zest theme.
 */

/** Supported UI languages. */
export type Language = 'en' | 'zh' | 'ja';

export const LANGUAGES: readonly Language[] = ['en', 'zh', 'ja'] as const;

/** A field that is either a plain string or a per-language map.
 *  Used for site config (title/description/nav/footer labels) and for friend
 *  entries, which live in `src/site.config.ts` (`siteConfig.friends`).
 *  Content keys stay `eng` / `cn` / `jap`. */
export type LocalizedText =
  | string
  | Partial<Record<'eng' | 'cn' | 'jap', string>>;

export type FriendItem = {
  name: LocalizedText;
  desc: LocalizedText;
  avatar: string;
  link: string;
};

export type FriendGroup = {
  name?: LocalizedText;
  desc?: LocalizedText;
  items: FriendItem[];
};

/** Item embedded into a page for the search palette. */
export type SearchIndexItem = {
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  href: string;
  body: string;
};
