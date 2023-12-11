# 1秒将本地SpringBoot项目jar包部署到Linux环境

> 作者：[are you ok?](https://blog.csdn.net/weixin_43811294?type=blog)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 589

在IDEA编辑器中`一键`将本地已经打包好的`SpringBoot`项目部署到`linux`环境，实现`秒级`部署

## 目标

> 在IDEA编辑器中`一键`将本地已经打包好的`SpringBoot`项目部署到`linux`环境，实现`秒级`部署 前置知识：需掌握Maven的打包

## 迭代步骤

> 1. 在windows环境使用命令启动SpringBoot项目
> 2. 在Linux环境使用命令启动项目
> 3. 在Linux环境使用脚本启动项目
> 4. 优化脚本，每次启动时先关闭旧项目
> 5. 分离依赖，每次上传Linux环境只上传几百k的代码包
> 6. 搭配IDEA插件，实现在IDEA中一键部署启动

## 一、前提：有一个Windows环境可以启动的SpringBoot项目jar包

### 1、使用Maven的package命令打出一个携带依赖的jar包

例如：

![](https://pic.yupi.icu/5563/202312051401307.png)

### 2、Window启动jar包

```bash
java -jar SpringBootTest-0.0.1-SNAPSHOT.jar
```

![](https://pic.yupi.icu/5563/202312051401258.png)

> 启动完毕，说明jar包是可以正常启动的。

## 二、linux环境启动jar包

### 1、先将jar包扔到linux环境

![](https://pic.yupi.icu/5563/202312051401285.png)

### 2、测试是否可以启动（需要有Java环境）

```bash
java -jar SpringBootTest-0.0.1-SNAPSHOT.jar 
```

![](https://pic.yupi.icu/5563/202312051401341.png)

> 说明在Linux环境也是可以正常启动的
>
> 但是以上的启动方式有个问题，窗口一关项目就自动关闭了

### 3、优化启动脚本，改为后台启动，并将日志输出到`springboot.log`

```bash
nohup java -jar SpringBootTest-0.0.1-SNAPSHOT.jar > springboot.log 2>&1 &
# 解释
# 'nohup': 用于在后台运行命令，并将其与当前终端会话脱离，即使关闭终端，命令也将继续在后台运行。
# '> springboot.log'：此部分使用重定向操作符 > 将标准输出重定向到 springboot.log 文件中。程序的标准输出将被写入到 springboot.log 文件中，而不会在终端上显示。
# '2>&1'：此部分使用重定向操作符 2>&1 将标准错误（stderr）重定向到标准输出（stdout），即将标准错误与标准输出一起写入到 springboot.log 文件中。
# '&'：最后一个 & 操作符将命令置于后台运行，使得程序在后台持续运行，而不会阻塞当前终端会话。
```

![](https://pic.yupi.icu/5563/202312051401286.png)

> 启动成功，进程号为9777
>
> 以上的脚本也存在问题，第二次启动的时候，会因为已经启动了一个服务，端口占用启动不了

![](https://pic.yupi.icu/5563/202312051401388.png)

### 4、完善脚本，启动时，如果存在已经启动的服务，先关闭，再启动

创建脚本

```bash
vim start.sh
```

脚本内容

```bash
# 关闭程序
# fileName为jar包的名称
fileName=SpringBootTest-0.0.1-SNAPSHOT.jar
pid=$(ps -ef | grep $fileName| grep -v "grep" | awk '{print $2}')
kill -9 $pid

# 启动项目
nohup java -jar $fileName > springboot.log 2>&1 &
```

之后，启动项目就可以

```bash
sh start.sh
```

> 至此，SpringBoot项目在Linux的启动就说明完毕。

但是，以上的部署方式还存在一些问题，在只有web依赖的时候，jar的大小就已经达到17M，

![](https://pic.yupi.icu/5563/202312051401070.png)

而在实际开发中，jar包的大小甚至会到达一百多兆。例如这样：

![](https://pic.yupi.icu/5563/202312051401092.png)

为什么明明没有多少代码，包的大小却这么大呢？

解压SpringBootTest-0.0.1-SNAPSHOT.jar包查看内容

![](https://pic.yupi.icu/5563/202312051401196.png)

可以看出，lib文件夹占用了16.7M，而lib文件夹里面是什么东西呢？

![](https://pic.yupi.icu/5563/202312051401265.png)

可以看到，就是各种的依赖。

所以，就引发了新的优化方向，能不能将依赖包直接放在服务器上，每次只更新自己的代码？

答案是：可以！在实际开发中，依赖包一般来说是不会动的，于是开始第三步。

## 三、分离依赖部署

### 1.上传依赖jar包Linux服务器

（1）创建lib文件夹

```bash
mkdir lib
```

![](https://pic.yupi.icu/5563/202312051401145.png)

（2）将jar包中的`/BOOT-INF/lib`目录底下的jar包全部上传到Linux服务器的lib文件夹

![](https://pic.yupi.icu/5563/202312051401338.png)

### 2.改造项目的pom.xml文件

增加配置：

```xml
    <build>
        <plugins>
            <!-- 解决jar中没有主清单属性问题 -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>com.example.springboottest.SpringBootTestApplication</mainClass>
                    <!-- jar包不携带依赖配置开始-->
                    <layout>ZIP</layout>
                    <includes>
                        <include>
                            <groupId>nothing</groupId>
                            <artifactId>nothing</artifactId>
                        </include>
                    </includes>
                    <!-- jar包不携带依赖部署配置结束-->
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

![](https://pic.yupi.icu/5563/202312051401738.png)

### 3.重新package

![](https://pic.yupi.icu/5563/202312051401927.png)

新生成的jar包仅仅只有==156kb==！

### 4.上传到服务器

![](https://pic.yupi.icu/5563/202312051401884.png)

这时候，如果使用原本的脚本启动就会报错：

![](https://pic.yupi.icu/5563/202312051401018.png)

### 5.使用-Dloader.path指定外部依赖包

（1）增加启动文件`start2.sh`

```bash
cp start.sh start2.sh
```

（2）在java -jar后追加`-Dloader.path=./lib`

```bash
# 关闭程序
fileName=SpringBootTest-0.0.1-SNAPSHOT.jar
pid=$(ps -ef | grep $fileName| grep -v "grep" | awk '{print $2}')
kill -9 $pid

# 启动项目
nohup java -jar -Dloader.path=./lib  $fileName > springboot.log 2>&1 &
```

使用外部依赖启动成功

![](https://pic.yupi.icu/5563/202312051401241.png)

> 到此，使用外部依赖启动就完成了，只要加上`-Dloader.path=./lib`就可以了

### 6.合并`start.sh`和`start2.sh`脚本

> 第五步还存在的一个问题，虽然这个方法很好用，但是又增加了一个脚本。公司内部，总是有人想要打全量包，使用自带的依赖，有的人想要打不携带依赖的包，可以快速部署启动，这时候，就需要区分，到底是要用`start.sh`脚本还是`start2.sh`脚本，于是，将`start.sh`和`start2.sh`脚本进行合并，大于10M的时候，就使用内部依赖，小于10M的时候就使用外部依赖

合并后的start.sh脚本：

```bash
# 关闭程序
fileName=SpringBootTest-0.0.1-SNAPSHOT.jar
pid=$(ps -ef | grep $fileName| grep -v "grep" | awk '{print $2}')
kill -9 $pid

# 获取jar包的大小
filesize=`ls -l $fileName | awk '{ print $5 }'`
# 多少M以上使用外部依赖
maxsize=$((1024 * 1024 * 10)) # 10M

if [ $filesize -gt $maxsize ]
then
  echo "文件大小为【$filesize】，使用内部依赖启动"
  nohup java -jar -Dloader.path=./lib  $fileName > springboot.log 2>&1 &
else
  echo "文件大小为【$filesize】,使用外部依赖启动"
  nohup java -jar $fileName > springboot.log 2>&1 &
fi
```

适配两种情况

小于10M的jar包使用外部依赖 ![](https://pic.yupi.icu/5563/202312051401004.png)

大于10M的jar包使用内部依赖

![](https://pic.yupi.icu/5563/202312051401712.png)

> 在第三步优化完之后，jar包的大小大大减少，只剩下1M都不到，每次上传耗时不到1s，还能不能继续优化呢？
>
> 答案也是可以！当前还存在的问题是：
>
> 1、需要手动选择文件上传。
>
> 2、需要手动执行脚本
>
> 于是，进行第四步优化，引入Alibaba Cloud Toolkit插件

## 四、搭配Alibaba Cloud Toolkit插件使用，实现一键上传文件，并执行脚本

### 1、IDEA安装Alibaba Cloud Toolkit插件

1.1 从插件市场中下载Alibaba Cloud Toolkit插件，并重启IDEA。

![](https://pic.yupi.icu/5563/202312051401816.png)

### 2.配置服务器地址

![](https://pic.yupi.icu/5563/202312051401692.png)

![](https://pic.yupi.icu/5563/202312051404319.png)

![](https://pic.yupi.icu/5563/202312051401922.png)

可以看到就增加了一条新的配置

![](https://pic.yupi.icu/5563/202312051401912.png)

### 3.配置上传地址和执行的命令

查看所在路径

![](https://pic.yupi.icu/5563/202312051401414.png)

点击上传，配置上传的文件、上传地址以及执行的脚本

![](https://pic.yupi.icu/5563/202312051401402.png)

填加执行命令

![](https://pic.yupi.icu/5563/202312051401556.png)

![](https://pic.yupi.icu/5563/202312051401820.png)

### 4.点击Upload按钮

## 成果：1秒部署SpringBoot项目

![](https://pic.yupi.icu/5563/202312051401815.png)

> 提示：由于该插件安装后会在IDEA的左右侧边栏出现好几个其他的功能按钮，可以将他们移除，只留下底下的上传功能。

操作方式： 

![](https://pic.yupi.icu/5563/202312051405408.png)