# 基于 Redis 实现短信登录

> 作者：[寒月](https://wx.zsxq.com/dweb2/index/footprint/818288821184212)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 11102

使用redis实现短信登录

目录

一、设计Key的结构

二、访问流程

三、代码实现

# 一、设计Key的结构

首先我们要思考一下利用redis来存储数据，那么到底使用哪种结构呢？由于存入的数据比较简单，我们可以考虑使用String，或者是使用哈希，如下图，如果使用String，同学们注意他的value，要多占用一点空间，如果使用哈希，则他的value中只会存储他数据本身，如果不是特别在意内存，其实使用String就可以啦。

我们可以使用String结构，就是一个简单的key，value键值对的方式，但是关于key的处理，session他是每个用户都有自己的session，但是redis的key是共享的，咱们就不能使用code了

> 在设计这个key的时候，我们之前讲过需要满足两点
>
> 1、key要具有唯一性
>
> 2、key要方便携带

如果我们采用phone：手机号这个的数据来存储当然是可以的，但是如果把这样的敏感数据存储到redis中并且从页面中带过来毕竟不太合适，所以我们在后台生成一个随机串token，然后让前端带来这个token就能完成我们的整体逻辑了

# 二、访问流程

当注册完成后，用户去登录会去校验用户提交的手机号和验证码，是否一致，如果一致，则根据手机号查询用户信息，不存在则新建，最后将用户数据保存到redis，并且生成token作为redis的key，当我们校验用户是否登录时，会去携带着token进行访问，从redis中取出token对应的value，判断是否存在这个数据，如果没有则拦截，如果存在则将其保存

三、代码实现 先加入配置

```nestedtext
spring:
   redis:
     host: xxxxxxxx
     port: xxx
     password: xxxxx
     lettuce:
       pool:
         max-active: 10
         max-idle: 10
         min-idle: 1
         time-between-eviction-runs: 10s
```

## 1、存储验证码

 

```java
public static final String LOGIN_CODE_KEY = "login:code:";
   public static final Long LOGIN_CODE_TTL = 2L;
```

修改service层sendcode方法

 

```armasm
//声明常量后
 stringRedisTemplate.opsForValue().set(LOGIN_CODE_KEY+phone,code,LOGIN_CODE_TTL, TimeUnit.MINUTES);
```

所以这里修改成redis登录后发送验证码这块还是比较简单的

### 1）controller层

```reasonml
@GetMapping("/code")
     public Result SendCode(String phone, HttpSession session) {
         //1、校验手机号是否合法
         if (!RegexUtils.isPhoneInvalid(phone)) {
             return Result.fail("验证码格式异常");
         }
         String code = userService.sendCode(phone, session);
         //Object code1 = session.getAttribute("code");
         return Result.ok(code);
     }
```

### 2）service层

```reasonml
@Override
     public String sendCode(String phone, HttpSession session) {
         //1、校验手机号是否合法
         if (!RegexUtils.isPhoneInvalid(phone)) {
             return "手机号格式异常";
         }
         //2、生成随机验证吗
         String code = RandomUtil.randomNumbers(6);
         //4、保存验证码到redis
         //设置key有效期2分钟
         stringRedisTemplate.opsForValue()
                 .set(LOGIN_CODE_KEY+phone,code,LOGIN_CODE_TTL, TimeUnit.MINUTES);
         //4、打印日志
         log.debug("发送短信验证码成功，验证码:{}", code);
         //前端控制台输出
         return "验证码发送成功:"+code;
     }
```

可以看到返回后的结果

redis中

![](https://pic.yupi.icu/5563/202311230843708.png)

### 3）新建结果返回类

这里的方法返回值有些我改成了Result，因为我发现这个全局统一框架的这个依赖还是不太好用，只对请求成功时的结果进行返回，而出现异常或为null的情况，前端不会有任何反馈

 

```reasonml
@Override
     public String sendCode(String phone, HttpSession session) {
         //1、校验手机号是否合法
         if (!RegexUtils.isPhoneInvalid(phone)) {
             return "手机号格式异常";
         }
         //2、生成随机验证吗
         String code = RandomUtil.randomNumbers(6);
         //4、保存验证码到redis
         //设置key有效期2分钟
         stringRedisTemplate.opsForValue()
                 .set(LOGIN_CODE_KEY+phone,code,LOGIN_CODE_TTL, TimeUnit.MINUTES);
         //4、打印日志
         log.debug("发送短信验证码成功，验证码:{}", code);
         //前端控制台输出
         return "验证码发送成功:"+code;
     }
```

前端返回

## 2、登录校验

> 我的登录逻辑：

-> 校验用户登录态——先从缓存中获取Key，判断用户是否曾登陆过

```gams
Set<Object> cacheKey = stringRedisTemplate.
    opsForHash().keys(LOGIN_USER_KEY + phone);
```

- > 登陆过——直接根据cacheKey获取用户信息

- > 未曾登陆过——这里分成两种情况

- > 一：用户为新用户，数据库中不存在

- > 二、用户登陆过，但缓存失效了

> 对于这种情况，从数据库中查询用户是否存在， 这里我们就可以开始校验验证码了，这里就直接说通过了

1. > 存在，我们就只需要进行登录操作，直接将从数据库中查询出的用户信息存到缓存中就OK了

2. > 不存在，就进行注册操作，创建新用户，将新用户信息存储到数据库和redis中

> 整个逻辑过程就是这样 修改login方法

定义常量  

```java
    public static final String LOGIN_USER_KEY = "login:token:";
     public static final Long LOGIN_USER_TTL = 30L;
```

### 1）service层实现

```dart
    @Override
     public UserDTO Login(LoginFormDTO loginFormDTO, HttpSession session){
         //首先校验手机号和验证码是否合法
         String phone = loginFormDTO.getPhone();
         if(!RegexUtils.isPhoneInvalid(phone)){
             return null;
         }
         Set<Object> cacheKey = stringRedisTemplate.opsForHash()
             .keys(LOGIN_USER_KEY + phone);
         //基于token获取redis中的用户
         String tokenkey=LOGIN_USER_KEY + phone;
         if (cacheKey ==null||!cacheKey.contains(tokenkey)) {
             //校验验证码
             //Object cachecode = session.getAttribute("code");
             String cachecode = stringRedisTemplate.opsForValue().get(LOGIN_CODE_KEY + phone);
 
             String dtoCode = loginFormDTO.getCode();
             if (dtoCode==null||!dtoCode.equals(cachecode)) {
                 return null;
             }
             //根据手机号查询用户信息
             QueryWrapper<User> queryWrapper=new QueryWrapper<User>();
             queryWrapper.eq("phone", phone);
             //根据查询条件查询数据库中满足以上条件的用户
             User user = userMapper.selectOne(queryWrapper);
             if (user==null) {
                 //创建用户
                 user=CreateUser(phone);
             }
             //脱敏
 
             //保存用户信息到redis中
             /**
              * 保存用户信息到redis中
              * 1)随机生成token作为登陆令牌
              * 2)将user对象转为hash存储
              * 3)存储
              */
 
             //将user对象转为hash存储
             /**
              * copyProperties:属性拷贝——把user中的属性字动拷贝到UserDTO中
              * BeanUtils:使用的是包cn.hutool.core.bean下的工具类
              */
             UserDTO userDTO = BeanUtil.copyProperties(user, UserDTO.class);
             if (userDTO==null) {
                 return null;
             }else {
                 Map<String, Object> userMap = BeanUtil.beanToMap(userDTO,new HashMap<>(),
                         CopyOptions.create()
                                 .setIgnoreNullValue(true)
                                 .setFieldValueEditor((fieldName,fieldValue)->fieldValue.toString()));
                 //存储redis中
                 //String tokenkey = LOGIN_USER_KEY + loginFormDTO.getPhone();
                 stringRedisTemplate.opsForHash().putAll(tokenkey,userMap);
                 //设置token有效期——半个小时
                 stringRedisTemplate.expire(tokenkey,LOGIN_USER_TTL, TimeUnit.MINUTES);
             }
 
             return userDTO;
         }
 
         Map<Object, Object> userMap = stringRedisTemplate.opsForHash().entries(tokenkey);
         //将查询到的hash数据转为userDTO对象
         UserDTO cacheuser = BeanUtil.fillBeanWithMap(userMap, new UserDTO(), false);
         return cacheuser;
     }
```

代码解析：

**我的用户信息是以map形式存储的，所以这里获取这个key,需要先获取到手机号**

```gams
    Set<Object> cacheKey = stringRedisTemplate.opsForHash()
             .keys(LOGIN_USER_KEY + phone);
```

**为什么是以手机号的信息作为key而不是随机的token呢？** 因为token我不知道怎么弄？😂😂😂， 原本是以UUID作为令牌存储用户信息到redis

```reasonml
    String token = UUID.randomUUID().toString(true);
```

但遇到一些问题

> 这个标识是随机生成的，意味着这里只要是存在用户信息，缓存中的token是唯一的
>
> 但是如果我要再次登录，它要与redis中的token进行比对，而因为我的token也是随机的，那么两个token必定会不同，这时候若是成功存储，那么缓存中就会存在两个key，而这两个key所存储的信息又是相同的，这就不行了
>
> 我试了很久，但还是失败，最后退一步，还是以手机号作为key的用户信息表示

可以轻易获取，也更容易区分用户，缺点：信息泄露

根据tokenkey以entries方法获取到用户信息，并将这个以map形式存储的用户信息转成java对象，使用fillBeanWithMap方法  

```coffeescript
    Map<Object, Object> userMap = stringRedisTemplate.opsForHash().entries(tokenkey);
```

//5、将查询到的hash数据转为userDTO对象

```reasonml
    UserDTO cacheuser = BeanUtil.fillBeanWithMap(userMap, new UserDTO(), false);
```

设置token时间：如果时间超过了30分钟，redis就会把你的登录剔除

设置Redis中token的有效期，你可以使用Redis的EXPIRE命令

 //设置token有效期——半个小时  

```angelscript
    stringRedisTemplate.expire
     (tokenkey,LOGIN_USER_TTL, TimeUnit.MINUTES);
```

将tokenKey和用户信息以map集合形式存储redis中  

```reasonml
    stringRedisTemplate.opsForHash().putAll(tokenkey,userMap);
```

- opsForHash() 方法返回一个 HashOperations 对象，它提供了对 Redis 哈希表数据结构的操作方法。
- putAll() 方法用于将一个 Map 中的所有键值对存储到 Redis 的哈希表中。在这里，它将整个 userMap 存储到 Redis 中，其中的键是 tokenkey。

### 2）创建用户

这里还要注意：

创建用户的方法，这里的三个信息字段不能为空，不然会报错

```reasonml
    private User CreateUser(String phone) {
         User user = new User();
         user.setPhone(phone);
         user.setNickName(USER_NICK_NAME_PREFIX+RandomUtil.randomString(10));
         user.setIcon(LOGON_USER_ICON);
         //保存用户
         save(user);
         return user;
     }
```

因为不知道怎么获取随机头像，所以这里搞了一个默认头像

### 3）redis常量类

```java
    public class RedisContants {
     public static final String LOGIN_CODE_KEY = "login:code:";
     //验证码保存时间2分钟
     public static final Long LOGIN_CODE_TTL = 2L;
     public static final String LOGIN_USER_KEY = "login:token:";
     //token保存时间30分钟
     public static final Long LOGIN_USER_TTL = 30L;
 
     public static final String USER_NICK_NAME_PREFIX = "user_";
 
     public static final String LOGON_USER_ICON="https://www.kdy.icu/images/touxiang.jpg";
 
 }
```

### 4）Controller层

注解‘@NoRestFulApi可以解除那个依赖的封装，使用我自定义的结果处理类Result

```kotlin
    @PostMapping("/login")
     @NoRestFulApi
     public Result login(LoginFormDTO loginFormDTO, HttpSession session) {
         //1、首先校验手机号和验证码是否合法
         String phone = loginFormDTO.getPhone();
         if(!RegexUtils.isPhoneInvalid(phone)){
             return Result.fail("手机号格式异常！");
         }
         //2、校验验证码
         //Object cachecode = session.getAttribute("code");
         String cachecode = stringRedisTemplate.opsForValue().get(LOGIN_CODE_KEY + phone);
 
         String dtoCode = loginFormDTO.getCode();
         if (dtoCode==null||!dtoCode.equals(cachecode)) {
             return Result.fail("验证码不正确，请重新输入！");
         }
         UserDTO login = userService.Login(loginFormDTO, session);
         if (login==null) {
             return Result.fail("用户信息不存在！");
         }
         return Result.ok(login);
     }
```

## 3、测试

我新建一个用户

![](https://pic.yupi.icu/5563/202311230843181.png)

可以看到用户创建成功，并且在redis中也存储了用户信息

![](https://pic.yupi.icu/5563/202311230843756.png) 下面我再次发送验证码，观察会不会出现用户信息重复

![](https://pic.yupi.icu/5563/202311230843104.png)

可以看到用户信息并未重复

![](https://pic.yupi.icu/5563/202311230843155.png)

基于redis的短信登录就此结束！！

说说我遇到的问题：

- 逻辑不清晰就开始写代码，然后不断的报错，不断的debug，最后发现逻辑有问题，重新思考逻辑。
- 被对方的思路带偏。重构复盘的目的是理解，形成自己的一套逻辑，而不是被别人牵着鼻子走。同一个功能可以实现的方法不止一种，而自己思考出来的，至少理解更透彻。
- redis基础不牢固，在 获取Key值和user对象存储输出这里我花了很多时间。 因为这个功能是黑马点评中的功能之一，而这个功能又和其他的地方有一些联系，其中涉及到其他的一些知识，我还不是特别清楚。比如说登录拦截器，我这里就没有用到。为什么我不用，因为对于它的思路我并不是特别理解，

照搬的话，就不符合我自己思考的这个初衷，必须得是自己的东西！而不是从别人那里复制来的又不懂什么意思的代码。

所以以我自己的思路，我将基于Redis用户短信登录的整个流程进行了剖析。