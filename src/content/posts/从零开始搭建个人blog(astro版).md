---
title: 从零开始搭建个人blog(astro版)
published: 2026-04-02
description: 使用PowerShell + Astro框架 + Git 搭建个人博客网站
category: Math & Coding
tags: [blog,astro]
image: ''
draft: false 
lang: ''
---
## 下载项目
> pnpm create fuwari@latest

## 安装依赖
> pnpm install 

---
## 初始化git,并重新定义main
> rm -r -Force .git  
> git init  
> git add .  
> git commit -m "初始化"  

> git branch  
> git branch -M main

---
## 关联远程仓库并推送
> git remote add origin https://github.com/Zes-Z/Zes-Z.github.io.git  
> git push -u origin main

---
## 日常写作流
1. 新建文章
> pnpm new-post 

2. 使用记事本编辑.md文件

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