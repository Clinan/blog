# springBoot 启动流程

```java

public class MyApplication extends SpringBootServletInitializer {

    // jar启动
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MyApplication.class);
        app.setBannerMode(Banner.Mode.OFF);
        app.setLogStartupInfo(false);
        app.run(args);
    }

    // war包启动 必须要继承类 SpringBootServletInitializer
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder app) {
        app.bannerMode(Banner.Mode.OFF);
        app.logStartupInfo(false);
        return app.sources(MyApplication.class);
    }
}
```

## jar启动
运行`#run`方法

## tomcat启动(war)
必须要继承类 SpringBootServletInitializer  
通过服务发现接口(SPI)启动




## WebApplication的创建

## 





# spring使用的设计模式

- **工厂模式** BeanFactory
- **代理模式** AOP
- **单例模式** 单例Bean
- **模板方法模式** JdbcTemplate
- **适配器模式** Advice，异常捕获
- **责任链模式** FilterProxyChain
- 


