
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

import { zestLoader } from './loaders/zest';


/**
 * Zest content collections
 *
 * posts:
 *   src/content/posts/<slug>/{zh,en,ja}.md
 *
 *   顶层 lang.md = 正式文章
 *   子目录中的 lang.md = 外挂子文档，不进入归档等文章列表
 *
 * pages:
 *   src/content/welcome-site/{zh,en,ja}.md
 *
 * gallery:
 *   src/content/gallery/photo-video.json
 *   src/content/gallery/<portfolio>/portfolio.json
 */

export const collections = {
  // ===================================================
  // Posts
  // ===================================================

  posts: defineCollection({
    loader: zestLoader({
      base: './src/content/posts',
    }),

    schema: z.object({
      title: z.string(),

      category: z.string().min(1),

      tag: z.array(z.string()).default([]),

      description: z.string().optional(),

      pubDate: z.coerce.date().optional(),

      postImage: z.string().nullable().optional(),

      homepined: z.boolean().default(false),

      pinedOrder: z.number().default(0),

      draft: z.boolean().default(false),

      /**
       * Automatically determined by zestLoader:
       *
       * false = top-level article
       * true  = subpage
       */
      isSubpage: z.boolean().default(false),
    }),
  }),

  // ===================================================
  // Welcome Site
  // ===================================================

  pages: defineCollection({
    loader: zestLoader({
      base: './src/content/welcome-site',
    }),

    schema: z.object({
      title: z.string().optional(),

      description: z.string().optional(),

      pubDate: z.coerce.date().optional(),
    }),
  }),

  // ===================================================
  // Gallery
  // ===================================================

  gallery: defineCollection({
    loader: galleryLoader({
      base: './src/content/gallery',
    }),

    schema: galleryEntrySchema,
  }),
};
