# 后端 Spring Boot 万用模板使用

> 作者：[小白条](https://gitee.com/falle22222n-leaves)，[编程导航星球](https://yuyuanweb.feishu.cn/wiki/VC1qwmX9diCBK3kidyec74vFnde) 编号 5563



今天来给大家介绍一下星球的后端 Spring Boot 万用模板的使用。

## 1、每个模块的简要概写

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640486384-c94696c5-67ab-4caf-97bb-289d9dff6d93.png)



## 2、一些重点模块的讲解

### 2.1 全局项目配置

>  application.yml

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640486095-16d52e5e-23ac-4fb9-8c9e-3187b22c22f2.png)

数据库配置文件是每一个项目都要修改的，一般修改内容为：数据库表名，例如: my_db，用户名: xxxx 密码: xxxx。

Redis 在一伙伴匹配项目中用到，如有需要需要替换成自己的密码。并且在 Spring Boot 启动类中作出如下修改。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640486092-54fc323e-73fa-4ceb-9ddd-bed8a82d7ade.png)



### 2.2 全局请求、鉴权拦截器

> AuthInterceptor 和 LogInterceptor

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640487489-3ac365fe-64c7-46b5-8d50-0934e351e63f.png)

先介绍下AuthInterceptor,权限校验机制，判断用户的role(角色)是否为管理员、用户、ban(封号)三种情况。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640486129-5744810e-aa62-4250-b7aa-b357a2178a02.png)

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640486459-2f2c3475-4f36-4847-ac07-14ce80d07eb3.png)

像创建用户这个方法就是只有管理员能够使用，用@AuthCheck自定义注解，然后写上使用该方法要有的权限即可。权限校验器因为是@Around环绕通知并且表明在有authCheck注解的方法周围执行如下逻辑。

@Around环绕通知在也就是在方法执行前后额外添加的逻辑。AOP功能的诠释，如果有不懂这段逻辑的可以去回顾下Spring的AOP功能，**面试**中经常会提及，能够回答出AOP的实际项目应用也是很不错的一个点。

**接下来介绍一下 LogInterceptor**

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640486509-0777b90f-c2d2-4cef-b40a-f44dbe4a0567.png)

简要说明：请求日志拦截器，用于输出请求日志，@Around是环绕通知，然后用了切入点表达式，要拦截哪个包或者哪些包下面的哪个方法或者是全部方法。这段切入点表达式的功能就是对com.yupi.springbootinit.controller中所有方法进行拦截。也就是说控制层执行方法就会打印日志进行输出。有利用异常信息的捕获和后端调试debug。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640486625-bbae1d94-eabc-44dc-88e9-148c55232fcd.png)

### 2.3 通用响应类

> BaseResponse、ResultUtils和 ErrorCode

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640487036-c592b7fd-1c06-4993-9559-25f997dad93d.png)

**下面是 BaseResponse 的介绍：**

通用返回类，code 表示响应状态码，data 存放返回的数据，message :成功或者失败的额外信息。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640486896-0fbf9908-ff9f-44b2-bc2e-698721de71ed.png)

**下面是 ResultUtils 的介绍：**

主要用于简化 BaseResponse 的操作，将成功，失败的一些通用情况进行的静态方法的封装，然后可以很方便的进行调用，比如调用 success 方法，响应状态码就是 0，然后会将data封装到 BaseResponse 的data属性，message为 "ok"。如果你的前端想要响应状态吗为 200，那么将这里的 0 改成 200就可以了,这边的message为固定消息 "ok"。可以再设置一个静态方法，进行方法重构,success形参为(T data,String message)，然后可以动态定义成功的时候的返回消息。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640486909-436afe94-f89b-4b2a-bc1c-d4be3e5ccce0.png)

**下面是 ErrorCode 的介绍：**

ErrorCode配合上面的ResultUtils使用,可以定义枚举类将常规的响应状态码和响应信息进行封装。比如: 无权限访问(40300),服务器内部异常(50000),你可以添加自定义的一些专属你自己项目的响应状态码，例如: API 项目 接口调用失败,可以是 INTERFACE_ERROR(50003,"接口调用失败")。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640487041-3f361891-ab7d-4630-b02c-40e7a76c3828.png)

### 2.4 配置类

> JsonConfig、Knife4jConfig、MyBatisPlusConfig、CorsConfig、CosClientConfig、WxOpenConfig

**下面是 JsonConfig 的介绍：**

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640487306-36d86730-7c65-40da-adc6-d4fed17c4142.png)

**@JsonComponent作用：**自定义序列化和反序列JSON数据，Spring Boot 默认使用 JackSon 进行序列化和反序列化。

**怎么防止丢失？**用@Bean覆盖组件后，重写逻辑代码，将包装类 Long 和基础数据类型 long 转化成字符串序列化成字符串防止在序列化的时候丢失精度。

**精度丢失场景**：id在数据库是 BigInteger 类型，雪花算法生成id大于17位，因此在序列化的时候会产生精度丢失。

