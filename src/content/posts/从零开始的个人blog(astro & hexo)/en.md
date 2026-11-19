---
title: "Build a Personal Blog from Scratch (Astro & Hexo)"
description: "A step-by-step guide to creating and publishing personal blogs with Astro or Hexo."
pubDate: "2026-03-15"
category: "Math & Coding"
tag: [blog,astro,hexo,introduction]
postImage:
homepined: false
pinedOrder: 0
draft: false
---

## Install the basic environment and configure a package mirror
### 1. Install the following tools
* [x] [vscode](https://code.visualstudio.com/)(or any other editor)

* [ ] [Node.js](https://nodejs.org/)
    
* [ ] [Git](https://git-scm.com/)
    
* [ ] [Register for GitHub and create a repository](https://github.com/)

* [x] [Netlify](https://www.netlify.com/)(for a custom domain; you can skip this for now)


> [!caution]
> If you download and install software using an `.msi` file, you may encounter installation errors **2503 or 2502**
> Here is how to fix it:
> * [x] Click the Start icon in the lower-left corner of the desktop and search for `powershell`
> * [x] Right-click and **Run `powershell` as administrator**, then enter `*msiexec /i "path to the .msi installer"*` and press Enter
> 
> For example:  
> To force-install the installer "go1.26.5.windows-amd64.msi" from the All downloads folder on drive D:  
> enter this in `powershell`:  
> `*msiexec /i "D:\All downloads\go1.26.5.windows-amd64.msi"*`

---

### 2. Verify the versions
* [ ] After installation, verify in PowerShell:

```powershell
node -v

npm -v

git --version
```

* Press Enter to run each command! If a version number is displayed, the installation succeeded.
* If a command hangs or produces no result, press Ctrl+C to stop it.
* The first time you try to run a script this way, you may also see a message saying that script execution is disabled on this system.  
This is caused by PowerShell’s execution policy, which blocks script files.
* Solution
Change the PowerShell execution policy
Open PowerShell as an administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then enter Y to confirm.

---


### 3. Configure the npm registry mirror and install pnpm 

```powershell
npm config set registry https://registry.npmmirror.com

npm install -g pnpm
```

---
## Build a personal blog with Astro
### Create a blog project locally
1. Preparation
* [x] Choose a theme you like here [Jumpstart your next project with a theme](https://astro.build/themes/)  
* [x] 在D盘创建一个空的博客项目文件夹,For example: D:/MyBlog

2. Open a terminal in the blog project folder and enter:
```powershell
# This is an essential step where every blog project begins. Choose either of the following commands.
pnpm create astro@latest <project-name> -- --template <template-repository>
git clone <theme-github-repository-url> <blog-folder>

# Full command examples using two different themes
pnpm create fuwari@latest <MyBlog>
or
git clone https://github.com/hanityx/astro-tone.git MyBlog

```
> **Notes**  
> * Step 2 creates an empty blog project folder locally, copies the selected theme into it, and initializes the project.
> * `project name` = `blog folder name`: the folder you just created on drive D, which should no longer be empty!  
> * `template repository` = the GitHub repository URL of your chosen theme. On the theme page, click `Get started` and scroll down to find it.

3. Install dependencies
* [ ] Run this for every new blog project to install its dependencies and tools.
```powershell
cd MyBlog
pnpm install 
```

---
### Initialize Git and connect a repository
4. Initialize Git and set the branch name to main  
* [ ] Copy and run the following commands
```powershell
Remove-Item -Recurse -Force .git  
git init  
git add .  
git commit -m "Initialize my new blog theme"  
git branch -M main  
```

5. Connect to and push to a GitHub repository  
* [x] Note: Find the repository URL when you create it and replace the example below.
```powershell
git remote add origin https://github.com/Zes-Z/test.git  
git push -u origin main  
```
> **Notes**  
> * After step 5, your blog project files should appear in the GitHub repository exactly as they do locally.  
> * Next, we’ll deploy the blog so everyone can visit it in a browser.

---
### Deploy the repository to GitHub Pages (or another host)
> If you use another hosting service or have a custom domain, skip step 6
> and go to **Deploy the blog to Netlify** below. 

1. Create a GitHub Actions workflow  
> Note: Some blog themes include this file. If yours does, go directly to step 7.  
> If `MyBlog\.github\workflows\deploy.yml` does not exist, create it yourself.
* [ ] In your project root, create a folder named .github.

* [ ] Inside .github, create another folder named workflows.

* [ ] Inside workflows, create a file named deploy.yml.

* [ ] The final file path should look like this: D:\ZesProjects\MyBlog\.github\workflows\deploy.yml

* [ ] Copy the following into deploy.yml:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main] # Runs automatically whenever code is pushed to the main branch

# Grant this Action permission to update GitHub Pages
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

7. Enable Pages in the GitHub website
* [ ] Open your blog repository on GitHub: https://github.com/Zes-Z/Zes-Z.github.io  
* [ ] Click Settings at the top.  
* [ ] Find and click Pages in the left sidebar.  
* [ ] In the Build and deployment -> Source section in the center of the page, click the dropdown menu.  
* [ ] Change the default Deploy from a branch option to GitHub Actions.  


8. Edit astro.config.mjs in the blog root
* [ ] Replace the code around line 9 with:
```yaml
export default defineConfig({
	site: 'https://Zes-Z.github.io',  # your GitHub domain
	base: '/test/',   # your repository name; use base: '/' if this is your first project repository,
```

9. Push the configuration  
Return to the terminal and enter:
```powershell
git add .
git commit -m "Add GitHub Actions workflow for deployment"
git push
```


### Deploy the blog to Netlify or Cloudflare
* [ ] After step 5, continue from here.
* [ ] Sign in or create an account at [Netlify](https://app.netlify.com/)
* [ ] Create a new project and import it from a GitHub repository.
* [ ] Click `xxx.netlify.app` next to the green status indicator to visit your blog!
* [ ] Click `Quick setup` to configure a custom domain.
* [ ] That’s it!

---
### Customize the blog theme
* [ ] Basic theme settings can be changed in `src/config.yml`.
* [ ] 主题的其它配置请参照作者的Notes文档进行自定义!

---
## Everyday writing workflow
1. Create a post
> pnpm new-post 

2. Edit the .md file with Notepad or another editor

3. Preview locally
> pnpm dev

4. Test and preview before pushing  
> pnpm build  
> pnpm preview

5. Push to the GitHub repository  
> git add .  
> git commit -m "f"  
> git push  


## Git push fails
* [ ] Check the current configuration:
```powershell
git config --global --get http.proxy
git config --global --get https.proxy
```
* [ ] Remove the proxy settings:
```powershell
git config --global --unset http.proxy
git config --global --unset https.proxy
```
* [ ] Set the proxy port for Git:
```powershell
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897
```

---

## Build a personal blog with Hexo
### 1. Install the Hexo CLI

The Hexo CLI is Hexo’s command-line tool.

Run this in PowerShell:

```powershell
npm install -g hexo-cli
```

Verify the installation:

```powershell
hexo -v
```

如果显示 Hexo 版本信息Notes安装成功。

* * *

### 2.Initialize the blog project

Choose a working directory, for example:

```powershell
cd D:\
```

Create a Hexo blog:

```powershell
hexo init ZesBlog
```

Go to the blog directory:

```powershell
cd ZesBlog
```

Install dependencies：

```powershell
npm install
```

The directory structure should now look roughly like this:

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

### 3. Run the blog locally

#### 1 Generate static pages

```powershell
hexo g
```

This command generates static HTML from the Markdown content.

* * *

#### 2 Start the local server

```powershell
hexo s
```

Open this address in your browser:

```powershell
http://localhost:4000
```

You should see the blog with its default theme. See the end of this guide to customize it.

* * *

### 4. Create a post

After previewing in the previous step, press `Ctrl+C` in the terminal to stop the server.  
输入以下命令以Create a post：

```powershell
hexo new "first post"
```

Hexo will create this file:

```powershell
source/_posts/first-post.md
```

A basic post looks like this:

```
---
title: First Post
date: 2026-03-15
tags:
---
```

**Write the post content in this .md file. You can open and edit it with Notepad.**

* * *

### 5. Create a GitHub repository

Sign in to GitHub, or create an account if you don’t have one.

Create a repository named `username.github.io`.

For example: `zeszheng.github.io`

This repository will host your blog.
Copy the SSH URL; you’ll need it shortly.

* * *

### 6. Install the deployment plugin

Hexo needs a deployment plugin to publish to GitHub Pages.

Install it:

```powershell
npm install hexo-deployer-git --save
```

* * *

### 7. Configure deployment

* Edit this file in the blog root:

```
_config.yml
```
**This file is used to customize the website.**

* Add the deployment configuration:

```
deploy:
type: git
repo: https://github.com/username/username.github.io.git
branch: main
```

Replace `username` with your GitHub username.

* * *

### 8. Deploy the blog

* [ ] Run:

```powershell
hexo clean  # Clear the Hexo cache

hexo g      # Generate the site

hexo d      # Deploy to the remote GitHub repository
```

* [ ] After deployment, visit:

```
https://username.github.io
```

Your blog should now be online.

* * *

### 9.Everyday writing workflow

The basic Hexo workflow is as follows.

#### 1 Create a post

```powershell
hexo new "post title"
```

* * *

#### 2 Preview locally

```powershell
hexo g

hexo s
```

* * *

#### 3 Publish the blog

```powershell
hexo clean

hexo g

hexo d
```

* * *

### Hexo workflow summary

1. Install Node.js and Git, and configure a registry mirror
    
2. Install the Hexo CLI
    
3. Initialize a Hexo project
    
4. Run the blog locally
    
5. Create a GitHub repository
    
6. Configure deployment插件
    
7. Publish to GitHub Pages
    

For everyday writing after setup, run:

```powershell
# Run blog commands from this root folder. In PowerShell, first enter:
cd Myblog  

hexo new

hexo g

hexo s  # Press Ctrl+C to stop the local preview before running hexo d

hexo d  # Push to GitHub
```

This completes the writing, preview, and publishing workflow.

---
### Customize the Hexo theme
* [ ] Browse and choose a theme on the official [Hexo](https://hexo.io/themes/) Themes page.
* [ ] Click **Visit preview site** to preview a theme.
* [ ] Click the **theme name** link to open its GitHub repository, then follow its instructions to clone and use the theme.

---