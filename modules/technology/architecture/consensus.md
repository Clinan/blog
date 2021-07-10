# 共识和一致性算法

https://draveness.me/consensus/

## Paxos

Paxos将系统中的角色分为提议者 (Proposer)，决策者 (Acceptor)，和最终决策学习者 (Learner):

- **Proposer**: 提出提案 (Proposal)。Proposal信息包括提案编号 (Proposal ID) 和提议的值 (Value)。
- **Acceptor**：参与决策，回应Proposers的提案。收到Proposal后可以接受提案，若Proposal获得多数Acceptors的接受，则称该Proposal被批准。
- **Learner**：不参与决策，从Proposers/Acceptors学习最新达成一致的提案（Value）。

### 两阶段prepare accept

Paxos算法通过一个决议分为两个阶段（Learn阶段之前决议已经形成）：

1. 第一阶段：Prepare阶段。Proposer向Acceptors发出Prepare请求，Acceptors针对收到的Prepare请求进行Promise承诺。
2. 第二阶段：Accept阶段。Proposer收到多数Acceptors承诺的Promise后，向Acceptors发出Propose请求，Acceptors针对收到的Propose请求进行Accept处理。
3. 第三阶段：Learn阶段。Proposer在收到多数Acceptors的Accept之后，标志着本次Accept成功，决议形成，将形成的决议发送给所有Learners。

![](https://pic2.zhimg.com/80/v2-a6cd35d4045134b703f9d125b1ce9671_720w.jpg)

## Multi paxos

由于大多数的分布式集群都需要接受一系列的值，如果使用 Basic Paxos 来处理数据流，那么就会导致非常明显的性能损失，而 Multi-Paxos 是前者的加强版，如果集群中的 Leader 是非常稳定的，那么我们往往不需要准备阶段的工作，这样就能够将 RPC 的数量减少一半。

![](https://img.draveness.me/2017-12-18-multi-paxos-example.png)

上述图片中描述的就是稳定阶段 Multi-Paxos 的处理过程，S1 是整个集群的 Leader，当其他的服务器接收到来自客户端的请求时，都会将请求转发给 Leader 进行处理。

当然，Leader 角色的出现自然会带来另一个问题，也就是 Leader 究竟应该如何选举，在 [Paxos Made Simple](http://140.123.102.14:8080/reportSys/file/paper/lei/lei_5_paper.pdf) 一文中并没有给出 Multi-Paxos 的具体实现方法和细节，所以不同 Multi-Paxos 的实现上总有各种各样细微的差别。

## raft

http://thesecretlivesofdata.com/raft/

在Raft中，节点有三种角色：

1. Leader：负责接收客户端的请求
2. Candidate：候选人，用于选举Leader的一种角色(竞选状态)
3. Follower：负责响应来自Leader或者Candidate的请求

Raft 其实就是 Multi-Paxos 的一个变种，Raft 通过简化 Multi-Paxos 的模型，实现了一种更容易让人理解的共识算法，它们两者都能够对一系列连续的问题达成一致。

Raft 在 Multi-Paxos 的基础之上做了两个限制，首先是 Raft 中追加日志的操作必须是连续的，而 Multi-Paxos 中追加日志的操作是并发的，但是对于节点内部的状态机来说两者都是有序的，第二就是 Raft 对 Leader 选举的条件做了限制，只有拥有最新、最全日志的节点才能够当选 Leader，但是 Multi-Paxos 由于任意节点都可以写日志，所以在选择 Leader 上也没有什么限制，只是在选择 Leader 之后需要将 Leader 中的日志补全。

![](https://img.draveness.me/2017-12-18-multi-paxos-and-raft-log.png)

在 Raft 中，所有 Follower 的日志都是 Leader 的子集，而 Multi-Paxos 中的日志并不会做这个保证，由于 Raft 对日志追加的方式和选举过程进行了限制，所以在实现上会更加容易和简单。

从理论上来讲，支持并发日志追加的 Paxos 会比 Raft 有更优秀的性能，不过其理解和实现上还是比较复杂的，很多人都会说 Paxos 是科学，而 Raft 是工程，当作者需要去实现一个共识算法，会选择使用 Raft 和更简洁的实现，避免因为一些边界条件而带来的复杂问题。

> 这篇文章并不会展开介绍 Raft 的实现过程和细节，如果对 Raft 有兴趣的读者可以在 [The Raft Consensus Algorithm](https://raft.github.io/) 找到非常多的资料。

