---
title: "ゼロから個人ブログを作る（Astro・Hexo）"
description: "AstroまたはHexoで個人ブログを作成し、公開するまでの手順を紹介します。"
pubDate: "2026-03-15"
category: "Math & Coding"
tag: [blog,astro,hexo,introduction]
postImage:
homepined: false
pinedOrder: 0
draft: false
---

## 基本環境をインストールしてミラーを設定する
### 1. 以下のツールをインストールする
* [x] [vscode](https://code.visualstudio.com/)（または任意のエディター）

* [ ] [Node.js](https://nodejs.org/)
    
* [ ] [Git](https://git-scm.com/)
    
* [ ] [GitHubに登録してリポジトリを作成する](https://github.com/)

* [x] [Netlify](https://www.netlify.com/)（独自ドメイン用。今は省略できます）


> [!caution]
> `.msi`ファイルでソフトウェアをインストールすると、**2503、2502**のインストールエラーが発生することがあります。
> 次の手順で解決できます。
> * [x] デスクトップ左下のスタートアイコンをクリックし、`powershell`を検索します。
> * [x] `powershell`を右クリックして**管理者として実行**し、`*msiexec /i ".msi形式のインストーラーのパス"*`を入力してEnterキーを押します。
> 
> 例：  
> DドライブのAll downloadsフォルダーにある「go1.26.5.windows-amd64.msi」を強制的にインストールする場合、  
> `powershell`に次のように入力します。  
> `*msiexec /i "D:\All downloads\go1.26.5.windows-amd64.msi"*`

---

### 2. バージョンを確認する
* [ ] インストール後、PowerShellで次のコマンドを実行して確認します。

```powershell
node -v

npm -v

git --version
```

* 各コマンドはEnterキーを押して実行します。バージョン番号が表示されればインストール成功です。
* コマンドが止まったり結果が表示されなかったりする場合は、Ctrl+Cで中断します。
* また、初めてスクリプトを実行すると、「このシステムではスクリプトの実行が無効になっています」と表示されることがあります。  
これはPowerShellの実行ポリシーにより、スクリプトファイルの実行が制限されているためです。
* 解決方法
PowerShellの実行ポリシーを変更する
PowerShellを管理者として開き、次を実行します。
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
続いてYを入力して確定します。

---


### 3. npmのミラーを設定してpnpmをインストールする 

```powershell
npm config set registry https://registry.npmmirror.com

npm install -g pnpm
```

---
## Astroで個人ブログを作る
### ローカルにブログプロジェクトを作成する
1. 準備
* [x] ここから好きなテーマを選びます [Jumpstart your next project with a theme](https://astro.build/themes/)  
* [x] 在D盘创建一个空的博客项目文件夹,例： D:/MyBlog

2. ブログのプロジェクトフォルダーでターミナルを開き、次を入力します。
```powershell
# 重要な手順です。ブログの作成はここから始まります。次のどちらか一方を実行します。
pnpm create astro@latest <プロジェクト名> -- --template <テンプレートリポジトリ>
git clone <選んだテーマのGitHubリポジトリURL> <ブログフォルダー>

# コマンド全体の例：異なるテーマを使う2つの例です
pnpm create fuwari@latest <MyBlog>
or
git clone https://github.com/hanityx/astro-tone.git MyBlog

```
> **説明**  
> * 手順2では、ローカルに空のブログフォルダーを作成し、選んだテーマをコピーしてプロジェクトを初期化します。
> * `プロジェクト名`=`ブログフォルダー名`です。先ほどDドライブに作成したフォルダーを指し、ここまでで空ではなくなっています。  
> * `テンプレートリポジトリ名`=`選んだテーマのGitHubリポジトリURL`です。テーマ選択ページで`Get started`をクリックし、下へスクロールすると見つかります。

3. 依存関係をインストールする
* [ ] 新しいブログプロジェクトごとに実行し、必要な依存関係やツールをインストールします。
```powershell
cd MyBlog
pnpm install 
```

---
### Gitを初期化してリポジトリに接続する
4. Gitを初期化し、ブランチ名をmainに設定する  
* [ ] 次のコマンドをコピーして実行します
```powershell
Remove-Item -Recurse -Force .git  
git init  
git add .  
git commit -m "Initialize my new blog theme"  
git branch -M main  
```

5. GitHubリポジトリに接続してプッシュする  
* [x] 注意：リポジトリのURLは作成時に確認できます。下記の例を置き換えてください。
```powershell
git remote add origin https://github.com/Zes-Z/test.git  
git push -u origin main  
```
> **説明**  
> * 手順5が終わると、ローカルと同じブログのファイルがGitHubリポジトリに表示されます。  
> * 次はブログを公開し、ブラウザーからアクセスできるようにします。

---
### GitHub Pages（または他のホスティングサービス）にデプロイする
> 別のホスティングサービスや独自ドメインを使う場合は、手順6を飛ばしてください
> 下の **Netlifyにブログをデプロイする** に進みます。 

1. GitHub Actionsを作成する  
> ブログテーマによっては次のファイルが最初から含まれています。その場合は手順7に進んでください。  
> `MyBlog\.github\workflows\deploy.yml`がない場合は、自分で作成します。
* [ ] プロジェクトのルートに`.github`フォルダーを作成します。

* [ ] `.github`の中に`workflows`フォルダーを作成します。

* [ ] `workflows`の中に`deploy.yml`ファイルを作成します。

* [ ] 最終的なファイルパスは次のようになります：D:\ZesProjects\MyBlog\.github\workflows\deploy.yml

* [ ] 次の内容を`deploy.yml`にコピーします。
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main] # mainブランチへのプッシュ時に自動実行

# このActionにGitHub Pagesの変更権限を付与
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

7. GitHubのウェブサイトでPagesを有効にする
* [ ] GitHubのブログリポジトリを開きます：https://github.com/Zes-Z/Zes-Z.github.io  
* [ ] 上部のSettings（設定）をクリックします。  
* [ ] 左側のサイドバーからPagesを探してクリックします。  
* [ ] ページ中央のBuild and deployment -> Source欄にあるドロップダウンをクリックします。  
* [ ] 既定のDeploy from a branchをGitHub Actionsに変更します。  


8. ブログのルートにあるastro.config.mjsを編集する
* [ ] 9行目付近のコードを次の内容に置き換えます。
```yaml
export default defineConfig({
	site: 'https://Zes-Z.github.io',  # GitHubのドメイン
	base: '/test/',   # リポジトリ名。最初のプロジェクトなら base: '/' のままにします,
```

9. 設定をプッシュする  
ターミナルに戻って次を実行します。
```powershell
git add .
git commit -m "Add GitHub Actions workflow for deployment"
git push
```


### NetlifyまたはCloudflareにブログをデプロイする
* [ ] 手順5の後はここから進めます
* [ ] ログインまたは新規登録します： [Netlify](https://app.netlify.com/)
* [ ] 新しいプロジェクトを作成し、GitHubリポジトリからインポートします。
* [ ] 緑のステータス表示の右側にある`xxx.netlify.app`をクリックすると、ブログにアクセスできます。
* [ ] `Quick setup`をクリックして独自ドメインを設定します。
* [ ] これで完了です！

---
### ブログテーマをカスタマイズする
* [ ] 基本的なテーマ設定は`src/config.yml`で変更できます。
* [ ] 主题的其它配置请参照作者的説明文档进行自定义!

---
## 日々の執筆の流れ
1. 記事を新規作成する
> pnpm new-post 

2. メモ帳やエディターで.mdファイルを編集する

3. ローカルでプレビューする
> pnpm dev

4. プッシュ前にテストしてプレビューする  
> pnpm build  
> pnpm preview

5. GitHubリポジトリにプッシュする  
> git add .  
> git commit -m "f"  
> git push  


## Gitのプッシュに失敗する場合
* [ ] 現在の設定を確認します：
```powershell
git config --global --get http.proxy
git config --global --get https.proxy
```
* [ ] プロキシ設定を解除します：
```powershell
git config --global --unset http.proxy
git config --global --unset https.proxy
```
* [ ] Gitにプロキシポートを指定します：
```powershell
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897
```

---

## Hexoで個人ブログを作る
### 1. Hexo CLIをインストールする

Hexo CLIはHexoのコマンドラインツールです。

PowerShellで実行します：

```powershell
npm install -g hexo-cli
```

インストールを確認します：

```powershell
hexo -v
```

如果显示 Hexo 版本信息説明安装成功。

* * *

### 2.ブログプロジェクトを初期化する

作業ディレクトリを選びます。例：

```powershell
cd D:\
```

Hexoブログを作成します：

```powershell
hexo init ZesBlog
```

ブログのディレクトリに移動します：

```powershell
cd ZesBlog
```

依存関係をインストールする：

```powershell
npm install
```

この時点でのディレクトリ構成はおおよそ次のとおりです：

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

### 3. ローカルでブログを起動する

#### 1 静的ページを生成する

```powershell
hexo g
```

このコマンドはMarkdownの内容から静的HTMLを生成します。

* * *

#### 2 ローカルサーバーを起動する

```powershell
hexo s
```

ブラウザーで次のURLを開きます：

```powershell
http://localhost:4000
```

ブログが表示されます。この時点ではデフォルトテーマです。カスタマイズ方法は記事の最後を参照してください。

* * *

### 4. 記事を作成する

前の手順のプレビューが終わったら、ターミナルで`Ctrl+C`を押して終了します。  
输入以下命令以記事を新規作成する：

```powershell
hexo new "first post"
```

Hexoが次のファイルを自動生成します：

```powershell
source/_posts/first-post.md
```

記事の基本構成：

```
---
title: First Post
date: 2026-03-15
tags:
---
```

**記事の内容はこの.mdファイルに書きます。メモ帳で開いて編集できます。**

* * *

### 5. GitHubリポジトリを作成する

GitHubにログインします。アカウントがなければ作成してください。

`username.github.io`という名前のリポジトリを作成します。

例：`zeszheng.github.io`

このリポジトリでブログをホストします。
SSHのURLをコピーしておきます。後で使用します。

* * *

### 6. デプロイ用プラグインをインストールする

HexoからGitHub Pagesに公開するには、デプロイ用プラグインが必要です。

インストール：

```powershell
npm install hexo-deployer-git --save
```

* * *

### 7. デプロイを設定する

* ブログのルートにある次のファイルを編集します：

```
_config.yml
```
**このファイルでサイトをカスタマイズします。**

* デプロイ設定を追加します：

```
deploy:
type: git
repo: https://github.com/username/username.github.io.git
branch: main
```

`username`を自分のGitHubユーザー名に置き換えます。

* * *

### 8. ブログをデプロイする

* [ ] 実行します：

```powershell
hexo clean  # Hexoのキャッシュを削除

hexo g      # サイトを生成

hexo d      # リモートのGitHubリポジトリにデプロイ
```

* [ ] デプロイ後、次のURLにアクセスします：

```
https://username.github.io
```

ブログが表示されます。

* * *

### 9.日々の執筆ワークフロー

Hexoを日常的に使う基本的な流れは次のとおりです。

#### 1 記事を作成する

```powershell
hexo new "post title"
```

* * *

#### 2 ローカルでプレビューする

```powershell
hexo g

hexo s
```

* * *

#### 3 ブログを公開する

```powershell
hexo clean

hexo g

hexo d
```

* * *

### Hexoブログの全体的な流れ

1. Node.jsとGitをインストールし、ミラーを設定する
    
2. Hexo CLIをインストールする
    
3. Hexoプロジェクトを初期化する
    
4. ローカルでブログを実行する
    
5. GitHubリポジトリを作成する
    
6. デプロイを設定する插件
    
7. GitHub Pagesに公開する
    

セットアップ後は、日々の執筆で次を実行します：

```powershell
# ブログの操作はこのルートフォルダーで行います。PowerShellで最初に次を入力します。
cd Myblog  

hexo new

hexo g

hexo s  # Ctrl+Cでローカルプレビューを終了してからhexo dでプッシュします

hexo d  # GitHubにプッシュ
```

これで執筆、プレビュー、公開まで行えます。

---
### Hexoテーマをカスタマイズする
* [ ] [Hexo](https://hexo.io/themes/)公式サイトのThemesページでテーマを選びます
* [ ] **Visit preview site**をクリックしてテーマをプレビューします
* [ ] **テーマ名**のリンクからGitHubを開き、テーマの説明に従ってクローンして利用します

---