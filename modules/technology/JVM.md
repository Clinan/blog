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

