---
title: 安装与自定义使用MeCab
published: 2026-04-02
description: '关于日语分词器MeCab的3种使用方式'
image: ''
tags: [mecab,分词,wiondows,python]
category: 'Ling.'
draft: false 
lang: ''
---
# 关于MeCab
`MeCab是什么?`

[MeCab (和布蕪)とは](https://taku910.github.io/mecab/) (以下是MeCab作者发布的简介)

> MeCabは 京都大学情報学研究科−日本電信電話株式会社コミュニケーション科学基礎研究所共同研究ユニットプロジェクトを通じて開発されたオープンソース形態素解析エンジンです。言語,辞書,コーパスに依存しない汎用的な設計を基本方針としています。パラメータの推定に Conditional Random Fields(CRF) を用 いており, ChaSenが採用している隠れマルコフモデルに比べ性能が向上しています。また、平均的に ChaSen, Juman, KAKASIより高速に動作します。ちなみに和布蕪(めかぶ)は, 作者の好物です。

---
# 安装/使用MeCab的3种方式

## 1. 国立国語研究所发布的网页版: Web茶まめ
直接访问[Web茶まめ](https://chamame.ninjal.ac.jp/)以在线使用MeCab分词器  

> **优点:**
>> 新手友好,操作简单,几乎不需要学习成本
>
>> 分词功能较为齐全,可选择excel、大納言等多种导出形式

> **缺点:**
>> 功能相对较少,无法深度自定义
> 
>> 面对大文本数据时,难以实现自动化,建议使用`Python`+`MeCab模块`+`词典包`

---
## 2. 安装MeCab应用程序
* [x] **下载并安装: mecab-0.996.exe**

> *应用本体不是很大,建议安装到C盘.若想自定义安装到D盘,需要安装完以后,在系统中添加`环境变量`  
> MeCab运行需要使用词典文件,安装完成后会自动生成`ipadic`词典(太旧且无更新),  
> 强烈建议替换为`自定义词典包`!!!*
---
* [ ] **自定义词典包**: 此处以国立国語研究所发布的最新版[unidic-cwj-202512](https://clrd.ninjal.ac.jp/unidic/)为例 
1. 下载完`unidic-cwj-202512.zip`后,解压到D盘根目录(或C盘)下的同名文件夹`unidic-cwj-202512`
2. 复制`unidic-cwj-202512`文件夹的路径`"D:\unidic-cwj-202512"`
3. 找到刚安装的`MeCab`软件的文件夹,用记事本打开开`"D:\MeCab\etc\mecabrc"`这个文件,安装在C盘也一样
4. 将第2步中的`"D:\unidic-cwj-202512"`粘贴到`dicdir =`后面,像这样:`dicdir = D:\unidic-cwj-202512`
5. 这样就自定义好了MeCab在运行时使用的字典
---
* [ ] **接下来是在电脑上使用`Mecab`**
1. 首先在电脑左下角的搜索框搜索`PowerShell`,建议右键`以管理员身份运行`
2. 由于编码格式限制,在正式使用`MeCab`前,建议统一`PowerShell`面板的编码格式
> 在命令行输入以下:`$OutputEncoding = [Console]::InputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8`
强制使用UTF8编码,以避免显示乱码.

3. 在`命令行`输入指令`mecab`,这样就会自动进入`mecab`程序,以等待待分词的`文本`或`文件`输入
> **以下分别介绍手动和文件两种方式进行输入输出**
>> 手动输入比较简单,直接复制想要分词的文本,粘贴到`命令行`中,  
按`回车`后,屏幕会自动展示分词结果,结果可直接复制
>
>> 如果想传入一整个想要分词的文件(注:需准备`.txt`格式,其他格式的文件先转成`.txt`文本文件)  
>> 具体操作:在命令行中输入(注:使用 -o 指定输出文件，-O 指定输出格式,注意区分大小写!)  
`mecab "C:\Users\...\test.txt" -o "C:\Users\...\ed.txt" -Ounidic`  
>> **一些说明:**  
`"C:\Users\...\test.txt"` 这个是你想要分词的文件的路径,  
`"C:\Users\...\ed.txt"` 这个是你想存放分词结果文件的路径,  
`-Ounidic` 表示:使用`-O`符号,指定分词模板为:`unidic` (这个是初始模板,可自定义,见文末`自定义分词`)

---
## 3. 安装Python以搭配使用mecab(推荐)
* [x] 下载并安装Python,以及一个编辑器(Pycharm、Vscode、Zed等都可以~)
* [x] 将Python添加到环境变量

* [ ] 使用`pip`包管理器下载`MeCab包`  
> 在`PowerShell`中的命令行输入:  
> `pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple`  
> 这行代码主要是一键绑定清华下载源,不然在国内使用`pip`安装任何包都会很痛苦

* [ ] 在`PowerShell`中的命令行输入:`pip install mecab-python3`以安装`MeCab包`

* [ ] 打开编辑器,配置好`Python环境`(不会的可以搜一下教程,b站上有很多~)  
---
**现在已经万事具备,让我们开始吧~**  
1. 在编辑页面中输入以下代码以`初始化`MeCab

```Python
import MeCab
# 使用MeCab分词前,需要指定使用的字典;然后初始化分MeCab词器
# 自定义使用的字典unidic-cwj-202512,unidic_path为自定义字典的地址
unidic_path = r"D:\unidic-cwj-202512" 


# 输入 tagger = MeCab.Tagger() 初始化分词器,括号中为自定义参数
# ()中-r "{mecabrc}"用于指定空文件,-d "{unidic_path}"用于指向自定义词典地址
tagger = MeCab.Tagger(f'-r nul -d "{unidic_path}"')  # 默认输出详细分词信息


# 注:如果自定义字典后仍需使用简洁分词,如: 勉強 は 大好き だ 。格式;
# 需在自定义字典的dicrc中添加 -Owakati 参数 
tagger = MeCab.Tagger(f'-r nul -d "{unidic_path}" -Owakati')
text = "-日本橋はいいところですね。"
result = tagger.parse(text)
print(result)
```

2. 

---


**自定义分词**