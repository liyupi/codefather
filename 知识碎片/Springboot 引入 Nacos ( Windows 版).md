# Springboot 引入 Nacos ( Windows 版)

> 作者：[为](https://blog.csdn.net/Go_ahead_forever)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 14255

首先要了解在 Springboot 中只支持那些 Springboot 的版本（我真的被这个搞死了）,可以如下图参考：

![](https://pic.yupi.icu/5563/202312131307119.png)

下面我们就开始吧

## 下载 Nacos

[nacos 下载地址](https://github.com/alibaba/nacos/tags)，这里可以选择你要下载的版本，我选择下载了2.2.2，在下载的时候根据自己的电脑选择合适的压缩包

我这里演示 windows 版本

下载好以后就可以解压，放到一个无中文的目录（千万）

然后点开`nacos`目录到达`bin`目录里面就是可运行的文件了。

如果想要单节点运行（一般我们自己学习都是单节点，但是默认启动多节点就会报错），请运行下列命令：

```bash
.\startup.cmd -m standalone
```

命令的运行是在 bin 目录下，如果无权限，请用管理员的终端再次尝试。

![](https://pic.yupi.icu/5563/202312131307768.png)

启动好后：

![](https://pic.yupi.icu/5563/202312131307829.png)

点击上图出现的网址可以进入（如果要输入密码默认都是nacos）：

![](https://pic.yupi.icu/5563/202312131307841.png)

------

------

------

## Springboot 中引入

### 引入依赖管理

这个依赖管理包含了 Springboot 的版本，springcloud 的版本，springalibabacloud 的版本。引入依赖管理是便于后期加入依赖的时候不用关注版本本身，只需要把依赖引入就好了。

我这里 springboot 的版本是 2.6.11（请严格按照开始的那张图对应版本）

在你的 pom.xml 文件中引入：

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>2021.0.4</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>2021.0.4.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>

</dependencyManagement>
```

### 引入使用的依赖

我们是要使用的是 nacos 的服务注册，所以我们引入 discovery 的启动包，以及要想启动我们要引入 springcloud 的 bootstrap 包。

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
```

### 在 application.yml 中填写配置

这里主要就是配置 nacos 服务器的地址，以及配置我们整个服务的名称。

```yaml
spring:
  application:
    name: nacos-config-example
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
```

### 在启动类中添加允许发现的注解

其实就是注解 `@EnableDiscoveryClient`

直接看代码

```java
@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

}
```

------

------

------

然后重新启动就可以啦

![](https://pic.yupi.icu/5563/202312131308126.png)

> 说明：在SpringBoot 2.4.x的版本之后，对于bootstrap.properties/bootstrap.[yaml配置文件](https://so.csdn.net/so/search?q=yaml配置文件&spm=1001.2101.3001.7020)(我们合起来成为Bootstrap配置文件)的支持，需要导入如下的依赖。由于SpringCloud 2020.*以后的版本默认禁用了bootstrap，导致读取配置文件时读取不到该属性。
>
> ```xml
> <dependency>
>   <groupId>org.springframework.cloud</groupId>
>   <artifactId>spring-cloud-starter-bootstrap</artifactId>
> </dependency>
> ```

## 使用

> 注意：在 Spring Cloud Nacos 2021 以后就没有在默认使用 Ribbon 作为负载均衡器了，而且在Cloud官网中也推荐使用LoadBalancer 作为负载均衡器，对此先引入依赖：
>
> ```xml
> <!--loadbalancer负载均衡器-->
> <dependency>
> <groupId>org.springframework.cloud</groupId>
> <artifactId>spring-cloud-starter-loadbalancer</artifactId>
> </dependency> 
> ```

建立一个类似的工程，前面的引入过程一致。

最终在使用的时候如下：

```java
package com.xwhking.orderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;

@RestController
@RequestMapping("/order")
public class TestController {
    @Resource
    private RestTemplate restTemplate;


    @Resource
    private LoadBalancerClient loadBalancerClient;

    @GetMapping("/test/{id}")
    public String getTest(@PathVariable("id") String id){
        String url = "http://userservice/user/getOne/"+id;
        ServiceInstance serviceInstance = loadBalancerClient.choose("userservice");
        url = serviceInstance.getUri().toString()+"/user/getOne/"+id;
        String result1 = restTemplate.getForObject(url, String.class);
        return result1+"\n";
    }
}
```

好文推荐：[SpringBoot2.6.11 + Spring Cloud Alibaba + Nacos 搭建 - MyDistance - 博客园 (cnblogs.com)](https://www.cnblogs.com/CF1314/p/17541747.html)

如果有这些错误提示：

- `org.springframework.cloud.commons.ConfigDataMissingEnvironmentPostProcessor$ImportException: No spring.config.import set`
- 或者启动不了，按这篇文章来一遍，几乎都可以啦