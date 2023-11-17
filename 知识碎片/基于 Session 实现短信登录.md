# 基于 Session 实现短信登录

> 作者：[寒月](https://wx.zsxq.com/dweb2/index/footprint/818288821184212)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 11102

## 短信验证

## 一、基于session

### 1、登录流程

#### 1）发送验证码

用户在提交手机号后，会校验手机号是否合法，如果不合法，则要求用户重新输入手机号

如果手机号合法，后台此时生成对应的验证码，同时将验证码进行保存，然后再通过短信的方式将验证码发送给用户

#### 2）短信验证码登录、注册

> 用户将验证码和手机号进行输入，
>
> 后台从session中拿到当前验证码，然后和用户输入的验证码进行校验，
>
> 如果不一致，则无法通过校验，
>
> 如果一致，则后台根据手机号查询用户，
>
> 如果用户不存在，则为用户创建账号信息，保存到数据库。
>
> 无论是否存在，都会将用户信息保存到session中，方便后续获得当前登录信息

### 2、实现验证码发送

使用MyBatisX实现项目的初始化

#### 1）正则表达式类

分别对手机号、密码、验证码进行校验

正则表达式可以去网上找

```java
public class RegexPatterns {
    /**
     * 手机号正则
     */
    public static final String PHONE_REGEX="1\\d{10}";
    /**
     * 邮箱正则
     */
    public static final String EMAIL_REGEX="/^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$/";
    /**
     * 验证码正则
     */
    public static final String VERIFY_CODE_REGEX="^[a-zA-Z\\d]{6}$";

}
```

#### 2）正则校验工具类

controller传入的手机号进行校验

**满足手机号正则表达式，手机号11位，并且只能为数字，才能校验通过**

官网：https://doc.hutool.cn/pages/index/#📚简介

```java
public class RegexUtils {

    /**
     * 校验手机号是否合法
     * @param phone
     * @return
     */
    public static boolean isPhoneInvalid(String phone){
        boolean matches = phone.matches(RegexPatterns.PHONE_REGEX);
        return matches;
    }

    /**
     * 校验验证码是否合法
     * @param code
     * @return
     */
    public boolean isCodeInvalid(String code){
        boolean matches = code.matches(RegexPatterns.VERIFY_CODE_REGEX);
        return matches;
    }
}
```

#### 3）Controller层

```java
@GetMapping("/code")
    public boolean SendCode(String phone, HttpSession session){
        boolean b = userService.sendCode(phone, session);
        return b;
    }
```

#### 4）service层

> 首先对传入的手机号放到正则校验工具类中校验
>
> 校验成功后生成验证码
>
> 将验证码存入session中
>
> 将验证码在控制台以debug形式输出

```java
@Resource
private UserService userService;

public boolean sendCode(String phone, HttpSession session) {
    //1、校验手机号是否合法
    if (!RegexUtils.isPhoneInvalid(phone)) {
        return false;
    }
    //2、生成随机验证吗
    String code = RandomUtil.randomNumbers(6);
    //3、保存验证码
    session.setAttribute("code",code);
    //4、打印日志
    log.debug("发送短信验证码成功，验证码:{}",code);
    return true;
}
```

注意：这里需要开启debug日志

controller层中加入`@Slf4j`注解

```yaml
logging:
  level:
    com.example: debug
# 开启debug日志
```

结果：

![image-20231113221001496](https://pic.yupi.icu/5563/202311132210539.png) 

### 3、实现验证码登录注册

> 短信验证登录注册逻辑：
>
> - 校验手机号
> - 校验验证码
>   - 取出session中保存的验证码与表单中的输入的验证码吗进行比较
> - 不一致：报错
> - 一致：根据手机号查询用户
> - 判断用户是否存在
> - 不存在，根据手机号创建新用户并保存
>   - 用户是凭空创建的，所以密码可以没有，
>   - 用户呢称和头像都是随机默认的
> - 保存用户信息到session中

#### 1）Controller层

我们登录需要获取两个参数

用户名和手机号，根据手机号来创建用户名

```java
@PostMapping("/login")
    public boolean login(LoginFormDTO loginFormDTO, HttpSession session){
        boolean login = userService.Login(loginFormDTO, session);
        return login;
    }
```

为了使代码更加美观，创建一个参数封装类

```java
/**
 * 用户登录请求参数封装类
 */
@Data
public class LoginFormDTO {
    private String code;
    private String phone;
}
```

#### 2）servcie层

```java
  /**
     * 用户登录
     * @param loginFormDTO
     * @param session
     * @return
     */
    @Override
    public boolean Login(LoginFormDTO loginFormDTO, HttpSession session) {
        //1、首先校验手机号和验证码是否合法
        String phone = loginFormDTO.getPhone();
        if(!RegexUtils.isPhoneInvalid(phone)){
            return false;
        }
        //2、校验验证码
        Object cachecode = session.getAttribute("code");
        String dtoCode = loginFormDTO.getCode();
        if (dtoCode==null&&!dtoCode.equals(cachecode)) {
            return false;
        }
        //3、根据手机号查询用户信息
        QueryWrapper<User> queryWrapper=new QueryWrapper<User>();
        queryWrapper.eq("phone", phone);
        //4、根据查询条件查询数据库中满足以上条件的用户
        User user = userMapper.selectOne(queryWrapper);
        if (user==null) {
            //创建用户
            user=CreateUser(phone);
        }
        //5、保存用户信息到session中
        session.setAttribute("user",user);
        return true;
    }
```

将创建用户的这段代码单独封装为一个函数，

```java
    /**
     * 创建用户
     * @param phone
     * @return
     */
    private User CreateUser(String phone){
        User user = new User();
        user.setPhone(phone);
        user.setNickName(RandomUtil.randomString(10));
        //保存用户
        save(user);
        return user;
    }
```

发送验证码

```http
get  http://localhost:8080/api/user/code?phone=13177576913
```

校验验证码并登录

```http
post http://localhost:8080/api/user/login?phone=13177576913
&code=686422
```

运行结果：

![image-20231113221016387](https://pic.yupi.icu/5563/202311132210441.png) 

### 4、优化一：全局通用返回对象

前面我的测试前端返回的数据都太过单调，因为这是一个功能的实现，并不是做一个完整的项目，但这样看起来确实不太美观

所以这里使用==全局统一API响应框架==对整个接口进行统一的异常处理封装，这样就不需要写那么多的异常处理类了。

#### 1）引入依赖

使用`rest-api-spring-boot-starter`这个依赖，不用打开Redis，但这个依赖需要加上

```xml
<!--RestfulAPI-->
<dependency>
    <groupId>cn.soboys</groupId>
    <artifactId>rest-api-spring-boot-starter</artifactId>
    <version>1.3.0</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

#### 2）注解

启动类上加上这个注解

```java
@EnableRestFullApi
```

就只需要这两步

LOO日志都不一样了，

![image-20231113221026866](https://pic.yupi.icu/5563/202311132210923.png)

> 注意：
>
> 这里的端口号是8000，也就是说使用这个依赖必须要8000端口，我们在配置文件中所
>
> 设置的web端口没有用了，无法自定义端口

 运行 

![image-20231113221036873](https://pic.yupi.icu/5563/202311132210918.png) 

我们先进行用户脱敏

#### 3）用户信息脱敏

将返回对象单独封装

```java
@Data
public class UserDTO {
    private Long id;
    private String nickName;
    private String icon;
}
```

修改登录`login`方法中的

```java
/**
     * copyProperties:属性拷贝——把user中的属性字动拷贝到UserDTO中
     * BeanUtils:使用的是包cn.hutool.core.bean下的工具类
     */
//5、保存用户信息到session中
UserDTO userDTO = BeanUtil.copyProperties(user, UserDTO.class);
session.setAttribute("user", userDTO);
```

结果这里就不说了，成功返回三个信息

![image-20231113221138256](https://pic.yupi.icu/5563/202311132211296.png)