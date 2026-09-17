import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';

import { remarkAlert } from 'remark-github-blockquote-alert';
import 'remark-github-blockquote-alert/alert.css';

import remarkDeflist from 'remark-deflist';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';

import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import Slugger from 'github-slugger';

import type { Image, Root } from 'mdast';


/* =========================================================
 * Types
 * ========================================================= */

export interface MarkdownHeading {
  depth: number;
  slug: string;
  text: string;
}

export interface MarkdownResult {
  html: string;
  headings: MarkdownHeading[];
}

export interface RenderOptions {
  /**
   * Resolve relative image references.
   *
   * Example:
   *
   *   ./cover.png
   */
  resolveImage?: (
    url: string,
  ) => Promise<string | undefined>;


  resolveLink?: (
    url: string,
  ) => string | undefined;
}

/* =========================================================
 * Image resolver
 * ========================================================= */

/**
 * Resolve relative image URLs inside a post body.
 *
 * Absolute URLs, root-absolute paths, anchors and data URIs
 * are left untouched.
 */
function remarkResolveImages(
  resolveImage?: (
    url: string,
  ) => Promise<string | undefined>,
) {
  return async (tree: Root) => {
    if (!resolveImage) return;

    const images: Image[] = [];

    visit(tree, 'image', (node) => {
      const url = node.url ?? '';

      if (
        !/^(https?:|\/|#|data:|mailto:)/.test(url)
      ) {
        images.push(node);
      }
    });

    await Promise.all(
      images.map(async (node) => {
        const resolved =
          await resolveImage(node.url);

        if (resolved) {
          node.url = resolved;
        }
      }),
    );
  };
}

/* =========================================================
 * Markdown link resolver
 * ========================================================= */

/**
 * Resolve relative Markdown links before remark-rehype.
 *
 * This is important because normal Markdown links such as:
 *
 *   [二、进阶电路分析](二、进阶电路分析/zh.md)
 *
 * would otherwise be emitted directly as:
 *
 *   href="二、进阶电路分析/zh.md"
 *
 * and the browser would resolve that URL relative to the current
 * browser URL, which is not the URL structure used by Zest.
 *
 * The actual resolution logic is supplied by `resolveLink`.
 */
function remarkResolveLinks(
  resolveLink?: (
    url: string,
  ) => string | undefined,
) {
  return (tree: Root) => {
    if (!resolveLink) return;

    visit(tree, 'link', (node) => {
      const url = node.url ?? '';

      /*
       * Leave external and absolute links untouched.
       *
       * Examples:
       *
       *   https://example.com
       *   http://example.com
       *   mailto:test@example.com
       *   #section
       *   /zh/about
       *   data:...
       */
      if (
        /^(https?:|mailto:|#|\/|data:)/.test(url)
      ) {
        return;
      }

      const resolved = resolveLink(url);

      if (resolved) {
        node.url = resolved;
      }
    });
  };
}

/* =========================================================
 * Collect headings
 * ========================================================= */

/** Collect h2–h4 headings for the table of contents. */
function remarkCollectHeadings() {
  return (
    tree: Root,
    file: { data: Record<string, unknown> },
  ) => {
    const slugger = new Slugger();

    const headings: MarkdownHeading[] = [];

    visit(tree, 'heading', (node) => {
      if (
        node.depth < 2 ||
        node.depth > 4
      ) {
        return;
      }

      const text = toString(node);

      headings.push({
        depth: node.depth,
        slug: slugger.slug(text),
        text,
      });
    });

    file.data.headings = headings;
  };
}

/* =========================================================
 * Code block metadata
 * ========================================================= */

function remarkCodeMeta() {
  return (tree: Root) => {
    visit(tree, 'code', (node) => {
      const meta = node.meta ?? '';

      const match =
        /title\s*=\s*["']([^"']+)["']/.exec(
          meta,
        );

      if (!match) {
        return;
      }

      node.data ??= {};
      node.data.hProperties ??= {};

      node.data.hProperties.dataFilename =
        match[1];
    });
  };
}

/* =========================================================
 * Fuwari-style directives
 * ========================================================= */

/**
 * Mark only an explicit directive label (`:::type[Title]`) as the
 * directive title. Untitled directives keep their first paragraph as
 * ordinary content.
 */
function remarkDirectiveTitles() {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node: any) => {
      const first = node.children?.[0];

      if (
        !first ||
        first.type !== 'paragraph' ||
        first.data?.directiveLabel !== true
      ) {
        return;
      }

      first.data ??= {};
      first.data.hName = 'div';
      first.data.hProperties = {
        className: ['directive-title'],
      };
    });
  };
}

