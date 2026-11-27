import type { ImageMetadata } from 'astro';
import matter from 'gray-matter';
import type { Language } from '../types';
import { assetHref } from './paths';

export interface AlbumExif {
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
  exposureCompensation: string;
}

export interface AlbumEntry {
  id: string;
  file: string;
  src: string;
  width?: number;
  height?: number;
  kind: string;
  title: string;
  location: string;
  date: string;
  category: string;
  photographer: string;
  description: string;
  text: string;
  exif: AlbumExif;
  related: string[];
}

export interface PortfolioCard {
  type: 'portfolio';
  id: string;
  folder: string;
  title: string;
  category: string;
  description: string;
  src: string;
  coverFile: string;
  width?: number;
  height?: number;
  count: number;
  photographer: string;
  related: string[];
  body: string;
}

const metadataFiles = import.meta.glob<Record<string, any> | Record<string, any>[]>(
  '/src/content/album/**/*.json', { eager: true, import: 'default' },
);
const portfolioFiles = import.meta.glob<string>(
  '/src/content/album/**/{zh,en,jp,ja}.md', { eager: true, query: '?raw', import: 'default' },
);
const albumAssets = import.meta.glob<string>(
  '/src/content/album/**/*.{jpg,jpeg,png,webp,avif,gif,mp4,webm,mov,m4v,JPG,JPEG,PNG,WEBP,AVIF,GIF,MP4,WEBM,MOV,M4V}',
  { eager: true, query: '?url', import: 'default' },
);
const albumImageMetadata = import.meta.glob<ImageMetadata>(
  '/src/content/album/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP,AVIF,GIF}',
  { eager: true, import: 'default' },
);

const albumContentRoot = '/src/content/album/';

function albumPath(assetPath: string): string {
  if (typeof assetPath !== 'string' || !assetPath.trim()) {
    throw new TypeError(`[Album] Expected an asset path string, received: ${String(assetPath)}`);
  }

  return `${albumContentRoot}${assetPath.replace(/^\/+/, '').replaceAll('\\', '/')}`;
}

function getAlbumAssetUrl(assetPath: string): string {
  const url = albumAssets[albumPath(assetPath)];
  if (!url) throw new Error(`[Album] Asset not found: ${assetPath}`);
  return url;
}

function getAlbumImageDimensions(assetPath: string): { width: number; height: number } | undefined {
  const metadata = albumImageMetadata[albumPath(assetPath)];
  return metadata ? { width: metadata.width, height: metadata.height } : undefined;
}

