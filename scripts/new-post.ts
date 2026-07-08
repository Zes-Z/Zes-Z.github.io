/* Create a new post markdown file for Astro Tone */

import fs from "fs";
import path from "path";

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(`Error: No filename argument provided

Usage:
pnpm new-post "post-title"
`);
  process.exit(1);
}

let fileName = args[0];

// Add .md extension if missing
const fileExtensionRegex = /\.(md|mdx)$/i;

if (!fileExtensionRegex.test(fileName)) {
  fileName += ".md";
}

const targetDir = "./src/content/posts/";
const fullPath = path.join(targetDir, fileName);

if (fs.existsSync(fullPath)) {
  console.error(`Error: File already exists\n${fullPath}`);
  process.exit(1);
}

// Create directory if needed
const dirPath = path.dirname(fullPath);

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const content = `---
title: "${args[0]}"
description: ""
pubDate: "${getDate()}"
category: "Math & Coding"
# updatedDate: "${getDate()}"
heroImage: ""
# homeHeroOrder:      # 用于指定首页个签下方置顶文章顺序,在 src\pages\index.astro 第27行增加置顶篇章数
homeFeatured: false   # 用于指定在首页 Read 区优先大图片展示
# homeOrder:          # 用于指定首页下方 All Posts顺序
draft: false
---

## 



---

##



---

##



---


`;
fs.writeFileSync(fullPath, content, "utf8");

console.log(`✓ Post created: ${fullPath}`);
