# Dubbo

## 用法

- 在消费者中，配置负载均衡和集群容错
    ```java
    @DubboReference(
                // 负载均衡策略
                loadbalance = LeastActiveLoadBalance.NAME,
                // 集群容错策略
                cluster = FailoverCluster.NAME,
                // 容错中的failover的重试次数
                retries = 1,
                // 配置版本，在上线时做服务器增量更新很有用
                version = "2.0",
                // 当一个接口有多种实现时，可以用 group 区分。
                group = "mygroup",
                // 启动时不检查是否有服务可用
                check = false
        )
    private DemoService demoService;
    ```

- 在服务提供者中配置权重，组，版本

  ```java
  @DubboService(weight = 5, group = "mygroup", version = "2.0")
  public class DemoServiceImpl implements DemoService {
      @Override
      public void sayHello() {
          System.out.println("hello");
      }
  }
  
  ```

  

- 只订阅不注册

  ```dubbo.registry.address=nacos://localhost:8848?register=false```

- 静态服务，服务提供者初次注册时为禁用状态，需人工启用。断线时，将不会被自动删除，需人工禁用。

  `dubbo.registry.address=nacos://localhost:8848?dynamic=false`
  
- 服务降级

  ```java
  RegistryFactory registryFactory = ExtensionLoader.getExtensionLoader(RegistryFactory.class).getAdaptiveExtension();
  Registry registry = registryFactory.getRegistry(URL.valueOf("zookeeper://localhost:2181"));
  registry.register(URL.valueOf("override://0.0.0.0/com.foo.BarService?category=configurators&dynamic=false&application=foo&mock=force:return+null"));
  ```




## 拓展点SPI

相对于java SPI的优势在于，不必实例化不需要用到的类。

### `@SPI`

用于表示拓展点。一般备注在接口上。属性`name`表示默认的实现。如

```java
@SPI("netty")// 表示默认使用netty=org.apache.dubbo.remoting.transport.netty4.NettyTransporter
public interface Transporter {

    /**
     * Bind a server.
     *
     * @param url     server url
     * @param handler
     * @return server
     * @throws RemotingException
     * @see org.apache.dubbo.remoting.Transporters#bind(URL, ChannelHandler...)
     */
    @Adaptive({Constants.SERVER_KEY, Constants.TRANSPORTER_KEY})
    RemotingServer bind(URL url, ChannelHandler handler) throws RemotingException;

    /**
     * Connect to a server.
     *
     * @param url     server url
     * @param handler
     * @return client
     * @throws RemotingException
     * @see org.apache.dubbo.remoting.Transporters#connect(URL, ChannelHandler...)
     */
    @Adaptive({Constants.CLIENT_KEY, Constants.TRANSPORTER_KEY})
    Client connect(URL url, ChannelHandler handler) throws RemotingException;

}
```

### `@Adaptive`

拓展点自适应注解。如上面的代码。

会根据多个参数，依次选择匹配的实现类。而不只是依靠`@SPI`中的默认实现。 会根据URL中的参数，查找`ExtensionLoader`。如果找到就使用对应的实现类。

@Adaptive传入了两个Constants中的参数，它们的值分别是"server”和“transporter”。当外部调用Transporter#bind方法时，会动态从传入的参数“URL”中提取“server”的value，如果能匹配上**某个扩展实现类则直接使用对应的实现类**；如果未匹配上，则继续通过第二个参数“transporter”提取value。如果都没匹配上，则抛出异常。也就是说，如果`@Adaptive中`传入了多个参数，则依次**进行实现类的匹配**，直到最后抛出异常。这种动态寻找实现类的方式比较灵活，但只能激活一个具体的实现类，如果需要多个实现类同时被激活，如Filter可以同时有多个过滤器；或者根据不同的条件，同时激活多个实现类，如何实现？这就涉及最后一个特性一一自动激活。

### `@Activate`

激活多个拓展。



## 服务暴露过程

