# 实战开发类库，手写 Spring Boot Starter！

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)

> [最近在带大家做新项目，欢迎参与](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247529515&idx=1&sn=eb5e2af507ce35e3c4159dad7e1424f1&chksm=e9c293dcdeb51acac148fd14c0677ab3c1076c47ab52a33ffe7d682a3e1d1d8f37c4d3c7d167&token=1411297570&lang=zh_CN&scene=21#wechat_redirect)

大家好，我是鱼皮。

我的老弟小阿巴最近不是在某公司实习嘛，前两天我问他：老弟，最近实习感觉如何？学到什么东西了不？

小阿巴笑容满面地说：我最近自己独立手写了一个类库！

![](https://pic.yupi.icu/5563/202311080940493.png)

我惊叹道：厉害呀，你不是才刚进公司嘛？就已经开始自己造轮子了？

小阿巴：嘿嘿，只是把公司项目的加密模块封装了一下，导师还夸奖了我。

![](https://pic.yupi.icu/5563/202311080940758.png)

我：不错不错，现在绝大多数刚进公司的同学都是跟着导师指哪儿打哪儿，你的这个自主操作还是非常加分的。那能不能分享一下你是怎么开发的这个类库呀？

小阿巴：我是用了 Java Spring Boot 框架开发了一个 **starter** 。

我：啥是 starter 啊？直接写个工具类还不行？

小阿巴：我们在做 Spring Boot 项目的时候不是经常会引入各种 starter 么？比如操作数据库的 mybatis-starter、接入接口文档的 knife4j-starter 等等。引入 starter 的好处是可以快速地将第三方库整合到我们的项目中，只要在 application.yml 配置文件中写配置，就能自动创建对象实例完成操作。

我：原来如此，那怎么开发一个 starter 呢？

小阿巴（一脸难以置信）：不是吧老鱼皮，这次竟然轮到我来教教你了。

![](https://pic.yupi.icu/5563/202311080940488.png)

小阿巴：那我就来分享一下。如今网上的手写 starter 教程虽然不少，但是乱七八糟的，很多博客都是各种坑，下面我用最短的时间给大家分享手写 starter 的完整流程。

## 手写 Spring Boot Starter

首先我们用 IDEA 开发工具来初始化一个 Spring Boot 项目，注意 Java 版本不要选太高、Spring Boot 版本不要选 3.x：

![](https://pic.yupi.icu/5563/202311080940647.png)

初始化项目后，我们要在项目依赖文件 pom.xml 中引入几个核心依赖：

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-autoconfigure</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-configuration-processor</artifactId>
  <optional>true</optional>
</dependency>
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <optional>true</optional>
</dependency>
```

其中，spring-boot-autoconfigure 用于自动加载配置，spring-boot-configuration-processor 用于自动生成配置文件的自动提示。

有这些依赖就足够了，我们尽量保证 starter 的精简，便于其他项目引用时的兼容性。

**此外，还要把 pom.xml 中的下面这段代码删掉：**

```
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
    </plugin>
  </plugins>
</build>
```

接下来，假设我们已经开发了一个 Client（实现了主要功能的类），我们要编写一个配置类，用于自动创建 Client 实例。

这里我用最近在带大家开发的 [API 开放平台项目](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247529515&idx=1&sn=eb5e2af507ce35e3c4159dad7e1424f1&chksm=e9c293dcdeb51acac148fd14c0677ab3c1076c47ab52a33ffe7d682a3e1d1d8f37c4d3c7d167&token=1411297570&lang=zh_CN&scene=21#wechat_redirect) 为例，创建了一个自动调用接口的 API 客户端实例，参考代码如下：

```
@Configuration
@ConfigurationProperties(prefix = "yuapi.client")
@Data
@ComponentScan
public class YuApiClientConfig {

    /**
     * appId
     */
    private String appId;

    /**
     * 秘钥
     */
    private String appSecret;

    @Bean
    public YuApiClient yuApiClient() {
        return new YuApiClient(appId, appSecret, userId);
    }
}
```

上述代码中，比较关键的注解是：

- @Configuration：告诉 Spring Boot 这是一个配置类，可以在该类中创建 Bean
- @ConfigurationProperties：和配置文件（一般是 application.yml）进行绑定，将配置文件中对应的配置映射到对象的属性中。比如 application.yml 中 yuapi.client.appId 的值会自动注入到 YuApiClientConfig 实例的 appId 属性。不用再把值硬编码到类中了！

写完这个配置类后，还要把它进行注册，创建一个配置文件 `resources/META_INF/spring.factories` ，编写如下代码：

```
# spring boot starter
org.springframework.boot.autoconfigure.EnableAutoConfiguration=com.yupi.mystarter.YuApiClientConfig
```

这样，就相当于给了项目一个启动入口（类似 main）。

然后，我们的 stater 类库就编写完毕啦！执行 mvn install 命令，就可以把它打包为本地依赖，供其他项目使用。

比如：

```
<dependency>
  <groupId>com.yupi</groupId>
  <artifactId>my-starter</artifactId>
  <version>0.0.1</version>
</dependency>
```

你学会了么？



------


我：学废了学废了。我们是不是还可以把自己开发好的类库上传到 Maven 软件源上给其他同学公开使用？

小阿巴：Right Bro~ 我正打算这么做，把这段经历写到简历上，相信会比我之前只写管理系统项目加分得多！

![](https://pic.yupi.icu/5563/202311080940496.png)

## 完

在鱼皮最新带大家直播开发的 [API 开放平台项目](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247529515&idx=1&sn=eb5e2af507ce35e3c4159dad7e1424f1&chksm=e9c293dcdeb51acac148fd14c0677ab3c1076c47ab52a33ffe7d682a3e1d1d8f37c4d3c7d167&token=1411297570&lang=zh_CN&scene=21#wechat_redirect) 中，也手把手带大家做了一个 Starter 类库，还分享了开发第三方类库的经验，感兴趣的同学欢迎加入我的 [编程导航](https://yuyuanweb.feishu.cn/wiki/VC1qwmX9diCBK3kidyec74vFnde) 参与。除了直播带大家开发完整项目外，我会 1 对 1 解决你的问题。可以加微信 yupi5927，备注【加入编程导航】和自己的情况领取优惠加入编程导航，不备注不通过，非诚勿扰谢谢。