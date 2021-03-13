# JAVA SE8虚拟机规范

## 类型
### 整数类型
| 类型  | 说明                      | byte字节数 | 默认值 | 范围            |
| ----- | ------------------------- | ---------- | ------ | --------------- |
| byte  | 8bit的二进制补码表示      | 1          | 0      | -2^7~ (2^7)-1   |
| short | 16bit的二进制补码表示     | 2          | 0      | -2^15~ (2^15)-1 |
| int   | 32bit的二进制补码表示     | 4          | 0      | -2^31~ (2^31)-1 |
| long  | 64bit的二进制补码表示     | 8          | 0      | -2^63~ (2^63)-1 |
| char  | from 0 to 65535 inclusive | 4          |        | 0~2^16-1        |

### 浮点数类型



### 返回地址，The returnAddress Type and Values
返回地址，指令`jsr`, `ret`, `and`和`jsr_w`会使用到returnAddress，returnAddress的值是指向操作码的指针，
与原始类型不同，returnAddress不与任何Java编程类型相对应，并且不能由正在运行的程序更改。说白了就是一种类型


### boolean类型
尽管JVM虚拟机定义了boolean类型，但是对它的支持很有限，并且没有专门针对boolean的操作指令，
实际上，boolean类型被编译为int类型。 
对于boolean类型数组，实际上创建的数组是byte类型的，使用`baload`和`bastore`指令进行操作和存储 
在oracle虚拟机中，boolean数组就是byte数组，每个boolean元素就是一个byte，占用8个字节。 
并且java虚拟机声明1为true,0为false,如果要是int类型的话，也必须是0或1。


### 引用类型 Reference Types and Values
引用类型有三种，Interface types, Class types, Array types。它们的值分别引用动态创建的类实例，数组或实现接口的类实例或数组。


## 运行数据区

### 程序计数器
每个JAVA线程都有自己的程序计数器寄存器，每个java虚拟机线程都在执行单个方法的代码，即该线程的当前方法。 
如果不是native方法，则这个计数器包含当前正在执行的Java虚拟机指令的地址（运行到哪一行代码）。 
如果是native方法，则计数器的值是空的（未定义）。如果计数器的长度足够长，可以在特定平台上保存一些额外的信息，如returnAddress或是一个native pointer


### java虚拟机栈（Java Virtual Machine Stacks）
每个Java线程都有一个自己的虚拟机栈，并且和线程同时创建。虚拟机栈保存的是栈帧（stack frame）。因为对于虚拟机栈，除了入栈出栈外，从不直接操作虚拟机栈，所以可以从堆中分配栈帧给虚拟机栈。java虚拟机栈不必是连续的。 
可以是固定大小，也可以是动态的。hotspot中是固定大小的。 
Java虚拟机实现可以为程序员或用户提供对Java虚拟机堆栈的初始大小的控制，并且在动态扩展或收缩Java虚拟机堆栈的情况下，可以控制最大和最小。


### 堆（heap）
Java虚拟机具有一个所有线程之间共享的堆，堆是运行时数据区，从中分配**所有类实例和数组的内存。** 
堆的大小是可以固定的，可以根据需要进行调整堆的大小。 
如果堆内存不够用，会触发OOM异常



## 对象

### 对象的内存布局（对象头）

对象在堆内存中的存储布局可以分为三个部分：

- 对象头（Header）
- 实例数据（Instance Data）
- 对齐填充（Padding）

HotSpot对象头（MarkWord)分为三部分

- 25个字节，存储HashCode
- 4个字节，分代年龄
- 2个字节，存储锁标志位
- 1个字节，固定为0



## HOTSPOT垃圾收集算法细节

### 根节点（GC Root）枚举

为了加快枚举速度，避免对每一个方法的对象栈进行轮询，设置了保存这些引用对象的数据结构OopMap，用于一次性读取引用对象。

- OopMap，在加载动作完成的时候，虚拟机就会把对象内什么偏移量上什么类型的数据计算出来，在JIT过程中，也会在特定的位置记录下栈里和寄存器里哪些位置是引用；这个特定的位置被称为安全点（safePoint）。记录这个数据的数据结构在hotspot中被称为OopMap
- JNI(java native interface)方法使用句柄调用java对象，java对象调用JNI也要将自身包装为句柄调用



### 安全点（SafePint）

安全点一般设置在

- 方法返回之前/方法调用的call命令之后
- 循环的末尾
- 可能抛异常的位置

如果设置了安全点，程序执行中就会涉及到中断，主动终端和被动终端。hotspot中使用的是主动中断。主动式中断不需要对每个线程进行操作，仅仅设置一个标志位，各个线程执行过程中会不停的主动轮询这个标志位，一旦发现标志位为True，就自己在最近的安全点主动中断挂起。轮询标志的地方和安全点是重合的。hotspot才有内存保护陷阱的方式，将标志位的内存设置为不可读，线程便会挂起等待，这样仅通过一条汇编指令便完成了标志位轮询和主动中断挂起。

