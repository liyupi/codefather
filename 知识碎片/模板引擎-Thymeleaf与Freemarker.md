# 模板引擎 - Thymeleaf 与 Freemarker

> 作者：[卍不忘☆初心](https://www.codefather.cn/post/1760679073350279169#heading-0)，[编程导航](https://www.codefather.cn) 编号 18875

关于模板引擎Thymeleaf与Freemarker的笔记

## 模板引擎

模板引擎：将数据和页面显示分离。

模板文件 + 数据 --> 模板引擎 --> html

通过正则表达式来识别哪些是固定不变的模板，哪些是变化的数据，用已有的API（如：不同的表达式类型）把什么样的数据用什么格式来渲染进去，根据提供好的规则，模板引擎就可以解析出来。

JSP的局限性

1）springboot内嵌容器时（打成jar包），不支持JSP。 如果要运行JSP需要打成war包，则需要使用外部容器。

2）undertow容器是不支持JSP的。

3）扩展性有限，对于一些默认处理，很难自定义。

4）在容器化技术（如docket）中，对JSP的使用也很繁杂。

因为JSP有这么多的局限性，所以有了模板引擎

较早的模板引擎：velocity、freemarker

国人开发的模板：beetl

## Thymeleaf

自然的模板，动静分离，是一个处理纯文本的模板引擎。

### 引入thymeleaf命名空间

```html
<!--引入thymeleaf的命名空间，使用时才有提示-->
<html lang="en" xmlns:th="http://www.thymeleaf.org">
```

### 表达式

`${}` 变量表达式，引用一个变量

`*{}` 选择变量表达式，当我们通过${}拿到一个对象时，可以通过*{}拿到这个对象的属性值

`#{}` 消息表达式，可以通过配置文件拿到某些数据，还可以用来实现国际化效果

`@{}` 链接表达式

`~{}` 片段表达式，引用相同的代码片段

### 字符串的拼接

```html
<p th:text="${person.name} + ' is ' + ${person.age}"></p>
<!--使用 | 将${}的内容替换成对象，其余的不变-->
<p th:text="|${person.name} is ${person.age}|"></p>
```

### 条件判断

#### if的使用

```html
<p th:if="${msg=='yes'}">这是第一个msg的取值：</p>
<p th:text="${msg}" th:if="${msg=='yes'}"></p>
<p th:if="${msg=='no'}">这是第二个msg的取值：</p>
<p th:text="${msg}" th:if="${msg=='no'}"></p>
```

#### unless的使用

```html
<p th:unless="${msg=='yes'}">这是第一个msg的取值：</p>
<p th:text="${msg}" th:unless="${msg=='yes'}"></p>
<!--当msg的值不等于no时进行展示，所以下面的会展示出来-->
<p th:unless="${msg=='no'}">这是第二个msg的取值：</p>
<p th:text="${msg}" th:unless="${msg=='no'}"></p>
```

#### switch的使用

```html
<div th:switch="${num}">
	<p th:case="1">1</p>
	<p th:case="2">2</p>
	<p th:case="*">*</p>
</div>
```

### for循环

#### th:each

```html
<table>
    <thead>
	<tr>
            <th>名字</th>
            <th>年龄</th>
	</tr>
    </thead>
    <tbody>
	<tr th:each="data:${list}">
            <td th:text="${data.name}">name</td>
            <td th:text="${data.age}">age</td>
	</tr>
    </tbody>
</table>
```

### 状态变量

默认命名是：参数名+Stat（如上的：dataStat），用来**保存迭代状态**

自定义的命名是：`<tr th:each="data,status:${list}">` 此时状态变量名为status

状态变量的属性：

```gradle
index	索引，从0开始
count	计数，从1开始
size		集合的大小
current	当前对象
first / last	布尔类型，是否是第一个/最后一个
even / odd	布尔类型，是否是 偶数 / 奇数 个
<table>
	<thead>
	<tr>
		<th>名字</th>
		<th>年龄</th>
		<th>index</th>
		<th>count</th>
		<th>size</th>
		<th>current</th>
		<th>first</th>
		<th>last</th>
		<th>even</th>
		<th>odd</th>
	</tr>
	</thead>
	<tbody>
	<tr th:each="data:${list}">
		<td th:text="${data.name}">name</td>
		<td th:text="${data.age}">age</td>
		<td th:text="${dataStat.index}">index</td>
		<td th:text="${dataStat.count}">count</td>
		<td th:text="${dataStat.size}">size</td>
		<td th:text="${dataStat.current}">current</td>
		<td th:text="${dataStat.first}">first</td>
		<td th:text="${dataStat.last}">last</td>
		<td th:text="${dataStat.even}">even</td>
		<td th:text="${dataStat.odd}">odd</td>
	</tr>
	</tbody>
</table>
```

### URL的使用

#### 基础使用

```html
<form th:action="@{/login}" method="post">
	username:
	<input type="text" name="username">
	password:
	<input type="password" name="password">
	
	<input type="submit" value="提交">
</form>
```

#### 绝对路径

#### 1、基本用法

```html
<a th:href="@{http://cn.bing.com}">外链到：bing</a>
<!--渲染效果为<a href="http://cn.bing.com">外链到：bing</a>-->
```

#### 2、协议自动识别补全

**使用方法： 开头用 //**

以引用静态资源举例：

```html
<script type="text/javascript" th:src="@{//code.jquery.com/jquery-3.4.1.min.js}"></script>
```

渲染结果： `<script type="text/javascript" src="[//code.jquery.com/jquery-3.4.1.min.js](http://code.jquery.com/jquery-3.4.1.min.js)"></script>`

#### 相对路径

#### 1、上下文相关的URL

##### 1）基本用法

`<form th:action="@{/login}" method="post">` 比如说：部署项目的地址 localhost:8080/demo 渲染结果为：

验证方式：在配置文件中增加`server.servlet.context-path=/demo`



##### 2）引用静态资源的方式

先利用springboot的依赖配置

```xml
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>jquery</artifactId>
    <version>3.4.1</version>
</dependency>
```

接着在某个html文件中引用

```html
<script type="text/javascript" th:src="@{/webjars/jquery/3.4.1/jquery.js}"></script>
```

##### 3）参数的使用

请求中携带参数

a）携带一个参数时，如：/addPerson?id=1 在表达式中使用：@{/addPerson(id=1)} **单个参数的使用，用括号括起来**

b）携带多个参数时，如：/addPerson?id=1&name='lsq' 在表达式中使用：@{/addPerson(id=1,name='lsq')} **用括号将多个参数括起来，参数之间用逗号隔开**

c）当参数是路径的一部分时，如： /addPerson/1?name='lsq' 在表达式中使用：@{/addPerson/{id}(id=1,name='lsq')} **支持路径中包含变量 可以使用参数去替换**

#### 2、服务器相关URL

<a th:href="@{~/a.html}"></a>

通过 **~** 知道指定的是服务器某个地址，就不是和项目相关的，这样不同的项目可以访问同一个服务器下的某个文件。

渲染结果为：`<a href="/a.html">`

**不会增加上下文路径（项目访问路径），可以访问同一个服务器上的不同项目，访问到固定地址。**

**补充：**

![](https://pic.yupi.icu/5563/202402241806638.png)

### 内置对象/内嵌变量

工具类的使用：（使用方式是 **加前缀#**）

dates、calendars、numbers、strings、objects、bools、arrays、lists、sets、Maps

日期dates

日期格式化：#datas.format()

```html
<!--dates的使用-->
<p th:text="${date}"></p>
<p th:text="${#dates.format(date,'yyyy-MM-dd HH:mm:ss')}"></p>

<!--拿到当前的时间-->
<p  th:text="${#dates.createNow()}"></p>
<p th:text="${#dates.createToday()}"></p>
```

strings的使用

```html
<!--strings的使用-->
<p th:text="${#strings.isEmpty(str)}"></p>
<p th:text="${#strings.length(str)}"></p>
<p th:text="${#strings.equals(str,'duing')}"></p>
```

### 表达式语言

OGNL：Object-Graph Navigation Language 对象视图导航语言

可以通过表达式语言，来获取Java的对象，在JavaWeb中使用较多

SpEL：基于Spring的表达式语言，提供给我们一种运行时对象的交互能力 本质都是 在视图层和控制层将数据建立联系的方式

```html
<p th:text="${ 1 * 2 + 3 - 4}"></p>

<p th:text="${list[0].name}"></p>

<p th:text="${T(java.lang.Math).random()}"></p>
```

### 内联表达式

用两个中括号 **[ [ ] ]** 将一个引用的对象括起来，对象本身还是 **${}** 获取，这样就能将展示的信息与其它字符串拼接起来了。（展示文本的时候简化逻辑）

凡是可以用 th:text 或 th:utext 显示的内容都可以用内联表达式来转换。

`th:text` => `[[...]]` 转义了，若含有标签，标签效果不起作用

`th:utext` => `[(...)]` 不转义，按照标签效果输出 如果文本需要展示含`[[]]`的数据，可以禁用内联表达式。

```html
<p> 加油，[[${info}]] </p>
<p> 加油，<span th:text="${info}"></span> </p>

<!--禁用内联表达式-->
<p th:inline="none"> 加油，[[<span th:text="${info}"></span>]] </p>
```

**内联JavaScript**

当给JavaScript中传一些数据的时候，使用内联JavaScript

```html
<script type="text/javascript" th:inline="javascript">
	//var info = [[${info}]];
	<!--内联js，同样支持动静分离,使用 /**/ 将动态数据引起来，在其后跟上静态数据，但这样使用之后原来的注释就不能用了，同时还有一个局限性：在外部js文件里不能使用，在html文件中的js代码生效 -->
	var info = /*[[${info}]]*/ 123;
	console.log(info);
</script>
```

类似js，同样支持css

```html
<style th:inline="css">
</style>
```

### 碎片代码

**th:fragment，th:include，th:replace，th:insert**

有些网页内容，需要在许多网页中使用，可以使用`th:fragment`在某个独立的（网页）标签中设置碎片代码，并为其命名。

在需要引入碎片代码的网页中使用`th:include、th:replace、th:insert`等引入。

**include，replace，insert的区别：**

- include是只引进碎片代码的内容，不把其标签属性引入（即不引入碎片标签），保留原有的标签属性
- replace与include相反，只引入碎片代码的内容，引入碎片标签，不保留原有的标签
- insert是即引入碎片标签，也保留原有标签（当样式冲突时，碎片标签属性起作用，看网页源码可知）

![](https://pic.yupi.icu/5563/202402241806627.png)

## Freemarker

一个用java编写的模板引擎，适合作为web项目中的视图层组件，是生成文本的工具。

ftl文件本质也是html格式的

freemarker区分大小写

ftl组成部分：文本（静态的），插值（动态的），标签，注释 **<#-- -->**

#### 使用步骤

**1）引入freemarker依赖**

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-freemarker</artifactId>
</dependency>
```

**2）增加自定义的配置文件**

```properties
#旧的使用方式
# 文件位置
#spring.mvc.view.prefix=/templates
# 文件后缀
#spring.mvc.view.suffix=.ftl

#新的使用方式
# 文件位置
spring.freemarker.template-loader-path=classpath:/templates
# 文件后缀
spring.freemarker.suffix=.ftl
```

**3）编写controller及ftl文件**

#### 字符串的使用

定义变量：**<#assign** info1 = 'how are you?'> 字符串的拼接：

Hello ${info **+** info1}

字符串的内嵌函数：（调用时使用 **字符串名?** ）



${info1?substring(0,3)}

<#--左闭右开-->

${info1?length}

```html
<p>Hello ${info}</p><br>

<#--定义变量-->
<#assign info1 = 'how are you?'>
<#--字符串的拼接-->
<p>Hello ${info + info1}</p>
<#--字符串的内嵌函数-->
<p>${info1?substring(0,3)}</p><#--左闭右开-->
<p>${info1?length}</p>
```

#### 条件判断

```html
<#assign num = 666>
<#if num == 666>
	<p>666</p>
<#elseif num == 888>
	<p>888</p>
<#else>
	<p>000</p>
</#if>
<#switch num>
	<#case 666>
		<p>666</p>
		<#break>
	<#case 888>
		<p>888</p>
		<#break>
	<#default>
		<p>000</p>
</#switch>
```

#### 列表

```html
<#assign myList = [1,3,5,7,10,9]>
<h5>无序数组：</h5>
<#list myList as item>
	${item}
</#list>
<br>
<h5>有序数组：</h5>
<#list myList?sort as item>
	${item}
</#list>
<br>
	
<#list [1,2,3] as item>
	${item}
</#list>
<br>
	
<#list 1..3 as item>
	${item}
</#list>
<br>
	
<#--元素的别名 缀上 _index  代表下标-->
<#list 1..3 as item>
	${item_index}	<#--获取索引-->
	, ${item}<br>
</#list>
	
<#list 1..3 as item>
	<#--判断是否有下一项-->
	<#if item_has_next>
		${item}
	</#if>
</#list>
```

#### 判断变量是否为空

```html
<#--判断变量是否为空：通过 ! 来判断-->
<#--<#assign str = 'str'>-->
${str!"default"}
```

#### 引入其它文件的值

在一个html中引入另一个html中的一些变量的值，不仅能读取，还能修改

```html
<#import 'other.ftl' as otherFtl>
${otherFtl.name} <br>
<#--不仅可以读取到它的值，还能修改它的值-->
<#assign name = 'welcome ftl is here' in otherFtl>
${otherFtl.name}
```