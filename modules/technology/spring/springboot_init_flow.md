# springboot 的启动流程

## 创建SpringApplication对象
```java
public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
		this.resourceLoader = resourceLoader;
    // primarySources 是启动类，即springboot的启动类
		Assert.notNull(primarySources, "PrimarySources must not be null");
		this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
		this.webApplicationType = WebApplicationType.deduceFromClasspath();
		setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
		setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
		this.mainApplicationClass = deduceMainApplicationClass();
}
```
### getSpringFactoriesInstances
这个方法的作用就是查询`/META-INF/spring.factories`中声明接口的实现类，一般这些实现类用于初始化。如果有自己额外的实现类声明可以在`META-INF`新建这样的文件声明。
<details>
<summary>官方的spring.factories</summary>


```
# PropertySource Loaders
# 在初始化ConfigFileApplicationListener时被加载，并被执行
org.springframework.boot.env.PropertySourceLoader=\
org.springframework.boot.env.PropertiesPropertySourceLoader,\
org.springframework.boot.env.YamlPropertySourceLoader

# Run Listeners
# 第三个被加载，在准备enviroment时执行
org.springframework.boot.SpringApplicationRunListener=\
org.springframework.boot.context.event.EventPublishingRunListener

# Error Reporters
org.springframework.boot.SpringBootExceptionReporter=\
org.springframework.boot.diagnostics.FailureAnalyzers

# Application Context Initializers
# 第一个被加载 在environment准备后，context初始化后执行
org.springframework.context.ApplicationContextInitializer=\
org.springframework.boot.context.ConfigurationWarningsApplicationContextInitializer,\
org.springframework.boot.context.ContextIdApplicationContextInitializer,\
org.springframework.boot.context.config.DelegatingApplicationContextInitializer,\
org.springframework.boot.rsocket.context.RSocketPortInfoApplicationContextInitializer,\
org.springframework.boot.web.context.ServerPortInfoApplicationContextInitializer

# Application Listeners
# 第二个被加载
org.springframework.context.ApplicationListener=\
org.springframework.boot.ClearCachesApplicationListener,\
org.springframework.boot.builder.ParentContextCloserApplicationListener,\
org.springframework.boot.cloud.CloudFoundryVcapEnvironmentPostProcessor,\
org.springframework.boot.context.FileEncodingApplicationListener,\
org.springframework.boot.context.config.AnsiOutputApplicationListener,\
org.springframework.boot.context.config.ConfigFileApplicationListener,\
org.springframework.boot.context.config.DelegatingApplicationListener,\
org.springframework.boot.context.logging.ClasspathLoggingApplicationListener,\
org.springframework.boot.context.logging.LoggingApplicationListener,\
org.springframework.boot.liquibase.LiquibaseServiceLocatorApplicationListener

# Environment Post Processors
# 在 ConfigFileApplicationListener 中被加载并执行
org.springframework.boot.env.EnvironmentPostProcessor=\
org.springframework.boot.cloud.CloudFoundryVcapEnvironmentPostProcessor,\
org.springframework.boot.env.SpringApplicationJsonEnvironmentPostProcessor,\
org.springframework.boot.env.SystemEnvironmentPropertySourceEnvironmentPostProcessor,\
org.springframework.boot.reactor.DebugAgentEnvironmentPostProcessor

# Failure Analyzers
org.springframework.boot.diagnostics.FailureAnalyzer=\
org.springframework.boot.diagnostics.analyzer.BeanCurrentlyInCreationFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.BeanDefinitionOverrideFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.BeanNotOfRequiredTypeFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.BindFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.BindValidationFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.UnboundConfigurationPropertyFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.ConnectorStartFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.NoSuchMethodFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.NoUniqueBeanDefinitionFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.PortInUseFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.ValidationExceptionFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.InvalidConfigurationPropertyNameFailureAnalyzer,\
org.springframework.boot.diagnostics.analyzer.InvalidConfigurationPropertyValueFailureAnalyzer

# FailureAnalysisReporters
org.springframework.boot.diagnostics.FailureAnalysisReporter=\
org.springframework.boot.diagnostics.LoggingFailureAnalysisReporter

```
</details>


