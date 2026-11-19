
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
        `Ignoring malformed legacy metadata ${path.relative(root, jsonFile)}; portfolio.md is authoritative`,
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

function formatPhotoEntry(file, record) {
  const lines = JSON.stringify(record, null, 2).split('\n');

  return `${JSON.stringify(file)}: ${lines[0]}\n${lines
    .slice(1)
    .map((line) => `  ${line}`)
    .join('\n')}`;
}

function syncPhotoEntriesInBody(body, photos, files) {
  const fileSet = new Set(files);
  const entries = embeddedPhotoEntries(body);
  const replacements = [];
  const present = new Set();

  for (const entry of entries) {
    if (fileSet.has(entry.file) && photos[entry.file]) {
      present.add(entry.file);

      const lineStart =
        body.lastIndexOf('\n', entry.start - 1) + 1;

      const linePrefix = body.slice(lineStart, entry.start);

      const isOwnLine = /^\s*$/.test(linePrefix);

      replacements.push({
        start: isOwnLine ? lineStart : entry.start,
        end: entry.end,
        value: `${isOwnLine ? '  ' : ''}${formatPhotoEntry(
          entry.file,
          photos[entry.file],
        )}`,
      });

      continue;
    }

    let { start, end } = entry;

    const following = body.slice(end).match(/^\s*,/);

    if (following) {
      end += following[0].length;
    } else {
      const preceding = body.slice(0, start).match(/,\s*$/);

      if (preceding) {
        start -= preceding[0].length;
      }
    }

    replacements.push({
      start,
      end,
      value: '',
    });
  }

  let updated = body;

  for (
    const replacement of replacements.sort(
      (a, b) => b.start - a.start,
    )
  ) {
    updated = `${updated.slice(
      0,
      replacement.start,
    )}${replacement.value}${updated.slice(
      replacement.end,
    )}`;
  }

  const missing = files.filter(
    (file) => !present.has(file),
  );

  if (
    !updated.trim().startsWith('[') ||
    !updated.trimEnd().endsWith(']')
  ) {
    updated = updated.trim()
      ? `[\n${updated.trim()}\n]`
      : '[\n\n]';
  }

  if (missing.length === 0) return updated;

  const closing = updated.lastIndexOf(']');

  const beforeClosing = updated
    .slice(0, closing)
    .trimEnd();

  const separator =
    beforeClosing.endsWith('[') ||
    beforeClosing.endsWith(',')
      ? '\n\n'
      : ',\n\n';

  const additions = missing
    .map((file) =>
      `  ${formatPhotoEntry(file, photos[file])}`,
    )
    .join(',\n\n');

  return `${beforeClosing}${separator}${additions}\n${updated.slice(
    closing,
  )}`;
}

function collapseLocalizedValue(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return value;
  }

  const translations = Object.values(value).filter(
    (item) => typeof item === 'string',
  );

  const unique = new Set(translations);

  if (unique.size <= 1) {
    return translations[0] ?? '';
  }

  return value;
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
  const markdownFile = path.join(
    directory,
    'portfolio.md',
  );

  const legacyJsonFile = path.join(
    directory,
    'portfolio.json',
  );

  const legacyEntries = (
    await readJsonRecords(
      legacyJsonFile,
      { tolerateMalformed: true },
    )
  ).map(([key, record]) => [
    record?.file ?? key,
    record,
  ]);

  let body = '';
  let data = {};

  try {
    const source = await readFile(
      markdownFile,
      'utf8',
    );

    const parsed = matter(source);

    body = parsed.content;
    data = parsed.data;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw new Error(
        `Could not parse ${path.relative(root, markdownFile)}: ${error.message}`,
      );
    }
  }

  const oldPhotos = new Map(legacyEntries);

  if (
    data.photos &&
    typeof data.photos === 'object' &&
    !Array.isArray(data.photos)
  ) {
    for (const [file, record] of Object.entries(data.photos)) {
      oldPhotos.set(file, record);
    }
  }

  for (const { file, record } of embeddedPhotoEntries(body)) {
    oldPhotos.set(file, record);
  }

  const files = await mediaFiles(directory);

  const category =
    typeof data.category === 'string'
      ? data.category
      : '';

  const folder = path
    .relative(root, directory)
    .split(path.sep)
    .join('/');

  const oldPhotoIds = new Set(
    [...oldPhotos.keys()].map((file) =>
      objectId(path.posix.join(folder, file)),
    ),
  );

  const currentPhotoIds = new Map(
    files.map((file) => [
      file,
      objectId(path.posix.join(folder, file)),
    ]),
  );

  // 逐张读取图片 EXIF。
  // 视频不读取，单张图片失败不会中断整个目录同步。
  const photos = {};

  for (const file of files) {
    const saved = oldPhotos.get(file) ?? {};

    const selfId = currentPhotoIds.get(file);

    const peerIds = [
      ...currentPhotoIds.values(),
    ].filter((id) => id !== selfId);

    const customRelated = Array.isArray(saved.related)
      ? saved.related.filter(
          (id) =>
            typeof id === 'string' &&
            id !== selfId &&
            !oldPhotoIds.has(id),
        )
      : [];

    // 只有图片才读取 EXIF。
    const extractedExif = photoPattern.test(file)
      ? await readExif(
          path.join(directory, file),
        )
      : {};

    const record = normalizedRecord(
      file,
      saved,
      category,
      extractedExif,
    );

    record.related = [
      ...new Set([
        ...customRelated,
        ...peerIds,
      ]),
    ];

    photos[file] = record;
  }

  const folderName = path.basename(directory);

  const frontmatter = {
    title:
      collapseLocalizedValue(data.title) ||
      folderName,

    description:
      collapseLocalizedValue(data.description) ?? '',

    pubDate:
      data.pubDate ??
      new Date().toISOString().slice(0, 10),

    category,

    tag:
      Array.isArray(data.tag)
        ? data.tag
        : data.tag == null || data.tag === ''
          ? []
          : [String(data.tag)],

    heroImage:
      typeof data.heroImage === 'string' &&
      photoPattern.test(data.heroImage.trim()) &&
      files.includes(data.heroImage.trim()) &&
      !photos[data.heroImage.trim()]?.draft
        ? data.heroImage.trim()
        : files.find(
            (file) =>
              photoPattern.test(file) &&
              !photos[file]?.draft,
          ) ?? ' ',

    draft:
      typeof data.draft === 'boolean'
        ? data.draft
        : false,
  };

  for (const [key, value] of Object.entries(data)) {
    if (
      ![
        'title',
        'description',
        'pubDate',
        'category',
        'tag',
        'heroImage',
        'draft',
        'photos',
      ].includes(key)
    ) {
      frontmatter[key] = value;
    }
  }

  const updatedBody = syncPhotoEntriesInBody(
    body,
    photos,
    files,
  );

  await writeFile(
    markdownFile,
    matter.stringify(
      updatedBody,
      frontmatter,
    ),
    'utf8',
  );

  // 迁移完成后删除旧版 JSON。
  try {
    await unlink(legacyJsonFile);

    console.log(
      `Migrated and removed ${path.relative(root, legacyJsonFile)}`,
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  console.log(
    `Updated ${path.relative(root, markdownFile)} (${files.length} photos)`,
  );
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
