import type { Language, LocalizedText } from '../types';
import { siteConfig } from '../site.config';

/** UI string dictionary for English (the key source of truth). */
const en = {
  'nav.archive': 'Archive',
  'nav.recipe': 'Recipe',
  'nav.photos': 'Photos',
  'nav.links': 'Friends',

  'lang.name': 'English',
  'lang.switch': 'Language',

  'theme.light': 'Light',
  'theme.dark': 'Dark',

  'search.open': 'Search',
  'search.placeholder': 'Search posts…',
  'search.regex': 'Regex',
  'search.noResults': 'No matching posts.',
  'search.count': 'results',
  'search.invalidRegex': 'Invalid regular expression',

  'home.pinned': 'Pinned',
  'home.allPosts': 'All posts →',

  'archive.categories': 'Categories',
  'archive.all': 'All posts',
  'archive.noMatch': 'No posts match the current filters.',

  'photos.photos': 'All',
  'photos.portfolio': 'Portfolios',
  'photos.coming': 'Coming soon',
  'photos.comingDesc': 'This section is still under construction — stay tuned.',
  'photos.empty': 'No photos yet.',

  'post.toc': 'On this page',

  '404.title': 'Page not found',
  '404.desc': 'The page you are looking for does not exist or was removed.',
  '404.home': 'Go home',
} satisfies Record<string, string>;

export type UiKey = keyof typeof en;

/** UI string dictionary for Chinese. */
const zh: Record<UiKey, string> = {
  'nav.archive': '归档',
  'nav.recipe': '菜单',
  'nav.photos': '相册',
  'nav.links': '友链',
  'lang.name': '中文',
  'lang.switch': '语言',

  'theme.light': '明亮',
  'theme.dark': '暗黑',

  'search.open': '搜索',
  'search.placeholder': '搜索文章…',
  'search.regex': '正则',
  'search.noResults': '没有匹配的文章。',
  'search.count': '条结果',
  'search.invalidRegex': '正则表达式无效',

  'home.pinned': '置顶文章',
  'home.allPosts': '归档 →',

  'archive.categories': '分类',
  'archive.all': '归档',
  'archive.noMatch': '没有符合当前筛选的文章。',

  'photos.photos': '所有',
  'photos.portfolio': '作品集',
  'photos.coming': '待定',
  'photos.comingDesc': '该板块正在建设中,敬请期待。',
  'photos.empty': '暂无照片。',

  'post.toc': '本页目录',

  '404.title': '页面不存在',
  '404.desc': '你访问的页面不存在或已被移除。',
  '404.home': '回到首页',
};

/** UI string dictionary for Japanese. */
const ja: Record<UiKey, string> = {
  'nav.archive': 'アーカイブ',
  'nav.recipe': '料理',
  'nav.photos': '写真',
  'nav.links': '友達リンク',

  'lang.name': '日本語',
  'lang.switch': '言語',

  'theme.light': 'ライト',
  'theme.dark': 'ダーク',

  'search.open': '検索',
  'search.placeholder': '記事を検索…',
  'search.regex': '正規表現',
  'search.noResults': '一致する記事がありません。',
  'search.count': '件',
  'search.invalidRegex': '正規表現が無効です',

  'home.pinned': 'ピン留め記事',
  'home.allPosts': 'すべての記事 →',

  'archive.categories': 'カテゴリ',
  'archive.all': 'すべての記事',
  'archive.noMatch': '条件に一致する記事がありません。',

  'photos.photos': 'すべて',
  'photos.portfolio': '作品集',
  'photos.coming': '準備中',
  'photos.comingDesc': 'このセクションは準備中です。お楽しみに。',
  'photos.empty': '写真はまだありません。',

  'post.toc': '目次',

  '404.title': 'ページが見つかりません',
  '404.desc': 'お探しのページは存在しないか、削除されました。',
  '404.home': 'ホームへ戻る',
};

const dictionaries: Record<Language, Record<UiKey, string>> = { en, zh, ja };

export function t(lang: Language, key: UiKey): string {
  return dictionaries[lang][key] ?? en[key];
}

/** Pick the best available language from a localized field. */
export function localize(field: LocalizedText | undefined, lang: Language): string {
  if (field === undefined) return '';
  if (typeof field === 'string') return field;
  const order: Language[] = [lang, siteConfig.defaultLang, 'en', 'zh', 'ja'];
  const keyOf = (l: Language) => (l === 'en' ? 'eng' : l === 'zh' ? 'cn' : 'jap');
  for (const l of order) {
    const value = field[keyOf(l)];
    if (value) return value;
  }
  return '';
}
