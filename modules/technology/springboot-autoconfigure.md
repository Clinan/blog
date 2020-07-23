# springboot自动化配置

## Enable相关注解
1. `@SpringBootApplication`包含了`@SpringBootConfiguration(等同于@Configuration),@EnableAutoConfiguration,@ComponentScan`

## 主要的注解
1. `ConditionalOnClass`判断在类路径下是否存在该类，如果存在则执行方法
2. `ConditionalOnResource`判断在类路径下是否存在资源，如果存在则执行方法
3. `ConditionalOnMissingBean`判断BeanFactory中没有对应class或是name的Bean，不存在则执行方法
4. `Qualifier`限定符，可以指定注入的bean的名称，如果接口有多个实现类时，可以通过这个方式限定是哪个实现类
5. `@Import`实例化类成为Bean

## 如何作用
1. 如果引入了相关的jar包， `ConditionalOnClass`会检查是否有对应类的存在，然后初始化相关的bean
2. 如果有配置文件的存在，则需要`ConditionalOnResource`来判断文件是否存在
3. `ConditionalOnMissingBean`是为了避免用户自己配置了相关的bean,springboot还会再创建的冲突。
4. `Qualifier`是在避免不了第三点冲突上，提供一个name来指定注入的bean


## springboot war包启动
1. 启动类继承`SpringBootServletInitializer`
2. `pom.xml`中把打包方式改为war
3. 如果配置了端口，ssl等之类在配置文件中设置的参数，使用了外置容器（tomcat）之后将不会生效。
4. websocket的`ServerEndpointExporter`bean也要去掉，这个会在tomcat中自动配置好的。
