# MYSQL事务的隔离级别（ISOLATION）

## MYSQL的级别级别（官方解释和解读）

| 级别             | 脏读(dirty read) | 重复读(Consistent Nonlocking Reads) | 幻读(phantom rows) |
| :--------------- | :--------------- | :---------------------------------- | :----------------- |
| READ UNCOMMITTED | true             | true                                | true               |
| READ COMMITTED   | false            | true                                | true               |
| REPEATABLE READ  | false            | false                               | true               |
| SERIALIZABLE     | false            | false                               | false              |
**注： true和false表示是否会导致该问题。**

[官网地址](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html)
- REPEATABLE READ


This is the default isolation level for InnoDB. Consistent reads within the same transaction read the snapshot established by the first read. This means that if you issue several plain (nonlocking) SELECT statements within the same transaction, these SELECT statements are consistent also with respect to each other.

For locking reads (SELECT with FOR UPDATE or FOR SHARE), UPDATE, and DELETE statements, locking depends on whether the statement uses a unique index with a unique search condition, or a range-type search condition.

* For a unique index with a unique search condition, InnoDB locks only the index record found, not the gap before it.
* For other search conditions, InnoDB locks the index range scanned, using gap locks or next-key locks to block insertions by other sessions into the gaps covered by the range. For information about gap locks and next-key locks, see Section 15.7.1, “InnoDB Locking”.

可重复读是MYSQL默认的事务隔离级别，会在事务中第一次查询的时候，生成一个数据库快照。保证每一次读取同一条数据的时候，都是一致的，不会产生重复读同一条数据会返回不同的结果（因为并发，已读过的数据会被其他事务更新掉）的问题。

在使用悲观锁（FOR UPDATE/SHARE）查询或更新删除时，会根据唯一索引或是where条件来锁定列数据，而不是锁定整个表。可以在锁定的`row`列数据上方或下方插入或删除数据。`gap locks`间隙锁意思是在索引范围锁，如`select * from t where id between 1 and 10 for update`那么在1-10这个索引中间，不能插入数据（如原本id=9的记录不存在，现在要插入id=9的记录，也不行）。

- READ COMMITTED

Each consistent read, even within the same transaction, sets and reads its own fresh snapshot. For information about consistent reads, see Section 15.7.2.3, “Consistent Nonlocking Reads”.

For locking reads (SELECT with FOR UPDATE or FOR SHARE), UPDATE statements, and DELETE statements, InnoDB locks only index records, not the gaps before them, and thus permits the free insertion of new records next to locked records. Gap locking is only used for foreign-key constraint checking and duplicate-key checking.

Because gap locking is disabled, phantom problems may occur, as other sessions can insert new rows into the gaps. 

Only row-based binary logging is supported with the READ COMMITTED isolation level. If you use READ COMMITTED with binlog_format=MIXED, the server automatically uses row-based logging.

`READ COMMIT`意思是会读取到已提交的其他事务，在一个事务中，每一次查询都会刷新快照，查询到的始终都是最新的数据，`Consistent Nonlocking Reads`一致性非锁定读。会出现同样的查询语句，却得到不一样的查询结果（当前事务没有更新操作）。此外`READ COMMIT`会禁用`gap locks`。

在使用悲观锁（FOR UPDATE/SHARE）查询或更新删除时，只会锁定符合条件的列，如果要是`select * from t where id between 1 and 10 for update`（id=9的数据不存在），在这个时候，其他会话是可以插入id=9的数据，两次读取的数据不一致，出现了重复读的问题。


- READ UNCOMMITTED


SELECT statements are performed in a nonlocking fashion, but a possible earlier version of a row might be used. Thus, using this isolation level, such reads are not consistent. This is also called a dirty read. Otherwise, this isolation level works like READ COMMITTED.


`READ UNCOMMITTED`是事务隔离级别最低，以非锁定的方式执行。如：会话A中可以查询到会话B中更新插入删除的数据，如果B回滚了，那么A读取到就是已经被B回滚掉的脏数据，一般都不会使用这个隔离级别。

- SERIALIZABLE


This level is like REPEATABLE READ, but InnoDB implicitly converts all plain SELECT statements to SELECT ... FOR SHARE if autocommit is disabled. If autocommit is enabled, the SELECT is its own transaction. It therefore is known to be read only and can be serialized if performed as a consistent (nonlocking) read and need not block for other transactions. (To force a plain SELECT to block if other transactions have modified the selected rows, disable autocommit.)


`SERIALIZABLE`是事务隔离级别中级别最高的，此级别类似于REPEATABLE READ，但是InnoDB将所有普通SELECT 语句隐式转换为SELECT ... FOR SHARE， autocommit禁用。如果 autocommit启用，则 SELECT是其自身的事务。因此，它被认为是只读的，并且如果以一致的（非锁定）读取方式执行并且不需要阻塞其他事务就可以序列化。（SELECT如果其他事务已修改所选行，则要强制平原 阻止，请禁用 autocommit。）



## 查看MYSQL的事务隔离级别
```sql
select @@tx_isolation; # mysql5.7
select @@transaction_isolation; # mysql8.0+
```

## 设置当前会话的MYSQL的事务隔离级别
```sql
set session transaction isolation level # 后面加上上诉的级别 如
set session transaction isolation REPEATABLE READ;
```

## 总结
数据库事务隔离级别越高，说明涉及到的锁越多，发生死锁的可能性越大，同时锁多了会影响数据库的并发性能，一般来说使用默认的`REPEATABLE READ`是最好的。其次就是`READ COMMITTED`，最高的和最低的，最好都不要设置。