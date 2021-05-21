# tomcat

### `SocketServer`

参数

- `bindAddr` 

- `port`

- `backlog` requested maximum length of the queue of incoming connections, 传入的连接请求队列的最大长度

  ### 一个简单的web服务器

```java
public class HttpServer {
    public static void main(String[] args) throws Exception {
        InetAddress address = InetAddress.getByName("127.0.0.1");
        // 第二个参数是可以进入的连接的最大数量
        ServerSocket serverSocket = new ServerSocket(80, 2, address);
        Socket socket = serverSocket.accept();
        Request request = new Request(socket.getInputStream());
        request.parse();
        Response response = new Response(socket.getOutputStream());
        response.setRequest(request);
        response.sendStaticResource();
        socket.close();
    }
}

public class Request {
    private final InputStream inputStream;
    private String uri;
    public Request(InputStream inputStream) {this.inputStream = inputStream;}
    public void parse() {
        StringBuilder re = new StringBuilder(2048);
        int i;
        byte[] bytes = new byte[2048];
        try {
            i = inputStream.read(bytes);
        } catch (IOException e) {
            e.printStackTrace();
            i = -1;
        }
        for (int j = 0; j < i; j++) {
            re.append((char) bytes[j]);
        }
        System.out.println(re.toString());
        uri = parseUri(re.toString());
    }

    private String parseUri(String s) {
        int idx1, idx2;
        idx1 = s.indexOf(' ');
        if (idx1 != -1) {
            idx2 = s.indexOf(' ', idx1 + 1);
            if (idx2 > idx1) {
                return s.substring(idx1 + 1, idx2
                );
            }
        }
        return null;
    }

    public String getUri() {
        return uri;
    }
}


public class Response {
    private final OutputStream outputStream;
    private Request request;
    private static final int BUFFER_SIZE = 1024;
    private static final String ROOT = System.getProperty("user.dir") + File.separator + "webroot";
    public Response(OutputStream outputStream) {this.outputStream = outputStream;}

    public void setRequest(Request request) {
        this.request = request;
    }

    public void sendStaticResource() throws IOException {
        byte[] bytes = new byte[BUFFER_SIZE];
        FileInputStream fis = null;
        File file = new File(ROOT, request.getUri());
        try {
            if (file.exists()) {
                fis = new FileInputStream(file);
                int ch = fis.read(bytes, 0, BUFFER_SIZE);
                while (ch != -1) {
                    outputStream.write(bytes, 0, ch);
                    ch = fis.read(bytes, 0, BUFFER_SIZE);
                }
            } else {
                String for04 = "HTTP/1.1 404 File Not Found\r\n" +
                        "Content-Type:text/html\r\n"
                        + "Content-Length:23\r\n"
                        + "\r\n"
                        + "<h1>File Not Found<h1>";
                outputStream.write(for04.getBytes());
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fis != null) {
                fis.close();
            }
        }
    }
}
```



## Servlet容器





## Connector连接器

### Http1.1新特性

#### 持久连接

在http1.1中会默认使用持久连接，而不需要每次请求资源时都要建立连接，当然也可以显式使用。方法是浏览器发送以下请求头

`connection: keep-alive`

#### 块编码





#### 状态码100的使用



## Container接口

四种实现类的概念

- **Engine**：代表整个`Catalina servlet`引擎
- **Host**：代表一个或多个`Context`容器的虚拟主机
- **Context**：表示一个Web程序，一个`Context`可以有多个`Wrapper`
- **Wrapper**：表示一个独立的`Servlet`

这四个接口都继承了`Container`接口，标准实现类分别为`StandardEngine` `StandardHost`  `StandardContext` `StandardWrapper`，在`org.apache.catalina.core`包下。

一般情况下，Context下会有1个或多个Wrapper实例，Host势力中会有0个或多个`Context`实例。





## 载入器

### Loader接口

在loader接口中，会使用一个自定义类加载器`WebappClassLoader`，可以使用`Loader#getClassLoader()`方法来获取Web载入器中的`ClassLoader`

仓库集合操作：Web应用程序中的`WEB-INF/classes`和`WEB-INF/lib`目录是作为**仓库**添加到载入器中的。使用`Loader#addRepository()`可以添加一个仓库。`Loader#findRepositories()`返回仓库列表。

**Tomcat的载入器通常会与一个Context级别的servlet容器相关联**，而一个context又是一个web应用。所以每个web应用都会有一个自己的载入器。如果要是context容器中的一个类或多个类被修改了，载入器也可以支持对类的自动重载。

#### WebappLoader

Loader的默认实现。





### WebappClassLoader

tomcat相关包，不是由这个类加载，而是由父级类加载器加载。

## Session



## Security



