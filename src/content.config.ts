import { defineCollection, z } from 'astro:content';
import { zestLoader } from './loaders/zest';

/**
 * Zest content collections — one folder per post:
 *
 *   src/content/posts/<slug>/en.md        English article   (filename = language)
 *   src/content/posts/<slug>/zh.md        Chinese article
 *   src/content/posts/<slug>/ja.md        Japanese article
 *   src/content/posts/<slug>/cover.png    article cover image (./cover.png)
 *
 *   src/content/pages/<name>/{en,zh,ja}.md   standalone pages
 *
 * Entry ids look like `zh/hello-zest`; the URL slug is the part after
 * the language prefix.
 */

export const collections = {
  /** Blog posts. */
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
    }),
  }),

  /** Standalone pages (welcome / about / resume). */
  pages: defineCollection({
    loader: zestLoader({ base: './src/content/pages' }),
    schema: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      pubDate: z.coerce.date().optional(),
    }),
  }),

  /**
   * Photo portfolios: one folder per portfolio — `src/content/portfolios/<slug>/{zh,en,ja}.md`
   * (title + description body) plus the portfolio's photos (main.* cover + numbered photos).
   */
  portfolios: defineCollection({
    loader: zestLoader({ base: './src/content/portfolios' }),
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date().optional(),
    }),
  }),
};