/**
 * Convert directive elements generated by remark-directive-rehype into
 * the existing `.directive directive-*` CSS structure.
 *
 * The Markdown parser itself is still handled entirely by
 * remark-directive; this is only the final HTML/CSS class adaptation.
 */
function rehypeNormalizeDirectives() {
  const types = [
    'note',
    'tip',
    'vital',
    'warning',
    'caution',

    'definition',
    'theorem',
    'lemma',
    'proof',
    'example',
    'formula',
    'question',
    'remark',
    'law',
  ];

  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (!types.includes(node.tagName)) {
        return;
      }

      const name = node.tagName;

      node.tagName = 'div';
      node.properties = {
        ...(node.properties ?? {}),
        className: [
          'directive',
          `directive-${name}`,
        ],
      };
    });
  };
}

/* =========================================================
 * Code blocks
 * ========================================================= */

function rehypeCodeBlocks() {
  return (tree: any) => {
    function walk(parent: any) {
      const children =
        parent?.children ?? [];

      for (
        let i = 0;
        i < children.length;
        i++
      ) {
        const node =
          children[i];

        if (
          !node ||
          node.type !== 'element'
        ) {
          continue;
        }

        if (
          node.tagName === 'pre' &&
          node.children?.[0]?.tagName ===
            'code'
        ) {
          children[i] =
            wrapCodeBlock(node);
        } else if (
          node.children
        ) {
          walk(node);
        }
      }
    }

    walk(tree);
  };

  function wrapCodeBlock(
    pre: any,
  ): any {
    const code =
      pre.children[0];

    const classNames =
      Array.isArray(
        code.properties?.className,
      )
        ? code.properties.className
        : [];

    const language =
      classNames
        .map(String)
        .find((name: string) =>
          name.startsWith(
            'language-',
          ),
        )
        ?.slice(
          'language-'.length,
        ) ?? '';

    const filename =
      typeof code.properties
        ?.dataFilename === 'string'
        ? code.properties
            .dataFilename
        : '';

    const copyButton = {
      type: 'element',

      tagName: 'button',

      properties: {
        className: [
          'code-block-copy',
        ],

        type: 'button',

        'data-copy-code': '',

        'aria-label':
          'Copy code',

        title:
          'Copy code',
      },

      children: [
        {
          type: 'text',
          value: '⧉',
        },
      ],
    };

    if (
      language ||
      filename
    ) {
      const bar = {
        type: 'element',

        tagName: 'div',

        properties: {
          className: [
            'code-block-bar',
          ],
        },

        children: [] as any[],
      };

      if (language) {
        bar.children.push({
          type: 'element',

          tagName: 'span',

          properties: {
            className: [
              'code-block-lang',
            ],
          },

          children: [
            {
              type: 'text',

              value: language,
            },
          ],
        });
      }

      if (filename) {
        bar.children.push({
          type: 'element',

          tagName: 'span',

          properties: {
            className: [
              'code-block-filename',
            ],
          },

          children: [
            {
              type: 'text',

              value: filename,
            },
          ],
        });
      }

      bar.children.push({
        type: 'element',

        tagName: 'span',

        properties: {
          className: [
            'code-block-spacer',
          ],
        },

        children: [],
      });

      bar.children.push(
        copyButton,
      );

      return {
        type: 'element',

        tagName: 'div',

        properties: {
          className: [
            'code-block',
          ],
        },

        children: [
          bar,
          pre,
        ],
      };
    }

    return {
      type: 'element',

      tagName: 'div',

      properties: {
        className: [
          'code-block',
        ],
      },

      children: [
        pre,
        copyButton,
      ],
    };
  }
}