### 安全区域

针对没有执行的代码，如用户线程处于sleep,blacked状态时，无法执行到安全点。当用户线程执行到安全区域时，会标志自己进入到了安全区域，根节点枚举便不去管进入安全区域的线程，因为在安全区域中的任意地方收集垃圾都是安全的。一旦线程要退出安全区域，则需要判断是否在进行根节点枚举，有则等待根节点枚举结束。

### 记忆集和卡表

记忆集，是为了对象跨代引用带来的问题。卡表是记忆集最常见的实现

字节数组`CARD_TABLE`的每一个元素对应着其标识的内存区域中一块特定大小的内存块（卡页CardPage），Hotspot的卡页为2的9次幂等于512字节。

一个卡页中不止包含一个对象，只要卡页中存在至少一个对象存在跨代指针，那就将对应卡表的数组元素的值标识为1，称这个元素为脏（dirty），垃圾收集时，将含有跨代指针的卡页加入GCRoot中一并被扫描。



### 写屏障

解决谁来维护卡表，如何把卡页变脏的问题。





### 并发的可达性分析





## 收集器

### serial

- 标记-整理算法，将已用的内存都整理到堆的前面
- 标记-复制算法，将已用的内存都复制到另外的survivor
- 新生代采用标志-复制算法，老年代采用标记-整理算法

