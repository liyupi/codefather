# 4 种方法，帮你快速新建 Java 项目！

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)

大家好，我是鱼皮。今天给大家分享常用的快速初始化 Java 项目的几种方法。比较全面，有一些方法你可能并不知道，但如果都掌握的话，基本上够用一辈子了哈哈。



## 如何快速初始化 Java 项目？

### 1、使用开发工具

Java 开发者最常用的开发工具当属 JetBrains IDEA 了！

IDEA 不仅功能完善、插件丰富，而且其实对新手比较友好。

比如在 IDEA 中，你可以快速安装需要的指定版本的 JDK，不用自己到官网下载：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696909595255-ee7eb1c6-b224-4a13-9fc1-1ea3475492aa.png)



使用 IDEA 来创建初始化项目也是最常用的方法了，点击左上角的 File => New => Project：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696909731186-3a8dc367-e54a-482c-8f70-10b8523df19a.png)

然后进入项目创建界面，左侧选择需要的模板，右侧填写项目信息，即可完成创建：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696909787420-057ce671-1e17-45fd-9c55-a757e0d94331.png)



最常用的模板当属 `Spring Initializr` 了，可以快速初始化 Spring Boot 项目：

> 注意选择 Java 的版本号

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696909883195-394d2e0f-be2a-4074-89eb-061dd8c07578.png)

支持可视化地选择项目的依赖，一般不用自己去写依赖配置或者粘贴了：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696909903799-7afbbeff-5f47-4107-ae14-b8cd820a226f.png)



如果要引入更多 Java 的包，可以到 Maven 中心仓库寻找：http://mvnrepository.com/ 。



### 2、项目管理工具

对于 Java 开发者，最常用的项目管理工具是 Maven 和 Gradle。它们不仅可以管理项目依赖、打包构建项目，也可以快速创建新项目。

不过对于不熟悉这些工具的同学来说，不推荐使用这种方式创建项目，仅做了解即可。

下面分别演示 2 种工具创建新项目的方法。



#### 使用 Maven 创建项目

安装 Maven 后，使用以下命令创建 Spring Boot 项目（仅供参考）： 

```shell
mvn archetype:generate \
    -DgroupId=com.example \
    -DartifactId=my-spring-boot-app \
    -DarchetypeArtifactId=maven-archetype-quickstart \
    -DinteractiveMode=false
```


解释一下上面命令中的参数： 

- `-DgroupId`: 你的项目的组 ID
- `-DartifactId`: 你的项目的 Artifact ID
- `-DarchetypeArtifactId`: Maven 快速启动项目的模板
- `-DinteractiveMode=false`: 禁用交互模式，使其自动创建项目



#### 使用 Gradle 创建项目

Gradle 的项目模板相比 Maven 来说少了一些。安装 Gradle 后，使用以下命令创建项目：

```shell
gradle init
```



然后跟着操作提示输入选项，即可创建出不同的项目：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696910728917-3af539be-800f-461a-916f-029e150a9443.png)

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696911159701-49e9bd37-4294-4365-91d1-b8a988ab442c.png)



### 3、项目模板生成器

有很多专门用来创建初始化项目模板的工具和网站，这里分享其中 4 种：



#### Spring Initializr

Spring 官方的项目模板生成器，可以使用可视化界面来选择项目配置，并快速生成 Spring Boot 项目的初始代码。

> 指路：https://start.spring.io/



界面如下，还可以分享自己的配置给别人：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696911433077-59902ba9-42d5-4f0d-87d1-b009d3a9b262.png)



不过 IDEA 开发工具内已经集成了 `Spring Initializr`，一般没必要专门在网站中使用。



#### 微服务模板生成器

阿里提供了一款云原生应用脚手架，如果你的项目需要用到 Spring Cloud Alibaba 组件，那么强烈建议使用该脚手架来创建项目，可以保证各组件依赖版本号的一致性。

> 指路：https://start.aliyun.com/



用法和 Spring Initializr 几乎完全一致，可以自己选择依赖：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696911677188-5f4046ae-d780-4e11-b04b-2ef269a1aa5e.png)



#### JHipster

专门用于生成 Java 项目的工具，模板和选项非常丰富。

> 指路：https://www.jhipster.tech/cn/



![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696912132153-7e5c25b8-cc11-4ccc-bc8d-7dd5cf2197e8.png)



JHipster 的功能还是很强大的，但只是创建初始化项目的话，用法非常简单，只需要输入 `jhipster` 命令：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696912086867-d652cac3-b81c-4c0a-b6ca-f33673b0682d.png)

然后跟着命令行的提示输入选项即可：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696912231115-459e0b27-5a68-4cb2-91d8-6196db3a9dc7.png)



#### Yeoman

Yeoman 是一个生成项目模板的工具，通常用于前端项目的初始化。

虽然 Yeoman 主要用于前端开发，但也有一些 Java 项目的初始化模板。而且你可以编写自己的 Yeoman 生成器来生成 Java 代码或者任何其他类型的代码。

> 指路：https://yeoman.io/generators/



![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696911915135-b3eb2368-28f8-4ae5-9e53-1f604e17597e.png)



### 4、开源项目

除了生成项目外，我们也可以直接下载并使用 GitHub 上的开源项目代码，也就是直接用别人创建好的项目。

比较有名的有 Jeecg Boot：

> 指路：https://github.com/jeecgboot/jeecg-boot

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696912400972-7d2cddf0-7835-4c8b-bc12-bfe512fa7325.png)



项目效果：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696912521645-578e68f7-0c5c-47fa-b4ff-e74fdf46935b.png)



还有若依：

> 指路：https://github.com/yangzongzhuan/RuoYi



![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696912457395-990f7637-8068-4799-bfd6-f9f55da8061b.png)



项目效果：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1/1696912486344-d7a1c5fa-264f-4493-99ca-b4038984ea33.png)



这些项目一般都是大而全的、功能十分丰富的管理系统，对于企业来说会比较实用，但是对于编程学习者来说，不是很推荐，想要自定义开发一些额外的功能会比较麻烦。



------



除了以上方法外，最推荐的方法还是在学习和开发过程中，持续整理和沉淀一套属于自己的万用项目模板，企业中也通常都会有适应业务的基础建设代码。这样一来，绝大多数功能都不用重复写第 2 遍，以后开发新项目会越来越快。



## 实践

编程导航的用户中心项目使用了 IDEA 来创建 Spring Boot 项目，其他项目使用了鱼皮自己封装的 [Spring Boot 后端万用项目模板](https://yuyuanweb.feishu.cn/wiki/Nnu3wSBrri3umyk1StnctK0LnAd)，OJ 判题项目使用了微服务模板生成器。

👉🏻 编程导航原创项目教程系列：https://yuyuanweb.feishu.cn/wiki/SePYwTc9tipQiCktw7Uc7kujnCd