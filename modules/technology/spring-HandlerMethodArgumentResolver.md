# spring通过参数注解实现登录用户的注入

## 思路
在这里以token登录为例：
1. 方法添加了`@TokenLogin`注解，则判断用户是否登录
2. 如果方法的参数中使用了`@LoginUser`注解，且参数类型为`User`,则把参数注入给方法。
3. 主要继承类`HandlerMethodArgumentResolver`

## 配置类
```java
/**
 * @author lachen
 */
@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {
    @Autowired
    private LoginInterceptor loginInterceptor;
    @Autowired
    private LoginUserResolver loginUserResolver;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册拦截器，指定要拦截的url匹配规则为api开头的请求
        registry.addInterceptor(loginInterceptor).addPathPatterns("/api/**");
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        // 注册参数解析器
        resolvers.add(loginUserResolver);
    }

    /**
     * 解决中文乱码 日期格式化
     *
     * @param converters
     */
    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        for (HttpMessageConverter<?> httpMessageConverter : converters) {
            if (httpMessageConverter instanceof StringHttpMessageConverter) {
                ((StringHttpMessageConverter) httpMessageConverter).setDefaultCharset(StandardCharsets.UTF_8);
            }
            if (httpMessageConverter instanceof MappingJackson2HttpMessageConverter) {
                MappingJackson2HttpMessageConverter json = (MappingJackson2HttpMessageConverter) httpMessageConverter;
                ObjectMapper mapper = json.getObjectMapper();
                mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
                SimpleModule simpleModule = new SimpleModule();
                simpleModule.addSerializer(Long.class, new JsonSerializer<Long>() {
                    @Override
                    public void serialize(Long aLong, JsonGenerator jsonGenerator, SerializerProvider serializerProvider)
                     throws IOException, JsonProcessingException {
                        jsonGenerator.writeString(String.valueOf(aLong));
                    }
                });
                mapper.registerModule(simpleModule);
                mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
            }
        }

    }
}

```

## 请求拦截器（Interceptor）
用于拦截controller方法上添加了@TokenLogin的方法，如果请求头或是请求参数中都没有token,则直接返回500  
**请注意配置全局异常捕获器，捕获因为token超时，或是用户不存在的异常**
```java
/**
 * 拦截器，如果controller上添加了注解@TokenLogin的，当前用户没有登录，则会返回500
 *
 * @author lachen
 */
@Component
public class LoginInterceptor implements HandlerInterceptor {
    public static final String TOKEN_KEY = "token";
    public static final String USER_KEY = "userId";

    /**
     * @return 返回true 就可以跳转刀controller 否则返回500
     */
    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response, Object handler) {
        TokenLogin annotation;
        // 方法添加了@TokenLogin注解的才需要判断token是否存在，并判断是否登录
        if (handler instanceof HandlerMethod) {
            annotation = ((HandlerMethod) handler).getMethodAnnotation(TokenLogin.class);
        } else {
            return true;
        }
        if (annotation == null) {
            return true;
        }

        // 先从请求头中获取token 如果没有 则从参数中获取
        String token = request.getHeader(TOKEN_KEY);
        if (StringUtils.isBlank(token)) {
            token = request.getParameter(TOKEN_KEY);
        }

        if (StringUtils.isBlank(token)) {
            // FIXME 这里要有全局异常捕获类去捕获这个异常
            throw new RuntimeException("Token不能为空");
        }
        // FIXME 通过token查找userId 例如从redis中查找 同时判断token是否超时
        Long userId = getUserIdByToken(token);
        request.setAttribute(USER_KEY, userId);
        return true;
    }

    /**
     * 模拟通过token获取userId
     *
     * @param token token
     * @return userId
     */
    private Long getUserIdByToken(String token) {
        switch (token) {
            case "1":
                return 1L;
            case "2":
                return 2L;
            case "3":
                return 3L;
            case "4":
                return 4L;
            default:
                return 0L;
        }
    }
}
```

## 登录用户参数解析器
使用注入在`Interceptor`中通过token得到的用户ID查询用户，然后返回用户实例，用于注入到`@LoginUser`注解的参数中
```java
/**
 * 注入在bean的方法中使用{@code @LoginUser}注解的参数
 *
 * @author lachen
 */
@Component
public class LoginUserResolver implements HandlerMethodArgumentResolver {
    @Autowired
    private UserService userService;

    @Override
    public boolean supportsParameter(MethodParameter methodParameter) {
        // 检查参数类型并判断注解，只有符合并返回true,才会执行下面解析参数的方法
        return methodParameter.getParameterType().isAssignableFrom(User.class)
                && methodParameter.hasParameterAnnotation(LoginUser.class);
    }

    @Override
    public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer modelAndViewContainer,
                                  NativeWebRequest nativeWebRequest, WebDataBinderFactory webDataBinderFactory)
            throws Exception {
        // 获取作用域仅为request中的UserId参数，这个参数是再interceptor塞进去的
        Object attribute = nativeWebRequest.getAttribute(LoginInterceptor.USER_KEY, RequestAttributes.SCOPE_REQUEST);
        if (attribute == null) {
            return null;
        }
        // 根据userId查询用户信息 注入到方法的参数上
        return userService.getByUserId((Long) attribute);
    }
}

```
## 测试示例
```java
/**
 * @author lachen
 */
@RequestMapping("api/user/")
@RestController
public class UserController {

    @RequestMapping("test")
    @TokenLogin
    public String testLogin(@LoginUser User user) {
        return "user[" + user.getUsername() + "]is login";
    }

}

```

**发送请求**  
需要在请求体中，或是请求头中添加token=1的参数，如此才能正确的返回，其他的都会被认定为尚未登录

## 源码
[https://github.com/Clinan/SpringAPILoginDemo](https://github.com/Clinan/SpringAPILoginDemo)
