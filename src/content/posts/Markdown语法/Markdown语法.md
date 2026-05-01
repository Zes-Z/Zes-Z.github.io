---
title: Markdown基础语法参考指北
published: 2026-03-04
tags: [markdown]
category: Math & Coding
description: Markdown基础语法参考指北
image: ""
draft: false
---

## 1. 标题与层级 (Headings)
使用 `#` 号表示标题，在 `#` 后加一个空格，再输入标题。
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

* `文本填充底色`  反引号\`&emsp;\`里面输入\`文本内容\`

* 空白占位符
  
`&nbsp;`	不换行空格，最常用的空格，防止单词在行尾被拆开。  
`&ensp;`	半角空格，宽度大约等于一个字母 n 的宽度。  
`&emsp;`	全角空格，宽度大约等于一个字母 m 的宽度（通常为一个中文字符宽）。  

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

## 4. 引用与分割 (Quotes)

### 引用块
使用 `>` 符号。可以嵌套：
> 语言是思维的边界。 `> 语言是思维的边界。`
>> —— 维特根斯坦 `>> —— 维特根斯坦`

---

## 5. 线条与表格
**分割线:** 使用三个或更多的 ` - ` 或 ` * `，效果如下。

---
**目录树**

Windows ：按住 Alt 键，然后在数字键盘上输入  

Alt + 179 = │  

Alt + 196 = ─  

Alt + 195 = ├    

Alt + 192 = └     

用以上4种线条，足以实现复杂的`目录树`  
以下为：三层级的`目录树`

```
blog-root
├── config
│   ├── database.js
│   ├── utils
│   └── helper.js
├── media
│   ├── musics
│   ├── images
│   └── videos
└── README.md
```

**表格**
- 直接使用` | `隔开各列文本，实现表格效果，渲染时默认忽略竖线
- 表格中的文字对齐可分别使用  
**左对齐**   `:---`  
**居中对齐**   `:---:`  
**右对齐**   `---:`  

```
| 左对齐 | 居中对齐 | 右对齐 |
| :--- | :---: | ---: |
| 苹果 | 香蕉 | 橙子 |
| 火龙果 | 西瓜 | 草莓 |
```
|　左对齐 | 居中对齐 | 右对齐 |
| :--- | :---: | ---: |
| 苹果 | 香蕉 | 橙子 |
| 火龙果 | 西瓜　| 草莓 |

**以上居中对齐、右对齐与本博客主题中表格的对齐方式存在冲突,可在其它markdown软件中渲染*

---
## 6. 超链接
```
[方括号里输入链接说明](圆括号里填入对应链接)
示例：[欢迎来到bilibili!](https://www.bilibili.com/)
```
效果：[欢迎来到bilibili!](https://www.bilibili.com/)

---
## 7. 图片与视频
* 图片插入的实现方式与超链接相似，但需要在最前方加一个`!`
```
![方括号里输入图片](圆括号里填入对应链接)

示例：![落日余晖](./落日余晖.jpg)  
# ./落日余晖.jpg 表示这张图片与本文同级别，名为"落日余晖"，格式为".jpg"
```
效果：![落日余晖](./落日余晖.jpg)

* 视频插入
```
<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
```
<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

---
## 8. 脚注

```
这是一段用于测试的正文文本，其中需要补充说明[^1]。这是另一条演示脚注[^2]

[^1]: 脚注的详细解释，自动呈现在文末，它不会打断主流程的阅读。
[^2]: 在编写时，你可以把脚注文本写在正文后，就像这样。
```
这是一段用于测试的正文文本，其中需要补充说明[^1]。这是另一条演示脚注[^2]
[^1]: 这是脚注的详细解释，自动呈现在文末，它不会打断主流程的阅读。
[^2]: 在编写时，你可以把脚注文本写在正文文本后，就像这样。


---
## 9. 代码块 (Code Blocks)

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

**一些提示**
* > Markdown语法兼容HTML，可以在使用Markdown难以达到理想效果时尝试HTML语句
例如:在行与行或块与块之间使用 `<br>` 强制换行
* > 对于使用`` ` ` ``进行文本高亮，如果遇到冲突或语法歧义，可使用反斜线 \ 充当转义符，让紧跟再\后的一个或一串符号失去语法效果；或者使用更多数量的```` `` ````来包围较少数量的`` `占位字符串` ``，例如:``` `` `占位字符串` `` ```，这样就能使多层级中的`` ` ` ``失去语法效果,从而实现`` `占位字符串` ``的效果
---
---

# 注:以下内容(至文末)来自fuwari演示文档
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

Here, we'll explore how code blocks look using [Expressive Code](https://expressive-code.com/). The provided examples are based on the official documentation, which you can refer to for further details.

## Expressive Code

### Syntax Highlighting

[Syntax Highlighting](https://expressive-code.com/key-features/syntax-highlighting/)

#### Regular syntax highlighting

```js
console.log('This code is syntax highlighted!')
```

#### Rendering ANSI escape sequences

```ansi
ANSI colors:
- Regular: [31mRed[0m [32mGreen[0m [33mYellow[0m [34mBlue[0m [35mMagenta[0m [36mCyan[0m
- Bold:    [1;31mRed[0m [1;32mGreen[0m [1;33mYellow[0m [1;34mBlue[0m [1;35mMagenta[0m [1;36mCyan[0m
- Dimmed:  [2;31mRed[0m [2;32mGreen[0m [2;33mYellow[0m [2;34mBlue[0m [2;35mMagenta[0m [2;36mCyan[0m

256 colors (showing colors 160-177):
[38;5;160m160 [38;5;161m161 [38;5;162m162 [38;5;163m163 [38;5;164m164 [38;5;165m165[0m
[38;5;166m166 [38;5;167m167 [38;5;168m168 [38;5;169m169 [38;5;170m170 [38;5;171m171[0m
[38;5;172m172 [38;5;173m173 [38;5;174m174 [38;5;175m175 [38;5;176m176 [38;5;177m177[0m

Full RGB colors:
[38;2;34;139;34mForestGreen - RGB(34, 139, 34)[0m

Text formatting: [1mBold[0m [2mDimmed[0m [3mItalic[0m [4mUnderline[0m
```

### Editor & Terminal Frames

[Editor & Terminal Frames](https://expressive-code.com/key-features/frames/)

#### Code editor frames

```js title="my-test-file.js"
console.log('Title attribute example')
```

---

```html
<!-- src/content/index.html -->
<div>File name comment example</div>
```

#### Terminal frames

```bash
echo "This terminal frame has no title"
```

---

```powershell title="PowerShell terminal example"
Write-Output "This one has a title!"
```

#### Overriding frame types

```sh frame="none"
echo "Look ma, no frame!"
```

---

```ps frame="code" title="PowerShell Profile.ps1"
# Without overriding, this would be a terminal frame
function Watch-Tail { Get-Content -Tail 20 -Wait $args }
New-Alias tail Watch-Tail
```

### Text & Line Markers

[Text & Line Markers](https://expressive-code.com/key-features/text-markers/)

#### Marking full lines & line ranges

```js {1, 4, 7-8}
// Line 1 - targeted by line number
// Line 2
// Line 3
// Line 4 - targeted by line number
// Line 5
// Line 6
// Line 7 - targeted by range "7-8"
// Line 8 - targeted by range "7-8"
```

#### Selecting line marker types (mark, ins, del)

```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log('this line is marked as deleted')
  // This line and the next one are marked as inserted
  console.log('this is the second inserted line')

  return 'this line uses the neutral default marker type'
}
```

#### Adding labels to line markers

```jsx {"1":5} del={"2":7-8} ins={"3":10-12}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}
  value={value}
  className={buttonClassName}
  disabled={disabled}
  active={active}
>
  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```

#### Adding long labels on their own lines

```jsx {"1. Provide the value prop here:":5-6} del={"2. Remove the disabled and active states:":8-10} ins={"3. Add this to render the children inside the button:":12-15}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}

  value={value}
  className={buttonClassName}

  disabled={disabled}
  active={active}
>

  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```

#### Using diff-like syntax

```diff
+this line will be marked as inserted
-this line will be marked as deleted
this is a regular line
```

---

```diff
--- a/README.md
+++ b/README.md
@@ -1,3 +1,4 @@
+this is an actual diff file
-all contents will remain unmodified
 no whitespace will be removed either
```

#### Combining syntax highlighting with diff-like syntax

```diff lang="js"
  function thisIsJavaScript() {
    // This entire block gets highlighted as JavaScript,
    // and we can still add diff markers to it!
-   console.log('Old code to be removed')
+   console.log('New and shiny code!')
  }
```

#### Marking individual text inside lines

```js "given text"
function demo() {
  // Mark any given text inside lines
  return 'Multiple matches of the given text are supported';
}
```

#### Regular expressions

```ts /ye[sp]/
console.log('The words yes and yep will be marked.')
```

#### Escaping forward slashes

```sh /\/ho.*\//
echo "Test" > /home/test.txt
```

#### Selecting inline marker types (mark, ins, del)

```js "return true;" ins="inserted" del="deleted"
function demo() {
  console.log('These are inserted and deleted marker types');
  // The return statement uses the default marker type
  return true;
}
```

### Word Wrap

[Word Wrap](https://expressive-code.com/key-features/word-wrap/)

#### Configuring word wrap per block

```js wrap
// Example with wrap
function getLongString() {
  return 'This is a very long string that will most probably not fit into the available space unless the container is extremely wide'
}
```

---

```js wrap=false
// Example with wrap=false
function getLongString() {
  return 'This is a very long string that will most probably not fit into the available space unless the container is extremely wide'
}
```

#### Configuring indentation of wrapped lines

```js wrap preserveIndent
// Example with preserveIndent (enabled by default)
function getLongString() {
  return 'This is a very long string that will most probably not fit into the available space unless the container is extremely wide'
}
```

---

```js wrap preserveIndent=false
// Example with preserveIndent=false
function getLongString() {
  return 'This is a very long string that will most probably not fit into the available space unless the container is extremely wide'
}
```

## Collapsible Sections

[Collapsible Sections](https://expressive-code.com/plugins/collapsible-sections/)

```js collapse={1-5, 12-14, 21-24}
// All this boilerplate setup code will be collapsed
import { someBoilerplateEngine } from '@example/some-boilerplate'
import { evenMoreBoilerplate } from '@example/even-more-boilerplate'

const engine = someBoilerplateEngine(evenMoreBoilerplate())

// This part of the code will be visible by default
engine.doSomething(1, 2, 3, calcFn)

function calcFn() {
  // You can have multiple collapsed sections
  const a = 1
  const b = 2
  const c = a + b

  // This will remain visible
  console.log(`Calculation result: ${a} + ${b} = ${c}`)
  return c
}

// All this code until the end of the block will be collapsed again
engine.closeConnection()
engine.freeMemory()
engine.shutdown({ reason: 'End of example boilerplate code' })
```

## Line Numbers

[Line Numbers](https://expressive-code.com/plugins/line-numbers/)

### Displaying line numbers per block

```js showLineNumbers
// This code block will show line numbers
console.log('Greetings from line 2!')
console.log('I am on line 3')
```

---

```js showLineNumbers=false
// Line numbers are disabled for this block
console.log('Hello?')
console.log('Sorry, do you know what line I am on?')
```

### Changing the starting line number

```js showLineNumbers startLineNumber=5
console.log('Greetings from line 5!')
console.log('I am on line 6')
```
---