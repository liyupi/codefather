# API 开放平台

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)
> 
> ⭐️ 加入项目系列学习：[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 

## 项目简介

### 项目介绍

提供 API 接口供开发者调用的平台，基于 Spring Boot 后端 + React 前端的 **全栈微服务项目**。

管理员可以接入并发布接口、统计分析各接口调用情况；用户可以注册登录并开通接口调用权限、浏览接口、在线调试，还能使用 **客户端** **SDK** 轻松在代码中调用接口。

项目的前端并不复杂，更侧重后端，包含丰富的编程技巧和架构设计层面的知识。

主页（浏览接口）：

![](https://pic.yupi.icu/1/(null)-20231026152048190.(null))

接口管理：

![](https://pic.yupi.icu/1/(null)-20231026152048617.(null))

在线调试：

![](https://pic.yupi.icu/1/(null)-20231026152048976.(null))

使用自己开发的客户端 SDK，一行代码调用接口：

![](https://pic.yupi.icu/1/(null)-20231026152049252.(null))

项目架构图：

![](https://pic.yupi.icu/1/(null)-20231026152049478.(null))

### 项目特点

首先是它非常 **新颖** ，不同于大家在学校时做的管理系统、商城项目等，开放平台通常是知名企业（产品）才会建设和提供的。开放平台类的项目不要说现成的教程了，连相关的文章都少的可怜！

如下图，有点儿人看的文章基本都是几年前的了：

![](https://pic.yupi.icu/1/(null)-20231026152049847.(null))

此外，开放平台项目涉及 **多个系统** 的交互（不止有一个后端），包含了 API 签名认证、网关、RPC、分布式等 **后端必学** 知识，很适合帮助后端同学开拓眼界、提升系统设计和架构能力，而这点是很多网课不能做到的。

![](https://pic.yupi.icu/1/(null)-20231026152050073.(null))

鱼皮 **从 0 到 1 全程直播无剪辑** 地带大家开发完成项目，总课程时长 **近 20 小时** ！从需求分析、技术选型、系统设计、项目初始化、前后端开发，每个环节我都 **从理论到实践** 给大家讲的明明白白、每个细节都不放过！

除了学做项目之外，还能学会很多 **思考问题、对比方案** 的方法，提升排查问题、自主解决 Bug 的能力。还能学习到 **最方便的项目开发方式** ，熟练后 **几分钟开发一个新功能** 轻轻松松！

### 项目收获

1. 掌握做项目的完整流程，能独立开发上线项目
2. 学会企业主流前后端开发技术的应用（如 Spring Boot、React、网关等）
3. 学到新版前后端脚手架的使用，掌握快速生成代码、前后端协作的方法，提高数倍开发效率
4. 跳出传统的 CRUD，学习企业级第三方平台的架构设计和开发
5. 学到客户端 SDK、API 签名认证、API 网关、RPC 分布式等知识及编程技巧
6. 鱼皮带你读文档！让你掌握阅读官方文档的方法技巧，提高自学能力
7. 带你分析解决项目中的问题，提升自主解决问题的能力

### 本项目适合的同学

1. 学过基本后端（Java Web）或前端技术（HTML + CSS + JS）
2. 缺少项目，想给简历增加项目经验和亮点
3. 想通过实践项目快速学习主流前后端技术
4. 想学习到快速开发前后端全栈项目的技巧
5. 想掌握独立开发完整项目的方法
6. 想提升做项目的经验、系统架构设计能力
7. 想全方位提高编程及问题解决能力

### 技术选型

#### 前端

- React 18
- Ant Design Pro 5.x 脚手架
- Ant Design & Procomponents 组件库
- Umi 4 前端框架
- OpenAPI 前端代码生成

#### 后端

- Java Spring Boot 框架
- MySQL 数据库
- MyBatis-Plus 及 MyBatis X 自动生成
- API 签名认证（Http 调用）
- Spring Boot Starter（SDK 开发）
- Dubbo 分布式（RPC、Nacos）
- Spring Cloud Gateway 微服务网关
- Swagger + Knife4j 接口文档生成
- Hutool、Apache Common Utils、Gson 等工具库

## 项目大纲

### 第一章：项目诞生

1. 项目介绍和计划
2. 需求分析
3. 业务流程介绍
4. 架构图和子系统介绍
5. 技术选型（各技术作用讲解）
6. 数据库表设计
7. 项目初始化 | 前端 Ant Design Pro 框架新版教程
8. 项目初始化 | 后端  Spring Boot 万用模板使用
9. 代码自动生成 | 后端 Swagger 文档
10. 代码自动生成 | 前端 Open API（强推，大幅提高效率）

### 第二章：核心业务开发

1. 用户登录页面开发
2. 接口管理功能开发（Ant Design 高级组件）
3. 模拟接口项目 | 示例接口开发
4. 模拟接口项目 | HTTP 客户端调用
5. API 签名认证详解及实战
6. 客户端 SDK 开发（Spring Boot Starter）
7. 接口管理功能 | 发布 / 下线接口开发
8. 接口管理功能 | 前端页面开发
9. 接口列表页面开发
10. 在线调试接口功能 | 后端接口开发
11. 在线调试接口功能 | 前端页面开发

### 第三章：开发及优化

1. 接口调用统计功能 | 后端开发
2. 接口调用统计功能 | 优化方案分析及对比
3. API 网关详解 | 网关介绍及优点
4. API 网关详解 | 10 种网关应用场景
5. API 网关详解 | 网关分类及技术选型
6. API 网关详解 | Spring Cloud Gateway 实现
7. API 网关详解 | Spring Cloud Gateway 教程
8. 接口调用统计功能 | 统一业务处理（鉴权 + 统计）
9. 分布式改造 | 公共模块抽象
10. 分布式改造 | RPC 和 HTTP 调用详解
11. 分布式改造 | Dubbo 框架讲解及示例开发
12. 分布式改造 | Dubbo 业务实战
13. 管理员统计分析功能 | 前端 2 种可视化库用法
14. 管理员统计分析功能 | 后端聚合查询接口开发
15. 项目扩展点及上线分析

## 项目资料

### 学习计划

项目学习计划：[https://bcdh.yuque.com/staff-wpxfif/resource/ma2fsuvmiozzfghl](https://bcdh.yuque.com/staff-wpxfif/resource/ma2fsuvmiozzfghl)

密码见星球语雀知识库：[https://t.zsxq.com/12nb1snxh](https://t.zsxq.com/12nb1snxh)（[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 后可见）

### 视频教程

项目完整视频教程：[https://bcdh.yuque.com/staff-wpxfif/resource/dnolv8ypvnsn2bpu](https://bcdh.yuque.com/staff-wpxfif/resource/dnolv8ypvnsn2bpu)

密码见星球语雀知识库：[https://t.zsxq.com/12nb1snxh](https://t.zsxq.com/12nb1snxh)（[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 后可见）

### 项目笔记

鱼皮直播笔记：[https://bcdh.yuque.com/staff-wpxfif/resource/sntu12](https://bcdh.yuque.com/staff-wpxfif/resource/sntu12)

密码见星球语雀知识库：[https://t.zsxq.com/12nb1snxh](https://t.zsxq.com/12nb1snxh)（[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 后可见）

项目笔记详细版：[https://bcdh.yuque.com/staff-wpxfif/resource/ypeuo3f8tx4bee3x](https://bcdh.yuque.com/staff-wpxfif/resource/ypeuo3f8tx4bee3x)

密码见星球语雀知识库：[https://t.zsxq.com/12nb1snxh](https://t.zsxq.com/12nb1snxh)（[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 后可见）

其他星球学员的笔记：

- [https://t.zsxq.com/11YlRR7Fl](https://t.zsxq.com/11YlRR7Fl)             By 哒（全集及扩展）
- [https://t.zsxq.com/09kxtPrFS](https://t.zsxq.com/09kxtPrFS)         By 墨枫（全集）
- [https://t.zsxq.com/0cUsrUT6j](https://t.zsxq.com/0cUsrUT6j)             By 落魄的校花（全集）
- [https://t.zsxq.com/0cIA5buiN](https://t.zsxq.com/0cIA5buiN)      By 游戏人生（全集）
- [https://t.zsxq.com/11CTkOxm7](https://t.zsxq.com/11CTkOxm7)    By reflux（全集）
- [https://t.zsxq.com/11aU84q8F](https://t.zsxq.com/11aU84q8F)     By 宁西（全集）
- [https://t.zsxq.com/11XNd4EYr](https://t.zsxq.com/11XNd4EYr)     By Vector<>（测试覆盖率报告）
- [https://t.zsxq.com/11p3uBo9h](https://t.zsxq.com/11p3uBo9h)     By Vector<>（部署上线）
- [https://t.zsxq.com/117Y0GkbY](https://t.zsxq.com/117Y0GkbY)    By Vector<>（涉及的安全知识总结）
- [https://t.zsxq.com/11NF46q06](https://t.zsxq.com/11NF46q06)    By Tarnished（部署上线）
- [https://t.zsxq.com/11n0Cv5bb](https://t.zsxq.com/11n0Cv5bb)     By 玄德（无限循环问题）
- [https://t.zsxq.com/11qcjnyVv](https://t.zsxq.com/11qcjnyVv)       By gongwx（中文乱码）
- [https://t.zsxq.com/11m4tHIzo](https://t.zsxq.com/11m4tHIzo)        By 爱蒲蒲（部署上线）
- [https://t.zsxq.com/11RQ20nXP](https://t.zsxq.com/11RQ20nXP)        By YukeSeko（点两次登录问题）

### 直播大纲

直播大纲：[https://bcdh.yuque.com/staff-wpxfif/resource/sf3p8kuwhfi90pqq](https://bcdh.yuque.com/staff-wpxfif/resource/sf3p8kuwhfi90pqq)

密码见星球语雀知识库：[https://t.zsxq.com/12nb1snxh](https://t.zsxq.com/12nb1snxh)（[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 后可见）

### 项目源码

项目完整源码：[https://bcdh.yuque.com/staff-wpxfif/resource/engcisrcqsd1nf6t](https://bcdh.yuque.com/staff-wpxfif/resource/engcisrcqsd1nf6t)

密码见星球语雀知识库：[https://t.zsxq.com/12nb1snxh](https://t.zsxq.com/12nb1snxh)（[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 后可见）

### 项目答疑

项目问答专区（请在 PC 端访问星球链接）：[https://wx.zsxq.com/dweb2/index/tags/API%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0/48884884822418](https://wx.zsxq.com/dweb2/index/tags/API开放平台/48884884822418)

可以在星球中更好地解决项目中遇到的问题：[编程导航 1 对 1 免费答疑服务](https://yuyuanweb.feishu.cn/wiki/FY7DwfanEikgzuk3yJlcXRWLnZc)

项目问题答疑汇总：[https://bcdh.yuque.com/staff-wpxfif/resource/eslhtang9btwqhvx](https://bcdh.yuque.com/staff-wpxfif/resource/eslhtang9btwqhvx)

密码见星球语雀知识库：[https://t.zsxq.com/12nb1snxh](https://t.zsxq.com/12nb1snxh)（[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 后可见）

### 项目交流群

加群方式请见星球帖子：[https://t.zsxq.com/11dtAMfs8](https://t.zsxq.com/11dtAMfs8)（[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 后可见）

### 简历写法

项目简历写法：[https://bcdh.yuque.com/staff-wpxfif/resource/qms81hql75v7zh8s](https://bcdh.yuque.com/staff-wpxfif/resource/qms81hql75v7zh8s)

密码见星球语雀知识库：[https://t.zsxq.com/12nb1snxh](https://t.zsxq.com/12nb1snxh)（[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 后可见）

### 项目面试题

项目面试题：[https://bcdh.yuque.com/staff-wpxfif/resource/qvvfumg8v8n6nuzm](https://bcdh.yuque.com/staff-wpxfif/resource/qvvfumg8v8n6nuzm)

密码见星球语雀知识库：[https://t.zsxq.com/12nb1snxh](https://t.zsxq.com/12nb1snxh)（[加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) 后可见）

### 项目面经

- [https://t.zsxq.com/0cngfX6Ll](https://t.zsxq.com/0cngfX6Ll)     By 404ERROR（API项目面经）
- [https://t.zsxq.com/1109N1Hiw](https://t.zsxq.com/1109N1Hiw)    By fenglinglingling（API项目面经）
- [https://t.zsxq.com/11CCXbnZP](https://t.zsxq.com/11CCXbnZP)   By 只争朝夕（API项目面经）
- [https://t.zsxq.com/11CPYhPUG](https://t.zsxq.com/11CPYhPUG)   By NO（API项目面经+智能BI平台面经）
- [https://t.zsxq.com/13Le0lqxb](https://t.zsxq.com/13Le0lqxb)      By 蓝莓（API项目面经+智能BI平台面经）
- [https://t.zsxq.com/11CJJui0A](https://t.zsxq.com/11CJJui0A)      By 哒（API项目面经）

## 学员反馈

> 展示部分学员的真实反馈，也欢迎星球鱼友私信星球管理或鱼皮反馈，认真完成项目会有小奖励哦 🧧！

### 项目总结

1. [https://t.zsxq.com/11l8VW4Me](https://t.zsxq.com/11l8VW4Me) By reflux
2. [https://t.zsxq.com/11WQRTkML](https://t.zsxq.com/11WQRTkML) By k
3. [https://t.zsxq.com/1158to3tM](https://t.zsxq.com/1158to3tM)   By 问琴
4. [https://t.zsxq.com/11C9sWc65](https://t.zsxq.com/11C9sWc65)  By 欧文

### 上岸报喜

![](https://pic.yupi.icu/1/(null)-20231026152050325.(null))

![](https://pic.yupi.icu/1/(null)-20231026152050614.(null))

![](https://pic.yupi.icu/1/(null)-20231026152050826.(null))![](https://pic.yupi.icu/1/(null)-20231026152051112.(null))

![](https://pic.yupi.icu/1/(null)-20231026152051301.(null))

![](https://pic.yupi.icu/1/(null)-20231026152051585.(null))![](https://pic.yupi.icu/1/(null)-20231026152052037.(null))

![](https://pic.yupi.icu/1/(null)-20231026152052306.(null))![](https://pic.yupi.icu/1/(null)-20231026152052646.(null))

![](https://pic.yupi.icu/1/(null)-20231026152052921.(null))![](https://pic.yupi.icu/1/(null)-20231026152053250.(null))

![](https://pic.yupi.icu/1/(null)-20231026152053506.(null))![](https://pic.yupi.icu/1/(null)-20231026152053771.(null))

![](https://pic.yupi.icu/1/(null)-20231026152054092.(null))![](https://pic.yupi.icu/1/(null)-20231026152054386.(null))

![](https://pic.yupi.icu/1/(null)-20231026152054606.(null))

### 学员评价

文章链接：[https://t.zsxq.com/11ngfX6Ll](https://t.zsxq.com/11ngfX6Ll)

![](https://pic.yupi.icu/1/(null)-20231026152054865.(null))

文章链接：[https://t.zsxq.com/11CPYhPUG](https://t.zsxq.com/11CPYhPUG)

![](https://pic.yupi.icu/1/(null)-20231026152055180.(null))

文章链接：[https://t.zsxq.com/1118iktIC](https://t.zsxq.com/1118iktIC)

![](https://pic.yupi.icu/1/(null)-20231026152055424.(null))

文章链接：[https://t.zsxq.com/1107K48qw](https://t.zsxq.com/1107K48qw)

![](https://pic.yupi.icu/1/(null)-20231026152055676.(null))

### 成品展示

文章链接：[https://t.zsxq.com/12SKBFutp](https://t.zsxq.com/12SKBFutp)

![](https://pic.yupi.icu/1/(null)-20231026152055923.(null))

文章链接：[https://t.zsxq.com/11V8hfdaa](https://t.zsxq.com/11V8hfdaa)

![](https://pic.yupi.icu/1/(null)-20231026152056327.(null))

文章链接：[https://t.zsxq.com/11CTkOxm7](https://t.zsxq.com/11CTkOxm7)

![](https://pic.yupi.icu/1/(null)-20231026152056709.(null))

文章链接：[https://t.zsxq.com/11E2FVGoQ](https://t.zsxq.com/11E2FVGoQ)

![](https://pic.yupi.icu/1/(null)-20231026152056994.(null))

文章链接：[https://t.zsxq.com/11aU84q8F](https://t.zsxq.com/11aU84q8F)

![](https://pic.yupi.icu/1/(null)-20231026152057349.(null))

文章链接：[https://t.zsxq.com/11PcX53Se](https://t.zsxq.com/11PcX53Se)

![](https://pic.yupi.icu/1/(null)-20231026152057758.(null))

## 更多项目

请见：[项目实战 - 鱼皮原创项目教程系列](https://yuyuanweb.feishu.cn/wiki/SePYwTc9tipQiCktw7Uc7kujnCd)

## 加入学习

点击 [加入编程导航](https://yuyuanweb.feishu.cn/wiki/SDtMwjR1DituVpkz5MLc3fZLnzb) ，鱼皮原创项目均可学习。
