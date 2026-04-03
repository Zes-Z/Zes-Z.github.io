---
title: 从零开始搭建个人blog(hexo版)
published: 2026-03-15 14:18:05
description: 使用Windows PowerShell + Node.js + Git 搭建 Hexo 博客
tags: [blog,web,hexo]
category: Coding
draft: false
---

# Windows + PowerShell 从零搭建 Hexo 博客工作流程

## 技术栈

- Node.js
    
- Git
    
- Hexo
    
- GitHub
    
- GitHub Pages
    

* * *

# 一、安装基础环境并配置镜像源

## 1 安装 Node.js

下载 LTS 版本：

[https://nodejs.org](https://nodejs.org/)

安装完成后在 PowerShell 验证：

```
node -v

npm -v
```

如果能输出版本号说明安装成功。

在使用npm下载各种包之前，需先配置镜像源:

```
npm config set registry https://registry.npmmirror.com
```

* * *

## 2 安装 Git

下载：

[https://git-scm.com](https://git-scm.com/)

安装完成后验证：

```
git --version
```

* * *

# 二、安装 Hexo CLI

Hexo CLI 是 Hexo 的命令行工具。

在 PowerShell 中执行：

```
npm install -g hexo-cli
```

验证安装：

```
hexo -v
```

如果显示 Hexo 版本信息说明安装成功。

* * *

# 三、初始化博客项目

选择一个工作目录，例如：

```
cd D:\
```

创建 Hexo 博客：

```
hexo init ZesBlog
```

进入博客目录：

```
cd ZesBlog
```

安装依赖：

```
npm install
```

此时目录结构大致如下：

```
ZesBlog
│
├─ _config.yml
├─ package.json
├─ source
├─ themes
└─ scaffolds
```


* * *

# 四、本地启动博客

## 1 生成静态页面

```
hexo g
```

该命令会把 Markdown 内容生成静态 HTML。

* * *

## 2 启动本地服务器

```
hexo s
```

浏览器访问：

```
http://localhost:4000
```

即可看到博客页面。

* * *

# 五、创建文章

新建文章：

```
hexo new "first post"
```

Hexo 会自动生成文件：

```
source/_posts/first-post.md
```

文章基本结构：

```
---
title: First Post
date: 2026-03-15
tags:
---
```

`文章内容写在这里。`

* * *

# 六、创建 GitHub 仓库

登录 GitHub，没有账号现建一个。

创建一个仓库：

```
username.github.io
```

例如：

```
zeszheng.github.io
```

这个仓库将用于托管博客。
SSH 链接复制下来,一会要用

* * *

# 七、安装部署插件

Hexo 需要部署插件才能发布到 GitHub Pages。

安装：

```
npm install hexo-deployer-git --save
```

* * *

# 八、配置部署

编辑博客根目录：

```
_config.yml
```

添加部署配置：

```
deploy:
type: git
repo: https://github.com/username/username.github.io.git
branch: main
```

将 `username` 替换为你的 GitHub 用户名。

* * *

# 九、部署博客

执行：

```
hexo clean

hexo g

hexo d
```

部署完成后访问：

```
https://username.github.io
```

即可看到你的博客。

* * *

# 十、日常写作工作流

日常使用 Hexo 的基本流程如下。

## 1 创建文章

```
hexo new "post title"
```

* * *

## 2 本地预览

```
hexo s
```

* * *

## 3 发布博客

```
hexo clean

hexo g

hexo d
```

* * *

# 十一、总结

完整流程：

1. 安装 Node.js，配置镜像源 和 Git
    
2. 安装 Hexo CLI
    
3. 初始化 Hexo 项目
    
4. 本地运行博客
    
5. 创建 GitHub 仓库
    
6. 配置部署插件
    
7. 发布到 GitHub Pages
    

之后日常写作只需：

```
hexo new

hexo s

hexo d
```

即可完成写作、预览和发布。

---