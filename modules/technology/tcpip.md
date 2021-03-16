

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



## delayed-ACK

