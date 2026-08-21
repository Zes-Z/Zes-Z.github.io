---
title: "SQL(结构化查询语言)数据库安装与使用"
description: ""
pubDate: "2026-04-19"
updatedDate: "2026-06-22"
category: "Math & Coding"

heroImage: ""
homeFeatured: false   # 用于指定在首页 Read 区优先大图片展示
# homeHeroOrder:      # 用于指定首页个签下方置顶文章顺序,在 MyBlogsrcpagesindex.astro 第27行增加置顶篇章
# homeOrder:          # 用于指定首页下方 All Posts顺序
draft: false
---
首先推荐一个不错的SQL语句指导和练习网站：[SQLZoo](https://sqlzoo.net/wiki/SQL_Tutorial)

---

## PostgreSQL 数据库安装
[PostgreSQL: The World's Most Advanced Open Source Relational Database](https://www.postgresql.org/)
> PostgreSQL 是一个开源关系型数据库管理系统（Relational Database Management System, RDBMS）  
> 以稳定性、标准兼容性和丰富的数据类型支持而闻名, 被广泛应用于 Web 开发、数据分析以及企业级应用。  

* [ ] 安装后后添加路径到环境变量
```
D:\Database\PostgreSQL\bin
```
* [ ] 验证版本
```powershell
psql --version
```

---

## 初识 表、数据库、SQL
### 表的基础结构

* 表（Table）是数据库中存储数据的基本单位
* 可以理解为一个横纵方向的二维表格。  

例如用户信息表：

| id	| username	| email  |
| :---: |:---: | :---:|
| 1 |	Alice	|alice@example.com  |
| 2	| Bob	|bob@example.com |
| 3 |	Charlie	|charlie@example.com |

其中：
* 每一列（Column）表示一个字段（Field）
* 每一行（Row）表示一条记录（Record）
* 每张表通常会有主键（Primary Key）用于唯一标识记录

---
### 数据库的基础结构
数据库（Database）是多个表的集合，用于组织和管理数据。

一个简单的网站数据库可能包含多个表：

mydb  
├── users  
├── articles  
├── comments  
└── categories

其中：

* users 表存储用户信息
* articles 表存储文章信息
* comments 表存储评论信息
* categories 表存储分类信息

数据库负责维护这些表之间的关系，并保证数据的一致性与安全性。

---
### SQL 基础概念
SQL（Structured Query Language，结构化查询语言）是操作关系型数据库的标准语言。

通过 SQL 可以完成：

* 创建数据库和表（CREATE）
* 查询数据（SELECT）
* 插入数据（INSERT）
* 更新数据（UPDATE）
* 删除数据（DELETE）

例如：
```sql
SELECT * FROM users;
```
表示查询 users 表中的所有数据。
SQL 是学习 PostgreSQL、MySQL、SQLite 等关系型数据库的基础工具。

---
## PostgreSQL 基础操作

### 1. 创建数据库与表

```sql
-- 创建数据库
CREATE DATABASE mydb;

-- 切换数据库
\c mydb

-- 创建表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(60) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
* 注意：列的格式为：`字段名` `数据类型[(长度)]` `[约束/修饰符]`。
---

### 2. 删除数据库与表，或清空表

```sql
-- 删除数据库（不能删除当前连接的数据库）
DROP DATABASE mydb;

-- 删除表（包括表结构和数据）
DROP TABLE exTable;

-- 清空表数据，但保留表结构 (比 DELETE 快，但不记录行日志)
TRUNCATE TABLE exTable;-- 
```
---

### 3. 表添加新列，修改数据类型
```sql
-- 添加新列:
ALTER TABLE exTable ADD COLUMN age INT;

-- 修改数据类型:
ALTER TABLE exTable ALTER COLUMN email TYPE VARCHAR(255);
```
---

### 4. 查增改删数据
* [x] **查**
```sql
-- 查询所有数据
SELECT * FROM exTable;

-- 条件查询
SELECT username, email 
FROM exTable 
WHERE id > 1;

-- 模糊查询 (ILIKE 不区分大小写，PostgreSQL 特色)
SELECT username, email FROM exTable WHERE username ILIKE 'tech%';

-- 排序与限制，默认升序，DESC为降序
SELECT * FROM exTable 
ORDER BY created_time DESC 
LIMIT 6;
```

---
* [x] **增**
```sql
-- 插入一行数据
INSERT INTO exTable (username, email) 
VALUES ('alice', 'alice@example.com');

-- 插入多行
INSERT INTO exTable (username, email)
VALUES
('bob', 'bob@example.com'),
('charlie', 'charlie@example.com');
```

---
* [x] **改**
```sql
UPDATE exTable 
SET email = 'alice_new@example.com' 
WHERE username = 'alice';
```
* 对表进行修改时，务必限定范围，否则会更新全表信息

---
* [x] **删**
```sql
DELETE FROM exTable 
WHERE username = 'charlie';
```

---
## PostgreSQL 进阶基础（T+1）

> 前置：已掌握建表、增删改查基础操作  
> 本章目标：写出更精准的查询，理解数据约束，初步接触多表关联

---


### 多条件组合查询：AND / OR / NOT

```sql
-- AND：同时满足
SELECT * FROM users
WHERE age >= 18 AND age <= 30;

-- OR：满足其中一个
SELECT * FROM users
WHERE username = 'alice' OR username = 'bob';

-- NOT：排除
SELECT * FROM users
WHERE NOT age < 18;
```

### 范围与列表：BETWEEN / IN

```sql
-- BETWEEN（含两端）
SELECT * FROM users
WHERE age BETWEEN 18 AND 30;

-- IN（等同于多个 OR，更简洁）
SELECT * FROM users
WHERE username IN ('alice', 'bob', 'charlie');

-- NOT IN（排除列表）
SELECT * FROM users
WHERE username NOT IN ('alice', 'bob');
```

### 空值判断：IS NULL / IS NOT NULL

```sql
-- 查找没有填写年龄的用户（注意：不能用 = NULL）
SELECT * FROM users
WHERE age IS NULL;

-- 查找已填写年龄的用户
SELECT * FROM users
WHERE age IS NOT NULL;
```

> NULL 不等于空字符串 `''`，也不等于 `0`，是"未知值"，只能用 IS NULL 判断

---

###  聚合函数：对一组数据做统计

| 函数 | 作用 |
|:---:|:---:|
| `COUNT()` | 计数 |
| `SUM()` | 求和 |
| `AVG()` | 平均值 |
| `MAX()` | 最大值 |
| `MIN()` | 最小值 |

```sql
-- 一共有多少用户
SELECT COUNT(*) FROM users;

-- 用户的平均年龄
SELECT AVG(age) FROM users;

-- 年龄最大和最小的用户
SELECT MAX(age), MIN(age) FROM users;

-- 注意：COUNT(*) 计所有行，COUNT(age) 会跳过 NULL
SELECT COUNT(*), COUNT(age) FROM users;
```

---

### GROUP BY：分组统计

> 把数据按某列分组，再对每组做聚合计算

```sql
-- 先创建一张订单表来演示
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
-- 每个用户各消费了多少次
SELECT username, COUNT(*) AS order_count
FROM orders
GROUP BY username;

-- 每个用户的总消费金额
SELECT username, SUM(amount) AS total_spent
FROM orders
GROUP BY username;
```

输出示例：

| username | total_spent |
|:---:|:---:|
| alice | 150 |
| bob | 320 |
| charlie | 30 |

---

<!-- ## HAVING：对分组结果再过滤

> WHERE 过滤的是原始行，HAVING 过滤的是分组后的结果
> 简单记：有聚合函数的条件 → 用 HAVING

```sql
-- 找出总消费超过 100 的用户
SELECT username, SUM(amount) AS total_spent
FROM orders
GROUP BY username
HAVING SUM(amount) > 100;

-- 组合使用：先过滤行，再分组，再过滤组
SELECT username, SUM(amount) AS total_spent
FROM orders
WHERE product != 'pen'       -- 先排除买笔的记录
GROUP BY username
HAVING SUM(amount) > 100;    -- 再筛选总额
``` 

---
-->

### 查询执行顺序（重要！）

很多初学者写出报错 SQL，往往是因为搞错了执行顺序：

```
FROM      → 确定数据来源
WHERE     → 过滤原始行
GROUP BY  → 分组
HAVING    → 过滤分组结果
SELECT    → 选取列（别名在这里才生效）
ORDER BY  → 排序
LIMIT     → 限制条数
```

```sql
-- 常见错误示例：WHERE 里用了 SELECT 里定义的别名
-- ❌ 错误：WHERE 在 SELECT 之前执行，total_spent 还不存在
SELECT username, SUM(amount) AS total_spent
FROM orders
WHERE total_spent > 100       -- 报错！
GROUP BY username;

-- ✅ 正确：用 HAVING
SELECT username, SUM(amount) AS total_spent
FROM orders
GROUP BY username
HAVING SUM(amount) > 100;
```

---


### 给列和表起别名：AS

```sql
-- 列别名（让输出更易读）
SELECT 
    username AS 用户名,
    SUM(amount) AS 总消费
FROM orders
JOIN users ON orders.user_id = users.id
GROUP BY username;

-- 表别名（简化长表名，多表联查时常用）
SELECT u.username, o.product, o.amount
FROM users AS u
JOIN orders AS o ON u.id = o.user_id;
```

---

### 本章练习

用以下两张表完成练习：

```sql
-- 准备数据
INSERT INTO users (username, email) VALUES
('alice',   'alice@example.com'),
('bob',     'bob@example.com'),
('charlie', 'charlie@example.com');

INSERT INTO orders (user_id, product, amount) VALUES
(1, 'book', 120),
(1, 'pen',  30),
(2, 'book', 120),
(2, 'bag',  200);
-- charlie 没有订单
```

1. 查询所有用户名和他们的订单总金额，按总金额降序排列
2. 找出总消费超过 100 的用户
3. 查询所有用户，没有订单的也要显示（提示：LEFT JOIN）
4. 统计每种商品各卖出了几次

---

### 本章知识结构

```
T+1 SQL基础
├── 条件查询
│   ├── AND / OR / NOT
│   ├── BETWEEN / IN
│   └── IS NULL / IS NOT NULL
├── 聚合统计
│   ├── COUNT / SUM / AVG / MAX / MIN
│   ├── GROUP BY
│   └── HAVING
├── 查询执行顺序
│   └── FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER BY→LIMIT
└── 多表关联
    ├── 外键 REFERENCES
    ├── INNER JOIN
    ├── LEFT JOIN
    └── 列/表别名 AS
```


---
## 在Python 中使用 PostgreSQL
### 1. 安装依赖
* 要在python操纵数据库，需首先安装`psycopg2`包
```powershell
pip install psycopg2-binary
```

### 2. 在Python中执行SQL操作
```python
import psycopg2

# 建立连接
conn = psycopg2.connect(
    dbname="mydb",
    user="your_user",
    password="your_password",
    host="localhost",
    port="5432"
)
```

各参数说明：

| 参数 | 说明 |
|------|------|
| dbname | 数据库名称 |
| user | PostgreSQL 用户名 |
| password | 用户密码 |
| host | 数据库服务器地址（本地一般为 localhost） |
| port | PostgreSQL 默认端口为 5432 |

连接成功后，`conn` 就代表一个数据库连接对象。

---

### 3. 创建 Cursor（游标）

在py中，所有 SQL 语句都不是直接由连接对象执行，而是通过 **Cursor（游标）**。

```python
cur = conn.cursor()
```
其中：
- Connection（连接）负责连接数据库
- Cursor（游标）负责执行 SQL

可以把 Cursor 理解成：

> Python 与数据库之间的"操作窗口"。
> 使用cur.execute("具体sql语句")以执行操作

之后所有 SQL 语句都由它负责执行。一个 Connection 可以创建多个 Cursor。

---

### 4. 插入数据（INSERT）

例如，我们有如下数据表：

```sql
CREATE TABLE exTable (
    id SERIAL PRIMARY KEY,
    username TEXT,
    email TEXT
);
```

对于插入数据，推荐使用参数化查询：

```python
cur.execute("用于插入数据的sql语句", parameters)
```

psycopg2 会自动完成：

- 参数转义（Escape）
- 类型转换
- 防止 SQL 注入

因此更加安全。

* 具体如下：
```python
cur.execute(
    """
    INSERT INTO exTable (username, email)
    VALUES (%s, %s)
    """,
    ("david", "david@example.com")
)
```


这里有两个参数：

```python
"""
INSERT INTO exTable (username, email)
VALUES (%s, %s)
"""
```
表示 SQL 模板。


```python
("david", "david@example.com")
```
表示要填充进去的数据。

psycopg2 会自动把

```
%s
```

替换成真正的数据。

最终发送给 PostgreSQL 的实际上类似于：

```sql
INSERT INTO exTable(username,email)
VALUES('david','david@example.com');
```
但是整个替换过程由驱动程序完成，因此更加安全。

---

### 5. SQL 注入（SQL Injection）
```python
假设需要插入的数据来自用户输入或脚本
例如：  
username = input("用户名：")  
email = input("邮箱：")
```

需要执行的程序代码如下：
```python
sql = f"""
INSERT INTO exTable(username,email)
VALUES('{username}','{email}')
"""

cur.execute(sql)
```

> 假设用户输入
```
David 
```
生成的 SQL
```sql
INSERT INTO exTable(username,email)
VALUES('David','xxx@example.com');
```
没有问题。

> 但是如果有人故意输入
```python
David'); DROP TABLE exTable; --
```
那么生成的 SQL 就会变成
```sql
INSERT INTO exTable(username,email)
VALUES('David');
DROP TABLE exTable;
--','xxx@example.com');
```
如果数据库允许执行多条 SQL，那么第二句
```sql
DROP TABLE exTable;
```
就真的会把表 exTable 删掉。  
这就是著名的 SQL 注入


---

### 6. 提交事务（Commit）与关闭连接

PostgreSQL 默认开启事务。

执行 INSERT、UPDATE、DELETE 后，并不会立即写入数据库。

需要执行：

```python
conn.commit()
```

否则：

```python
cur.execute(...)
```
即使执行成功，关闭程序之后数据仍然不会保存。


> 数据库资源使用完毕后，应及时释放：

```python
cur.close()
conn.close()
```

完整流程如下：

```python
conn.commit()

cur.close()
conn.close()
```

这样可以避免连接长期占用数据库资源。

---

### 完整示例

```python
import psycopg2

# 建立连接
conn = psycopg2.connect(
    dbname="mydb",
    user="your_user",
    password="your_password",
    host="localhost",
    port="5432"
)

# 创建游标
cur = conn.cursor()

# 插入数据
cur.execute(
    """
    INSERT INTO exTable (username, email)
    VALUES (%s, %s)
    """,
    ("david", "david@example.com")
)

# 提交事务
conn.commit()

# 关闭资源
cur.close()
conn.close()
```

---

### 7. 查改(增)删
#### 查询数据（SELECT）
查询数据库时，仍然使用 `execute()`。
例如查询所有用户：

```python
cur.execute("SELECT * FROM exTable")
```

查询结果需要通过 `fetch` 系列函数获取。

* fetchone()  
返回第一条结果。

```python
row = cur.fetchone()

print(row)
```

输出：

```
(1, 'david', 'david@example.com')
```

* fetchall()  
返回全部结果。

```python
rows = cur.fetchall()

for row in rows:
    print(row)
```

输出示例：

```
(1, 'david', 'david@example.com')
(2, 'alice', 'alice@example.com')
(3, 'tom', 'tom@example.com')
```

* fetchmany()  
一次读取指定数量的数据。

```python
rows = cur.fetchmany(5)
```

适用于大量数据的分页读取。

---

#### 更新数据（UPDATE）

修改已有记录：

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

#### 删除数据（DELETE）

删除记录：

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

只有一个参数时，需要写成：

```python
("david",)
```

而不是：

```python
("david")
```

因为后者只是字符串，并不是 tuple。

---

### 8. 使用 Context Manager（推荐）

Python 推荐使用 `with` 自动管理资源。

例如：

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

这样即使程序发生异常，也能自动关闭 Cursor 与 Connection。  
代码更加安全，也更加 Pythonic。

---

### 9. 小结

使用 psycopg2 操作 PostgreSQL 的基本流程如下：

1. 导入 psycopg2
2. 建立数据库连接（connect）
3. 创建 Cursor（cursor）
4. 执行 SQL（execute）
5. 获取结果（fetch）
6. 提交事务（commit）
7. 关闭 Cursor 和 Connection（close）

整个流程可以简单概括为：

```text
Connect
    ↓
Cursor
    ↓
Execute SQL
    ↓
Fetch Result（可选）
    ↓
Commit
    ↓
Close
```

---

## SQL 再进阶
### 准备示例数据
* 创建学生表

```sql
CREATE TABLE student (
    sid SERIAL PRIMARY KEY,
    name VARCHAR(20),
    gender VARCHAR(10)
);
```

插入数据：

```sql
INSERT INTO student(name, gender) VALUES
('张三', '男'),
('李四', '男'),
('王五', '女');
```


* 创建课程表

```sql
CREATE TABLE course (
    cid SERIAL PRIMARY KEY,
    cname VARCHAR(30)
);
```

插入数据：

```sql
INSERT INTO course(cname) VALUES
('Python'),
('数据库'),
('人工智能');
```

* 创建成绩表

```sql
CREATE TABLE score (
    sid INTEGER,
    cid INTEGER,
    score INTEGER
);
```

插入数据：

```sql
INSERT INTO score VALUES
(1,1,90),
(1,2,85),
(2,2,95),
(2,3,88),
(3,1,76);
```

### 联结表与跨表查询
现实中的数据库通常不会把所有信息保存在同一张数据表中，而是按照不同的数据类型分别建立数据表。

例如：

- 学生信息保存在 **student** 表。
- 课程信息保存在 **course** 表。
- 成绩信息保存在 **score** 表。

那么数据库如何知道：

* 成绩 90 是张三的 Python 成绩？

答案就是：  
这些数据表之间通过**相同字段**建立联系。

例如：

student

```text
sid
```

与

score

```text
sid
```

表示同一个学生。

course

```text
cid
```

与

score

```text
cid
```

表示同一门课程。

这种通过共同字段建立联系的方法称为**联结（Relation）**。


#### 外键（Foreign Key）：表之间的纽带

> 外键用于约束两张表之间的关系，防止出现"孤儿数据"

```sql
-- 重建 score 表（如果已存在先删除）
DROP TABLE IF EXISTS score;

-- score 表的 sid 和 cid 列分别指向 student 和 course 表
CREATE TABLE score (
    sid INT REFERENCES student(sid),
    cid INT REFERENCES course(cid),
    score INT
);
```
这里，`sid` 和 `cid` 都是**外键（Foreign Key）**。

- `sid` 引用 `student` 表中的 `sid`。
- `cid` 引用 `course` 表中的 `cid`。

外键的作用是**建立数据表之间的关联，并保证数据的一致性**。  
例如，如果 `student` 表中不存在 `sid=100` 的学生，那么下面的语句将无法执行：

```sql
INSERT INTO score VALUES (100, 1, 90);
```

数据库会提示错误，因为外键要求 `score.sid` 的值必须来自 `student` 表中已经存在的 `sid`。  
同样，如果 `course` 表中不存在对应的课程编号，也无法插入成绩记录。  
因此，外键能够防止引用不存在的数据，保证数据库中各个数据表之间的数据始终保持一致。

---

#### JOIN：多表联查入门

> 外键建立了数据表之间的关联，而 **JOIN** 则利用这些关联，将多个数据表中的数据组合到一起进行查询。

例如：

- `student` 表保存学生信息；
- `course` 表保存课程信息；
- `score` 表保存成绩信息。

如果想查询"学生姓名、课程名称以及成绩"，由于这些信息分别保存在不同的数据表中，因此需要使用 **JOIN** 进行跨表查询。

本节主要介绍最常用的 **INNER JOIN（内连接）**。

---

* INNER JOIN（内连接）

**INNER JOIN** 只返回两张表中能够成功匹配的数据。

基本语法如下：

```sql
SELECT 字段列表
FROM 表1
INNER JOIN 表2
ON 表1.字段 = 表2.字段;
```

其中：

- `INNER JOIN`：表示联结另一张数据表。
- `ON`：指定两张表之间的联结条件。

---

* 两表联结

查询每位学生的姓名和成绩：

```sql
SELECT
    student.name,
    score.score
FROM student
INNER JOIN score
ON student.sid = score.sid;
```

运行结果：

| name | score |
|------|------:|
| 张三 | 90 |
| 张三 | 85 |
| 李四 | 95 |
| 李四 | 88 |
| 王五 | 76 |

分析：

- `student` 表中保存学生姓名。
- `score` 表中保存学生成绩。
- 两张表通过共同的 `sid` 字段进行联结。
- 查询结果同时包含了两张表中的数据。

---

* 三表联结

如果希望继续查询课程名称，则需要再联结 `course` 表。

例如，查询每位学生的姓名、课程名称以及成绩：

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

运行结果：

| 姓名 | 课程 | 成绩 |
|------|--------|------:|
| 张三 | Python | 90 |
| 张三 | 数据库 | 85 |
| 李四 | 数据库 | 95 |
| 李四 | 人工智能 | 88 |
| 王五 | Python | 76 |

分析：

整个查询过程可以分为两个步骤：

第一步：

```text
score
   │
JOIN
   │
student
```

根据 `sid` 查询学生姓名。

第二步：

```text
(student + score)
        │
      JOIN
        │
      course
```

根据 `cid` 查询课程名称。

最终，一条 SQL 就能够同时查询三张数据表中的信息。  
由此可见，**INNER JOIN** 可以根据多个数据表之间的关联关系，  
将不同数据表中的信息整合到同一条查询结果中，是 SQL 中最常用的跨表查询方式。

---

### 子查询

> 有时候，一条 SQL 查询需要先得到另一个查询的结果，再根据这个结果继续查询。  
这种**在一条 SQL 语句中嵌套另一条 SQL 语句**的写法，称为**子查询（Subquery）**，也叫**嵌套查询**。  
子查询通常放在圆括号 `()` 中，数据库会**先执行子查询，再执行外层查询**。

基本形式如下：
```sql
SELECT ...
FROM ...
WHERE 字段 = (
    SELECT ...
);
```


#### 示例一：查询最高成绩与对应数据

首先查询成绩表中的最高成绩：

```sql
SELECT MAX(score)
FROM score;
```

运行结果：

```
95
```

如果希望直接查询这条最高成绩对应的记录，可以将上面的查询作为子查询：

```sql
SELECT *
FROM score
WHERE score = (
    SELECT MAX(score)
    FROM score
);
```

执行过程如下：

① 子查询首先执行：

```sql
SELECT MAX(score)
FROM score;
```

得到：

```
95
```

② 外层查询继续执行：

```sql
SELECT *
FROM score
WHERE score = 95;
```

最终查询出最高成绩对应的数据。



#### 示例二：查询数据库课程的成绩

假设不知道"数据库"课程的编号，只知道课程名称。

可以先查询课程编号：

```sql
SELECT cid
FROM course
WHERE cname = '数据库';
```

得到：

```
2
```

然后继续查询成绩：

```sql
SELECT *
FROM score
WHERE cid = (
    SELECT cid
    FROM course
    WHERE cname = '数据库'
);
```

这样就不需要手动输入课程编号。


#### 示例三：使用 IN 子查询

有时子查询可能返回多条数据，这时可以使用 `IN`。

例如：查询所有选修了 Python 课程的学生编号。

```sql
SELECT sid
FROM score
WHERE cid IN (
    SELECT cid
    FROM course
    WHERE cname = 'Python'
);
```

`IN` 表示：

> 判断某个值是否存在于子查询返回的结果集合中。

如果子查询返回多个结果，`=` 无法使用，而应该使用 `IN`。

---

#### 子查询与普通查询的区别

普通查询：

```sql
SELECT *
FROM score
WHERE cid = 2;
```

需要提前知道课程编号。

子查询：

```sql
SELECT *
FROM score
WHERE cid = (
    SELECT cid
    FROM course
    WHERE cname = '数据库'
);
```

不需要知道课程编号，而是由数据库自动查询得到。  
因此，子查询能够提高 SQL 的灵活性，使查询更加方便。

特点：

- 子查询通常放在 `()` 中。
- 数据库会先执行子查询，再执行外层查询。
- 当子查询返回一个结果时，通常配合 `=` 使用。
- 当子查询返回多个结果时，通常配合 `IN` 使用。

子查询常用于：先查询某个条件，再根据该条件继续完成查询。

---