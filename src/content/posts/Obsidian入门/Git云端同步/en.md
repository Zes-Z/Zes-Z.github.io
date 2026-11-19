## Syncing Notes with Obsidian Git
### 1. Create a GitHub repository
First, sign in to GitHub.  
Click **New Repository** in the upper-right corner.  
Fill in the repository details:
- Repository name: for example, `Obsidian`
- Visibility: Public or Private (Private is recommended)
- Do not select:
  - Add a README
  - Add .gitignore
  - Choose a license

Then click
- Create repository

After it is created, you will get a repository URL, for example:

```text
https://github.com/yourname/Obsidian.git
```

You will need it later.

---

### 2. Install Git

If Git is not installed on your computer, go to:

https://git-scm.com/downloads

Download and install it.

After installation, open a terminal:

```bash
git --version
```

If the output looks like this:

```bash
git version 2.50.0
```

Git is installed successfully.

---

### 3. Create an Obsidian vault

Open Obsidian.

Click

> Create new vault

For example:

```text
D:\Obsidian\Knowledge
```

All your notes will be stored in this directory.

---

### 4. Initialize the Git repository

Open a terminal (PowerShell or CMD).

Go to your vault:

```bash
cd D:\Obsidian\Knowledge
```

Initialize Git:

```bash
git init
```

Connect the remote repository:

```bash
git branch -M main
git remote add origin https://github.com/yourname/Obsidian.git
```

Check that it worked:

```bash
git remote -v
```

The following output indicates a successful connection:

```bash
origin https://github.com/yourname/Obsidian.git
```



Create your first note in the `D:\Obsidian\Knowledg` folder.

Return to `powershell` and push it manually to the remote repository (this is only needed once):

```bash
git add .

git commit -m "first obsidian commit"

git push -u origin main
```

After a short while, if your note file appears on the GitHub repository page, the setup is complete.

---

### 6. Install the Obsidian Git plugin

Open

Settings → Community Plugins

Turn off Safe Mode.

Click

> Browse

Search for:

```text
Git
```

Install and enable the plugin.

---

### 7. Configure the plugin

Go to:

Settings → Obsidian Git

It is recommended to enable:

```
Auto Pull on startup
```

Automatically pull the latest content on startup.

```
Auto Backup
```
Automatically commit changes.

```
Auto Push
```
Automatically push changes.

For example:

```
Auto Backup Interval
```

Set it to:

```text
10
```

This means changes are committed automatically every 10 minutes.

---
