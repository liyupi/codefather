# Nacos 配置中心搭建

> 作者：[心比天高，](https://blog.csdn.net/weixin_52258854)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 452

> 官方文档：[https://nacos.io/zh-cn/docs/v2/quickstart/quick-start.html](https://nacos.io/zh-cn/docs/v2/quickstart/quick-start.html)

### 版本选择
![](https://pic.yupi.icu/5563/202311062040531.png)（2023.07.06)
### 搭建

1. 下载并解压，下载地址：[https://github.com/alibaba/nacos/releases?page=2](https://github.com/alibaba/nacos/releases?page=2)
2. 单机启动命令：
```bash
sh startup.sh -m standalone
```

3. 查看日志确定是否启动成功
```bash
tail -n 5 /Users/wangzhihao/dev_tools/nacos/logs/start.out
```
![](https://pic.yupi.icu/5563/202311062041705.png)
### SpringBoot 中使用
#### 依赖
```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-bootstrap</artifactId>
  <version>3.1.3</version>
</dependency>
<dependency>
  <groupId>com.alibaba.boot</groupId>
  <artifactId>nacos-config-spring-boot-starter</artifactId>
  <version>0.2.12</version>
</dependency>
```
#### 配置
```yaml
nacos:
  config:
    server-addr: 127.0.0.1:8848
    auto-refresh: true
    group: DEFAULT_GROUP
    username: nacos
    password: nacos
    namespace: projectName
```
tip：nacos.config.bootstrap.enable 为 true 时，才能从 nacos 读取启动配置 如 端口号 等
#### 使用

1. 通过 @NacosConfigListener(dataId = "") 监听指定配置文件的变化
```java
@NacosConfigListener(dataId = "nacos-test-config")
public void onChange(String config) {
try {
    vipConfigList = JSONUtil.toList(config, VipConfig.class);
} catch (Exception e) {
    throw new RuntimeException(e);
}
}
```
nacos-test-config：
```json
[
  {
    "role": "ban",
    "addLeftNum": 0,
    "maxLeftNum": 10,
    "maxChatUserNum": 12,
    "messageRetainDay": 0,
    "downloadDrawPictureCost": 100
  },
  {
    "role": "user",
    "addLeftNum": 50,
    "maxLeftNum": 100,
    "maxChatUserNum": 2,
    "messageRetainDay": 7,
    "downloadDrawPictureCost": 5
  },
  {
    "role": "vip",
    "addLeftNum": 100,
    "maxLeftNum": 1000,
    "maxChatUserNum": 10,
    "messageRetainDay": 30,
    "downloadDrawPictureCost": 0,
    "drawMode": "fast"
  },
  {
    "role": "svip",
    "addLeftNum": 200,
    "maxLeftNum": 3000,
    "maxChatUserNum": 20,
    "messageRetainDay": 90,
    "downloadDrawPictureCost": 0,
    "modelMaxTokens": 4096,
    "drawMode": "fast"
  },
  {
    "role": "admin",
    "addLeftNum": 200,
    "maxLeftNum": 3000,
    "maxChatUserNum": 20,
    "messageRetainDay": 90,
    "downloadDrawPictureCost": 0,
    "drawMode": "fast"
  }
]

```

2. @NacosInjected ，可注入 ConfigService （在程序中控制更改或拉取配置及其他操作，类似于配置中心的操作客户端） 或 NamingService
```java
@NacosInjected
private ConfigService configService;

@PostConstruct
public void initVipConfig() {
    try {
        String content = configService.getConfig(dataId, groupId, 5000);
        vipConfigList = JSONUtil.toList(content, VipConfig.class);
    } catch (NacosException e) {
        e.printStackTrace();
    }
}
```
#### 接入 MySQL
Nacos 内置了 derby 嵌入式数据库，每启动一个 Nacos 就会有一个数据库，而我们在使用 Nacos 时往往都是集群，使用 derby 数据不能互通会很麻烦。所以我们需要一个外部的统一的数据库，Nacos 在 0.7 版本增加了支持 [mysql](https://cloud.tencent.com/product/cdb?from=20065&from_column=20065) 数据源的能力。
~~如果 Nacos 在单机环境下运行，则没有必要替换为 MySQL 。~~（后期数据不好迁移）
替换文档：[https://nacos.io/zh-cn/docs/deployment.html](https://nacos.io/zh-cn/docs/deployment.html)
![](https://pic.yupi.icu/5563/202311062041853.png)

#### 认证
> 文档：[https://nacos.io/zh-cn/docs/auth.html](https://nacos.io/zh-cn/docs/auth.html)
> 注意
> - Nacos是一个内部微服务组件，需要在可信的内部网络中运行，不可暴露在公网环境，防止带来安全风险。
> - Nacos提供简单的鉴权实现，为防止业务错用的弱鉴权体系，不是防止恶意攻击的强鉴权体系。
> - 如果运行在不可信的网络环境或者有强鉴权诉求，请参考官方简单实现做替换增强。

![](https://pic.yupi.icu/5563/202311062041400.png)
### SpringCloud 中使用
#### 依赖
```xml
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
  <version>${cloud.alibaba}</version>
</dependency>
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-bootstrap</artifactId>
  <version>3.0.3</version>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```
#### 配置( bootstrap.yml )
```yaml
spring:
  cloud:
    nacos:
      config:
        server-addr: 127.0.0.8848
        namespace: cloud
  application:
    name: cloud-nacos
```
