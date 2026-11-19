---
title: "Markdown Syntax Quick Reference"
description: 'A concise reference to Markdown headings, formatting, lists, callouts, tables, links, media, footnotes, and code blocks.'
pubDate: "2026-03-04"
category: "Math & Coding"
tag: [markdown,introduction]

postImage: "./码头木桥.jpg"
homepined: true
pinedOrder: 2
draft: false
---



## 1. Headings and hierarchy (Headings)
Use `#` to mark a heading. Add a space after `#`, then enter the heading text.
# Level 1 heading (H1):`# Level 1 heading`

## Level 2 heading (H2):`## Level 2 heading`

### Level 3 heading (H3):`### Level 3 heading`

---

## 2. Text formatting (Emphasis)
* *Italic*  `*italic text*` or `_italic text_`

* **Bold**  `**emphasized text**` or `__emphasized text__`

* ***Bold italic***  `***bold and italic***`
 
* ~~Strikethrough~~  `~~incorrect or outdated text~~`

* <u>Underline</u>  `<u>implemented with an HTML tag</u>`

* `text with a background highlight`  Put `text` between backticks, like `\`&emsp;\`text\``.

* Whitespace entities
  
`&nbsp;`	Non-breaking space, commonly used to prevent a word from splitting at the end of a line.  
`&ensp;`	En space, approximately the width of the letter n.  
`&emsp;`	Em space, approximately the width of the letter m (usually one full-width character).  

---

## 3. Lists and organization (Lists)

### Unordered list (Unordered List)
* Natural Language Processing (NLP) `* Natural Language Processing (NLP)`

* Computational Linguistics (CL) `+ Computational Linguistics (CL)`

* Machine Learning (ML) `- Machine Learning (ML)`

### Ordered list (Ordered List)
Use `1.`, `2.`, `3.`, and so on:
1. Preprocessing    `1. Preprocessing`

2. Feature Extraction    `2. Feature Extraction`

3. Model Training    `3. Model Training` 


### Task lists (Task Lists)
* [x] Complete morphological analysis `* [x] Complete morphological analysis`  

+ [ ] Write a Python script `+ [ ] Write a Python automation script`  

- [x] Export as PDF `- [x] Export as PDF`

---

## 4. Blockquotes

### Standard blockquotes
Use the `>` symbol. Blockquotes can be nested:
```md
> The limits of my language mean the limits of my world.
>> — Wittgenstein
```
> The limits of my language mean the limits of my world.
>> — Wittgenstein    

### GitHub-style callouts
```md
> [!caution]
> The limits of my language mean the limits of my world.
>> — Wittgenstein
```
> [!caution]
> The limits of my language mean the limits of my world. 
>> — Wittgenstein

Or

```md
> [!caution/Custom heading]
> The limits of my language mean the limits of my world.
>> — Wittgenstein
```
> [!caution/Custom heading]
> The limits of my language mean the limits of my world. 
>> — Wittgenstein

### Special `:::` callouts
```
:::tip
Without a title  
xxxfoo
:::
```
:::tip
Without a title  
xxxfoo
:::

```
:::tip[Title]
With a title  
xxxfoo
:::
```
:::tip[Title]
With a title  
xxxfoo
:::


:::caution[Note]
Special callouts require the corresponding package installed with `pnpm install` to render correctly.
:::

---

## 5. Rules and tables
### Horizontal rules
```md
--- (three hyphens: "-")
or
*** (three asterisks: "*")
or
___ (three underscores: "_")
```
The result looks like this:

---

or

***

or
___


---
### Directory tree

Windows: hold Alt and type the following numbers on the numeric keypad  

Alt + 179 = │  

Alt + 196 = ─ 

Alt + 195 = ├    

Alt + 192 = └     

These four line characters are enough to create a complex `directory tree`.  
Here is a three-level `directory tree`:

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

### Tables
- Separate column text with ` | ` to create a table; the vertical bars are hidden when rendered.
- The first two rows are required: the header and the separator.
- To align table text, use the following markers in the separator row:  
**Left-aligned**   `:---`  
**Centered**   `:---:`  
**Right-aligned**   `---:`  


```
| Left-aligned | Centered | Right-aligned |
| :--- | :---: | ---: |
| Apple | Banana | Orange |
| Dragon fruit | Watermelon | Strawberry |
```
| Left-aligned | Centered | Right-aligned |
| :--- | :---: | ---: |
| Apple | Banana | Orange |
| Dragon fruit | Watermelon | Strawberry |

**Centered and right-aligned columns conflict with this blog theme’s table styling; render them in another Markdown app.*

---
## 6. Hyperlinks
```
[link text goes in square brackets](URL goes in parentheses)

Example: [Welcome to Bilibili!](https://www.bilibili.com/)
```
Result: [Welcome to Bilibili!](https://www.bilibili.com/)

---
## 7. Images and video
* Insert an image much like a hyperlink, but add `!` at the beginning.
```
![Enter alt text in square brackets](Put the URL or a path relative to this article in parentheses)

Example: ![Sunset glow](./落日余晖.jpg)  
Note: ./落日余晖.jpg means the image is in the same folder as this article, named "落日余晖", with the ".jpg" extension.
```
Result: ![Sunset glow](./落日余晖.jpg)

* Embed a video
```markdown
<iframe width=
"100%" height="468" src="//player.bilibili.com/player.html
?bvid=BV1fK4y1s7Qf&p=1" scrolling="no" border="0" 
frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
```
<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>


## 8. Footnotes

```
This is sample body text with an additional note[^1]. Here is another example footnote[^2].

[^1]: A footnote’s full explanation appears automatically at the end, without interrupting the main text.
[^2]: When writing, put the footnote text after the body, like this.
```
This is sample body text with an additional note[^1]. Here is another example footnote[^2].
[^1]: A footnote’s full explanation appears automatically at the end, without interrupting the main text.
[^2]: When writing, put the footnote text after the body, like this.


---
## 9. Code blocks (Code Blocks)

### Inline code
Wrap text in a single backtick pair, for example \`import spacy\`; the result is `import spacy`.
<br> 

### Fenced code blocks (Code Fencing)
Specify a language with ```` ``` ```` to enable syntax highlighting, for example:

> \```python title="main.py  
\# 使用 Ginza/spaCy 包  
import spacy  
nlp = spacy.load("ja_ginza")  
print("Successfully nested and wrapped")  
\```  
\### This line marks the end, haha, that’s it!

Close the code block with ```` ``` ````. The complete result looks like this:

```python title="main.py"
# Use the Ginza/spaCy package
import spacy
nlp = spacy.load("ja_ginza")
print("Successfully nested and wrapped")
```
### This line marks the end, haha, that’s it!


---

**A few tips**
:::warning[Tip]
* Markdown supports HTML. If Markdown alone cannot achieve the desired result, try using HTML.
For example, use `<br>` between lines or blocks to force a line break.
* 对于使用`` ` ` ``进行文本高亮，如果遇到冲突or语法歧义，可使用反斜线 \ 充当转义符，让紧跟再\后的一个or一串符号失去语法效果；Or使用更多数量的```` `` ````来包围较少数量的`` `占位字符串` ``，例如:``` `` `占位字符串` `` ```，这样就能使多层级中的`` ` ` ``失去语法效果,从而实现`` `占位字符串` ``的效果
:::
