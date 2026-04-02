---
title: Markdown基础语法
published: 2026-03-04
tags: [Markdown,web]
category: Coding
description: Markdown 基础语法参考指北
draft: false
---

---
# Markdown 基础语法参考指北

---
## 1. 输入标题与层级 (Headings)
使用 `#` 号表示标题，建议在 `#` 后加一个空格。
# 一级标题 (H1):`# 一级标题`

## 二级标题 (H2):`## 二级标题`

### 三级标题 (H3):`### 三级标题`

---

## 2. 文本格式化 (Emphasis)
* *斜体*  `*倾斜内容*` 或 `_倾斜内容_`

* **加粗**  `**强调内容**` 或 `__强调内容__`

* ***加粗斜体***  `***又粗又斜***`
 
* ~~删除线~~  `~~错误或过时的文本~~`

* <u>下划线</u>  `<u>HTML 标签实现</u>`

* `高亮文本`  反引号\`&emsp;\`里面输入\`高亮内容\`

---

## 3. 列表与组织 (Lists)

### 无序列表 (Unordered List)
* 自然语言处理 (NLP) `* 自然语言处理 (NLP)`

* 计算语言学 (CL) `+ 计算语言学 (CL)`

* 机器学习 (ML) `- 机器学习 (ML)`
<br>

### 有序列表 (Ordered List)
使用 `1.`、`2.`、`3.`等：
1. 预处理 (Preprocessing)    `1. 预处理 (Preprocessing)`

2. 特征提取 (Feature Extraction)    `2. 特征提取 (Feature Extraction)`

3. 模型训练 (Model Training)    `3. 模型训练 (Model Training)` 
<br>

### 任务列表 (Task Lists)
* [x] 完成形態素解析 `* [x] 完成形態素解析`  

+ [ ] 编写Python脚本 `+ [ ] 编写Python自动化脚本`  

- [x] 导出为 PDF `- [x] 导出为 PDF`

---

## 4. 引用与分割 (Quotes & Breaks)

### 引用块
使用 `>` 符号。可以嵌套：
> 语言是思维的边界。 `> 语言是思维的边界。`
>> —— 维特根斯坦 `>> —— 维特根斯坦`

    
### 分割线
使用三个或更多的 `---` 或 `***`，效果如下。

---

## 5. 代码与技术文档 (Code Blocks)

### 行内代码
使用单个反引号组合，例如\`import spacy\` ，效果如右`import spacy`。
<br> 

### 围栏代码块 (Code Fencing)
使用```` ``` ````指定编程语言以获得语法高亮，例如:

> \```python  
\# 使用 Ginza/spaCy 包  
import spacy  
nlp = spacy.load("ja_ginza")  
print("成功嵌套并换行")  
\```  
\### 这一行作结尾，哈哈已经结束了!

代码块末尾输入```` ``` ````以结束，整体效果如下:

```python
# 使用 Ginza/spaCy 包
import spacy
nlp = spacy.load("ja_ginza")
print("成功嵌套并换行")
```
### 这一行作结尾，哈哈已经结束了!
---
---
# 注:以下内容来自fuwari演示文档
## 公式
[//]: # (![example image]&#40;./demo-banner.png "An exemplary image"&#41;)

Inline math equations go in like so: $\omega = d\phi / dt$. Display
math should get its own line and be put in in double-dollarsigns:

$$I = \int \rho R^{2} dV$$

$$
\begin{equation*}
\pi
=3.1415926535
 \;8979323846\;2643383279\;5028841971\;6939937510\;5820974944
 \;5923078164\;0628620899\;8628034825\;3421170679\;\ldots
\end{equation*}
$$

And note that you can backslash-escape any punctuation characters
which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.

---
## .md文件中插入视频
```md
---
title: Markdown基础语法
published: 2026-03-04
tags: [Markdown,web]
category: Coding
description: Markdown 基础语法参考指北
draft: false
---
正文...
<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

```
<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

---


## GitHub Repository Cards
You can add dynamic cards that link to GitHub repositories, on page load, the repository information is pulled from the GitHub API. 

::github{repo="Fabrizz/MMM-OnSpotify"}

Create a GitHub repository card with the code `::github{repo="<owner>/<repo>"}`.

```markdown
::github{repo="saicaca/fuwari"}
```

## Admonitions

Following types of admonitions are supported: `note` `tip` `important` `warning` `caution`

:::note
Highlights information that users should take into account, even when skimming.
:::

:::tip
Optional information to help a user be more successful.
:::

:::important
Crucial information necessary for users to succeed.
:::

:::warning
Critical content demanding immediate user attention due to potential risks.
:::

:::caution
Negative potential consequences of an action.
:::

### Basic Syntax

```markdown
:::note
Highlights information that users should take into account, even when skimming.
:::

:::tip
Optional information to help a user be more successful.
:::
```

### Custom Titles

The title of the admonition can be customized.

:::note[MY CUSTOM TITLE]
This is a note with a custom title.
:::

```markdown
:::note[MY CUSTOM TITLE]
This is a note with a custom title.
:::
```

### GitHub Syntax

> [!TIP]
> [The GitHub syntax](https://github.com/orgs/community/discussions/16925) is also supported.

```
> [!NOTE]
> The GitHub syntax is also supported.

> [!TIP]
> The GitHub syntax is also supported.
```

### Spoiler

You can add spoilers to your text. The text also supports **Markdown** syntax.

The content :spoiler[is hidden **ayyy**]!

```markdown
The content :spoiler[is hidden **ayyy**]!

```

---
**一些提示**
* > Markdown语法兼容HTML，可以在使用Markdown难以达到理想效果时尝试HTML语句
例如:在行与行或块与块之间使用 `<br>` 强制换行
* > 对于使用`` ` ` ``进行文本高亮，如果遇到冲突或语法歧义，可使用反斜线 \ 充当转义符，让紧跟再\后的一个或一串符号失去语法效果；或者使用更多数量的```` `` ````来包围较少数量的`` `占位字符串` ``，例如:``` `` `占位字符串` `` ```，这样就能使多层级中的`` ` ` ``失去语法效果,从而实现`` `占位字符串` ``的效果