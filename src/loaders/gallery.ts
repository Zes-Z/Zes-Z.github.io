
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';

import {
  lstat,
  readFile,
  readdir,
} from 'node:fs/promises';

import {
  extname,
  join,
  relative,
} from 'node:path';

import { fileURLToPath } from 'node:url';

// =====================================================
// 1. Basic schemas
// =====================================================

const idSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'ID must contain lowercase letters, numbers or hyphens.',
  );

const fileNameSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) =>
      !value.includes('/') &&
      !value.includes('\\') &&
      !value.includes('\0') &&
      value !== '.' &&
      value !== '..',
    'Only filenames are allowed.',
  );

const dateSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    'Date must use YYYY-MM-DD format.',
  )
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);

    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, 'Invalid calendar date.');

const categorySchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Category must be a lowercase slug.',
  );

const creatorSchema = z
  .string()
  .trim()
  .min(1)
  .optional();

// =====================================================
// 2. Localized metadata
// =====================================================

const localeSchema = z.object({
  title: z.string().trim().min(1).optional(),
  location: z.string().trim().optional(),
  desc: z.string().trim().optional(),
  text: z.string().trim().optional(),
}).strict();

const localeFields = {
  en: localeSchema.default({}),
  zh: localeSchema.default({}),
  ja: localeSchema.default({}),
};

function requireLocalizedTitle(
  data: {
    en: z.infer<typeof localeSchema>;
    zh: z.infer<typeof localeSchema>;
    ja: z.infer<typeof localeSchema>;
  },
  ctx: z.RefinementCtx,
) {
  const hasTitle = [
    data.en.title,
    data.zh.title,
    data.ja.title,
  ].some((title) => Boolean(title?.trim()));

  if (!hasTitle) {
    ctx.addIssue({
      code: 'custom',
      message: 'At least one language must provide a title.',
    });
  }
}

// =====================================================
// 3. Root gallery JSON schemas
// =====================================================

const rawRootPhotoSchema = z.object({
  type: z.literal('photo'),
  file: fileNameSchema,
  date: dateSchema.optional(),
  category: categorySchema,
  by: creatorSchema,
  ...localeFields,
}).strict();

const rawRootVideoSchema = z.object({
  type: z.literal('video'),
  file: fileNameSchema,
  poster: fileNameSchema.optional(),
  date: dateSchema.optional(),
  category: categorySchema,
  by: creatorSchema,
  ...localeFields,
}).strict();

const rawRootMediaSchema = z
  .discriminatedUnion('type', [
    rawRootPhotoSchema,
    rawRootVideoSchema,
  ])
  .superRefine(requireLocalizedTitle);

const rawRootFileSchema = z.object({
  version: z.literal(1),

  items: z.record(
    z.string(),
    rawRootMediaSchema,
  ),
}).strict();

// =====================================================
// 4. Portfolio JSON schemas
// =====================================================

const rawPortfolioPhotoSchema = z.object({
  id: idSchema,
  type: z.literal('photo'),
  file: fileNameSchema,
  date: dateSchema.optional(),
  by: creatorSchema,
  ...localeFields,
}).strict();

const rawPortfolioVideoSchema = z.object({
  id: idSchema,
  type: z.literal('video'),
  file: fileNameSchema,
  poster: fileNameSchema.optional(),
  date: dateSchema.optional(),
  by: creatorSchema,
  ...localeFields,
}).strict();

const rawPortfolioItemSchema = z.discriminatedUnion(
  'type',
  [
    rawPortfolioPhotoSchema,
    rawPortfolioVideoSchema,
  ],
);

const rawPortfolioMetadataSchema = z.object({
  type: z.literal('portfolio'),
  date: dateSchema.optional(),
  category: categorySchema,
  by: creatorSchema,
  ...localeFields,
}).strict().superRefine(requireLocalizedTitle);

const rawPortfolioFileSchema = z.object({
  version: z.literal(1),

  portfolio: rawPortfolioMetadataSchema,

  items: z.array(
    rawPortfolioItemSchema,
  ).min(1),
}).strict().superRefine((data, ctx) => {
  // The first item must be a photograph.
  if (data.items[0]?.type !== 'photo') {
    ctx.addIssue({
      code: 'custom',
      path: ['items', 0],
      message: 'The first portfolio item must be a photo.',
    });
  }

  // IDs must be unique inside the portfolio.
  const ids = new Set<string>();

  data.items.forEach((item, index) => {
    if (ids.has(item.id)) {
      ctx.addIssue({
        code: 'custom',
        path: ['items', index, 'id'],
        message: `Duplicate media ID: ${item.id}`,
      });
    }

    ids.add(item.id);
  });
});

