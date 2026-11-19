---
title: "SQL (Structured Query Language): Installation and Usage"
description: 'Install PostgreSQL, learn SQL fundamentals and joins, and connect to PostgreSQL from Python with psycopg2.'
pubDate: "2026-04-19"
updatedDate: "2026-06-22"
category: "Math & Coding"
tag: [sql,PostgreSQL]
heroImage: ""
homeFeatured: false   # 用于指定在首页 Read 区优先大图片展示
# homeHeroOrder:      # Set the pinned post order below the home intro; add pinned posts in MyBlogsrcpagesindex.astro at line 27
# homeOrder:          # Set the order in the All Posts section on the home page
draft: false
---

First, here is a useful site for learning and practicing SQL: [SQLZoo](https://sqlzoo.net/wiki/SQL_Tutorial)

---

## Install PostgreSQL
[PostgreSQL: The World's Most Advanced Open Source Relational Database](https://www.postgresql.org/)
> PostgreSQL is an open-source Relational Database Management System (RDBMS)  
> It is known for its stability, standards compliance, and rich data type support, and is widely used in web development, data analysis, and enterprise applications.  

* [ ] After installation, add the path to the environment variables
```
D:\Database\PostgreSQL\bin
```
* [ ] Verify the version
```powershell
psql --version
```

---

## Introduction to tables, databases, and SQL
### Basic table structure

* A table is the basic unit for storing data in a database
* It can be thought of as a two-dimensional grid of rows and columns.  

For example, a user information table:

| id	| username	| email  |
| :---: |:---: | :---:|
| 1 |	Alice	|alice@example.com  |
| 2	| Bob	|bob@example.com |
| 3 |	Charlie	|charlie@example.com |

Where:
* Each column represents a field
* Each row represents a record
* Each table usually has a primary key to uniquely identify each record

---
### Basic database structure
A database is a collection of tables used to organize and manage data.

A simple website database might contain several tables:

mydb  
├── users  
├── articles  
├── comments  
└── categories

Where:

* The users table stores user information
* The articles table stores article information
* The comments table stores comment information
* The categories table stores category information

The database maintains the relationships between these tables and ensures data consistency and security.

---
### SQL basics
SQL (Structured Query Language) is the standard language for working with relational databases.

SQL can be used to:

* Create databases and tables (CREATE)
* Query data (SELECT)
* Insert data (INSERT)
* Update data (UPDATE)
* Delete data (DELETE)

For example:
```sql
SELECT * FROM users;
```
This queries all data in the users table.
SQL is a fundamental tool for working with relational databases such as PostgreSQL, MySQL, and SQLite.

---
## PostgreSQL fundamentals

### 1. Create a database and table

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
* Note: A column uses the format `field name` `data type[(length)]` `[constraint/modifier]`.
---

### 2. Drop a database or table, or clear a table

```sql
-- Drop a database (you cannot drop the database you are currently connected to)
DROP DATABASE mydb;

-- Drop a table (including its structure and data)
DROP TABLE exTable;

-- Clear table data while keeping its structure (faster than DELETE, but does not log individual rows)
TRUNCATE TABLE exTable;-- 
```
---

### 3. Add a column or change a data type
```sql
-- Add a column:
ALTER TABLE exTable ADD COLUMN age INT;

-- Change a data type:
ALTER TABLE exTable ALTER COLUMN email TYPE VARCHAR(255);
```
---

### 4. Read, insert, update, and delete data
* [x] **Read**
```sql
-- Query all data
SELECT * FROM exTable;

-- Filtered query
SELECT username, email 
FROM exTable 
WHERE id > 1;

-- Pattern matching (ILIKE is case-insensitive, a PostgreSQL feature)
SELECT username, email FROM exTable WHERE username ILIKE 'tech%';

-- Sort and limit; ascending by default, DESC for descending
SELECT * FROM exTable 
ORDER BY created_time DESC 
LIMIT 6;
```

---
* [x] **Insert**
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
* [x] **Update**
```sql
UPDATE exTable 
SET email = 'alice_new@example.com' 
WHERE username = 'alice';
```
* Always specify a scope when updating a table; otherwise, every row may be changed.

---
* [x] **Delete**
```sql
DELETE FROM exTable 
WHERE username = 'charlie';
```

---
## PostgreSQL next-step fundamentals (T+1)

> Prerequisite: You should know how to create tables and perform basic CRUD operations.  
> Goal: Write more precise queries, understand data constraints, and get an introduction to joins across multiple tables.

---


### Combine conditions: AND / OR / NOT

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

### Ranges and lists: BETWEEN / IN

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

### Check for null values: IS NULL / IS NOT NULL

```sql
-- Find users with no age (note: do not use = NULL)
SELECT * FROM users
WHERE age IS NULL;

-- Find users who have entered their age
SELECT * FROM users
WHERE age IS NOT NULL;
```

> NULL is not the same as an empty string `''` or `0`; it represents an "unknown value" and must be checked with IS NULL.

---

### Aggregate functions: summarize a set of values

| Function | Purpose |
|:---:|:---:|
| `COUNT()` | Count |
| `SUM()` | Sum |
| `AVG()` | Average |
| `MAX()` | Maximum |
| `MIN()` | Minimum |

```sql
-- Number of users
SELECT COUNT(*) FROM users;

-- Average user age
SELECT AVG(age) FROM users;

-- Maximum and minimum user ages
SELECT MAX(age), MIN(age) FROM users;

-- Note: COUNT(*) counts all rows; COUNT(age) skips NULL values
SELECT COUNT(*), COUNT(age) FROM users;
```

---

### GROUP BY: aggregate by group

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

Example output:

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

### Query execution order (important!)

Many SQL errors beginners encounter come from misunderstanding the execution order:

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


### Give columns and tables aliases with AS

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

### Exercises

Use the following two tables to complete these exercises:

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

1. Query every username and their total order amount, sorted by total amount in descending order
2. Find users whose total spending exceeds 100
3. Query all users, including those without orders (hint: LEFT JOIN)
4. Count how many times each product was sold

---

### Chapter outline

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
├── Query execution order
│   └── FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER BY→LIMIT
└── Joins across tables
    ├── Foreign keys REFERENCES
    ├── INNER JOIN
    ├── LEFT JOIN
    └── Column/table aliases with AS
```


---
## Use PostgreSQL with Python
### 1. Install the dependency
* To work with a database from Python, first install the `psycopg2` package.
```powershell
pip install psycopg2-binary
```

### 2. Run SQL from Python
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

Parameter descriptions:

| Parameter | Description |
|------|------|
| dbname | Database name |
| user | PostgreSQL username |
| password | User password |
| host | Database server address (usually localhost for a local server) |
| port | PostgreSQL’s default port is 5432 |

After connecting, `conn` represents a database connection object.

---

### 3. Create a cursor

In Python, SQL statements are not executed directly by the connection object. They are executed through a **Cursor**.

```python
cur = conn.cursor()
```
Where:
- Connection is responsible for connecting to the database
- Cursor is responsible for executing SQL

You can think of a cursor as:

> An "operation window" between Python and the database.
> Use `cur.execute("SQL statement")` to run an operation

All subsequent SQL statements are executed through the cursor. A Connection can create multiple cursors.

---

### 4. Insert data (INSERT)

For example, suppose we have the following table:

```sql
CREATE TABLE exTable (
    id SERIAL PRIMARY KEY,
    username TEXT,
    email TEXT
);
```

For inserts, parameterized queries are recommended:

```python
cur.execute("SQL statement for inserting data", parameters)
```

psycopg2 automatically handles:

- Parameter escaping
- Type conversion
- SQL injection prevention

This makes the query safer.

* For example:
```python
cur.execute(
    """
    INSERT INTO exTable (username, email)
    VALUES (%s, %s)
    """,
    ("david", "david@example.com")
)
```


There are two arguments here:

```python
"""
INSERT INTO exTable (username, email)
VALUES (%s, %s)
"""
```
This is the SQL template.


```python
("david", "david@example.com")
```
This is the data to insert.

psycopg2 automatically replaces

```
%s
```

with the actual data.

The query sent to PostgreSQL is effectively similar to:

```sql
INSERT INTO exTable(username,email)
VALUES('david','david@example.com');
```
However, the driver performs the substitution, which makes the query safer.

---

### 5. SQL injection (SQL Injection)
```python
Assume the data to be inserted comes from user input or a script
For example:  
username = input("username：")  
email = input("Email: ")
```

The code to run is:
```python
sql = f"""
INSERT INTO exTable(username,email)
VALUES('{username}','{email}')
"""

cur.execute(sql)
```

> Suppose the user enters
```
David 
```
The generated SQL
```sql
INSERT INTO exTable(username,email)
VALUES('David','xxx@example.com');
```
This is fine.

> But if someone deliberately enters
```python
David'); DROP TABLE exTable; --
```
The generated SQL then becomes
```sql
INSERT INTO exTable(username,email)
VALUES('David');
DROP TABLE exTable;
--','xxx@example.com');
```
If the database allows multiple SQL statements, the second statement
```sql
DROP TABLE exTable;
```
will actually delete the exTable table.  
This is the well-known SQL injection vulnerability.


---

### 6. Commit transactions and close the connection

PostgreSQL uses transactions by default.

After INSERT, UPDATE, or DELETE, changes are not written to the database immediately.

You must run:

```python
conn.commit()
```

Otherwise:

```python
cur.execute(...)
```
Even if the operation succeeds, the data will not be saved after the program closes.


> Release database resources when you are done with them:

```python
cur.close()
conn.close()
```

The complete flow is:

```python
conn.commit()

cur.close()
conn.close()
```

This prevents connections from occupying database resources indefinitely.

---

### Complete example

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

### 7. Query, update (insert), and delete
#### Query data (SELECT)
Use `execute()` to query the database as well.
For example, to query all users:

```python
cur.execute("SELECT * FROM exTable")
```

Retrieve query results with the `fetch` family of functions.

* fetchone()  
Returns the first result.

```python
row = cur.fetchone()

print(row)
```

Output:

```
(1, 'david', 'david@example.com')
```

* fetchall()  
Returns all results.

```python
rows = cur.fetchall()

for row in rows:
    print(row)
```

Example output:

```
(1, 'david', 'david@example.com')
(2, 'alice', 'alice@example.com')
(3, 'tom', 'tom@example.com')
```

* fetchmany()  
Reads a specified number of rows at a time.

```python
rows = cur.fetchmany(5)
```

Useful for paginating through large result sets.

---

#### Update data (UPDATE)

Modify existing records:

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

#### Delete data (DELETE)

Delete records:

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

Note:

When there is only one parameter, write it like this:

```python
("david",)
```

Not like this:

```python
("david")
```

The latter is just a string, not a tuple.

---

### 8. Use a context manager (recommended)

Python recommends using `with` to manage resources automatically.

For example:

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

This automatically closes the Cursor and Connection, even if an exception occurs.  
The code is safer and more Pythonic.

---

### 9. Summary

The basic workflow for using psycopg2 with PostgreSQL is:

1. Import psycopg2
2. Connect to the database (`connect`)
3. Create a Cursor (`cursor`)
4. Execute SQL (`execute`)
5. Fetch results (`fetch`)
6. Commit the transaction (`commit`)
7. Close the Cursor and Connection (`close`)

The whole process can be summarized as:

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

## More advanced SQL
### Prepare sample data
* Create a student table

```sql
CREATE TABLE student (
    sid SERIAL PRIMARY KEY,
    name VARCHAR(20),
    gender VARCHAR(10)
);
```

Insert data:

```sql
INSERT INTO student(name, gender) VALUES
('Zhang San', 'Male'),
('Li Si', 'Male'),
('Wang Wu', 'Female');
```


* Create a course table

```sql
CREATE TABLE course (
    cid SERIAL PRIMARY KEY,
    cname VARCHAR(30)
);
```

Insert data:

```sql
INSERT INTO course(cname) VALUES
('Python'),
('Database'),
('Artificial Intelligence');
```

* Create a score table

```sql
CREATE TABLE score (
    sid INTEGER,
    cid INTEGER,
    score INTEGER
);
```

Insert data:

```sql
INSERT INTO score VALUES
(1,1,90),
(1,2,85),
(2,2,95),
(2,3,88),
(3,1,76);
```

### Join tables and query across them
In real databases, information is usually split across tables by data type instead of being stored in one table.

For example:

- Student information is stored in the **student** table.
- Course information is stored in the **course** table.
- Score information is stored in the **score** table.

How can the database tell:

* that a score of 90 is Zhang San’s score in Python?

The answer:  
these tables are linked through **shared fields**.

For example:

student

```text
sid
```

and

score

```text
sid
```

refer to the same student.

course

```text
cid
```

and

score

```text
cid
```

refer to the same course.

This method of linking tables through shared fields is called a **relation**.


#### Foreign keys: links between tables

> A foreign key constrains the relationship between two tables and prevents "orphaned data".

```sql
-- Rebuild the score table (drop it first if it already exists)
DROP TABLE IF EXISTS score;

-- The sid and cid columns in score reference the student and course tables respectively
CREATE TABLE score (
    sid INT REFERENCES student(sid),
    cid INT REFERENCES course(cid),
    score INT
);
```
Here, both `sid` and `cid` are **foreign keys**.

- `sid` references `sid` in the `student` table.
- `cid` references `cid` in the `course` table.

Foreign keys **link tables and ensure data consistency**.  
For example, if there is no student with `sid=100` in the `student` table, the following statement will fail:

```sql
INSERT INTO score VALUES (100, 1, 90);
```

The database reports an error because the foreign key requires `score.sid` to match an existing `sid` in the `student` table.  
Likewise, a score record cannot be inserted if its course ID does not exist in the `course` table.  
Foreign keys therefore prevent references to nonexistent data and keep data consistent across tables.

---

#### JOIN: an introduction to multi-table queries

> Foreign keys define relationships between tables, while **JOIN** uses those relationships to combine data from multiple tables in a query.

For example:

- The `student` table stores student information;
- The `course` table stores course information;
- The `score` table stores score information.

To query a student’s name, course name, and score, use **JOIN** because this information is stored in different tables.

This section introduces the most common join: **INNER JOIN**.

---

* INNER JOIN

**INNER JOIN** returns only rows that match successfully in both tables.

Basic syntax:

```sql
SELECT column_list
FROM table1
INNER JOIN table2
ON table1.column = table2.column;
```

Where:

- `INNER JOIN`: joins another table.
- `ON`: specifies the join condition between the tables.

---

* Join two tables

Query each student’s name and score:

```sql
SELECT
    student.name,
    score.score
FROM student
INNER JOIN score
ON student.sid = score.sid;
```

Result:

| name | score |
|------|------:|
| Zhang San | 90 |
| Zhang San | 85 |
| Li Si | 95 |
| Li Si | 88 |
| Wang Wu | 76 |

Analysis:

- The `student` table stores student names.
- The `score` table stores student scores.
- The tables are joined through the shared `sid` field.
- The result contains data from both tables.

---

* Join three tables

To also query course names, join the `course` table as well.

For example, query each student’s name, course name, and score:

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

Result:

| Name | Course | Score |
|------|--------|------:|
| Zhang San | Python | 90 |
| Zhang San | Database | 85 |
| Li Si | Database | 95 |
| Li Si | Artificial Intelligence | 88 |
| Wang Wu | Python | 76 |

Analysis:

The query can be broken down into two steps:

Step 1:

```text
score
   │
JOIN
   │
student
```

Use `sid` to find the student name.

Step 2:

```text
(student + score)
        │
      JOIN
        │
      course
```

Use `cid` to find the course name.

A single SQL query can retrieve information from all three tables.  
Thus, **INNER JOIN** uses relationships among multiple tables  
to combine information from different tables in one result, making it one of the most common ways to query across tables in SQL.

---

### Subqueries

> Sometimes an SQL query needs the result of another query before it can continue.  
This technique of **nesting one SQL statement inside another** is called a **subquery** or **nested query**.  
A subquery is usually placed in parentheses `()`. The database **runs the subquery first, then the outer query**.

Basic form:
```sql
SELECT ...
FROM ...
WHERE column = (
    SELECT ...
);
```


#### Example 1: Find the highest score and its record

First, query the highest score in the score table:

```sql
SELECT MAX(score)
FROM score;
```

Result:

```
95
```

To retrieve the record with the highest score directly, use the query above as a subquery:

```sql
SELECT *
FROM score
WHERE score = (
    SELECT MAX(score)
    FROM score
);
```

The execution proceeds as follows:

① The subquery runs first:

```sql
SELECT MAX(score)
FROM score;
```

Result:

```
95
```

② The outer query then runs:

```sql
SELECT *
FROM score
WHERE score = 95;
```

This returns the record with the highest score.



#### Example 2: Query scores for the database course

Suppose you know the course name "Database" but not its ID.

First, query the course ID:

```sql
SELECT cid
FROM course
WHERE cname = 'Database';
```

Result:

```
2
```

Then query the scores:

```sql
SELECT *
FROM score
WHERE cid = (
    SELECT cid
    FROM course
    WHERE cname = 'Database'
);
```

This way, you do not need to enter the course ID manually.


#### Example 3: Use an IN subquery

A subquery may sometimes return multiple rows; use `IN` in that case.

For example: query the IDs of all students taking Python.

```sql
SELECT sid
FROM score
WHERE cid IN (
    SELECT cid
    FROM course
    WHERE cname = 'Python'
);
```

`IN` means:

> Check whether a value exists in the set returned by a subquery.

If a subquery returns multiple results, `=` cannot be used; use `IN` instead.

---

#### Subqueries versus regular queries

Regular query:

```sql
SELECT *
FROM score
WHERE cid = 2;
```

You need to know the course ID in advance.

Subquery:

```sql
SELECT *
FROM score
WHERE cid = (
    SELECT cid
    FROM course
    WHERE cname = 'Database'
);
```

You do not need to know the course ID; the database finds it automatically.  
Subqueries make SQL more flexible and queries more convenient.

Characteristics:

- Subqueries are usually placed inside `()`.
- The database runs the subquery before the outer query.
- Use `=` when the subquery returns a single result.
- Use `IN` when the subquery returns multiple results.

Subqueries are often used to look up a condition first, then continue the query based on that result.
