# Bug 解决  无法正常登录或获取不到用户信息

> 程序员鱼皮的编程宝典：https://codefather.cn/



我相信登录这个功能是很多同学做项目时候遇到第一个槛！



看起来好像很简单的登录功能，实际上还是有点坑的，比如明明账号密码都填写正确了，为什么登录后请求接口又说我没登录？为什么我登录成功跳转了页面却拿不到用户信息？



这篇文章，我列举常见的几种情况和解决方案，供大家参考。



### 跨域问题

这个问题是最最最常见的！很多同学就是被**跨域**这个崽子给绊了一道！



报错 like this

![](https://pic.yupi.icu/5563/202404161538667.png)



所谓的跨域指的是：比如前端的域名是 aaa.com，访问后端服务域名 bbb.com，此时的行为就是跨域。



更学院派的描述就是：**在****不同域（域名、协议、端口号任何一个不同）之间进行通信时，就是跨域**。



注意哦，是域名、协议、端口号任何一个！协议包括 http 和 https 的区别！



实际上**跨域**是浏览器的限制，它是出于安全考虑阻止这种行为，这种安全策略称为同源策略（Same-Origin Policy），没错它是好心的，但是确实因为它伤害了很多刚入门的同学心。



![](https://pic.yupi.icu/5563/202404161538693.jpeg)



**那跨域问题和登录有什么关系呢？**



实际上我们很多登录场景都得用到 cookie，比如我们把 session 存在 cookie 里面或者把 token 存 cookie 里，这存的不就是我们的用户凭证信息吗？



而 cookie 是跟域名走的！根据同源策略，不同域名之间的 cookie 是不通的，这一举措是为了确保网站的敏感数据不会被其他域名的网站恶意获取。



所以不同域之间的 cookie 不互通，导致登录的用户凭证信息不互通，导致前端请求后端的时候无法带上用户凭证，或者后端回种用户凭证的时候前端拿不到。



综上使得大家登录失效！无法获取用户信息！



**那怎么解决这个问题呢？**

1）保持域名一致

这个应该很好理解，既然浏览器限制不同域之间的信息不互通，那么我们在一个域下操作就好了。

可以让前端和后端接口域名保持一致，用 Nginx 进行端口转发。



2）后端设置

后端有跨域的配置，指定允许跨域的域名，这样浏览器就知道了这个源是被允许的，大家就可以友好的互通了！

比如我后端的域名是 `bbb.com`，此时我允许 `aaa.com` 来调用我，那么就可以这样配置：

```java
@Configuration
public class CorsConfig {

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // 填写前端域名
        config.addAllowedOrigin("http://aaa.com");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
```



或者只是某个 Controller 上需要配置跨域：

```java
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://aaa.com")
public class MyController {
    // 控制器方法
}
```



或者只是 Controller 上的某个方法需要配置：

```java
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    @GetMapping("/data")
    @CrossOrigin(origins = "http://aaa.com")
    public String getData() {
        // 处理方法
        return "Data";
    }
}
```



然后再贴一下常用的这个注解的相关属性的含义：

- origins：允许的来源域，可以是一个字符串数组。
- methods：允许的 HTTP 方法，如 GET、POST 等。
- allowedHeaders：允许的请求头。
- exposedHeaders：暴露给浏览器的响应头。
- allowCredentials：是否允许发送身份验证信息（如 Cookie）。
- maxAge：预检请求的有效期。

如果项目里用了`@CrossOrigin`注解还是报错，可以试试在后端的 `@CrossOrigin` 注解加 `allowCredentials="true"`。

![](https://pic.yupi.icu/5563/202404161538756.png)

### 后端代码问题

如果我们确认没有跨域问题，那么就得看看是不是代码层面的bug了。



首先我们得怀疑后端的逻辑，确保我们正常的返回了用户凭证或者一些用户信息。



比如通过 F12 确认后端登录接口是否正常返回数据，通过控制台或者服务器查看日志，看看登录接口被调用时是否有报错，有时候可能是因为报错被 `try catch` 导致没有异常信息等等。



### 前端代码问题

确定没有跨域问题，且后端接口正常返回用户信息后，此时我们需要把怀疑的目光转向前端代码逻辑！



1）正常登录后发现获取不到用户的信息？

可能是前端的用户数据取值和后端返回数据结构不匹配，可以看下这篇文章：

[https://www.codefather.cn/post/1815827664607383554](https://www.codefather.cn/post/1815827664607383554)



2）点击一个页面，发现登录态竟然失效了？

可能就是前端在请求时没有带上 cookie，需要在 requestConfig.ts 中添加上`withCredentials: true`。



![](https://pic.yupi.icu/5563/202404161538684.png)



3）app.ts 里配置的是 localhost，用 127.0.0.1 来访问就带不上用户信息？

因为这样 cookie 就种不上，改成 127.0.0.1 即可。