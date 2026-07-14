---
title: "从零开始搭建个人blog(hexo & asto)"
description: ""
pubDate: "2026-03-15"
category: "Math & Coding"
heroImage: "../../assets/wallpapers/IMG_1194_1.JPG"
homeFeatured: false
# homeHeroOrder:      # 用于指定首页个签下方置顶文章顺序,在 MyBlogsrcpagesindex.astro 第27行增加置顶篇章
homeOrder:  2        # 用于指定首页下方 All Posts顺序

draft: false
---

# 安装基础环境并配置镜像源
## 1. 安装以下工具
* [x] [vscode](https://code.visualstudio.com/)(或任何其他编辑器)

* [ ] [Node.js](https://nodejs.org/)
    
* [ ] [Git](https://git-scm.com/)
    
* [ ] [注册GitHub账号和新建一个仓库](https://github.com/)

* [x] [Netlify](https://www.netlify.com/)(用于网站专属域名,可暂时忽略)


---

## 2. 验证版本
* [ ] 安装完成后在 PowerShell 验证：

```powershell
node -v

npm -v

git --version
```

* 所有命令行,需要回车才能运行噢! 如果能输出版本号说明安装成功。
* 运行卡住或无结果，按下Ctrl+C 中止命令。
* 此外，当你第一次尝试通过以下方式运行一个脚本时，可能会遇到（提示“在此系统上禁止运行脚本”）  
这是 PowerShell 的执行策略限制，禁止运行脚本文件。
* 解决方案
修改 PowerShell 执行策略
以管理员身份打开 PowerShell，运行：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
然后输入 Y 确认。

---


## 3. 配置npm镜像源,并下载 pnpm 

```powershell
npm config set registry https://registry.npmmirror.com

npm install -g pnpm
```

---
# 基于 Astro 搭建个人博客
## 本地新建博客项目
1. 准备工作
* [x] 在这里挑选一个喜欢的主题 [Jumpstart your next project with a theme](https://astro.build/themes/)  
* [x] 在D盘创建一个空的博客项目文件夹,例如: D:/MyBlog

2. 进入博客项目文件夹，并打开终端输入:
```powershell
# 十分关键的一步,所有博客项目从这里开始,以下两行二选一即可
pnpm create astro@latest <项目名> -- --template <模板仓库名称>
git clone <喜欢的主题的github仓库地址> <博客文件夹>

# 完整命令展示,以下是两个不同主题的示例
pnpm create fuwari@latest <MyBlog>
or
git clone https://github.com/hanityx/astro-tone.git MyBlog

```
> **说明**  
> * 步骤2 其实是在本地创建一个空的博客项目文件夹,并将目标主题复制到其中,并初始化项目
> * `项目名`=`博客文件夹名`,即刚刚在D盘创建的那个文件夹,现在应该不是空的了!  
> * `模板仓库名称`=`喜欢的主题的github仓库地址`,可以在挑选主题时点击`Get started`下滑找到

3. 安装依赖
* [ ] 对于每一个新建的博客项目,都需要执行,以自动补全需要的依赖和工具
```powershell
cd MyBlog
pnpm install 
```

---
## 初始化 git, 关联仓库
4. 初始化 git, 并重新定义 main  
* [ ] 复制以下命令,回车
```powershell
Remove-Item -Recurse -Force .git  
git init  
git add .  
git commit -m "Initialize my new blog theme"  
git branch -M main  
```

5. 关联并推送到 GitHub 仓库  
* [x] 注意: 仓库链接可在创建时找到,请自行替换!
```powershell
git remote add origin https://github.com/Zes-Z/test.git  
git push -u origin main  
```
> **说明**  
> * 完成步骤5后,你应该能在 GitHub 仓库中看到你的博客项目文件了,和在本地的一模一样!  
> * 下面我们开始开始把博客部署到网页上,这样大家都能在浏览器中访问你的博客了!

---
## 部署仓库到 GitHub Pages (或其他网页)
> 如果你有其它网页托管或个人域名，请跳过步骤6
> 并前往下方 **部署博客到Netlify** 

1. 创建 GitHub Actions  
> 注意: 部分博客项目会自带以下文件, 如果有, 直接前往步骤7  
> 如果没有 `MyBlog\.github\workflows\deploy.yml` 则需要自行创建**
* [ ] 在你的项目根目录下，新建一个名为 .github 的文件夹。

* [ ] 在 .github 里面，再建一个名为 workflows 的文件夹。

* [ ] 在 workflows 里面，新建一个名为 deploy.yml 的文件。

* [ ] 最终的文件路径长这样：D:\ZesProjects\MyBlog\.github\workflows\deploy.yml

* [ ] 将以下内容复制到 deploy.yml 文件中：
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main] # 每次向 main 分支推送代码时自动触发

# 给这个 Action 授予修改 GitHub Pages 的权限
permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10 

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --no-frozen-lockfile

      - name: Build Astro
        run: pnpm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist 

  deploy:
    name: Deploy
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

7. 去 GitHub 网页端开启 Pages 权限
* [ ] 进入 GitHub 博客仓库：https://github.com/Zes-Z/Zes-Z.github.io  
* [ ] 点击上方的 Settings（设置）。  
* [ ] 在左侧边栏找到 Pages 选项并点击。  
* [ ] 在页面正中间的 Build and deployment -> Source 这一栏，点击下拉菜单。  
* [ ] 将默认的 Deploy from a branch 修改为 GitHub Actions  


8. 修改博客根目录下的 astro.config.mjs 文件
* [ ] 将第9行这块代码替换为：
```yaml
export default defineConfig({
	site: 'https://Zes-Z.github.io',  # 你的github域名
	base: '/test/',   # 你的仓库名,如果这个博客项目的仓库是你的第一个项目，那么保持:base: '/',
```

9. 推送配置  
回到终端，输入：
```powershell
git add .
git commit -m "Add GitHub Actions workflow for deployment"
git push
```


## 部署博客到Netlify
* [ ] 完成步骤5后, 从此处开始
* [ ] 登录并注册 [Netlify](https://app.netlify.com/)
* [ ] 创建一个新项目, 选择从 GitHub仓库 导入
* [ ] 点击小绿点右侧的`xxx.netlify.app`以访问你的个人博客网站!
* [ ] 点击`Quick setup`自定义域名
* [ ] OK! 完结收工

---
## 自定义博客主题设置
* [ ] 主题的基础个性化可以在`src/config.yml`配置文件中修改
* [ ] 主题的其它配置请参照作者的说明文档进行自定义!

---
## 日常写作流
1. 新建文章
> pnpm new-post 

2. 使用记事本或编辑器编辑.md文件

3. 本地预览
> pnpm dev

4. 推送前测试及预览  
> pnpm build  
> pnpm preview

5. 推送到github仓库  
> git add .  
> git commit -m "f"  
> git push  


## git推送失败
* [ ] 查看当前配置：
```powershell
git config --global --get http.proxy
git config --global --get https.proxy
```
* [ ] 取消代理配置：
```powershell
git config --global --unset http.proxy
git config --global --unset https.proxy
```
* [ ] git指定代理端口：
```powershell
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897
```

---

# 基于 Hexo 搭建个人博客
## 1. 安装 Hexo CLI

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

## 2.初始化博客项目

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

## 3. 本地启动博客

### 1 生成静态页面

```powershell
hexo g
```

该命令会根据 Markdown 内容生成静态 HTML。

* * *

### 2 启动本地服务器

```powershell
hexo s
```

浏览器访问：

```powershell
http://localhost:4000
```

即可看到博客页面，这时展现的是默认主题，自定义方法见文末。

* * *

## 4. 创建文章

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

## 5. 创建 GitHub 仓库

登录 GitHub，没有账号现建一个。

创建一个仓库：`username.github.io`

例如：`zeszheng.github.io`

这个仓库将用于托管博客。
SSH 链接复制下来,一会要用

* * *

## 6. 安装部署插件

Hexo 需要部署插件才能发布到 GitHub Pages。

安装：

```powershell
npm install hexo-deployer-git --save
```

* * *

## 7. 配置部署

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

## 8. 部署博客

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

## 9.日常写作工作流

日常使用 Hexo 的基本流程如下。

### 1 创建文章

```powershell
hexo new "post title"
```

* * *

### 2 本地预览

```powershell
hexo g

hexo s
```

* * *

### 3 发布博客

```powershell
hexo clean

hexo g

hexo d
```

* * *

## hexo 博客完整流程总结

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
## 自定义Hexo主题
* [ ] 进入[Hexo](https://hexo.io/themes/)官网Themes页面并挑选
* [ ] 点击**Visit preview site**预览主题
* [ ] 点击**主题名**链接，进入`github`，根据主题教程克隆并使用此主题

---