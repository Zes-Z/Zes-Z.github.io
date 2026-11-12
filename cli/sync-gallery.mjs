import { readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/content/gallery');
const mediaPattern = /\.(jpe?g|png|webp|avif|gif|mp4|webm|mov|m4v)$/i;
const videoPattern = /\.(mp4|webm|mov|m4v)$/i;
const photoPattern = /\.(jpe?g|png|webp|avif|gif)$/i;

function entriesFrom(value) {
  const groups = Array.isArray(value) ? value : [value];
  return groups.flatMap((group) => Object.entries(group ?? {}));
}

async function readJsonRecords(jsonFile, { tolerateMalformed = false } = {}) {
  try {
    return entriesFrom(JSON.parse(await readFile(jsonFile, 'utf8')));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    if (tolerateMalformed && error instanceof SyntaxError) {
      console.warn(`Ignoring malformed legacy metadata ${path.relative(root, jsonFile)}; portfolio.md is authoritative`);
      return [];
    }
    throw new Error(`Could not parse ${path.relative(root, jsonFile)}: ${error.message}`);
  }
}

async function mediaFiles(directory) {
  return (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && mediaPattern.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

function normalizedRecord(file, saved = {}, defaultCategory = '') {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = {};
  const category = Object.prototype.hasOwnProperty.call(saved, 'category')
    ? saved.category ?? ''
    : defaultCategory;
  const legacyTitle = saved.title && typeof saved.title === 'object' && !Array.isArray(saved.title)
    ? saved.title
    : {};
  const singleTitle = typeof saved.title === 'string' ? saved.title : '';
  const titles = Array.isArray(saved.title)
    ? saved.title
    : [
        saved.en?.title ?? legacyTitle.en ?? singleTitle,
        saved.zh?.title ?? legacyTitle.zh ?? singleTitle,
        saved.ja?.title ?? legacyTitle.ja ?? singleTitle,
      ];
  const legacyDescription = saved.description;
  const textValues = Array.isArray(saved.text) && saved.text.length > 0
    ? saved.text
    : saved.text && typeof saved.text === 'object' && !Array.isArray(saved.text)
      ? [saved.text.zh, saved.text.en, saved.text.ja]
      : Array.isArray(legacyDescription)
        ? [legacyDescription[1], legacyDescription[0], legacyDescription[2]]
        : legacyDescription && typeof legacyDescription === 'object'
          ? [legacyDescription.zh, legacyDescription.en, legacyDescription.ja]
          : ['', '', ''];
  const savedExif = saved.exif && typeof saved.exif === 'object' && !Array.isArray(saved.exif)
    ? saved.exif
    : {};
  const exifValue = (key) => {
    const value = savedExif[key];
    return value == null ? '' : String(value);
  };
  const camera = exifValue('camera');
  return {
    draft: typeof saved.draft === 'boolean' ? saved.draft : false,
    type: videoPattern.test(file) ? 'video' : 'photo',
    category,
    tag: Array.isArray(saved.tag) ? saved.tag : [],
    location: typeof saved.location === 'string' ? saved.location : '',
    date: saved.date ?? '',
    photographer: saved.photographer ?? 'zes',
    title: [0, 1, 2].map((index) => typeof titles[index] === 'string' ? titles[index] : ''),
    description: typeof legacyDescription === 'string' ? legacyDescription : '',
    text: [0, 1, 2].map((index) => typeof textValues[index] === 'string' ? textValues[index] : ''),
    exif: {
      camera: camera.toLowerCase() === 'canon eos r8' ? 'Canon EOS R8' : camera || 'Canon EOS R8',
      lens: exifValue('lens'),
      focalLength: exifValue('focalLength'),
      aperture: exifValue('aperture'),
      shutterSpeed: exifValue('shutterSpeed'),
      iso: exifValue('iso'),
      exposureCompensation: exifValue('exposureCompensation'),
    },
    related: Array.isArray(saved.related) ? saved.related : [],
  };
}

function objectId(file) {
  return file
    .replace(/\.[^.]+$/, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');
}

function endOfJsonString(source, start) {
  let escaped = false;
  for (let index = start + 1; index < source.length; index += 1) {
    const char = source[index];
    if (escaped) escaped = false;
    else if (char === '\\') escaped = true;
    else if (char === '"') return index + 1;
  }
  return -1;
}

function endOfJsonObject(source, start) {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === '{') depth += 1;
    else if (char === '}' && --depth === 0) return index + 1;
  }
  return -1;
}

function embeddedPhotoEntries(body) {
  const entries = [];
  let cursor = 0;
  while (cursor < body.length) {
    const start = body.indexOf('"', cursor);
    if (start < 0) break;
    const keyEnd = endOfJsonString(body, start);
    if (keyEnd < 0) break;

    let file;
    try {
      file = JSON.parse(body.slice(start, keyEnd));
    } catch {
      cursor = keyEnd;
      continue;
    }

    let valueStart = keyEnd;
    while (/\s/.test(body[valueStart] ?? '')) valueStart += 1;
    if (body[valueStart] !== ':') {
      cursor = keyEnd;
      continue;
    }
    valueStart += 1;
    while (/\s/.test(body[valueStart] ?? '')) valueStart += 1;
    if (typeof file !== 'string' || !mediaPattern.test(file) || body[valueStart] !== '{') {
      cursor = keyEnd;
      continue;
    }

    const end = endOfJsonObject(body, valueStart);
    if (end < 0) {
      cursor = keyEnd;
      continue;
    }
    try {
      const record = JSON.parse(body.slice(valueStart, end));
      if (record && typeof record === 'object' && !Array.isArray(record)) {
        entries.push({ file, record, start, end });
        cursor = end;
        continue;
      }
    } catch {
      // A Markdown example or prose block may resemble metadata; leave it untouched.
    }
    cursor = keyEnd;
  }
  return entries;
}

function formatPhotoEntry(file, record) {
  const lines = JSON.stringify(record, null, 2).split('\n');
  return `${JSON.stringify(file)}: ${lines[0]}\n${lines.slice(1).map((line) => `  ${line}`).join('\n')}`;
}

function syncPhotoEntriesInBody(body, photos, files) {
  const fileSet = new Set(files);
  const entries = embeddedPhotoEntries(body);
  const replacements = [];
  const present = new Set();

  for (const entry of entries) {
    if (fileSet.has(entry.file) && photos[entry.file]) {
      present.add(entry.file);
      const lineStart = body.lastIndexOf('\n', entry.start - 1) + 1;
      const linePrefix = body.slice(lineStart, entry.start);
      const isOwnLine = /^\s*$/.test(linePrefix);
      replacements.push({
        start: isOwnLine ? lineStart : entry.start,
        end: entry.end,
        value: `${isOwnLine ? '  ' : ''}${formatPhotoEntry(entry.file, photos[entry.file])}`,
      });
      continue;
    }

    let { start, end } = entry;
    const following = body.slice(end).match(/^\s*,/);
    if (following) end += following[0].length;
    else {
      const preceding = body.slice(0, start).match(/,\s*$/);
      if (preceding) start -= preceding[0].length;
    }
    replacements.push({ start, end, value: '' });
  }

  let updated = body;
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    updated = `${updated.slice(0, replacement.start)}${replacement.value}${updated.slice(replacement.end)}`;
  }

  const missing = files.filter((file) => !present.has(file));
  if (!updated.trim().startsWith('[') || !updated.trimEnd().endsWith(']')) {
    updated = updated.trim() ? `[\n${updated.trim()}\n]` : '[\n\n]';
  }
  if (missing.length === 0) return updated;

  const closing = updated.lastIndexOf(']');
  const beforeClosing = updated.slice(0, closing).trimEnd();
  const separator = beforeClosing.endsWith('[') || beforeClosing.endsWith(',') ? '\n\n' : ',\n\n';
  const additions = missing.map((file) => `  ${formatPhotoEntry(file, photos[file])}`).join(',\n\n');
  return `${beforeClosing}${separator}${additions}\n${updated.slice(closing)}`;
}

function collapseLocalizedValue(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const translations = Object.values(value).filter((item) => typeof item === 'string');
  const unique = new Set(translations);
  if (unique.size <= 1) return translations[0] ?? '';
  return value;
}

async function syncRootDirectory(directory) {
  const jsonFile = path.join(directory, 'photo-video.json');
  const oldByFile = new Map(await readJsonRecords(jsonFile));
  const files = await mediaFiles(directory);
  const records = Object.fromEntries(
    files.map((file) => [file, normalizedRecord(file, oldByFile.get(file))]),
  );
  await writeFile(jsonFile, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
  console.log(`Updated ${path.relative(root, jsonFile)} (${files.length} entries)`);
}

async function syncPortfolioDirectory(directory) {
  const markdownFile = path.join(directory, 'portfolio.md');
  const legacyJsonFile = path.join(directory, 'portfolio.json');
  const legacyEntries = (await readJsonRecords(legacyJsonFile, { tolerateMalformed: true }))
    .map(([key, record]) => [record?.file ?? key, record]);

  let body = '';
  let data = {};
  try {
    const source = await readFile(markdownFile, 'utf8');
    const parsed = matter(source);
    body = parsed.content;
    data = parsed.data;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw new Error(`Could not parse ${path.relative(root, markdownFile)}: ${error.message}`);
    }
  }

  const oldPhotos = new Map(legacyEntries);
  if (data.photos && typeof data.photos === 'object' && !Array.isArray(data.photos)) {
    for (const [file, record] of Object.entries(data.photos)) oldPhotos.set(file, record);
  }
  for (const { file, record } of embeddedPhotoEntries(body)) oldPhotos.set(file, record);

  const files = await mediaFiles(directory);
  const category = typeof data.category === 'string' ? data.category : '';
  const folder = path.relative(root, directory).split(path.sep).join('/');
  const oldPhotoIds = new Set(
    [...oldPhotos.keys()].map((file) => objectId(path.posix.join(folder, file))),
  );
  const currentPhotoIds = new Map(
    files.map((file) => [file, objectId(path.posix.join(folder, file))]),
  );
  const photos = Object.fromEntries(files.map((file) => {
    const saved = oldPhotos.get(file) ?? {};
    const selfId = currentPhotoIds.get(file);
    const peerIds = [...currentPhotoIds.values()].filter((id) => id !== selfId);
    const customRelated = Array.isArray(saved.related)
      ? saved.related.filter((id) => typeof id === 'string' && id !== selfId && !oldPhotoIds.has(id))
      : [];
    const record = normalizedRecord(file, saved, category);
    record.related = [...new Set([...customRelated, ...peerIds])];
    return [file, record];
  }));

  const folderName = path.basename(directory);
  const frontmatter = {
    title: collapseLocalizedValue(data.title) || folderName,
    description: collapseLocalizedValue(data.description) ?? '',
    pubDate: data.pubDate ?? new Date().toISOString().slice(0, 10),
    category,
    tag: Array.isArray(data.tag) ? data.tag : data.tag == null || data.tag === '' ? [] : [String(data.tag)],
    heroImage: typeof data.heroImage === 'string' && photoPattern.test(data.heroImage.trim()) && files.includes(data.heroImage.trim()) && !photos[data.heroImage.trim()]?.draft
      ? data.heroImage.trim()
      : files.find((file) => photoPattern.test(file) && !photos[file]?.draft) ?? ' ',
    draft: typeof data.draft === 'boolean' ? data.draft : false,
  };
  for (const [key, value] of Object.entries(data)) {
    if (!['title', 'description', 'pubDate', 'category', 'tag', 'heroImage', 'draft', 'photos'].includes(key)) {
      frontmatter[key] = value;
    }
  }

  const updatedBody = syncPhotoEntriesInBody(body, photos, files);
  await writeFile(markdownFile, matter.stringify(updatedBody, frontmatter), 'utf8');

  try {
    await unlink(legacyJsonFile);
    console.log(`Migrated and removed ${path.relative(root, legacyJsonFile)}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  console.log(`Updated ${path.relative(root, markdownFile)} (${files.length} photos)`);
}

async function walk(directory, isRoot = false) {
  if (isRoot) await syncRootDirectory(directory);
  else await syncPortfolioDirectory(directory);

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) await walk(path.join(directory, entry.name));
  }
}

await walk(root, true);
