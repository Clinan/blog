# REDIS



## 字符串拓展

- 自定义的简单动态字符串（sds,  simple dynamic string）

- 以空格结尾，兼容标准C的字符串

- 为了避免对内存的操作，每次扩容都是

- 

- $$
  len*2
  $$

- 如果超过1MB(1024*104)，每次都只增加1MB, 如果插入的数据超过1MB，则增加n MB



## 双向链表



## HASH（字典）

```c
typedef struct dictht{
    // hash表 二维数组
    dictEntry **table;
    // hash表大小
    unsigned long size;
    // hash大小掩码，用于计算索引值
    // 总是等于 size-1 
    unsigned long sizemark;
    
    // 该hash表已有节点数量
    unsigned long used;
    
} dictht;
```

```c
typedef struct dict {
    dictType *type;
    void *privdata;
    dictht ht[2];
    long rehashidx; /* rehashing not in progress if rehashidx == -1 */
    int16_t pauserehash; /* If >0 rehashing is paused (<0 indicates coding error) */
} dict
```

```c
typedef struct dictEntry {
    void *key;
    union {
        void *val;
        uint64_t u64;
        int64_t s64;
        double d;
    } v;
    struct dictEntry *next;
} dictEntry;

```





### 扩容

每次扩容为


$$
2^n 且used*2 < 2^n
$$
*used为已使用的节点数量*





### 解决冲突

链地址法



### 渐进式rehash

rehash动作不是一次完成的，而是分为多次，渐进式的完成。在一次插入千万级别的键值对的时候，避免服务器瘫痪。  

将新插入的数据，都放到`ht[1]`中，然后将`h[0]`数据移动到h[1], 一个一个索引的进行rehash, 每移动完一个节点就会对`dict->rehashidx++`, 

在rehash过程中进行查找，先找`h[0]`，再找`h[1]`。

### 跳跃表

有序的数据结构，用作sortset的实现。时间复杂度，平均O(logN),最坏O(N)

**分值**，即排序的顺序。



## 整数集合的实现



## 压缩列表

当一个列表键只包含少量列表项，并且每个列表项要么就是小整数集值，要么就是长度较短的字符串，那么Redis就会使用压缩列表来做列表键的底层实现。

例如

```
RPUSH 1st 1 3 5 10086 "hello" "world"
```



## quicklist

一个由**ziplist组成的双向链表**。

## 对象

包含了上面介绍的字符串对象，列表对象，哈希对象，集合对象，有序集合对象。

| 常量类型     | 对象的名称   |
| ------------ | ------------ |
| REDIS_STRING | 字符串对象   |
| REDIS_LIST   | 列表对象     |
| REDIS_HASH   | 哈希对象     |
| REDIS_SET    | 集合对象     |
| REDIS_ZSET   | 有序集合对象 |



## 数据库

每个服务器默认16个数据库

### 数据库键空间

```c
typedef struct redisDb{
    dict *dict; // 数据库键空间，保存着数据库中所有的键值对
    dict *expires;/* Timeout of keys with a timeout set */
} redisDb;
```

### 设置键的生存时间或过期时间

- `set <key> <value> EX <5，单位为second>`
- `expire <key> <5，单位为second>`
- `ttl <key>`查看键的过期时间还有多少秒

### Redis的过期键删除策略

Redis服务使用的是惰性删除和定期删除两种策略

- 惰性删除（获取时，判断是否过期，如果过期了就删除）
- 定期删除（服务器定期的去删除过期的key）



## RDB持久化

通过记录数据来实现持久化

- `save`命令会堵塞服务器进程，直到RDB文件创建完毕为止，在服务器堵塞期间，服务器不能处理任何命令请求
- `bgsave`通过子进程来创建RDB文件，期间不能执行`save`
- **服务器载入RDB文件期间，会一直处于阻塞状态，直到载入工作完成。**

### 自动间隔保存

- 后台子进程执行
- 可以配置多个save的条件

```
save 900 1 // 900s修改了1次数据库，触发save,注意是这两个条件都满足
save 300 10 // 300s修改了10次数据库，触发save
save 60 10000
// 以上3个条件满足任意一个都会执行bgsave
```

- 

## AOF持久化

通过保持Redis服务器所执行的写命令来记录数据库状态

AOF持久化功能的实现分为命令追加（append）、文件写入、文件同步（sync）三个步骤



#### AOF重写

由于AOF文件会保存很多冗余的命令，所以体积大，通过重写可以还原当前数据库状态所必须的命令，去掉冗余命令，减小AOF文件大小。

在重写的时候，如果服务器继续执行命令，则这些命令将会被存放在aof_buf中。重写完成后再写入到文件。



## 事件

Redis服务器是一个事件驱动程序

- 文件事件（file event）
  - Redis服务器通过套接字与客户端进行连接，而文件事件就是服务器对套接字操作的抽象，服务器与客户端的通信会产生相应的文件事件，服务器通过监听处理这些事件来完成一系列网络通信操作。
- 时间事件（time event）：Redis服务器的一些操作（比如sererCron函数）需要在给定的时间点执行，而时间事件就是服务器对这类定时操作的抽象。



## 复制

- 设为从库`slaveof host port`，从库为只读模式
- 取消从库`slaveof no one`
- 依靠主从库各自维护偏移量来判断主从是否一致



## sentinel 高可用





## 集群





## 事务

事务的实现

- 开始事务`MULTI`



- 命令入队

  



- 执行事务`EXEC`





### watch命令

- 不能再事务中执行

- watch是一个乐观锁，它可以在`EXEC`命令执行之前，监视任意数量的数据库键，并在`EXEC`命令执行之时，检查被监视的键是否至少还有一个已经被修改过了，如果是的话，服务器将拒绝执行事务。

- watch的是数据是否变脏了。

- 在当前会话每次`EXEC`之后，将会重置当前客户端会话所有的watch



## 内存策略

### 限制内存大小

`config set maxmemory 100MB`

### 回收策略

- `noevication`：返回错误，当内存限制达到并且客户端尝试写入等使用到内存的命令。
- `allkeys-lru`：尝试回收最少使用的键
- `volatile-lru`：尝试回收最少使用的键，仅是过期集合的key
- `allkeys-random`：随机回收key
- `volatile-random`：随机回收key,  这些key仅是过期的key
- `volatile-ttl`：回收过期key的集合，并且优先回收过期时间(TTL)较短的key



## 应用

### 分布式锁

下面的命令是原子性操作，如果key存在则会返回nil，否则返回OK。

并且设置了过期时间，避免死锁

```shell
set lockkey 1 EX 100 NX
```


### 线程模型

才有多路复用IO处理socket请求。每个socket请求进来之后，都会进入到通过多路复用IO进行调度和处理，然后将其放到队列里，等待redis单线程write/read。由于都是内存操作，所以单线程效率也很高。

