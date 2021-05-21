# SpringMVC的启动流程
`web.xml`

```xml
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:spring-context.xml</param-value>
</context-param>
<listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>
<servlet-mapping>
    <servlet-name>my-servlet</servlet-name>
    <url-pattern>/*</url-pattern>
</servlet-mapping>
<servlet>
    <servlet-name>my-servlet</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:spring-config.xml</param-value>
    </init-param>
</servlet>
```

#### context-param的可选配置项

- `contextConfigLocation`，spring-context的启动配置文件，常见操作有加载数据源，定义其他全局注入的类等
- `globalInitializerClasses`,  定义ConfigurableApplicationContext的回调。在刷新上下文之前调用。必须实现接口`ApplicationContextInitializer`和`Ordered` 





## spring-context的启动

### ContextLoaderListener

- 功能主要是启动`SpringIOC`，启动`context`。如数据源加载，用于初始化的可以放在这里。

1. 实现了`Servlet`容器的`ContextListener`接口。实现的接口方法`contextInitialized`调用了`org.springframework.web.context.ContextLoader#initWebApplicationContext`

2. `initWebApplicationContext`里调用了`createWebApplicationContext`创建了**ConfigurableWebApplicationContext**

3. `configureAndRefreshWebApplicationContext`方法

   1. `ConfigurableEnvironment env = wac.getEnvironment();`创建spring`Environment`
   2. `customizeContext(sc, wac);`调用回调，处理自定义上下文
   3. `wac.refresh();`实际调用的是`org.springframework.context.support.AbstractApplicationContext#refresh`
   
4. 然后回到`configureAndRefreshWebApplicationContext`继续调用了`org.springframework.web.servlet.DispatcherServlet#onRefresh`

5. `onRefresh`调用了`initStrategies`

   ```java
   protected void initStrategies(ApplicationContext context) {
   		initMultipartResolver(context);
   		initLocaleResolver(context);
   		initThemeResolver(context);
   		initHandlerMappings(context);
   		initHandlerAdapters(context);
   		initHandlerExceptionResolvers(context);
   		initRequestToViewNameTranslator(context);
   		initViewResolvers(context);
   		initFlashMapManager(context);
   	}
   ```

   

## spring调度器的启动

主要分为`HandlerMapping`和`HandlerAdapter`。`HandlerMapping`保存了URI和`Controller`的映射，`HandlerAdapter`用于调用`HandlerMapping`。



