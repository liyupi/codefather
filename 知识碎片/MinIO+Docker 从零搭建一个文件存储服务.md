# MinIO+Docker从零搭建一个文件存储服务

> 作者：[Study.](https://blog.csdn.net/m0_66570338)，[编程导航](https://www.codefather.cn) 编号 6872

本文，将带你使用 MinIO + Docker 来从零搭建一个文件存储服务，并在 SpringBoot 项目中上传图片到 MinIO 中。

## 一.为什么要自己搭建？

对于个人来说，当然是**攻击风险**。第三方对象存储服务通常会收取费用，尤其随着数据量的增加，费用也会相应增加，而通过自己搭建文件存储服务器，可以有效控制成本。其实费用还好，个人小项目访问量不大花不了多少钱，最重要的是**被攻击刷流量就GG了**。例如：

**个人小博客被攻击：**

![](https://pic.yupi.icu/5563/202403290850178.png)

**某知名up主被刷爆：**

![](https://pic.yupi.icu/5563/202403290850876.png)

虽然个人小项目一般不会被攻击，但就问你看到-1.5w慌不慌？接下来让我们来学习一下如何使用MinIO搭建一个自己的文件存储服务器吧~

## 二.为什么使用MinIO？

[MinIO](https://www.minio.org.cn/) 是一个**高性能**的轻量级对象存储服务器。它具有分布式，高可用性和水平扩展的特点，它非常适合用于大规模数据存储和分析。其优点包括**低延迟、高吞吐量、易于部署和管理**。

怕很拉跨不敢用？

截止目前，MinIO 在 [Github](https://github.com/minio/minio) 上有 **43.7k** Star。

国内阿里巴巴、腾讯、百度、华为、中国移动、中国联通等企业都有在使用 MinIO，甚至不少商业公司二次开发 MinIO 来提供商业化的云存储产品。

![](https://pic.yupi.icu/5563/202403290850437.png)

## 三.搭建MinIO

## (1) 引言

MinIO 的[官方文档](https://www.minio.org.cn/download.shtml#/docker)上介绍了多种下载方式:

![](https://pic.yupi.icu/5563/202403290850973.png)

本文我们只介绍如何**使用 Docker 基于CentOS 服务器来进行服务的搭建**，如果未安装Docker可以通过[本文（点击跳转）](https://blog.csdn.net/m0_66570338/article/details/128786952)来了解和安装Docker，或者在[官方文档](https://www.minio.org.cn/download.shtml#/docker)挑选自己擅长的方式进行搭建~

![5.png](https://pic.yupi.icu/5563/202403290850336.png)

## (2) 安装

1. **首先我们要创建两个文件目录：一个用来存放 MinIO 的配置文件，一个用来存储我们上传文件数据。**

```sh
mkdir -p /home/minio/config
mkdir -p /home/minio/data
```

- `/home/minio/config` 用于存放 MinIO 的配置文件
- `/home/minio/data` 用于存储上传的文件数据

1. **接下来我们可以通过如下命令拉取最新版镜像并创建 MinIO 容器运行。如果需要下载指定版本可以[点击前往DockerHub仓库](https://hub.docker.com/r/minio/minio/tags)选择下载。**

```sh
docker run -p 9000:9000 -p 9001:9001 \
-d --restart=always \
-e "MINIO_ACCESS_KEY=admin" \
-e "MINIO_SECRET_KEY=password" \
-v /home/minio/data:/data \
-v /home/minio/config:/root/.minio \
minio/minio server \
/data \
--console-address ":9001" 
```

**运行效果：**

![](https://pic.yupi.icu/5563/202403290850774.png)

**命令行解释：**

- `MINIO_ACCESS_KEY` 和 `MINIO_SECRET_KEY` 为UI界面登录账号密码
- `-d ` 将容器以后台（守护进程）模式运行，并与终端分离。
- `--restart=always` 选项指定容器在停止后总是自动重启。
- `/home/minio/data` 挂载的存储上传文件的目录
- `/home/minio/config` 挂载的配置文件
- `minio/minio server` 使用MinIO 镜像并启动
- `/data` 要使用的数据目录
- `--console-address` 指定UI 界面的端口
- `9000:9000` 映射服务器端口
- `9001:9001` 映射UI界面端口

**补充说明：**

> Docker的run指令会首先在本地查找指定的镜像，如果本地没有找到对应的镜像，则会自动去远程镜像仓库拉取该镜像并在本地运行。
>
> 当不带有标签（tag）的镜像名称时，Docker默认会使用latest标签来拉取最新版本的镜像。例如，如果运行`docker run ubuntu`，Docker会首先在本地查找名为ubuntu:latest的镜像是否存在，如果不存在，则会从默认的远程镜像仓库（如Docker Hub）拉取最新版本的ubuntu镜像，并在本地运行。
>
> 如果指定了具体的标签或版本号，例如`docker run ubuntu:18.04`，Docker会尝试在本地查找名为ubuntu:18.04的镜像，如果本地没有找到，则会从远程镜像仓库拉取对应的镜像。
>
> 需要注意的是，如果在远程镜像仓库中找不到指定的镜像，或者无法连接到远程镜像仓库，Docker的run指令将无法成功运行，并会报错提示找不到镜像。

1. **最后在浏览器中访问 [http://服务器IP:9001](http://xn--ip-fr5c86lx7z:9001/)，即可访问到MinIO的控制台。**

![](https://pic.yupi.icu/5563/202403290850962.png)

**可以输入账号 admin，密码 password 进行登录，进入首页。**

![](https://pic.yupi.icu/5563/202403290850612.png)

可以发现它的界面和我们使用的一些第三方对象存储服务非常相似，接下来我们也要进行一系列的配置~

## (3) 配置

1. **创建一个 Bucket 存储桶，用于稍后文件的上传操作。**

![](https://pic.yupi.icu/5563/202403290850055.png)

1. **前往创建用于远程操作的AccessKey 和 SecretKey**.

![](https://pic.yupi.icu/5563/202403290850271.png)

1. **创建并保存好生成Access Key 和 Secret Key**.

![](https://pic.yupi.icu/5563/202403290850131.png)

1. **默认配置下，访问存储桶是需要请求授权的。但是在实际场景下，我们往往希望允许直接访问，此时就需要添加一条 readonly 访问规则。**

![14.png](https://pic.yupi.icu/5563/202403290850616.png)

进入配置存储桶界面

![](https://pic.yupi.icu/5563/202403290850449.png)

进行配置，添加只读规则

![](https://pic.yupi.icu/5563/202403290850597.png)

至此，我们已经基本完成了MinIO的简单配置，当然如果想要更安全，同样是可以像使用第三方对象存储服务一样创建用户组，分配权限等诸如此类的操作。

## (4) 测试

1. **我们上传一张图片并访问来测试一下是否搭建成功。**

![](https://pic.yupi.icu/5563/202403290850971.png)

1. **可以看到成功上传了图片**

![](https://pic.yupi.icu/5563/202403290850780.png)

1. 接下来我们在浏览器访问 `http://服务器IP:9000/{bucket存储桶名字}/{name图片后缀名}` 来进行访问。例如我刚上传的文件 `{bucket}` 是 guanzhi，`{name}` 是 csdn.png，所以最终的访问路径是 `http://服务器IP:9000/guanzhi/csdn.png`。

![](https://pic.yupi.icu/5563/202403290850037.png)

测试成功，能够正常使用，接下来我们来学习一下如何在Java项目中使用吧~

## 四.在项目中使用

## (1) 引言

[官方文档](https://min.io/docs/minio/linux/developers/java/minio-java.html)上有介绍多种语言的SDK使用指南，本篇我们只**学习如何在Java的Maven项目中进行使用**，其他语言的同学可以跟着[官方文档](https://min.io/docs/minio/linux/developers/java/minio-java.html)尝试一下~

![](https://pic.yupi.icu/5563/202403290850700.png)

## (2) 初步尝试

1. **首先在我们创建的Maven项目中引入如下依赖**

```xml
 <!-- MinIO 客户端 -->
<dependency>
    <groupId>io.minio</groupId>
    <artifactId>minio</artifactId>
    <version>8.5.9</version>
</dependency>
```

1. **接下来我们尝试一下官方给出的demo（已经添加详细注释，可以查看下述示例代码）**

```java
@SpringBootTest
class DemoApplicationTests {

    @Test
    void demo() {
        try {
            // 1.创建MinIO客户端，与其建立连接，用于我们上传文件操作
            // Create a minioClient with the MinIO server playground, its access key and secret key.
            MinioClient minioClient = MinioClient.builder()
                    .endpoint("http://服务器ip:9000") // 地址为服务器ip+端口号
                    .credentials("1AYD2DY8qPz5vp0WmQtJ",
                            "BQeSptD5wO9vPIwtthNg5BbFswPx7WhsPh1Slp0M") // 我们配置并保存的 AccessKey 和 SecretKey
                    .build();

            // 2.创建存储桶，这一步我们可以直接在界面手动创建一次即可，因此可以省略
            // Make 'asiatrip' bucket if not exist.
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket("guanzhi").build());
            if (!found) {
                // Make a new bucket called 'asiatrip'.
                minioClient.makeBucket(MakeBucketArgs.builder().bucket("guanzhi").build());
            } else {
                System.out.println("Bucket 'guanzhi' already exists.");
            }

            // 3. 上传文件
            // Upload '/home/user/Photos/asiaphotos.zip' as object name 'asiaphotos-2015.zip' to bucket 'asiatrip'.
            minioClient.uploadObject(
                    UploadObjectArgs.builder()
                            .bucket("guanzhi") // 上传到哪个存储桶？
                            .object("pom.xml") // 上传的文件命名为什么？
                            .filename("C:\\code\\demo\\pom.xml") // 上传文件的路径？
                            .build());
            System.out.println(
                    "'C:\\code\\demo\\pom.xml' is successfully uploaded as "
                            + "object 'pom.xml\"' to bucket 'guanzhi'.");
        } catch (MinioException e) {
            System.out.println("Error occurred: " + e);
            System.out.println("HTTP trace: " + e.httpTrace());
        } catch (IOException | NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException(e);
        }
    }
}
```

1. **可以发现运行成功。**

![](https://pic.yupi.icu/5563/202403290850816.png)

**查看控制台，可以看成功上传了文件。**

![](https://pic.yupi.icu/5563/202403290850867.png)

## (3) 在SpringBoot中使用

我们来简单写一个文件上传功能。

1. **项目中除了上述依赖，我们还需要引入如下依赖**

```xml
        <!-- 实现对 Spring MVC 的自动化配置 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        </dependency>
		<!-- lombok插件-->
         <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
```

1. **新建 MinIO 配置类，创建 MinioClient Bean**

```java
@Configuration
@ConfigurationProperties(prefix = "file.minio")
@Data
public class MinioConfiguration {
    
    private String accessKey;

    private String secretKey;

    private String endpoint;

    private String bucket;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }
}
```

1. **在application.yml中编写配置**

```yml
# 对象存储服务配置
file:
  # MinIO自搭建对象存储服务
  minio:
    endpoint: http://服务器ip:9000 #存储服务域名
    accessKey: 1AYD2DY8qPz5vp0WmQtJ 
    secretKey: BQeSptD5wO9vPIwtthNg5BbFswPx7WhsPh1Slp0M
    bucket: guanzhi   #存储桶名称
```

1. **编写controller**

```java
@RestController
@RequestMapping("/file")
public class FileController {

    @Resource
    private MinioClient minioClient;

    @Resource
    private MinioConfiguration minioConfiguration;

    /**
     * 上传文件
     */
    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file) throws Exception {
        // 上传
        String path = UUID.randomUUID() + file.getOriginalFilename(); // 文件名，使用 UUID 随机
        minioClient.putObject(PutObjectArgs.builder()
                .bucket(minioConfiguration.getBucket()) // 存储桶
                .object(path) // 文件名
                .stream(file.getInputStream(), file.getSize(), -1) // 文件内容
                .contentType(file.getContentType()) // 文件类型
                .build());
        // 拼接路径
        return String.format("%s/%s/%s", minioConfiguration.getEndpoint(), minioConfiguration.getBucket(), path);
    }
}
```

1. **启动SpringBoot项目，测试接口,可以看到后端正确响应了文件Url.**

![](https://pic.yupi.icu/5563/202403290850059.png)

1. **可以看到控制台存储桶中也有文件**

![](https://pic.yupi.icu/5563/202403290850197.png)

1. 在浏览器中我们也成功的通过返回的url访问到了图片

![](https://pic.yupi.icu/5563/202403290850037.png)

至此，我们已经完成了服务器的搭建，赶紧用起来吧~