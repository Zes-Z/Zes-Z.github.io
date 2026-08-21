import type { Language, LocalizedText } from '../types';
import { siteConfig } from '../site.config';

/** UI string dictionary for English (the key source of truth). */
const en = {
  'nav.home': 'Home',
  'nav.archive': 'Archive',
  'nav.recipe': 'Recipe',
  'nav.photos': 'Photos',
  'nav.about': 'About',
  'nav.links': 'Friends',

  'lang.name': 'English',
  'lang.switch': 'Language',

  'theme.light': 'Light',
  'theme.dark': 'Dark',

  'search.open': 'Search',
  'search.placeholder': 'Search posts…',
  'search.regex': 'Regex',
  'search.literal': 'Literal',
  'search.noResults': 'No matching posts.',
  'search.count': 'results',
  'search.invalidRegex': 'Invalid regular expression',

  'home.pinned': 'Pinned',
  'home.welcome': 'Welcome',

  'archive.categories': 'Categories',
  'archive.tags': 'Tags',
  'archive.all': 'All posts',
  'archive.timeline': 'Timeline',
  'archive.masonry': 'Gallery',
  'archive.noMatch': 'No posts match the current filters.',

  'photos.wall': 'All',
  'photos.portfolio': 'Portfolios',
  'photos.coming': 'Coming soon',
  'photos.comingDesc': 'This section is still under construction — stay tuned.',
  'photos.empty': 'No photos yet.',

  'about.resume': 'Resume',
  'about.collapse': 'Collapse',
  'about.expand': 'Expand',

  // 'links.title': 'Friends',
  // 'links.desc': 'Sites I read and recommend.',

  'post.draft': 'Draft',
  'post.toc': 'On this page',

  'footer.copyright': 'Copyright',

  'misc.posts': 'posts',
} satisfies Record<string, string>;

export type UiKey = keyof typeof en;

/** UI string dictionary for Chinese. */
const zh: Record<UiKey, string> = {
  'nav.home': '首页',
  'nav.archive': '归档',
  'nav.recipe': '菜单',
  'nav.photos': '相册',
  'nav.about': '关于',
  'nav.links': '友链',

  'lang.name': '中文',
  'lang.switch': '语言',

  'theme.light': '明亮',
  'theme.dark': '暗黑',

  'search.open': '搜索',
  'search.placeholder': '搜索文章…',
  'search.regex': '正则',
  'search.literal': '普通',
  'search.noResults': '没有匹配的文章。',
  'search.count': '条结果',
  'search.invalidRegex': '正则表达式无效',

  'home.pinned': '置顶文章',
  'home.welcome': '欢迎',

  'archive.categories': '分类',
  'archive.tags': '标签',
  'archive.all': '全部文章',
  'archive.timeline': '时间线',
  'archive.masonry': '画廊',
  'archive.noMatch': '没有符合当前筛选的文章。',

  'photos.wall': '所有',
  'photos.portfolio': '作品集',
  'photos.coming': '待定',
  'photos.comingDesc': '该板块正在建设中,敬请期待。',
  'photos.empty': '暂无照片。',

  'about.resume': '简历',
  'about.collapse': '折叠',
  'about.expand': '展开',

  // 'links.title': '友链',
  // 'links.desc': '我常读与推荐的站点。',

  'post.draft': '草稿',
  'post.toc': '本页目录',

  'footer.copyright': '版权声明',

  'misc.posts': '篇文章',
};

/** UI string dictionary for Japanese. */
const ja: Record<UiKey, string> = {
  'nav.home': 'ホーム',
  'nav.archive': 'アーカイブ',
  'nav.recipe': 'レシピ',
  'nav.photos': '写真',
  'nav.about': '概要',
  'nav.links': '友達リンク',

  'lang.name': '日本語',
  'lang.switch': '言語',

  'theme.light': 'ライト',
  'theme.dark': 'ダーク',

  'search.open': '検索',
  'search.placeholder': '記事を検索…',
  'search.regex': '正規表現',
  'search.literal': '通常',
  'search.noResults': '一致する記事がありません。',
  'search.count': '件',
  'search.invalidRegex': '正規表現が無効です',

  'home.pinned': 'ピン留め記事',
  'home.welcome': 'ようこそ',

  'archive.categories': 'カテゴリ',
  'archive.tags': 'タグ',
  'archive.all': 'すべての記事',
  'archive.timeline': 'タイムライン',
  'archive.masonry': 'ギャラリー',
  'archive.noMatch': '条件に一致する記事がありません。',

  'photos.wall': 'すべて',
  'photos.portfolio': '作品集',
  'photos.coming': '準備中',
  'photos.comingDesc': 'このセクションは準備中です。お楽しみに。',
  'photos.empty': '写真はまだありません。',

  'about.resume': '履歴書',
  'about.collapse': '折りたたむ',
  'about.expand': '展開',

  // 'links.title': '友達リンク',
  // 'links.desc': 'よく読む・おすすめのサイト。',

  'post.draft': '下書き',
  'post.toc': '目次',

  'footer.copyright': '著作権表示',

  'misc.posts': '記事',
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
