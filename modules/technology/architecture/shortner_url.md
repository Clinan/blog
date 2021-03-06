# 短地址生成

## 长地址映射到一个唯一的id

设计一个发号器。生成一个从0开始的id。

比如第一个要转换的网址`https://www.clinan.xyz/homepage`得到得到id=1；第二个则给ID为2。以此类推。

### 可以实现长网站到短网址的一一对应吗

不行，不存在一个算法，可以将长网址转为短网址。短网址逆运算得到长网址。否则的话，压缩算法那该多容易实现呀。

### 如何保证发号器的大并发高可用。

- 发号器集群部署多个。理论如下。

- 那就可以使用多个发号器，比如两个发号器可以一个发单号，一个发双号。单个发号器每次+2。

- 以此类推，一千个发号器，每个发号器发从0-999的一个号，每次+1000。

### 按照上面的方式来，每次生成的ID超过了长度限制

可以将这个64位的ID转换为由`a-z A-Z 0-9`构成的62进制。


$$
62^7=3,521,614,606,208≈35000亿
$$

对于一个长达35000亿长度的ID来说，转为62进制最多只需要7个字符。所以是够用的。

### 如何保证同一个长网址每次转出来都是同一个短网址

做缓存。如果缓存中有，则返回已有的，否则重新生成。具体看下面



## 如何实现短网址到长网址的映射/ 长到短的映射

使用`key-value`的缓存来存储。保存最近生成的长对短的一个对应关系。也就是说不是保存全量的映射关系，而只是保存最近的。比如采用一小时过期的机制，使用LRU淘汰策略。

这样的话，长转短的流程变成这样： 1 在这个“最近”表中查看一下，看长地址有没有对应的短地址 1.1 有就直接返回，并且将这个key-value对的过期时间再延长成一小时 1.2 如果没有，就通过发号器生成一个短地址，并且将这个“最近”表中，过期时间为1小时

所以当一个地址被频繁使用，那么它会一直在这个key-value表中，总能返回当初生成那个短地址，不会出现重复的问题。如果它使用并不频繁，那么长对短的key会过期，LRU机制自动就会淘汰掉它。

当然，这不能保证100%的同一个长地址一定能转出同一个短地址，比如你拿一个生僻的url，每间隔1小时来转一次，你会得到不同的短地址。但是这真的有关系吗？

## 跳转用301还是302

浏览器缓存机制的理解。然后是考察他的业务经验。301是永久重定向，302是临时重定向。短地址一经生成就不会变化，所以用301是符合http语义的。同时对服务器压力也会有一定减少。 但是如果使用了301，我们就无法统计到短地址被点击的次数了。而这个点击次数是一个非常有意思的大数据分析数据源。能够分析出的东西非常非常多。所以选择302虽然会增加服务器压力，但是我想是一个更好的选择。







