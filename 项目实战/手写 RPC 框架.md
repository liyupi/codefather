# 手写 RPC 框架（24 年最新完结）

> 作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> ⭐️ 加入项目系列学习：[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 

## 项目简介

### 项目介绍

基于 Java + Etcd + Vert.x 的高性能 RPC 框架，用新颖的技术栈从 0 到 1 带大家开发轮子。教程由浅入深，可以学习并实践基于 Vert.x 的网络服务器、序列化器、基于 Etcd 和 ZooKeeper 的注册中心、反射、动态代理、SPI 机制、自定义网络协议、多种设计模式（单例 / 工厂 / 装饰者等）、负载均衡器设计、重试和容错机制、Spring Boot Starter 注解驱动开发等，大幅提升架构设计能力。

项目分为基础版和扩展版：

- 基础版只需学几个小时，就能写在简历上的小项目~
- 扩展版将是充满亮点的技术类项目，搭配一个业务项目，让简历更有竞争力。

本项目虽然是以 Java 语言为主，但所有的设计思路和知识点是通用的，Go 或 C++ 等其他后端语言的同学也可以学习。

> 代码开源地址：[https://github.com/liyupi/yu-rpc](https://github.com/liyupi/yu-rpc)
>
> Gitee：[https://gitee.com/liyupi/yu-rpc](https://gitee.com/liyupi/yu-rpc)

### 免费试学

感兴趣的同学可以 **免费试看** 第一期项目文字教程：[https://mp.weixin.qq.com/s/lOm7k032II3gDG9xnEmpUg](https://mp.weixin.qq.com/s/lOm7k032II3gDG9xnEmpUg)

### 项目特点

该项目是一个侧重技术架构的轮子类项目，区别于增删改查、泛滥的业务系统，能学到很多后端架构设计方面的知识技能，比如网络协议设计、注册中心、动态代理和 SPI 机制、多种设计模式、负载均衡、重试机制、容错机制等等。

区别于网上已有的 RPC 项目教程，鱼皮的 RPC 教程是真正 **从 0 到 1、一步一步带大家思考并完成项目**，而不是对着源码去讲解，更适合入门理解。而且，鱼皮的 RPC 教程选用了 **Vert.x、Etcd、Kryo 等新颖的技术**，并且从 0 带大家从入门到实践这些技术。**做完这个项目，可能比看好多套教程带来的收获都大。**

> 负责任地说，鱼皮决定带大家做这个项目前，把市面上几乎所有的 RPC 教程都看了，只为帮助大家更好地入门学习。

因此，强烈建议所有后端方向的同学，跟着鱼皮的教程动手做个自己的 RPC 框架。

精心划分的目录结构，更适于学习：

![](https://pic.yupi.icu/5563/202403171822575.png)

5 万多字、详细的保姆级图文教程，更适于技术类项目学习：

![](https://pic.yupi.icu/5563/202403171822626.png)

跟着鱼皮做项目的收获：

![](https://pic.yupi.icu/5563/202403171822662.png)

鱼皮的实战项目系列还会提供以下服务，详情见 [项目实战 - 鱼皮原创项目教程系列](https://yuyuanweb.feishu.cn/wiki/SePYwTc9tipQiCktw7Uc7kujnCd) ：

- 详细的直播笔记
- 完整的项目源码
- 答疑解惑
- 专属项目交流群
- ⭐️ 现成的简历写法（20 多个亮点，直接写满简历）
- ⭐️ 项目的扩展思路（拉开和其他人的差距）
- ⭐️ 项目相关面试题、题解和真实面经（几十道面试题，提前准备，面试不懵逼）
- ⭐️ 前端 + Java 后端万用项目模板（快速创建项目）

### 项目收获

鱼皮给大家讲的都是通用的项目开发方法和架构设计套路，从这个项目中你可以学到：

- 如何拆解需求，从 0 开始设计实现 RPC 框架？
- 如何运用设计模式 + SPI 机制扩展项目？
- 如何更优雅地加载和管理全局配置？
- 如何自定义高性能的 RPC 协议？
- 如何基于 Vert.x 设计实现 TCP 服务器和客户端？
- 如何基于 Etcd 设计高性能的注册中心？
- 如何设计实现负载均衡器，提高系统性能？
- 如何设计实现重试和容错机制，提高系统稳定性？
- 如何基于注解和 Spring Boot Starter 设计项目启动机制？
- 如何从多个角度分析优化项目？

此外，还能学会很多作图、思考问题、对比方案的方法，提升排查问题、自主解决 Bug 的能力。

### 本项目适合的同学

本项目适合学过至少一门后端开发框架、并且能够独立完成 1 个增删改查项目的同学。相比于业务系统，做 RPC 框架这样的技术轮子类项目，能够快速补充知识点、并大幅提升系统架构设计能力，也能给简历增加很多亮点。

虽然项目是以 Java 语言为主，但所有的设计思路和知识点是通用的，Go 或 C++ 等其他后端语言的同学也可以学习。

如果你已经学习过至少一门 RPC 框架（比如 Dubbo），学这个项目会更加轻松。

更多项目学习建议，可以阅读 [鱼皮项目学习建议](https://yuyuanweb.feishu.cn/wiki/Q4AdwjLDWiLZy0kAjHqcQinon8N)。

> ⭐️ 加入项目系列学习：[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 

## 技术选型

### 后端

后端技术以 Java 为主，但所有的思想和设计都是可以复用到其他语言的，代码不同罢了。

- ⭐️ Vert.x 框架
- ⭐️ Etcd 云原生存储中间件（jetcd 客户端）
- ZooKeeper 分布式协调工具（curator 客户端）
- ⭐️ SPI 机制
- ⭐️ 多种序列化器
  - JSON 序列化
  - Kryo 序列化
  - Hessian 序列化
- ⭐️ 多种设计模式
  - 双检锁单例模式
  - 工厂模式
  - 代理模式
  - 装饰者模式
- ⭐️ Spring Boot Starter 开发
- ⭐️ 负载均衡、重试和容错机制
- ⭐️ 反射、动态代理和注解驱动
- Guava Retrying 重试库
- JUnit 单元测试
- Logback 日志库
- Hutool、Lombok 工具库

## 项目大纲

这个项目内容非常多，大家可以看看有没有自己想学的知识点。

### 第一章：RPC 框架简易版

1. RPC 基本概念和作用
2. RPC 框架实现思路 | 基本设计
3. RPC 框架实现思路 | 扩展设计
4. 简易版 RPC 开发 | 项目初始化
5. 简易版 RPC 开发 | web 服务器
6. 简易版 RPC 开发 | 本地服务注册器
7. 简易版 RPC 开发 | 序列化器
8. 简易版 RPC 开发 | 请求处理器
9. 简易版 RPC 开发 | 消费者代理
10. 简易版 RPC 开发 | 测试验证

### 第二章：RPC 框架扩展版

1. 全局配置加载 | 扩展版项目初始化
2. 全局配置加载 | 配置加载实现
3. 全局配置加载 | 维护全局配置对象
4. 接口 Mock 设计实现
5. 序列化器 | 主流序列化器对比
6. 序列化器 | 多种序列化器实现
7. 序列化器 | SPI 机制
8. 序列化器 | 可扩展序列化器实现（SPI + 工厂模式）
9. 注册中心 | 注册中心核心能力
10. 注册中心 | 注册中心技术选型
11. 注册中心 | Etcd 云原生中间件入门
12. 注册中心 | 基于 Etcd 实现注册中心
13. 注册中心 | 可扩展注册中心实现（SPI + 工厂模式）
14. 注册中心优化 | 心跳检测和续期机制
15. 注册中心优化 | 服务节点下线机制
16. 注册中心优化 | 消费端服务缓存
17. 注册中心优化 | 缓存更新（Etcd 监听机制）
18. 注册中心优化 | ZooKeeper 注册中心实现
19. 自定义协议 | 需求分析及方案设计
20. 自定义协议 | 消息结构设计（参考 Dubbo）
21. 自定义协议 | 网络传输设计（基于 Vert.x 实现 TCP 服务器）
22. 自定义协议 | 编码 / 解码器
23. 自定义协议 | TCP 请求处理器
24. 自定义协议 | TCP 请求客户端
25. 自定义协议 | 粘包半包问题分析
26. 自定义协议 | 使用 Vert.x 解决粘包半包问题
27. 自定义协议 | 客户端代码优化（装饰者模式）
28. 负载均衡 | 负载均衡概念和常用算法
29. 负载均衡 | 一致性 Hash
30. 负载均衡 | 多种负载均衡器实现
31. 负载均衡 | 可扩展负载均衡器实现（SPI + 工厂模式）
32. 重试机制 | 重试等待策略
33. 重试机制 | 重试方案设计
34. 重试机制 | 多种重试策略实现
35. 重试机制 | 可扩展重试策略实现（SPI + 工厂模式）
36. 容错机制 | 容错策略和实现方式
37. 容错机制 | 容错方案设计
38. 容错机制 | 多种容错策略实现
39. 容错机制 | 可扩展容错策略实现（SPI + 工厂模式）
40. 启动机制 | 框架快速启动类
41. 启动机制 | 注解驱动设计
42. 启动机制 | Spring Boot Starter 注解驱动实现
43. 项目扩展思路

## 项目资料

### 学习计划

项目学习计划：[https://www.codefather.cn/course/1768543954720022530/section/1797445761046593537?type=](https://www.codefather.cn/course/1768543954720022530/section/1797445761046593537?type=)

### 文字教程

> 非常详细，建议搭配视频教程一同使用

项目完整文字教程：[https://www.codefather.cn/course/1768543954720022530/section/1768545847093518337?type=](https://www.codefather.cn/course/1768543954720022530/section/1768545847093518337?type=) （完整文字教程）

### 项目源码

项目完整源码：[https://www.codefather.cn/course/1768543954720022530/section/1797445800112340994?type=](https://www.codefather.cn/course/1768543954720022530/section/1797445800112340994?type=)

### 项目答疑

项目问答专区（请在 PC 端访问编程导航链接）：[https://www.codefather.cn/course/1768543954720022530?current=1&tabKey=qa](https://www.codefather.cn/course/1768543954720022530?current=1&tabKey=qa)

可以在编程导航中更好地解决项目中遇到的问题：[利用编程导航解决问题](https://yuyuanweb.feishu.cn/wiki/FY7DwfanEikgzuk3yJlcXRWLnZc)

### 项目交流群

加群方式请见编程导航帖子：[https://www.codefather.cn/course/1768543954720022530?current=1&tabKey=qunCode](https://www.codefather.cn/course/1768543954720022530?current=1&tabKey=qunCode)（[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 后可见）

### 简历写法

项目简历写法：[https://www.codefather.cn/course/1768543954720022530/section/1769964903847714818?current=1&tabKey=qunCode&type=](https://www.codefather.cn/course/1768543954720022530/section/1769964903847714818?current=1&tabKey=qunCode&type=)

### 项目面试题

项目面试题：[https://www.codefather.cn/course/1768543954720022530/section/1771045558887211010?current=1&tabKey=qunCode&type=](https://www.codefather.cn/course/1768543954720022530/section/1771045558887211010?current=1&tabKey=qunCode&type=)

## 学员反馈

> 展示部分学员的真实反馈，也欢迎编程导航鱼友私信编程导航管理或鱼皮反馈，认真完成项目会有小奖励哦 🧧！

### 项目总结（持续更新中）

### 上岸报喜（持续更新中）

欢迎上岸的同学报喜，有奖励 🧧 ~ 

### 学员评价（持续更新中）

![](https://pic.yupi.icu/5563/202403171822607.png)

![](https://pic.yupi.icu/5563/202403171822490.png)

![](https://pic.yupi.icu/5563/202403171822503.png)

### 成品展示（持续更新中）

## 更多项目

请见：[项目实战 - 鱼皮原创项目教程系列](https://yuyuanweb.feishu.cn/wiki/SePYwTc9tipQiCktw7Uc7kujnCd)

## 加入学习

点击 [加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) ，鱼皮原创项目均可学习。