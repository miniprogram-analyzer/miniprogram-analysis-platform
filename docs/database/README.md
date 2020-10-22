# 数据库 MySQL

本项目采用 MySQL 进行数据存储，可通过 [sql][./sql] 内文件快速初始化。

## 文件结构

```md
sql
└── tables.sql // 建表 sql 语句
```

## 使用

- 安装 MySQL 数据库
- 建立对应数据库，如 debugs

  ```mysql
  mysql> create database debugs;
  ```

- 建表

  ```bash
  $ mysql -u user -p debugs<sql/tables.sql
  ```
