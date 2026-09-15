import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
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
  resolveImage?: (
    url: string,
  ) => Promise<string | undefined>;
}


/* =========================================================
 * Image resolver
 * ========================================================= */

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
 * Collect headings
 * ========================================================= */

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
 * CUSTOM ALERT
 *
 * Supported syntax:
 *
 *   > [!tip,电流]
 *   > 电流是电荷的定向移动形成的物理量。
 *
 *   > [!important,电压]
 *   > 单位电荷通过物理元件时，功/能量的变化量。
 *   >
 *   > > 这是测试用的二级引用
 *
 * Only the comma syntax is supported.
 * Normal blockquotes remain normal blockquotes.
 * ========================================================= */

const ALERT_TYPES = new Set([
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
]);

function normalizeAlertType(type: string): string {
  const normalized = type.trim().toLowerCase();

  if (ALERT_TYPES.has(normalized)) {
    return normalized;
  }

  const safe = normalized
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/^-+/, '');

  return safe || 'custom';
}

/**
 * Convert an mdast blockquote whose first paragraph starts with
 * [!type,title] into a customAlert node.
 *
 * This is intentionally done BEFORE remarkRehype. That way the alert
 * marker is handled while it is still Markdown AST, instead of trying
 * to recover it from generated HTML.
 */
function remarkCustomAlerts() {
  return (tree: Root) => {
    visit(tree, 'blockquote', (node: any) => {
      const first = node.children?.[0];

      if (!first || first.type !== 'paragraph') {
        return;
      }

      // The marker is plain text at the beginning of the first paragraph.
      // Find the first text node so formatting before the marker is not
      // accidentally interpreted as an alert.
      const firstText = first.children?.find(
        (child: any) => child.type === 'text',
      );

      if (!firstText) {
        return;
      }

      const match = /^\[!([A-Za-z][A-Za-z0-9_-]*),([^\]\r\n]+)\]\s*/.exec(
        firstText.value ?? '',
      );

      if (!match) {
        return;
      }

      const [, rawType, rawTitle] = match;
      const title = rawTitle.trim();

      if (!title) {
        return;
      }

      // Remove only the marker from the first text node.
      firstText.value = (firstText.value ?? '').slice(match[0].length);

      // Remove empty text nodes.
      first.children = first.children.filter(
        (child: any) =>
          !(child.type === 'text' && !(child.value ?? '').length),
      );

      // If the paragraph now contains no content, remove it.
      if (first.children.length === 0) {
        node.children.shift();
      }

      // Keep all original blockquote children. This is important for nested
      // blockquotes: they will later become real <blockquote> elements inside
      // .md-alert-body.
      node.type = 'customAlert';
      node.alertType = normalizeAlertType(rawType);
      node.alertTitle = title;
    });
  };
}

/**
 * remark-rehype handler for the customAlert mdast node.
 */
function remarkAlertHandler(state: any, node: any) {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: [
        'md-alert',
        `md-alert-${node.alertType || 'custom'}`,
      ],
    },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['md-alert-title'],
        },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['md-alert-icon'],
              ariaHidden: 'true',
            },
            children: [],
          },
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['md-alert-title-text'],
            },
            children: [
              {
                type: 'text',
                value: node.alertTitle || '',
              },
            ],
          },
        ],
      },
      {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['md-alert-body'],
        },
        children: state.all(node),
      },
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
 * ::: directives
 * ========================================================= */

function rehypeNormalizeDirectives() {
  const types = [
    'note',
    'tip',
    'important',
    'warning',
    'caution',
  ];

  return (tree: any) => {
    visit(
      tree,
      'element',
      (node: any) => {
        if (
          !types.includes(
            node.tagName,
          )
        ) {
          return;
        }

        const type =
          node.tagName;

        node.tagName =
          'div';

        node.properties = {
          ...(node.properties ?? {}),

          className: [
            'directive',
            `directive-${type}`,
          ],
        };
      },
    );
  };
}


function rehypeDirectiveTitles() {
  return (tree: any) => {
    visit(
      tree,
      'element',
      (node: any) => {
        const classes =
          node?.properties
            ?.className;

        if (
          !Array.isArray(classes) ||
          !classes.includes(
            'directive',
          )
        ) {
          return;
        }

        const first =
          node.children?.[0];

        if (
          !first ||
          first.type !== 'element' ||
          first.tagName !== 'p'
        ) {
          return;
        }

        const strong =
          first.children?.find(
            (child: any) =>
              child.type ===
                'element' &&
              child.tagName ===
                'strong',
          );

        if (!strong) {
          return;
        }

        node.children[0] = {
          type: 'element',

          tagName: 'div',

          properties: {
            className: [
              'directive-title',
            ],
          },

          children:
            strong.children,
        };
      },
    );
  };
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

      .use(remarkDirective)

      .use(remarkDeflist)

      .use(
        remarkResolveImages,
        options.resolveImage,
      )

      .use(
        remarkCollectHeadings,
      )

      .use(remarkCodeMeta)

      // Convert [!type,title] blockquotes while they are still mdast.
      .use(remarkCustomAlerts)

      .use(
        remarkDirectiveRehype,
      )

      .use(
        remarkRehype,
        {
          allowDangerousHtml: true,
          handlers: {
            customAlert: remarkAlertHandler,
          },
        }as any,
      )

      /*
       * Raw HTML
       */
      .use(rehypeRaw)

      /*
       * Math
       */
      .use(rehypeKatex)

      /*
       * Heading IDs
       */
      .use(rehypeSlug)

      /*
       * Existing ::: directives
       */
      .use(
        rehypeNormalizeDirectives,
      )

      .use(
        rehypeDirectiveTitles,
      )

      /*
       * Code blocks
       */
      .use(rehypeCodeBlocks)

      /*
       * Syntax highlighting
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
       * HAST -> HTML
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