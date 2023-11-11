# 用了这个 Java 小工具，我废了

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)

大家好，我是鱼皮。

我们在开发时，经常需要重复编写很多和业务无关的代码，比如获取指定日期对象、获取本机 IP 地址、校验身份证号、数据加密等。

通常我们会把这些代码独立出来，放到 util 包下，作为 工具类 供其他代码调用。

相信每位 Java 开发者都自己写（粘贴）过工具类，写的项目多了，日积月累，可能有的同学已经有了自己的工具类库。但是，当需要用到新的工具类时，你会怎么做呢？

比如老板让我做一个 MD5 加密的工具，可是我根本没有学过加密算法！

![](https://pic.yupi.icu/5563/202311090905614.jpeg)

于是我打开某度搜索引擎，搜索 “Java MD5加密算法实现”，打开了某篇博客（可能还要登录），再复制粘贴，再去掉一些无用的注释，再略加修改，得到工具类，放到自己的 util 目录下。

这一套操作下来，十几分钟可能就过去了。而这个代码和我们的业务是完全无关的，就可能会耽误一些项目的开发时间！

我们都喜欢白 piao，那么有没有现成的 util 工具包给我们用呢？来了来了，Hutool 工具库！

#### Hutool 是什么？

Hutool 是一个开源的 Java 工具包类库，对文件、流、加密解密、转码、正则、线程、XML 等 JDK 方法进行封装，组成各种 Util 工具类。

![](https://pic.yupi.icu/5563/202311090905619.jpeg)

> Hutool 官网：https://hutool.cn/
>
> GitHub 地址：https://github.com/looly/hutool

#### 为什么用 Hutool？

Java 语言虽然自带了很多的工具类，但是相对于 Scala 等高级语言来说，封装的工具还不够丰富和完善，远远不能满足我们的需求。

因此，出现了各种各样的第三方类库，比如知名的 guava、apache-common-utils，虽然这些类库的实现很优秀，但作为工具类库来说，工具的种类还不够多，通常我们还要搭配其他第三方类库使用（比如操作 Excel 的库 POI）。

而 Hutool 是一个小而全的 Java 工具类库，有各种各样的工具，基本可以满足我们所有的业务诉求。

这也是为啥类库取名 Hutool，Hutool 谐音“糊涂”，寓意追求 “万事都作糊涂观，无所谓失，无所谓得” 的境界。

Hutool 通过静态方法封装，能够降低相关 API 的学习成本，提高工作效率，使 Java 拥有函数式语言般的优雅，让 Java 语言也可以“甜甜的”。

有的同学可能会认为工具类自己实现就好了，干嘛非要引入一个三方类库呢？确实，如果你有能力，可以实现和建设自己的工具库，但是自己实现难免会花很多的时间，或者实现的性能不够高，甚至可能出现一些问题（比如资源忘记 close 导致泄露，鱼皮就干过）。

而 Hutool 中的工具方法来自于每个用户的精雕细琢，作为一个开源项目，由很多大佬共同开发和完善，并经历了上百个企业的真实检验。使得它涵盖了Java 开发底层代码中的方方面面，既是大型项目开发中解决小问题的利器，也是小型项目中的效率担当。

Hutool 是项目中 “util” 包友好的替代，它节省了开发人员对项目中公用类和公用工具方法的封装时间，使开发专注于业务，同时可以最大限度的避免封装不完善带来的 bug。

下面通过一个演示，来看下 Hutool 如何提高我们的开发效率。



#### 它如何提升我们的开发效率？

Hutool 的目标是使用一个工具方法代替一段复杂代码，从而最大限度的避免“复制粘贴”代码的问题，彻底改变我们写代码的方式。

以发送邮件为例：

- 以前：打开搜索引擎 => 搜 “Java 如何发送邮件” => 打开几篇博客 => 选择一个看似优秀的实现 => 复制粘贴 => 改改就用

- 现在：引入 Hutool => 调用 MailUtil.sendText 方法 演示使用：

  ![](https://pic.yupi.icu/5563/202311090907829.png)



说不定可以提前下班了呢！

![](https://pic.yupi.icu/5563/202311090905764.png)

Hutool 的存在原因之一就是为了减少代码搜索成本，避免网络上参差不齐的代码出现导致的 bug。



#### 如何使用 Hutool?

Hutool的用法非常简单，而且对业务无任何侵入，可以直接通过 Maven 或者 Gradle 等包管理工具引入，也可以直接把 Hutool 的代码复制粘贴到自己的项目中。

1. Maven 方式，在项目的 pom.xml 的 dependencies 中加入下列代码：

```
<dependency>
  <groupId>cn.hutool</groupId>
  <artifactId>hutool-all</artifactId>
  <version>5.4.4</version>
</dependency>
```



1. Gradle方式，在build.gradle中加入下列代码:

```
compile 'cn.hutool:hutool-all:5.4.4'
```


然后就可以参照文档去使用啦，文档地址：https://hutool.cn/docs/



![](https://pic.yupi.icu/5563/202311090905062.png)



#### Hutool 的功能

Hutool 的功能非常大而全，常用的工具有：

1.日期工具

通过 DateUtil 类，提供高度便捷的日期访问、处理和转换方式。

2.HTTP 客户端

通过 HttpUtil 对 HTTP 客户端的封装，实现便捷的 HTTP 请求，并简化文件上传操作。

3.转换工具

通过 Convert 类中的相应静态方法，提供一整套的类型转换解决方案，并通过 ConverterRegistry 工厂类自定义转换。

4.配置文件工具（Setting）

通过 Setting 对象，提供兼容 Properties 文件的更加强大的配置文件工具，用于解决中文、分组等 JDK 配置文件存在的诸多问题。当然还有更多组件，如下：

| **模块**           | **介绍**                                                     |
| ------------------ | ------------------------------------------------------------ |
| hutool-aop         | JDK动态代理封装，提供非IOC下的切面支持                       |
| hutool-bloomFilter | 布隆过滤，提供一些Hash算法的布隆过滤                         |
| hutool-cache       | 简单缓存实现                                                 |
| hutool-core        | 核心，包括Bean操作、日期、各种Util等                         |
| hutool-cron        | 定时任务模块，提供类Crontab表达式的定时任务                  |
| hutool-crypto      | 加密解密模块，提供对称、非对称和摘要算法封装                 |
| hutool-db          | JDBC封装后的数据操作，基于ActiveRecord思想                   |
| hutool-dfa         | 基于DFA模型的多关键字查找                                    |
| hutool-extra       | 扩展模块，对第三方封装（模板引擎、邮件、Servlet、二维码、Emoji、FTP、分词等） |
| hutool-http        | 基于HttpUrlConnection的Http客户端封装                        |
| hutool-log         | 自动识别日志实现的日志门面                                   |
| hutool-script      | 脚本执行封装，例如Javascript                                 |
| hutool-setting     | 功能更强大的Setting配置文件和Properties封装                  |
| hutool-system      | 系统参数调用封装（JVM信息等）                                |
| hutool-json        | JSON实现                                                     |
| hutool-captcha     | 图片验证码实现                                               |
| hutool-poi         | 针对POI中Excel和Word的封装                                   |
| hutool-socket      | 基于Java的NIO和AIO的Socket封装                               |

可以根据需求对每个模块单独引入，也可以通过引入 hutool-all 方式引入所有模块。



#### 写在最后

最后，给大家一点建议。

不要仅仅把 Hutool 当做一个工具去使用，**用久了会把人用傻的** ！



![](https://pic.yupi.icu/5563/202311090905808.png)

有时间的话，应该阅读 Hutool 的源码，学习其各种工具类的优秀实现，培养自己的代码能力。

Hutool 的源码其实并不难，就是通过大量的静态方法来方便调用，比如下面的手机号工具类：

```
 /**
  * 手机号工具类
  */
 public class PhoneUtil {
   /**
    * 座机号码
    */
   private static final Pattern TEL =
     Pattern.compile("0\\d{2,3}-[1-9]\\d{6,7}");
   /**
    * 验证是否为手机号码（中国）
    *
    * @param value 值
    * @return 是否为手机号码（中国）
    */
   public static boolean isMobile(CharSequence value) {
     return Validator.isMatchRegex(PatternPool.MOBILE, value);
   }
   ...
 }
```

大家可以自行阅读感兴趣的功能的源码，有朝一日自己也能成为开源大佬！



------


以上就是本期分享，我是鱼皮，求个 **点赞 + 在看** ，这将是我持续创作的最大动力，谢谢 🙏

![](https://pic.yupi.icu/5563/202311090905990.png)