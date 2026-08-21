import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkDeflist from 'remark-deflist';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeShiki from '@shikijs/rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import Slugger from 'github-slugger';
import type { Image } from 'mdast';

export interface MarkdownHeading {
  depth: number;
  slug: string;
  text: string;
}

export interface MarkdownResult {
  html: string;
  headings: MarkdownHeading[];
}

/**
 * Resolve relative image URLs inside a post body (e.g. `./photo.png`)
 * through the provided resolver. Absolute URLs, root-absolute paths,
 * anchors and data URIs pass through untouched.
 */
function remarkResolveImages(resolveImage?: (url: string) => Promise<string | undefined>) {
  return async (tree: import('mdast').Root) => {
    if (!resolveImage) return;
    const images: Image[] = [];
    visit(tree, 'image', (node) => {
      const url = node.url ?? '';
      if (!/^(https?:|\/|#|data:|mailto:)/.test(url)) images.push(node);
    });
    await Promise.all(
      images.map(async (node) => {
        const resolved = await resolveImage(node.url);
        if (resolved) node.url = resolved;
      })
    );
  };
}

/** Collect h2–h4 headings for the table of contents (ids match rehype-slug). */
function remarkCollectHeadings() {
  return (tree: import('mdast').Root, file: { data: Record<string, unknown> }) => {
    const slugger = new Slugger();
    const headings: MarkdownHeading[] = [];
    visit(tree, 'heading', (node) => {
      if (node.depth < 2 || node.depth > 4) return;
      const text = toString(node);
      headings.push({ depth: node.depth, slug: slugger.slug(text), text });
    });
    file.data.headings = headings;
  };
}

/** 解析代码块围栏信息中的文件名:`` ```python title="main.py" `` */
function remarkCodeMeta() {
  return (tree: import('mdast').Root) => {
    visit(tree, 'code', (node) => {
      const meta = node.meta ?? '';
      const match = /title\s*=\s*["']([^"']+)["']/.exec(meta);
      if (!match) return;
      node.data = node.data ?? {};
      node.data.hProperties = node.data.hProperties ?? {};
      node.data.hProperties.dataFilename = match[1];
    });
  };
}

/** 把代码块包进带顶栏的结构:语言标签(左上)+ 文件名(左)+ 复制按钮(右上)。 */
function rehypeCodeBlocks() {
  return (tree: any) => {
    const transform = (parent: any) => {
      const children = parent?.children ?? [];
      for (let i = 0; i < children.length; i++) {
        const node = children[i];
        if (node?.type !== 'element') continue;
        if (node.tagName === 'pre' && node.children?.[0]?.tagName === 'code') {
          children[i] = wrapCodeBlock(node);
        } else if (node.children) {
          transform(node);
        }
      }
    };
    transform(tree);
  };

  function wrapCodeBlock(pre: any): any {
    const code = pre.children[0];
    const classNames: unknown[] = Array.isArray(code.properties?.className)
      ? code.properties.className
      : [];
    const lang =
      classNames
        .map((c) => String(c))
        .find((c) => c.startsWith('language-'))
        ?.slice('language-'.length) ?? '';
    const filename =
      typeof code.properties?.dataFilename === 'string' ? code.properties.dataFilename : '';

    const bar: any = {
      type: 'element',
      tagName: 'div',
      properties: { className: ['code-block-bar'] },
      children: [],
    };
    if (lang) {
      bar.children.push({
        type: 'element',
        tagName: 'span',
        properties: { className: ['code-block-lang'] },
        children: [{ type: 'text', value: lang }],
      });
    }
    if (filename) {
      bar.children.push({
        type: 'element',
        tagName: 'span',
        properties: { className: ['code-block-filename'] },
        children: [{ type: 'text', value: filename }],
      });
    }
    bar.children.push(
      { type: 'element', tagName: 'span', properties: { className: ['code-block-spacer'] }, children: [] },
      {
        type: 'element',
        tagName: 'button',
        properties: {
          className: ['code-block-copy'],
          type: 'button',
          'data-copy-code': '',
          'aria-label': 'Copy code',
          title: 'Copy code',
        },
        children: [{ type: 'text', value: '⧉' }],
      }
    );

    return {
      type: 'element',
      tagName: 'div',
      properties: { className: ['code-block'] },
      children: [bar, pre],
    };
  }
}

/** remark-directive-rehype v1 emits `<tip>` custom elements; normalize to divs. */
function rehypeNormalizeDirectives() {
  const types = ['note', 'tip', 'important', 'warning', 'caution'];
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (!types.includes(node.tagName)) return;
      const name = node.tagName;
      node.tagName = 'div';
      node.properties = {
        ...(node.properties ?? {}),
        className: ['directive', `directive-${name}`],
      };
    });
  };
}

/** Turn a directive's first bold paragraph (`:::tip **Title** ... :::`) into a title. */
function rehypeDirectiveTitles() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      const className = node?.properties?.className;
      if (!Array.isArray(className) || !className.includes('directive')) return;
      const first = node?.children?.[0];
      if (!first || first.type !== 'element' || first.tagName !== 'p') return;
      const strong = first.children.find(
        (c: any) => c.type === 'element' && c.tagName === 'strong'
      );
      if (strong) {
        node.children[0] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['directive-title'] },
          children: strong.children,
        };
      }
    });
  };
}

export interface RenderOptions {
  /** Resolves relative image references (e.g. post folder assets). */
  resolveImage?: (url: string) => Promise<string | undefined>;
}

/**
 * Render a Markdown string to HTML.
 * Features: GFM (tables, task lists, footnotes, strikethrough), math (KaTeX),
 * Shiki code highlighting, raw HTML (video), definition lists, callouts
 * (`:::note / tip / important / warning / caution`), heading ids (for the TOC).
 */
export async function renderMarkdown(md: string, options: RenderOptions = {}): Promise<MarkdownResult> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkDirective)
    .use(remarkDeflist)
    .use(remarkResolveImages, options.resolveImage)
    .use(remarkCollectHeadings)
    .use(remarkCodeMeta)
    .use(remarkDirectiveRehype)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeNormalizeDirectives)
    .use(rehypeDirectiveTitles)
    .use(rehypeCodeBlocks)
    .use(rehypeShiki, {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const file = await processor.process(md);
  return {
    html: String(file),
    headings: (file.data.headings ?? []) as MarkdownHeading[],
  };
}

/**
 * Approximate a Markdown string as plain text, used to build the search index.
 */
export function markdownToText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ') // fenced code
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/<[^>]+>/g, ' ') // raw html (video tags etc.)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // images → alt
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → text
    .replace(/^#{1,6}\s+/gm, '') // atx headings
    .replace(/^\s*([-*_])\s*(\1\s*){2,}$/gm, ' ') // horizontal rules
    .replace(/^\s*\|?[\s:|-]+\|?\s*$/gm, ' ') // table separator rows
    .replace(/[*_~>|]+/g, ' ') // remaining emphasis / blockquote markers
    .replace(/\$\$([\s\S]*?)\$\$/g, '$1') // display math
    .replace(/\$([^$\n]+?)\$/g, '$1') // inline math
    .replace(/\s+/g, ' ')
    .trim();
}
