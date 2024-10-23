# IDEA+Docker远程部署SpringBoot项目

> 作者：[Study.](https://blog.csdn.net/m0_66570338)，[编程导航](https://www.codefather.cn) 编号 6872

IDEA+Docker远程部署SpringBoot项目

## 一.引语

本文将学习使用IDEA+Docker远程一键部署SpringBoot项目，对比上传jar包到服务器，再通过java指令运行项目，极大程度的提高了项目部署效率。可谓不用不知道，一用再也停不下来~

为了后续学习方便，需要提前进行如下和教程无关的最基本的准备：

- 在服务器上安装Docker,了解简单DockerFile文件编写,可参考博客：[【微服务】Docker容器化](https://blog.csdn.net/m0_66570338/article/details/128786952)
- 在本地电脑安装 [IntelliJ IDEA](https://www.jetbrains.com/idea/) 开发工具.
- 能正常访问接口的SpringBoot项目，打包出jar包，此处用如下简单Demo进行演示.

![](https://pic.yupi.icu/5563/202404072114189.jpeg)

至此，准备工作已完成~

## 二.Jar包部署vs远程部署

**Jar包部署:**

正常使用Jar包部署可以先在服务器上安装Java开发环境，之后将本地打包出来的jar包上传到服务器上，最后通过`java -jar`指令启动项目即可。使用这种方式进行部署每次需要重新部署项目都要 **先停止项目 -> 重新上传jar包到服务器 -> 启动项目** ，相对来说还是比较麻烦的，而且想实时查看日志也不是很方便。详细流程可参考博客：[【原生部署】SpringBoot+Vue前后端分离项目](https://blog.csdn.net/m0_66570338/article/details/135494356)

**IDEA+Docker远程一键部署：**

使用这种方式进行好一系列配置后，**每次需要重新部署项目仅需点击绿色小三角（一步）即可自动完成项目部署**：

![](https://pic.yupi.icu/5563/202404072114249.jpeg)

同时还可以非常便捷的查看项目实时运行日志：

![](https://pic.yupi.icu/5563/202404072117877.jpeg)

是不是非常方便？接下来学习一下如何进行配置~~~

## 三.配置远程部署

### (1) 进行ssh配置

由于需要连接服务器进行远程部署，因此必须先进行ssh配置`（File->Settings->搜索ssh）`。为了避免不必要的麻烦，推荐在`Authentication type`中选择`Key pair`进行连接，嫌麻烦也可以直接通过`Password`进行连接，等后续出现问题再切换连接方式。

使用`Key pair`进行连接过程比较繁琐，可参考博客：[在IDEA中通过密钥认证的方式使用SSH连接远程Linux服务器](https://blog.csdn.net/cnds123321/article/details/121947896)

![](https://pic.yupi.icu/5563/202404072114213.jpeg)

### (2) 连接Docker守护进程

接下来需要配置连接Docker守护进程`（File->Settings->搜索docker）`来操作Docker。

![](https://pic.yupi.icu/5563/202404072117198.jpeg)

`Docker daemon` 补充说明：

> Docker daemon（或称为 Docker 守护进程）是运行在宿主机上的一个持续运行的服务，负责管理 Docker 容器的创建、运行、停止等操作。它是 Docker 引擎的核心组件之一。
>
> Docker daemon 有以下几个主要的作用：
>
> 1. 容器管理：Docker daemon 负责管理容器的生命周期，包括创建、运行、停止、删除等操作。它接收来自 Docker 客户端的命令，并根据命令进行相应的操作，例如根据指定的镜像创建容器，启动容器的进程等。
> 2. 镜像管理：Docker daemon 负责管理 Docker 镜像，它可以从 Docker Hub 或其他镜像仓库中下载镜像，并根据需要构建、打包、发布和分发镜像。它还负责缓存镜像，以便在创建容器时可以快速获取需要的镜像。
> 3. 网络管理：Docker daemon 负责管理容器的网络。它将为每个容器分配一个唯一的 IP 地址，并为容器提供网络连接，使得容器可以与其他容器或宿主机进行通信。
> 4. 存储管理：Docker daemon 负责管理容器的存储，包括容器的文件系统、数据卷和容器的持久化存储等。它可以根据指定的存储驱动程序将容器的数据保存在宿主机上的文件系统中，并为容器提供数据卷，以便对容器的存储进行管理。
>
> Docker daemon 是 Docker 引擎运行在宿主机上的核心组件，它负责处理容器管理、镜像管理、网络管理和存储管理等任务，提供了一个方便、高效、可靠的容器化平台。

### (3) 编写Dockerfile文件

紧接着需要编写一个用于定义和构建 Docker 镜像的文本文件，针对本教程提供如下文件进行参考，请根据自身项目情况进行调整：

```dockerfile
# 基础镜像
FROM openjdk:17
# 复制主机jar包至镜像内，复制的目录需放置在 Dockerfile 文件同级目录下
ADD target/demo-0.0.1-SNAPSHOT.jar app.jar
# 容器启动执行命令
ENTRYPOINT ["java","-jar", "/app.jar" , "--spring.profiles.active=prod"]
# 对外暴露的端口号
EXPOSE  8080
```

复制主机jar包至镜像内，复制的目录需放置在 Dockerfile 文件同级目录下，例如：

![](https://pic.yupi.icu/5563/202404072115947.jpeg)

至此准备工作已经全部完成，接下来即可正式开始配置远程一键部署~

### (4) 配置远程部署

1）前往创建配置

![](https://pic.yupi.icu/5563/202404072114659.jpeg)

2）创建配置

![](https://pic.yupi.icu/5563/202404072114717.jpeg)

3）根据下述步骤填写之前所进行的一系列配置即可

![](https://pic.yupi.icu/5563/202404072114974.jpeg)

4）至此，所有配置都已完成，最后尝试一下本文开始所述”**点击绿色小三角（一步）即可自动完成项目部署**“

**正在上传文件~~~**

![](https://pic.yupi.icu/5563/202404072114396.jpeg)

**已经跑起来了~~~**

![](https://pic.yupi.icu/5563/202404072114801.jpeg)

**在浏览器请求成功显示了响应结果，控制台也能看到日志输出啦~~~**

![](https://pic.yupi.icu/5563/202404072114249.jpeg)

至此本文教程结束。首次配置或许确实比较繁琐，但后续部署项目是真的方便，感觉动手试一下吧~