// =====================================================
// 5. Normalized media schemas
// =====================================================

const normalizedMediaFields = {
  file: fileNameSchema,
  assetPath: z.string().min(1),
  date: dateSchema.optional(),
  by: creatorSchema,
  ...localeFields,
};

// Independent photograph

const galleryPhotoSchema = z.object({
  type: z.literal('photo'),
  ...normalizedMediaFields,
  category: categorySchema,
}).strict();

// Independent video

const galleryVideoSchema = z.object({
  type: z.literal('video'),
  ...normalizedMediaFields,
  category: categorySchema,
  poster: fileNameSchema.optional(),
  posterAssetPath: z.string().optional(),
}).strict();

// Portfolio photograph

const portfolioPhotoSchema = z.object({
  id: idSchema,
  type: z.literal('photo'),
  ...normalizedMediaFields,
  category: categorySchema,
}).strict();

// Portfolio video

const portfolioVideoSchema = z.object({
  id: idSchema,
  type: z.literal('video'),
  ...normalizedMediaFields,
  category: categorySchema,
  poster: fileNameSchema.optional(),
  posterAssetPath: z.string().optional(),
}).strict();

const normalizedPortfolioMediaSchema =
  z.discriminatedUnion('type', [
    portfolioPhotoSchema,
    portfolioVideoSchema,
  ]);

// Portfolio itself

const galleryPortfolioSchema = z.object({
  type: z.literal('portfolio'),

  date: dateSchema.optional(),
  category: categorySchema,
  by: creatorSchema,

  ...localeFields,

  items: z.array(
    normalizedPortfolioMediaSchema,
  ).min(1),

  // The cover must always be a photograph.
  cover: portfolioPhotoSchema,
}).strict();

// Unified Gallery Entry schema

export const galleryEntrySchema = z.discriminatedUnion(
  'type',
  [
    galleryPhotoSchema,
    galleryVideoSchema,
    galleryPortfolioSchema,
  ],
);

// =====================================================
// 6. Supported media formats
// =====================================================

const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.gif',
]);

const VIDEO_EXTENSIONS = new Set([
  '.mp4',
  '.webm',
  '.mov',
  '.m4v',
]);

// =====================================================
// 7. Helper functions
// =====================================================

function assetPath(...parts: string[]) {
  return parts
    .filter(Boolean)
    .join('/')
    .replaceAll('\\', '/');
}

async function checkMediaFile(
  directory: string,
  filename: string,
  type: 'photo' | 'video',
  label: string,
) {
  const extension = extname(filename).toLowerCase();

  const allowed =
    type === 'photo'
      ? IMAGE_EXTENSIONS
      : VIDEO_EXTENSIONS;

  if (!allowed.has(extension)) {
    throw new Error(
      `[Gallery] Unsupported ${type} format: ${filename} (${label})`,
    );
  }

  const absolutePath = join(directory, filename);

  let info;

  try {
    info = await lstat(absolutePath);
  } catch {
    throw new Error(
      `[Gallery] Media file does not exist: ${absolutePath}`,
    );
  }

  if (!info.isFile()) {
    throw new Error(
      `[Gallery] Expected a regular file: ${absolutePath}`,
    );
  }
}

async function readJson<T extends z.ZodTypeAny>(
  filePath: string,
  schema: T,
  label: string,
): Promise<{
  contents: string;
  data: z.infer<T>;
}> {
  const contents = await readFile(
    filePath,
    'utf8',
  );

  let raw: unknown;

  try {
    raw = JSON.parse(contents);
  } catch (error) {
    const reason =
      error instanceof Error
        ? error.message
        : String(error);

    throw new Error(
      `[Gallery] Invalid JSON syntax: ${label}\n${reason}`,
    );
  }

  const result = schema.safeParse(raw);

  if (!result.success) {
    throw new Error(
      `[Gallery] Schema validation failed: ${label}\n${result.error.message}`,
    );
  }

  return {
    contents,
    data: result.data,
  };
}

