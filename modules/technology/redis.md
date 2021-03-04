# REDIS



## 字符串拓展

- 自定义的简单动态字符串（sds,  simple dynamic string）

- 以空格结尾，兼容标准C的字符串

- 为了避免对内存的操作，每次扩容都是

- $$
  len*2
  $$

- 如果超过1MB(1024*104)，每次都只增加1MB, 如果插入的数据超过1MB，则增加n MB



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
used*2 < 2^n
$$
*used为已使用的节点数量*





### 解决冲突

链地址法



### 渐进式rehash

rehash动作不是一次完成的，而是分为多次，渐进式的完成。在一次插入千万级别的键值对的时候，避免服务器瘫痪。  

将新插入的数据，都放到`ht[1]`中，然后将`h[0]`数据移动到h[1], 一个一个索引的进行rehash, 每移动完一个节点就会对`dict->rehashidx++`, 

在rehash过程中进行查找，先找`h[0]`，再找`h[1]`。

