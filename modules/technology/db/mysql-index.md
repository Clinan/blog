# MYSQL 索引

## 主键索引（聚集索引）





## 辅助索引

辅助索引的叶子节点并不包含记录的全部数据。叶子节点除了包含键值以外，每个叶子节点中的索引行中还包含了一个书签（`bookmark`），也就是主键。该书签用来找到索引对应的行数据。



## 联合索引



## 全文索引



## hash索引

## 索引的一些运用

### 联合索引



![](https://cdn.clinan.xyz/mulit-index.png)



### 覆盖索引

`explain select count(1) from aaa` 之后，如果aaa有辅助索引，则不会使用主键索引去count()数据。因为主键索引里面数据，会导致更多的IO。extra里面使用了using index。

### MRR

使用辅助索引查询到主键之后，对主键进行排序，再进行主表查询。可以最大程度的避免磁盘的随机访问。

### ICP

提前过滤数据。避免更多的数据到达SQL层。

## B+树

Innodb按页存储数据，一页是默认是16KB，一个指针6个字节，一个ID最长为bigint，为8个字节。
$$
16KB/14byte=1170
$$
所以一页可以保存1170个ID和指针的符合结构。

- 因此一颗2层高的B+树可以保存

$$
16*1170=18720
$$

- 3层高的B+树可以保存
  $$
  16*1170*1170=21902400
  $$
  

