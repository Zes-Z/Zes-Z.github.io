/**
 * Shared masonry ratio helpers.
 *
 * 整个项目图片只有三种宽高比。在 3 列瀑布流中,每个块的显示尺寸为
 * (列宽 6 位距):
 *   2/3(宽)图 → 高 4、宽 6
 *   3/2(高)图 → 高 9、宽 6
 *   1/1(方)图 → 高 6、宽 6
 * 上下衔接:两张高 4 的块 + 1 位距 = 一张高 9 的块。
 *
 * 注意:CSS `aspect-ratio` 是"宽:高",而上面的 4/6·9/6·6/6 是"高:宽",
 * 所以这里存的必须是 CSS 宽:高 → 3/2、2/3、1/1。
 */
export const MASONRY_RATIOS = ['3 / 2', '2 / 3', '1 / 1'] as const;

/**
 * 兜底比例(图片宽高未知时使用)。取 1/1,而不是过去各处硬编码的 '6 / 6'
 * ('6 / 6' 数值上等于 1/1,但不在 MASONRY_RATIOS 体系里,容易被误读成
 * "6 列布局"之类的含义)。
 */
export const DEFAULT_RATIO: string = MASONRY_RATIOS[2];

/** 把图片真实宽高比(宽/高)映射到最近的 3/2·2/3·1/1。 */
export function nearestRatio(
  width: number,
  height: number,
  allowed: readonly string[] = MASONRY_RATIOS
): string {
  const targets = allowed.map((ratio) => {
    const [w, h] = ratio.split('/').map((n) => Number(n.trim()));
    return { value: w / h, label: ratio };
  });
  const aspect = width / height;
  let best = targets[0]!;
  for (const t of targets) {
    if (Math.abs(aspect - t.value) < Math.abs(aspect - best.value)) best = t;
  }
  return best.label;
}
