# WebSokcet 前后端联调使用

> 作者：[为](https://blog.csdn.net/Go_ahead_forever)，[编程导航](https://www.codefather.cn) 编号 14255

WebSocket 在 JS 以及 SpringBoot 中的使用

WebSocket 是一种网络通信协议，用于实现双向通信。在前端中，你可以使用 JavaScript 中的 `WebSocket` 对象来创建 WebSocket 连接，发送和接收数据。

## 前端

### 连接的建立

通过创建一个 WebSocket 对象建立一个 WebSocket 连接

例如：

```js
const ws = new WebSocket('ws://localhost:8080/channel/echo');
```

传给对象的参数是通过 WebSocket 协议通讯的网络地址。

### 接收消息

接收消息这里指的是接收服务端的消息。

这里有两种方法。

1. **使用 `addEventListener`**： 你可以使用 `addEventListener` 来监听 `message` 事件，这是最常见的方式，也是推荐的做法。

   ```javascript
   ws.addEventListener('message', (event) => {
       const receivedMessage = event.data;
       console.log('Received message from server:', receivedMessage);
       // 在这里处理接收到的消息
   });
   ```

2. **使用 `onmessage` 属性**： 除了使用 `addEventListener`，你还可以直接设置 `onmessage` 属性来指定消息处理函数。这与之前的示例相似，但更简洁：

   ```javascript
   ws.onmessage = function (event) {
       const receivedMessage = event.data;
       console.log('Received message from server:', receivedMessage);
       // 在这里处理接收到的消息
   };
   ```

### 发送消息

**发送消息到服务器**： 使用 `send()` 方法将消息发送到服务器：

```javascript
ws.send('Hello, server!'); // 发送消息给服务器
```

### 关闭连接

**关闭 WebSocket 连接**： 要关闭 WebSocket 连接，你可以简单地使用 `WebSocket.close()` 方法，例如：

```javascript
ws.close();
```

如果 WebSocket 连接的 `readyState` 已经处于 `CLOSE` 状态，那么该方法不会执行任何操作

检查 WebSocket 是否打开： 你可以通过检查 `WebSocket` 的 `readyState` 属性来判断 WebSocket 是否打开。如果 `readyState` 的值为 `WebSocket.OPEN`，则表示连接已打开：

```javascript
if (ws.readyState === WebSocket.OPEN) {
    // WebSocket 连接已打开
}
```

这样你就可以在代码中判断 WebSocket 是否处于打开状态了

### 处理

**处理连接状态**： 你可以监听其他事件，例如 `open`、`close` 和 `error`，以处理连接的不同状态：

```javascript
ws.addEventListener('open', (event) => {
    console.log('WebSocket 已连接');
});

ws.addEventListener('close', (event) => {
    console.log('WebSocket 连接已关闭');
});

ws.addEventListener('error', (event) => {
    console.error('WebSocket 连接出现异常:', event.error);
});
```

同样可以使用onclose 、 onerror 、 onopen 属性定义时间监听函数。

WebSocket 是一种基于 TCP 协议的全双工通信协议，它允许客户端和服务器之间建立持久的、双向的通信连接。相比传统的 HTTP 请求 - 响应模式，WebSocket 提供了实时、低延迟的数据传输能力。通过 WebSocket，客户端和服务器可以在任意时间点互相发送消息，实现实时更新和即时通信的功能。WebSocket 协议经过了多个浏览器和服务器的支持，成为了现代 Web 应用中常用的通信协议之一。它广泛应用于聊天应用、实时数据更新、多人游戏等场景，为 Web 应用提供了更好的用户体验和更高效的数据传输方式。

本文将会指导你如何在 Spring Boot 中整合、使用 WebSocket，以及如何在 `@ServerEndpoint` 类中注入其他 Bean 依赖 。

在 Spring Boot 中使用 WebSocket 有 2 种方式。第 1 种是使用由 Jakarta EE 规范提供的 Api，也就是 `jakarta.websocket` 包下的接口。第 2 种是使用 spring 提供的支持，也就是 [`spring-websocket`](https://github.com/spring-projects/spring-framework/tree/main/spring-websocket) 模块。前者是一种独立于框架的技术规范，而后者是 Spring 生态系统的一部分，可以与其他 Spring 模块（如 Spring MVC、Spring Security）无缝集成，共享其配置和功能。

2 种方式各有优劣，你可以按需选择。本文将使用第 1 种方式，也就是使用 `jakarta.websocket` 来开发 WebSocket 应用。

软件版本：

- Spring Boot：`3.1.3`

## 在 Spring Boot 中整合 WebSocket

### 添加依赖

在 `pom.xml` 中添加 `spring-boot-starter-websocket` 依赖。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

### 开发 ServerEndpoint 端点

服务端 WebSocket 端点的开发也有 2 种方式。第 1 种是实现规范所提供的各种接口，通过接口定义的回调方法来处理新的连接、客户端消息、连接断开等等事件。另一种方式是使用注解，类似于 Spring 中的 Controller，通过在方法上使用不同的注解来监听不同的 WebSocket 事件，灵活性比较高，推荐使用。

我们打算创建一个 `echo` 端点，该端点会处理客户端的连接、断开、消息事件。在收到消息后，我们会在消息前面加上服务器时间戳和 `Hello` 前缀，原样写回给客户端。如果客户端发送的消息为 `bye`，则服务器会主动断开与客户端的连接。

```java
package cn.springdoc.demo.channel;

import java.io.IOException;
import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.websocket.CloseReason;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

// 使用 @ServerEndpoint 注解表示此类是一个 WebSocket 端点
// 通过 value 注解，指定 websocket 的路径
@ServerEndpoint(value = "/channel/echo")
public class EchoChannel {

    private static final Logger LOGGER = LoggerFactory.getLogger(EchoChannel.class);

    private Session session;

    // 收到消息
    @OnMessage
    public void onMessage(String message) throws IOException{
        
        LOGGER.info("[websocket] 收到消息：id={}，message={}", this.session.getId(), message);
        
        if (message.equalsIgnoreCase("bye")) {
            // 由服务器主动关闭连接。状态码为 NORMAL_CLOSURE（正常关闭）。
            this.session.close(new CloseReason(CloseReason.CloseCodes.NORMAL_CLOSURE, "Bye"));;
            return;
        }
        
        
        this.session.getAsyncRemote().sendText("["+ Instant.now().toEpochMilli() +"] Hello " + message);
    }

    // 连接打开
    @OnOpen
    public void onOpen(Session session, EndpointConfig endpointConfig){
        // 保存 session 到对象
        this.session = session;
        LOGGER.info("[websocket] 新的连接：id={}", this.session.getId());
    }

    // 连接关闭
    @OnClose
    public void onClose(CloseReason closeReason){
        LOGGER.info("[websocket] 连接断开：id={}，reason={}", this.session.getId(),closeReason);
    }

    // 连接异常
    @OnError
    public void onError(Throwable throwable) throws IOException {
        
        LOGGER.info("[websocket] 连接异常：id={}，throwable={}", this.session.getId(), throwable.getMessage());
        
        // 关闭连接。状态码为 UNEXPECTED_CONDITION（意料之外的异常）
        this.session.close(new CloseReason(CloseReason.CloseCodes.UNEXPECTED_CONDITION, throwable.getMessage()));
    }
}
```

首先，使用 `@ServerEndpoint` 注解表示此类是一个 WebSocket 端点，`value` 属性是必须的，用于设置路由。它还有其他的一些可选属性可以用于自定义子协议、消息编码器、消息解码器、握手处理器等等，篇幅原因这里不展开。

#### @OnMessage

`@OnMessage` 注解用于监听客户端消息事件，它只有一个属性 `long maxMessageSize() default -1;` 用于限制客户端消息的大小，如果小于等于 0 则表示不限制。当客户端消息体积超过这个阈值，那么服务器就会主动断开连接，状态码为：`1009`。方法的参数可以是基本的 `String` / `byte[]` 或者是 `Reader` / `InputStream`，分别表示 WebSocket 中的文本和二进制消息。也可以是自定义的 Java 对象，但是需要在 `@ServerEndpoint` 中配置对象的解码器（`jakarta.websocket.Decoder`）。对于内容较长的消息，支持分批发送，可以在消息参数后面定义一个布尔类型的 `boolean last`参数，如果该值为 `true` 则表示此消息是批次消息中的最后一条。

```java
@OnMessage
public void onMessage(String message, boolean last) throws IOException{
    if (last) {
            // 这是批量消息的最后一条
    }
}
```

#### @OnOpen

`@OnOpen` 方法用于监听客户端的连接事件，它没有任何属性。可以作为方法参数的对象有很多，`Session` 对象是必须的，表示当前连接对象，我们可以通过此对象来执行发送消息、断开连接等操作。WebSocket 的连接 URL，类似于 Http 的 URL，也可以传递查询参数、path 参数。通常用于传递认证、鉴权用的 Token 或其他信息。

要获取查询参数，我们可以通过 `Session` 的 `getRequestParameterMap();` 获取。

```java
Map<String, List<String>> query = session.getRequestParameterMap();
```

要获取 path 参数，首先要在 `@ServerEndpoint` 中定义 path 参数，类似于 Spring Mvc 的 path 参数定义。例如： `@ServerEndpoint(value = "/channel/echo/{id}")`。那么我们可以在 `@OnOpen` 方法中使用 `@PathParam` 注解接收，如下：

```java
@ServerEndpoint(value = "/channel/echo/{id}")

...

@OnOpen
public void onOpen(Session session, @PathParam("id") Long id, EndpointConfig endpointConfig){
    ....
}
```

示例中的最后一个参数 `EndpointConfig` ，它是可选，用于获取全局的一些配置。在本文中未用到。

#### @OnClose

`@OnClose` 用于处理连接断开事件，参数中可以指定一个 `CloseReason` 对象，它封装了断开连接的状态码、原因信息。

#### @OnError

`@OnError` 用于处理异常事件，**该方法必须要有一个 `Throwable` 类型的参数**，表示发生的异常。否则应用会启用失败：

```txt
Caused by: jakarta.websocket.DeploymentException: No Throwable parameter was present on the method [onError] of class [cn.springdoc.demo.channel.EchoChannel] that was annotated with OnError
    at org.apache.tomcat.websocket.pojo.PojoMethodMapping.getPathParams(PojoMethodMapping.java:311) ~[tomcat-embed-websocket-10.1.12.jar:10.1.12]
    at org.apache.tomcat.websocket.pojo.PojoMethodMapping.<init>(PojoMethodMapping.java:194) ~[tomcat-embed-websocket-10.1.12.jar:10.1.12]
    at org.apache.tomcat.websocket.server.WsServerContainer.addEndpoint(WsServerContainer.java:130) ~[tomcat-embed-websocket-10.1.12.jar:10.1.12]
    at org.apache.tomcat.websocket.server.WsServerContainer.addEndpoint(WsServerContainer.java:240) ~[tomcat-embed-websocket-10.1.12.jar:10.1.12]
    at org.apache.tomcat.websocket.server.WsServerContainer.addEndpoint(WsServerContainer.java:198) ~[tomcat-embed-websocket-10.1.12.jar:10.1.12]
    at org.springframework.web.socket.server.standard.ServerEndpointExporter.registerEndpoint(ServerEndpointExporter.java:156) ~[spring-websocket-6.0.11.jar:6.0.11]
    ... 12 common frames omitted
```

所有事件方法，都支持使用 `Session` 作为参数，表示当前连接参数。但是为了更加方便，我们在 `@OnOpen` 事件中直接把 `Session` 存储到了当前对象中，可以在任意方法中使用 `this` 访问。服务器会为每个连接创建一个端点对象，所以这是线程安全的。

上面还提到了一个 “连接关闭状态码”，WebSocket 协议定义了一系列状态码来表示连接断开的原因，这些状态码定义在了 `CloseReason.CloseCodes` 枚举中。

### 配置 ServerEndpointExporter

定义好端点后，需要在配置类中通过定义 `ServerEndpointExporter` Bean 进行注册。

```java
package cn.springdoc.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

import cn.springdoc.demo.channel.EchoChannel;

@Configuration
public class WebSocketConfiguration {

    @Bean  
    public ServerEndpointExporter serverEndpointExporter (){
        
        ServerEndpointExporter exporter = new ServerEndpointExporter();
        
        // 手动注册 WebSocket 端点
        exporter.setAnnotatedEndpointClasses(EchoChannel.class);
        
        return exporter;
    }  
}
```

你也可以在 WebSocket 端点上添加 `@Component` 注解，使用 Spring 自动扫描，这样的话不需要手动调用 `setAnnotatedEndpointClasses` 方法进行注册。

### 测试

在项目的 `src/main/resources` 目录下创建一个 `public` 文件夹，再在此文件夹中新建一个 `index.html` 文件，作为 WebSocket 客户端。内容如下：

> Spring Boot 默认会把 `public` 目录下的 `index.html` 作为应用主页。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>WebSocket</title>
</head>
<body>
    <script type="text/javascript">
        let websocket = new WebSocket("ws://localhost:8080/channel/echo");
        
        // 连接断开
        websocket.onclose = e => {
            console.log(`连接关闭: code=${e.code}, reason=${e.reason}`)
        }
        // 收到消息
        websocket.onmessage = e => {
            console.log(`收到消息：${e.data}`);
        }
        // 异常
        websocket.onerror = e => {
            console.log("连接异常")
            console.error(e)
        }
        // 连接打开
        websocket.onopen = e => {
            console.log("连接打开");
            
            // 创建连接后，往服务器连续写入3条消息
            websocket.send("sprigdoc.cn");
            websocket.send("sprigdoc.cn");
            websocket.send("sprigdoc.cn");
            
            // 最后发送 bye，由服务器断开连接
            websocket.send("bye");
            
            // 也可以由客户端主动断开
            // websocket.close();
        }
    </script>
</body>
</html>
```

内容很简单，网页加载后运行 Javascript 代码。立即创建与 `ws://localhost:8080/channel/echo` 的 WebSocket 连接对象，通过注册对象的各种监听方法来处理事件。

在连接就绪后，也就是在 `onopen` 方法中往服务器端点发送了 3 条消息。按照逻辑，服务端也会回复 3 条消息，这会触发 `onmessage` 事件，把消息内容输出到控制台。最后，发送 `bye`，服务器收到消息后会主动断开连接，这就会触发 `onclose` 事件，把 “连接关闭状态码” 和原因输出到控制台。

> 其实你可以直接把这段 Javascript 代码复制到任意支持 WebSocket 的浏览器的控制台执行，WebSocket 没有跨域的说法！

启动应用，打开浏览器（先打开控制台），然后访问 `http://localhost:8080/`，查看控制台输出的日志：

```txt
连接打开
收到消息：[1694505275009] Hello sprigdoc.cn
收到消息：[1694505275012] Hello sprigdoc.cn
收到消息：[1694505275014] Hello sprigdoc.cn
连接关闭: code=1000, reason=Bye
```

再看看服务端控制台日志：

```txt
cn.springdoc.demo.channel.EchoChannel    : [websocket] 新的连接：id=0
cn.springdoc.demo.channel.EchoChannel    : [websocket] 收到消息：id=0，message=sprigdoc.cn
cn.springdoc.demo.channel.EchoChannel    : [websocket] 收到消息：id=0，message=sprigdoc.cn
cn.springdoc.demo.channel.EchoChannel    : [websocket] 收到消息：id=0，message=sprigdoc.cn
cn.springdoc.demo.channel.EchoChannel    : [websocket] 收到消息：id=0，message=bye
cn.springdoc.demo.channel.EchoChannel    : [websocket] 连接断开：id=0，reason=CloseReason: code [1000], reason [Bye]
```

没有任何问题，一切按照我们预定义的逻辑在运行。客户端发送 3 条消息，服务器响应 3 条消息，最后断开连接。客户端、服务器相应的事件方法都成功执行。

服务端日志中的 sessionId（`id=0`），是通过 `Session` 的 `String getId();` 方法获取的。服务器会为每个连接分配一个不同的 id 值，不同服务器生成的 id 类型不一样。 Tomcat 使用从 0 开始的自增值（本例），Undertow 使用的是类似于 UUID 的 32 位长度的字符串。

### 在端点中注入 Bean

往往我们需要在端点中使用其他 Spring 管理的 Bean 来完成业务，例如认证、鉴权、保存消息。。。等等。

假如我们有一个 `UserService` 服务类，内容如下：

```java
package cn.springdoc.demo.service;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    public void foo() {}

    // ....
}
```

我们现在要在端点中注入使用它，很多人会直接在端点类上使用 `@Component` 注解，然后注入：

```java
@ServerEndpoint(value = "/channel/echo")
@Component  // 注册为 Spring 组件
public class EchoChannel {

    @Autowired // 注入需要的 Bean
    private UserService userService;

    // ...

    @OnOpen
    public void onOpen(Session session, EndpointConfig endpointConfig){

        this.session = session;

        // 在业务中使用
        this.userService.foo();
    }
}
```

服务可以正常启动，看似一切都没问题！可是当你在事件方法中使用这 Bean 的时候就会导致 `NullPointerException` 异常。

```txt
java.lang.NullPointerException: Cannot invoke "cn.springdoc.demo.service.UserService.foo()" because "this.userService" is null
    at cn.springdoc.demo.channel.EchoChannel.onOpen(EchoChannel.java:54)
    at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
    at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.base/java.lang.reflect.Method.invoke(Method.java:568)
    at org.apache.tomcat.websocket.pojo.PojoEndpointBase.doOnOpen(PojoEndpointBase.java:67)
    at org.apache.tomcat.websocket.pojo.PojoEndpointServer.onOpen(PojoEndpointServer.java:46)
    at org.apache.tomcat.websocket.server.WsHttpUpgradeHandler.init(WsHttpUpgradeHandler.java:131)
    at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:936)
    at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1740)
    at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)
    at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191)
    at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
    at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
    at java.base/java.lang.Thread.run(Thread.java:833)
```

**原因：运行时的 WebSocket 连接对象，也就是端点实例，是由服务器创建，而不是 Spring，所以不能使用自动装配**。上文也提到过 “服务器会为每个连接创建一个端点实例对象”。

知道了原因后，解决办法也很简单，我们可以使用 Spring 的 `ApplicationContextAware` 接口，在应用启动时获取到 `ApplicationContext` 并且保存在全局静态变量中。

服务器每次创建连接的时候，我们就在 `@OnOpen` 事件方法中从 `ApplicationContext` 获取到需要 Bean 来初始化端点对象。

```java
@ServerEndpoint(value = "/channel/echo")
@Component  // 由 spring 扫描管理
public class EchoChannel implements
                ApplicationContextAware { // 实现 ApplicationContextAware 接口， Spring 会在运行时注入 ApplicationContext

    private static final Logger LOGGER = LoggerFactory.getLogger(EchoChannel.class);

    // 全局静态变量，保存 ApplicationContext
    private static ApplicationContext applicationContext;

    private Session session;

    // 声明需要的 Bean
    private UserService userService;


    // 保存 Spring 注入的 ApplicationContext 到静态变量
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        EchoChannel.applicationContext = applicationContext;
    }

    @OnOpen
    public void onOpen(Session session, EndpointConfig endpointConfig){
        
        // 保存 session 到对象
        this.session = session;
        
        // 连接创建的时候，从 ApplicationContext 获取到 Bean 进行初始化
        this.userService = EchoChannel.applicationContext.getBean(UserService.class);
        
        // 在业务中使用
        this.userService.foo();
        
        LOGGER.info("[websocket] 新的连接：id={}", this.session.getId());
    }
    // ....
}
```

`onOpen` 方法在整个连接的生命周期中，只会执行一次，所以这种方式不会带来通信时的性能损耗。