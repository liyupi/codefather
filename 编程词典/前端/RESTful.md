# RESTful

REST（Representational State Transfer）是一种资源的表现层状态转移的架构风格。HTTP 是最常见的 RESTful 架构的应用，其基本思想是将一些状态转移操作映射到 HTTP 协议定义的操作上。

在 RESTful 架构中，所有资源都被抽象成一个个 URI，并通过 HTTP 协议的动词进行操作。常用的 HTTP 动词有 GET、POST、PUT、DELETE，分别对应着查、增、改、删四个操作。

RESTful 架构风格的特点是易于扩展、分离客户端和服务端、每个资源都有自己唯一的 URI 等。这种风格对于构建 Web API 非常有利。

对于 RESTful 架构的实现，一般还需要满足以下几个规范：
1. 客户端和服务端的通信方式必须是无状态的；
2. 支持缓存；
3. 客户端和服务端之间可以通过标准的 HTTP 响应码和错误信息进行通信；
4. 要能够支持多种数据格式（如 XML、JSON 等）。

RESTful 架构是目前最流行的 Web 应用程序开发框架之一，许多各种语言的服务器框架都支持 RESTful 架构，如 Java 的 SpringMVC、Python 的 Django 等。以及前端中的许多业界知名框架也采用了 RESTful 架构，例如 Angular、React、Vue 等。