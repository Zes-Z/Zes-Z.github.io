
import { readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import exifr from 'exifr';

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/content/album',
);

const mediaPattern = /\.(jpe?g|png|webp|avif|gif|mp4|webm|mov|m4v)$/i;
const videoPattern = /\.(mp4|webm|mov|m4v)$/i;
const photoPattern = /\.(jpe?g|png|webp|avif|gif)$/i;

// 只提取 Gallery 展示需要的字段。
const EXIF_FIELDS = [
  'Make',
  'Model',
  'LensModel',
  'FocalLength',
  'FNumber',
  'ExposureTime',
  'ISO',
  'ExposureCompensation',
  'DateTimeOriginal',
  'CreateDate',
];

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
      console.warn(
        `Ignoring malformed metadata ${path.relative(root, jsonFile)}`,
      );
      return [];
    }

    throw new Error(
      `Could not parse ${path.relative(root, jsonFile)}: ${error.message}`,
    );
  }
}

async function mediaFiles(directory) {
  return (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && mediaPattern.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

// 快门速度转换：0.002 -> 1/500s
function formatShutterSpeed(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return '';
  }

  if (value >= 1) {
    return `${Number(value.toFixed(2))}s`;
  }

  const denominator = Math.round(1 / value);
  return denominator > 0 ? `1/${denominator}s` : `${value}s`;
}

// 曝光补偿转换：0.3 -> +0.3 EV
function formatExposureCompensation(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '';

  const formatted = Number(value.toFixed(2));
  return `${formatted > 0 ? '+' : ''}${formatted} EV`;
}

// 拍摄日期转换
function formatExifDate(value) {
  if (!value) return '';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  // 使用本地日期，避免时区转换导致日期偏移。
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  return date.toISOString().slice(0, 10);
}

/**
 * 从图片文件中读取 EXIF。
 * 没有 EXIF 或读取失败时返回空对象。
 */
async function readExif(filePath) {
  try {
    const data = await exifr.parse(filePath, EXIF_FIELDS);

    if (!data) return {};

    const make = typeof data.Make === 'string'
      ? data.Make.trim()
      : '';

    const model = typeof data.Model === 'string'
      ? data.Model.trim()
      : '';

    // 避免出现 Canon Canon EOS R8 这样的重复品牌名。
    const camera =
      model && make &&
      model.toLowerCase().startsWith(make.toLowerCase())
        ? model
        : [make, model].filter(Boolean).join(' ');

    return {
      camera,

      lens:
        typeof data.LensModel === 'string'
          ? data.LensModel.trim()
          : '',

      focalLength:
        typeof data.FocalLength === 'number'
          ? `${data.FocalLength}mm`
          : '',

      aperture:
        typeof data.FNumber === 'number'
          ? `f/${Number(data.FNumber.toFixed(1))}`
          : '',

      shutterSpeed: formatShutterSpeed(data.ExposureTime),

      iso:
        typeof data.ISO === 'number' || typeof data.ISO === 'string'
          ? String(data.ISO)
          : '',

      exposureCompensation: formatExposureCompensation(
        data.ExposureCompensation,
      ),

      dateTaken: formatExifDate(
        data.DateTimeOriginal ?? data.CreateDate,
      ),
    };
  } catch (error) {
    console.warn(
      `Could not read EXIF from ${filePath}: ${error.message}`,
    );

    return {};
  }
}

function normalizedRecord(
  file,
  saved = {},
  defaultCategory = '',
  extractedExif = {},
) {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
    saved = {};
  }

  const category = Object.prototype.hasOwnProperty.call(saved, 'category')
    ? saved.category ?? ''
    : defaultCategory;

  const legacyTitle =
    saved.title &&
    typeof saved.title === 'object' &&
    !Array.isArray(saved.title)
      ? saved.title
      : {};

  const singleTitle =
    typeof saved.title === 'string' ? saved.title : '';

  const titles = Array.isArray(saved.title)
    ? saved.title
    : [
        saved.en?.title ?? legacyTitle.en ?? singleTitle,
        saved.zh?.title ?? legacyTitle.zh ?? singleTitle,
        saved.ja?.title ?? legacyTitle.ja ?? singleTitle,
      ];

  const legacyDescription = saved.description;

  const textValues =
    Array.isArray(saved.text) && saved.text.length > 0
      ? saved.text
      : saved.text &&
          typeof saved.text === 'object' &&
          !Array.isArray(saved.text)
        ? [saved.text.zh, saved.text.en, saved.text.ja]
        : Array.isArray(legacyDescription)
          ? [
              legacyDescription[1],
              legacyDescription[0],
              legacyDescription[2],
            ]
          : legacyDescription &&
              typeof legacyDescription === 'object'
            ? [
                legacyDescription.zh,
                legacyDescription.en,
                legacyDescription.ja,
              ]
            : ['', '', ''];

  const savedExif =
    saved.exif &&
    typeof saved.exif === 'object' &&
    !Array.isArray(saved.exif)
      ? saved.exif
      : {};

  // 人工维护的数据优先于自动读取的数据。
  const mergedExif = {};

  for (const key of [
    'camera',
    'lens',
    'focalLength',
    'aperture',
    'shutterSpeed',
    'iso',
    'exposureCompensation',
  ]) {
    const manualValue = savedExif[key];
    const automaticValue = extractedExif[key];

    // 旧版本默认的 Canon EOS R8 视为占位值。
    const isLegacyCameraPlaceholder =
      key === 'camera' &&
      manualValue === 'Canon EOS R8' &&
      automaticValue;

    mergedExif[key] =
      manualValue !== undefined &&
      manualValue !== null &&
      manualValue !== '' &&
      !isLegacyCameraPlaceholder
        ? String(manualValue)
        : automaticValue == null
          ? ''
          : String(automaticValue);
  }

  return {
    draft: typeof saved.draft === 'boolean'
      ? saved.draft
      : false,

    type: videoPattern.test(file) ? 'video' : 'photo',

    category,

    tag: Array.isArray(saved.tag) ? saved.tag : [],

    location:
      typeof saved.location === 'string'
        ? saved.location
        : '',

    date: saved.date || extractedExif.dateTaken || '',

    photographer: saved.photographer ?? 'zes',

    title: [0, 1, 2].map((index) =>
      typeof titles[index] === 'string' ? titles[index] : '',
    ),

    description:
      typeof legacyDescription === 'string'
        ? legacyDescription
        : '',

    text: [0, 1, 2].map((index) =>
      typeof textValues[index] === 'string'
        ? textValues[index]
        : '',
    ),

    exif: mergedExif,

    related: Array.isArray(saved.related)
      ? saved.related
      : [],
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

  for (
    let index = start + 1;
    index < source.length;
    index += 1
  ) {
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

    while (/\s/.test(body[valueStart] ?? '')) {
      valueStart += 1;
    }

    if (body[valueStart] !== ':') {
      cursor = keyEnd;
      continue;
    }

    valueStart += 1;

    while (/\s/.test(body[valueStart] ?? '')) {
      valueStart += 1;
    }

    if (
      typeof file !== 'string' ||
      !mediaPattern.test(file) ||
      body[valueStart] !== '{'
    ) {
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

      if (
        record &&
        typeof record === 'object' &&
        !Array.isArray(record)
      ) {
        entries.push({
          file,
          record,
          start,
          end,
        });

        cursor = end;
        continue;
      }
    } catch {
      // Markdown 示例或普通文本可能与元数据结构相似。
      // 保持原文不动。
    }

    cursor = keyEnd;
  }

  return entries;
}

async function syncRootDirectory(directory) {
  const jsonFile = path.join(directory, 'photo-video.json');
  const oldByFile = new Map(await readJsonRecords(jsonFile));
  const files = await mediaFiles(directory);
  const records = {};

  // Gallery 根目录中的普通图片也读取 EXIF。
  for (const file of files) {
    const saved = oldByFile.get(file) ?? {};

    const extractedExif = photoPattern.test(file)
      ? await readExif(path.join(directory, file))
      : {};

    records[file] = normalizedRecord(
      file,
      saved,
      '',
      extractedExif,
    );
  }

  // Keep metadata for temporarily absent root photos untouched.
  for (const [file, saved] of oldByFile) {
    if (!(file in records)) records[file] = saved;
  }

  await writeFile(
    jsonFile,
    `${JSON.stringify(records, null, 2)}\n`,
    'utf8',
  );

  const photoCount = files.filter(
    (file) => photoPattern.test(file),
  ).length;

  console.log(
    `Updated ${path.relative(root, jsonFile)} (${files.length} entries; EXIF checked for ${photoCount} photos)`,
  );
}


async function syncPortfolioDirectory(directory) {
  const jsonFile = path.join(directory, 'portfolio.json');
  const legacyMarkdown = path.join(directory, 'portfolio.md');
  const languageFiles = ['zh', 'en', 'jp'].map((lang) => path.join(directory, `${lang}.md`));
  const savedPhotos = new Map(await readJsonRecords(jsonFile));
  let legacyData = {};
  let legacyBody = '';

  try {
    const parsed = matter(await readFile(legacyMarkdown, 'utf8'));
    legacyData = parsed.data;
    legacyBody = parsed.content;
    if (legacyData.photos && typeof legacyData.photos === 'object' && !Array.isArray(legacyData.photos)) {
      for (const [file, record] of Object.entries(legacyData.photos)) {
        if (!savedPhotos.has(file)) savedPhotos.set(file, record);
      }
    }
    for (const { file, record } of embeddedPhotoEntries(legacyBody)) {
      if (!savedPhotos.has(file)) savedPhotos.set(file, record);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const existingMarkdown = [];
  for (const file of languageFiles) {
    try {
      existingMarkdown.push(matter(await readFile(file, 'utf8')));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      existingMarkdown.push(null);
    }
  }
  const sourceData = existingMarkdown.find(Boolean)?.data ?? legacyData;
  const folderName = path.basename(directory);
  const files = await mediaFiles(directory);
  const category = typeof sourceData.category === 'string' ? sourceData.category : '';
  const folder = path.relative(root, directory).split(path.sep).join('/');
  const oldPhotoIds = new Set([...savedPhotos.keys()].map((file) => objectId(path.posix.join(folder, file))));
  const currentPhotoIds = new Map(files.map((file) => [file, objectId(path.posix.join(folder, file))]));
  const photos = {};

  for (const file of files) {
    const saved = savedPhotos.get(file) ?? {};
    const selfId = currentPhotoIds.get(file);
    const peerIds = [...currentPhotoIds.values()].filter((id) => id !== selfId);
    const customRelated = Array.isArray(saved.related)
      ? saved.related.filter((id) => typeof id === 'string' && id !== selfId && !oldPhotoIds.has(id))
      : [];
    const extractedExif = photoPattern.test(file) ? await readExif(path.join(directory, file)) : {};
    const record = normalizedRecord(file, saved, category, extractedExif);
    record.related = [...new Set([...customRelated, ...peerIds])];
    photos[file] = record;
  }

  await writeFile(jsonFile, `${JSON.stringify(photos, null, 2)}\n`, 'utf8');

  let legacyProse = legacyBody;
  for (const entry of embeddedPhotoEntries(legacyBody).reverse()) {
    legacyProse = `${legacyProse.slice(0, entry.start)}${legacyProse.slice(entry.end)}`;
  }
  legacyProse = legacyProse
    .replace(/^\s*\[/u, '')
    .replace(/\]\s*$/u, '')
    .replace(/^\s*,\s*$/gmu, '')
    .replace(/,\s*$/gmu, '')
    .trim();
  const fallbackCover = files.find((name) => photoPattern.test(name) && !photos[name]?.draft) ?? ' ';
  for (const [index, file] of languageFiles.entries()) {
    if (existingMarkdown[index]) {
      const current = existingMarkdown[index];
      const cover = typeof current.data.heroImage === 'string' ? current.data.heroImage.trim() : '';
      if (!files.includes(cover) || !photoPattern.test(cover) || photos[cover]?.draft) {
        await writeFile(file, matter.stringify(current.content, { ...current.data, heroImage: fallbackCover }), 'utf8');
      }
      continue;
    }
    const lang = ['zh', 'en', 'jp'][index];
    const title = sourceData.title && typeof sourceData.title === 'object'
      ? sourceData.title[lang === 'jp' ? 'ja' : lang] ?? folderName
      : sourceData.title ?? folderName;
    const description = sourceData.description && typeof sourceData.description === 'object'
      ? sourceData.description[lang === 'jp' ? 'ja' : lang] ?? ''
      : sourceData.description ?? '';
    const frontmatter = {
      ...sourceData,
      title,
      description,
      pubDate: sourceData.pubDate ?? new Date().toISOString().slice(0, 10),
      category,
      tag: Array.isArray(sourceData.tag) ? sourceData.tag : [],
      heroImage: typeof sourceData.heroImage === 'string' && photoPattern.test(sourceData.heroImage.trim()) && files.includes(sourceData.heroImage.trim())
        ? sourceData.heroImage.trim()
        : fallbackCover,
      draft: sourceData.draft === true,
    };
    delete frontmatter.photos;
    await writeFile(file, matter.stringify(index === 0 && legacyProse ? `\n${legacyProse}\n` : '\n', frontmatter), 'utf8');
  }
  if (legacyBody || Object.keys(legacyData).length) await unlink(legacyMarkdown);
  console.log(`Updated ${path.relative(root, jsonFile)} (${files.length} photos)`);
}
async function walk(directory, isRoot = false) {
  if (isRoot) {
    await syncRootDirectory(directory);
  } else {
    await syncPortfolioDirectory(directory);
  }

  for (
    const entry of await readdir(
      directory,
      { withFileTypes: true },
    )
  ) {
    if (entry.isDirectory()) {
      await walk(
        path.join(directory, entry.name),
      );
    }
  }
}

await walk(root, true);
