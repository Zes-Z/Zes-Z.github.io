import { mkdir, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const publicDir = fileURLToPath(new URL('../public/', import.meta.url));
const imagePattern = /\.(?:jpe?g|png|webp|avif)$/i;
let generated = 0;

async function prepare(folder, widths, quality) {
  const sourceDir = join(publicDir, folder);
  const previewDir = join(publicDir, 'previews', folder);
  await mkdir(previewDir, { recursive: true });

  for (const entry of await readdir(sourceDir, { withFileTypes: true })) {
    if (!entry.isFile() || !imagePattern.test(entry.name)) continue;
    const source = join(sourceDir, entry.name);
    const sourceInfo = await stat(source);

    for (const width of widths) {
      const output = join(previewDir, `${entry.name}.${width}.avif`);
      const outputInfo = await stat(output).catch(() => undefined);
      if (outputInfo && outputInfo.mtimeMs >= sourceInfo.mtimeMs) continue;

      try {
        await sharp(source)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .avif({ quality, effort: 2 })
          .toFile(output);
        generated += 1;
      } catch (error) {
        console.warn(`[Images] Could not prepare ${source}: ${error.message}`);
      }
    }
  }
}

await prepare('wallpaper', [960, 1600], 58);
await prepare('avatar', [160], 65);
console.log(`[Images] Prepared ${generated} AVIF preview${generated === 1 ? '' : 's'}.`);
