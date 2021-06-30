# InnoDB 

## 查询慢日志

```mysql
select * from mysql.slow_log;// 保存的是没有使用索引的查询SQL
```

| start_time                 | user_host                | query_time      | lock_time | rows_sent | rows_examined | db     | last_insert_id | insert_id | server_id  | sql_text                                                     | thread_id |
| :------------------------- | ------------------------ | --------------- | --------- | --------- | ------------- | ------ | -------------- | --------- | ---------- | ------------------------------------------------------------ | --------- |
| 2011-06-30 15:30:03.124061 | root[root] @ [localhost] | 00:00:03.655591 | 0:00:00   | 0         | 1206380       | mytest | 0              | 0         | 3324552157 | SELECT   gc.party_id ,'GC'   , gc.goods_combination_id    , gc.combination_code                                                       , gc.status , gc.combination_name, GROUP_CONCAT(IF(gcd.item_type = 'GOODS_GROUP',concat(c.sku_id,'*',c.number*gcd.num),concat(gcd.item_id,'*',gcd.num)))    as sku_details   , gc.create_time  FROM    goods_combination gc    INNER JOIN goods_combination_detail gcd on gc.goods_combination_id = gcd.goods_combination_id and gcd.item_type in('GOODS_GROUP','GOODS')    inner join oms.party p on p.party_id=gc.party_id    inner join oms_biz_system bs on bs.biz_system=p.biz_system    LEFT JOIN goods_group_detail c on gcd.item_type  = 'GOODS_GROUP' AND gcd.item_id = c.goods_group_id AND c.`status` = 'NORMAL'    LEFT JOIN sku s on gcd.item_type = 'GOODS' AND s.sku_id =gcd.item_id AND s.`status` = 'NORMAL'  where gc.party_id = 2001454      group by gc.party_id , gc.combination_code | 15480304  |



## binlog

记录MYSQL数据库执行更改的所有操作。

主要有以下几种作用

- **恢复**。某些数据的恢复需要二进制日志，例如，在一个数据库全备文件恢复后，用户可以通过二进制日志进行`point-in-time`的恢复
- **复制**。slaver库从master复制数据。
- **审计**。可以对数据库中的信息来进行审计，判断是否有对数据库进行注入的攻击。

## InnoDB的重要特征

### 插入缓存

- Insert Buffer

  对于非主键索引的插入和更新操作，不是每一次直接插入到索引页中，而是先判断插入的辅助索引页是否在缓冲池中，若在，则直接插入；若不在，则先放入到一个`Insert Buffer`对象中，好似欺骗。数据库这个非聚集索引已经插入到叶子节点，而实际并没有，而是存放在另外一个位置。然后再以一点的频率和情况进行`Insert Buffer`和辅助索引页子节点的merge操作，这样大大提高了辅助索引插入的性能。

  然而`Insert Buffer`的使用需要满足以下两种条件

  - 索引是辅助索引
  - 索引不是unique索引

- `Change Buffer`可以将其视为`Insert Buffer`的升级。`InnoDB`对索引的`Insert`,`DELETE`,`UPDATE`都进行缓存。

### 两次写（`doublewrite`）

为InnoDB对于数据页的读写提高可靠性。

在对缓冲池中的脏页进行刷新时，并不直接写磁盘，而是会通过memcpy将脏页复制到内存中的`doublewrite buffer`，之后通过`doublewrite buffer`再分两次，每次`1MB`顺序的写入共享表空间的物理磁盘上，然后马上调用调用`fsync`函数，同步磁盘，避免缓冲写带来的问题。

![](https://cdn.clinan.xyz/mysql_doublewrite.png)

### 自适应hash

InnoDB存储引擎会监控对表上各索引页的查询。如果观察到建立Hash索引带来速度提升，则建立Hash索引，称之为自适应Hash索引（Adaptive Hash Index, AHI）。AHI是通过缓冲池的B+树页构造而来的。索引建立的速度很快，并不需要对整张表构建Hash索引。InnoDB存储引擎会自动根据访问的频率和模式来自动为某些**热点数据**页建立Hash索引。

### 异步IO

为了提供磁盘操作性能，当前的数据库系统都采用异步IO（AIO）的方式来处理磁盘操作。InnoDB也是如此。

### 刷新邻接页

当刷新一个脏页时，InnoDB会检测该页所在区（extent）的所有页，如果是脏页，那么一起刷新。这样的好处，可以通过AIO将多个IO写入操作合并为一个IO操作。所以在传统的机械硬盘上有很好的优势。

需要考虑到下面两个问题

- 是不是可能将不怎么脏的页进行了写入，而该页之后又很快变脏？
- 固态硬盘有着较高的IPOS，是否还需要这个特性。

为此，InnoDB存储引擎提供了参数`innodb_flush_neighbors`，用来控制是否启用该特性。对应固态硬盘，建议将此参数设置为0，即关闭此特性。