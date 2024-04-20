# 程序员 Bug 修复手册

> 程序员鱼皮的编程宝典：https://codefather.cn/



## 介绍

程序员鱼皮带大家做项目多年，发现大家遇到的很多问题其实都是通用的。

为提高 Bug 的解决效率、带大家提升自主解决 Bug 的能力，鱼皮决定打造一个《经典 Bug 和排查方案汇总》。



## 大纲

1、解决 Bug 的流程套路：做项目前必读

2、经典 Bug 解决方案：根据需要查找和阅读

3、Bug 案例分享：感兴趣的同学阅读长见识



## 1、解决 Bug 的流程套路

[解决 Bug 的流程套路总结](解决%20Bug%20的流程套路/解决%20Bug%20的流程套路总结.md)

[常见写 Bug 原因汇总](解决%20Bug%20的流程套路/常见写%20Bug%20原因汇总.md)

[常见请求错误码解释及解决方案](解决%20Bug%20的流程套路/常见请求错误码解释及解决方案.md)



## 2、经典 Bug 解决方案

### 通用

#### 项目启动时报错、无法正常运行？

[Bug 解决 | 项目启动失败](经典%20Bug%20解决方案/Bug%20解决%20%20项目启动失败.md)



#### 和教程的操作完全一致，但是却出现错误？

[Bug 解决 | 项目启动失败](经典%20Bug%20解决方案/Bug%20解决%20%20项目启动失败.md)



#### HTTP 响应状态码不为 200，怎么处理？

[常见请求错误码解释及解决方案](解决%20Bug%20的流程套路/常见请求错误码解释及解决方案.md)



#### 项目本地正常运行，但上线后出现报错或无法访问？

[Bug 解决 | 本地项目上线后出现错误](经典%20Bug%20解决方案/Bug%20解决%20%20本地项目上线后出现错误.md)

[Bug 解决 | 无法访问线上服务](经典%20Bug%20解决方案/Bug%20解决%20%20无法访问线上服务.md)



#### 用户无法正常登录，无法正确获取到用户信息？

[Bug 解决 | 无法正常登录或获取不到用户信息](经典%20Bug%20解决方案/Bug%20解决%20%20无法正常登录或获取不到用户信息.md)



### 后端

#### 后端项目无法正常启动，或者数据库、Redis 等依赖服务连接失败？

[Bug解决 | 后端项目无法正常启动、运行（含数据库、redis连接失败）](经典%20Bug%20解决方案/Bug%20解决%20%20后端项目无法正常启动，或依赖服务连接失败.md)



### 前端

#### 使用前端框架初始化项目，出现错误、无法正常运行？

[Bug 解决 | 前端框架初始化错误](经典%20Bug%20解决方案/Bug%20解决%20%20前端框架初始化错误.md)



#### 前端无法查询到数据、一直加载或和预期结果不一致？

[Bug 解决 | 数据查询为空或错误](经典%20Bug%20解决方案/Bug%20解决%20%20数据查询为空或错误.md)



#### 使用组件库报错、或者样式丢失 / 不生效？

[Bug 解决｜组件库报错、或样式丢失/不生效](经典%20Bug%20解决方案/Bug%20解决｜组件库报错、或样式丢失不生效.md)



#### 前端项目上线后，无法正确访问到页面，或出现 404 错误？

[Bug 解决｜无法正确访问到页面或出现 404 错误](经典%20Bug%20解决方案/Bug%20解决｜无法正确访问到页面或出现%20404%20错误.md)



#### 前端项目上线后，无法正确请求后端接口并得到响应？

[Bug 解决 | 前端无法正确请求后端接口并得到响应？](经典%20Bug%20解决方案/Bug%20解决%20%20前端无法正确请求后端接口并得到响应？.md)



#### 前端项目能运行，但有很多错误提示和告警？

[Bug 解决 | 为什么前端项目能够正确运行，但是有很多错误提示和告警？](经典%20Bug%20解决方案/Bug%20解决%20%20前端项目能运行，但有很多错误提示和告警？.md)



#### 前端项目无法正确安装依赖？

[Bug 解决 | 前端项目无法正确安装依赖？](经典%20Bug%20解决方案/Bug%20解决%20%20前端项目无法正确安装依赖？.md)



## 3、Bug 案例分享

### 后端

