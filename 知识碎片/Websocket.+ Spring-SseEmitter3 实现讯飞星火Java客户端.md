# Websocket.+ Spring-SseEmitter3 实现讯飞星火Java客户端

> 作者：[摸鱼摆烂小能手](http://blog.dhx.icu)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 1083

通过websocket+SseEmitter实现讯飞星火Java客户端 , 一键CV即可接入springboot项目使用

本篇文章主要记录完成 对接讯飞星火的Java 客户端 (适配于Spring) , 方便在之后项目开发的过程中进行快速接入

- 星火认知大模型Web API文档 : [https://www.xfyun.cn/doc/spark/Web.html#_1-%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E](https://www.xfyun.cn/doc/spark/Web.html#_1-接口说明)

## websocket

### 简介

在此之前我们先来简单了解一下websocket协议

**WebSocket**是一种在客户端和服务器之间建立长连接的技术，使得两者可以通过TCP套接字进行全双工通信。

通信的**双方都可以同时发送和接收数据**，而无需等待对方完成其操作。

其实现了浏览器与服务器**全双工**通信，能更好的节省服务器资源和带宽并达到实时通讯

**WebSocket**建立在 TCP 之上，同 HTTP 一样通过 TCP 来传输数据，但是它和 HTTP 最大不同是：

- WebSocket 是一种**双向通信协议**，在建立连接后，WebSocket 服务器和 Browser/Client Agent 都能主动的向对方发送或接收数据
- WebSocket 需要类似 TCP 的客户端和服务器端通过握手连接，连接成功后才能相互通信。
- HTTP是一种无状态的请求/响应协议。它允许客户端从服务器获取资源，但是并不支持持久连接或双向通信。每次请求都需要重新建立TCP连接，因此对于频繁交互的应用来说效率较低。

> 关于 全双工通信和半双工通信
>
> 在通信系统中，**双工是指同时进行的两个方向的数据传输**。其中，全双工表示数据可以在两个方向同时传输，**而半双工则指数据在同一时间只能在一个方向上传输。**
>
> 场景的场景比如 : **电话对话和面对面交谈**

### demo

接下来我们通过 `javax.websocket`包来实现简单的demo , 更好理解websocket的工作流程以及方式

准备工作:

- Postman : 充当 websocket 客户端
- Springboot Application : 搭建websocket server

引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

示例代码

#### `WebSocketServer.java`

该文件 会在客户端连接 , 断开 , 发送消息的时候打印相关的日志信息 , 接收参数为 `userId`

其中有几个关键的事件

- onclose：用于指定连接关闭后的回调函数；
- onerror：用于指定连接失败后的回调函数；
- onmessage：用于指定当从服务器接受到信息时的回调函数；
- onopen：用于指定连接成功后的回调函数；

```java
@Slf4j
@ServerEndpoint("/user/{userId}")
public class WebSocketServer {

    private static AtomicInteger onlineCount = new AtomicInteger(0);
    /**
     * 网络套接字设置 concurrent包的线程安全Set，用来存放每个客户端对应的WebSocket对象。
     */
    private static CopyOnWriteArraySet<WebSocketServer> webSocketSet = new CopyOnWriteArraySet<>();

    /**
     * 会话 与某个客户端的连接会话，需要通过它来给客户端发送数据
     */
    private Session session;
    /**
     * id
     */
    private String userId = "";

    @OnOpen
    public void onOpen(Session session, @PathParam("userId") String userId) {
        this.session = session;
        webSocketSet.add(this);     // 加入set中
        this.userId = userId;
        addOnlineCount();           // 在线数加1
        log.info("有新客户端开始监听,userId=" + userId + ",当前在线人数为:" + getOnlineCount());
    }

    @OnClose
    public void onClose() {
        webSocketSet.remove(this);  // 从set中删除
        subOnlineCount();              // 在线数减1
        // 断开连接情况下，更新主板占用情况为释放
        log.info("释放的userId=" + userId + "的客户端");
        releaseResource();
    }

    private void releaseResource() {
        log.info("有一连接关闭！当前在线人数为" + getOnlineCount());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("收到来自客户端 userId=" + userId + " 的信息:" + message);
        // 群发消息
        HashSet<String> userIds = new HashSet<>();
        for (WebSocketServer item : webSocketSet) {
            userIds.add(item.userId);
        }
        try {
            sendMessage("客户端 " + this.userId + "发布消息：" + message, userIds);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        log.error(session.getBasicRemote() + "客户端发生错误");
        error.printStackTrace();
    }


    public void sendMessage(String message, HashSet<String> toSids) throws IOException {
        log.info("推送消息到客户端 " + toSids + "，推送内容:" + message);

        for (WebSocketServer item : webSocketSet) {
            try {
                //这里可以设定只推送给传入的userId，为null则全部推送
                if (toSids.size() <= 0) {
                    item.sendMessage(message);
                } else if (toSids.contains(item.userId)) {
                    item.sendMessage(message);
                }
            } catch (IOException e) {
                continue;
            }
        }
    }

    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    public static int getOnlineCount() {
        return onlineCount.get();
    }

    public static void addOnlineCount() {
        onlineCount.getAndIncrement();
    }

    public static void subOnlineCount() {
        onlineCount.getAndDecrement();
    }

}
```

#### websocketConfig

```java
@Configuration
public class WebSocketConfig {

    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
}
```

#### 控制层代码

编写控制层接口 , 调用接口会向(指定userId的)客户端发送信息

```java
@RestController
@Slf4j
public class TestController {

    @Resource
    WebSocketServer webSocketServer;

    @GetMapping("/test/send/ws/{userId}")
    public String send2WS(@PathVariable String userId){
        try {
            webSocketServer.sendMessage("this is a message from server!", new HashSet<>(Arrays.asList(String.valueOf(userId))));
            return "success";
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

#### 测试

启动项目 , 接着我们通过postman进行测试![](https://pic.yupi.icu/5563/202311191321280.png)

接着访问 `http://localhost:8080/test/send/ws/1`

可以看到我们已经提前预设好的消息

![](https://pic.yupi.icu/5563/202311191321358.png)

## 讯飞星火

了解完websocket之后, 我们来动手实现一个 通用的 `SparkManager`

### 申请key

访问 [官网](https://console.xfyun.cn/sale/buy?wareId=9048&packageId=9048001&serviceName=星火认知大模型V3.0&businessId=bm3`) 购买 免费的个人体验包即可

- 包含了 200w 个token , 足够开发过程使用

![](https://pic.yupi.icu/5563/202311191321364.png)

### 请求流程分析

这里参考官方给出的 示例代码 的结构 , 分析具体请求的流程

1. 通过 apikey apiSecret 等配置信息 , 构建 请求的websokcet的url

2. 创建websocket连接

   这里的核心逻辑都写在 websocket 的 事件中

   - onOpen : 连接开启 , **创建线程** , 构建并请求大模型
   - onMessage : 大模型返回chat的结果 , 这里通过 返回的 业务状态码 , 进行不同的操作 , 比如 :
     - 发生异常, 退出chat
     - 保存chat的结果
     - 有关 历史chat记录的操作
   - onFailure : 发生错误 , 退出

这里的 示例代码 数据是保存在类的属性中的, 也就是保存了 此次请求的状态信息 , 并不支持多线程访问 ,

因此后续在此 demo 的基础之上进行改善, 使得支持嵌入到正常的项目中

### 鉴权-AuthUtil

- 官方文档 : [https://www.xfyun.cn/doc/spark/general_url_authentication.html#_1-%E9%89%B4%E6%9D%83%E8%AF%B4%E6%98%8E](https://www.xfyun.cn/doc/spark/general_url_authentication.html#_1-鉴权说明)

主要参数如下

| 参数          | 类型   | 必须 | 说明                                                | 示例                                                 |
| ------------- | ------ | ---- | --------------------------------------------------- | ---------------------------------------------------- |
| host          | string | 是   | 请求的主机                                          | aichat.xf-yun.com(使用时需替换为实际使用的接口地址） |
| date          | string | 是   | 当前时间戳，采用RFC1123格式，时间偏差需控制在300s内 | Fri, 05 May 2023 10:43:39 GMT                        |
| authorization | string | 是   | base64编码的签名信息                                | 参考下方生成方式                                     |

> 这里一定要注意日期的格式是 英文 , 在格式化日期的时候需要设置为 US

主要流程

1. 获取 RFC_1123 格式日期
2. 获取授权信息
3. 加密
4. 拼接url

```java
public static String genAuthUrl(String apiKey, String apiSecret, String host, String path) throws Exception {
    if (StringUtils.isAnyBlank(apiKey, apiSecret, host, path)) {
        throw new InvalidParameterException("参数不能为空!");
    }
    try {
        String date = getRFC1123Date();
        String httpUrl = generateAuthorization(date, host, path, apiSecret, apiKey);
        return httpUrl;
    } catch (Exception e) {
        throw e;
    }
}
```

### 构建请求类

接口请求字段由三个部分组成：header，parameter, payload。 字段解释如下

**header部分**

| 参数名称 | 类型   | 必传 | 参数要求   | 参数说明                                    |
| -------- | ------ | ---- | ---------- | ------------------------------------------- |
| app_id   | string | 是   |            | 应用appid，从开放平台控制台创建的应用中获取 |
| uid      | string | 否   | 最大长度32 | 每个用户的id，用于区分不同用户              |

**parameter.chat部分**

| 参数名称    | 类型   | 必传 | 参数要求                                                     | 参数说明                                                     |
| ----------- | ------ | ---- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| domain      | string | 是   | 取值为[general,generalv2,generalv3]                          | 指定访问的领域,general指向V1.5版本,generalv2指向V2版本,generalv3指向V3版本 。注意：不同的取值对应的url也不一样！ |
| temperature | float  | 否   | 取值为[0,1],默认为0.5                                        | 核采样阈值。用于决定结果随机性，取值越高随机性越强即相同的问题得到的不同答案的可能性越高 |
| max_tokens  | int    | 否   | V1.5取值为[1,4096] V2.0取值为[1,8192]，默认为2048。 V3.0取值为[1,8192]，默认为2048。 | 模型回答的tokens的最大长度                                   |
| top_k       | int    | 否   | 取值为[1，6],默认为4                                         | 从k个候选中随机选择⼀个（⾮等概率）                          |
| chat_id     | string | 否   | 需要保障用户下的唯一性                                       | 用于关联用户会话                                             |

**payload.message.text部分**

*注：text下所有content累计内容 tokens需要控制在8192内*

| 参数名称 | 类型   | 必传 | 参数要求                              | 参数说明                                    |
| -------- | ------ | ---- | ------------------------------------- | ------------------------------------------- |
| role     | string | 是   | 取值为[user,assistant]                | user表示是用户的问题，assistant表示AI的回复 |
| content  | string | 是   | 所有content的累计tokens需控制8192以内 | 用户和AI的对话内容                          |

构建请求类ChatRequest如下

> 直接使用 JsonObject 或者map 用来构建都是可以的, 不过我认为通过类以及属性来构建会更方便后续的扩展
>
> - 使用Lombok提供的` @Data` 以及 `@Builder `都是十分方便的

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRequest {
    private Header header;
    private Parameter parameter;
    private Payload payload;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Header {
        private String appId;
        private String uid;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Parameter {
        private Chat chat;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Chat {
        private String domain;
        private double temperature;
        private int maxTokens;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Payload {
        private Message message;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Message {
        private List<Text> text;
    }

    @Data
    public static class Text {
        String role;
        String content;
    }
}
```

### 构建结果类

**header部分**

| 字段名  | 类型   | 字段说明                                                     |
| ------- | ------ | ------------------------------------------------------------ |
| code    | int    | 错误码，0表示正常，非0表示出错；详细释义可在接口说明文档最后的错误码说明了解 |
| message | string | 会话是否成功的描述信息                                       |
| sid     | string | 会话的唯一id，用于讯飞技术人员查询服务端会话日志使用,出现调用错误时建议留存该字段 |
| status  | int    | 会话状态，取值为[0,1,2]；0代表首次结果；1代表中间结果；2代表最后一个结果 |

**payload.choices部分**

| 字段名  | 类型   | 字段说明                                                     |
| ------- | ------ | ------------------------------------------------------------ |
| status  | int    | 文本响应状态，取值为[0,1,2]; 0代表首个文本结果；1代表中间文本结果；2代表最后一个文本结果 |
| seq     | int    | 返回的数据序号，取值为[0,9999999]                            |
| content | string | AI的回答内容                                                 |
| role    | string | 角色标识，固定为assistant，标识角色为AI                      |
| index   | int    | 结果序号，取值为[0,10]; 当前为保留字段，开发者可忽略         |

**payload.usage部分(在最后一次结果返回)**

| 字段名            | 类型 | 字段说明                                                     |
| ----------------- | ---- | ------------------------------------------------------------ |
| question_tokens   | int  | 保留字段，可忽略                                             |
| prompt_tokens     | int  | 包含历史问题的总tokens大小                                   |
| completion_tokens | int  | 回答的tokens大小                                             |
| total_tokens      | int  | prompt_tokens和completion_tokens的和，也是本次交互计费的tokens大小 |

```java
@Data
public class ChatResponse {

    private Header header;

    private Payload payload;

    @Data
    public static class Header {
        private int code;
        private String message;
        private String sid;
        private int status;
    }

    @Data
    public static class Payload {
        private Choices choices;
        private Usage usage;


    }

    @Data
    public static class Choices {
        private int status;
        private int seq;
        private List<ContentRoleIndex> text;
    }

    @Data
    public static class ContentRoleIndex {
        private String content;
        private String role;
        private int index;
    }

    @Data
    public static class Usage {
        private Tokens text;

        @Data
        public static class Tokens {
            private int question_tokens;
            private int prompt_tokens;
            private int completion_tokens;
            private int total_tokens;
        }
    }

}
```

### 发起请求

对接前面的流程分析 , 我们的发起请求的操作放到一个新的线程中执行

> 注意 : 这里的代码并不是最终的版本

```java
public String doChat(String message) throws Exception {
    NewQuestion = message;
    // 构建鉴权url
    String authUrl = AuthUtil.genAuthUrl(apiKey, apiSecret, host, path);
    OkHttpClient client = new OkHttpClient.Builder().build();
    // 构建websocket请求
    Request request = new Request.Builder().url(authUrl).build();
    totalAnswer = new StringBuilder();
    // 发起websocket请求
    WebSocket webSocket = client.newWebSocket(request, new MySparkManager(11111L, false));
    return totalAnswer.toString();
}
```

在连接建立之后 , 执行`onOpen`方法 , 这里我们新开启一个线程 , 用来与 模型交互

```java
@Override
public void onOpen(WebSocket webSocket, Response response) {
    super.onOpen(webSocket, response);
    myThread = new MyThread(webSocket, userId);
    myThread.start();
}
```

其中 Thread的 run() 方法主要任务为 构建并发起请求

```java
public void run() {
    try {
        ChatRequest chatRequest = new ChatRequest();
        ChatRequest.builder()
            .header(ChatRequest.Header.builder()
                    .app_id(appid)
                    .uid((int) userId)
                    .build())
            .parameter(Parameter.builder()
                       .chat(Chat.builder()
                             .domain(domain)
                             .temperature(0.5)
                             .maxTokens(4096)
                             .build())
                       .build())
            .payload(ChatRequest.Payload.builder()
                     .message(ChatRequest.Message
                              .builder()
                              .text(Collections.singletonList(
                                  Text.builder()
                                  .content(NewQuestion)
                                  .role("user")
                                  .build()))
                              .build())
                     .build());
        webSocket.send(chatRequest.toString());
        // 等待服务端返回完毕后关闭
        while (true) {
            // System.err.println(wsCloseFlag + "---");
            Thread.sleep(200);
            if (wsCloseFlag) {
                break;
            }
        }
        webSocket.close(1000, "");
        myThread.interrupt();
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

### 接收响应结果

```java
@Override
public void onMessage(WebSocket webSocket, String text) {
    // System.out.println(userId + "用来区分那个用户的结果" + text);
    ChatResponse chatResponse = JSONUtil.toBean(text, ChatResponse.class);
    if (chatResponse.getHeader().getCode() != 0) {
        System.out.println("发生错误，错误码为：" + chatResponse.getHeader().getCode());
        System.out.println("本次请求的sid为：" + chatResponse.getHeader().getSid());
        webSocket.close(1000, "");
    }
    List<ContentRoleIndex> textList = chatResponse.getPayload().getChoices().getText();
    for (ContentRoleIndex temp : textList) {
        totalAnswer.append(temp.getContent());
    }
    if (chatResponse.getHeader().getStatus() == 2) {
        // 可以关闭连接，释放资源
        ContentRoleIndex contentRoleIndex = new ContentRoleIndex();
        contentRoleIndex.setRole("assistant");
        contentRoleIndex.setContent(totalAnswer.toString());
        wsCloseFlag = true;
    }
}
```

### 并发访问改造

原本的主要问题就是 userId 与 answer 绑定在一起了, 并且只有一个doChat () 方法, 因此这里的主要做法就是把doChat()独立出来

并且对于原本的代码, 是不能注入Spring Bean 的 , 因此需要准备一个构造器

主要参数有

- 配置信息
- userId
- 问题

```java
SparkChat(SparkConfig sparkConfig, long userId, String question) {
    this.userId = userId;
    this.question = question;
    this.apiKey = sparkConfig.getApiKey();
    this.apiSecret = sparkConfig.getApiSecret();
    this.appid = sparkConfig.getAppId();
    if (sparkConfig.getModelVersion() != null) {
        this.host = sparkConfig.getHostInfos().get(Integer.parseInt(sparkConfig.getModelVersion()) - 1).getHost();
        this.path = sparkConfig.getHostInfos().get(Integer.parseInt(sparkConfig.getModelVersion()) - 1).getPath();
        this.domain = sparkConfig.getHostInfos().get(Integer.parseInt(sparkConfig.getModelVersion()) - 1).getDomain();
    } else {
        this.host = sparkConfig.getDefaultHostInfo().getHost();
        this.path = sparkConfig.getDefaultHostInfo().getPath();
        this.domain = sparkConfig.getDefaultHostInfo().getDomain();
    }
}
```

原本的代码 核心逻辑就与 websocket 的事件相绑定

```java
@Slf4j
@Data
public class SparkChatListener extends WebSocketListener {
    public StringBuilder totalAnswer = new StringBuilder();

    /**
     * websocket连接关闭标志
     */
    private Boolean wsCloseFlag;
    @Override
    public void onOpen(WebSocket webSocket, Response response) {
        super.onOpen(webSocket, response);
    }

    @Override
    public void onMessage(WebSocket webSocket, String text) {
        ChatResponse chatResponse = JSONUtil.toBean(text, ChatResponse.class);
        if (chatResponse.getHeader().getCode() != 0) {
            log.info("发生错误，错误码为：" + chatResponse.getHeader().getCode());
            log.info("本次请求的sid为：" + chatResponse.getHeader().getSid());
            webSocket.close(1000, chatResponse.getHeader().getMessage());
        }
        List<ContentRoleIndex> textList = chatResponse.getPayload().getChoices().getText();
        for (ContentRoleIndex temp : textList) {
            totalAnswer.append(temp.getContent());
        }
        if (chatResponse.getHeader().getStatus() == 2) {
            // 可以关闭连接，释放资源
            ContentRoleIndex contentRoleIndex = new ContentRoleIndex();
            contentRoleIndex.setRole("assistant");
            contentRoleIndex.setContent(totalAnswer.toString());
            wsCloseFlag = true;
        }
    }

    @Override
    public void onFailure(WebSocket webSocket, Throwable t, Response response) {
        super.onFailure(webSocket, t, response);
        if (response != null) {
            int code = response.code();
            try {
                log.info("[Spark-chat-websocket]failure code:{} , boyd{}", code, response.body().string());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
```

### SparkManager

这里的manager 主要的操作就是 `doChat()`

```java
public String doChat(long userId,String question) throws Exception {
    // 构建鉴权url
    String authUrl = AuthUtil.genAuthUrl(apiKey, apiSecret, host, path);
    OkHttpClient client = new OkHttpClient.Builder().build();
    // 构建websocket请求
    Request request = new Request.Builder().url(authUrl).build();
    SparkChat sparkChat = new SparkChat(sparkConfig, userId,question);
    // 发起websocket请求
    WebSocket webSocket = client.newWebSocket(request,sparkChat );
    return sparkChat.getTotalAnswer().toString();
}
```

另外为了 脱离 WebSocketListener 与 配置信息和用户信息的耦合 , 我们把构建请求的逻辑放到 Manager中

![](https://pic.yupi.icu/5563/202311191321286.png)

当然后续如果需要有 数据持久化 or 关联历史记录 , 再次基础之上修改即可

### 控制层接口

```java
@PostMapping("/test/spark")
public String chat(@RequestParam("question") String question) {
    try {
        return sparkManager.doChat(132, question);
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}
```

![](https://pic.yupi.icu/5563/202311191321241.png)

## HTTP流式传输-SseEmitter

我们在使用官网的大模型对话的时候 , 回答都是一个字一个字响应出来的, 这里我们想达到类似的效果 , 可以采用HTTP推流反馈结果

那么上面的代码显然是达不到我们期望的结果的 , 此处可以注意原本 `SparkManager.dochat()` 中的一个操作

这里是使线程等待AI回答问题完毕 , 最后返回

> websocket连接关闭表示 本次的交互已经结束

```java
while (!sparkChat.getWsCloseFlag()) {
    Thread.sleep(200);
}
return sparkChat.getTotalAnswer().toString();
```

------

**Spring SseEmitter**主要用于实现服务器端向客户端的实时数据推送。

与传统的Http长连接不同，SseEmitter**允许服务器能主动向浏览器推送信息**。

> 这种从服务端单向向客户端发送信息的模式，基于Http协议**，相比于WebSocket来说更为轻量**。

主要功能和用途有以下几个:

1. **能主动向单个客户端推送消息**。SseEmitter能匹配唯一的客户端请求，并与该客户端保持持久连接。通过此连接，服务器可以随时将事件推送给这个客户端。
2. **能推送重复的消息**。SseEmitter允许服务器不停发送相同的消息给客户端，形成一个连续的事件流。客户端只需要监听这个事件流即可。
3. **支持延迟和定时推送**。通过@Scheduled注解，服务器可以在指定时间推送指定延迟的事件。
4. **支持推送不同类型的事件**。客户端通过事件的名称能区分不同类型的事件，并作出不同的响应。
5. **支持推送基本数据类型和POJO对象**。服务器可以推送String、int等基本类型，也可以推送任意的Java对象。
6. **能主动通知客户端关闭**。通过调用complete()或error()方法，服务器可以主动告知客户端连接已关闭。
7. **解耦服务器端和客户端**。服务器端仅负责推送事件，与具体的客户端无关。

接下来我们来改造原本的SparkManager 以及 控制层代码

由于我们需要在控制层返回 AI 回答的信息 , 因此这里添加一个公共的 对象 answer , 原本的SparkChatListener 直接操作这个在控制层中传入的answer

同时我们通过 webSocketFlag进行判断 , 轮询 answer是否有变化 , 如果有则通过 emitter 返回给 client

#### 核心代码

这里需要先返回 给客户端 emitter 对象 , 然后通过异步方法来发送 answer信息

```java
@GetMapping(value = "test/spark", produces = {MediaType.TEXT_EVENT_STREAM_VALUE})
public SseEmitter chat(@RequestParam("question") String question) {
    long userId = 132;
    final SseEmitter emitter = sparkManager.getConn(userId);
    CompletableFuture.runAsync(()->{
        StringBuilder answerCache = new StringBuilder();
        SparkChatListener sparkChatListener = sparkManager.doChat(userId, question, answerCache);
        int lastIdx = 0, len = 0;
        try {
            while (!sparkChatListener.getWsCloseFlag()) {
                if(lastIdx < (len = answerCache.length())){
                    emitter.send(answerCache.substring(lastIdx, len).getBytes());
                    lastIdx = len;
                }
                Thread.sleep(100);
            }
            log.info(answerCache.toString());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    });
    return emitter;
}
```

对应的获取emitter 连接的方法放到 SparkManager中

这里的key通过一个唯一标识传入即可 (实际的应用可以传入userId 等)

```java
    // 用来缓存 用户的SseEmitter
private static final Map<Object, SseEmitter> SSE_CACHE = new ConcurrentHashMap<>();


public SseEmitter getConn(Object key) {
    final SseEmitter sseEmitter = SSE_CACHE.get(key);
    if (sseEmitter != null) {
        return sseEmitter;
    } else {
        // 设置连接超时时间，需要配合配置项 spring.mvc.async.request-timeout: 600000 一起使用
        final SseEmitter emitter = new SseEmitter(600000L);
        // 注册超时回调，超时后触发
        emitter.onTimeout(() -> {
            log.info("连接已超时，正准备关闭，key = {}", key);
            SSE_CACHE.remove(key);
        });
        // 注册完成回调，调用 emitter.complete() 触发
        emitter.onCompletion(() -> {
            log.info("连接已关闭，正准备释放，key = {}", key);
            SSE_CACHE.remove(key);
            log.info("连接已释放，key = {}", key);
        });
        // 注册异常回调，调用 emitter.completeWithError() 触发
        emitter.onError(throwable -> {
            log.error("连接已异常，正准备关闭，key = {}", key, throwable);
            SSE_CACHE.remove(key);
        });
        SSE_CACHE.put(key, emitter);
        return emitter;
    }
}
```

上面修改的代码相当于把原本在 SparkManager中监听的消息的逻辑放到了控制层的异步方法中 , 因此也需要修改原本的doChat方法

```java
public SparkChatListener doChat(long userId, String question, StringBuilder answer) {
    // 构建鉴权url
    String authUrl = AuthUtil.genAuthUrl(sparkConfig.getApiKey(), sparkConfig.getApiSecret(),
                                         sparkConfig.getDefaultHostInfo().getHost(), sparkConfig.getDefaultHostInfo().getPath());
    if (authUrl == null) {
        throw new RuntimeException("authUrl 生成失败 !");
    }
    OkHttpClient client = new OkHttpClient.Builder().build();
    // 构建聊天请求
    ChatRequest chatRequest = buildChatRequest(userId, question);
    System.out.println(JSONUtil.toJsonStr(chatRequest));
    // 构建websocket请求
    Request request = new Request.Builder().url(authUrl).build();
    SparkChatListener sparkChat = new SparkChatListener(answer);
    // 发起websocket请求
    WebSocket webSocket = client.newWebSocket(request, sparkChat);
    webSocket.send(JSONUtil.toJsonStr(chatRequest));
    return sparkChat;
}
```

### 测试

访问 `http://localhost:8080/test/spark?question=Spring SseEmitter  是什么?`

可以看到 问题的内容是逐步的做出响应的

![](https://pic.yupi.icu/5563/202311191321411.png)

如果需要更快的响应 , 可以修改 控制层中 `Thread.sleep()` 的 参数(越小越灵敏 , 不过频繁的访问也会增大CPU的压力)

![](https://pic.yupi.icu/5563/202311191321105.png)