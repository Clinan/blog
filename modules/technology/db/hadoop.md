# HADOOP

一个分布式项目 



## 文件系统HDFS

###  数据块

不能太小，因为namenode会存储每个块的元数据。增加namenode开销

不能太大，太大会使得网络传输时间太长。





### namenode

namenode是一个文件系统的管理者，管理所有的文件引用，它维护着文件系统树及整棵树内所有的文件和目录。一个分布式文件系统集群有可以由一个namenode和多个datanode组成.

在内存中保存文件系统中每一个文件和每一个数据块的引用关系，对于一个拥有大量文件的的超大集群来说，内存是限制横向拓展的瓶颈。

### datanode

datanode是文件系统的工作节点。它们根据需要存储并检索数据库（受客户端或namenode调度），并定期向namenode发送它们所存储的块的列表。



### 命令行接口

`hadoop fs -help`，相关命令和Linux基本一样。

`hadoop fs -ls`



### Hadoop文件系统

列举了Hadoop支持了那些文件系统，如：

- HDFS
- Local
- HFTP
- HSFTP
- HAR
- hfs
- FTP
- S3
- View挂载的客户端列表

### JAVA接口

可以通过JAVA来**增删改查**HDFS文件系统

## YARN

A framework for job scheduling and cluster resource management.（作业调度和集群资源管理的框架。）

YARN通过两类长期运行的守护进程提供自己的核心服务

1. 管理集群上资源使用的资源管理器（resource manager）、

2. 运行在集群中所有节点上且能够启动和监控容器（container）的节点管理器（node manager）。

   容器用于执行特定应用程序的进程，每个容器都有资源限制（内存、CPU等）。一个容器可以是一个Unix进程，也可以是一个Linux cgroup。



### 作业调度器

- FIFO调度器。

- 容量调度器（capacity scheduler），有一个独立的专用队列保证小作业一提交就可以启动，由于队列容量是为那个队列中的作业所保留的，因此这种策略是以整个集群的利用率为代价的。

- 公平调度器（fair scheduler），第一个大作业启动时，它是唯一运行的作业，因而获得集群中所有的资源，这样每个作业都能公平共享资源。注意，从第二个作业的启动到获得公平共享资源之间会有时间滞后，因为它必须等待第一个作业使用的容器用完并释放出资源。当小作业结束且不再申请资源后，大作业将回去再次使用全部的集群资源。最终效果是：既得到了较高的集群利用率，又能保证小作业能及时完成。

  

## Avro

结构数据的序列和反序列化。通用于所有语言。



## Parquet

是一种能够有效存储嵌套数据的列式存储格式

和Hbase相比

1. parquet只是文件存储，不是数据库，**不提供查询**。
2. **比hbase更节省磁盘空间**
3. **数据提取更快**，因为占用的磁盘空间少
4. **通过key查找记录**，Hbase更快。parquet不支持索引
5. **过滤或其他的扫描查询**，parquet存储在行组中的记录的更多信息，因此在扫描数据时可以跳过很多记录。这就是原因，它比HBase更快。
6. **更新数据**，HBase提供更新数据的功能。parquet更新数据需要重写文档。

通过比较上述功能，HBase似乎更适合需要更新且查询主要涉及键值查找的情况。涉及键范围扫描的查询在HBase中也将具有更好的性能。

Parquet适用于更新很少且查询涉及过滤器，联接和聚合的用例。



## Flume

用来向Hadoop批量导入基于事件的海量数据。一个典型的例子是利用Flume从一组Web服务器中收集日志文件，然后把这些文件中的日志事件转移到一个新的HDFS汇总文件中以作进一步处理，其终点（sink）通常为HDFS。也可以将数据转到其他系统中，例如HBase或Solr。

## Sqoop

一个工具，允许用户将数据从**结构化**存储器提取到Hadoop中，用于进一步的处理。抽取出的数据可以被MapReduce程序使用，也可以被其他类似于Hive的工具使用。（甚至可以使用Sqoop将数据从数据库转移到HBase。）一旦生成最终的分析结果，Sqoop便可以将这些结果导回数据存储器，供其他客户端使用。



## Pig

包括两部分

1. 用于描述数据流的语言，成为Pig Latin。由一系列的“操作”（operation）或“变换”（transformation）组成。每个操作或变换对输入进行数据处理，并产生输出结果。
2. 用于运行Pig Latin程序的执行环境。当前有两个环境：单JVM中的本地执行环境和Hadoop集群上的分布式执行环境

## Hive

用`SQL`进行MapReduce，把SQL查询转换为一系列在Hadoop集群上运行的作业。支持JDBC。但是不支持ACID。不支持`update`

优点是：不用编写Java代码，只编写SQL就能查询Hadoop上的数据。

**缺点：**

- 查询速度慢，几分钟到几小时不等。不利于实时数据的查询。默认遍历所有的数据，但是可以通过Hive分区来控制一次遍历的数据量。
- 不支持**更新**操作。Hive必须提供预先定义好的schema将文件和目录映射到列，并且Hive与ACID不兼容。

**应用场景**

Hive适合用来对一段时间内的数据进行分析查询，例如，用来计算趋势或者网站的日志。Hive不应该用来进行实时的查询。因为它需要很长时间才可以返回结果。