数据误刷导致权限错误：[员工写了个比删库更可怕的 Bug！](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247546578&idx=1&sn=03f057dbc8b763d9f0e5e2f1bf575d16&chksm=e9c2d125deb558332c23ce786deb3220d5df41b540f3496fcae0cb70bb8d077518ff48dd315b&token=593920816&lang=zh_CN#rd)

端口被其他程序占用：[写了7年代码，第一次见这么狗血的小Bug！](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247556008&idx=1&sn=d5954518f92cdeaa9697e127a461494d&chksm=e9c2fc5fdeb57549f682fe35b2cd2454e03617fedc63f4681a60a8e87a0ba7b677172468f6b0&token=661451642&lang=zh_CN#rd)

字符不一致导致查询为空：[写了7年代码，第一次见这么狗血的小Bug！](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247543723&idx=1&sn=3db0d0bcf9311f7f77c73bd35005515b&chksm=e9c2cc5cdeb5454abe0a9ac6dccbeaa80e9dc540f34f05bbc49f0b92f9be3ca63c6c5fc25c38&token=593920816&lang=zh_CN#rd)

单元测试里插入数据导致的问题：[万万没想到，这都能发现 Bug？！](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247503753&idx=1&sn=b399e25957b5a39ba4c96f8d6c29ac95&chksm=e9c2287edeb5a168922a382aab3668b7a35fa0d7e8661b4aebbe76de235496dc3ccce6fb0f45&token=579718986&lang=zh_CN&scene=21#wechat_redirect)

大对象导致 JVM 内存溢出：[这个 Bug，给我整得一愣一愣！](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247504756&idx=1&sn=c55d1fcd2aa397d848d63dcc7d7d58d5&chksm=e9c23483deb5bd95ca312e3e2d782f174aeb47a364c18f0bd9372b60dec832c9d2dc2aaf7308&token=579718986&lang=zh_CN&scene=21#wechat_redirect)

Docker 环境问题导致的数据查询错误：[我竟被这个 Bug 坑了一周！](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247502291&idx=2&sn=8ad9225d5df4623e98034a1272baab62&chksm=e9c22e24deb5a7324214dd50200b7e9ba000715fff8613f90fc1d44422f431cbfda5b6542146&token=579718986&lang=zh_CN&scene=21#wechat_redirect)

数据库连接池爆了：[热乎的，线上问题排查，拿去面试用！](https://mp.weixin.qq.com/s/WCeHESrSFz6vdRXKXAmrEA)

缓存导致的订单数据全量同步问题：[刚线上又出现一个问题。。。热乎的](https://mp.weixin.qq.com/s/aXMwJYdajmD0DYrLZWgJoQ)

JDK序列化错误：[擦，就加了一个字段还能出事故？](https://mp.weixin.qq.com/s/4mliEkrwUSH1Xu1lhHcOeQ)

Spring Cloud Gateway 500 错误：[线上服务挂了 3 分钟](https://mp.weixin.qq.com/s/yxeGF1IYN5_CrIubDdXSyw)

随机密码生成规则错误：[md！这代码有毒](https://mp.weixin.qq.com/s/n0OSHUJmLlUKh30R_xF29A)

HttpUtil.toParams 空串问题：[刚分析完的线上问题，想骂娘！](https://mp.weixin.qq.com/s/KkErgp85lx5mWUD_1v6XfQ)

用户登录不上零宽空格问题：[一个看不见的bug？？？](https://mp.weixin.qq.com/s/O5slZJZ-oJ_BeXe5emXRxQ)

消息中间件出错兜底方案：[这操作，挽救了一次大事故！](https://mp.weixin.qq.com/s/zgDt-VflpsJ99IWAJAo0TA)



### 前端

前端长整数精度丢失：[记一次前端长整数精度丢失问题](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247483942&idx=1&sn=dcb95d601500acea61c8e396c6866d9b&scene=21#wechat_redirect)

升级依赖版本导致的 Bug：[越自信，Bug 越多](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247504515&idx=1&sn=417207855fdfa774c0ee6515f8f1d711&chksm=e9c23574deb5bc6212cc6ac9d38eafacdcfaaaece5f3f1250763ae7fb27c096e9c20f949759a&token=579718986&lang=zh_CN&scene=21#wechat_redirect)

对前端依赖版本问题的深挖：[扒个知名项目的 Bug！](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247498523&idx=1&sn=0584d43c069dfa88d750e1752e63dd5c&scene=21#wechat_redirect)

缺少测试和上线规范导致的 Bug：[员工写了个大 BUG，网站痛失 300 元！](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247558252&idx=1&sn=2d0b24ce497a723d6d179e59bd17953c&chksm=e9c3039bdeb48a8d26043662343ae14e448c6ca8a948386e49d631089301e6ad3d0d1884402f&token=1492589791&lang=zh_CN#rd)
