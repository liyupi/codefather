# 腾讯又出王炸产品！分分钟开发 AI 文档助手

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)

> 其他平台标题：5 分钟，开发自己的 AI 文档助手！手把手教程



大家好，我是鱼皮。

几个月前，我自己开发过一个 AI 文档总结助手应用。给大家简单演示一下，首先我上传了一个文档，定义 `1 + 1 等于 3`：

![](https://pic.yupi.icu/1/1700474839512-90bc1a7f-604c-4867-8b27-e7b164d5b903.png)

然后把文档喂给 AI 文档总结助手，再向它提问，然后 AI 就回答出了我们文档中的内容，如下图：

![](https://pic.yupi.icu/1/1700474826938-48e41d22-6fb3-49d1-9878-360538bac5d5.png)

是不是很有趣哈哈~ 所以 AI 并不是完全可信的哦，要看原始数据是否可信！

当时参考网上的教程，做这个花了挺长一段时间，成就感满满。

但没想到，这段时间，AI 以一日千里的速度发展，现在开发一个同样的 AI 文档总结助手，大家猜猜要多久？

![](https://pic.yupi.icu/1/1700474357094-8d442c47-f6aa-468a-bd35-52ff0c63c838.png)

答案是：只要 5 分钟！！！

![](https://pic.yupi.icu/1/1700474532928-8eab29cd-ec54-435d-8251-24c6d191c35c.png)



没错，使用腾讯云新出的向量数据库产品能力，哪怕没有 AI 知识，也能够轻轻松松开发出 AI 应用。

下面就给大家分享一下 AI 总结助手开发教程。



## AI 总结助手开发教程

### 实现原理

动手写代码前，我们要先了解整个 AI 总结助手的实现原理，为什么 AI 能够回答出我们指定的文档内容呢？

那肯定要把文档数据先 “喂” 给 AI 呀，可是怎么 “喂” 呢？

因为 AI 的 “脑容量” 很小，接受的输入有限，所以我们要对文档进行拆分，比如将一篇万字长文拆为 20 个 500 字的小段落。

然后，我们要将这些小段落存储到 **数据库** 中，当用户向 AI 提问时，AI 要先从数据库中查询出和用户问题相似度最高的小段落，然后对这些小段路进行总结，再给用户回答。

为什么要给 AI 提供一个数据库呢？我举个通俗易懂的比喻：我们考试时如果脑袋记不住所有考点，是不是带本书进考场，然后根据考题从书中查出答案，再整理一下写到考卷上就行了呢？

![](https://pic.yupi.icu/1/1700475731148-6940fe62-0e63-4ac5-846f-90e3afbeaa0e.png)

那么问题就来了，怎么根据用户的问题从数据库中查出最相似的段落呢？文本段落应该以什么格式存储到数据库中呢？

这就需要用到一种特殊的数据库技术 —— 向量数据库。



### 什么是向量数据库？

向量数据库就是一个专门存储和处理 **向量数据** 的数据库，它内置了相似内容检索功能，可以找到和某个向量最相似的数据。

相比于传统关系型数据库（比如 MySQL）的模糊查询（like）而言，向量检索会更灵活。如今，得益于 AI 的发展，向量数据库作为 AI 的 “小抄”，也变得越来越流行。

那什么是向量数据呢？

其实就是用一些算法将文本、图片、音视频等内容统一转换成数值向量。

比如：“中午吃饺子”，经过转换后得到的向量数据可能是：[0.8, 0.6, 0.9, 0.4, ...]；而 “晚上写代码”，经过转换后得到的向量数据可能是：[0.1, 0.2, 0.3, 0.4, ...]

如果用户要从向量数据库搜索内容，那么也可以把搜索关键字转换为类似的向量数据，然后计算两个向量之间的距离来判断相似度即可。

比如用户问：“中午吃什么？”，经过转换后得到的向量数据可能是：[0.8, 0.6, 0.7, 0.3, ...]。

显然，这个向量数据会和 “中午吃饺子” 的向量数据更接近，所以会优先搜出 “中午吃饺子”。

采用不同的向量转换算法、或者不同的相似度计算方法，得到的向量值和计算结果可能也是不同的。



### 具体实现流程

了解向量数据库后，我们可以整理出 AI 应用的具体实现流程：

1）将自己已有的知识库文档进行段落拆分；

2）利用算法（Embedding）将文档数据转换为向量

3）将向量存储到向量数据库中

4）将用户发送的问题通过算法（Embedding）转换为向量

5）根据用户问题向量，在向量数据库进行相似性查询

6）将检索到的最相似结果作为背景知识（上下文），转换为 prompt 并发送给 AI 大模型，从而获得响应结果



流程图如下：

![](https://pic.yupi.icu/1/459fb2ca6f7127a4e88f23db46dc676b.svg)



此前，鱼皮就是按照这个流程自己开发实现的 AI 总结助手。但是要自己对文档进行拆分、还要通过某种算法转换成向量数据，想想都麻烦！

![](https://pic.yupi.icu/1/1700192512076-5385287e-de41-41a1-b358-ee9d7fe53245.png)



有没有更简单的实现方式呢？



### 流程简化

还真有！

最近腾讯云发布了最新版本的向量数据库，不仅提供了数据写入和检索的自动向量化功能（embedding），还支持文本自动拆分和一键上传，可以直接将文章转为拆分好的向量写入到向量数据库，大大简化了开发流程。而且简单易用，新人也能快速上手。

![](https://pic.yupi.icu/1/1700477063212-2b8e76b6-7faf-45ab-a73a-2acb43470545.png)



如果用腾讯云的向量数据库，上面的实现流程就简化为 3 个核心步骤：

1）将文档上传到腾讯云向量数据库（自动拆分并转为向量存储）

2）将用户发送的问题传入到向量数据库进行相似性查询

3）将检索到的最相似结果作为背景知识（上下文），转换为 prompt 并发送给 AI 大模型，从而获得响应结果



那么流程图就简化为下面这样了：

![](https://pic.yupi.icu/1/a7f2b77ac9f61200ae49f18a99bf0f34.svg)



流程确定后，就可以开始写代码了。

![](https://pic.yupi.icu/1/1700200586269-67de0eaf-f0ad-46dd-b9ab-b0fb9531d855.png)



### AI 总结助手开发

从上述流程中我们会发现，想要实现 AI 总结助手，向量数据库和 AI 大模型是两大不可或缺的角色。

此处，我们选用上面介绍的腾讯云向量数据库，并且搭配与腾讯云联合的百川 AI 大模型，能最大程度地节约开发成本。



#### 1、免费领取资源

首先要免费领取腾讯云向量数据库 + 百川 AI 大模型的使用权。

进入向量数据库产品主页，点击免费领取：

> 地址：https://cloud.tencent.com/act/pro/agi

![](https://pic.yupi.icu/1/1700116919192-e292c58f-3131-47ed-ac09-444ed25a8878.png)



2）在弹框中填入自己的手机号即可领取成功，等待初始化就好了

![](https://pic.yupi.icu/1/1700116978960-9c685a37-52b7-4a08-a1d3-660030bb5754.png)



3）等初始化成功后，进入腾讯云向量数据库的实例列表，当状态显示为运行中时，开启外网访问：

![](https://pic.yupi.icu/1/1700205765688-b11fd675-ab3f-4921-b916-664eb1204d5e.png)



4）开启外网时，需要填写允许访问的白名单，那由于此处仅为测试，我就直接设置为全网可访问了：

![](https://pic.yupi.icu/1/1700104737234-32c3cd43-c5bf-48d7-8044-5377c0602608.png)



5）访问百川 AI 大模型，点击领取百川的免费调用次数（几百万 tokens 呢）

> 地址：https://platform.baichuan-ai.com/console/recharge

![](https://pic.yupi.icu/1/1700117098417-3d4be5d2-19c4-4312-ab28-0862b140dc0e.png)

6）进入 API Key 管理页面，新建一个属于自己的 API Key，后面就可以调用百川大模型的 AI 能力了。

![](https://pic.yupi.icu/1/1700117274810-b95c5d28-6a6a-49b1-b14e-8b15f98ec2e1.png)



资源领取好了，我们就可以愉快地使用资源啦。

正式开发前，我们要先阅读腾讯云向量数据库官方的 API 开发文档，以最新的文档为准去写代码。

> 地址：https://cloud.tencent.com/document/product/1709/97768



#### 2、引入依赖

我们以 Java Maven 项目开发为例，先引入程序所需的依赖，比如腾讯云向量数据库、HTTP 调用客户端等。

代码如下：

```xml
<dependencies>
    <dependency>
        <groupId>com.tencent.tcvectordb</groupId>
        <artifactId>vectordatabase-sdk-java</artifactId>
        <version>1.0.4-SNAPSHOT</version>
        <scope>system</scope>
        <systemPath>${project.basedir}/src/main/libs/vectordatabase-sdk-java-1.0.4.jar</systemPath>
    </dependency>

    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-lang3</artifactId>
        <version>3.12.0</version>
    </dependency>

    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-core</artifactId>
        <version>2.12.3</version>
    </dependency>

    <dependency>
        <groupId>com.qcloud</groupId>
        <artifactId>cos_api</artifactId>
        <version>5.6.8</version>
    </dependency>

    <dependency>
        <groupId>com.squareup.okhttp3</groupId>
        <artifactId>okhttp</artifactId>
        <version>4.9.1</version>
    </dependency>
</dependencies>
```



#### 3、连接向量数据库

参考腾讯云官方提供的 Java SDK Demo 代码，首先和向量数据库建立连接：

```java
import com.tencent.tcvectordb.client.VectorDBClient;
import com.tencent.tcvectordb.model.param.database.ConnectParam;
import com.tencent.tcvectordb.model.param.enums.ReadConsistencyEnum;

public class VDBClientFactory {

    public static VectorDBClient createClient() {
        ConnectParam param = getConnectParam();
        return new VectorDBClient(param, ReadConsistencyEnum.EVENTUAL_CONSISTENCY);
    }

    private static ConnectParam getConnectParam() {
        return ConnectParam.newBuilder()
                .withUrl("url")
                .withUsername("username")
                .withKey("key")
                .withTimeout(30)
                .build();
    }
}
```



上述代码中的 url 可以直接在腾讯云向量数据库的实例列表中看到，直接选中复制即可：

![](https://pic.yupi.icu/1/1700187643817-6d2d8bcf-b77d-4c28-a39f-8bc4fbe2248d.png)



对于 username 和 key 参数，则需要点进实例，选择密钥管理来获取：

![](https://pic.yupi.icu/1/1700187710892-fd17ef4e-95e9-494b-a313-d9a3b035bfe5.png)



#### 4、上传文档到向量数据库

上传文档到数据库前，肯定要先初始化数据库表。

让我们新建一个 `AISearchExample` 类，在这个类中编写调用向量数据库的方法，创建数据库和数据表，代码如下：

```java
public class AISearchExample {
    private static final String DB_NAME = "ai_test_db";
    private static final String COLLECTION_NAME = "ai_test_collection";
    
    private static void initDatabase(VectorDBClient client) {
        System.out.println("init database..");
        try {
            client.dropAIDatabase(DB_NAME);
        } catch (VectorDBException e) {
            // ignore
        }
        client.createAIDatabase(DB_NAME);
    }
    
    private static void initCollection(VectorDBClient client) {
        System.out.println("init collection..");
        Database database = client.database(DB_NAME);
        CreateAICollectionParam param = CreateAICollectionParam.newBuilder().withName(COLLECTION_NAME).build();
        database.createAICollection(param);
    }
}
```



然后编写一个 `writeKnowledgeByFile` 方法，把本地的文档上传到向量数据库里：

> 可以直接上传文档，不需要再操心文档段落的拆分、如何转换为数值向量等复杂的问题，大幅节约时间

```java
public class AISearchExample {
    ...
    
    private static void writeKnowledgeByFile(VectorDBClient client) throws Exception {
        AICollection collection = client.database(DB_NAME).describeAICollection(COLLECTION_NAME);
    
        for (String f : Objects.requireNonNull(new File("doc").list())) {
            String filePath = "doc/" + f;
            System.out.println("upload file " + filePath);
            collection.upload(filePath, Collections.emptyMap());
        }
    
        System.out.println("all file uploaded.");
        System.out.println("文件上传后，向量数据库会进行解析和Embedding，请耐心等待10-20秒后可以开始进行知识检索。");
	}
}
```



这里我把自己写的学习路线文章都上传到向量数据库：

![](https://pic.yupi.icu/1/1700207225007-e8206921-44d2-40e7-a6ce-a7185ef9873c.png)



编写好上述的初始化方法后，依次调用即可：

```java
public class AISearchExample {
    ...
    private static void initKnowledge(VectorDBClient client) throws Exception {
        initDatabase(client);
        initCollection(client);
        writeKnowledgeByFile(client);
    }
}
```



#### 5、搜索文档

将文档都上传到向量数据库后，就可以实现数据的检索了。

在 `AISearchExample` 类中，再添加一个搜索方法 `searchKnowledge`，代码如下：

```java
public class AISearchExample {
    ...

    private static String searchKnowledge(String question, VectorDBClient client) {
        // 访问指定的表
        AICollection collection = client.database(DB_NAME).describeAICollection(COLLECTION_NAME);
        // 构造搜索条件
        SearchByContentsParam param = SearchByContentsParam.newBuilder().withContent(question).build();

        StringBuilder allKnowledge = new StringBuilder();
        List<Document> results = collection.search(param);
        int index = 1;

        // 获取搜索结果
        for (Document document : results) {
            ChunkInfo chunk = (ChunkInfo)document.getObject("chunk");
            allKnowledge.append(chunk.getText()).append(" ");
        }

        return allKnowledge.toString();
    }
}
```



运行代码，测试下效果，成功检索出了指定回答：

![](https://pic.yupi.icu/1/1700207460059-c4296724-ffd9-4366-9b43-1def5640b147.png)



效果不错，我再试试，问问 “中午吃什么”：

![](https://pic.yupi.icu/1/1700207513144-05dfa2d6-ad4b-4889-93dd-c90282739948.png)



What？这什么啊，你不要睁着眼睛乱说好不好！

![](https://pic.yupi.icu/1/1700188842794-f891cbe8-a284-4b58-887a-563b1fca2285.jpeg)

这里我们发现了一个关键问题：当我搜索一个完全不存在的问题时，向量数据库仍然会给出结果，然而这并不是我想要的。如果没有相关的内容，直接不返回结果好像更符合预期。

好在腾讯云向量数据库返回了检索相似度，可以根据这个值设定一个阈值，从而进行过滤。

修改一下代码，过滤相似度低于 0.8 的文档：

```java
public class AISearchExample {
    ...

    /**
     * 文档相关性的阈值
     */
    private static final Double THRESHOLD = 0.8;


	private static String searchKnowledge(String question, VectorDBClient client) {
        AICollection collection = client.database(DB_NAME).describeAICollection(COLLECTION_NAME);
        SearchByContentsParam param = SearchByContentsParam.newBuilder().withContent(question).build();

        StringBuilder allKnowledge = new StringBuilder();
        List<Document> results = collection.search(param);
        int index = 1;
        for (Document document : results) {
            Double score = document.getScore();
            if (ObjectUtils.isEmpty(score) || score < THRESHOLD) {
                continue;
            }
            ChunkInfo chunk = (ChunkInfo)document.getObject("chunk");
            allKnowledge.append(chunk.getText()).append(" ");
        }

        return allKnowledge.toString();
    }
}
```



再测试下效果，这次正常了：

![](https://pic.yupi.icu/1/1700207560761-a28dd1fc-e902-462b-9ff0-b644757884cc.png)



至此，我们使用向量数据库实现了文档数据的存储和查询。“小抄” 已经准备好，接下来就把它给 AI 吧！



#### 6、使用百川大模型

可以通过 OKHttp 库向百川大模型发送请求，实现 AI 的问答能力。

代码看起来比较长，但其实只需要按照百川要求的参数格式来设置请求头、封装 prompt，最后发起调用并获取返回结果就好了，代码如下：

```java
public class BaiChuanLLM {

    private static final String URL = "https://api.baichuan-ai.com/v1/chat";

    /**
     * 这里的ak和sk可以从百川官网获取，文章中已经演示过了，直接替换掉即可
     */
    private static final String API_KEY = "ak";
    private static final String SECRET_KEY = "sk";

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private static volatile OkHttpClient HTTP_CLIENT;

    public static String ask(String question, String knowledge) {
        try {
            String prompt = getPrompt(question, knowledge);
            return llmRequest(prompt);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private static String llmRequest(String prompt) throws IOException {
        String requestData = getBaiChuanRequest(prompt);
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        String signature = calculateMd5(SECRET_KEY + requestData + timestamp);

        Headers headers = getHeaders(timestamp, signature);

        RequestBody body = RequestBody.create(requestData, MediaType.parse("application/json; charset=utf-8"));
        Request request = (new Request.Builder()).url(URL).headers(headers).post(body).build();

        try (Response response = getHttpClient().newCall(request).execute()) {
            JsonNode node = null;
            if (response.body() != null) {
                node = MAPPER.readTree(response.body().string());
            }
            if (node != null) {
                return node.get("data").get("messages").get(0).get("content").asText();
            }
            return null;
        }
    }

    private static Headers getHeaders(String timestamp, String signature) {
        return (new Headers.Builder())
                .add("Content-Type", "application/json")
                .add("Authorization", "Bearer " + API_KEY)
                .add("X-BC-Request-Id", "RequestId-1001")
                .add("X-BC-Timestamp", timestamp)
                .add("X-BC-Signature", signature)
                .add("X-BC-Sign-Algo", "MD5")
                .build();
    }

    public static String calculateMd5(String inputString) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(inputString.getBytes());
            byte[] digest = md.digest();
            StringBuilder buffer = new StringBuilder();
            for (byte b : digest) {
                buffer.append(String.format("%02x", b & 0xff));
            }
            return buffer.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }

    private static String getBaiChuanRequest(String prompt) throws JsonProcessingException {
        ObjectNode data = JsonNodeFactory.instance.objectNode();
        data.put("model", "Baichuan2-53B");

        ObjectNode node = JsonNodeFactory.instance.objectNode();
        node.put("role", "user");
        node.put("content", prompt);

        data.put("messages", JsonNodeFactory.instance.arrayNode().add(node));
        return new ObjectMapper().writeValueAsString(data);
    }

    private static String getPrompt(String question, String knowledge) throws JsonProcessingException {
        JsonNodeFactory factory = JsonNodeFactory.instance;
        ObjectNode obj = factory.objectNode();
        obj.put("请回答问题", question);
        obj.put("背景知识如下", knowledge);
        return new ObjectMapper().writeValueAsString(obj);
    }

    synchronized private static OkHttpClient getHttpClient() {
        if (HTTP_CLIENT == null) {
            HTTP_CLIENT = (new OkHttpClient.Builder())
                    .connectTimeout(2L, TimeUnit.SECONDS)
                    .readTimeout(60, TimeUnit.SECONDS)
                    .connectionPool(new ConnectionPool(10, 5L, TimeUnit.MINUTES))
                    .build();
        }
        return HTTP_CLIENT;
    }
}
```



上面的代码大家也不用记，直接复制到自己的程序中就行。

最后，我们在刚刚创建的 `AISearchExample` 类中编写一个 main 方法，以实现调用。

示例代码如下：

```java
public static void main(String[] args) throws Exception {
    VectorDBClient client = createClient();
    initKnowledge(client);

    Scanner scanner = new Scanner(System.in);
    System.out.print("请输入您的问题（exit退出）：");
    String inputString = scanner.nextLine();
    while (!"exit".equalsIgnoreCase(inputString)) {
        if (!inputString.trim().isEmpty()) {
            String result = searchKnowledge(inputString, client);
            if (StringUtils.isBlank(result)) {
                System.out.println("未找到相关内容");
            }else {
                System.out.println(result);
            }
            String llmResult = BaiChuanLLM.ask(inputString, result);
            System.out.println("---->LLM回答结果：");
            System.out.println(llmResult);
        }

        System.out.println("\n\n");
        System.out.print("请输入您的问题（exit退出）：");
        inputString = scanner.nextLine();
    }
}
```



注意:

1）由于版本持续更新迭代，请以官方最新的 SDK Demo 为准

> 地址：https://cloud.tencent.com/document/product/1709/97768

2）相比于 Java，Python 调用会更加简单，只需要不到 100 行代码就能搞定



### 最终效果

查询向量数据库中已有的信息时，向量数据库成功查询到了文档段落：

![](https://pic.yupi.icu/1/1700207701043-9d5efcfa-eeb2-4618-ae17-35082fd19c0b.png)

百川 AI 大模型基于上面的文档段落，给出了更清晰的回答：

![](https://pic.yupi.icu/1/1700207826067-204511db-540a-4745-8d8b-3b3dd294c569.png)



很好，一个 AI 总结助手就开发完成啦！



### 总结

通过开发上述应用，大家应该也能发现，腾讯云向量数据库确实是立了大功，它不仅帮我完成了文件分片上传，还通过内置的 Embedding 功能帮我完成了文档到数值向量的转换，并内置了搜索功能，大幅降低了开发成本！

![](https://pic.yupi.icu/1/1700480396822-a0e42c92-33aa-42db-bfe7-4e99a13863a1.png)



不过对于我来说，最重要的还是它送了 400 万 token 的百川大模型以及免费一个月的腾讯云向量数据库。

![](https://pic.yupi.icu/1/1700191770693-6a512661-6e90-4cec-8453-4f10a636428d.png)



点击下面的链接，或者文章下方的阅读原文，即可免费领取腾讯云向量数据库 + 百川大模型 400 万 tokens 调用额度。推荐大家用它来快速制作自己的学习笔记助手、八股文背诵助手等，提高学习工作效率~

> 领取地址：[https://cloud.tencent.com/act/pro/agi](https://cloud.tencent.com/act/pro/agi)