![](https://cdn.clinan.xyz/serial&serialOld.png)



### ParNew

- serial的多线程版本

- 

![](https://cdn.clinan.xyz/parNew&serialOld.png)

### CMS

CMS（Concurrent Mark Sweep）收集器是一种以获取最短回收为目标的收集器。

过程

1. 初始标记
2. 并发标记
3. 重新标记
4. 并发清除
5. *参数-XX:+UseCMS-CompactAtFullCollection，默认开启*整理碎片，无法并发



缺点

- 无法处理浮动垃圾，有可能出现“Con-current Mode Failure”失败进而导致另一次完全“Stop The World”。无法等待老年代满了再收集，因为还要再保留一下内存空间给并发线程使用。需要设置触发FullGC的已用内存百分比的阈值。参数`-XX:CMSInitatingOccupancyFraction`来设置百分比。

- 由于是基于“标记-清除”算法实现的收集器，垃圾收集之后会有大量空间碎片。

  CMS提供了一个-XX:+UseCMS-CompactAtFullCollection开关参数（默认开启，JDK9废弃），用于在CMS收集器不得不进行FullGC时开启内存碎片的合并整理过程，由于这个内存这里必须移动存货对象，无法并发。增加了停顿时间。



### G1

分为多个region，每个region都需要卡表，很费内存，相当于Java堆容量的**10%-20%**，建议内存大于8G的时候，在使用G1收集器。



### 内存分配与回收策略

如何给对象分配内存，从概念上讲，对象的内存分配应该在堆上分配，但是实际也有可能经过JIT后被拆散为标量类型并间接地在栈上分配）。在经典分代的设计下，新生对象通常会分配在新生代中，少数情况下（例如对象大小超过一定的阈值）也有可能直接分配在老年代。

#### 对象有限在Eden分配

大多数情况下，对象在新生代Eden区中分配。当Eden区没有足够空间进行分配时，虚拟机将发起一次`Minor GC`

#### 大对象直接进入老年代

大对象就是指需要大量连续内存空间的Java对象，最典型的大对象便是那种很长的字符串，或者元素数量很庞大的数组。

Hotspot提供了`-XX:PretenureSizeThreshold=【4135728】`仅仅（Serial/ParNew+CMS）的收集器下可用，来指定大于该设置值的对象再接再老年代分配。避免大对象在Eden和两个Survivor直接来回复制，产生大量的内存复制操作

#### 长期存活的对象直接进入老年代

一般来说，对象的分代年龄达到15才进入老年区。也可以通过设置参数`-XX:MaxTrnuringThreshold`来设置进入老年代的年龄。

#### 动态对象年龄判断

**如果在Survivor空间中相同年龄所有对象大小的总和大于Survivor空间的一半，年龄要求大于等于该年龄的对象直接进入老年代**。无需等到`-XX:MaxTrnuringThreshold`要求的年龄。

#### 空间分配担保(如果不能担保就需要发生Full GC)

在发生MinorGc之前，虚拟机必须先检查老年代最大空用的连续空间是否大于新生代所有对象总空间，如果这个条件成立，那这一次MinorGC可以确保安全。如果不成立，则虚拟机会先查看`-XX:HandlePromotionFailure`参数的设置值是否允许担保失败，如果允许，那会继续检查老年代最大可用的连续空间是否大于历次晋升到老年代对象的平均大小，如果大于，将尝试进行一次MinorGC，尽管这次MinorGC是有风险的；如果小于，或者`XX:HandlePromotionFailure`设置不允许，那这时就要改为一次FullGC

JDK6之后，规则变为只要老年代的连续空间大于新生代对象总大小或者历次晋升到老年代的平均大小，就会进行MinorGC



## JVM 类加载

### 类的生命周期

加载-（验证-准备-解析）[连接]-初始化-使用-卸载

#### 初始化时机

1. new对象的时候，读取静态字段的时候（static final修饰除外，因为在编译期将结果放置到常量池中了），调用静态方法的时候
2. 使用反射调用的时候
3. 初始化一个类的时候，发现父类还没有初始化，则先初始化父类
4. 当虚拟机启动的时候，先初始化主类
5. 当使用JDK 7新加入的动态语言支持时，如果一个java.lang.invoke.MethodHandle实例最后的解 析结果为REF_getStatic、REF_putStatic、REF_invokeStatic、REF_newInvokeSpecial四种类型的方法句
   柄，并且这个方法句柄对应的类没有进行过初始化，则需要先触发其初始化。
6. 当接口定义了default方法时，如果这个接口的实现类发生了初始化，那该接口要在类之前被初始化



### 加载

加载时整个类加载的一部分。在加载阶段，JVM需要完成三件事

1. 通过一个类的全限定名来获取定义此类的二进制字节流
2. **将这个字节流代表的静态存储结构转化为方法去的运行时数据**
3. 在内存中生成代表这个类的java.lang.Class对象，作为方法区这个类的各种数据的访问入口。

### 验证

- 文件格式验证
- 元数据验证
  - 这个类是否有父类（除了java.lang.Object
  - 是否继承了final类
  - 如果不是抽象类，是否实现了所有接口或抽象类方法
  - 是否出现不正确的覆盖字段或方法重载
- 符号引用验证（import 是否有，可访问性）

> 可以通过 -Xverify:none 来关闭验证，加快类加载的速度

### 准备



​				

### 解析



## 类加载器

#### 类与类加载器

类加载器虽然只用于实现类的加载动作，但它在Java程序中起到的作用远超类加载阶段。对于任意一个类，都必须由加载它的类加载器和这个类本身一起共同确立在JVM中的唯一性，**都拥有一个独立的类名称空间**。

**比较两个类是否“相等”，只有这两个类是由同一个类加载器加载的前提下才有意义，否则这两个类来源于同一个Class文件，被同一个虚拟机加载，只要加载它们的类加载器不同，那这两个类就必不相等。**

“相等” ☞包括代表类对象的equals,isAssignableFrom,isInstance方法的返回结果。也包括instanceof的条件判定



#### 双亲委派模型

![](https://cdn.clinan.xyz/class-loader.png)

##### BootstrapLoader

启动类加载器，由C++实现，加载`<JAVA_HOME>\lib`目录或`—XbootClasspath`参数指定的路径，能够根据文件名识别，如rt.jar、tools.jar，名字不符合也不会被加载

##### ExtLoader

拓展类加载器，Java实现，加载`<JAVA_HOME>\lib\ext`目录中或`java.ext.dirs`系统变量指定的路径中**所有的类库**

##### ApplicationLoader

应用程序类加载器，它是ClassLoader类中getSystemClassLoader方法的返回值，它负责加载 用户类路径上所有的类库，程序中默认的类加载器。

##### UserApplicationLoader

用户自定义的类加载器





## 虚拟机字节码执行引擎

### 运行时栈帧结构

#### 局部变量表

#### 操作数栈

#### 动态链接

#### 方法返回地址



### 方法调用

方法调用并不等同于方法中的代码被执行，方法调用阶段唯一的任务就是确定被调用方法的版本（即调用哪一个方法），暂时还未设计方法内部的具体运行过程。

#### 

方法调用有五个虚拟机字节码指令

- `invokestatic` 用于调用静态方法
- `invokespecial` 用于调用实例构造器`<init>()`方法、私有方法和父类中的方法
- `invokevirtual`用于调用所有的虚方法
- `invokeinterface`用于调用接口方法，会在运行时再确定一个实现该接口的对象
- `invokedynamic`由用户设定的引导方法决定

#### 解析

调用目标方法在代码写好，编译器进行编译那一刻就已经确定下来。这类方法的调用被称为解析。

在Java语言中符合“编译期可知，运行期不可变”这个要求的方法，主要有静态方法和私有方法两大类，前者与类型直接关联，后者在外部不可被访问，这两种方法的各自特点决定了它们都不可能通过继承或别的方式重写出其他版本，因此他们都适合在类加载阶段进行解析。

只有能被`invokestatic`和`invokespecial`指令调用的方法，都可以在解析阶段确定唯一的调用版本。符合的有**静态方法、私有方法、实例构造器、父类方法**四种，再加上**`final`修饰的方法**（尽管它使用`invokevirtual`指令调用），这五种方法会在类加载的阶段就可以把符号因为解析为方法的直接引用。这些方法被统称为**“非虚方法”**。

#### 分派

分派是因为重载等问题，编译器或虚拟机决定执行哪个方法的方案。

##### 静态分派

```java
public void sayHello(Human h) {
    System.out.println("human");
}
public void sayHello(Man h) {
    System.out.println("man");
}
public void sayHello(Woman h) {
    System.out.println("woman");
}

public static void main() {
    Human man = new Man();
    Human woman = new Woman();
    man.sayHello();
    woman.sayHello();
   	// 输出
    // human
    // human
}
```

解释：虚拟机在重载时时通过参数的静态类型（Human）而不是实际类型作为判定依据的。由于静态类型在编译期可知，所有在编译阶段，Javac编译器就根据参数的静态类型决定了使用哪个重载版本，因此选择了`sayHell(Human)`作为调用目标，并把这个方法的符号引用写道main()方法里的两条invokestatic指令的参数中。

##### 动态分派

```java
/**
 * 字段不参与多态 * @author zzm
 */
public class FieldHasNoPolymorphic {
    static class Father {
        public int money = 1;

        public Father() {
            money = 2;
            showMeTheMoney();
        }

        public void showMeTheMoney() {
            System.out.println("I am Father, i have $" + money);
        }
    }

    static class Son extends Father {
        public int money = 3;

        public Son() {
            money = 4;
            showMeTheMoney();
        }

        public void showMeTheMoney() {
            System.out.println("I am Son, i have $" + money);
        }
    }

    public static void main(String[] args) {
        Father gay = new Son();
        System.out.println("This gay has $" + gay.money);
        // 输出 
        // I am Son, i hava $0
        // I am Son, i hava $4
        // This gay has $2
    }
}
```

输出两句都是“I am Son”，这是因为在Son类创建的时候，首先隐式了调用Father的构造函数，而Father构造函数中对`showMeTheMoney()`的调用是一次虚方法调用，实际执行的是`Son::showMeTheMoney()`，所以输出的是“I am Son”。这时候虽然父类的money字段已经被初始化为2了，但`Son::showMeTheMoney()`访问的是子类中的money字段，这时候结果自然还是0，因为它要到子类的构造函数执行时才会被初始化。

### 动态类型语言支持





### 基于栈的字节码解释执行引擎

方法里代码的具体如何执行

#### 解释执行

#### 基于栈的指令集与基于寄存器的指令集

#### 基于栈的解释器执行过程



## 前端编译与优化

编译过程分为1个准备过程和3个处理过程

1. 准备过程：初始化插入式注解处理器
2. 解析与填充符号表过程
   - 词法语法分析。将源代码的字符流转为标记集合，构造出抽象语法树
   - 填充符号表，产生符号地址和符号信息
3. 插入式注解处理器的注解处理过程
4. 分析与字节码生产
   - 标注检查
   - 数据流和控制流分析
   - **解语法糖**
   - 字节码生产

## 后端编译与优化



## Java内存与模型

### valitile

- 内存可见性，**没有锁**
- 避免指令重排序



### 协程的操作





## 线程安全与锁优化













## 特别的

` -XXSurvivorRatio`:它定义了新生代中Eden区域和Survivor区域（From幸存区或To幸存区）的比例，默认为8，也就是说Eden占新生代的8/10，From幸存区和To幸存区各占新生代的1/10

### Thread.sleep和wait()的区别

- sleep只是让出CPU，等待一段时间之后继续执行，没有对于锁的操作。
- wait()会释放当前对象锁，当调用了notify或notifyAll的时候，wait方法才会返回。wait方法不占用CPU资源。
- notify 和notifyAll的区别，notify只会随机通知一个，notifyAll会通知所有的
- wait,notify,notifyAll是只有在同步语块中才有作用，主要用于多线程协作





1、Java代码是怎么变成字节码的，字节码又是怎么进入JVM的？（b）
2、JVM是怎么执行字节码的？哪些数据放在栈？哪些数据放在堆？（t）
3、如何做JVM的性能调优，具体怎么操作或怎么配置？（a）
4、实际开发工作中怎么监控JVM的工作情况？怎么定位那些bug？定位到了怎么解决他们？（a）
5、你做过JVM 参数调优和参数配置吗？请问如何查看 JVM 系统默认值？（a）
6、JVM内存泄漏与内存溢出的区别，怎么排查内存泄漏？（mt）
7、一个亿级流量系统，让它几乎不发生Full GC。你来进行JVM调优，怎么做？（a）