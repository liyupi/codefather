# JSP（JavaServer Pages）

JSP（JavaServer Pages）是一种用于创建动态 Web 页面的服务器端技术，它的设计目标是简化程序员的 Web 应用程序的创建过程。当我们访问一个使用 JSP 技术的网页时，服务器首先解析 JSP 页面，并在服务端生成相应的数据，最终将生成的结果发送到客户端浏览器，完成页面展示的过程。

## JSP 与 Servlet

JSP 和 Servlet 都是服务器端的 Java 技术，它们的本质是相同的，区别在于它们的应用场景不同。Servlet 是专门用于处理请求和响应的，支持各种数据格式、安全和其他协议，而 JSP 则是用于创建动态 Web 页面的工具，使我们能够在 Web 服务器上使用 Java 代码来生成动态内容。

## JSP 基本构成

JSP 页面通常由以下几部分组成：

1. HTML 标记：用于组织页面布局和样式
2. JSP 指令：用于告诉 JSP 引擎生成 Servlet 代码的特殊指令
3. Java 程序片断：用于在 JSP 页面中编写 Java 代码
4. 表达式：用于在 HTML 中输出 Java 变量或表达式的结果
5. 标签库：用于简化 JSP 页面中重复的代码

## JSP 生命周期

当客户端请求一个 JSP 页面时，JSP 引擎会将 JSP 页面转换为 Servlet，然后编译、加载和执行。JSP 生命周期包括以下几个阶段：

1. 初始化阶段（Translation）：JSP 引擎将 JSP 页面转换为 Servlet，并对其中的 JSP 指令进行解析和处理。
2. 编译阶段（Compilation）：JSP 引擎将生成的 Servlet 代码编译为字节码文件（.class 文件），该文件会被存储在文件系统的工作目录中。
3. 加载阶段（Loading）：类加载器将字节码文件加载到内存中。
4. 实例化阶段（Instantiation）：Servlet 容器实例化 Servlet 对象，并调用其 init() 方法。
5. 响应请求阶段（Request processing）：Servlet 容器收到客户端请求后，调用 Servlet 对象中的 service() 方法，该方法会处理并响应请求。
6. 销毁阶段（Destroying）：Servlet 容器在关闭 Web 应用程序或重载 Servlet 时，调用 Servlet 对象中的 destroy() 方法。

## 总结

JSP 是 Java Web 开发中不可或缺的技术之一，它能够简化后台 Java 程序员的工作，使开发人员能够更加快速高效地创建动态 Web 页面。但是，随着前端技术的发展，越来越多的 Web 应用程序开始采用分离式架构，使用前端框架来管理视图层，而不再依赖于服务器端的视图渲染技术。