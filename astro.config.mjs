import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig } from './src/site.config';

// GitHub Pages 子路径自动推导:
//   - 本地开发 / 用户页(<username>.github.io):base = '/'
//   - 项目页(<username>.github.io/<repo>):base = '/<repo>/'
//   也可用环境变量 ASTRO_BASE 手动指定(如自定义子路径)。
const repoParts = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const owner = (repoParts[0] ?? '').toLowerCase();
const repoName = repoParts[1] ?? '';
// 用户页仓库名 = <owner>.github.io,应部署在根路径,不需要 base 前缀
const isUserPageRepo = repoName.toLowerCase() === `${owner}.github.io`;
const autoBase =
  process.env.GITHUB_ACTIONS && repoName && !isUserPageRepo ? `/${repoName}/` : '/';
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