![](https://cdn.clinan.xyz/server-export.png)

一个服务接口的暴露过程，主要分为两个步骤。

1. 将持有的服务实例通过代理转为`Invoker`。
2. 然后通过具体的协议（protocol，比如 dubbo）转为`Exporter`

**每个服务接口都会被转为一个`ServiceBean`的实例。`ServiceBean`继承于`ServiceConfig`**，主要的注册逻辑都在`ServiceConfig`中。



## 服务消费机制

![](https://cdn.clinan.xyz/server_consumer.png)

单个服务消费机制。主要分为两个部分。

1. 把持有的服务实例根据协议（protocal）生成`Invoker`对象。
2. 通过动态代理，转为用户接口的实现类。这个实现类处理了网络连接，服务调用，重试等功能。

每个服务引用的接口都是`ReferenceBean`， `ReferenceBean#getObject()`方法是入口。继承于`ReferenceConfig`

### 线程模型

#### 配置 `Dubbo` 中的线程模型

- 如果事件处理的逻辑能迅速完成，并且不会发起新的 IO 请求，比如只是在内存中记个标识，则直接在 IO 线程上处理更快，因为减少了线程池调度。

- 但如果事件处理逻辑较慢，或者需要发起新的 IO 请求，比如需要查询数据库，则必须派发到线程池，否则 IO 线程阻塞，将导致不能接收其它请求。

- 如果用 IO 线程处理事件，又在事件处理过程中发起新的 IO 请求，比如在连接事件中发起登录请求，会报“可能引发死锁”异常，但不会真死锁。

因此，需要通过不同的派发策略和不同的线程池配置的组合来应对不同的场景:

```xml
<dubbo:protocol name="dubbo" dispatcher="all" threadpool="fixed" threads="100" />
```

#### Dispatcher

- `all` 所有消息都派发到线程池，包括请求，响应，连接事件，断开事件，心跳等。
- `direct` 所有消息都不派发到线程池，全部在 IO 线程上直接执行。
- `message` 只有请求响应消息派发到线程池，其它连接断开事件，心跳等消息，直接在 IO 线程上执行。
- `execution` 只有请求消息派发到线程池，不含响应，响应和其它连接断开事件，心跳等消息，直接在 IO 线程上执行。
- `connection` 在 IO 线程上，将连接断开事件放入队列，有序逐个执行，其它消息派发到线程池。

#### `ThreadPool`

- `fixed` 固定大小线程池，启动时建立线程，不关闭，一直持有。(缺省)
- `cached` 缓存线程池，空闲一分钟自动删除，需要时重建。
- `limited` 可伸缩线程池，但池中的线程数只会增长不会收缩。只增长不收缩的目的是为了避免收缩时突然来了大流量引起的性能问题。
- `eager` 优先创建`Worker`线程池。在任务数量大于`corePoolSize`但是小于`maximumPoolSize`时，优先创建`Worker`来处理任务。当任务数量大于`maximumPoolSize`时，将任务放入阻塞队列中。阻塞队列充满时抛出`RejectedExecutionException`。(相比于`cached`:`cached`在任务数量超过`maximumPoolSize`时直接抛出异常而不是将任务放入阻塞队列)



## 远程调用

![](https://cdn.clinan.xyz/dubbo-invoke.png)





### `channelHandler`



服务提供者和消费者会保持长连接，都会有一个后台线程进行



## `dubbo`集群容错

工作流程

1. 生成`Invoker`对象，不同的`Cluster`实现会生成不同类型的`ClusterInvoker`对象并返回。然后调用`ClusterInvoker`的`invoker`方法，正式开始调用流程

2. 获取可调用的服务列表，再路由规则匹配，返回符合的服务列表

3. 做负载均衡 。跟进用户的配置，调用`ExtensionLoader`获取不同的负载均衡策略的拓展点实现。然后做一些后置操作。如果是异步调用则设置调用编号。接着调用子实现的`doInvoke`方法，根据具体的负载均衡策略选出一个可以调用的服务。

4. 做`RPC`调用。首先保存每次调用的`Invoker`到`RPC`上下文，并作`RPC`调用。然后处理调用结果。

   

![](https://cdn.clinan.xyz/dubbo-cluster.png)



#### `Failover`

失败可以重试，可以设置重试次数



#### `failfast`

快速失败，只要失败一次就直接报错，通常用于非幂等性的写操作，比如新增记录。



#### `failsafe`

失败不报错，直接忽略。通常用于日志等不重要信息的集群。



#### `failback`

失败自动恢复，后台记录失败请求，定时重发。通常用于消息通知等操作。



#### Forking Cluster

并行调用多个服务器，只要一个成功即返回。通常用于实时性要求较高的读操作，但需要浪费更多服务资源。可通过 `forks="2"` 来设置最大并行数。

#### Broadcast Cluster

广播调用所有提供者，逐个调用，任意一台报错则[报错 ](http://dubbo.io/books/dubbo-user-book/demos/fault-tolerent-strategy.html#fn_2)。通常用于通知所有提供者更新缓存或日志等本地资源信息。

 



### 负载均衡

#### `RandomLoadBalance`

随机，按**权重设置**随机概率。如果刚启动机器，权重不高，需要预热好，慢慢请求的权重就会达到配置的权重

#### `RoundRobinLoadBalance`

轮询，按公约后的权重设置轮询比例。存在慢点提供者累积请求的问题。

权重轮询，有普通权重轮询和平滑权重轮询。

#### `LeastActiveLoadBalance`

最少调用次数，如果活跃数相同则随机调用，活跃数指调用前后计数差，使慢的收到更少请求，因为越慢的提供者的调用前后的计数差会越大

可以看出是Random负载均衡的**加强版**，

#### `ConsistentHashLoadBalance`

一致性Hash，相同参数的请求总是发到同一提供者。当某一台提供者挂掉，原本发给该提供者的请求，基于虚拟节点，会平摊到其他提供者，不会引起剧烈变动