**下面是 Knife4jConfig 的介绍:**

**Knife4jConfig 用于后端接口在线测试的配置类。**

图中@Profile用于指定在什么环境配置，和配置文件的 spring.profiles.active 是相互关联的。因此只在开发环境和测试环境中生效。

basePackage:用于指定要扫描 Controller 层的包，**如果你的控制层的包名有所不同，需要进行修改，Knife4j才能生效。**

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640487379-8c3bd73b-d75b-4e7b-a964-e2f0df6b0a92.png)

**下面是 MyBatisPlusConfig 的介绍：**

@MapperScan用于指定扫描的路径，如果你的项目的基础包名路径不同，需要修改为你自己的。

这边是用@Bean进行组件的注入，然后添加了分页插件。

MyBatisPlus还有很多插件，例如：乐观锁插件、多租户插件、动态表明插件、数据权限插件等等。可以去[官网](https://www.baomidou.com/pages/24112f/)查看。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640487417-16817fb3-5662-4f03-bd96-df7668060fec.png)

**下面是 CorsConfig 的介绍：**

CorsConfig 用来解决全局跨域配置问题，可以指定请求方法、是否允许发送 Cookie、放行哪些特定域名或 ip、允许哪些请求头。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698801032054-96cc6744-4c50-4e68-8fed-a39deeae725f.png)

**下面是 CosClientConfig 的介绍：**

直接将你的accessKey、secretKey、region、bucket进行替换即可，在application.yml中做替换，然后配合工具类即可使用对象云存储的功能。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698801263105-19eba16a-10e1-4afb-9e4a-40079279d39d.png)

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698801304671-90815f8d-a58a-44d5-b518-f08451993cbe.png)

**下面是** **WxOpenConfig 的介绍：**

在微信开放平台获取 appId、appSecret、等配置后，在 applicaiton.yml 中替换即可。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698801545431-8244152c-bd32-41a2-990d-65d8bb52da14.png)

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698801592359-82f0c431-9e3a-413f-8a5d-2952fd9a4085.png)

### 2.5 全局异常处理

> BusinessException、GlobalExceptionHandler和ThrowUtils



**下面是 BusinessException 的介绍：**

code：错误码，message因为继承了父类RunTimeException，因此就有属性message。**结合ErrorCode使用**。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640487429-f21d6b30-97b9-46ac-a2c9-87d291f62e5e.png)

**下面是GlobalExceptionHandler的介绍:**

@RestControllerAdvice注解是@ControllerAdvie和@ResponseBody注解的组合，先捕获整个应用程序中抛出的异常，然后将异常处理方法的返回值将自动转换为HTTP响应的主体。

@ExceptionHandler注解用于指定什么异常需要被捕获。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640487783-6389fed0-5adb-4f56-a47c-97cd715fe8b7.png)

**下面是ThrowUtils的介绍:**

一般用于请求参数的校验，如果请求参数为空，直接抛出业务异常，然后指明错误码ErroCode和message错误信息。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698640487800-03b50a42-aad8-4140-a57e-cd8923718b10.png)

### 2.6 数据库和 ES 同步

> IncSyncPostToEs和FullSyncPostToEs



**下面是IncSyncPostToEs的介绍：**

**@Component 注解：**如果取消注解，就将这个定时任务加入到Spring 容器中，Spring Boot 启动类启动后将会开启这个定时任务。

**@Scheduled:** Spring Boot 的定时任务控制的注解，这里用于每分钟执行同步帖子的逻辑。

**应用场景：**

1.想要统计Top10的接口调用次数(API接口),在数据库量大后，每个用户去发送请求获取Top10的接口调用次数会造成数据库请求压力过大，此时可以写个定时任务，可以定时24小时，每天将Top10的接口调用次数同步到Redis存储，以接口名称和键以接口调用次数为值保存即可。实时性要求不太强的功能，可以采用定时任务。

2.某个API接口不用用户传参，而且大多数时间回复的调用结果都是相通的，那么就可以采取定时任务，将这些不用用户传参，并且调用结果都是相同的接口定时同步到Redis存储，相对于数据库的IO读取，Redis存储会大大提升这些接口的QPS，可以自己在简历上进行量化处理。

### 2.7 工具类

> NetUtils、SpringContextUtils、SqlUtils

**下面是 NetUtils 的介绍：**

主要用于获取客户端的 IP 地址

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698801981800-0a8b6686-ac6a-41d2-951e-e5be240cb9e4.png)

**下面是 SpringContextUtils 的介绍：**

用于通过名称、类型、名称和类型获取 Spring 上下文的容器。

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698802046512-8f312f15-33b9-4a50-a66b-ebe3114e8e49.png)

**下面是 SqlUtils 的介绍：**

主要用于检查 SQL 注入问题

![](https://cdn.nlark.com/yuque/0/2023/png/27791434/1698802128587-af76408f-06c3-4f82-a346-36aa95fb69ba.png)