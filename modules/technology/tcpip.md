

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

链路层网络中（例如以太网）中，携带高层协议的大小是有限制的。以太网有效负荷的字节数通常被限制为1500，`PPP`通常也采用相同大小以保持与以太网兼容。链路层的这种性质被称为**最大传输单元`MTU`**



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
##### PSH标志位

在传输大数据的时候，在TCP中会分块传输。如果遇到设置了PSH位的数据段，则将当前数据段中的数据和缓存中的数据都提交给应用层，并清空缓存。而不用继续等待或判断后续是否还有数据传输过来。

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

##### 解决方案

在Linux中调整MSL的时间为30s，Http使用Http1.1，使用`KeepAlive`，TCP采用保活机制。

#### CLOSE_WAIT

如果使用`HttpClient`不关闭`InputStream`，也会导致占用，而且情况比TIME_WAIT更严重，因为它不会释放TCP连接。如果没有配置TCP保活机制，则服务器会一直处于CLOSE_WAIT状态。

##### 解决方案

查看代码，关注`HttpClient`的使用，[相关博客](https://blog.csdn.net/shootyou/article/details/6615051)

#### CLOSE_WAIT和TIME_WAIT查看

`netstat -n | awk *'/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'*`



#### 静默时间

在三次握手之前，静默一个MSL。现在一般操作系统都不会再实现了。

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

#### 延时确认（delayed-ACK）

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

### 流量控制和窗口滑动

流量控制因为当数据发送方的发送速率超过接收方的处理速度。会导致很多没有必要的重传，导致网络拥塞。

窗口滑动是流量控制的一种方案。

TCP头部中的窗口大小最大为65535，**单位为字节，而不是段**。**此外MSS的单位也是字节**

#### TCP的窗口控制

##### 发送窗口

<table>
    <tr>
        <td align="center" colspan = "3"></td>
        <td align="center" colspan = "5">提供窗口（SND.WND）</td>
        <td align="center" colspan="3"></td>
    </tr>
    <tr>
        <td align="center" colspan="1">...</td>
        <td align="center" colspan="1">5</td>
        <td align="center" colspan="1">6</td>
        <td align="center" colspan="1">7</td>
        <td align="center" colspan="1">8</td>
        <td align="center" colspan="1">9</td>
        <td align="center" colspan="1">10</td>
        <td align="center" colspan="1">11</td>
        <td align="center" colspan="1">12</td>
        <td align="center" colspan="1">13</td>
        <td align="center" colspan="1">...</td>
    </tr>
    <tr>
        <td align="center" colspan="3">已发送并已确认</td>
        <td align="center" colspan="3">已发送但未确认</td>
        <td align="center" colspan="2">即将发送（可用窗口）</td>
        <td align="center" colspan="3">直到窗口移动前都不能发送</td>
    </tr>
    <tr>
        <td align="center" colspan="2"></td>
        <td align="center" colspan="2">左边界（SND.UNA）</td>
        <td align="center" colspan="1"></td>
         <td align="center" colspan="2">SND.NXT</td>
        <td align="center" colspan="2">右边界（SND.UNA+SND.WND）</td>
        <td colspan="2"></td>
    </tr>
</table>


#####  **接收窗口**

<table>
    <tr>
        <td align="center" colspan = "3"></td>
        <td align="center" colspan = "5">接收窗口（REV.WND）</td>
        <td align="center" colspan="3"></td>
    </tr>
    <tr>
        <td align="center" colspan="1">...</td>
        <td align="center" colspan="1">5</td>
        <td align="center" colspan="1">6</td>
        <td align="center" colspan="1">7</td>
        <td align="center" colspan="1">8</td>
        <td align="center" colspan="1">9</td>
        <td align="center" colspan="1">10</td>
        <td align="center" colspan="1">11</td>
        <td align="center" colspan="1">12</td>
        <td align="center" colspan="1">13</td>
        <td align="center" colspan="1">...</td>
    </tr>
    <tr>
        <td align="center" colspan="3">已接收并确认</td>
        <td align="center" colspan="5">接收后将会保存</td>
        <td align="center" colspan="3">不能接收</td>
    </tr>
    <tr>
        <td align="center" colspan="2"></td>
        <td align="center" colspan="2">左边界（REV.NXT）</td>
        <td align="center" colspan="3"></td>
        <td align="center" colspan="2">右边界（REV.NXT+REV.WND）</td>
        <td colspan="2"></td>
    </tr>
</table>
传统的TCP的累积ACK结构，只有当到达数据序列号等于左边界时，数据才不会被丢失，窗口才能向前滑动。

对于选择确认ACK，使用`SACK`选项，窗口内的报文段也可以被接收确认，但只有在接收到等于左边界的序列号数据时，窗口才能前移。

#### 零窗口与TCP持续计时器

当窗口值为0时，可以有效阻止发送端继续发送，知道窗口大小恢复为非零值。当接收端重新获得可用窗口时，会给发送端传输一个**窗口更新**（window update），告知其可继续发送数据。这样的窗口更新都不包含数据（所以也不会超时重传），不能保证可靠性。

如果`window update`的ACK丢失，通信双方会一直处于等待状态。

**解决方案：**

发送端会采用一个**持续计时器**间歇性地查询接收端，看其端口是否已增长。具体的，持续计时器会触发**窗口探测（window probe）**的传输，强烈要求接收端返回ACK（其中包含窗口大小字段）。

`window prove`包含一个字节的数据，这样可以超时重传。因此可以避免窗口丢失的死锁。

### 拥塞控制

拥塞控制在网络中有很大的作用，当所有主机都以自己最大的能力持续的发送数据段，在网络环境很差的情况下，数据段又一直不能被接收方接收到（发送方收不到ACK），发送方就会超时重传。如果一直接收不到ACK就会一直超时重传，最终会导致阻塞在网络中的数据越来越多。最后将整个网络通信堵塞。

但是另一方面又想最大限度的使用网络，然而网络通信的复杂性导致无法了解这个最大限度的值，并且这个值是动态的，每次网络波动之后，都需要重新去寻找这个阈值，所以只能一点点的逼近，一旦超过，就立即返回之前的数据发送大小。

#### 减缓TCP发送

可用窗口`W=min(cwnd, awnd)`，`cwnd`为拥塞端口大小，`awnd`为接收方窗口大小。一般来说，计算机发送和接收端都不能精确的计算`cwnd`的值。并且这个值是在动态变化的。

#### 慢启动

在传输初始的时候，由于网络传输能力未知。需要缓慢探测可用传输资源，防止短时间内大量数据注入导致拥塞。

##### 场景

- 创建新的TCP连接时
- 检测到由重传超时（RTO）导致的丢包时，需要执行慢启动。
- TCP发送端长时间空闲状态也可能调用慢启动算法。

##### 目的

在用拥塞避免的方法探寻更多可用带宽之前的`cwnd`值，以帮助TCP建立ACK时钟。

##### 创建连接时的慢启动

在创建新连接时执行慢启动，直至有丢包时，执行拥塞避免算法（下一小节）进入稳定状态。

具体的：

1. TCP以发送一定数量的数据段开始慢启动（SYN交换之后），成为**初始窗口（`IW`）**，`IW`的初始值设为1`SMSS`（发送方的最大段大小）。
2. 在接收到一个数据段的ACK之后，通常`cwnd`会增加到2，接着发送2个数据段。
3. 如果对应的接收到新的ACK，`cwnd`会由2变成4、然后到8。呈指数级上升。
4. 呈指数上升之后，`cwnd`会非常大，一旦发生丢包，`cwnd`将立即减为原来的一半，即上一次没有发生丢包的`cwnd`。**这就是慢启动转为拥塞避免阶段的转折点**。此时的`cwnd`也就是慢启动的**阈值**（`ssthresh`）

#### 拥塞避免

在通过慢启动确认慢启动阈值之后，`cwnd`的增长将会转为**线性增长**。可以逐步尽可能的使用更多的网络资源。也避免大量的数据堵塞整个传输网络。

其中如果要是开启了延时ACK，则增长速率会比正常的线性增长还要慢一些。

#### 快速恢复

BSD Tahoe版本的TCP，在检测到丢包之后，无论是超时还是快速重传，都会重新开始进入慢启动状态。在有丢包的情况发生时，`Tahoe`简单地将`cwnd`减为初始值（1SMSS），以达到慢启动的目的。知道找到新的阈值`ssthresh`

导致宽带利用率低下。

在BSD Reno版中，在遇到因为快速重传（发送方收到重复的ACK）时，`cwnd`被设置为上一个`ssthresh`。而无需重新慢启动。但是在大多数的TCP版本中，超时导致的慢启动问题还是存在。

#### `NewReno`

快速恢复带来了一个新的问题，当一个传输窗口中出现多个数据包丢失时，一旦其中一个包重传成功，发送方就会接收到一个成功的 ACK，这样快速恢复中`cwnd`窗口的暂时膨胀就会停止，而事实上丢失的其他数据包坑你未完成重传。导致出现这种情况的ACK成为局部ACK（`partial ACK`）。Reno算法在接收到局部ACK后就停止拥塞窗口膨胀阶段，并将其减小到特定值。这会严重的浪费网络性能。

`NewReno`算法提出，记录上一个数据传输窗口的最高序列号，仅当接收到序列号不小于恢复点的ACK才停止快速恢复阶段。这样TCP发送方每接收一个ACK后就能继续发送一个新数据段，从而减少重传超时的发生。

### 保活机制

三个变量

1. 保活时间：`net.ipv4tcp_keepalive_time`=7200s (2h)
2. 保活时间间隔：`net.ipv4.tcp_keepalive_intvl`=75s
3. 保活探测次数：`net.ipv4.tcp_keepalive_probes`=9

## HTTP

### 方法

#### PUT

目的是让服务器用请求的主体部分来创建一个由请求的URL命名的新文档。如果那个URL已经存在的话，就用这个主体替代。

```http
PUT /files/images/upload.png
Host: www.xxx.com

... 文件流
```



#### HEAD

不返回数据，只返回头部。这就允许在不获取实际数据的情况下，了解数据的情况，并且也可以对返回体头部进行校验

作用如下：

- 在不获取资源的情况下了解资源
- 通过查看状态码，了解某个对象是否存在
- 通过查看首部，测试资源是否被修改

#### POST

通常是表单的传输



#### TRACE

客户端发出一个请求后，可能会经过防火墙，代理，网关或一些其他应用程序。

每个中间节点都有可能修改原始的HTTP请求。TRACE方法允许客户端在最终将请求发给服务器时，看看它变成了什么样子。

TRACE会在目的服务器发起一个环回诊断，最后的服务器会弹回一条TRACE相应，并在响应主体中携带它收到的原始请求报文。

#### OPTIONS

请求Web服务器告知其支持的各种功能。如跨域。也包含各种支持的方法

```http
access-control-allow-origin:	*
allow:	GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS
cache-control:	no-cache, no-store, max-age=0, must-revalidate
date:	Thu, 06 May 2021 03:11:11 GMT
expires:	0
pragma:	no-cache
x-content-type-options:	nosniff
x-xss-protection:	1; mode=block


```



### Header

#### Connection: keep-alive 

复用TCP连接，使用客户端到服务器的连接持续有效。当客户端对服务器有后续请求时，Keep-alive能够避免重建连接。







