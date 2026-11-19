---
title: "Install and Customize MeCab"
description: 'Three ways to use MeCab, a Japanese morphological analyzer.'
pubDate: "2026-04-02"
category: "Ling."
tag: [mecab,分词]
postImage: " "
homepined: false
pinedOrder: 0
draft: false
---
# About MeCab
**What is MeCab?**

[About MeCab (和布蕪)](https://taku910.github.io/mecab/) (the following introduction is from MeCab’s author)

> MeCabは 京都大学情報学研究科−日本電信電話株式会社コミュニケーション科学基礎研究所共同研究ユニットプロジェクトを通じて開発されたオープンソース形態素解析エンジンです。言語，辞書，コーパスに依存しない汎用的な設計を基本方針としています。パラメータの推定に Conditional Random Fields(CRF) を用 いており，ChaSenが採用している隠れマルコフモデルに比べ性能が向上しています。また、平均的に ChaSen，Juman，KAKASIより高速に動作します。ちなみに和布蕪(めかぶ)は，作者の好物です。

---
# Three ways to install and use MeCab

## 1. Web version from the National Institute for Japanese Language and Linguistics: Web茶まめ
Visit [Web茶まめ](https://chamame.ninjal.ac.jp/) to use the MeCab tokenizer online.  

> **Advantages:**
> * Beginner-friendly and simple to use, with almost no learning curve
> * Offers a good range of tokenization features and export formats, including Excel and 大納言

> **Disadvantages:**
> * Limited features and customization
> * Difficult to automate with large texts; `Python` + the `MeCab module` + a dictionary package is recommended

---
## 2. Install the MeCab application (Windows)
* [x] **Download and install: mecab-0.996.exe**

> *The application itself is small, so installing it on drive C is recommended. To install it on drive D, add it to the system `environment variables` after installation.  
> MeCab requires a dictionary file. Installation automatically creates the `ipadic` dictionary, which is outdated and no longer updated.  
> Replacing it with a **custom dictionary package** is strongly recommended!!!*
---
* [ ] **Custom dictionary package**: This example uses the latest [unidic-cwj-202512](https://clrd.ninjal.ac.jp/unidic/) released by the National Institute for Japanese Language and Linguistics.
1. After downloading `unidic-cwj-202512.zip`, extract it to a folder of the same name in the root of drive D (or C).
2. Copy the path of the `unidic-cwj-202512` folder: `"D:\unidic-cwj-202512"`.
3. Find the installed `MeCab` folder and open `"D:\MeCab\etc\mecabrc"` in Notepad (use the corresponding path if installed on drive C).
4. Paste the path from step 2 after `dicdir =`, like this: `dicdir = D:\unidic-cwj-202512`.
5. This sets the custom dictionary MeCab will use at runtime.
---
* [ ] **Next, use `MeCab` on Windows**
1. Search for `PowerShell` in the lower-left search box. Right-click it and choose `Run as administrator`.
2. Because of encoding limitations, set the `PowerShell` console encoding before using `MeCab`.
> Enter the following in the command line:  
`$OutputEncoding = [Console]::InputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8`  
This forces UTF-8 encoding to prevent garbled text.

3. Enter the `mecab` command to start the `mecab` program, which will wait for **text** or a **file** to tokenize.
> **The following describes manual input and file-based input/output.**
>> Manual input is simple: copy the text to tokenize and paste it into the `command line`.  
Press `Enter`; the tokenized result appears on screen and can be copied.
>
>> To tokenize an entire file (it must be a `.txt` file; convert other formats to `.txt` first)  
>> Enter the following command (use `-o` to specify the output file and `-O` to specify the output format; the options are case-sensitive):  
`mecab "C:\Users\...\test.txt" -o "C:\Users\...\ed.txt" -Ounidic`  
>> **Notes:**  
`"C:\Users\...\test.txt"` This is the path to the file you want to tokenize,  
`"C:\Users\...\ed.txt"` this is the path where you want to save the tokenized output,  
`-Ounidic` means: use the `-O` option to select the `unidic` output format (the default format can be customized; see `Custom tokenization` below).

---
## 3. Install Python to use with MeCab (recommended)
* [x] Download and install Python and an editor (PyCharm, VS Code, Zed, or another editor)
* [x] Add Python to the environment variables
> Search for `environment variables` in the lower-left Windows search box, open `Edit the system environment variables`, then click `Environment Variables` in the lower-right.  
Under **User variables for xx**, select `Path`, click **Edit**, then click **New**.  
Copy and paste the path to the Python installation folder, then click OK until you close the `Environment Variables` settings.  
Example: `D:\Python3.12.9\`

* [ ] Use the `pip` package manager to install the `MeCab package`  
> Enter this in the `PowerShell` command line:  
> `pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple`  
> This command sets the Tsinghua package mirror. Without it, installing packages with `pip` from China can be difficult.

* [ ] In the `PowerShell` command line, run `pip install mecab-python3` to install the `MeCab package`.

* [ ] Open your editor and configure the `Python environment` (the steps differ by editor; search for a tutorial if needed).  

---
**Everything is ready. Let’s begin!**  
1. Enter the following code to import the `MeCab package` into `Python`.
```python
import MeCab
# Specify a dictionary before tokenizing with MeCab, then initialize the MeCab tagger.
# Use the custom dictionary unidic-cwj-202512; unidic_path is its location.
unidic_path = r"D:\unidic-cwj-202512" 
```

2. Enter the following code to `initialize MeCab`.
```python
# Initialize the tagger with tagger = MeCab.Tagger(); pass custom options in the parentheses.
# -r "{mecabrc}" specifies an empty config file; -d "{unidic_path}" points to the custom dictionary.
tagger = MeCab.Tagger(f'-r nul -d "{unidic_path}"')  # Output detailed tokenization information by default
```

3. Tokenize text or a file and print the result.
```python
text = "勉強は大好きだ。"
result = tagger.parse(text)
print(result)

# No output mode was specified, so detailed tokenization information is shown by default.
>>> 
-	名詞,普通名詞,サ変可能,*,*,*
日本橋	名詞,固有名詞,地名,一般,*,*,ニホンバシ,ニホンバシ,日本橋,ニホンバシ,日本橋,ニホンバシ,固,*,*,*,*,*,*,地名,ニホンバシ,ニホンバシ,ニホンバシ,ニホンバシ,0,*,*,7830455558742528,28487

は	助詞,係助詞,*,*,*,*,ハ,は,は,ワ,は,ワ,和,*,*,*,*,*,*,係助,ハ,ハ,ハ,ハ,*,"動詞%F2@0,名詞%F1,形容詞%F2@-1",*,8059703733133824,29321

いい	形容詞,非自立可能,*,*,形容詞,連体形-一般,ヨイ,良い,いい,イー,いい,イー,和,*,*,*,*,*,*,相,イイ,イイ,イイ,イイ,1,C3,*,10716948459561665,38988

ところ	名詞,普通名詞,副詞可能,*,*,*,トコロ,所,ところ,トコロ,ところ,トコロ,和,ト濁,基本形,*,*,*,"B1WS2WB3WB4WBjS,B1WS2WB8SjS",体,トコロ,トコロ,トコロ,トコロ,"3,0",C2,*,7249372253397504,26373

です	助動詞,*,*,*,助動詞-デス,終止形-一般,デス,です,です,デス,です,デス,和,*,*,*,*,*,*,助動,デス,デス,デス,デス,*,"形容詞%F2@-1,動詞%F2@0,名詞%F2@1",*,7051468750332587,25653

ね	助詞,終助詞,*,*,*,*,ネ,ね,ね,ネ,ね,ネ,和,*,*,*,*,*,*,終助,ネ,ネ,ネ,ネ,*,"動詞%F1,名詞%F1,形容詞%F1",*,7903847959896576,28754

。	補助記号,句点,*,*,*,*,*,。,。,*,。,*,記号,*,*,*,*,*,*,補助,*,*,*,*,*,*,*,6880571302400,25
EOS

```
---
# Custom tokenization modes
 The steps for specifying a MeCab output mode are the same in PowerShell and Python, so the example below uses Python.
```python
# Note: Add an entry for each custom output mode to the dictionary dicrc file. Modes already in dicrc can be used directly.
# For example, the built-in concise mode wakati tokenizes 「勉強は大好きだ。」 as shown: 勉強 は 大好き だ 。

# To use it, append -Owakati to the MeCab initialization command.
# That is, add a hyphen, uppercase O, and the output mode, as shown below.
tagger = MeCab.Tagger(f'-r nul -d "{unidic_path}" -Owakati')
text = "勉強は大好きだ。"  # This is the text to tokenize.
result = tagger.parse(text)
print(result)
>>> 勉強 は 大好き だ 。
```

If you defined a custom tokenization mode in the dictionary’s `dicrc` file, use the following code to select it along with the dictionary:
```python
tagger = MeCab.Tagger(f'-r nul -d "{unidic_path}" -Ocustom-mode-name')
```
In the example below, `keitaiso` is a tokenization mode the author defined in `dicrc`.
```python
import MeCab
tagger = MeCab.Tagger(f'-r nul -d "{unidic_path}" -Okeitaiso')
text = "-日本橋はいいところですね。"
result = tagger.parse(text)
print(result)
>>>
-			 未定義語
日本橋    ニホンバシ		名詞,固有名詞
は       は			     助詞,係助詞
いい     良い			    形容詞,非自立可能
ところ    所			     名詞,普通名詞
です     です			    助動詞,
ね       ね			     助詞,終助詞
。			  。			    補助記号,句点
```
---
