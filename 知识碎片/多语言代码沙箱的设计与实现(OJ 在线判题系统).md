# 多语言代码沙箱的设计与实现(OJ 在线判题系统)

> 作者：[南侠](https://gitee.com/crzzx)，[编程导航](https://www.codefather.cn) 编号 29240

代码沙箱是OJ系统中不可或缺的一个模块。本文将为多语言代码沙箱的设计与实现提供一套独特的方案。

代码沙箱作为OJ系统中不可或缺的一个模块，通常负责执行用户提交的代码并返回执行结果。目前市面上已经有一些相当成熟的代码沙箱API可供调用，能够提供安全且稳定的服务。 然而，自主研发也有其优势，首要的一点是自由度。自主研发不受制于他人，尽管存在一些明显的缺点，比如个人的力量有限。因此，自主研发的代码沙箱在性能或安全方面可能表现一般，但如果能够从中获得一些收获，满足一定的需求，也是一次宝贵的练习机会。 本文将为多语言代码沙箱的设计与实现提供一套独特的方案。在此，笔者特别感谢程序员鱼皮（以下称鱼总）大佬的源码和讲解，他的贡献为我们提供了宝贵的参考。笔者在这个过程中站在巨人的肩膀上，结合个人的理解和开发历程，提出了一套独具特色的设计实现方案。希望这些建议能够为大家带来一些启发。

## 实现效果

项目实现了以下支持和优化：

1. **语言支持：** 提供对Java和Python3的全面支持。
2. **系统兼容性：** 能够在Windows和Linux系统上无缝运行。
3. **环境隔离：** 利用Docker容器进行部署，确保安全且高效。
4. **超时限制：** 通过巧妙的多线程监控和进程控制，实现精准的超时限制。
5. 安全防护：
   - a. **黑名单代码检测：** 针对不同语言提供了丰富的黑名单，助力危险代码的及时检测和报警，支持双系统通用。
   - b. **Java安全管理器：** 对代码的行为权限进行限制，包括但不限于文件读写、危险脚本运行和网络连接，目前仅支持Windows系统。
   - c. **Python代码：** 针对语言特性，目前暂未提供相应的安全管理器。
   - d. **最终防线：** 为了确保危险代码无法通过a-c的筛选，采用Docker容器进行环境隔离，从而有效保护宿主机。
6. 内存限制：
   - a. **Java：** 使用jvm内存限制指令，支持双系统通用。

```java
java -Xmx128m（128为自定义参数，单位MB）
```

- b. **Python3：** 使用`resource`库设置程序最大内存（单位MB）。考虑到Windows不支持`resource`库，建议最终将程序部署在Linux服务器中。

```python
import resource;
max_memory = 128;
resource.setrlimit(resource.RLIMIT_AS, (max_memory * (1024 ** 2), -1));
```

1. 引入枚举类、优化项目目录结构，以及完善响应结果类，以提高调用者的使用体验。
2. 引入Swagger，方便使用者快速上手并使用相应的API。

## 设计方案

基于已实现的代码沙箱，笔者认为还存在4个关键难点需要解决：

1. 如何有效地运行代码并保存输出结果。
2. 如何实现有效的环境隔离。
3. 占用内存的统计
4. 耗费时间的统计

### 代码的运行和结果保存

在实现这一步骤时，我们借鉴了程序员鱼总的思路，并根据不同编程语言的特性进行了巧妙的延伸。对于Java，我们采取了以下步骤：

1. 将代码字符串保存至文件，以便后续通过Java命令行执行。
2. 对代码文件进行编译。
3. 运行代码文件。
4. 获取代码的运行结果。
5. 将代码的结果保存并返回。
6. 删除代码文件，实现即用即删的管理策略。

对于Python，由于其语言特性，无需编译步骤。

### 环境隔离的实现

鱼总提供了两种方案，分别是Java代码的原生实现和Java-Docker结合docker执行java代码的方案。对于前者，优势在于相对简单且响应及时（同步），但存在不够安全的问题。后者则通过Docker的特性实现了更强的安全性，但在响应及时性上存在一些不足。 为了克服两者的缺点，结合它们的优势，**笔者提出以下方案**：

1. **思路：** 将代码的保存、编译、运行等全过程全部交由Docker处理，而非仅限于运行代码这一环节。
2. **实现：** 将Java原生代码项目打包成Docker镜像，并发布其容器，从而实现两者优势的结合。
3. **优点：**

- 综合了Java原生和Docker的优点，既简单又安全。
- 实现了环境隔离，充分利用Docker的特性，确保安全性。
- 代码执行过程更为稳定，提升了使用体验。

1. **缺点：**

- 需要额外的Docker相关配置，可能增加一些部署和维护的工作。
- 在容器受到危险代码损害后，除了告警机制外，仍需人为介入处理，可能导致一定的人力成本增加。

### 占用内存统计

因项目首先依托于Java原生，因此，代码内存占用统计并不准确，仅供参考。 具体实现思路如下：

```java
/**
 * 获取当前已使用的内存量
 * 单位是byte
 *
 * @return
 */
public static long getUsedMemory()
{
    Runtime runtime = Runtime.getRuntime();
    return runtime.totalMemory() - runtime.freeMemory();
}

// 记录初始内存使用情况
long initialMemory = getUsedMemory();
// ...程序执行
// 记录执行后的内存使用情况
long finalMemory = getUsedMemory();
// 计算内存使用量，单位字节，转换成kb需要除以1024
long memoryUsage = finalMemory - initialMemory;
```

### 耗时统计：

使用StopWatch实现，思路如下：

```java
// 设置计时器
StopWatch stopWatch = new StopWatch();
stopWatch.start();
// 等待程序执行
// 结束计时器
stopWatch.stop();
// 设置耗时（单位ms）
executeMessage.setTime(stopWatch.getLastTaskTimeMillis());
```

## 部署上线

这一部分的主要目标是将代码沙箱项目打包并顺利部署到Linux服务器上。以下是详细步骤的阐述：

1. **打包项目成jar包：** 使用构建工具（本项目使用Maven），在项目目录下执行打包命令，生成可执行的JAR文件。这个JAR文件将包含您项目的所有必要依赖和代码。

![](https://pic.yupi.icu/5563/202401212006062.png)

1. **复制jar包和Dockerfile文件至Linux服务器：** 将打包好的JAR文件和编写好的Dockerfile文件复制到目标Linux服务器上。您可以使用文件传输工具，比如xftp、云盘等工具。
2. **构建Docker镜像：** 在Linux服务器上，使用Docker命令根据提供的Dockerfile构建镜像。这个镜像将包含您的应用程序和其运行所需的环境。确保在构建之前已经在服务器上安装了Docker。

目录如下：

 ![](https://pic.yupi.icu/5563/202401212006204.png) 

Dockerfile文件内容如下：

```lua
# 使用 openjdk 镜像的 8-jdk 版本作为基础镜像
FROM openjdk:8-jdk

# 在镜像中运行命令，更新软件包列表并安装 Python3
RUN apt-get update && apt-get install -y python3

# 定义一个构建参数 VERSION（未使用）、环境变量 JAVA_OPTS 和 PARAMS
ARG VERSION=""
ENV JAVA_OPTS=""
ENV PARAMS=""

# 设置容器的时区为 Asia/Shanghai，并将其复制到 /etc/localtime 文件，同时设置时区信息到 /etc/timezone 文件
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone

# 将当前目录下的 sspuoj-code-sandbox-0.0.1-SNAPSHOT.jar 文件复制到容器的根目录，并命名为 app.jar
ADD ./sspuoj-code-sandbox-0.0.1-SNAPSHOT.jar /app.jar

# 定义容器启动时执行的入口点，以执行 Java 命令来运行应用程序
ENTRYPOINT ["sh","-c","java $JAVA_OPTS $PARAMS -jar /app.jar $PARAMS"]
```

![](https://pic.yupi.icu/5563/202401212006351.png)

1. **实例化容器：** 运行构建好的Docker镜像，创建一个运行实例，也就是容器。这个容器将承载您的应用程序并运行在服务器上。在这一步，可以指定端口映射等参数。

（1）创建镜像

```bash
# 构建Docker镜像的命令，使用当前目录下的Dockerfile，生成名为sspuoj:codesandbox的镜像
docker build -t sspuoj:codesandbox .
```

![](https://pic.yupi.icu/5563/202401212006423.png) （2)查看是否创建镜像成功

```lua
# 查看已经构建的Docker镜像列表
docker image list
```

![](https://pic.yupi.icu/5563/202401212006839.png) 

（3)创建容器

```lua
# 运行Docker容器的命令，将容器内部的8090端口映射到主机的8090端口，并在后台以守护进程模式运行，容器名称为sspuoj-codesandbox-01，使用sspuoj:codesandbox镜像
docker run -p 8090:8090 -d --name sspuoj-codesandbox-01 sspuoj:codesandbox
```

![](https://pic.yupi.icu/5563/202401212006920.png) （4)查看是否创建容器成功

```lua
# 查看正在运行的Docker容器列表
docker container list
```

![s0Ra2.png](https://pic.yupi.icu/5563/202401212006928.png)

1. **查看日志：** 查看容器的日志是确保应用程序正常启动的一种方式。通过查看日志，您可以检查是否有任何启动错误或异常情况。

```lua
# 查看容器sspuoj-codesandbox-01的日志，实时跟踪日志输出
docker logs -f sspuoj-codesandbox-01
```

![](https://pic.yupi.icu/5563/202401212006397.png)

1. **进行测试：** 最后，通过接口测试工具，本文使用ApiFox测试服务器上的相应接口，测试部署的项目是否正常运行。

![](https://pic.yupi.icu/5563/202401212006528.png) ![](https://pic.yupi.icu/5563/202401212006052.png) ![](https://pic.yupi.icu/5563/202401212006890.png) ![](https://pic.yupi.icu/5563/202401212006065.png)

1. 删除

如果不想用了，先后执行代码删除即可：

```lua
# 删除容器（-f 强制删除）
docker rm -f sspuoj-codesandbox-01
# 删除镜像（-f 强制删除）
docker rmi -f sspuoj:codesandbox
```

## 代码实现

### 源码地址

https://gitee.com/sspuoj/sspuoj_code_sandbox.git

### 讲解视频

https://www.bilibili.com/video/BV1YW4y1w7DK/?pop_share=1&vd_source=3c68c4954142f1c67c2386ed8e28d42c

### 项目结构

```lua
src
 ├─main
 │  ├─java
 │  │  └─sspu
 │  │      └─zzx
 │  │          └─codesandbox
 │  │              │  CodeSandboxApplication.java : 主启动类
 │  │              │
 │  │              ├─config
 │  │              │      Knife4jConfig.java ： Swagger配置文件
 │  │              │
 │  │              ├─controller
 │  │              │      MainController.java ： API控制器
 │  │              │      TestController.java ： 测试用控制器
 │  │              │
 │  │              ├─model
 │  │              │  │  ExecuteCodeRequest.java ： 请求响应返回类
 │  │              │  │  ExecuteCodeResponse.java ： 请求类
 │  │              │  │  ExecuteMessage.java : 代码执行结果类
 │  │              │  │  JudgeInfo.java ： 代码判别信息类
 │  │              │  │
 │  │              │  └─enums
 │  │              │          JudgeInfoMessageEnum.java ： 判别信息枚举类
 │  │              │          QuestionSubmitStatusEnum.java ： 提交状态枚举类
 │  │              │          SupportLanguageEnum.java ： 支持语言枚举类
 │  │              │
 │  │              ├─old ： 过时代码，不参与流程，可供学习
 │  │              │      JavaDockerCodeSandbox.java
 │  │              │      JavaDockerCodeSandboxOld.java
 │  │              │      JavaNativeCodeSandboxOld.java
 │  │              │
 │  │              ├─security ： 安全管理器配置类
 │  │              │      NowSecurityManager.java ： 使用
 │  │              │      TestSecurityManager.java ： 测试
 │  │              │
 │  │              ├─service
 │  │              │  │  CodeSandbox.java ： 接口类
 │  │              │  │  CommonCodeSandboxTemplate.java ： 通用模板类
 │  │              │  │
 │  │              │  ├─java
 │  │              │  │      JavaCodeSandboxTemplate.java ： Java模板类（extends 通用模板类）
 │  │              │  │      JavaNativeCodeSandbox.java
 │  │              │  │
 │  │              │  └─python3
 │  │              │          Python3CodeSandboxTemplate.java ： 模板类（extends 通用模板类）
 │  │              │          Python3Native3CodeSandbox.java
 │  │              │
 │  │              ├─unsafe : 测试用，不参与流程
 │  │              │      MemoryError.java
 │  │              │      ReadFileError.java
 │  │              │      RunFileError.java
 │  │              │      SleepError.java
 │  │              │      WriteFileError.java
 │  │              │
 │  │              └─utils ： 代码进程工具类
 │  │                      ProcessUtils.java
 │  │
 │  └─resources
 │      │  application.yml ： 系统配置文件
 │      │  Dockerfile ： Docker镜像打包配置文件
 │      │
 │      ├─codeDemo ： 支持的语言代码格式示例文件
 │      │      javaDemo.txt
 │      │      python3Demo.txt
 │      │
 │      ├─security ： 编译的安全管理器文件
 │      │      NowSecurityManager.class
 │      │      NowSecurityManager.java
 │      │
 │      └─static ： 系统启动封面
 │              banner.txt
 │
 └─test
     └─java
```