# 时代变了，Spring 官方抛弃了 Java 8！

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)

先容许我吐槽一句：Spring 官方，窝草尼玛！

原谅我很愤怒！最近编程导航和群友们反复问一个问题：为啥用 IDEA 创建 Spring Boot 项目时，不能选择 Java 8 了？

我本来以为是 IDEA 版本更新导致的 Bug，开始还没在意。

直到我今天自己初始化项目时才发现：卧槽，Java 8 真没了？！ 

具体一点，应该是使用 IDEA 内置的 Spring Initializr 创建 Spring Boot 新项目时，没有 Java 8 的选项了，只剩下了 >= 17 的版本：

![](https://pic.yupi.icu/1/image-20231128190051120.png)

去网上搜了一圈，原来这是因为 Spring Boot 官方不再支持 Spring Boot 的 2.x 版本了，之后全力维护 3.x；而 Spring Boot 3.x 对 JDK 版本的最低要求是 17！

![](https://pic.yupi.icu/1/image-20231128190129621.png)

所以 Spring 官方的项目初始化工具自然不再支持 Java 8 了，用网页版也是一样的：

![](https://pic.yupi.icu/1/image-20231128190940856.png)

鱼皮，你不是喜欢用 Java 8 么？不是说学 Java 时除了 Java 8 别用其他的版本么？

这下好了，官方逼着你升级，不给你稳定的机会！

![](https://pic.yupi.icu/1/image-20231128191050766.png)

不过想让我屈服还真没那么容易（毕竟以前所有的项目几乎都是 Java 8，撑死用个 Java 11），我也找到了应对之策。

那就是不要用官方提供的 Spring Initializr 来初始化项目了，我们可以使用阿里云提供的脚手架镜像（https://start.aliyun.com/），一样愉快地使用 Java 8~

在 IDEA 里更改 Server URL 即可：

![](https://pic.yupi.icu/1/image-20231128190138991.png)



---



对于这件事，你怎么看？你还会继续使用 Java 8 和 Spring Boot 2.x 么？还是去拥抱新时代的技术呢？

👇🏻 点击下方阅读原文，获取鱼皮往期编程干货。