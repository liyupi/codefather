# 使用 FreeMarker 模板引擎生成代码

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)


大家好，我是鱼皮。

最近不是打算带大家做一个代码生成项目嘛，项目的第一阶段就是先做一个本地的代码生成器。代码生成器的核心功能就是根据用户输入的选项参数来生成不同的代码文件。



## 代码生成器的核心原理

那么如何实现这个功能呢？

最经典的方法就是：提前编写 **模板文件** ，并将用户输入的 **参数** 替换到模板文件中，从而生成完整代码。

举个例子，用户输入参数：

```java
作者 = 鱼皮
```



模板文件代码：

```java
-----------
我是 ${作者}
-----------
```



将参数注入到模板文件中，得到生成的完整代码：

```java
-----------
我是 鱼皮
-----------
```



如果想要使用这套模板生成其他的代码，只需要改变参数的值即可，而不需要改变模板文件。

听起来好像很简单，那么问题来了，如何编写模板文件呢？程序怎么知道应该把哪些变量替换为用户实际输入的参数呢？又该如何执行替换操作呢？

难道需要自己定义一套模板语法和规则，比如指定两个尖括号 `{{ 参数 }}` 中的内容为需要替换的参数，然后通过正则表达式或者字符串匹配扫描文件来进行替换么？

显然这太麻烦了！而且如果我需要根据用户的输入来生成不同次数的重复代码（也就是循环），又该如何实现呢？

所以建议大家直接使用已有的 **模板引擎** 技术，轻松实现模板编写和动态内容生成。



## 什么是模板引擎？为什么需要它？

模板引擎是一种用于生成动态内容的类库（或框架），通过将预定义的模板与特定数据合并，来生成最终的输出。

使用模板引擎有很多的优点，首先就是提供现成的模板文件语法和解析能力。开发者只要按照特定要求去编写模板文件，比如使用 `${参数}` 语法，模板引擎就能自动将参数注入到模板中，得到完整文件，不用再自己编写解析逻辑了。

其次，模板引擎可以将数据和模板分离，让不同的开发人员独立工作。比如后端专心开发业务逻辑提供数据，前端专心写模板等，让系统更易于维护。

此外，模板引擎可能还具有一些安全特性，比如防止跨站脚本攻击等。所以强烈大家掌握至少一种模板引擎的用法。

有很多现成的模板引擎技术，比如 Java 的 Thymeleaf、FreeMarker、Velocity，前端的 Mustache 等。

本项目中，我会以知名的、稳定的经典模板引擎 FreeMarker 为例，带大家掌握模板引擎的使用方法。



## FreeMarker 模板引擎入门

FreeMarker 是 Apache 的开源模板引擎，优点是入门简单、灵活易扩展。它不用和 Spring 开发框架、Servlet 环境、第三方依赖绑定，任何 Java 项目都可以使用。



我个人推荐的 FreeMarker 学习方式是直接阅读官方文档，虽然是英文的，但每一节基本都有代码示例，还是比较好理解的。

FreeMarker 官方文档：https://freemarker.apache.org/docs/index.html