### setInitializers
全都是`ApplicationContextInitializer`的实现类，官方是这样定义的
- 用于在spring容器刷新之前初始化Spring ConfigurableApplicationContext的回调接口。（剪短说就是在容器刷新之前调用该类的 initialize 方法。并将 ConfigurableApplicationContext 类的实例传递给该方法）
- 通常用于需要对应用程序上下文进行编程初始化的web应用程序中。例如，根据上-下文环境注册属性源或激活配置文件等。
- 可排序的（实现Ordered接口，或者添加@Order注解）

### setListeners

- 由application实现的事件监听器接口。
- 基于Observer设计模式的标准java.util.EventListener接口。
- 从Spring 3.0开始，ApplicationListener可以一般性地声明其感兴趣的事件类型。向Spring ApplicationContext注册后，将相应地过滤事件，并且仅针对匹配事件对象调用侦听器。
- **其中配置文件的加载类`ConfigFileApplicationListener`就是其实现类之一**

## run
核心方法，启动加载spring，启动tomcat容器
<details>
<summary>源码</summary>

```java
public ConfigurableApplicationContext run(String... args) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		ConfigurableApplicationContext context = null;
		Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();
		configureHeadlessProperty();
		SpringApplicationRunListeners listeners = getRunListeners(args);
		listeners.starting();
		try {
			ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
			// 准备环境，发布事件，配置文件加载。执行EnvironmentPostProcessor
            ConfigurableEnvironment environment = prepareEnvironment(listeners, applicationArguments);
			configureIgnoreBeanInfo(environment);
			Banner printedBanner = printBanner(environment);
			context = createApplicationContext();
			exceptionReporters = getSpringFactoriesInstances(SpringBootExceptionReporter.class,
					new Class[] { ConfigurableApplicationContext.class }, context);
			// 执行ApplicationContextInitializer
            prepareContext(context, environment, listeners, applicationArguments, printedBanner);
            // 最后调用AbstractApplicationContext的refresh()
            // 初始化执行postProcessBeanFactory
			refreshContext(context);
			afterRefresh(context, applicationArguments);
			stopWatch.stop();
			if (this.logStartupInfo) {
				new StartupInfoLogger(this.mainApplicationClass).logStarted(getApplicationLog(), stopWatch);
			}
			listeners.started(context);
			callRunners(context, applicationArguments);
		}
		catch (Throwable ex) {
			handleRunFailure(context, ex, exceptionReporters, listeners);
			throw new IllegalStateException(ex);
		}

		try {
			listeners.running(context);
		}
		catch (Throwable ex) {
			handleRunFailure(context, ex, exceptionReporters, null);
			throw new IllegalStateException(ex);
		}
		return context;
	}
```
</details>

### StopWatch
- 简单的秒表，允许为多个任务计时，公开总运行时间和每个命名任务的运行时间。隐藏System.nanoTime（）的使用，提高了应用程序代码的可读性，并减少了计算错误的可能性。
- 请注意，此对象并非设计为线程安全的，并且不使用同步。此类通常用于在概念验证工作和开发过程中验证性能，而不是作为生产应用程序的一部分。
- 从Spring Framework 5.2开始，以纳秒为单位跟踪和报告运行时间。

### prepareEnvironment
- 创建和配置Environment
- 获取配置文件，



### createApplicationContext()

这个方法构造了Application的上下文，同时也初始化了一个bean工厂

通过servlet启动的方式会创建一个`ConfigurableApplicationContext`的实现类`AnnotationConfigServletWebServerApplicationContext`的对象。在这个对象的父类`GenericApplicationContext`构造中创建`beanFactory`

```java
public AnnotationConfigServletWebServerApplicationContext() {
   	// 这里会创建一个ConfigurationClassPostProcessor的实例
    //AnnotationConfigUtils#registerAnnotationConfigProcessors
    // 并放到beanFactory的BeanDefinitionMap中
    this.reader = new AnnotatedBeanDefinitionReader(this);
 	// 
    this.scanner = new ClassPathBeanDefinitionScanner(this);
}
```


### AbstractApplication.refresh()

可以看到，run方法了，调用refresh()之前都是没有扫描bean的。只是准备了配置文件和监听器之类的。

