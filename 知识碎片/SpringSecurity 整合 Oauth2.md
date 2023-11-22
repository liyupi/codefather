# SpringSecurity 整合 Oauth2

> 作者：[想飞天的猪头](https://www.sweetmore.cn/)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 9414

OAuth 是一个开放的非常重要的认证标准/协议，该标准允许用户让第三方应用访问该用户在某一网站上存储的私密资源，而SpringSecurity作为现在很重要的安全框架也支持了Oauth2协议

## Oauth简介

OAuth 是一个开放的非常重要的认证标准/协议，该标准允许用户让第三方应用访问该用户在某一网站上存储的私密资源（如头像、照片、视频等），并且在这个过程中无须将用户名和密码提供给第三方应用。通过令牌（token）可以实现这一功能，每一个令牌授权一个特定的网站在特定的时段内允许可特定的资源。OAuth 让用户可以授权第三方网站灵活访问它们存储在另外一些资源服务器上的特定信息，而非所有内容。对于用户而言，我们在互联网应用中最常见的 OAuth 应用就是各种第三方登录，例如QQ授权登录、微信授权登录、微博授权登录、GitHub 授权登录等。

例如用户想登录 Ruby China，传统方式是使用用户名密码但是这样并不安全，因为网站会存储你的用户名密码，这样可能会导致密码泄露。这种授权方式安全隐患很大，如果使用 OAuth 协议就能很好地解决这一问题。

![](https://pic.yupi.icu/5563/202311211035897.png)

## OAuth2 授权总体流程

角色梳理: 第三方应用 <----> 存储用户私密信息应用 ----> 授权服务器 ----> 资源服务器

![](https://pic.yupi.icu/5563/202311211033233.png)

```markdown
A）用户打开客户端以后，客户端要求用户给予授权。
B）用户同意给予客户端授权。
C）客户端使用上一步获得的授权，向认证服务器申请令牌。
D）认证服务器对客户端进行认证以后，确认无误，同意发放令牌。
E）客户端使用令牌，向资源服务器申请获取资源。
F）资源服务器确认令牌无误，同意向客户端开放资源。
```

从上图中我们可以看出六个步骤之中，B是关键，即用户怎样才能给于客户端授权。同时会发现 OAuth2 中包含四种不同的角色：

- **Client：**第三方应用。
- **Resource Owner**：资源所有者。
- **Authorization Server** ：授权服务器。
- **Resource Server**： 资源服务器。

## 四种授权模式

### 授权码模式

**授权码模式（`Authorization Code`）** 是功能最完整、流程最严密、最安全并且使用最广泛的一种OAuth2授权模式。同时也是最复杂的一种授权模式，它的特点就是通过客户端的后台服务器，与`服务提供商`的认证服务器进行互动。其具体的授权流程如图所示（图片来自 RFC6749文档 https://tools.ietf.org/html/rfc6749)

- Third-party application：第三方应用程序，简称"客户端"（client）；
- Resource Owner：资源所有者，简称"用户"（user）；
- User Agent：用户代理，是指浏览器；
- Authorization Server：认证服务器，即服务端专门用来处理认证的服务器；
- Resource Server：资源服务器，即服务端存放用户生成的资源的服务器。它与认证服务器，可以是同一台服务器，也可以是不同的服务器。

![](https://pic.yupi.icu/5563/202311211033235.png)

具体流程如下:

- （A）用户访问第三方应用，第三方应用通过浏览器导向认证服务器。
- （B）用户选择是否给予客户端授权。
- （C）假设用户给予授权，认证服务器将用户导向客户端事先指定的"重定向URI"（redirection URI），同时附上一个授权码。
- （D）客户端收到授权码，附上早先的"重定向URI"，向认证服务器申请令牌。这一步是在客户端的后台的服务器上完成的，对用户不可见。
- （E）认证服务器核对了授权码和重定向URI，确认无误后，向客户端发送访问令牌（access token）和更新令牌（refresh token）。

核心参数:

```http
https://wx.com/oauth/authorize?response_type=code&client_id=CLIENT_ID&redirect_uri=http://www.baidu.com&scope=read
```

| 字段          | 描述                                          |
| ------------- | --------------------------------------------- |
| client_id     | 授权服务器注册应用后的唯一标识                |
| response_type | 必须 固定值 在授权码中必须为 code             |
| redirect_uri  | 必须 通过客户端注册的重定向URL                |
| scope         | 必须 令牌可以访问资源权限 read 只读 all 读写  |
| state         | 可选 存在原样返回客户端 用来防止 CSRF跨站攻击 |

### 简化模式

**简化模式（`implicit` grant type）**不通过第三方应用程序的服务器，直接在浏览器中向认证服务器申请令牌，跳过了"授权码"这个步骤，因此得名。所有步骤在浏览器中完成，令牌对访问者是可见的，且客户端不需要认证。其具体的授权流程如图所示（图片来自 RFC6749文档 https://tools.ietf.org/html/rfc6749)

![](https://pic.yupi.icu/5563/202311211033640.png)

具体步骤如下:

- （A）第三方应用将用户导向认证服务器。
- （B）用户决定是否给于客户端授权。
- （C）假设用户给予授权，认证服务器将用户导向客户端指定的"重定向URI"，并在URI的Hash部分包含了访问令牌。#token
- （D）浏览器向资源服务器发出请求，其中不包括上一步收到的Hash值。
- （E）资源服务器返回一个网页，其中包含的代码可以获取Hash值中的令牌。
- （F）浏览器执行上一步获得的脚本，提取出令牌。
- （G）浏览器将令牌发给客户端。

核心参数:

```http
https://wx.com/oauth/authorize?response_type=token&client_id=CLIENT_ID&redirect_uri=http://www.baidu.com&scope=read
```

| 字段          | 描述                                          |
| ------------- | --------------------------------------------- |
| client_id     | 授权服务器注册应用后的唯一标识                |
| response_type | 必须 固定值 在授权码中必须为 token            |
| redirect_uri  | 必须 通过客户端注册的重定向URL                |
| scope         | 必须 令牌可以访问资源权限                     |
| state         | 可选 存在原样返回客户端 用来防止 CSRF跨站攻击 |

### 密码模式

**密码模式（Resource Owner `Password` Credentials Grant）**中，用户向客户端提供自己的用户名和密码。客户端使用这些信息，向"服务商提供商"索要授权。在这种模式中，用户必须把自己的密码给

端，但是客户端不得储存密码。这通常用在用户对客户端高度信任的情况下，比如客户端是操作系统的一部分，或者由一个相同公司出品。而认证服务器只有在其他授权模式无法执行的情况下，才能考虑使用这种模式。其具体的授权流程如图所示（图片来自 RFC6749文档 https://tools.ietf.org/html/rfc6749)

![](https://pic.yupi.icu/5563/202311211033335.png)

具体步骤如下:

- （A）用户向客户端提供用户名和密码。
- （B）客户端将用户名和密码发给认证服务器，向后者请求令牌。
- （C）认证服务器确认无误后，向客户端提供访问令牌。

核心参数:

```http
https://wx.com/token?grant_type=password&username=USERNAME&password=PASSWORD&client_id=CLIENT_ID
```

### 客户端模式

**客户端模式（`Client Credentials` Grant）**指客户端以自己的名义，而不是以用户的名义，向"服务提供商"进行认证。严格地说，客户端模式并不属于OAuth框架所要解决的问题。在这种模式中，用户直接向客户端注册，客户端以自己的名义要求"服务提供商"提供服务，其实不存在授权问题。

![](https://pic.yupi.icu/5563/202311211033053.png)

具体步骤如下:

- （A）客户端向认证服务器进行身份认证，并要求一个访问令牌。
- （B）认证服务器确认无误后，向客户端提供访问令牌。

```http
https://wx.com/token?grant_type=client_credentials&client_id=CLIENT_ID&client_secret=CLIENT_SECRET
```

## OAuth2 标准接口

- `/oauth/authorize`：授权端点
- `/oauth/token`：获取令牌端点
- /oauth/confirm_access：用户确认授权提交端点
- /oauth/error：授权服务错误信息端点
- /oauth/check_token：用于资源服务访问的令牌解析端点
- /oauth/token_key：提供公有密匙的端点，如果使用JWT令牌的话

### GitHub 授权登录

#### 创建 OAuth 应用

访问 github 并登录，在https://github.com/settings/profile中找到 Developer Settings 选项

![](https://pic.yupi.icu/5563/202311211033684.png)

- 创建 OAuth App并输入一下基本信息:

![](https://pic.yupi.icu/5563/202311211033071.png)

- 注册成功后会获取到对应的 Client ID 和 Client Secret。

![](https://pic.yupi.icu/5563/202311211033351.png)

## 项目开发

创建 springboot 应用，并引入依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

- 创建测试 controller

```java
@RestController
public class HelloController {

    @GetMapping("/hello")
    public DefaultOAuth2User hello(){
        System.out.println("hello ");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (DefaultOAuth2User) authentication.getPrincipal();
    }
}
```

- 配置 security

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .anyRequest().authenticated()
                .and()
                .oauth2Login(); 
    }
}
```

- 配置配置文件

```properties
server.port=8080

spring.security.oauth2.client.registration.github.client-id=d6ea299b9ade3cd3b97d
spring.security.oauth2.client.registration.github.client-secret=aaa44b2675a7b636b1b43371e509e88ee9013816
#  一定要与重定向回调 URL 一致
spring.security.oauth2.client.registration.github.redirect-uri=http://localhost:8080/login/oauth2/code/github
```

- 启动测试

![](https://pic.yupi.icu/5563/202311211033343.png)

- 点击 github 登录,点击授权 访问 hello 接口

![](https://pic.yupi.icu/5563/202311211033643.png)

## Spring Security OAuth2

Spring Security 对 OAuth2 提供了很好的支持，这使得我们在 Spring Security中使用 OAuth2 非常地方便。然而由于历史原因，Spring Seaurity对 OAuth2 的支持比较混乱，这里简单梳理一下。

大约十年前，Spring 引入了一个社区驱动的开源项目 Spring Security OAuth， 并将其纳入 Spring 项目组合中。到今天为止，这个项目己经发展成为一个成熟的项目，可以支持大部分OAuth 规范，包括资源服务器、 客户端和授权服务器等。

然而早期的项目存在一些问题，例如：

- OAuth 是在早期完成的，开发者无法预料未来的变化以及这些代码到底要被怎么使用，

  这导致很多 Spring 项目提供了自己的 OAuth 支持，也就带来了 OAuth 支持的碎片化。

- 最早的OAuth项目同时支特 OAuth1.0 和 OAuth2.0，而现在OAuth1.0 早已经不再使用，

  可以放弃了。

- 现在我们有更多的库可以选择，可以在这些库的基础上去开发，以便更好地支持JWT等新技术。

基于以上这些原因，官方决定重写 Spring Security OAuth， 以便更好地协调 Spring 和OAuth，并简化代码库，使Spring 的 OAuth 支持更加灵活。然而，在重写的过程中，发生了不少波折。

2018年1月30日，Spring 官方发了一个通知，表示要逐渐停止现有的 OAuth2支持，然后在 Spring Security 5中构建下一代 OAuth2.0 支持。这么做的原因是因为当时 OAuth2 的落地方案比较混乱，在 Spring Security OAuth、 Spring Cloud Security、Spring Boot 1.5.x 以及当时最新的Spring Security 5.x 中都提供了对 OAuth2 的实现。以至于当开发者需要使用 OAuth2 时，不得不问，到底选哪一个依赖合适呢？

所以Spring 官方决定有必要将 OAuth2.0 的支持统一到一个项目中，以便为用户提供明确的选择，并避免任何潜在的混乱，同时 OAuth2.0 的开发文档也要重新编写，以方便开发人员学习。所有的决定将在 Spring Security 5 中开始，构建下一代 OAuth2.0的支持。从那个时候起，Spring Security OAuth 项目就正式处于维护模式。官方将提供至少一年的错识/安全修复程序，并且会考虑添加次要功能，但不会添加主要功能。同时将 Spring Security OAuth中的所有功能重构到 Spring Security 5.x 中。

到了2019年11月14日，Spring 官方又发布一个通知，这次的通知首先表示 Spring Security OAuth 在迁往 Spring Security 5.x 的过程非常顺利，大都分迁程工作已经完成了，剩下的将在5.3 版本中完成迁移，在迁移的过程中还添加了许多新功能。包括对 OpenID Connect1.0 的支持。同时还宣布将不再支持授权服务器，不支持的原因有两个：

1. `在2019年，已经有大量的商业和开源授权服务器可用。`
2. `授权服务器是使用一个库来构建产品，而 Spring Security 作为框架，并不适合做这件事情。`

一石激起千层浪，许多开发者表示对此难以接受。这件事也在Spring 社区引发了激烈的讨论，好在 Spring 官方愿意倾听来自社区的声音。

到了2020年4月15日，Spring 官方宣布启动 Spring Authorization server 项目。这是一个由 Spring Security 团队领导的社区驱动的项目，致力于向 Spring 社区提供 Authorization Server支持，也就是说，Spring 又重新支持授权服务器了。

2020年8月21日，Spring Authorization Server 0.0.1 正式发布！

这就是 OAuth2 在Spring 家族中的发展历程了。在后面的学习中，客户端和资源服务器都将采用最新的方式来构建，授权服务器依然采用旧的方式来构建，因为目前的 Spring Authorization Server 0.0.1 功能较少且 BUG 较多。

一般来说，当我们在项目中使用 OAuth2 时，都是开发客户端，授权服务器和资源服务器都是由外部提供。例如我们想在自己搭建网站上集成 GitHub 第三方登录，只需要开发自己的客户端即可，认证服务器和授权服务器都是由 GitHub 提供的。

### 授权、资源服务器

前面的 GitHub 授权登录主要向大家展示了 OAuth2 中客户端的工作模式。对于大部分的开发者而言，日常接触到的 OAuth2 都是开发客户端，例如接入 QQ 登录、接入微信登录等。不过也有少量场景，可能需要开发者提供授权服务器与资源服务器，接下来我们就通过一个完整的案例演示如何搭建授权服务器与资源服务器。

搭建授权服务器，我们可以选择一些现成的开源项目，直接运行即可，例如：

- Keycloak： RedFat 公司提供的开源工具，提供了很多实用功能，倒如单点登录、支持OpenID、可视化后台管理等。
- Apache Oltu: Apache 上的开源项目，最近几年没怎么维护了。

接下来我们将搭建一个包含授权服务器、资源服务器以及客户端在内的 OAuth2 案例。

项目规划首先把项目分为三部分：

- 授权服务器：采用较早的 spring-cloud-starter-oauth2 来搭建授权服务器。
- 资源服务器：采用最新的 Spring Security 5.x 搭建资源服务器，
- 客户端: 采用最新的 Spring Security5.x 搭建客户端。

### 授权服务器搭建

#### 1. 基于内存客户端和令牌存储

创建 springboot 应用,并引入依赖

> 注意: 降低 springboot 版本为 2.2.5.RELEASE

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-oauth2</artifactId>
  <version>2.2.5.RELEASE</version>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

编写配置类,添加 security 配置类以及 oauth 配置类

> Spring Security 配置类:

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Override
    @Bean
    protected AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }
    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager inMemoryUserDetailsManager = new InMemoryUserDetailsManager();
        UserDetails user = User.withUsername("root").password(passwordEncoder().encode("123")).roles("ADMIN").build();
        inMemoryUserDetailsManager.createUser(user);
        return inMemoryUserDetailsManager;
    }
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService());
    }
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable().formLogin();
    }
}
```

> Authorization Server 配置类:

```java
@Configuration
@EnableAuthorizationServer
public class AuthorizationServer extends AuthorizationServerConfigurerAdapter {
  
    private final PasswordEncoder passwordEncoder;

    private final UserDetailsService userDetailsService;

    @Autowired
    public AuthorizationServer(PasswordEncoder passwordEncoder, UserDetailsService userDetailsService) {
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
    }

    /**
     * 配置客户端细节 如 客户端 id 秘钥 重定向 url 等
     *
     * @throws Exception
     */
    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory().withClient("client")
                .secret(passwordEncoder.encode("secret"))
                .redirectUris("http://www.baidu.com")
                .scopes("client:read,user:read")
                .authorizedGrantTypes("authorization_code", "refresh_token","implicit","password","client_credentials");
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        endpoints.userDetailsService(userDetailsService);//开启刷新令牌必须指定
    }
}
```

启动服务,登录之后进行授权码获取

![](https://pic.yupi.icu/5563/202311211033565.png)

```http
http://localhost:8080/oauth/authorize?client_id=client&response_type=code&redirect_uri=http://www.baidu.com
```

![](https://pic.yupi.icu/5563/202311211033797.png)

点击授权获取授权码

![](https://pic.yupi.icu/5563/202311211034088.png)

根据授权码,申请令牌

```http
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'grant_type=authorization_code&code=IwvCtx&redirect_uri=http://www.baidu.com' "http://client:secret@localhost:8080/oauth/token"
```

![](https://pic.yupi.icu/5563/202311211034404.png)

刷新令牌

```http
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'grant_type=refresh_token&refresh_token=f6583d8a-598c-46bb-81d8-01fa6484cf05&client_id=client' "http://client:secret@localhost:8080/oauth/token"
```

![](https://pic.yupi.icu/5563/202311211034985.png)

#### 基于数据库客户端和令牌存储

在上面的案例中，TokenStore 的默认实现为 InMemoryTokenStore 即内存存储，对于 Client 信息，ClientDetailsService 接口负责从存储仓库中读取数据，在上面的案例中默认使用的也是 InMemoryClientDetailsService 实现类。

如果要想使用数据库存储，只要提供这些接口的实现类即可，而框架已经为我们写好 JdbcTokenStore 和 JdbcClientDetailsService

建表:

```http
https://github.com/spring-projects/spring-security-oauth/blob/master/spring-security-oauth2/src/test/resources/schema.sql
# 注意: 并用 BLOB 替换语句中的 LONGVARBINARY 类型
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for clientdetails
-- ----------------------------
DROP TABLE IF EXISTS `clientdetails`;
CREATE TABLE `clientdetails` (
  `appId` varchar(256) NOT NULL,
  `resourceIds` varchar(256) DEFAULT NULL,
  `appSecret` varchar(256) DEFAULT NULL,
  `scope` varchar(256) DEFAULT NULL,
  `grantTypes` varchar(256) DEFAULT NULL,
  `redirectUrl` varchar(256) DEFAULT NULL,
  `authorities` varchar(256) DEFAULT NULL,
  `access_token_validity` int(11) DEFAULT NULL,
  `refresh_token_validity` int(11) DEFAULT NULL,
  `additionalInformation` varchar(4096) DEFAULT NULL,
  `autoApproveScopes` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`appId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for oauth_access_token
-- ----------------------------
DROP TABLE IF EXISTS `oauth_access_token`;
CREATE TABLE `oauth_access_token` (
  `token_id` varchar(256) DEFAULT NULL,
  `token` blob,
  `authentication_id` varchar(256) NOT NULL,
  `user_name` varchar(256) DEFAULT NULL,
  `client_id` varchar(256) DEFAULT NULL,
  `authentication` blob,
  `refresh_token` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`authentication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for oauth_approvals
-- ----------------------------
DROP TABLE IF EXISTS `oauth_approvals`;
CREATE TABLE `oauth_approvals` (
  `userId` varchar(256) DEFAULT NULL,
  `clientId` varchar(256) DEFAULT NULL,
  `scope` varchar(256) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `expiresAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastModifiedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for oauth_client_details
-- ----------------------------
DROP TABLE IF EXISTS `oauth_client_details`;
CREATE TABLE `oauth_client_details` (
  `client_id` varchar(256) NOT NULL,
  `resource_ids` varchar(256) DEFAULT NULL,
  `client_secret` varchar(256) DEFAULT NULL,
  `scope` varchar(256) DEFAULT NULL,
  `authorized_grant_types` varchar(256) DEFAULT NULL,
  `web_server_redirect_uri` varchar(256) DEFAULT NULL,
  `authorities` varchar(256) DEFAULT NULL,
  `access_token_validity` int(11) DEFAULT NULL,
  `refresh_token_validity` int(11) DEFAULT NULL,
  `additional_information` varchar(4096) DEFAULT NULL,
  `autoapprove` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for oauth_client_token
-- ----------------------------
DROP TABLE IF EXISTS `oauth_client_token`;
CREATE TABLE `oauth_client_token` (
  `token_id` varchar(256) DEFAULT NULL,
  `token` blob,
  `authentication_id` varchar(256) NOT NULL,
  `user_name` varchar(256) DEFAULT NULL,
  `client_id` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`authentication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for oauth_code
-- ----------------------------
DROP TABLE IF EXISTS `oauth_code`;
CREATE TABLE `oauth_code` (
  `code` varchar(256) DEFAULT NULL,
  `authentication` blob
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for oauth_refresh_token
-- ----------------------------
DROP TABLE IF EXISTS `oauth_refresh_token`;
CREATE TABLE `oauth_refresh_token` (
  `token_id` varchar(256) DEFAULT NULL,
  `token` blob,
  `authentication` blob
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- 写入客户端信息
INSERT INTO `oauth_client_details` VALUES ('client', NULL, '$2a$10$QCsINtuRfP8kM112xRVdvuI58MrefLlEP2mM0kzB5KZCPhnOf4392', 'read', 'authorization_code,refresh_token', 'http://www.baidu.com', NULL, NULL, NULL, NULL, NULL);
```

引入依赖

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

编写配置文件

```properties
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/oauth?characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=root
```

编写数据库信息实现

```java
@Configuration
@EnableAuthorizationServer
public class JdbcAuthorizationServer extends AuthorizationServerConfigurerAdapter {

    private final AuthenticationManager authenticationManager;


    private final PasswordEncoder passwordEncoder;

    private final DataSource dataSource;


    @Autowired
    public JdbcAuthorizationServer(AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, DataSource dataSource) {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.dataSource = dataSource;
    }

    @Bean // 声明TokenStore实现
    public TokenStore tokenStore() {
        return new JdbcTokenStore(dataSource);
    }

    @Bean // 声明 ClientDetails实现
    public ClientDetailsService clientDetails() {
        JdbcClientDetailsService jdbcClientDetailsService = new JdbcClientDetailsService(dataSource);
        jdbcClientDetailsService.setPasswordEncoder(passwordEncoder);
        return jdbcClientDetailsService;
    }

    @Override //配置使用数据库实现
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        endpoints.authenticationManager(authenticationManager);//认证管理器
        endpoints.tokenStore(tokenStore());//配置令牌存储为数据库存储

        // 配置TokenServices参数
        DefaultTokenServices tokenServices = new DefaultTokenServices();//修改默认令牌生成服务
        tokenServices.setTokenStore(endpoints.getTokenStore());//基于数据库令牌生成
        tokenServices.setSupportRefreshToken(true);//是否支持刷新令牌
        tokenServices.setReuseRefreshToken(true);//是否重复使用刷新令牌（直到过期）

        tokenServices.setClientDetailsService(endpoints.getClientDetailsService());//设置客户端信息
        tokenServices.setTokenEnhancer(endpoints.getTokenEnhancer());//用来控制令牌存储增强策略
        //访问令牌的默认有效期（以秒为单位）。过期的令牌为零或负数。
        tokenServices.setAccessTokenValiditySeconds((int) TimeUnit.DAYS.toSeconds(30)); // 30天
        //刷新令牌的有效性（以秒为单位）。如果小于或等于零，则令牌将不会过期
        tokenServices.setRefreshTokenValiditySeconds((int) TimeUnit.DAYS.toSeconds(3)); //3天
        endpoints.tokenServices(tokenServices);//使用配置令牌服务
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.withClientDetails(clientDetails());//使用 jdbc存储
    }
}
```

启动测试,发现数据库中已经存储相关的令牌

![](https://pic.yupi.icu/5563/202311211034418.png)

### 资源服务器搭建

引入依赖

```xml
<properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <spring-boot.version>2.2.5.RELEASE</spring-boot.version>
        <spring-cloud.version>Hoxton.SR9</spring-cloud.version>

    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-oauth2</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-oauth2-resource-server</artifactId>
        </dependency>


        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```

创建资源

```java
@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello(){
        return "hello!";
    }
}
```

编写资源服务器配置类

```java
@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {
    private final DataSource dataSource;
    @Autowired
    public ResourceServerConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    @Override
    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
        resources.tokenStore(tokenStore());
    }
    @Bean
    public TokenStore tokenStore() {
        return new JdbcTokenStore(dataSource);
    }
}
```

编写配置文件

```properties
# 应用服务 WEB 访问端口
server.port=8081
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/security?characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=root
logging.level.org.springframework.jdbc.core=debug
```

启动测试,生成令牌之后带有令牌访问:

```http
curl -H "Authorization:Bearer dffa62d2-1078-457e-8a2b-4bd46fae0f47" http://localhost:8081/hello
```

![](https://pic.yupi.icu/5563/202311211034462.png)

### 授权服务器颁发 JWT 令牌

配置颁发 JWT 令牌

```java
@Configuration
@EnableAuthorizationServer
public class JwtAuthServerConfig extends AuthorizationServerConfigurerAdapter {

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final DataSource dataSource;

    @Autowired
    public JwtAuthServerConfig(PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, DataSource dataSource) {
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.dataSource = dataSource;
    }
    @Override //配置使用 jwt 方式颁发令牌,同时配置 jwt 转换器
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        endpoints.tokenStore(tokenStore())
                .accessTokenConverter(jwtAccessTokenConverter())
                .authenticationManager(authenticationManager);
    }
    @Bean//使用JWT方式生成令牌
    public TokenStore tokenStore() {
        return new JwtTokenStore(jwtAccessTokenConverter());
    }
    @Bean//使用同一个密钥来编码 JWT 中的  OAuth2 令牌
    public JwtAccessTokenConverter jwtAccessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setSigningKey("123");//可以采用属性注入方式 生产中建议加密
        return converter;
    }
    @Bean // 声明 ClientDetails实现
    public ClientDetailsService clientDetails() {
        JdbcClientDetailsService jdbcClientDetailsService = new JdbcClientDetailsService(dataSource);
        jdbcClientDetailsService.setPasswordEncoder(passwordEncoder);
        return jdbcClientDetailsService;
    }
    @Override//使用数据库方式客户端存储
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.withClientDetails(clientDetails());
    }
}
```

启动服务,根据授权码获取令牌

![](https://pic.yupi.icu/5563/202311211034556.png)

![image-20231120114040975](https://pic.yupi.icu/5563/202311211034989.png)

### 使用 JWT 令牌资源服务器

配置资源服务器解析jwt

```java
@Configuration
@EnableResourceServer
public class JwtResourceServerConfig extends ResourceServerConfigurerAdapter {
    @Override
    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
        resources.tokenStore(tokenStore());
    }
    @Bean
    public TokenStore tokenStore() {
        return new JwtTokenStore(jwtAccessTokenConverter());
    }
    @Bean
    public JwtAccessTokenConverter jwtAccessTokenConverter() {
        JwtAccessTokenConverter jwtAccessTokenConverter = new JwtAccessTokenConverter();
        jwtAccessTokenConverter.setSigningKey("123");
        return jwtAccessTokenConverter;
    }
}
```

启动测试,通过 jwt 令牌访问资源

```http
curl -H "Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjAzMzM4MjgsInVzZXJfbmFtZSI6InJvb3QiLCJhdXRob3JpdGllcyI6WyJST0xFX0FETUlOIl0sImp0aSI6ImJmZGVjMzg1LWQyYmYtNDc5Yi05YjhhLTgyZWE4YTRkNzgzMyIsImNsaWVudF9pZCI6ImNsaWVudCIsInNjb3BlIjpbImFwcDpyZWFkIl19.QlELW7LMLuD4OghbEFFzJpIxjW80hC3WHd3I0PiuI7Y" http://localhost:8081/hello
```

![](https://pic.yupi.icu/5563/202311211034551.png)