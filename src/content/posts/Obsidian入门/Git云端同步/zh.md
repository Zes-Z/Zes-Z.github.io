
## 使用 Obsidian Git 同步笔记
### 1. 创建 GitHub 仓库
首先登录 GitHub。  
点击右上角 **New Repository**。  
填写仓库信息：
- Repository name：例如 `Obsidian`
- Visibility：Public 或 Private（推荐 Private）
- 不要勾选：
  - Add a README
  - Add .gitignore
  - Choose a license

然后点击
- Create repository

创建成功后会得到一个仓库地址，例如：

```text
https://github.com/yourname/Obsidian.git
```

后面需要使用它。

---

### 2. 安装 Git

如果电脑尚未安装 Git，请前往：

https://git-scm.com/downloads

下载安装即可。

安装完成后打开终端：

```bash
git --version
```

如果输出类似：

```text
git version 2.50.0
```

说明安装成功。

---

### 3. 创建 Obsidian Vault

打开 Obsidian。

点击

> Create new vault

例如：

```text
D:\Obsidian\Knowledge
```

以后所有笔记都会放在这个目录。

---

### 4. 初始化 Git 仓库

打开终端（PowerShell 或 CMD）。

进入 Vault：

```bash
cd D:\Obsidian\Knowledge
```

初始化 Git：

```bash
git init
```

连接远程仓库：

```bash
git branch -M main
git remote add origin https://github.com/yourname/Obsidian.git
```

查看是否成功：

```bash
git remote -v
```

输出类似以下，说明连接成功。

```text
origin https://github.com/yourname/Obsidian.git
```



在知识库D:\Obsidian\Knowledg文件夹下新建第一个笔记

返回`powershell`并手动推送到远端(仅此次需要)

```bash
git add .

git commit -m "first obsidian commit"

git push -u origin main
```

一会过后如果 GitHub 仓库页面出现你的笔记文件，就说明配置成功。

---

### 6. 安装 Obsidian Git 插件

打开

Settings → Community Plugins

关闭 Safe Mode。

点击

> Browse

搜索：

```text
Git
```

安装并启用。

---

### 7. 配置插件

进入：

Settings → Obsidian Git

推荐开启：

```
Auto Pull on startup
```

启动时自动拉取最新内容。

```
Auto Backup
```

自动 Commit。

```
Auto Push
```

自动 Push。

例如：

```
Auto Backup Interval
```

设置：

```text
10
```

表示每 10 分钟自动提交一次。

---