/* =========================================================
 * Markdown renderer
 * ========================================================= */

export async function renderMarkdown(
  md: string,
  options: RenderOptions = {},
): Promise<MarkdownResult> {
  const processor =
    unified()

      /* -----------------------------------------------------
       * Markdown parser
       * ----------------------------------------------------- */

      .use(remarkParse)

      .use(remarkGfm)

      .use(remarkMath)

      /*
       * Fuwari-style ::: directives
       *
       * Example:
       *
       *   :::definition[节点]
       *   内容
       *   :::
       *
       * or:
       *
       *   :::definition
       *   内容
       *   :::
       */
      .use(remarkDirective)
      .use(remarkDirectiveTitles)

      /*
       * Definition lists.
       */
      .use(remarkDeflist)

      /*
       * Resolve relative images.
       */
      .use(
        remarkResolveImages,
        options.resolveImage,
      )

      /*
       * Resolve relative Markdown links.
       *
       * This must happen while the tree is still mdast.
       */
      .use(
        remarkResolveLinks,
        options.resolveLink,
      )

      /*
       * Collect headings.
       */
      .use(
        remarkCollectHeadings,
      )

      /*
       * Read code block metadata.
       */
      .use(remarkCodeMeta)

      /*
       * GitHub-style alerts:
       *
       *   > [!TIP]
       *   > 正文
       *
       * These remain GitHub alerts.
       *
       * They are NOT converted into ::: directives.
       */
      .use(remarkAlert)

      /*
       * Convert ::: directives from mdast
       * into HAST elements.
       */
      .use(remarkDirectiveRehype)

      /*
       * Convert normal Markdown AST into HAST.
       */
      .use(
        remarkRehype,
        {
          allowDangerousHtml: true,
        },
      )

      /*
       * Raw HTML.
       */
      .use(rehypeRaw)

      /*
       * Math.
       */
      .use(rehypeKatex)

      /*
       * Heading IDs.
       */
      .use(rehypeSlug)

      /*
       * Convert directive elements into the CSS classes used by Zest.
       * Titles have already been marked in the mdast stage, so an
       * untitled directive's first paragraph is never mistaken for a title.
       */
      .use(rehypeNormalizeDirectives)

      /*
       * Code blocks.
       */
      .use(rehypeCodeBlocks)

      /*
       * Syntax highlighting.
       */
      .use(
        rehypeShiki,
        {
          themes: {
            light:
              'github-light',

            dark:
              'github-dark',
          },

          defaultColor: false,
        },
      )

      /*
       * HAST -> HTML.
       */
      .use(
        rehypeStringify,
        {
          allowDangerousHtml: true,
        },
      );

  const file =
    await processor.process(md);

  return {
    html: String(file),

    headings:
      (file.data.headings ??
        []) as MarkdownHeading[],
  };
}

/* =========================================================
 * Markdown -> plain text
 * ========================================================= */

export function markdownToText(
  md: string,
): string {
  return md
    .replace(
      /```[\s\S]*?```/g,
      ' ',
    )

    .replace(
      /`([^`]+)`/g,
      '$1',
    )

    .replace(
      /<[^>]+>/g,
      ' ',
    )

    .replace(
      /!\[([^\]]*)\]\([^)]*\)/g,
      '$1',
    )

    .replace(
      /\[([^\]]+)\]\([^)]*\)/g,
      '$1',
    )

    .replace(
      /^#{1,6}\s+/gm,
      '',
    )

    .replace(
      /^\s*([-*_])\s*(\1\s*){2,}$/gm,
      ' ',
    )

    .replace(
      /^\s*\|?[\s:|-]+\|?\s*$/gm,
      ' ',
    )

    .replace(
      /[*_~>|]+/g,
      ' ',
    )

    .replace(
      /\$\$([\s\S]*?)\$\$/g,
      '$1',
    )

    .replace(
      /\$([^$\n]+?)\$/g,
      '$1',
    )

    .replace(
      /\s+/g,
      ' ',
    )

    .trim();
}