![img](https://pic.yupi.icu/1/1699268459163-234f13aa-3a9a-4e45-8e26-52b23b2aa7a4.png)



看不懂英文也没关系，鱼皮下面就带大家学习 FreeMarker，只讲常用的特性，主打一个快速入门！



### 模板引擎的作用

上面已经讲过了模板引擎的作用，这里就再用 FreeMarker 官网的一张图，强化下大家的理解。

如下图，FreeMarker 模板引擎的作用就是接受模板和 Java 对象，对它们进行处理，输出完整的内容。



![img](https://pic.yupi.icu/1/1697633515576-f06ebdc6-7eac-46ef-a171-b5d646040e24.png)



下面我们先依次来学习 FreeMarker 的核心概念（模板和数据模型），然后通过一个 Demo 快速入门。



### 模板

FreeMarker 拥有自己的模板编写规则，一般用 FTL 表示 FreeMarker 模板语言。比如 `myweb.html.ftl` 就是一个 FreeMarker 的模板文件。



模板文件由 4 个核心部分组成：

1）文本：固定的内容，会按原样输出。

2）插值：用 `${...}` 语法来占位，尖括号中的内容在经过计算和替换后，才会输出。

3）FTL 指令：有点像 HTML 的标签语法，通过 `<#xxx ... >` 来实现各种特殊功能。比如 `<#list elements as element>` 实现循环输出。

4）注释：和 HTML 注释类似，使用 `<#-- ... -->` 语法，注释中的内容不会输出。



让我们以《鱼皮官网》为例，举一个 FreeMarker 模板文件的例子：

学过前端开发框架的同学应该会觉得很眼熟~



```html
<!DOCTYPE html>
<html>
  <head>
    <title>鱼皮官网</title>
  </head>
  <body>
    <h1>欢迎来到鱼皮官网</h1>
    <ul>
      <#-- 循环渲染导航条 -->
      <#list menuItems as item>
        <li><a href="${item.url}">${item.label}</a></li>
      </#list>
    </ul>
    <#-- 底部版权信息（注释部分，不会被输出）-->
      <footer>
        ${currentYear} 鱼皮官网. All rights reserved.
      </footer>
  </body>
</html>
```



### 数据模型

我们把为模板准备的所有数据整体统称为 **数据模型** 。

在 FreeMarker 中，数据模型一般是树形结构，可以是复杂的 Java 对象、也可以是 HashMap 等更通用的结构。

比如为上述《鱼皮官网》模板准备的数据模型，结构可能是这样的：

```json
{
  "currentYear": 2023,
  "menuItems": [
    {
      "url": "https://codefather.cn",
      "label": "编程导航",
    },
    {
      "url": "https://laoyujianli.com",
      "label": "老鱼简历",
    }
  ]
}
```



### Demo 实战

在了解模板和数据模型后，让我们通过 FreeMarker 对二者进行组合处理。

#### 1、引入依赖

首先创建一个 Maven 项目，在 `pom.xml` 中引入 FreeMarker：

```xml
<dependency>
    <groupId>org.freemarker</groupId>
    <artifactId>freemarker</artifactId>
    <version>2.3.32</version>
</dependency>
```



如果是 Spring Boot 项目的话，可以直接引入 starter 依赖：

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-freemarker</artifactId>
</dependency>
```



#### 2、创建配置对象

新建一个类，在 Main 方法中创建一个 FreeMarker 的全局配置对象，可以统一指定模板文件所在的路径、模板文件的字符集等。

示例代码如下：

```java
// new 出 Configuration 对象，参数为 FreeMarker 版本号
Configuration configuration = new Configuration(Configuration.VERSION_2_3_32);

// 指定模板文件所在的路径
configuration.setDirectoryForTemplateLoading(new File("src/main/resources/templates"));

// 设置模板文件使用的字符集
configuration.setDefaultEncoding("utf-8");
```



#### 3、准备模版并加载

我们将上述《鱼皮官网》的模板代码保存为 `myweb.html.ftl` 文件，存放在上面指定的目录下。

![img](https://pic.yupi.icu/1/1699277942881-2d0897c2-114d-4722-8b19-cf9bc6d21fcc.png)



准备好模板文件后，通过创建 Template 对象来加载该模板。示例代码如下：

```java
// 创建模板对象，加载指定模板
Template template = configuration.getTemplate("myweb.html.ftl");
```



#### 4、创建数据模型

如果想保证数据的质量和规范性，可以使用对象来保存 “喂” 给模板的数据；反之，如果想更灵活地构造数据模型，推荐使用 HashMap 结构。

比如我们想构造《鱼皮官网》的数据模型，需要制定当前年份和导航菜单项，示例代码如下：

```java
Map<String, Object> dataModel = new HashMap<>();
dataModel.put("currentYear", 2023);
List<Map<String, Object>> menuItems = new ArrayList<>();
Map<String, Object> menuItem1 = new HashMap<>();
menuItem1.put("url", "https://codefather.cn");
menuItem1.put("label", "编程导航");
Map<String, Object> menuItem2 = new HashMap<>();
menuItem2.put("url", "https://laoyujianli.com");
menuItem2.put("label", "老鱼简历");
menuItems.add(menuItem1);
menuItems.add(menuItem2);
dataModel.put("menuItems", menuItems);
```



#### 5、指定生成的文件

可以直接使用 FileWriter 对象，指定生成的文件路径和名称：

```java
Writer out = new FileWriter("myweb.html");
```



#### 6、生成文件

一切准备就绪，最后只需要调用 template 对象的 process 方法，就可以处理并生成文件了。

示例代码如下：

```java
template.process(dataModel, out);

// 生成文件后别忘了关闭哦
out.close();
```



#### 7、完整代码

组合上面的所有代码并执行，发现在项目的根路径下生成了网页文件，至此 Demo 结束，很简单吧~

![img](https://pic.yupi.icu/1/1699278834613-ef699fb6-c256-4649-8f59-534fcbfeccbf.png)



完整代码：

```java
public static void main(String[] args) throws IOException, TemplateException {
    // new 出 Configuration 对象，参数为 FreeMarker 版本号
    Configuration configuration = new Configuration(Configuration.VERSION_2_3_32);

    // 指定模板文件所在的路径
    configuration.setDirectoryForTemplateLoading(new File("src/main/resources/templates"));

    // 设置模板文件使用的字符集
    configuration.setDefaultEncoding("utf-8");

    // 创建模板对象，加载指定模板
    Template template = configuration.getTemplate("myweb.html.ftl");

	// 创建数据模型
    Map<String, Object> dataModel = new HashMap<>();
    dataModel.put("currentYear", 2023);
    List<Map<String, Object>> menuItems = new ArrayList<>();
    Map<String, Object> menuItem1 = new HashMap<>();
    menuItem1.put("url", "https://codefather.cn");
    menuItem1.put("label", "编程导航");
    Map<String, Object> menuItem2 = new HashMap<>();
    menuItem2.put("url", "https://laoyujianli.com");
    menuItem2.put("label", "老鱼简历");
    menuItems.add(menuItem1);
    menuItems.add(menuItem2);
    dataModel.put("menuItems", menuItems);
    
    // 生成
    Writer out = new FileWriter("myweb.html");
    template.process(dataModel, out);

	// 生成文件后别忘了关闭哦
    out.close();
}
```



### 常用语法

学会了 FreeMarker 的基本开发流程后，我们来学习一些 FreeMarker 中的实用特性。

注意，FreeMarker 的语法和特性非常多，本文仅带大家学习常用的、易用的语法。无需记忆，日后需要用到 FreeMarker 时，再去对照官方文档查漏补缺即可。



#### 1、插值

在上面的 Demo 中，已经给大家演示了差值的基本语法（ `${xxx}` ）。但插值还有很多花样可以玩，比如支持传递表达式：

```java
表达式：${100 + money}
```



不过个人不建议在模板文件中写表达式，为什么不在创建数据模型时就计算好要展示的值呢？



#### 2、分支和判空

和程序开发一样，FreeMarker 模板也支持分支表达式（if ... else），示例代码如下：

```java
<#if user == "鱼皮">
  我是鱼皮
<#else>
  我是猪皮
</#if>
```



分支语句的一个常用场景就是判空，比如要判断 user 参数是否存在，可以用下面的语法：

```java
<#if user??>
  存在用户
<#else>
  用户不存在
</#if>
```



#### 3、默认值

FreeMarker 对变量的空值校验是很严格的，如果模板中某个对象为空，FreeMarker 将会报错而导致模板生成中断。

为了防止这个问题，建议给可能为空的参数都设置默认值。使用 `表达式!默认值` 的语法，示例代码如下：

```java
${user!"用户为空"}
```



上述代码中，如果 user 对象为空，则会输出 “用户为空” 字符串。



#### 4、循环

在上述 Demo 实战部分，已经给大家演示了循环的用法。即 `<#list items as item>` 表达式，可以遍历某个序列类型的参数并重复输出多条内容。

示例代码如下：

```java
<#list user as users>
  ${user}
</#list>
```



其中，users 是整个列表，而 user 是遍历列表每个元素时临时存储的变量，跟 for 循环一样，会依次输出每个 user 的值。



#### 5、宏定义

学过 C 语言和 C++ 的同学应该对 “宏” 这个词并不陌生。可以把 “宏” 理解为一个预定义的模板片段。支持给宏传入变量，来复用模板片段。

其实类似于前端开发中组件复用的思想。

在 FreeMarker 中，使用 `macro` 指令来定义宏。

让我们来定义一个宏，用于输出特定格式的用户昵称，比如：

```java
<#macro card userName>     
---------    
${userName}
---------
</#macro>
```



其中，card 是宏的名称，userName 是宏接受的参数。

可以用 `@` 语法来使用宏，示例代码如下：

```java
<@card userName="鱼皮"/>
<@card userName="二黑"/>
```



实际生成的输出结果为：

```java
---------    
鱼皮
---------
---------    
二黑
---------
```



宏标签中支持嵌套内容，不过还是有些复杂的（再讲下去就成前端课了），大家需要用到时查看官方文档就好。

自定义指令：http://freemarker.foofun.cn/dgui_misc_userdefdir.html



#### 6、内建函数

内建函数是 FreeMarker 为了提高开发者处理参数效率而提供的的语法糖，可以通过 `?` 来调用内建函数。

比如将字符串转为大写：

```java
${userName?upper_case}
```



比如输出序列的长度：

```java
${myList?size}
```



把内建函数想象成调用 Java 对象的方法，就很好理解了。

内建函数是 FreeMarker 非常强大的一个能力，比如想在循环语法中依次输出元素的下标，就可以使用循环表达式自带的 `index` 内建函数：

```java
<#list user as users>
  ${user?index}
</#list>
```



内建函数种类丰富、数量极多，因此不建议大家记忆，需要用到的时候去查阅官方文档即可。

内建函数大全参考：http://freemarker.foofun.cn/ref_builtins.html



#### 7、其他

还有更多特性，比如命名空间，其实就相当于 Java 中的包，用于隔离代码、宏、变量等。

不过没必要细讲，因为掌握上述常用语法后，基本就能够开发大多数模板文件了。更多内容自主查阅官方文档学习即可。



## 实践

编程导航的定制化代码生成项目会演示如何使用 FreeMarker 模板引擎来生成代码。

👉🏻 编程导航原创项目教程系列：https://yuyuanweb.feishu.cn/wiki/SePYwTc9tipQiCktw7Uc7kujnCd