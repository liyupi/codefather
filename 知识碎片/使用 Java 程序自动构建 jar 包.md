# 使用 Java 程序自动构建 jar 包

> 作者：[程序员鱼皮](https://space.bilibili.com/12890453/)，[编程导航](https://yuyuanweb.feishu.cn/wiki/VC1qwmX9diCBK3kidyec74vFnde) 编号 1



传统构建 jar 包的方法是通过人工手动执行 Maven 命令来完成。

但如果我们想要制作自动化构建和部署项目的工具，就需要让程序帮我们自动构建 jar 包。

这里以 Java 语言为例，分享一下教程。



### 实现思路

程序的本质就是代替人工进行操作，所以如果要实现程序自动构建 jar 包，只需要让程序来替我们执行 Maven 打包命令即可。



### 开发实现

1）首先需要在本地（或服务器）安装 Maven 并配置环境变量，参考教程：https://blog.csdn.net/qq_45344586/article/details/130935169



安装完成后，打开终端，执行 `mvn -v` 命令检测是否安装成功，鱼皮本地的环境是 Maven 3.9.5：

![](https://pic.yupi.icu/1/1701156777614-c96c137e-7465-4795-adfb-258bbaa22b21.png)



2）新建 `JarGenerator.java` 类，编写 jar 包构建逻辑。

程序实现的关键是：使用 Java 内置的 Process 类执行 Maven 打包命令，并获取到命令的输出信息。**需要注意，不同的操作系统，执行的命令代码不同。**

完整代码如下：

```java
package com.yupi.maker.generator;

import java.io.*;

public class JarGenerator {

    public static void doGenerate(String projectDir) throws IOException, InterruptedException {
        // 清理之前的构建并打包
        // 注意不同操作系统，执行的命令不同
        String winMavenCommand = "mvn.cmd clean package -DskipTests=true";
        String otherMavenCommand = "mvn clean package -DskipTests=true";
        String mavenCommand = winMavenCommand;
        
        // 这里一定要拆分！
        ProcessBuilder processBuilder = new ProcessBuilder(mavenCommand.split(" "));
        processBuilder.directory(new File(projectDir));

        Process process = processBuilder.start();

        // 读取命令的输出
        InputStream inputStream = process.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }

        // 等待命令执行完成
        int exitCode = process.waitFor();
        System.out.println("命令执行结束，退出码：" + exitCode);
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        doGenerate("C:\\code\\yuzi-generator\\yuzi-generator-maker\\generated\\acm-template-pro-generator");
    }
}
```



需要注意，要把上述代码 main 方法中的生成路径改为自己本地的项目路径。



3）想使用 Maven 打包项目，项目的根目录下必须要有 `pom.xml` 项目管理文件。而且在 `pom.xml` 中，需要使用 `maven-assembly-plugin` 插件，实现将依赖一起打到 jar 包中。

完整代码如下，注意要将 `mainClass` 标签的内容改为自己项目中可运行的主类路径：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-assembly-plugin</artifactId>
            <version>3.3.0</version>
            <configuration>
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
                <archive>
                    <manifest>
                        <mainClass>${basePackage}.Main</mainClass> <!-- 替换为你的主类的完整类名 -->
                    </manifest>
                </archive>
            </configuration>
            <executions>
                <execution>
                    <phase>package</phase>
                    <goals>
                        <goal>single</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```



4）之后通过一行代码就可以构建 jar 包了：

```java
public class MainGenerator {

    public static void main(String[] args) throws IOException, InterruptedException {
    	String outputPath = "项目代码根路径";
        // 构建 jar 包
        JarGenerator.doGenerate(outputPath);
    }
}
```



### 调用测试

测试 jar 包构建，首次构建需要拉取依赖信息，要等一段时间。

最后看到下图的输出信息，表示打包成功：

![](https://pic.yupi.icu/1/1701159049699-4039d707-089c-447d-b46c-a001f7ca37a3.png)



在生成的目录中看到了 pom.xml 和 jar 包文件：

![](https://pic.yupi.icu/1/1701159417464-4d8e051c-b4f6-4df3-b70e-871a2271c110.png)



### 实践

编程导航的定制化代码生成项目中，使用了上述方式实现 jar 包的自动构建。

👉🏻 编程导航原创项目教程系列：https://yuyuanweb.feishu.cn/wiki/SePYwTc9tipQiCktw7Uc7kujnCd