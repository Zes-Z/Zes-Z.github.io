## Obsidian Gitでノートを同期する
### 1. GitHubリポジトリを作成する
まずGitHubにログインします。  
右上の **New Repository** をクリックします。  
リポジトリの情報を入力します。
- Repository name：例 `Obsidian`
- Visibility：PublicまたはPrivate（Privateを推奨）
- 次の項目にはチェックを入れないでください。
  - Add a README
  - Add .gitignore
  - Choose a license

次に
- Create repository
をクリックします。

作成が完了すると、次のようなリポジトリURLが表示されます。

```text
https://github.com/yourname/Obsidian.git
```

後で使用します。

---

### 2. Gitをインストールする

パソコンにGitがインストールされていない場合は、次のページを開きます。

https://git-scm.com/downloads

ダウンロードしてインストールしてください。

インストール後、ターミナルを開きます。

```bash
git --version
```

次のように表示されれば、インストールは成功です。

```bash
git version 2.50.0
```

---

### 3. Obsidian Vaultを作成する

Obsidianを開きます。

次をクリックします。

> Create new vault

例：

```text
D:\Obsidian\Knowledge
```

以後、すべてのノートはこのフォルダーに保存されます。

---

### 4. Gitリポジトリを初期化する

ターミナル（PowerShellまたはCMD）を開きます。

Vaultに移動します。

```bash
cd D:\Obsidian\Knowledge
```

Gitを初期化します。

```bash
git init
```

リモートリポジトリに接続します。

```bash
git branch -M main
git remote add origin https://github.com/yourname/Obsidian.git
```

接続できたか確認します。

```bash
git remote -v
```

次のように表示されれば、接続は成功です。

```bash
origin https://github.com/yourname/Obsidian.git
```



`D:\Obsidian\Knowledg`フォルダーに最初のノートを作成します。

`powershell`に戻り、リモートへ手動でプッシュします（この操作は最初の1回だけ必要です）。

```bash
git add .

git commit -m "first obsidian commit"

git push -u origin main
```

しばらくしてGitHubのリポジトリページにノートファイルが表示されれば、設定は完了です。

---

### 6. Obsidian Gitプラグインをインストールする

次を開きます。

Settings → Community Plugins

Safe Modeをオフにします。

次をクリックします。

> Browse

次を検索します。

```text
Git
```

インストールして有効にします。

---

### 7. プラグインを設定する

次を開きます。

Settings → Obsidian Git

次の項目を有効にすることをおすすめします。

```
Auto Pull on startup
```

起動時に最新の内容を自動で取得します。

```
Auto Backup
```

変更を自動でコミットします。

```
Auto Push
```

変更を自動でプッシュします。

例：

```
Auto Backup Interval
```

次の値を設定します。

```text
10
```

10分ごとに変更が自動コミットされます。

---
