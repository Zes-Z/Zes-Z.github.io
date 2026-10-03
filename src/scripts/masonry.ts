/**
 * Dense vertical masonry (JS shortest-column packing).
 *
 * CSS Grid cannot pack tightly vertically (rows are rigid, leaving gaps
 * below shorter cards). This lays each card out absolutely into the
 * shortest column, so blocks pack densely both horizontally and vertically.
 *
 * Each card must carry `data-ratio` (CSS 宽:高, e.g. "3 / 2", "2 / 3", "1 / 1"); its
 * height is derived from that ratio and the computed column width.
 *
 * Returns a `relayout()` function; call it after the visible card set
 * changes (filtering, tab switch, dynamic render).
 */
import { DEFAULT_RATIO } from '../utils/ratio';

export function initMasonry(container: HTMLElement): () => void {
  const parseRatio = (s: string): number => {
    const [w, h] = s.split('/').map((n) => parseFloat(n.trim()));
    return w && h ? w / h : 1;
  };

  const layout = () => {
    const width = container.clientWidth;
    if (width <= 0) return;
    // 3 列为默认(容器约 980px 时应 3 列),窄屏降为 2/1
    const cols = width < 520 ? 1 : width < 780 ? 2 : 3;
    // gap = 1 位距 = 列宽/6,让"两张高4的块 + 1 位距 = 一张高9的块"严格成立。
    // 由 列宽×cols + 列宽/6×(cols-1) = 容器宽 解出:
    const colWidth = (6 * width) / (7 * cols - 1);
    const gap = colWidth / 6;
    const heights = new Array<number>(cols).fill(0);
    const cards = Array.from(container.children) as HTMLElement[];

    for (const card of cards) {
      if (card.hasAttribute('hidden')) continue;
      const ratio = parseRatio(card.dataset.ratio ?? DEFAULT_RATIO);
      const h = colWidth / ratio;
      const col = heights.indexOf(Math.min(...heights));
      card.style.position = 'absolute';
      card.style.width = `${colWidth}px`;
      card.style.left = `${col * (colWidth + gap)}px`;
      card.style.top = `${heights[col]}px`;
      card.style.margin = '0';
      // 卡片高度可精确算出(比例 + 列宽),交给浏览器跳过屏幕外卡片的
      // 布局/绘制;contain-intrinsic-size 是跳过前的占位尺寸估计。
      card.style.containIntrinsicSize = `auto ${Math.round(h)}px`;
      card.style.contentVisibility = 'auto';
      heights[col] += h + gap;
    }

    container.style.position = 'relative';
    container.style.height = `${Math.max(0, Math.max(...heights) - gap)}px`;
  };

  layout();
  window.addEventListener('resize', layout);
  return layout;
}
