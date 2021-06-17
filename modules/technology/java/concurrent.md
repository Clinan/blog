# Java多线程

本文基于《Java并发编程的艺术》

## 并发编程的挑战



## Java并发机制的底层实现原理

### volatile的应用

#### 定义和实现原理

volatile是如何来保 证 可 见 性的呢？ 让 我 们 在 X86处 理器下通 过 工具 获 取 JIT编译 器
生成的 汇编 指令来 查 看 对 volatile进 行写操作 时 CPU会做什么事情。
Java代 码 如下。
```java
instance = new Singleton();//  instance 是 volatile 变量
```
转变成汇编代码，如下。
```assembly
0x01a3de1d: movb $0×0,0×1104800(%esi);0x01a3de24: lock addl $0×0,(%esp);
```



### 锁

级别从低到高：无锁，偏向锁，轻量锁，重量锁。锁的状态会随着竞争情况逐渐升级。但不能降级。



| 锁       | 优点                                                         | 缺点                                           | 使用场景                             |
| -------- | ------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------ |
| 偏向锁   | 加锁和解锁不需要额外的消耗，和执行非同步方法相比仅存在纳秒级别的差距 | 如果线程间存在锁竞争，会代理额外的锁撤销的消耗 | 适用于只有一个线程访问同步语块       |
| 轻量级锁 | 竞争的线程不会阻塞，而是自旋等待。提高了程序的响应速度       | 如果始终得不到锁竞争的线程，使用自旋会消耗CPU  | 追求响应时间，同步语块执行速度非常快 |
| 重量级锁 | 线程竞争不适用线程，不会消耗CPU                              | 线程阻塞，响应时间缓慢                         | 追求吞吐量，同步语块执行速度慢       |



## Java内存模型

### 多线程通信 JMM

![jmm](https://cdn.clinan.xyz/jmm.png)

### 指令重排序

- 编译器优化的重排序，编译器在不改变单线程程序执行语义的情况下，可以重新安排语句的执行顺序。

- 指令并行的重排序。指令级并行的重排序。现代处理器采用了指令级并行技术（ Instruction-LevelParallelism, ILP）来将多条指令重叠执行。如果不存在数据依赖性，处理器可以改变语句对应机器指令的执行顺序。

- 内存系统的重排序。由于处理器使用缓存和读写缓冲区，这使得加载和存储操作看上去可能是在乱序执行。

  ```mermaid
  graph LR
  源代码-->1.编译器优化重排序-->2.指令并行的重排序-->3.内存系统重排序-->最终执行的指令
  ```

  上述的1属于编译器重排序，2和 3属于处理器重排序。这些重排序可能会导致多线程程序出现内存可见性问题。对于编译器，JMM的编译器重排序规则会禁止特定类型的编译器重排序（不是所有的编译器重排序都要禁止）。对于处理器重排序，JMM的处理器重排序规则会要求 Java编译器在生成指令序列时，插入特定类型的内存屏障Memory Barriers Intel称之为 Memory Fence）指令，通过内存屏障指令来禁止特定类型的处理器重排序。

**JMM属于语言级的内存模型**，它确保在不同的编译器和不同的处理器平台之上，通过禁止特定类型的编译器重排序和处理器重排序，为 程序员提供一致的内存可见性保证 。

### volatile的内存语义

volatile变量自身具有下列特性

- 可见性，对一个volatile变量的读，总是能看到（任意线程）对这个volatile变量最后的写入。
- ~~原子性~~ ，对任意单个volatile变量的读/写具有原子性，但类似于`volatile++`这种复合操作不具有原子性。

#### volatile重排序规则

- 当**第二个**操作是volatile写的时候，不管第一个操作是什么，都不能重排序。这个规则确保volatile写之前的操作不会被编译器重排序到volatile写之后。
- 当**第一个**操作是volatile读时，不管第二个操作是什么，都不能重排序。这个规则确保volatile读之后的操作不会被编译器重排序到volatile读之前。
- 第一个操作是volatile写，第二个操作时volatile读时，不能重排序。

为了实现volatile的内存语义，编译器在生成字节码时，会在

### 锁的内存语义

以JUC包的`ReentrantLock`作为例子。



### final的内存语义

两个重排序规则

- 在构造函数内对一个final域的写入，与随后把这个构造对象的引用赋值给一个引用变量，这两个操作之间不能重排序。
- 初次读一个包含final域的对象的引用，与随后初次读这个final域，这两个操作之间不能重排序。

读final域的重排序规则是，在一个线程中，初次读对象引用与初次读该对象包含的final域，JMM禁止处理器重排序这两个操作（注意，这个规则仅仅针对处理器）。编译器会在读final域操作的前面插入一个LoadLoad屏障。



### happens-before

在JMM中，如果一个操作执行的结果需要对另一个操作可见，那么这两个操作之间必须要存在happens-before关系。这里提到的两个操作既可以是在一个线程之内，也可以是在不同线程之间。

《JSR-133:JavaMemoryModelandThreadSpecification》定义了如下happens-before规则。

1. 程序顺序规则：一个线程中的每个操作，happens-before于该线程中的任意后续操作。
2. 监视器锁规则：对一个锁的解锁，happens-before于随后对这个锁的加锁。
3. volatile变量规则：对一个volatile域的写，happens-before于任意后续对这个volatile域的读。
4. 传递性：如果Ahappens-beforeB，且Bhappens-beforeC，那么Ahappens-beforeC。
5. start()规则：如果线程A执行操作ThreadB.start()（启动线程B），那么A线程的ThreadB.start()操作happens-before于线程B中的任意操作。
6. join()规则：如果线程A执行操作ThreadB.join()并成功返回，那么线程B中的任意操作happens-before于线程A从ThreadB.join()操作成功返回。

### 双重检查锁定，double-checked locking

```java
public class Singleton {
    // volatile 关键字保证，当uniqueInstance被实例时，多个线程能正确的获取uniqueInstance变量
    private volatile static Singleton uniqueInstance;
    private Singleton() {}
    public static Singleton getInstance() {
        // 检查实例，如果不存在就进入同步块
        if (uniqueInstance == null) {
            // 注意，只有第一次才彻底执行这里的代码
            synchronized(Singleton.class) {
                // 进入同步块后，再次检查，如果还是null才创建。
                if (uniqueInstance == null) {
                    uniqueInstance = new Singleton();
                }
            }
        }
        return uniqueInstance;
    }
}
```

### 延迟初始化

```java
class InstanceFactory {
    private static class InstanceHolder {
        public static Instance instance = new Instance();
    }
    public static Instance getInstance() {
        // 这里将导致 InstanceHolder 类被加载并初始化
        return InstanceHolder.instance;
    }
}
```



## Java并发编程基础





## Java中的锁

### Lock接口

### 队列同步器

### ReentrantLock

### ReentrantReadWriteLock

### LockSupport

### Condition

Condition是`Lock#newCondition`创建出来的



## Java并发容器和框架

### ConcurrentHashMap



### ConcurrentLinkendQueue









## 13个原子操作类



## 并发工具类



## 线程池



## Executor框架