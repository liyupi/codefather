# Bug 解决  后端项目无法正常启动，或依赖服务连接失败

> 程序员鱼皮的编程宝典：https://codefather.cn/



明明拷贝的代码，为什么别人行，我启动就报错？



这点我深有体会，我在初学编程的时候差点因为这件事变成了琦玉，变秃了，多遇几次之后也确实变强了，四舍五入，我=琦玉，来过来给我打一拳！

![](https://pic.yupi.icu/5563/202404161541275.jpeg)



言归正传，身为一个老油条，这篇文章我就理一下最最常见的项目启动报错的两种原因！



### 版本问题

比如明明项目的 Java 版本是 8，你非得拿 5 跑？那不是完犊子了吗？

比如报错：`java: -source 1.5` 中不支持 diamond 运算符。



再比如拿高本版来跑，理论上好像没问题，会兼容？但是实际上还是不稳，咱们整个一样的版本是最好的！



不过很多同学拿高版本来跑也是无心之举，idea 默认带了高本版（比如 java 17），或者自己为了实验性安装了高版本，所以项目一跑就报了这个错：`无效的源发行版：17`



![](https://pic.yupi.icu/5563/202404161541007.png)



因此需要修改 idea 配置，我让我的 AI 助理给大家输出一波：



在 IntelliJ IDEA 中修改 Java 编译版本可以通过以下步骤完成：

1）打开项目设置：

- 在 IntelliJ IDEA 中打开你的项目。
- 点击顶部菜单栏中的 "File" -> "Project Structure"（或者使用快捷键 Ctrl + Alt + Shift + S）。

2）选择项目模块：

- 在弹出的窗口中，选择左侧栏中的 "Project"。
- 在右侧的 "Project SDK" 下拉菜单中选择你想要的 Java SDK 版本。

![](https://pic.yupi.icu/5563/202404161541076.png)

3）更改项目语言级别和源代码兼容性：

- 在弹出窗口左侧栏的 "Modules" 选项下，选择你的模块。
- 在右侧窗格中，选择 "Sources" 标签。
- 在 "Language level" 下拉菜单中选择你想要的 Java 版本。
- 确保 "Target bytecode version"（目标字节码版本）与你的目标 Java 版本匹配。



![](https://pic.yupi.icu/5563/202404161541028.png)

![](https://pic.yupi.icu/5563/202404161541118.png)

4）应用和保存更改：

- 点击 "Apply" 按钮应用更改。
- 点击 "OK" 保存并退出项目设置对话框。



通过以上步骤，在 IntelliJ IDEA 中你可以很容易地修改项目的 Java 编译版本。确保选择的 SDK 版本和语言级别与你的项目要求一致，以便正确编译和运行项目代码。



这样操作后，还报错，那么可能是 maven 的问题了，pom 文件里面的版本配置不对。



![](https://pic.yupi.icu/5563/202404161541047.png)



这个版本修改后，**记得要刷新 maven！**

![](https://pic.yupi.icu/5563/202404161541499.png)



对了，说到 maven 可能有些同学发现自己的 idea 右侧 **没有 maven 菜单**，此时你需要右键点击项目里面的 pom.xml 文件选择 add as maven project。



还有同学 maven install 的时候会有报错，比如 `无效的标记：--release`。



**这种可能就是因为 maven 版本和 java 版本不兼容。**升级下 maven 版本，对于 java8 来说，强烈建议使用Maven 3.6.x 版本，因为 Maven 3.6.x 系列版本是专门支持 JDK 8 的。



### 依赖项问题

除了 java 本身或者 maven 的问题之外，同学们可能还会遇到 redis 报错或者 mysql 报错这些项目依赖的组件导致的问题。



1）比如项目启动报 redis 相关的错：

Unable to connct to Redis server: localhost/127.0.0.1:6379



那么可能是 redis 配置有问题， 比如你给 redis 设置了密码，那么配置文件里面就需要配置密码。



2）比如报 mysql 相关的错：

Caused by:org.springframework.jdbc.CannotGetJdbcConnectionException: Failed to obtain JDBC Connection;nested exception is java.sql.SQLException: Access denied for user 'root'@'localhost' (using password：YES)？



确认下配置里面密码是否填写正确，然后账号是否有对应的查询等权限。