---
title: SQL(结构化查询语言)数据库安装与使用
published: 2026-04-19
description: "PostgreSQL 的基础增删查改操作，以及如何在 Python 中使用 PostgreSQL。"
category: Math & Coding
tags: [sql,数据库]
image: ""
draft: true 
lang: ""
---
# PostgreSQL 数据库安装
[PostgreSQL: The World's Most Advanced Open Source Relational Database](https://www.postgresql.org/)


---
---
---
# PostgreSQL 基础操作

## 1. 创建数据库与表

```sql
-- 创建数据库
CREATE DATABASE mydb;

-- 切换数据库
\c mydb

-- 创建表
CREATE TABLE exTable (
    id SERIAL PRIMARY KEY,
    username VARCHAR(60) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age VARCHAR(60),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
---

## 2. 删除数据库与表，或清空表

```sql
-- 删除数据库（不能删除当前连接的数据库）
DROP DATABASE mydb;

-- 删除表（包括表结构和数据）
DROP TABLE exTable;

-- 清空表数据，但保留表结构 (比 DELETE 快，但不记录行日志)
TRUNCATE TABLE exTable;-- 
```
---

## 3. 表添加新列，修改数据类型
```sql
-- 添加新列:
ALTER TABLE exTable ADD COLUMN age INT;

-- 修改数据类型:
ALTER TABLE exTable ALTER COLUMN email TYPE VARCHAR(255);
```
---

## 4. 查增改删数据
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
---
---
# 在Python 中使用 PostgreSQL
## 1. 安装依赖
* 要在python操纵数据库，需首先安装`psycopg2`包
```powershell
pip install psycopg2-binary
```

## 2. 在Python中链接SQL数据库并执行操作
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
    "INSERT INTO exTable (username, email) VALUES (%s, %s)",
    ("david", "david@example.com")
)

# 执行完数据库操作后，提交事务并关闭连接
conn.commit()
cur.close()
conn.close()
```
---