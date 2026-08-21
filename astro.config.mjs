import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig } from './src/site.config';

// GitHub Pages 子路径自动推导:
//   - 本地开发 / 用户页(<username>.github.io):base = '/'
//   - 项目页(<username>.github.io/<repo>):base = '/<repo>/'
//   也可用环境变量 ASTRO_BASE 手动指定(如自定义子路径)。
const repoParts = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const owner = repoParts[0] ?? '';
const repoName = repoParts[1] ?? '';
const autoBase =
  process.env.GITHUB_ACTIONS && repoName && repoName !== owner ? `/${repoName}/` : '/';
const base = process.env.ASTRO_BASE || autoBase;

// https://astro.build/config
export default defineConfig({
  site: siteConfig.siteUrl,
  base,
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
