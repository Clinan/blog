

## 分层

1. 应用层：处理特定的应用程序细节
2. 传输层：为两台主机上的应用程序提供端到端的通讯
3. 网络层：处理分组在网络中的活动，例如分组选路
4. 链路层：处理与电缆（或其他让任何传输媒介）的物理接口细节

| OSI    | TCP/IP | 对应概念                                |
| ------ | ------ | --------------------------------------- |
| 应用层 | 应用层 | HTTP,FTP,SMTP                           |
| 表示层 | 应用层 | telnet, Gopher                          |
| 会话层 | 应用层 | SMTP,DNS                                |
| 传输层 | 传输层 | TCP, UDP                                |
| 网络层 | 网络层 | IP, ARP,RARP,ICMP                       |
| 链路层 | 链路层 | FDDI, Ethernet, Arpanet, PDN, SLIP, PPP |
| 物理层 | 链路层 | IEEE 802.1A, IEEE 802.2到IEEE 802.11    |

- ICMP 协议
- ping是一个应用程序，调用了ICMP协议

![](https://cdn.clinan.xyz/net.png)



![](https://cdn.clinan.xyz/fenceng.png)

## 可靠的TCP 不可靠的UDP 不可靠的IP

1. 可靠的TCP通过不可靠的IP传输数据
2. 不可靠的UDP通过不可靠的IP传输数据



## 单工 半双工 全双工

- 单工，传输和接收要建立两个连接会话，且是不同的端口号
- 半双工，传输和接收只需要建立一个会话（长连接），但是不能同时发送和接收。
  - **http1.1**：建立长连接，多路复用，可先后发送多个http请求，不用等待回复，但是回复按顺序一个一个回复
- 全双工，传输和接收只需要建立一个会话，能同时发送和接收
  - **http2.0**： 一个消息发送后不用等待接受,第二个消息可以直接发送
  - socket：不可靠

## 封装

![](https://cdn.clinan.xyz/data-packet.png)
![](https://cdn.clinan.xyz/demultiplexing.png)


- 以太网数据帧的物理特性是其长度必须在46~1500字节之间
- 以太网的帧首部也有一个16bit的帧类型域（IP,ARP,RARP）
- IP在首部中存入一个长度为8bit的数值，称为协议域（ICMP,IGMP,TCP,UDP,ESP,GRE）
- TCP和UDP都用一个16bit的端口号表示不同的应用程序（FTP,telnet,http）（所以端口的范围是0~2^16-1，其中1~1023是保留端口号）


## 以太网

![](https://cdn.clinan.xyz/ethernet.png)

## 环回接口

127.0.0.1环回地址

![](https://cdn.clinan.xyz/loopback.png)




## MTU 最大传输单元





## IP

![](https://cdn.clinan.xyz/IP-protocol.png)

- 版本号 4bit
- 首部长度4bit, 最大值为15，每增加1，则首部长度增加4bit, 所以IPv4最多支持15*4=60bit的头部长度


## ARP

![](https://cdn.clinan.xyz/ARP.png)

- 路由表





## TCP

![](D:\dev-js\blog\.vuepress\public\technology\tcp.png)

- 32位序号，SYN,FIN都会消耗序号，ACK不占用序号，因为ACK也是首部的一部分，一旦一个连接建立，ACK总是被设置为1
- 

### 概念

- TCP提供一直面向连接的，可靠的字节流服务
- 在一个TCP连接中，仅有两方进行彼此通信。
- 能够提供流量控制（窗口大小）
- 一个IP和一个端口好也称为插口（socket），后来它也表示伯克利版的编程接口。
- 若确认号=N，则表明：到序号N-1为止的所有数据都已正确收到
- 接收机器缓存有限，窗口字段明确指出了现在允许对方发生的数据量，窗口值是经常在动态变化着
- 检验和，检验和数据检验的范围包括首部和数据这两部分



#### TCP头部

<table style="text-align:center;">
    <tr>
        <th colspan = '32'>TCP头部，最长60字节，当前一行32bit  </th>
    </tr>
    <tr>
        <td colspan = '16'>源（source）端口号0-65535  </td>
        <td colspan = '16'>目标（target）端口号0-65535  </td>
    </tr>
    <tr>
        <td colspan = '32'>序列号(Sequence Number)</td>
    </tr>
    <tr>
        <td colspan = '32'>ACK(acknowlegde) sequence number确认序列号</td>
    </tr>
    <tr>
        <td colspan = '4'>头部长度4bit</td>
        <td colspan = '4'>4bit保留</td>
        <td colspan = '1'>CWR</td>
        <td colspan = '1'>ECE</td>
        <td colspan = '1'>URG</td>
        <td colspan = '1'>ACK</td>
        <td colspan = '1'>PSH</td>
        <td colspan = '1'>RST</td>
        <td colspan = '1'>SYN</td>
        <td colspan = '1'>FIN</td>
        <td colspan = '16'>窗口大小 16bit，可以通过选项加大</td>
    </tr>
    <tr>
        <td colspan = '16'>校验和 </td>
        <td colspan = '16'>紧急指针 </td>
    </tr>
    <tr>
        <td colspan = '32'>选项</td>
    </tr>
</table>
##### 选项

MSS（maximum segment size）：最大报文段

SACK: 选择ACK

Scale_Window(SW)：窗口缩放支持

### TCP连接与关闭

#### 连接 三次握手

```sequence
Client->Server: SYN,Seq=ISN(c)
Server->Client: SYN+ACK,Seq=ISN(s),ACK=ISN(c)+1
Client->Server: ACK,Seq=ISN(c)+1, ACK=ISN(s)
note over Client, Server: ESTABLISHED，连通状态


```



#### 关闭 四次握手

```sequence
Note over Client,Server: ESTABLISHED，连通状态
Client->Server: FIN,ACK, Seq=K,ACK=L
note over Client: FIN_WAIT_1
note over Server: ESTABLISHED
Server->Client: ACK,Seq=L,ACK=K+1
Note over Server: CLOSE_WAIT
note over Client: FIN_WAIT_2
Server->Client: FIN,ACK,Seq=L,ACK=K+1
Note over Server: LAST_ACK
Client->Server: ACK,Seq=K+1,ACK=L+1
Note over Client:  TIME_WAIT，并开始一个2MSL的计时器
Note over Client,Server:  CLOSED

```

一些说明

- `FIN_WAIT_1`，`FIN_WAIT_2`，`TIME_WAIT`也被称为主动关闭。表示当本地应用程序发起一个关闭请求时会进入的状态集合。
- `CLOSE_WAIT`，`LAST_ACK`被称为被动关闭。这些状态与等待一个FIN报文段并进行关闭相关。



#### 半关闭

当客户端发送了FIN之后，处于FIN_WAIT_1，FIN_WAIT_2的状态都是半关闭状态。

#### TIME_WAIT

TIME_WAIT是客户端发完确认关闭ACK之后，为避免还停留在网络中的数据段的影响，等待两倍的最大段生存时间（maximum segment Lifetime，MSL）。

在Linux下可以通过`cat /etc/sysctl.conf`，查看`net.ipv4.tcp_fin_timeout` 默认是60，单位为秒

**为什么是两倍的段最大生存时间（2MSL）？**

因为被关闭方可能会超时重传FIN，直到收到最终ACK。但是下一刻就收到主动关闭方的ACK，从发出`LastACK`的发出到接收到重传的FIN。客户端最多可以经历2MSL的时间。

```sequence
note over Client,Server: 为什么是2MSL
Server->Client:FIN+ACK,Seq=K,ACK=L
note over Server: 等待确认关闭的ACK
Client-->>Server: ACK,Seq=L,ACK=K+1(server没有收到，或者至少在超时之前没收到)
note over Client: 发出后，经历了MSL时间，Server就开始重传
note over Server: 超时重传FIN,直到收到LastACK
note over Client: 又经历了MSL时间，收到Server的重传
Server->Client: FIN+ACK,Seq=K,ACK=L(超时后再发送)
note over Client: 再次发送一个LastACK，再次开始计时，直到2MSL，如果没有再接收到Server的重传FIN
note over Client,Server: 在发出LastACK之后，到至少Server的重传FIN到达client，至少是2MSL
```



 **重点**

另外一个影响2MSL的因素是当TCP处于**`TIME_WAIT`**状态时，通信双方将该连接（client ip+port, server ip+port）标志为不可重新使用。只有2MSL结束之后，

在TCP头部中，是没有记录IP的，所以在主动关闭方来说，目标端口固定的情况下，自身随机端口，是有可能用完的65535个端口的。



例外的：

- 序列号大于最大的序列号
- 

解决方案：调整MSL的时间为30s，可以尽快释放一些元组

- [ ] TODO 



#### CLOSE_WAIT

如果使用HttpClient不关闭`InputStream`，也会导致占用，而且情况比TIME_WAIT更严重，因为它不会释放



#### 静默时间

一般操作系统都不会再实现了



#### 重置报文段

##### 对不存在的端口进行连接请求

服务器会返回`ACK+RST, ACK=ISN(c)+1,Seq=0`的消息。这个过程会有重试

```sequence
Client->Server: SYN, Seq=ISN(c)
Server->Client: ACK+RST,Seq=0,ACK=ISN(c)+1
note right of Client: 这个过程会被重试几次
```



##### 终止一条连接

正常客户端发送`FIN`是一个正常的关闭连接的方法。也被成为**有序释放**

此外，也可以通过发送重置报文替代FIN来替代FIN终止一条连接，也被成为**终止释放**



### 超时与重传

- 每次重传间隔时间加倍称为 **二进制指数退避**

- TCP拥有两个阈值来决定如何重传同一个报文段。
  - R1表示TCP向IP层传递“消极建议”前，愿意尝试重传的次数
  - R2（大于R1）指示TCP放弃当前连接的时机。
  - R1和R2应分别设为3次重传和100秒
  - Linux中R1=`net.ipv4.tcp_retries1`默认值为3次，R2=`net.ipv4.tcp_retries2`默认值为15次，约为13~30分钟
  - 对于SYN报文
    - `net.ipv4.tcp_syn_retries`和`net.ipv4.tcp_synack_retries`限定重传次数，默认值为5，约180s





#### 设置重传超时时间RTO

通过对RTT测量采样计算RTO。

这部分太难了，一般都不会问。



#### 基于的计时器的重传

在重传第一次后，没有收到确认，需要等待更久的时间在发送第二次重传，称为**退避值**

当一报文出现多次重传时，RTO值（暂时地）乘上γ来形成新的退避值
$$
RTO=γRTO
$$
通常情况下，`γ`=1，虽则多次重传，`γ`加倍指数增长。通常情况下不能超过最大退避因子。（Linux确保RTO设置不能超过`TCP_RTO_MAX`，默认值为120s），一旦收到对于的ACK，`γ`重置为1

#### 快速重传

基于接收端的反馈信息来引发重传，而非重传计时器的超时。

具体描述如下：

TCP发送端在观测到至少`dupthresh`(成为重复ACK阈值)个重复ACK后，就重传可能丢失的数据，而不必等到重传计时器超时。

可以使用SACK进行快速重传

#### 带选择确认的重传SACK

- **SACK和普通的ACK有时会丢失，并且其中不包含数据（SYN或FIN也不被置位）就不会被重传。**

##### 数据接收端行为

接收端在TCP连接建立期间，收到`SACK`许可选项即可生成`SACK`。通常来说，当缓存中存在失序数据时，接收端就可生成`SACK`.

第一个`SACK`块内包含的是最近接收到的报文段的序列号范围。其余`SACK`块包含的内容也按照接收的先后依次排序。

最新的要发送的块，除了包含数据内容外，还会有最新的SACK的块，也**重复**之前的`SACK`块。所以一个`SACK`选项会包含多个`SACK`块。**目的是为防止`SACK`丢失提供一些备份**（因为上面说了SACK和ACK不会重传，丢了就丢了）

##### 数据发送端行为

当数据发送端执行重传时，通常是由于其收到了`SACK`或重复`ACK`，它可以选择重新发送新数据或重传旧数据。`SACK`提供的接收端序列号范围，因此发送端可根据此推断需要重传的空缺数据。

由于快速重传机制，所以需要观测`dupthresh`个`SACK`之后，才会进行重传

### 数据流

#### 延时确认

延时ACK针对的是接收端

TCP并不对每个到来的数据包都返回ACK，利用TCP的累积ACK字段就能实现该功能。累积确认可以允许延迟一段时间发送ACK，以便将ACK和向相同方向上需要传的数据结合发送。这种传输方式经常用于批量数据传输。

作用：会减少ACK传输条目，可以一定程度减轻网络负载。

对于批量数据传输通常为2：1的比例。`Linux`使用一种动态调节算法，可以在每个报文段返回一个ACK与传统延时ACK模式间相互切换。

> 有论文指出，TCP实现ACK延迟的时延应小于500ms。实践中时延最大取**200ms**

#### Nagle算法（俗称粘包）

Nagle算法针对数据发送端。

当一个TCP连接中有在传数据（即那些已发送但还未经确认的数据），小的报文段（长度小于SMSS, Sender maximum segment size, 发送方最大段大小）就不能被发送，直到所有的在传的数据都收到ACK。**并且在收到ACK后，TCP需要收集这些小数据，将其整合到一个报文段中发送。**

在Nagle算法超时后，也会直接发送小的数据包

作用：可以减少发送方包的数目，疯狂发送小的数据包。同时也会减少接收方的ACK。

缺点：增大了传输时延。会导致传输不及时。

#### 延时ACK+Nagle算法的结合使用

会导致逻辑意义上的死锁，但是延时ACK和`Nagle`算法都实现了超时机制。不会发生真正的死锁。

但是会导致网络有了更大的延迟。

### 窗口滑动



### 流量控制



### 拥塞控制

### 

### delayed-ACK





## HTTP

### Header

#### Connection: keep-alive 

复用TCP连接，使用客户端到服务器的连接持续有效。当客户端对服务器有后续请求时，Keep-alive能够避免重建连接。









