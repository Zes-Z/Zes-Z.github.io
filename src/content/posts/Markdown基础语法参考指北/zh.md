---
title: "Markdown基础语法参考指北"
description: ""
pubDate: "2026-03-04"
category: "Math & Coding"
tag: [markdown,introduction]

postImage: "./码头木桥.jpg"
homepined: true
pinedOrder: 2
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

## 4. 引用块

### 普通引用块
使用 `>` 符号。可以嵌套：
```md
> 语言是思维的边界。
>> —— 维特根斯坦
```
> 语言是思维的边界。
>> —— 维特根斯坦    

### github特殊引用效果
```md
> [!caution]
> 语言是思维的边界。
>> —— 维特根斯坦
```
> [!caution]
> 语言是思维的边界。 
>> —— 维特根斯坦


### ::: 特殊引用块
```
:::tip
无题头形式  
xxxfoo
:::
```
:::tip
无题头形式  
xxxfoo
sddd
:::

```
:::tip[题头]
有题头形式  
xxxfoo
:::
```
:::tip[题头]
有题头形式  
xxxfoo
sddd
:::

---

## 5. 线条与表格
### 分割线
```md
--- (三个短横线："-")
或
*** (三个星号："*")
或
___ (三个短下划线："_")
```
效果如下:

---

或

***

或
___


---
### 目录树

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
![方括号里输入图片](圆括号里填入对应链接或相对于本文的路径)

示例：![落日余晖](./落日余晖.jpg)  
注： ./落日余晖.jpg 表示这张图片与本文同级别，名为"落日余晖"，格式为".jpg"
```
效果：![落日余晖](./落日余晖.jpg)

* 视频插入
```markdown
<iframe width=
"100%" height="468" src="//player.bilibili.com/player.html
?bvid=BV1fK4y1s7Qf&p=1" scrolling="no" border="0" 
frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
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

> \```python title="main.py  
\# 使用 Ginza/spaCy 包  
import spacy  
nlp = spacy.load("ja_ginza")  
print("成功嵌套并换行")  
\```  
\### 这一行作结尾，哈哈已经结束了!

代码块末尾输入```` ``` ````以结束，整体效果如下:

```python title="main.py"
# 使用 Ginza/spaCy 包
import spacy
nlp = spacy.load("ja_ginza")
print("成功嵌套并换行")
```
### 这一行作结尾，哈哈已经结束了!


---

**一些提示**
:::warning[提示]
* Markdown语法兼容HTML，可以在使用Markdown难以达到理想效果时尝试HTML语句
例如:在行与行或块与块之间使用 `<br>` 强制换行
* 对于使用`` ` ` ``进行文本高亮，如果遇到冲突或语法歧义，可使用反斜线 \ 充当转义符，让紧跟再\后的一个或一串符号失去语法效果；或者使用更多数量的```` `` ````来包围较少数量的`` `占位字符串` ``，例如:``` `` `占位字符串` `` ```，这样就能使多层级中的`` ` ` ``失去语法效果,从而实现`` `占位字符串` ``的效果
:::