function idFor(file: string) {
  return file.replace(/\.[^.]+$/, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
}

function localizedField(value: unknown, lang: Language, fallback: string): string {
  if (typeof value === 'string' && value.trim()) return value.trim();
  const languageIndex = lang === 'en' ? 0 : lang === 'zh' ? 1 : 2;
  if (Array.isArray(value)) {
    const candidate = value[languageIndex];
    return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : fallback;
  }
  if (value && typeof value === 'object') {
    const translations = value as Partial<Record<Language, unknown>>;
    const candidate = translations[lang];
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  }
  return fallback;
}

function localizedPhotoTitle(record: Record<string, any>, lang: Language, filename: string): string {
  const languageIndex = lang === 'en' ? 0 : lang === 'zh' ? 1 : 2;
  const fallback = filename.replace(/\.[^.]+$/, '');
  let title: unknown;
  if (Array.isArray(record.title)) {
    title = record.title[languageIndex];
  } else if (typeof record.title === 'string') {
    title = record.title;
  } else if (record.title && typeof record.title === 'object') {
    title = record.title[lang];
  } else {
    title = record[lang]?.title;
  }
  return typeof title === 'string' && title.trim() ? title.trim() : fallback;
}

function photoDescription(record: Record<string, any>): string {
  return typeof record.description === 'string' ? record.description.trim() : '';
}

function localizedPhotoText(record: Record<string, any>, lang: Language): string {
  const value = record.text;
  const languageIndex = lang === 'zh' ? 0 : lang === 'en' ? 1 : 2;
  if (Array.isArray(value)) {
    return typeof value[languageIndex] === 'string' ? value[languageIndex].trim() : '';
  }
  if (value && typeof value === 'object') {
    const localized = value[lang];
    return typeof localized === 'string' ? localized.trim() : '';
  }

  // Before the `text` field was introduced, long descriptions used this field.
  const legacy = record.description;
  const legacyIndex = lang === 'en' ? 0 : lang === 'zh' ? 1 : 2;
  if (Array.isArray(legacy)) return typeof legacy[legacyIndex] === 'string' ? legacy[legacyIndex].trim() : '';
  if (legacy && typeof legacy === 'object') {
    const localized = legacy[lang];
    return typeof localized === 'string' ? localized.trim() : '';
  }
  return typeof legacy === 'string' ? legacy.trim() : '';
}

function photoExif(value: unknown): AlbumExif {
  const record = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const stringValue = (field: string) => record[field] == null ? '' : String(record[field]).trim();
  return {
    camera: stringValue('camera'),
    lens: stringValue('lens'),
    focalLength: stringValue('focalLength'),
    aperture: stringValue('aperture'),
    shutterSpeed: stringValue('shutterSpeed'),
    iso: stringValue('iso'),
    exposureCompensation: stringValue('exposureCompensation'),
  };
}

function portfolioMetadata(folder: string, lang: Language) {
  const languageFile = lang === 'ja' ? 'jp' : lang;
  const source = portfolioFiles[`${albumContentRoot}${folder}/${languageFile}.md`]
    ?? portfolioFiles[`${albumContentRoot}${folder}/ja.md`]
    ?? portfolioFiles[`${albumContentRoot}${folder}/zh.md`];
  if (!source) return { title: folder, category: '', description: '', related: [] as string[], draft: false, heroImage: '', body: '' };

  try {
    const { data, content } = matter(source);
    return {
      title: localizedField(data.title, lang, folder),
      category: typeof data.category === 'string' ? data.category.trim() : '',
      description: localizedField(data.description, lang, ''),
      related: Array.isArray(data.related)
        ? data.related.filter((value: unknown): value is string => typeof value === 'string')
        : [],
      draft: data.draft === true,
      heroImage: typeof data.heroImage === 'string' ? data.heroImage.trim() : '',
      body: content.trim(),
    };
  } catch {
    return { title: folder, category: '', description: '', related: [] as string[], draft: false, heroImage: '', body: '' };
  }
}

export function getAlbumEntries(lang: Language): AlbumEntry[] {
  const entries = new Map<string, AlbumEntry>();
  const hiddenFiles = new Set<string>();

  const addRecords = (directory: string, records: [string, any][]) => {
    for (const [key, item] of records) {
      const filename = typeof item?.file === 'string' ? item.file : key;
      if (!/\.(jpe?g|png|webp|avif|gif|mp4|webm|mov|m4v)$/i.test(filename)) continue;
      const file = [directory, filename].filter(Boolean).join('/');
      if (item?.draft === true) {
        hiddenFiles.add(file);
        continue;
      }
      try {
        entries.set(file, {
          id: idFor(file), file, src: assetHref(getAlbumAssetUrl(file)), kind: item.type ?? 'photo',
          ...getAlbumImageDimensions(file),
          title: localizedPhotoTitle(item, lang, filename),
          location: typeof item.location === 'string' ? item.location.trim() : '',
          date: item.date ?? '', category: item.category ?? '', photographer: item.photographer ?? '',
          description: photoDescription(item), text: localizedPhotoText(item, lang), exif: photoExif(item.exif),
          related: Array.isArray(item.related) ? item.related.filter((value: unknown): value is string => typeof value === 'string') : [],
        });
      } catch { /* Metadata may contain files that have not been added yet. */ }
    }
  };

  for (const [jsonPath, raw] of Object.entries(metadataFiles)) {
    const groups = Array.isArray(raw) ? raw : [raw];
    const directory = jsonPath.slice(albumContentRoot.length).split('/').slice(0, -1).join('/');
    for (const group of groups) {
      addRecords(directory, Object.entries(group ?? {}));
    }
  }

  for (const [path, url] of Object.entries(albumAssets)) {
    const file = path.slice(albumContentRoot.length);
    if (entries.has(file) || hiddenFiles.has(file)) continue;
    const name = file.split('/').at(-1) ?? file;
    const directory = file.includes('/') ? file.split('/')[0] : '';
    const projectCategory = directory ? portfolioMetadata(directory, lang).category : '';
    entries.set(file, {
      id: idFor(file), file, src: assetHref(url), kind: /\.(mp4|webm|mov|m4v)$/i.test(file) ? 'video' : 'photo',
      ...getAlbumImageDimensions(file),
      title: name.replace(/\.[^.]+$/, ''), location: '', date: '', category: projectCategory, photographer: '',
      description: '', text: '', exif: photoExif(undefined), related: [],
    });
  }
  return [...entries.values()];
}

export function getAlbumHomeItems(lang: Language): Array<AlbumEntry | PortfolioCard> {
  const entries = getAlbumEntries(lang);
  const home: Array<AlbumEntry | PortfolioCard> = [...entries];
  const groups = new Map<string, AlbumEntry[]>();
  for (const entry of entries) {
    const [directory] = entry.file.split('/');
    if (!entry.file.includes('/')) continue;
    const group = groups.get(directory) ?? [];
    group.push(entry);
    groups.set(directory, group);
  }
  for (const [directory, photos] of groups) {
    const metadata = portfolioMetadata(directory, lang);
    if (metadata.draft) continue;
    const requestedCover = metadata.heroImage.includes('/') ? metadata.heroImage : `${directory}/${metadata.heroImage}`;
    const cover = photos.find((photo) => photo.file === requestedCover) ?? photos[0];
    if (!cover) continue;
    home.push({
      type: 'portfolio',
      id: idFor(directory),
      folder: directory,
      title: metadata.title,
      category: metadata.category,
      description: metadata.description,
      src: cover.src,
      coverFile: cover.file,
      width: cover.width,
      height: cover.height,
      count: photos.length,
      photographer: cover.photographer,
      related: metadata.related,
      body: metadata.body,
    });
  }
  return home;
}

