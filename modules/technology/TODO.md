# TODO 

ODS, DWD DWS, ADS,

- [ ] Dubbo

- [ ] 为什么选择nacos 不选择ZK，CAP理论
- [ ] java类加载
- [ ] JVM GC回收器

- [ ] tomcat的Filter
- [ ] spring的intercepter

- [ ] bean的生命周期
- [ ] AQS
- [ ] 学习多线程的编写
- [ ] 线程池
- [x] Kafka
- [ ] 动态规划



## 双检查锁

学习volatile关键字的用法

```java
public class Singleton {
    private volatile static Singleton instance; 
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton(); 
                }
            }
        }
        return instance;
    }
}	
```



