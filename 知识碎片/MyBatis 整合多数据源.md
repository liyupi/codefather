# MyBatis 整合多数据源

> 作者：[想飞天的猪头](https://wx.zsxq.com/dweb2/index/footprint/818812488588112)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 9414

有时候我们需要查询来自多个库表的数据内容，但是又不想起多个服务，可以业务需要这些数据那该怎么办呢？那么其实Mybatis 是支持整合多数据源，并随时进行切换。

## 背景

有时候我们需要查询来自多个库表的数据内容，但是又不想起多个服务，可以业务需要这些数据那该怎么办呢？那么其实Mybatis 是支持整合多数据源，并随时进行切换。

## 解决

### 引入依赖

首先引入`dynamic-datasource-spring-boot-starter`依赖

```xml
<dependency>
  <groupId>com.baomidou</groupId>
  <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
  <version>${version}</version><!--版本号-->
</dependency>
```

### 配置文件

```yaml
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    map-underscore-to-camel-case: true
  mapper-locations: mapper/*.xml

server:
  port: 8989

spring:
  datasource:
    dynamic:
      primary: master
      strict: false
      datasource:
        master:
          url: jdbc:mysql://localhost:3306/yuapi?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8&useSSL=false
          username: root
          password: root
          driver-class-name: com.mysql.cj.jdbc.Driver
        slave_1:
          url: jdbc:mysql://localhost:3306/db_email?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8&useSSL=false
          username: root
          password: root
          driver-class-name: com.mysql.cj.jdbc.Driver
```

#### 配置方式

```yaml
# 多主多从                      纯粹多库（记得设置primary）                   混合配置
spring:                               spring:                               spring:
  datasource:                           datasource:                           datasource:
    dynamic:                              dynamic:                              dynamic:
      datasource:                           datasource:                           datasource:
        master_1:                             mysql:                                master:
        master_2:                             oracle:                               slave_1:
        slave_1:                              sqlserver:                            slave_2:
        slave_2:                              postgresql:                           oracle_1:
        slave_3:                              h2:                                   oracle_2:
```

### 通过注解切换数据源

可以通过`@DS`注解进行数据源切换

```java
@Service
@DS("master")
public class InterfaceInfoServiceImpl extends ServiceImpl<InterfaceInfoMapper, InterfaceInfo> implements InterfaceInfoService {
}
@Service
@DS("slave_1")
public class TEmailServiceImpl extends ServiceImpl<TEmailMapper, TEmail> implements TEmailService {
}
```

注解的内容对应配置里的名称。

## 约定

1. 本框架只做 切换数据源 这件核心的事情，并不限制你的具体操作，切换了数据源可以做任何CRUD。
2. 配置文件所有以下划线 _ 分割的数据源 首部 即为组的名称，相同组名称的数据源会放在一个组下。
3. 切换数据源可以是组名，也可以是具体数据源名称。组名则切换时采用负载均衡算法切换。
4. .默认的数据源名称为 master ，你可以通过 spring.datasource.dynamic.primary 修改。
5. 方法上的注解优先于类上注解。
6. DS支持继承抽象类上的DS，暂不支持继承接口上的DS，在方法上面标记优先级高于在类上标记。

> 注意这个原理也是基于AOP,所以在一个方法内是不可以切换数据源的。