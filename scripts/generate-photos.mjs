/**
 * Generates sample photo content:
 *   src/content/wall/*.svg                    — flat photos for the wall view
 *   src/content/portfolios/<slug>/{zh,en,ja}.md + main.svg + 1..n.svg
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (rel, content) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, 'utf8');
  console.log('wrote', rel);
};

const svg = (w, h, from, to, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><circle cx="${w * 0.7}" cy="${h * 0.25}" r="${Math.min(w, h) * 0.2}" fill="#fff" opacity="0.22"/><circle cx="${w * 0.25}" cy="${h * 0.75}" r="${Math.min(w, h) * 0.24}" fill="#fff" opacity="0.14"/>${label ? `<text x="${w / 2}" y="${h / 2}" font-family="sans-serif" font-size="${Math.round(h / 12)}" fill="#fff" opacity="0.85" text-anchor="middle">${label}</text>` : ''}</svg>\n`;

// 墙图:不同比例,营造瀑布流
const wall = [
  ['#f2a65a', '#e07a5f', '600', '800'],
  ['#5a8fec', '#7fc8f8', '800', '600'],
  ['#6cc4a1', '#3f9d7c', '700', '700'],
  ['#c98bc7', '#8f6bbd', '600', '900'],
  ['#f0c05a', '#e8915a', '900', '600'],
  ['#7fb3d5', '#4a7c9e', '750', '750'],
  ['#e58f9a', '#c55b74', '600', '760'],
  ['#88c1a5', '#4f8f6f', '820', '600'],
];
wall.forEach(([a, b, w, h], i) => out(`src/content/wall/wall-${i + 1}.svg`, svg(w, h, a, b, `wall ${i + 1}`)));

// 作品集:照片直接复用墙图(横竖混排),保证与 wall 同一批图片
const portfolio = (slug, cnTitle, enTitle, jaTitle, count, cnDesc, enDesc, jaDesc) => {
  const dims = [
    ['#4aa3c2', '#2a6f8a', '820', '600'], // 横
    ['#e88b9a', '#c55b74', '600', '820'], // 竖
    ['#6cc4a1', '#3f9d7c', '720', '720'], // 方
    ['#f0c05a', '#e8915a', '620', '840'], // 竖
    ['#7fb3d5', '#4a7c9e', '860', '580'], // 横
    ['#c98bc7', '#8f6bbd', '700', '860'], // 竖
  ];
  for (let i = 1; i <= count; i++) {
    const [a, b, w, h] = dims[(i - 1) % dims.length];
    out(
      `src/content/portfolios/${slug}/${i === 1 ? 'main' : i}.svg`,
      svg(w, h, a, b, `${slug} · ${i}`)
    );
  }
  const meta = (title, desc) => {
    const fm = [`title: ${JSON.stringify(title)}`];
    if (desc) fm.push(`description: ${JSON.stringify(desc)}`);
    return `---\n${fm.join('\n')}\n---\n`;
  };
  out(`src/content/portfolios/${slug}/zh.md`, meta(cnTitle, cnDesc) + `${cnDesc}\n\n这是作品集 \`${slug}\` 的说明。照片来自该文件夹,点击照片可查看大图(后续可扩展灯箱)。\n`);
  out(`src/content/portfolios/${slug}/en.md`, meta(enTitle, enDesc) + `${enDesc}\n\nThis is the description for portfolio \`${slug}\`. The photos live in this folder.\n`);
  out(`src/content/portfolios/${slug}/ja.md`, meta(jaTitle, jaDesc) + `${jaDesc}\n\nポートフォリオ \`${slug}\` の説明です。写真はこのフォルダにあります。\n`);
};

portfolio('seaside', '海边', 'Seaside', '海辺', 5, '一段海边散步的影像记录。', 'A photographic walk along the seaside.', '海辺を歩いた写真記録。');
portfolio('flora', '花语', 'Flora', '花', 4, '关于花朵与色彩。', 'On flowers and color.', '花と色彩について。');

console.log('done.');
