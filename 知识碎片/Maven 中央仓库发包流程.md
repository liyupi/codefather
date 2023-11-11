# Maven 中央仓库发包流程

> 作者：[心比天高，](https://blog.csdn.net/weixin_52258854)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 452

> 官方文档：[https://central.sonatype.org/publish/publish-maven/#a-complete-example-pom](https://central.sonatype.org/publish/publish-maven/#a-complete-example-pom)

### 整体流程

1. 注册 Jira Software 
2. 新建问题
3. 完成域名所有权的验证
4. 配置 gpg 密钥
5. 配置 setting.xml
6. 配置 pom.xml
7. 上传
### 具体操作

1. 注册 Jira Software ：![](https://pic.yupi.icu/5563/202311062035772.png)
2. 新建申请：[https://issues.sonatype.org/secure/CreateIssue.jspa?issuetype=21&pid=10134](https://issues.sonatype.org/secure/CreateIssue.jspa?issuetype=21&pid=10134)
   - 前两个默认值没有必要改动
   - Group Id 填域名或 io.github.用户名（后续验证会验证域名或 GitHub 账号的所有权）
   - Project URL 和 SCM url 按照实例填
   - Username(s) 指能够向这个 Group Id 发包的 jira 用户
   - ![](https://pic.yupi.icu/5563/202311062036925.png)
3. 查看新建的申请并等待审核（一般5-10分钟）![](https://pic.yupi.icu/5563/202311062036134.png)然后官方的机器人会给一个评论让我们完成验证![](https://pic.yupi.icu/5563/202311062036048.png)根据评论的提示，如果我们的 Group Id 是域名，则需要给域名添加一条解析记录；如果是 GitHub 的话，则需要创建一个新的仓库来完成验证；做完之后将问题调整为开放状态等待审核（因为我这里是已经完成了，所以是已解决状态）![](https://pic.yupi.icu/5563/202311062036309.png)审核成功之后会有如下评论![](https://pic.yupi.icu/5563/202311062036886.png)
4. [下载](https://www.gnupg.org/download/index.html) GPG 工具，在命令行执行 gpg --gen-key** **命令，按照指示（会要求输入私钥，需保存）生成密钥对。gpg --list-keys 命令可以查看已生成的密钥对。通过 gpg --keyserver keyserver.ubuntu.com --send-keys 公钥 命令将密钥对发到服务器，供后面验证使用![](https://pic.yupi.icu/5563/202311062036219.png)
5. 配置 Maven 的 setting.xml 文件。在 servers 里添加一个 server 块，内容如下:
```xml
<server>
  <id>ossrh</id>
  <username>jira 账号</username>
  <password>jira 密码</password>
</server>
```

6. 配置项目的 pom.xml 文件，这里主要是添加了一些插件，测试通过的示例 pom 文件如下。注意：包的 GAV 坐标里的 groupId 一定要跟上面在 jira 申请问题时填写的 Group Id 保持一致，否则无法上传成功
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.2</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
		<!--  包信息根据实际填写，groupId 一定要跟上面在 jira 申请问题时填写的 Group Id 保持一致，否则无法上传成功 -->
    <groupId>...</groupId>
    <artifactId>...</artifactId>
    <version>...</version>
    <name>...</name>
    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <maven.compiler.encoding>UTF-8</maven.compiler.encoding>
    </properties>
    <dependencies>
    	...
    </dependencies>


    <distributionManagement>
        <snapshotRepository>
            <id>ossrh</id>
            <url>https://s01.oss.sonatype.org/content/repositories/snapshots</url>
        </snapshotRepository>
        <repository>
            <id>ossrh</id>
            <url>https://s01.oss.sonatype.org/service/local/staging/deploy/maven2/</url>
        </repository>
    </distributionManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.sonatype.plugins</groupId>
                <artifactId>nexus-staging-maven-plugin</artifactId>
                <version>1.6.7</version>
                <extensions>true</extensions>
                <configuration>
                    <serverId>ossrh</serverId>
                    <nexusUrl>https://s01.oss.sonatype.org/</nexusUrl>
                    <stagingProgressTimeoutMinutes>20</stagingProgressTimeoutMinutes>
                    <autoReleaseAfterClose>true</autoReleaseAfterClose>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-source-plugin</artifactId>
                <version>2.2.1</version>
                <executions>
                    <execution>
                        <id>attach-sources</id>
                        <goals>
                            <goal>jar-no-fork</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-gpg-plugin</artifactId>
                <version>1.5</version>
                <executions>
                    <execution>
                        <id>sign-artifacts</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>sign</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-javadoc-plugin</artifactId>
                <configuration>
                    <additionalOptions>
                        <additionalOption>-Xdoclint:none</additionalOption>
                    </additionalOptions>
                </configuration>
                <executions>
                    <execution>
                        <id>attach-javadocs</id>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
		<!-- 后面是开发者及项目信息，根据实际填写 -->
    <licenses>
        <license>
            <name>BSD 3-Clause</name>
            <url>https://spdx.org/licenses/BSD-3-Clause.html</url>
        </license>
    </licenses>
    <scm>
        <connection>...</connection>
        <url>...</url>
    </scm>
    <developers>
        <developer>
            <name>...</name>
            <email>...</email>
            <roles>
                <role>Developer</role>
            </roles>
            <timezone>+8</timezone>
        </developer>
    </developers>

</project>

```

7. 上传包

![](https://pic.yupi.icu/5563/202311062036072.png)
构建成功之后可以先查一下是否发布成功（用 jira 账号登录）：[https://s01.oss.sonatype.org/#stagingRepositories](https://s01.oss.sonatype.org/#stagingRepositories)![](https://pic.yupi.icu/5563/202311062037187.png)
成功之后在 jira 创建的问题里会有评论（会有一定延迟），如下图：![](https://pic.yupi.icu/5563/202311062037706.png)

8. 到这里就完成了，接下来等着其他各大仓库自动同步（网上说4h，但我实际测试用了接近7h）就可以了。[Maven 中央仓库](https://central.sonatype.com/search?smo=true)首先可以查到（这个很快，半小时内就可以查到了），然后是我们熟知的[https://mvnrepository.com/](https://mvnrepository.com/)和其他仓库
