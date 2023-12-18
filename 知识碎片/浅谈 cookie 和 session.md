# 浅谈 cookie 和 session

> 作者：[Louis brilliant](https://www.code-nav.cn/user/1620599227736473602/info)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 11413

关于用户信息存储相关的问题

> 最近写了好多次登录注册的业务接口，那不免会听到session、cookie等概念。那么他们是什么呢？之间的关系？有啥作用呢？我这次终于好好捋清楚他们的关系了，这次做一次学习总结。

## 背景

 先讨论Session和Cookie，我们先了解其诞生的背景，**毕竟需求推动技术的**！

 基于以前的互联网的网络协议的请求是HTTP（无状态的网络请求协议），意味着每个单独的请求之间是**相互独立、互不相关**的，服务器在处理一个请求后并不会保存任何关于客户端状态的信息。这样带来的弊端就是服务端无法判断客户端发来的请求是哪个用户发起的，因此我们就需要对**状态保持进行额外处理**，这就诞生了Cookie和Session。

## Cookie

### 概念

 Cookie（HTTP Cookie）是由服务器（服务端）发送到用户浏览器（客户端）并保存在用户本地计算机上的**小型文本文件**（`可持久化`）。Cookie 用于存储特定网站的用户信息（`状态保持`），以便在用户访问同一网站时可以检索和使用这些信息。

### 应用场景

> 概念似乎晦涩难懂，以一些应用场景举例，就可能体察到Cookie的存在啦

1. 用户登录，存储账号密码

这个就必须是**首次登录成功后**，浏览器会提示用户是否要保存账号信息，这个本质就是通过Cookie进行用户信息的存储，下次就可以直接`免登陆`操作了。

> PS:免登陆不是说不用通过数据库查询，而是下次登录的信息从Cookie中取出。

![](https://pic.yupi.icu/5563/202312151543693.png)

1. 会话管理

用于检测用户是否在网站登录后有进行连续操作（访问网站资源），否则超过过期时间，则会消失，即用户就得重新校验身份。例如：哔站登录后不作任何操作，30天过需要重新登录。

1. 个性化体验

这种存储个人偏好配置，采用的方案之一就有是Cookie进行的。个人偏好配置比如：暗黑模式，页面布局、语言选择等等。

### 作用

通过上面的介绍，Cookie的作用也应该已经呼之欲出了！这里还是总结一下~

- 服务器识别用户，保持用户在跳转页面时会话状态的一致性。
- 实现免登陆，自动进行身份验证
- 保留个性化体验

### 存储位置

既然Cookie是存储在本机的小型文本，那么它具体存储在哪里呢？

答：不同的浏览器和不同的操作系统，Cookie存储本机的位置都是不同的。见下图（Chatgpt如是说）

![](https://pic.yupi.icu/5563/202312151543765.png)

## Session

> Session的中文名是会话,Session和Cookie可谓是“黄金搭档”，有了Cookie就一定有Session。

#### 概念

 会话（Session）是指在用户与服务器**（服务端）**之间建立的一个交互周期。它允许服务器跟踪用户在一系列请求和响应之间的状态，从而实现一定程度的状态保持。意思就是我们常说的Session是存在于服务端的一个概念，用于跟踪用户的请求和响应。

> 问题：
>
> 1. 浏览器的Cookie里面也有session，和服务端的Session的区别是什么？
>
> 答：前者的Session又称之为**会话Cookie**，他是属于浏览器进程中Session，一旦关闭浏览器，会话Cookie就会被杀死，因此是**不具持久化**的；后者的**Session**是创建于服务端，他可以**被持久化**，可以存储多个地方，如：内存，磁盘等。

#### Cookie和Session的关系

我以关系图来表示，这样显得更直观。

![](https://pic.yupi.icu/5563/202312151543936.png)

#### Session的生命周期

这里就得要分类讨论了，浏览器的Session（会话Cookie）和服务端的Session的生命周期是不一样的。

- 会话Cookie：

   浏览器端的 Session 存储在用户的浏览器中，通常在**用户关闭浏览器时结束**。这种 Session 只在用户的当前浏览器窗口或标签页内有效。当用户关闭浏览器时，浏览器通常会清除与该 Session 相关的 Cookie 数据。

- Session：

   服务端的 Session 存储在服务器上，其**生命周期通常由服务器的配置来控制**。服务端的 Session 可以在用户的多个请求之间保持状态，而不受用户关闭浏览器的影响。

问题：

1. 不同用户在同一个浏览器同一个标签页发起同一个请求，sessionId相同吗？

   > 是相同的，但这样当前的session的value会被下一个请求的session的value覆盖。（前提是session的key是相同的）

2. 同一个浏览器不同的标签页发起同一个请求，sessionId相同吗？

   > 是相同的，因为依旧遵照这同一个浏览器同一个请求，其sessionId是不变的。

3. 不同浏览器发起同一个请求，sessionId相同吗？

   > 是不同的，因为请求的对象都变了，sessionId肯定不同

口说无凭，我进行了实验，写了一个很简单的请求，进行了测试。

```java
    @GetMapping("/test")
    public void test(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String id = request.getSession().getId();
        response.getWriter().write(id);
    }
```

Edge浏览器的SessionId：

![](https://pic.yupi.icu/5563/202312151543002.png)

![](https://pic.yupi.icu/5563/202312151543923.png) Chrome的SessionId

![](https://pic.yupi.icu/5563/202312151543928.png)

总结：不管是否是同一个用户还是不同的标签，只要符合**同一个浏览器同一个请求**，那么的sessionId一定是相同的！

## 参考

[服务器端Session、客户端Session和Cookie的区别_session在网络应用中称为会话,每个用户首次与web服务器建立连接时,就会产生一个se-CSDN博客](https://blog.csdn.net/java_faep/article/details/78082802)

[java中session的用法与原理-CSDN博客](https://blog.csdn.net/samniwu/article/details/90417160)

[session何时被创建，何时被销毁以及设置session过期时间_session对象在什么时候被创建-CSDN博客](https://blog.csdn.net/qq_41538097/article/details/106239901)

[Session的生命周期和工作原理-CSDN博客](https://blog.csdn.net/hanziang1996/article/details/78969044)

[session什么情况下会改变_什么样的情况下会出现不同session-CSDN博客](https://blog.csdn.net/zhujason9107/article/details/52808648)