# 抱歉，我不用别的测试工具了！

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)

大家好，我是鱼皮。

大多数后端开发程序员的工作都是写接口（服务），比如 HTTP、RPC 等等，供前端或其他系统来调用。写接口的过程中必然会考虑两个问题：

1. 如何对接口进行测试，保证接口质量？
2. 如何搞出接口文档，减少沟通成本？

先说说测试，一般情况下，除了本地对某个方法进行单元测试外，我们还要用 curl、postman 等工具来发送请求进行接口测试，但需要手动编写请求的信息，比较麻烦。

再说说接口文档，说白了，就是要以书面的形式介绍你接口的功能、地址、调用方法、请求参数、响应结构、细节等等，从而明确接口的信息，推动合作。但手动编写接口文档无疑会消耗大量的时间，因此很多时候，大家选择口口相传，开局一张嘴，正确与否全靠脸。

![](https://pic.yupi.icu/5563/202311090914141.png)

那有没有什么方法，可以自动帮助我们生成接口文档，并且不用手动编写请求信息就能测试呢？

当然有！Swagger 就是这样一款知名的接口文档生成工具，相信学 Java 的朋友对它不会陌生。

> 地址：https://swagger.io/

![](https://pic.yupi.icu/5563/202311090914179.png)

它支持多种编程语言，且用法异常简单！以 Java SpringBoot 项目为例，只需要先在项目中引入它的 SDK，Maven 项目参考代码如下：

```
<dependency>
  <groupId>io.springfox</groupId>
  <artifactId>springfox-swagger2</artifactId>
  <version>2.9.2</version>
</dependency>
<dependency>
  <groupId>io.springfox</groupId>
  <artifactId>springfox-swagger-ui</artifactId>
  <version>2.9.2</version>
</dependency>
```

然后编写一个 Java Bean 来定义 Swagger 的配置，包括作者名、文档名称、自动生成的接口所在路径等，参考代码如下：

```
@Configuration
@EnableSwagger2WebMvc
// 生产环境记得关闭哦
@Profile({"dev", "test"})
public class SwaggerConfig {

  @Bean
  public Docket createRestApi() {
    return new Docket(DocumentationType.SWAGGER_2)
      .apiInfo(apiInfo())
      .select()
      .apis(RequestHandlerSelectors.basePackage("包名"))
      .paths(PathSelectors.any())
      .build();
  }

  private ApiInfo apiInfo() {
    return new ApiInfoBuilder()
      .title("Swagger Document")
      .version("0.0.1")
      .build();
  }
}
```

然后，直接启动项目，就能自动生成一份美观的接口文档了。默认地址记得是 "/接口前缀/doc.html"，在浏览器中访问这个地址，就能看到文档页面了：

![](https://pic.yupi.icu/5563/202311090914118.png)

> Swagger 接口文档

默认的皮肤虽然简洁，但不太好看，我们可以使用开源项目 Knife4j 来增强 Swagger 文档的默认功能，直接打开官方文档，跟着快速开始的步骤引入即可，一分钟左右就能完成！

> 地址：https://doc.xiaominfo.com/knife4j/

![](https://pic.yupi.icu/5563/202311090914160.png)

> Knife4j 文档

最终可以得到比 Swagger 功能更强、更方便的接口文档页面：

![](https://pic.yupi.icu/5563/202311090914224.png)

在文档中，你不仅可以看到接口的详细信息，还可以一键发送请求，对接口进行测试！一般情况下，拿来代替独立的接口测试工具完全足够了：

![](https://pic.yupi.icu/5563/202311090914210.png)

是不是非常方便呢？如果对这些 UI 不满意，你可以使用 Swagger 提供的获取接口信息的 API（比如 "xxx/v2/api-docs"），自己改造界面。

如今的 Swagger 功能也是越发强大了，除了用它来生成接口文档外，你甚至可以反过来，先定义好接口的信息，再根据接口去生成后台代码！

比如直接在官方提供的 `Swagger Editor` 里写好接口的 json 配置，然后一键就能生成主流后端语言的服务端和客户端代码了，六的一批！

![](https://pic.yupi.icu/5563/202311090914233.png)

除了后端代码外，一些前端框架还支持读取 Swagger 的配置信息来自动生成代码。

比如 Ant Design Pro，填上 Swagger 的 api 地址，再输入一行命令，就能生成接口代码、测试和 mock 文件等，是不是绝了？！

![](https://pic.yupi.icu/5563/202311090914207.png)

当然，以上的内容更适用于开发同学。如果你是专业的测试人员，相信你会用到一些功能更丰富的自动化测试、压力测试工具，欢迎在评论区留言分享哦～



------


以上就是本期分享，有帮助的话还请给鱼皮一个 **点赞 + 在看** ，谢谢大家！

![](https://pic.yupi.icu/5563/202311090914287.png)