// =====================================================
// 8. Gallery loader
// =====================================================

export function galleryLoader(
  options: {
    base: string;
  },
): Loader {
  return {
    name: 'gallery-loader',

    load: async ({
      config,
      store,
      parseData,
      generateDigest,
      watcher,
      logger,
    }) => {
      const baseDir = fileURLToPath(
        new URL(options.base, config.root),
      );

      const rootDir = fileURLToPath(
        config.root,
      );

      const relToRoot = (absolutePath: string) =>
        relative(rootDir, absolutePath)
          .replaceAll('\\', '/');

      // =================================================
      // Load all Gallery entries
      // =================================================

      const syncAll = async () => {
        const pendingEntries: Array<{
          id: string;
          data: Record<string, unknown>;
          filePath: string;
          digest: string;
        }> = [];

        const usedIds = new Set<string>();

        // -----------------------------------------------
        // A. Load independent media
        // -----------------------------------------------

        const rootJsonPath = join(
          baseDir,
          'photo-video.json',
        );

        const rootJson = await readJson(
          rootJsonPath,
          rawRootFileSchema,
          'photo-video.json',
        );

        // Validate independent media IDs.

        for (const id of Object.keys(
          rootJson.data.items,
        )) {
          idSchema.parse(id);
          usedIds.add(id);
        }

        // Process independent media.

        for (const [id, item] of Object.entries(
          rootJson.data.items,
        )) {
          await checkMediaFile(
            baseDir,
            item.file,
            item.type,
            id,
          );

          // Check video poster.

          if (
            item.type === 'video' &&
            item.poster
          ) {
            await checkMediaFile(
              baseDir,
              item.poster,
              'photo',
              `${id} poster`,
            );
          }

          const data: Record<string, unknown> = {
            ...item,

            assetPath: assetPath(
              item.file,
            ),

            ...(item.type === 'video' && item.poster
              ? {
                  posterAssetPath: assetPath(
                    item.poster,
                  ),
                }
              : {}),
          };

          const filePath = relToRoot(
            rootJsonPath,
          );

          pendingEntries.push({
            id,
            data,
            filePath,
            digest: generateDigest(
              JSON.stringify({ id, item }),
            ),
          });
        }

        // -----------------------------------------------
        // B. Discover portfolio directories
        // -----------------------------------------------

        const rootEntries = await readdir(
          baseDir,
          { withFileTypes: true },
        );

        const portfolioDirectories = rootEntries
          .filter((entry) => entry.isDirectory())
          .sort((a, b) =>
            a.name.localeCompare(b.name),
          );

        for (const directory of portfolioDirectories) {
          const portfolioId = directory.name;

          idSchema.parse(portfolioId);

          // Independent media IDs and portfolio IDs
          // must not conflict.

          if (usedIds.has(portfolioId)) {
            throw new Error(
              `[Gallery] Duplicate global ID: ${portfolioId}`,
            );
          }

          usedIds.add(portfolioId);

          const portfolioDir = join(
            baseDir,
            portfolioId,
          );

          const childEntries = await readdir(
            portfolioDir,
            { withFileTypes: true },
          );

          // ---------------------------------------------
          // C. Enforce flat portfolio structure
          // ---------------------------------------------

          const hasNestedDirectory =
            childEntries.some(
              (entry) =>
                entry.isDirectory() ||
                entry.isSymbolicLink(),
            );

          if (hasNestedDirectory) {
            throw new Error(
              `[Gallery] Nested directories are forbidden: ${portfolioId}`,
            );
          }

          // Require portfolio.json.

          const hasJson = childEntries.some(
            (entry) =>
              entry.isFile() &&
              entry.name === 'portfolio.json',
          );

          if (!hasJson) {
            throw new Error(
              `[Gallery] Missing portfolio.json: ${portfolioId}`,
            );
          }

          const portfolioJsonPath = join(
            portfolioDir,
            'portfolio.json',
          );

          // Skip an empty portfolio JSON file.

          const portfolioContents = await readFile(
            portfolioJsonPath,
            'utf8',
          );

          if (!portfolioContents.trim()) {
            logger.info(
              `[Gallery] Skipping uninitialized portfolio: ${portfolioId}`,
            );

            continue;
          }

          // ---------------------------------------------
          // D. Read portfolio metadata
          // ---------------------------------------------

          const portfolioJson = await readJson(
            portfolioJsonPath,
            rawPortfolioFileSchema,
            `${portfolioId}/portfolio.json`,
          );

          const metadata =
            portfolioJson.data.portfolio;

          // ---------------------------------------------
          // E. Load portfolio media
          // ---------------------------------------------

          const portfolioItems: z.infer<
            typeof normalizedPortfolioMediaSchema
          >[] = [];

          for (const item of portfolioJson.data.items) {
            // Check media file.

            await checkMediaFile(
              portfolioDir,
              item.file,
              item.type,
              `${portfolioId}/${item.id}`,
            );

            // Check video poster.

            if (
              item.type === 'video' &&
              item.poster
            ) {
              await checkMediaFile(
                portfolioDir,
                item.poster,
                'photo',
                `${portfolioId}/${item.id} poster`,
              );
            }

            // Normalize media metadata.
            // date and by inherit from portfolio if omitted.
            // category always inherits from portfolio.

            const normalizedItem = {
              ...item,

              date: item.date ?? metadata.date,

              by: item.by ?? metadata.by,

              category: metadata.category,

              assetPath: assetPath(
                portfolioId,
                item.file,
              ),

              ...(item.type === 'video' && item.poster
                ? {
                    posterAssetPath: assetPath(
                      portfolioId,
                      item.poster,
                    ),
                  }
                : {}),
            };

            portfolioItems.push(
              normalizedItem,
            );
          }

          // ---------------------------------------------
          // F. Determine portfolio cover
          // ---------------------------------------------

          const cover = portfolioItems[0];

          if (
            !cover ||
            cover.type !== 'photo'
          ) {
            throw new Error(
              `[Gallery] Invalid portfolio cover: ${portfolioId}`,
            );
          }

          // ---------------------------------------------
          // G. Build unified portfolio entry
          // ---------------------------------------------

          const data: Record<string, unknown> = {
            ...metadata,

            type: 'portfolio',

            items: portfolioItems,

            cover,
          };

          const filePath = relToRoot(
            portfolioJsonPath,
          );

          pendingEntries.push({
            id: portfolioId,
            data,
            filePath,
            digest: generateDigest(
              portfolioJson.contents,
            ),
          });
        }

        // -----------------------------------------------
        // H. Parse and validate all entries
        // -----------------------------------------------

        const validatedEntries = [];

        for (const entry of pendingEntries) {
          const data = await parseData({
            id: entry.id,
            data: entry.data,
            filePath: entry.filePath,
          });

          validatedEntries.push({
            ...entry,
            data,
          });
        }

        // -----------------------------------------------
        // I. Update Collection store
        // -----------------------------------------------

        store.clear();

        for (const entry of validatedEntries) {
          store.set(entry);
        }

        logger.info(
          `Loaded ${validatedEntries.length} Gallery entries.`,
        );
      };

      // =================================================
      // Initial load
      // =================================================

      await syncAll();

      // =================================================
      // Development file watcher
      //
      // Only watch JSON modifications.
      // Do not reload on initial add/addDir events.
      // =================================================

      if (!watcher) return;

      watcher.add(baseDir);

      let reloadTimer:
        | ReturnType<typeof setTimeout>
        | undefined;

      let reloadQueue = Promise.resolve();

      const scheduleReload = (
        changedPath: string,
      ) => {
        const relPath = relative(
          baseDir,
          changedPath,
        ).replaceAll('\\', '/');

        const filename = relPath.split('/').pop();

        // Only JSON files affect Gallery metadata.
        if (
          filename !== 'photo-video.json' &&
          filename !== 'portfolio.json'
        ) {
          return;
        }

        // Debounce repeated save events.

        if (reloadTimer) {
          clearTimeout(reloadTimer);
        }

        reloadTimer = setTimeout(() => {
          reloadQueue = reloadQueue
            .then(() => syncAll())
            .catch((error: unknown) => {
              const message =
                error instanceof Error
                  ? error.message
                  : String(error);

              logger.error(
                `[Gallery] Reload failed: ${message}`,
              );
            });
        }, 180);
      };

      // Only listen to modifications.
      // New directories and files require a dev restart.

      watcher.on('change', scheduleReload);
    },
  };
}
