# Spring去除web.xml，使用Java配置Servlet的原理，SPI
![](https://img.hacpai.com/bing/20190220.jpg?imageView2/1/w/960/h/540/interlace/1/q/100)
## 1. spring使用java配置Servlet代码如下
```java
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletRegistration;

public class WebServletConfiguration implements WebApplicationInitializer {
    @Override
    public void onStartup(ServletContext ctx) {
        AnnotationConfigWebApplicationContext webCtx = new AnnotationConfigWebApplicationContext();
        // 注册context
        webCtx.register(ApplicationConfig.class);
        // 设置context
        webCtx.setServletContext(ctx);
        // 定义Servlet
        ServletRegistration.Dynamic servlet = ctx.addServlet("spring", new DispatcherServlet(webCtx));
        servlet.setLoadOnStartup(1);
        servlet.addMapping("/");
    }
}
```
这段代码配置了一个名为spring的Servlet, 所有的请求（/）都映射到这个Servlet中。  

## 2. spring的源码
在上一点中，可以看到关键的代码是现实了`WebApplicationInitializer`这个接口，很容易的找到这个接口唯一被引用的地方，即`org.springframework.web.SpringServletContainerInitializer`  
```java 
// HandlesTypes注解再这里的作用是tomcat回去扫描所有的WebApplicationInitializer的实现类，包括抽象类。
@HandlesTypes(WebApplicationInitializer.class)
public class SpringServletContainerInitializer implements ServletContainerInitializer {

	@Override
    // webAppInitializerClasses参数返回的就是所有的WebApplicationInitializer的实现类
	public void onStartup(@Nullable Set<Class<?>> webAppInitializerClasses, ServletContext servletContext)
			throws ServletException {

		List<WebApplicationInitializer> initializers = new LinkedList<>();

		if (webAppInitializerClasses != null) {
			for (Class<?> waiClass : webAppInitializerClasses) {
				// Be defensive: Some servlet containers provide us with invalid classes,
				// no matter what @HandlesTypes says...
				if (!waiClass.isInterface() && !Modifier.isAbstract(waiClass.getModifiers()) &&
						WebApplicationInitializer.class.isAssignableFrom(waiClass)) {
					try {
						initializers.add((WebApplicationInitializer)
								ReflectionUtils.accessibleConstructor(waiClass).newInstance());
					}
					catch (Throwable ex) {
						throw new ServletException("Failed to instantiate WebApplicationInitializer class", ex);
					}
				}
			}
		}

		if (initializers.isEmpty()) {
			servletContext.log("No Spring WebApplicationInitializer types detected on classpath");
			return;
		}

		servletContext.log(initializers.size() + " Spring WebApplicationInitializers detected on classpath");
		AnnotationAwareOrderComparator.sort(initializers);
        // 传入servletContext给WebApplicationInitializer的实现类，并调用onStartup方法，此方法又定义Servlet
		for (WebApplicationInitializer initializer : initializers) {
			initializer.onStartup(servletContext);
		}
	}
}

```

## 3. tomcat源码  
继续根据实现的接口`ServletContainerInitializer`追溯到tomcat源码中。 
再`org.apache.catalina.startup.ContextConfig#processServletContainerInitializers`方法中对`ServletContainerInitializer`的实现类进行了扫描，也就是扫描到了`SpringServletContainerInitializer`
```java
/**
* Scan JARs for ServletContainerInitializer implementations.
*/
protected void processServletContainerInitializers() {

    List<ServletContainerInitializer> detectedScis;
    try {
        WebappServiceLoader<ServletContainerInitializer> loader = new WebappServiceLoader<>(context);
        detectedScis = loader.load(ServletContainerInitializer.class);
    } catch (IOException e) {
        log.error(sm.getString(
                "contextConfig.servletContainerInitializerFail",
                context.getName()),
            e);
        ok = false;
        return;
    }
    // 省略一堆源码
}
```
到这里需要知道SPI(Service Provider Interface)，简单的说就是一个服务发现的解决方案，这个方案有JDK的实现和tomcat的实现，上面源码中的WebappServiceLoader就是tomcat的实现。
SPI中不得不说的配置文件就是`spring-web`包下`META-INFO/services`目录下的`javax.servlet.ServletContainerInitializer`文件,内容如下
```
org.springframework.web.SpringServletContainerInitializer
```
原理是，文件名称是服务发现的接口全路径名称，内容是接口实现类的全路径名称。SPI会创建这个实现类的实例，并通过接口调用`org.springframework.web.SpringServletContainerInitializer#onStartup`方法。

## 4. 总结
1. 整个过程就不再追溯到tomcat的再往上的源码了，我们已经可以了解到tomcat和spring是怎么样实现了不使用web.xml配置Servlet的了。  
2. 如果有继续想要了解JDK的SPI实现，可以看下`java.util.ServiceLoader`
3. 如果看完spring的这个实现还不是很懂，可以看`logback`日志框架的`ch.qos.logback.classic.servlet.LogbackServletContainerInitializer`实现。