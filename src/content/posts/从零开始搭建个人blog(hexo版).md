---
title: 从零开始搭建个人blog(hexo版)
published: 2026-03-15 14:18:05
description: 使用Windows PowerShell + Node.js + Git 搭建 Hexo 博客
tags: [blog,web,hexo]
category: Coding
draft: false
---

**需要的工具**

- Node.js
    
- Git
    
- GitHub账号
    

* * *

# 一、安装基础环境并配置镜像源

## 1 安装 Node.js

下载 Node.js ：[https://nodejs.org](https://nodejs.org/)

安装完成后在 PowerShell 验证：

```powershell
node -v

npm -v
```

如果能输出版本号说明安装成功。

在使用npm下载各种包之前，需先配置镜像源:

```powershell
npm config set registry https://registry.npmmirror.com
```

* * *

## 2 安装 Git

下载：

[https://git-scm.com](https://git-scm.com/)

安装完成后验证：

```powershell
git --version
```

* * *

# 二、安装 Hexo CLI

Hexo CLI 是 Hexo 的命令行工具。

在 PowerShell 中执行：

```powershell
npm install -g hexo-cli
```

验证安装：

```powershell
hexo -v
```

如果显示 Hexo 版本信息说明安装成功。

* * *

# 三、初始化博客项目

选择一个工作目录，例如：

```powershell
cd D:\
```

创建 Hexo 博客：

```powershell
hexo init ZesBlog
```

进入博客目录：

```powershell
cd ZesBlog
```

安装依赖：

```powershell
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

```powershell
hexo g
```

该命令会根据 Markdown 内容生成静态 HTML。

* * *

## 2 启动本地服务器

```powershell
hexo s
```

浏览器访问：

```powershell
http://localhost:4000
```

即可看到博客页面，这时展现的是默认主题，自定义方法见文末。

* * *

# 五、创建文章

在上一步预览完成后，命令行内输入`Ctrl+C`退出预览  
输入以下命令以新建文章：

```powershell
hexo new "first post"
```

Hexo 会自动生成文件：

```powershell
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

**文章内容写在这个.md文件里，可以使用记事本打开并编辑。**

* * *

# 六、创建 GitHub 仓库

登录 GitHub，没有账号现建一个。

创建一个仓库：`username.github.io`

例如：`zeszheng.github.io`

这个仓库将用于托管博客。
SSH 链接复制下来,一会要用

* * *

# 七、安装部署插件

Hexo 需要部署插件才能发布到 GitHub Pages。

安装：

```powershell
npm install hexo-deployer-git --save
```

* * *

# 八、配置部署

* 编辑博客根目录：

```
_config.yml
```
**这个文件用于个性化网站**

* 添加部署配置：

```
deploy:
type: git
repo: https://github.com/username/username.github.io.git
branch: main
```

将 `username` 替换为你的 GitHub 用户名。

* * *

# 九、部署博客

* [ ] 执行：

```powershell
hexo clean  # 清除hexo缓存

hexo g      # 生成配置文件

hexo d      # 部署到远端github仓库
```

* [ ] 部署完成后访问：

```
https://username.github.io
```

即可看到你的博客。

* * *

# 十、日常写作工作流

日常使用 Hexo 的基本流程如下。

## 1 创建文章

```powershell
hexo new "post title"
```

* * *

## 2 本地预览

```powershell
hexo g

hexo s
```

* * *

## 3 发布博客

```powershell
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

```powershell
# 博客的操作都是在这个根目录下进行的，首先在powershell中输入下行命令，进入这个文件夹
cd Myblog  

hexo new

hexo g

hexo s  # ctrl+c退出本地预览后，才可 hexo d 推送到远端

hexo d  # 推送到github
```

即可完成写作、预览和发布。

---
# 自定义Hexo主题
* [ ] 进入[Hexo](https://hexo.io/themes/)官网Themes页面并挑选
* [ ] 点击**Visit preview site**预览主题
* [ ] 点击**主题名**链接，进入`github`，根据主题教程克隆并使用此主题

---