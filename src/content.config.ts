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
 *   src/content/pages/<name>/{zh,en,ja}.md
 *
 * portfolios:
 *   src/content/portfolios/<slug>/{zh,en,ja}.md
 *
 * recipes:
 *   src/content/recipes/<slug>/{zh,en,ja}.md
 */

export const collections = {
  posts: defineCollection({
    loader: zestLoader({ base: './src/content/posts' }),

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

      // 由 zestLoader 自动判断：
      // false = 顶层正式文章
      // true  = 子级外挂文档
      isSubpage: z.boolean().default(false),
    }),
  }),

  pages: defineCollection({
    loader: zestLoader({ base: './src/content/pages' }),

    schema: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      pubDate: z.coerce.date().optional(),
    }),
  }),

  portfolios: defineCollection({
    loader: zestLoader({ base: './src/content/portfolios' }),

    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date().optional(),
    }),
  }),

  recipes: defineCollection({
    loader: zestLoader({ base: './src/content/recipes' }),

    schema: z.object({
      title: z.string(),
      categories: z.string().nullable().optional(),
      description: z.string().optional(),
      pubDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      postImage: z.string().nullable().optional(),

      homepined: z.boolean().default(false),
      pinedOrder: z.number().default(0),
      draft: z.boolean().default(false),
    }),
  }),
};