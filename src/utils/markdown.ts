import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { remarkAlert } from 'remark-github-blockquote-alert';
import 'remark-github-blockquote-alert/alert.css'
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
import '../styles/md-alert.css';

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

  /**
   * Resolve relative Markdown links.
   *
   * Example:
   *
   *   二、进阶电路分析/zh.md
   *
   * becomes:
   *
   *   /zh/posts/电路学/二、进阶电路分析
   */
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
 * CUSTOM MARKDOWN BLOCK PREPROCESSOR
 *
 * CommonMark parses a line such as:
 *
 *   :::tip 标题
 *
 * as ordinary paragraph text unless the surrounding structure is
 * separated first. We therefore isolate custom-block marker lines
 * before remarkParse runs.
 *
 * The preprocessor deliberately ignores fenced code blocks so that
 * literal ::: lines inside code examples are never changed.
 * ========================================================= */

const CUSTOM_BLOCK_MARKER_RE =
  /^:::\s*(?:[A-Za-z][A-Za-z0-9_-]*(?:\s+.+)?|)\s*$/;

function preprocessCustomBlocks(
  source: string,
): string {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const output: string[] = [];

  let fenced = false;
  let fenceChar = '';
  let fenceLength = 0;

  for (const line of lines) {
    const fenceMatch = /^(\s*)(`{3,}|~{3,})(.*)$/.exec(line);

    if (fenceMatch) {
      const marker = fenceMatch[2];

      if (!fenced) {
        fenced = true;
        fenceChar = marker[0];
        fenceLength = marker.length;
      } else if (
        marker[0] === fenceChar &&
        marker.length >= fenceLength
      ) {
        fenced = false;
        fenceChar = '';
        fenceLength = 0;
      }

      output.push(line);
      continue;
    }

    if (!fenced && CUSTOM_BLOCK_MARKER_RE.test(line)) {
      if (output.length > 0 && output[output.length - 1] !== '') {
        output.push('');
      }

      output.push(line.trim());
      output.push('');
      continue;
    }

    output.push(line);
  }

  return output.join('\n');
}

/* =========================================================
 * CUSTOM MARKDOWN BLOCK
 *
 * Supported syntax:
 *
 *   :::tip 提示
 *   这是正文。
 *   :::
 *
 *   :::definition 节点
 *   由理想导线直接连接的所有点构成同一个节点。
 *   :::
 *
 *   :::theorem 欧姆定律
 *   在一定条件下，通过导体的电流与其两端电压成正比。
 *
 *   $$
 *   V=IR
 *   $$
 *   :::
 *
 * The body is already parsed by remark, so normal Markdown
 * syntax remains available inside the custom block:
 *
 *   - paragraphs
 *   - lists
 *   - blockquotes
 *   - code blocks
 *   - math
 *   - links
 *   - images
 *   - nested custom blocks
 *
 * Normal Markdown blockquotes (`>`) are completely unaffected.
 * ========================================================= */

const CUSTOM_BLOCK_TYPES = new Set([
  'tip',
  'note',
  'important',
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
]);

function normalizeCustomBlockType(
  type: string,
): string {
  const normalized = type
    .trim()
    .toLowerCase();

  if (CUSTOM_BLOCK_TYPES.has(normalized)) {
    return normalized;
  }

  const safe = normalized
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/^-+/, '');

  return safe || 'custom';
}

/**
 * Return the plain text of a paragraph when it consists only of
 * ordinary text nodes.
 *
 * This keeps syntax such as:
 *
 *   :::theorem 欧姆定律
 *
 * unambiguous. Formatting is intentionally not supported in the
 * opening/closing marker itself; formatting remains fully supported
 * in the block body.
 */
function getPlainParagraphText(
  node: any,
): string | undefined {
  if (
    !node ||
    node.type !== 'paragraph' ||
    !Array.isArray(node.children)
  ) {
    return undefined;
  }

  if (
    node.children.some(
      (child: any) => child.type !== 'text',
    )
  ) {
    return undefined;
  }

  return node.children
    .map((child: any) => child.value ?? '')
    .join('');
}

/**
 * Parse a custom block opening marker.
 *
 *   :::type title
 *
 * Returns null for ordinary paragraphs.
 */
function parseCustomBlockOpening(
  node: any,
): {
  type: string;
  title: string;
} | undefined {
  const text =
    getPlainParagraphText(node);

  if (text === undefined) {
    return undefined;
  }

  const match =
    /^:::\s*([A-Za-z][A-Za-z0-9_-]*)(?:\s+(.+?))?\s*$/.exec(
      text,
    );

  if (!match) {
    return undefined;
  }

  const [, rawType, rawTitle] = match;
  const title = (rawTitle ?? '').trim();

  if (!title) {
    return undefined;
  }

  return {
    type: normalizeCustomBlockType(rawType),
    title,
  };
}

/**
 * Check whether a paragraph is exactly the closing marker:
 *
 *   :::
 */
function isCustomBlockClosing(
  node: any,
): boolean {
  const text =
    getPlainParagraphText(node);

  return (
    text !== undefined &&
    /^:::\s*$/.test(text)
  );
}

/**
 * Recursively transform one mdast children array.
 *
 * The Markdown parser has already parsed the complete body before
 * this plugin runs. Therefore everything between the opening and
 * closing markers can remain normal mdast nodes.
 *
 * This is what allows Markdown inside ::: blocks to keep its normal
 * semantics without reparsing the body as a separate Markdown string.
 */
function transformCustomBlockChildren(
  children: any[],
): any[] {
  const result: any[] = [];

  for (let i = 0; i < children.length; i++) {
    const current = children[i];
    const opening = parseCustomBlockOpening(current);

    if (!opening) {
      if (Array.isArray(current?.children)) {
        current.children = transformCustomBlockChildren(current.children);
      }

      result.push(current);
      continue;
    }

    const body: any[] = [];
    let depth = 1;
    let foundClosing = false;

    for (let j = i + 1; j < children.length; j++) {
      const candidate = children[j];
      const nestedOpening = parseCustomBlockOpening(candidate);

      if (nestedOpening) {
        depth++;
        body.push(candidate);
        continue;
      }

      if (isCustomBlockClosing(candidate)) {
        depth--;

        if (depth === 0) {
          foundClosing = true;
          i = j;
          break;
        }

        body.push(candidate);
        continue;
      }

      body.push(candidate);
    }

    if (!foundClosing) {
      result.push(current);
      continue;
    }

    const customBlock: any = {
      type: 'customBlock',
      customBlockType: opening.type,
      customBlockTitle: opening.title,
      children: transformCustomBlockChildren(body),
    };

    result.push(customBlock);
  }

  return result;
}

function remarkCustomBlocks() {
  return (tree: Root) => {
    tree.children =
      transformCustomBlockChildren(
        tree.children,
      );
  };
}

/**
 * remark-rehype handler for customBlock.
 */
function remarkCustomBlockHandler(
  state: any,
  node: any,
) {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: [
        'directive',
        `directive-${node.customBlockType || 'custom'}`,
      ],
    },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['directive-title'],
        },
        children: [
          {
            type: 'text',
            value: node.customBlockTitle || '',
          },
        ],
      },
      ...state.all(node),
    ],
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

      .use(remarkParse)

      .use(remarkGfm)

      .use(remarkMath)

      /*
       * GitHub-style alerts:
       *
       *   > [!TIP]
       *   > 正文
       *
       * These are handled by remark-github-alerts.
       */
      .use(remarkAlert)

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

      .use(
        remarkCollectHeadings,
      )

      .use(remarkCodeMeta)

      /*
       * Convert :::type title ... ::: blocks
       * while they are still mdast.
       */
      .use(remarkCustomBlocks)

      .use(
        remarkRehype,
        {
          allowDangerousHtml: true,
          handlers: {
            customBlock:
              remarkCustomBlockHandler,
          },
        } as any,
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
    await processor.process(
      preprocessCustomBlocks(md),
    );

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