# MySQL中学到的知识
## exists的使用

:::tip
 MySQL中exists除了if exists之外，还有where exists作为判断条件的用法
:::

### 要求
筛选出aa的从表bb，存在2条及两条以上,且b_index不同的记录，且不能合并

### 数据展示
#### aa表
![](https://cdn.clinan.xyz/mysql_learn_1.png)
### bb表
![](https://cdn.clinan.xyz/mysql_learn_2.png)
```sql
select a.id, b.b_index
from aa a
         left join bb b on b.a_id = a.id;
```
![](https://cdn.clinan.xyz/mysql_learn_3.png)

```sql
select count(a.id) as coun, a.id, b.b_index
from aa a
         left join bb b on b.a_id = a.id
group by a.id;
```
![](https://cdn.clinan.xyz/mysql_learn_4.png)

### 法1
```sql
select a.id, b.b_index
from aa a
         left join bb b on a.id = b.a_id
where a.id in (
    select a_id
    from (
             select count(a_id) as cou, a_id
             from bb
             group by a_id
         ) tmp
    where tmp.cou > 1
);
```
![](https://cdn.clinan.xyz/mysql_learn_5.png)



### 法2(where exists)
```sql
select a.id, b.b_index
from aa a
         left join bb b on a.id = b.a_id
where exists(select 1 from bb eb where eb.b_index != b.b_index and eb.a_id = a.id);
```

![](https://cdn.clinan.xyz/mysql_learn_6.png)

:::tip
where exist中只要有返回值，无论是什么内容，返回就会判断这条数据通过where条件，从而保留这条数据。exists返回的结果集是空的话，则不能通过where判断，然后被where过滤掉。
:::

## MySQL between and的边界问题
```sql
select *
from (
         select 1 as value
         union
         select 2 as value
         union
         select 3 as value
     ) a
where a.value between 1 and 3
```
答案是显而易见的
![](https://cdn.clinan.xyz/mysql_learn_7.png)

## 多表联查 逗号联查
:::tip
在读sql的时候看到 `select * from aa a,bb b`,不理解是什么样的数据形式。
:::
**aa,bb表的表数据如上面的截图**
```sql
select a.id, b.id as bid
from aa a,
     bb b
```
![](https://cdn.clinan.xyz/mysql_learn_8.png)

- 查询结果是一个aa,bb的笛卡尔积，即aa x bb 
- aa表的每一条数据都去左连接bb表的所有数据。
- 结果一共有(aa表的条数乘以bb表的条数)条


## MYSQL查询分析

`show profiles;`

`show profile for query 45;`

## 尽量避免使用NULL值
如果查询中包含可为NULL的列，对Mysql来说更难优化，因为可为NULL的列使得索引、索引统计和值比较都更复杂。
可为NULL的列会使用更多的存储空间，在MySql里也需要特殊处理。当可为NULL的列被索引时，每个索引记录需要一个额外的字节。
通常把可为NULL的列改为NOT NULL带来的性能提升比较小。但是如果计划在列上建立索引，就应该尽量避免设计成为可为NULL的列.

## 关于varchar text 等的使用
应该尽量避免磁盘内存表
![](https://cdn.clinan.xyz/mysql_learn_8.png)