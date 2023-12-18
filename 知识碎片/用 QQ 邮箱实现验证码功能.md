# 用 QQ 邮箱实现验证码功能

> 作者：[观止](https://blog.csdn.net/m0_66570338).，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 6872

> 引入QQ邮箱发送验证码进行安全校验

在我们进行登录注册等等敏感操作时，为了保证用户信息的安全性，常常会碰到需要接收手机短信验证码进行验证的场景，虽然它的安全系数相对较高，但是引入手机验证码使用需要进行付费，显然不适合我们个人项目的学习，于是我们可以尝试使用各大平台的提供的邮件服务进行安全校验，步骤基本一致，本处我们采用QQ邮箱进行演示。

## 一.需求分析

- 场景：用户输入自己的邮箱，点击获取验证码，后台会发送一封邮件到对应邮箱中。
- 分析：防止刷爆邮箱，可以限制一分钟内只能获取一次。
  - 前端：期限内禁用button按钮。
  - 后端：存入redis设置过期时间，请求先判断redis中是否有数据。

## 二.环境准备

### (1) 邮箱环境

> 在QQ邮箱中开启SMTP服务，获取授权码(主要步骤，后端操作各平台邮箱基本一致)

1. 网页版：进入邮箱，点击设置中的账户

![](https://pic.yupi.icu/5563/202312171825796.png)

1. 往下翻可以看到如下服务开关，点击开启

![](https://pic.yupi.icu/5563/202312171825801.png)

点击开启后会得到一串授权码，后端程序中需要用到。

1. 可能会要求完成相关安全验证

![](https://pic.yupi.icu/5563/202312171825788.png)

### (2) 后端环境

> 大概率是在web项目中使用到，因此我们创建一个SpringBoot工程

1. 创建好项目后在pom文件中导入操作邮箱所需jar包

```xml
        <!--QQ邮箱验证码所需jar包-->
        <dependency>
            <groupId>javax.activation</groupId>
            <artifactId>activation</artifactId>
            <version>1.1.1</version>
        </dependency>

        <dependency>
            <groupId>javax.mail</groupId>
            <artifactId>mail</artifactId>
            <version>1.4.7</version>
        </dependency>

        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-email</artifactId>
            <version>1.4</version>
        </dependency>
```

1. 由于我们需要在spring项目使用redis缓存验证码,在一定程度上保障接口安全性,因此还要导入redis的jar包

```xml
   <!--     使用redis缓存验证码时效-->
         <dependency>
             <groupId>org.springframework.boot</groupId>
             <artifactId>spring-boot-starter-data-redis</artifactId>
         </dependency>
```

1. 在yml文件中配置redis,设置了redis密码需要加上密码配置,否则可以不加

```yaml
spring:
  redis:
    # redis数据库索引(默认为0)，我们使用索引为3的数据库，避免和其他数据库冲突
    database: 3
    # redis服务器地址（默认为localhost）
    host: localhost
    # redis端口（默认为6379）
    port: 6379
```

## 三.后端程序

### (1) 效果实现

1. 发送邮箱应该算个工具，因此我们可以在工具类中写入如下代码

```java
package com.example.utils;

import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;


public class SendMailUtil {

    /**
     * 发送邮件代码
     *
     * @param targetEmail 目标用户邮箱
     * @param authCode    发送的验证码
     */
    public static void sendEmailCode(String targetEmail, String authCode) {
        try {
            // 创建邮箱对象
            SimpleEmail mail = new SimpleEmail();
            // 设置发送邮件的服务器
            mail.setHostName("smtp.qq.com");
            // "你的邮箱号"+ "上文开启SMTP获得的授权码"
            mail.setAuthentication("158xxx69@qq.com", "fbsxxxxxsijdj");
            // 发送邮件 "你的邮箱号"+"发送时用的昵称"
            mail.setFrom("15xxx69@qq.com", "观止");
            // 使用安全链接
            mail.setSSLOnConnect(true);
            // 接收用户的邮箱
            mail.addTo(targetEmail);
            // 邮件的主题(标题)
            mail.setSubject("注册验证码");
            // 邮件的内容
            mail.setMsg("您的验证码为:" + authCode+"(一分钟内有效)");
            // 发送
            mail.send();
        } catch (EmailException e) {
            e.printStackTrace();
        }
    }
}
```

1. 编写如下接口

```java
@RestController
public class SendMail {

    @PostMapping("/getCode")
    @ResponseBody
    public String mail(@RequestParam("targetEmail") String targetEmail) {
        // 随机生成六位数验证码
        String authCode = String.valueOf(new Random().nextInt(899999) + 100000);
        SendMailUtil.sendEmailCode(targetEmail,authCode);
        return "ok";
    }
}
```

1. 让我们测试一下接口

```http
GET http://localhost:8080/getCode?targetEmail=35xxxx947@qq.com
```

可以看到如下效果：

![](https://pic.yupi.icu/5563/202312171825817.png)

如此我们初步效果就已经实现啦~

### (3) 缓存改进

上述程序我们疯狂发送请求可以一直发送邮箱，这显然不是我们所期待的，接下来我们加入redis来改进一下。

```java
@RestController
public class SendMail {
    @Resource
    private RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();

    /**
     * @param targetEmail 用户邮箱
     * @return
     */
    @GetMapping("/getCode")
    @ResponseBody
    public String mail(@RequestParam("targetEmail") String targetEmail) {
        // 发送前先看下我们是否已经缓存了验证码
        String yzm = redisTemplate.opsForValue().get("yzm");
        // 判断是否存在
        if (yzm == null){
            // 生成六位数验证码
            int authNum = new Random().nextInt(899999) + 100000;
            String authCode = String.valueOf(authNum);
            // 不存在，我们发送邮箱给用户
            SendMailUtil.sendEmailCode(targetEmail, "你的验证码为:" + authCode + "(五分钟内有效)");
            // 存入redis中，设置有效期为1分钟
            redisTemplate.opsForValue().set("yzm", authCode, 1, TimeUnit.MINUTES);
            return "发送成功";
        }
        // 存在，直接返回，不再发送邮箱~
        return "请勿重复发送验证码";
    }
   }
```

如此再次测试，可以发现疯狂点击不再产生效果，成功被拦截，如此安全了许多

![](https://pic.yupi.icu/5563/202312171825811.png)

至此我们开始想要的效果便已经在小demo中实现了，接下来可以引入正式自己项目啦

## 四.线上部署问题

> 按上述代码本地运行正常，但部署到线上环境如果产生如下错误:

```java
1.Sending the email to the following server failed : smtp.163.com:465
2.Could not connect to SMTP host: smtp.163.com, port: 465
3.No appropriate protocol (protocol is disabled or cipher suites are inappropriate)
```

原因：阿里云等服务器厂商禁用了默认的25端口，我们需要使用例如465等可用端口发送邮件并开启ssl连接，并进行如下相关配置即可，最后在服务器防火墙开放对应窗口即可。

```java
/**
 * 验证获取操作安全证书
 */
public class CheckCodeUtils {


    /**
     * 发送邮件代码
     *
     * @param targetEmail 目标用户邮箱
     * @param authCode    发送的验证码
     */
    public static String GetEmailCode(String targetEmail, String authCode) {
        try {
            // 创建邮箱对象
            SimpleEmail mail = new SimpleEmail();
            // 设置发送邮件的服务器
            mail.setHostName("smtp.qq.com");
            // "你的邮箱号"+ "上文开启SMTP获得的授权码"
            mail.setAuthentication("fsp1xxxx@qq.com", "GHNUxxxxxVL");
            // 发送邮件 "你的邮箱号"+"发送时用的昵称"
            mail.setFrom("fsp15xxx@qq.com", "伙伴匹配系统");
            // 发送服务端口
            mail.setSslSmtpPort(String.valueOf(465));
            // 使用安全链接
            mail.setSSLOnConnect(true);
            System.setProperty("mail.smtp.ssl.enable", "true");
            System.setProperty("mail.smtp.ssl.protocols", "TLSv1.2");
            // 接收用户的邮箱
            mail.addTo(targetEmail);
            // 邮件的主题(标题)
            mail.setSubject("注册验证码");
            // 邮件的内容
            mail.setMsg("【伙伴匹配系统】您的验证码为:" + authCode + "(5分钟内有效)");
            // 发送
            mail.send();
            return "发送成功,请注意查收";
        } catch (EmailException e) {
            return e.getMessage();
        }
    }
}
```

## 五.前端(补充)

用原生js简单写了一个界面，感兴趣的可以看一看

![](https://pic.yupi.icu/5563/202312171825762.png)

代码如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div>
    <input id="mail" type="text">
    <button id="getCode">获取验证码</button>
</div>
<script>

    /*按钮禁用60秒,并显示倒计时*/
    function disabledButton() {
        const getCode = document.querySelector("#getCode")
        getCode.disabled = true
        let second = 60;
        const intervalObj = setInterval(function () {
            getCode.innerText = "请" + second + "秒后再重试"
            if (second === 0) {
                getCode.innerText = "获取验证码"
                getCode.disabled = false
                clearInterval(intervalObj);
            }
            second--;
        }, 1000);
    }
    
    document.querySelector("#getCode").addEventListener('click', function () {
        const mail = document.querySelector("#mail")
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:8080/getCode?targetEmail=" + mail.value, true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                alert(xhr.response);
                disabledButton()
            }
        }
    })

</script>
</body>
</html>
```