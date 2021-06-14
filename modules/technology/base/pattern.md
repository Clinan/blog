# 设计模式

## 策略模式

**可以将互换的行为封装起来，然后使用委托的方法，决定使用哪一个行为。**

鸭子，鸭鸣器。

可以在运行的时候设置策略，比如说鸭子本来会飞，但是某一天翅膀受伤了，就不能飞了。此时这个鸭子要设置为不能飞翔的策略。



比如，游戏角色。武器可以是剑，弓箭，手枪。在运行的过程中可以切换武器。

## 观察者模式

气象监测应用的显示



## 装饰者模式

Decorator pattern，装饰器模式。也叫包装器模式（Wrapper Pattern）,是指在不改变原有对象的基础上，将功能附加到对象上，

提供了比继承更有弹性的替代方案（扩展原有对象的功能）

　　属于结构型模式。

`JavaIO` 类

```mermaid
classDiagram
	InputStream<|--FileInputStream
	InputStream<|--ByteArrayInputStream
	InputStream<|--SequenceInputStream
	InputStream<|--StringBufferInputStream
	InputStream<|--FilterInputStream
	FilterInputStream<|--BufferedInputStream
	FilterInputStream<|--PushbackInputStream
	FilterInputStream<|--DataInputStream
	FilterInputStream<|--LineNumberInputStream
```

## 工厂模式

### 工厂方法

工厂方法一般用于创建一个具体的实现类。

如创建不同口味的pizza

### 抽象工厂

抽象工厂用于创建相关或依赖对象的家族，而不需要明确指定具体类。

如创建pizza的原材料（面粉，芝士，等等原料）

一般具体的原料也可以使用**工厂方法**进行创建

## 单例模式

### 多线程（双检查锁，double-checked locking）

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

## 命令模式

将多个不标准的对象继承成为`Command`，

```mermaid
classDiagram
	Command <|-- LightCommand
	Command: +execute()
	LightCommand : +execute() 
	LightCommand : -light
	
	LightCommand<--Light:使用
	Light: +on()
	Light: +off()
	
	Invoker-->Command : 使用
	Invoker: -commands
	Invoker: +excuteCommands(迭代执行)
	
	Command <|-- DoorCommand
	DoorCommand : +execute() 
	DoorCommand : -door
	DoorCommand<--Door:使用
	Door: +open()
	Door: +close()
```

使用场景，如文档的历史，撤销，重做之类的事务，等等。

- 重做日志
- 事务

## 模板方法

由子类决定如何实现某些步骤



## 状态模式

**封装基于状态的行为，并将行为委托到当前状态。**

定义接口类`State`，所有状态都继承于这个接口或是抽象类

## 外观，适配器，代理模式

Facade Pattern,又称外观模式。提供一个统一的接口，用来访问子系统中的一群接口。

属于结构型设计模式。

### 双向适配器

A适配B，B也适配A

| 对比项                 | 外观           | 适配器           | 代理     |
| ---------------------- | -------------- | ---------------- | -------- |
| 继承类或是接口         | 接口           | 接口             | 类或接口 |
| 是否只有一个代理对象   | 否，可以有多个 | 只有一个         | 只有一个 |
| 是否可以拓展public方法 | 可以           | 不可以，只是为了 | 不可以   |
|                        |                |                  |          |

