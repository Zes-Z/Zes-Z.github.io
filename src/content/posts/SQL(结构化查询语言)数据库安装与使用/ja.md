---
title: "SQL（構造化照会言語）：インストールと使い方"
description: 'PostgreSQLのインストール、SQLの基礎やJOIN、psycopg2を使ったPythonからの接続方法を解説します。'
pubDate: "2026-04-19"
updatedDate: "2026-06-22"
category: "Math & Coding"
tag: [sql,PostgreSQL]
heroImage: ""
homeFeatured: false   # 用于指定在首页 Read 区优先大图片展示
# homeHeroOrder:      # ホーム紹介文の下に固定表示する記事の順序。MyBlogsrcpagesindex.astroの27行目で記事を追加
# homeOrder:          # ホームのAll Posts欄の順序を指定
draft: false
---

まず、SQLの学習と練習に役立つサイトを紹介します： [SQLZoo](https://sqlzoo.net/wiki/SQL_Tutorial)

---

## PostgreSQLのインストール
[PostgreSQL: The World's Most Advanced Open Source Relational Database](https://www.postgresql.org/)
> PostgreSQL is an open-source Relational Database Management System (RDBMS)  
> 安定性、標準への準拠、豊富なデータ型で知られ、Web開発、データ分析、企業向けアプリケーションで広く利用されています。  

* [ ] インストール後、パスを環境変数に追加します
```
D:\Database\PostgreSQL\bin
```
* [ ] バージョンを確認します
```powershell
psql --version
```

---

## テーブル、データベース、SQLの基礎
### テーブルの基本構造

* テーブルはデータベースにデータを保存する基本単位です
* 行と列からなる二次元の表として考えることができます。  

ユーザー情報テーブルの例：

| id	| username	| email  |
| :---: |:---: | :---:|
| 1 |	Alice	|alice@example.com  |
| 2	| Bob	|bob@example.com |
| 3 |	Charlie	|charlie@example.com |

各要素の意味：
* 各列（Column）はフィールド（Field）を表します
* 各行（Row）はレコード（Record）を表します
* 各テーブルには通常、レコードを一意に識別する主キー（Primary Key）があります

---
### データベースの基本構造
A database is a collection of tables used to organize と manage data.

簡単なWebサイトのデータベースには、次のようなテーブルがあります：

mydb  
├── users  
├── articles  
├── comments  
└── categories

各要素の意味：

* usersテーブルはユーザー情報を保存します
* articlesテーブルは記事情報を保存します
* commentsテーブルはコメント情報を保存します
* categoriesテーブルはカテゴリ情報を保存します

The database maintains the relationships between these tables と ensures data consistency と security.

---
### SQLの基礎
SQL (Structured Query Language) is the stとard language for working with relational databases.

SQLでは次の操作ができます：

* Create databases と tables (CREATE)
* データの検索（SELECT）
* データの挿入（INSERT）
* データの更新（UPDATE）
* データの削除（DELETE）

例えば：
```sql
SELECT * FROM users;
```
これはusersテーブルの全データを検索します。
SQL is a fundamental tool for working with relational databases such as PostgreSQL, MySQL, と SQLite.

---
## PostgreSQLの基本操作

### 1. Create a database と table

```sql
-- Create a database
CREATE DATABASE mydb;

-- Connect to the database
\c mydb

-- Create a table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(60) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
* 注意：列は`フィールド名` `データ型[(長さ)]` `[制約/修飾子]`の形式です。
---

### 2. データベースやテーブルの削除、またはテーブルのデータ消去

```sql
-- Drop a database (you cannot drop the database you are currently connected to)
DROP DATABASE mydb;

-- Drop a table (including its structure と data)
DROP TABLE exTable;

-- Clear table data while keeping its structure (faster than DELETE, but does not log individual rows)
TRUNCATE TABLE exTable;-- 
```
---

### 3. 列の追加とデータ型の変更
```sql
-- Add a column:
ALTER TABLE exTable ADD COLUMN age INT;

-- Change a data type:
ALTER TABLE exTable ALTER COLUMN email TYPE VARCHAR(255);
```
---

### 4. Read, insert, update, と delete data
* [x] **検索**
```sql
-- Query all data
SELECT * FROM exTable;

-- Filtered query
SELECT username, email 
FROM exTable 
WHERE id > 1;

-- Pattern matching (ILIKE is case-insensitive, a PostgreSQL feature)
SELECT username, email FROM exTable WHERE username ILIKE 'tech%';

-- Sort と limit; ascending by default, DESC for descending
SELECT * FROM exTable 
ORDER BY created_time DESC 
LIMIT 6;
```

---
* [x] **追加**
```sql
-- Insert one row
INSERT INTO exTable (username, email) 
VALUES ('alice', 'alice@example.com');

-- Insert multiple rows
INSERT INTO exTable (username, email)
VALUES
('bob', 'bob@example.com'),
('charlie', 'charlie@example.com');
```

---
* [x] **更新**
```sql
UPDATE exTable 
SET email = 'alice_new@example.com' 
WHERE username = 'alice';
```
* テーブルを更新するときは必ず対象範囲を指定してください。指定しないと全行が更新される場合があります。

---
* [x] **削除**
```sql
DELETE FROM exTable 
WHERE username = 'charlie';
```

---
## PostgreSQLの発展基礎（T+1）

> Prerequisite: You should know how to create tables と perform basic CRUD operations.  
> Goal: Write more precise queries, understと data constraints, と get an introduction to joins across multiple tables.

---


### 複数条件の組み合わせ：AND / OR / NOT

```sql
-- AND: both conditions must be true
SELECT * FROM users
WHERE age >= 18 AND age <= 30;

-- OR: either condition can be true
SELECT * FROM users
WHERE username = 'alice' OR username = 'bob';

-- NOT: exclude
SELECT * FROM users
WHERE NOT age < 18;
```

### Ranges と lists: BETWEEN / IN

```sql
-- BETWEEN (inclusive)
SELECT * FROM users
WHERE age BETWEEN 18 AND 30;

-- IN (equivalent to multiple OR conditions, but more concise)
SELECT * FROM users
WHERE username IN ('alice', 'bob', 'charlie');

-- NOT IN (exclude a list)
SELECT * FROM users
WHERE username NOT IN ('alice', 'bob');
```

### NULLの判定：IS NULL / IS NOT NULL

```sql
-- 年齢が未入力のユーザーを検索（= NULL は使用しない）
SELECT * FROM users
WHERE age IS NULL;

-- Find users who have entered their age
SELECT * FROM users
WHERE age IS NOT NULL;
```

> NULL is not the same as an empty string `''` or `0`; it represents an "unknown value" と must be checked with IS NULL.

---

### 集計関数：データを集計する

| 関数 | 役割 |
|:---:|:---:|
| `COUNT()` | 件数 |
| `SUM()` | 合計 |
| `AVG()` | 平均 |
| `MAX()` | 最大値 |
| `MIN()` | 最小値 |

```sql
-- Number of users
SELECT COUNT(*) FROM users;

-- Average user age
SELECT AVG(age) FROM users;

-- Maximum と minimum user ages
SELECT MAX(age), MIN(age) FROM users;

-- 注意：COUNT(*) は全行を数え、COUNT(age) はNULLを除外します。
SELECT COUNT(*), COUNT(age) FROM users;
```

---

### GROUP BY：グループごとの集計

> Group the data by a column, then aggregate each group.

```sql
-- Create an orders table for this example
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    username VARCHAR(60) NOT NULL,
    product VARCHAR(60),
    amount INT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO orders (username, product, amount) VALUES
('alice', 'book', 120),
('alice', 'pen', 30),
('bob',   'book', 120),
('bob',   'bag', 200),
('charlie','pen', 30);
```

```sql
-- Number of orders per user
SELECT username, COUNT(*) AS order_count
FROM orders
GROUP BY username;

-- Total spending per user
SELECT username, SUM(amount) AS total_spent
FROM orders
GROUP BY username;
```

出力例：

| username | total_spent |
|:---:|:---:|
| alice | 150 |
| bob | 320 |
| charlie | 30 |

---

<!-- ## HAVING: filter grouped results

> WHERE filters source rows; HAVING filters grouped results.
> Quick rule: use HAVING for conditions involving aggregate functions.

```sql
-- Find users whose total spending exceeds 100
SELECT username, SUM(amount) AS total_spent
FROM orders
GROUP BY username
HAVING SUM(amount) > 100;

-- Combine filters: filter rows, group them, then filter the groups
SELECT username, SUM(amount) AS total_spent
FROM orders
WHERE product != 'pen'       -- First exclude records for pen purchases
GROUP BY username
HAVING SUM(amount) > 100;    -- Then filter by total amount
``` 

---
-->

### クエリの実行順序（重要）

Many SQL errors beginners encounter come from misunderstとing the execution order:

```
FROM      → Choose the data source
WHERE     → Filter source rows
GROUP BY  → Group rows
HAVING    → Filter grouped results
SELECT    → Select columns (aliases become available here)
ORDER BY  → Sort rows
LIMIT     → Limit the number of rows
```

```sql
-- Common mistake: using an alias from SELECT in WHERE
-- ❌ Incorrect: WHERE runs before SELECT, so total_spent does not exist yet
SELECT username, SUM(amount) AS total_spent
FROM orders
WHERE total_spent > 100       -- This causes an error!
GROUP BY username;

-- ✅ Correct: use HAVING
SELECT username, SUM(amount) AS total_spent
FROM orders
GROUP BY username
HAVING SUM(amount) > 100;
```

---


### Give columns と tables aliases with AS

```sql
-- Column aliases (make output easier to read)
SELECT 
    username AS username,
    SUM(amount) AS total_spending
FROM orders
JOIN users ON orders.user_id = users.id
GROUP BY username;

-- Table aliases (shorten long names; useful in multi-table queries)
SELECT u.username, o.product, o.amount
FROM users AS u
JOIN orders AS o ON u.id = o.user_id;
```

---

### 練習問題

次の2つのテーブルを使って練習しましょう：

```sql
-- Prepare sample data
INSERT INTO users (username, email) VALUES
('alice',   'alice@example.com'),
('bob',     'bob@example.com'),
('charlie', 'charlie@example.com');

INSERT INTO orders (user_id, product, amount) VALUES
(1, 'book', 120),
(1, 'pen',  30),
(2, 'book', 120),
(2, 'bag',  200);
-- charlie has no orders
```

1. Query every username と their total order amount, sorted by total amount in descending order
2. 合計支出が100を超えるユーザーを探す
3. 注文のないユーザーも含めて全ユーザーを検索する（ヒント：LEFT JOIN）
4. 商品ごとの販売回数を集計する

---

### 本章の構成

```
T+1 SQL fundamentals
├── Conditional queries
│   ├── AND / OR / NOT
│   ├── BETWEEN / IN
│   └── IS NULL / IS NOT NULL
├── Aggregation
│   ├── COUNT / SUM / AVG / MAX / MIN
│   ├── GROUP BY
│   └── HAVING
├── クエリの実行順序
│   └── FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER BY→LIMIT
└── Joins across tables
    ├── 外部キー REFERENCES
    ├── INNER JOIN
    ├── LEFT JOIN
    └── Column/table aliases with AS
```


---
## PythonでPostgreSQLを使う
### 1. 依存パッケージのインストール
* Pythonからデータベースを操作するには、まず`psycopg2`パッケージをインストールします。
```powershell
pip install psycopg2-binary
```

### 2. PythonからSQLを実行する
```python
import psycopg2

# Connect to the database
conn = psycopg2.connect(
    dbname="mydb",
    user="your_user",
    password="your_password",
    host="localhost",
    port="5432"
)
```

各パラメーターの説明：

| パラメーター | 説明 |
|------|------|
| dbname | データベース名 |
| user | PostgreSQLのユーザー名 |
| password | ユーザーのパスワード |
| host | データベースサーバーのアドレス（ローカルの場合は通常localhost） |
| port | PostgreSQLのデフォルトポートは5432 |

接続に成功すると、`conn`はデータベース接続オブジェクトを表します。

---

### 3. Cursor（カーソル）を作成する

PythonではSQL文を接続オブジェクトから直接実行せず、**Cursor（カーソル）**を介して実行します。

```python
cur = conn.cursor()
```
各要素の意味：
- Connection（接続）はデータベースへの接続を担当します
- Cursor（カーソル）はSQLの実行を担当します

Cursorは次のようなものと考えられます：

> An "operation window" between Python と the database.
> `cur.execute("SQL文")`を使って操作を実行します

以降のSQL文はすべてCursorで実行します。1つのConnectionから複数のCursorを作成できます。

---

### 4. データを挿入する（INSERT）

例えば、次のテーブルがあるとします：

```sql
CREATE TABLE exTable (
    id SERIAL PRIMARY KEY,
    username TEXT,
    email TEXT
);
```

データ挿入には、パラメーター化クエリの使用を推奨します：

```python
cur.execute("データ挿入用のSQL文", parameters)
```

psycopg2 automatically hとles:

- パラメーターのエスケープ
- 型変換
- SQLインジェクションの防止

これにより、より安全に実行できます。

* 例：
```python
cur.execute(
    """
    INSERT INTO exTable (username, email)
    VALUES (%s, %s)
    """,
    ("david", "david@example.com")
)
```


ここには2つの引数があります：

```python
"""
INSERT INTO exTable (username, email)
VALUES (%s, %s)
"""
```
これはSQLのテンプレートです。


```python
("david", "david@example.com")
```
これは挿入するデータです。

psycopg2 automatically replaces

```
%s
```

with the actual data.

PostgreSQLに送信されるクエリは、実質的に次のようになります：

```sql
INSERT INTO exTable(username,email)
VALUES('david','david@example.com');
```
ただし置換はドライバーが行うため、より安全です。

---

### 5. SQLインジェクション（SQL Injection）
```python
挿入するデータがユーザー入力またはスクリプト由来だとします。
例えば：  
username = input("username：")  
email = input("メールアドレス：")
```

実行するコードは次のとおりです：
```python
sql = f"""
INSERT INTO exTable(username,email)
VALUES('{username}','{email}')
"""

cur.execute(sql)
```

> ユーザーが次のように入力したとします：
```
David 
```
生成されるSQL
```sql
INSERT INTO exTable(username,email)
VALUES('David','xxx@example.com');
```
この場合は問題ありません。

> しかし、誰かが意図的に次の文字列を入力すると：
```python
David'); DROP TABLE exTable; --
```
生成されるSQLは次のようになります。
```sql
INSERT INTO exTable(username,email)
VALUES('David');
DROP TABLE exTable;
--','xxx@example.com');
```
データベースが複数のSQL文の実行を許可している場合、2つ目の文は
```sql
DROP TABLE exTable;
```
実際にexTableテーブルを削除してしまいます。  
これがよく知られるSQLインジェクションです。


---

### 6. Commit transactions と close the connection

PostgreSQLではデフォルトでトランザクションが使われます。

INSERT、UPDATE、DELETEを実行しても、変更はすぐにはデータベースに反映されません。

次を実行する必要があります：

```python
conn.commit()
```

実行しない場合：

```python
cur.execute(...)
```
処理が成功しても、プログラムを終了するとデータは保存されません。


> データベースの使用後は、リソースを速やかに解放します：

```python
cur.close()
conn.close()
```

一連の流れ：

```python
conn.commit()

cur.close()
conn.close()
```

これにより、接続がデータベースのリソースを長時間占有するのを防げます。

---

### 全体の例

```python
import psycopg2

# Connect to the database
conn = psycopg2.connect(
    dbname="mydb",
    user="your_user",
    password="your_password",
    host="localhost",
    port="5432"
)

# Create a cursor
cur = conn.cursor()

# Insert data
cur.execute(
    """
    INSERT INTO exTable (username, email)
    VALUES (%s, %s)
    """,
    ("david", "david@example.com")
)

# Commit the transaction
conn.commit()

# Close resources
cur.close()
conn.close()
```

---

### 7. Query, update (insert), と delete
#### データを検索する（SELECT）
データベースの検索にも`execute()`を使います。
例えば、全ユーザーを検索する場合：

```python
cur.execute("SELECT * FROM exTable")
```

検索結果は`fetch`系の関数で取得します。

* fetchone()  
最初の結果を返します。

```python
row = cur.fetchone()

print(row)
```

出力：

```
(1, 'david', 'david@example.com')
```

* fetchall()  
すべての結果を返します。

```python
rows = cur.fetchall()

for row in rows:
    print(row)
```

出力例：

```
(1, 'david', 'david@example.com')
(2, 'alice', 'alice@example.com')
(3, 'tom', 'tom@example.com')
```

* fetchmany()  
指定した件数ずつ読み込みます。

```python
rows = cur.fetchmany(5)
```

大量の検索結果をページ単位で読み込む際に便利です。

---

#### データを更新する（UPDATE）

既存のレコードを変更します：

```python
cur.execute(
    """
    UPDATE exTable
    SET email=%s
    WHERE username=%s
    """,
    (
        "new_email@example.com",
        "david"
    )
)

conn.commit()
```

---

#### データを削除する（DELETE）

レコードを削除します：

```python
cur.execute(
    """
    DELETE FROM exTable
    WHERE username=%s
    """,
    ("david",)
)

conn.commit()
```

注意：

パラメーターが1つだけの場合は、次のように記述します：

```python
("david",)
```

次のようには書きません：

```python
("david")
```

後者は単なる文字列であり、tupleではありません。

---

### 8. Context Managerを使う（推奨）

Pythonでは`with`を使ったリソースの自動管理が推奨されています。

例えば：

```python
import psycopg2

with psycopg2.connect(
    dbname="mydb",
    user="your_user",
    password="your_password",
    host="localhost",
    port="5432"
) as conn:

    with conn.cursor() as cur:

        cur.execute(
            """
            INSERT INTO exTable(username, email)
            VALUES(%s, %s)
            """,
            ("alice", "alice@example.com")
        )

    conn.commit()
```

This automatically closes the Cursor と Connection, even if an exception occurs.  
The code is safer と more Pythonic.

---

### 9. まとめ

psycopg2でPostgreSQLを操作する基本的な流れは次のとおりです：

1. psycopg2をインポートする
2. データベースに接続する（connect）
3. Cursorを作成する（cursor）
4. SQLを実行する（execute）
5. 結果を取得する（fetch）
6. トランザクションをコミットする（commit）
7. Close the Cursor と Connection (`close`)

全体の流れは次のようにまとめられます：

```text
Connect
    ↓
Cursor
    ↓
Execute SQL
    ↓
Fetch Result (optional)
    ↓
Commit
    ↓
Close
```

---

## SQLの応用
### サンプルデータの準備
* 学生テーブルを作成する

```sql
CREATE TABLE student (
    sid SERIAL PRIMARY KEY,
    name VARCHAR(20),
    gender VARCHAR(10)
);
```

データを挿入する：

```sql
INSERT INTO student(name, gender) VALUES
('Zhang San', 'Male'),
('Li Si', 'Male'),
('Wang Wu', 'Female');
```


* 科目テーブルを作成する

```sql
CREATE TABLE course (
    cid SERIAL PRIMARY KEY,
    cname VARCHAR(30)
);
```

データを挿入する：

```sql
INSERT INTO course(cname) VALUES
('Python'),
('Database'),
('Artificial Intelligence');
```

* 成績テーブルを作成する

```sql
CREATE TABLE score (
    sid INTEGER,
    cid INTEGER,
    score INTEGER
);
```

データを挿入する：

```sql
INSERT INTO score VALUES
(1,1,90),
(1,2,85),
(2,2,95),
(2,3,88),
(3,1,76);
```

### Join tables と query across them
実際のデータベースでは、すべての情報を1つのテーブルに保存せず、データの種類ごとにテーブルを分けるのが一般的です。

例えば：

- 学生情報は**student**テーブルに保存します。
- Course information is stored in the **course** table.
- Score information is stored in the **score** table.

データベースはどのようにして次のことを判断するのでしょうか：

* 90点が張三のPythonの成績だと分かるのでしょうか？

答えは次のとおりです：  
これらのテーブルは**共通のフィールド**を通じて関連付けられています。

例えば：

student

```text
sid
```

と

score

```text
sid
```

同じ学生を表します。

course

```text
cid
```

と

score

```text
cid
```

同じ科目を表します。

共通フィールドでテーブルを関連付ける方法を**リレーション（Relation）**と呼びます。


#### 外部キー（Foreign Key）：テーブル間のつながり

> A foreign key constrains the relationship between two tables と prevents "orphaned data".

```sql
-- Rebuild the score table (drop it first if it already exists)
DROP TABLE IF EXISTS score;

-- The sid と cid columns in score reference the student と course tables respectively
CREATE TABLE score (
    sid INT REFERENCES student(sid),
    cid INT REFERENCES course(cid),
    score INT
);
```
Here, both `sid` と `cid` are **foreign keys**.

- `sid`は`student`テーブルの`sid`を参照します。
- `cid`は`course`テーブルの`cid`を参照します。

Foreign keys **link tables と ensure data consistency**.  
例えば、`student`テーブルに`sid=100`の学生がいない場合、次の文は実行できません：

```sql
INSERT INTO score VALUES (100, 1, 90);
```

外部キーにより`score.sid`には`student`テーブルに存在する`sid`を指定する必要があるため、データベースはエラーを返します。  
同様に、`course`テーブルに存在しない科目IDを使って成績を挿入することはできません。  
Foreign keys therefore prevent references to nonexistent data と keep data consistent across tables.

---

#### JOIN：複数テーブル検索の基礎

> 外部キーでテーブル間の関係を定義し、**JOIN**でその関係を利用して複数のテーブルを結合して検索します。

例えば：

- `student`テーブルには学生情報を保存します；
- `course`テーブルには科目情報を保存します；
- `score`テーブルには成績情報を保存します。

To query a student’s name, course name, と score, use **JOIN** because this information is stored in different tables.

この節では、最もよく使われる**INNER JOIN（内部結合）**を紹介します。

---

* INNER JOIN（内部結合）

**INNER JOIN**は、両方のテーブルで一致する行だけを返します。

基本構文：

```sql
SELECT column_list
FROM table1
INNER JOIN table2
ON table1.column = table2.column;
```

各要素の意味：

- `INNER JOIN`：別のテーブルを結合します。
- `ON`：テーブル間の結合条件を指定します。

---

* 2つのテーブルを結合する

Query each student’s name と score:

```sql
SELECT
    student.name,
    score.score
FROM student
INNER JOIN score
ON student.sid = score.sid;
```

結果：

| name | score |
|------|------:|
| 張三 | 90 |
| 張三 | 85 |
| 李四 | 95 |
| 李四 | 88 |
| 王五 | 76 |

解説：

- `student`テーブルには学生名が保存されています。
- `score`テーブルには成績が保存されています。
- 2つのテーブルは共通の`sid`フィールドで結合されます。
- 検索結果には両方のテーブルのデータが含まれます。

---

* 3つのテーブルを結合する

科目名も検索するには、`course`テーブルも結合します。

For example, query each student’s name, course name, と score:

```sql
SELECT
    student.name,
    course.cname,
    score.score
FROM score
INNER JOIN student
ON score.sid = student.sid
INNER JOIN course
ON score.cid = course.cid;
```

結果：

| 名前 | コース | 点数 |
|------|--------|------:|
| 張三 | Python | 90 |
| 張三 | データベース | 85 |
| 李四 | データベース | 95 |
| 李四 | 人工知能 | 88 |
| 王五 | Python | 76 |

解説：

クエリは次の2段階で実行されます：

第1段階：

```text
score
   │
JOIN
   │
student
```

`sid`を使って学生名を検索します。

第2段階：

```text
(student + score)
        │
      JOIN
        │
      course
```

`cid`を使って科目名を検索します。

1つのSQLクエリで3つのテーブルの情報を同時に検索できます。  
このように、**INNER JOIN**は複数テーブル間の関係を利用し、  
異なるテーブルの情報を1つの結果にまとめます。SQLで最も一般的な複数テーブル検索の方法です。

---

### サブクエリ

> あるSQLクエリの結果を使って、次の検索を続ける場合があります。  
このように**SQL文の中に別のSQL文を入れる**方法を**サブクエリ（Subquery）**または**ネストしたクエリ**と呼びます。  
サブクエリは通常、丸括弧`()`で囲みます。データベースは**最初にサブクエリを実行し、その後に外側のクエリを実行します**。

基本形：
```sql
SELECT ...
FROM ...
WHERE column = (
    SELECT ...
);
```


#### Example 1: Find the highest score と its record

まず、scoreテーブルの最高点を検索します：

```sql
SELECT MAX(score)
FROM score;
```

結果：

```
95
```

最高点のレコードを直接取得するには、上のクエリをサブクエリとして使います：

```sql
SELECT *
FROM score
WHERE score = (
    SELECT MAX(score)
    FROM score
);
```

実行順序は次のとおりです：

① 最初にサブクエリを実行します：

```sql
SELECT MAX(score)
FROM score;
```

結果：

```
95
```

② 次に外側のクエリを実行します：

```sql
SELECT *
FROM score
WHERE score = 95;
```

最高点に該当するレコードが検索されます。



#### 例2：データベース科目の成績を検索する

科目名「データベース」は分かるものの、科目IDが分からないとします。

まず科目IDを検索します：

```sql
SELECT cid
FROM course
WHERE cname = 'Database';
```

結果：

```
2
```

続けて成績を検索します：

```sql
SELECT *
FROM score
WHERE cid = (
    SELECT cid
    FROM course
    WHERE cname = 'Database'
);
```

これで科目IDを手入力する必要はありません。


#### 例3：INサブクエリを使う

サブクエリが複数の行を返す場合は、`IN`を使います。

例：Pythonを履修している学生のIDをすべて検索します。

```sql
SELECT sid
FROM score
WHERE cid IN (
    SELECT cid
    FROM course
    WHERE cname = 'Python'
);
```

`IN`の意味：

> 値がサブクエリの返した集合に含まれているかどうかを判定します。

サブクエリが複数の結果を返す場合、`=`は使えず、代わりに`IN`を使います。

---

#### サブクエリと通常のクエリの違い

通常のクエリ：

```sql
SELECT *
FROM score
WHERE cid = 2;
```

事前に科目IDを知っている必要があります。

サブクエリ：

```sql
SELECT *
FROM score
WHERE cid = (
    SELECT cid
    FROM course
    WHERE cname = 'Database'
);
```

科目IDを知っている必要はなく、データベースが自動的に検索します。  
Subqueries make SQL more flexible と queries more convenient.

特徴：

- サブクエリは通常`()`内に記述します。
- データベースはサブクエリを先に実行し、その後に外側のクエリを実行します。
- サブクエリが1件の結果を返す場合は、通常`=`を使います。
- サブクエリが複数の結果を返す場合は、通常`IN`を使います。

サブクエリは、条件を先に検索し、その結果に基づいて次の検索を行う場合によく使われます。
