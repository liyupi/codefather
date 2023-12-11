# 基于自定义注解的 Redisson 分布式锁实现

> 作者：[are you ok?](https://blog.csdn.net/weixin_43811294)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 589

## 前言

在项目中，经常需要使用`Redisson`分布式锁来保证并发操作的安全性。在未引入基于注解的分布式锁之前，我们需要手动编写获取锁、判断锁、释放锁的逻辑，导致代码重复且冗长。为了简化这一过程，我们引入了基于注解的分布式锁，通过一个注解就可以实现获取锁、判断锁、处理完成后释放锁的逻辑。这样可以大大简化代码，提高开发效率。

## 目标

使用`@DistributedLock`即可实现获取锁，判断锁，处理完成后释放锁的逻辑。

```java
@RestController
public class HelloController {

  @DistributedLock
  @GetMapping("/helloWorld")
  public void helloWorld() throws InterruptedException {
    System.out.println("helloWorld");
    Thread.sleep(100000);
  }
}
```

## 涉及知识

- SpringBoot
- Spring AOP
- Redisson
- 自定义注解
- 统一异常处理
- SpEL表达式

## 代码实现

### 引入依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
  <groupId>org.redisson</groupId>
  <artifactId>redisson</artifactId>
  <version>3.21.3</version>
</dependency>
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
</dependency>
```

### 注解类

```java
/**
 * 分布式锁注解
 * @author 只有影子
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DistributedLock {
  /**
   * 获取锁失败时，默认的错误描述
   */
  String errorDesc() default "任务正在处理中，请耐心等待";

  /**
   * SpEL表达式，用于获取锁的key
   * 示例：
   * "#name"则从方法参数中获取name的值作为key
   * "#user.id"则从方法参数中获取user对象中的id作为key
   */
  String[] keys() default {};

  /**
   * key的前缀，为空时取类名+方法名
   */
  String prefix() default "";
}
```

### 切面类

```java
/**
 * 分布式锁切面类
 * @author 只有影子
 */
@Slf4j
@Aspect
@Component
public class DistributedLockAspect {

    @Resource
    private RedissonClient redissonClient;
    private static final ParameterNameDiscoverer PARAMETER_NAME_DISCOVERER = new DefaultParameterNameDiscoverer();

    @Around("@annotation(distributedLock)")
    public Object around(ProceedingJoinPoint joinPoint,DistributedLock distributedLock) throws Throwable {
        String redisKey = getRedisKey(joinPoint, distributedLock);
        log.info("拼接后的redisKey为：" + redisKey);
        RLock lock = redissonClient.getLock(redisKey);
        if (!lock.tryLock()) {
            // 可以使用自己的异常类，演示用RuntimeException
            throw new RuntimeException(distributedLock.errorDesc());
        }
        // 执行被切面的方法
        try {
            return joinPoint.proceed();
        } finally {
            lock.unlock();
        }
    }

    /**
     * 动态解密参数，拼接redisKey
     * @param joinPoint
     * @param distributedLock  注解
     * @return
     */
    private String getRedisKey(ProceedingJoinPoint joinPoint, DistributedLock distributedLock) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        EvaluationContext context = new MethodBasedEvaluationContext(TypedValue.NULL, method, joinPoint.getArgs(), PARAMETER_NAME_DISCOVERER);
        StringBuilder redisKey = new StringBuilder();
        // 拼接redis前缀
        if (StringUtil.isNotBlank(distributedLock.prefix())) {
            redisKey.append(distributedLock.prefix()).append(":");
        } else {
            // 获取类名
            String className = joinPoint.getTarget().getClass().getSimpleName();
            // 获取方法名
            String methodName = joinPoint.getSignature().getName();
            redisKey.append(className).append(":").append(methodName).append(":");
        }

        ExpressionParser parser = new SpelExpressionParser();
        for (String key : distributedLock.keys()) {
            // keys是个SpEL表达式
            Expression expression = parser.parseExpression(key);
            Object value = expression.getValue(context);
            redisKey.append(ObjectUtils.nullSafeToString(value));
        }
        return redisKey.toString();
    }
}
```

### 统一异常处理类

```java
/**
 * 全局异常处理类
 * @author 只有影子
 */
@RestControllerAdvice
public class ExceptionHandle {
  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public String sendErrorResponseSystem(Exception e) {
    // 这里只是模拟返回值，实际项目中一般都是返回封装好的统一返回类
    return e.getMessage();
  }
}
```

> 还需要将redis配置读入，这里就不体现

## 使用示例

### 1. 无参方法或者需要加方法级的锁

```java
@DistributedLock
@GetMapping("/helloWorld")
public void helloWorld() throws InterruptedException {
  System.out.println("helloWorld");
  Thread.sleep(100000);
}
```

调用接口：http://localhost:8080/helloWorld

```ruby
拼接后的redisKey为：HelloController:helloWorld:
```

可以看到，无参方法的key为`HelloController:helloWorld:`，其中`HelloController`为类名，`helloWorld`为方法名，因为是无参方法，所以没有接下来的参数。

这时候，再次调用改接口，则不会再进去接口，会被切面类直接拦截，返回如下结果：

![image-20231123222250866](https://pic.yupi.icu/5563/202311251831713.png)

> 在实际生产使用中，这种情况一般被用来在自动任务上标注，因为在集群环境中自动任务同一时间一般只需要启动一个。

### 2. 有参数方法，其中key从name中取值

```java
@DistributedLock(keys = "#name")
@GetMapping("/hello1")
public String hello1(String name) throws InterruptedException {
  String s = "hello " + name;
  System.out.println(s);
  Thread.sleep(100000);
  return s;
}
```

调用接口为：http://localhost:8080/hello1?name=hurry

```ruby
拼接后的redisKey为：HelloController:hello1:hurry
```

这时候，再通过`hurry`这个名称调用时，就不会再处理，而name换为`zhangsan`时，则就能正常进入接口。

这时候redis中的key为

```bash
> 127.0.0.1@6379 connected!
> keys *
HelloController:hello2:zhangsan
HelloController:hello2:hurry
```

> 实际业务中，需要根据不同的参数值进行加锁的场景。

### 3. 有参数方法，其中key需要从user对象中获取name

```java
@DistributedLock(keys = "#user.name")
@GetMapping("/hello2")
public String hello2(User user) throws InterruptedException {
  String s = "hello " + user.getName();
  System.out.println(s);
  Thread.sleep(100000);
  return s;
}
```

> 需要从某个对象中获取指定属性作为key的场景

### 4.有参数方法，其中key从name上取值并指定前缀

```java
@DistributedLock(keys = "#name",prefix = "testPrefix")
@GetMapping("/hello3")
public String hello3(String name) throws InterruptedException {
  String s = "hello " + name;
  System.out.println(s);
  Thread.sleep(100000);
  return s;
}
```

> 需要指定key前缀的场景

## 最后

由于文章篇幅原因，很多东西没有深入的讲解，但是基于以上代码基本实现了基于注解的分布式锁，可以大大提到开发效率。如果还有其他需要拓展的功能，可以通过在注解类增加属性及在切面类中通过不同的属性进行不同的处理来实现。