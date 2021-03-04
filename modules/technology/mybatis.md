# mybatis

## 主要的类介绍
### SqlSessionFactoryBuilder
- 从XML解析配置到Configuration,使用Configuration构造SqlSessionFactory
- 通过Java代码构造SqlSessionFactory.使用`org.apache.ibatis.session.SqlSessionFactoryBuilder#build(org.apache.ibatis.session.Configuration)`即可构造.

### Configuration 
Mybatis的配置类,可以在这里配置Mysql的配置项

### SqlSessionFactory
默认实现类DefaultSqlSessionFactory, 由SqlSessionFactoryBuilder.build()方法构造.   
提供6个方法创建SqlSession实例,使用不同的方法时应考虑
- **事务控制**, 是否开启autocommit,还是自定义事务作用域.
- **数据库连接**,是使用已配置的Datasource,还是使用自定义的connection
- **语句执行**,是复用PreparedStatement,或批量更新语句（包括插入语句和删除语句）吗？

默认的openSession()方法没有参数,默认具备如下参数
- 事务作用域开启,禁用autocommit
- 从当前环境中的Datasouce中获取Connection
- 事务隔离级别使用数据库或是jdbc的默认隔离级别
- PreparedStatement等语句不会复用


### Excutor
执行器
处理缓存, CachingExecutor代理了真正的Executor(一般是SimpleExecutor)实现类


### StatementHandler
构造`java.sql.Statement`对象, 创建真正用于执行的sql

### DefaultResultSetHandler
结果集处理


## mapper文件加载

## 缓存
### 本地缓存(一级缓存)
默认开启, 事务性的,针对每个`sqlSession`.

**问题 对已缓存的查询记录更新了 缓存会变吗?**
不会,每次增删改查后,都会清空本地缓存.

### 二级缓存
默认关闭, 可以
- eviction 配置缓存算法`LRU`, 
- flushInterval 刷新的时间间隔, 单位毫秒, 
- size 缓存的引用大小.
- readOnly true,每次返回的对象都一样, false返回不同的对象. 



## xml标签解析

- XML里的特殊对象都会实现接口`SqlNode`,例如

  - `MixedSqlNode（多个sqlNode的数组）,ForEachSqlNode,WhereSqlNode`等
  - `VarDeclSqlNode`支持Ognl语法，没有标签
  - `TrimSqlNode` 删除前后空格标签
  - `SetSqlNode` update中的set标签
  - `TextSqlNode` <sql>标签，会去解析里面的#{}
  - `IfSqlNode`中的表达式都是根据Ognl规范解析的
  
- `org.apache.ibatis.mapping.MappedStatement#getBoundSql ` 
-  `rootSqlNode.apply(context);` 在此处会调用各自的实力对象，对数组里的每个SqlNode对象进行apply，root一般是MixedSqlNode,最后根据顺序拼接为String
    
  - ` sqlSourceParser.parse(context.getSql(), parameterType, context.getBindings());`处理sql里的参数，排序好参数，便于构建sql的`Statement`



## 插件

插件链`InterceptorChain` 维护了所有的插件

插件的类型

- `Configuration#newParameterHandler`参数插件，传参是`ParameterHandler`
- `Configuration#newResultSetHandler`参数插件，传参是`ResultSetHandler`
-  `Configuration#newStatementHandler`参数插件，传参是`StatementHandler`
-  `Configuration#newExecutor(org.apache.ibatis.transaction.Transaction, org.apache.ibatis.session.ExecutorType)`参数插件，传参是`Executor` 一般是`SimpleExecutor`

### 插件的调用

在SimpleExecutor中调用doUpdate,doQuery,doQueryCursor方法中

```java
configuration.newStatementHandler(wrapper, ms, parameter, rowBounds, resultHandler, boundSql);
```
```java
public StatementHandler newStatementHandler(Executor executor, MappedStatement mappedStatement, Object parameterObject, RowBounds rowBounds, ResultHandler resultHandler, BoundSql boundSql) {
      StatementHandler statementHandler = new RoutingStatementHandler(executor, mappedStatement, parameterObject, rowBounds, resultHandler, boundSql);
      // 调用通知插件链里的所有插件
      statementHandler = (StatementHandler) interceptorChain.pluginAll(statementHandler);
      return statementHandler;
    }
```

```
for (Interceptor interceptor : interceptors) {
	  // 注意调用插件拦截器
      target = interceptor.plugin(target);
    }
```


## 结果集处理

结果集分为两种

- type
  - `DefaultResultSetHandler#applyAutomaticMappings`
- map: 
  - `DefaultResultSetHandler#applyPropertyMappings`



## 日志的打印

`ConnectionLogger`使用jdk动态代理了`java.sql.Connection`对象

```java
@Override
  public Object invoke(Object proxy, Method method, Object[] params)
      throws Throwable {
    try {
      if (Object.class.equals(method.getDeclaringClass())) {
        return method.invoke(this, params);
      }
      if ("prepareStatement".equals(method.getName()) || "prepareCall".equals(method.getName())) {
        if (isDebugEnabled()) {
          debug(" Preparing: " + removeExtraWhitespace((String) params[0]), true);
        }
        PreparedStatement stmt = (PreparedStatement) method.invoke(connection, params);
        stmt = PreparedStatementLogger.newInstance(stmt, statementLog, queryStack);
        return stmt;
      } else if ("createStatement".equals(method.getName())) {
        Statement stmt = (Statement) method.invoke(connection, params);
        stmt = StatementLogger.newInstance(stmt, statementLog, queryStack);
        return stmt;
      } else {
        return method.invoke(connection, params);
      }
    } catch (Throwable t) {
      throw ExceptionUtil.unwrapThrowable(t);
    }
  }
```



[^未完待续]: 。。。。。。。

