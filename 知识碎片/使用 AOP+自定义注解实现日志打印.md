# 使用 AOP + 自定义注解实现日志打印

> 作者：骑猪少年，[编程导航](https://www.codefather.cn) 编号 23765

通过日志系统来引出自定义注解的创建方法

在springBoot中，注解是编码时必不可少的，它可以帮助我们更方便快捷的去开发。常见的注解如：`@Autowired、@Slf4j、@Data`等等。

然而这些注解都是别人已经封装好给我们用的，如果我们想自定义一个拥有特别功能的注解，该怎么操作呢？

看完这篇文章，给你答案~

今天以日志功能为例，灵活的运用自定义注解方便快捷的记录每个接口的日志。

在项目中，有众多的接口，如果接口报错了，该怎么去快速定位代码呢？这个时候就要用到日志了。当接口接收到请求的时候，我希望可以记录下来这个接口的各种信息。比如请求时间、请求参数，结束时间等，还可以在接口开始和结束的时候加一个标记，方便出现报错或者bug的时候可以快速定位到是哪个接口出了问题。

------

## 不使用注解

我们也可以在接口方法的开头和结尾加一行日志。

```pgsql
public class Mycontroller {
    @GetMapping("/get")
    public String get(String name,int age){
        log.info("Mycontroller**********get********start");
        System.out.println("执行了get方法");
        log.info("Mycontroller**********get********end");
        return name;
    }
}
```

执行结果：

![](https://pic.yupi.icu/5563/202403201916030.png)

方法的首尾两行都会有一个日志输出，把这个方法的所有运行包在了日志里面，如果个方法出现了问题，就很容易定位到这里了。

比如我故意写一个报错：`int i = 2/0;`

```pgsql
    @GetMapping("/get")
    public String get(String name,int age){
        log.info("Mycontroller**********get********start");
        int i = 2/0;
        System.out.println("执行了get方法");
        log.info("Mycontroller**********get********end");
        return name;
    }
```

那么输出结果如下：

![](https://pic.yupi.icu/5563/202403201916965.png)

可以看到报错的上一行日志定位了`get`方法。我们只需在`get`方法里面找问题就好了。

每个方法的首尾都要这样写一个日志记录，代码就会**大量冗余**。想获取入参的话，还得再写一段代码来实现，并且根据每个方法的入参数量、类型的不同，可能代码也要相应的变动。

既然这个是重复性的工作，而且逻辑上都是：**在方法开始之前和方法结束之后做一个标记**。那么我们能不能把这一部分抽取出来，只写一次代码，就能作用在每一个方法上面呢？

毫无疑问，答案是**可以**！

------

## 使用自定义注解

在一个事情的开始和结束插入另一个事情，很容易联想到Spring的一个重要特性——**AOP**。

> Spring的AOP（Aspect-Oriented Programming，面向切面编程）是Spring框架中的一个重要特性，用于将横切关注点从应用程序的主业务逻辑中分离出来，使得关注点的代码可以被模块化、重用，并且与主业务逻辑解耦。

### 定义注解

使用`@interface`关键字定义一个注解

```angelscript
public @interface LogInfo {

}
```

在自定义注解中，根据需要标注元注解，如果没有特定需求的话**也可以不标注**。

一共有以下5个元注解：

1. @Retention

   （保留策略）：

   - `RetentionPolicy.SOURCE`：注解仅存在于源代码中，在编译时会被丢弃。这种类型的注解通常用于提供编译时的辅助信息，不会对运行时产生影响。
   - `RetentionPolicy.CLASS`：注解存在于编译后的字节码文件中，但在运行时会被丢弃。这种类型的注解可以在编译时对代码进行一些处理，但不会影响程序运行时的行为。
   - `RetentionPolicy.RUNTIME`：注解在运行时可以通过反射获取到。这种类型的注解可以在运行时对程序的行为进行动态调整，例如在AOP（面向切面编程）中经常使用。

2. @Target

   （目标类型）：

   - `ElementType.METHOD`：指定注解可以应用于方法。
   - `ElementType.FIELD`：指定注解可以应用于字段。
   - `ElementType.TYPE`：指定注解可以应用于类、接口（包括注解类型）。
   - `ElementType.PARAMETER`：指定注解可以应用于参数。
   - `ElementType.CONSTRUCTOR`：指定注解可以应用于构造函数等。

3. @Documented

   （文档化）：

   - 当一个注解被@Documented修饰时，这个注解将会包含在Javadoc生成的文档中，使得注解的信息可以被文档化展示。

4. @Inherited

   （继承性）：

   - 如果一个注解被@Inherited修饰，那么子类会继承父类的该注解。这对于一些需要在继承关系中传递注解的情况非常有用。

5. @Repeatable

   （可重复性）：

   - 允许一个注解在同一个目标上被多次应用，而不需要使用容器注解来包裹多个相同的注解实例。这样可以使代码更加简洁和易读。

### 引AOP依赖

要实现AOP自定义注解，第一步先引入AOP的依赖：

```xml
    <!--AOP-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-aop</artifactId>
    </dependency>
```

### 编写 AOP 程序

新建一个AOP类，针对于特定方法根据业务需要进行编程 (加 @Aspect 注解声明为 AOP 类）

这个类中，我们要实现自定义注解的功能，比如在方法开始之前，做一个标记，记录该方法的入参，方法结束之后再做一个标记。

新建一个AOP类：

```less
@Aspect
@Component
@Slf4j
public class LogAOP {
}
```

> @Aspect注解：标记该类为切面类，Spring AOP会自动识别带有`@Aspect`注解的类，并将其视为切面，然后根据定义的通知和切点来实现横切逻辑。
>
> @Component：用来表示一个受Spring容器管理的组件的注解。可以让Spring自动扫描并识别被注解的类，然后将其实例化并加入到Spring容器中管理。

写一个在**接口执行之前**要执行的逻辑方法：

用`@Before`注解标注，里面的`@annotation`是用于定义切点表达式的一种特殊用法，

下列代码中`@Before("@annotation(LogInfo)")`表示在执行**被自定义注解标记的方法前**执行`logBefore方法`

```typescript
@Aspect
@Component
@Slf4j
public class LogAOP {
    @Before("@annotation(LogInfo)")
    public void logBefore(JoinPoint joinPoint){
        // 获取方法所在类的名称
        String fullClassName = joinPoint.getSignature().getDeclaringTypeName();

        // 获取方法名称
        String methodName = joinPoint.getSignature().getName();

        // 提取类名的最后一部分
        // 比如：com.pidanxia.aop.LogAOP，只拿LogAOP
        String[] classNameParts = fullClassName.split("\\.");
        String className = classNameParts[classNameParts.length - 1];

        // 在方法执行前记录日志
        log.info(className + "****************" + methodName + "****************start");

        // 获取参数列表
        Object[] args = joinPoint.getArgs();
        // 入参集合
        Map<String, Object> map = new HashMap<>();
        // 获取方法参数名称
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        String[] parameterNames = methodSignature.getParameterNames();
        // 输出入参值
        if (parameterNames != null) {
            for (int i = 0; i < args.length; i++) {
                if (parameterNames.length > i) {
                    String paramName = parameterNames[i];
                    Object paramValue = args[i];
                    map.put(paramName, paramValue);
                }
            }
        }
        JSONObject json = new JSONObject(map);
        log.info("\n入参：" + json);
    }
```

之前有了，理应也要有一个之后的。写一个在**接口执行之后**要执行的逻辑方法：

用`@After`注解标注

```typescript
    @After("@annotation(LogInfo)")
    public void logAfter(JoinPoint joinPoint){
        // 获取方法所在类的名称
        String fullClassName = joinPoint.getSignature().getDeclaringTypeName();

        // 获取方法名称
        String methodName = joinPoint.getSignature().getName();

        // 提取类名的最后一部分
        String[] classNameParts = fullClassName.split("\\.");
        String className = classNameParts[classNameParts.length - 1];

        // 在方法执行后记录日志
        log.info(className + "****************" + methodName + "****************end");
    }
```

### 使用自定义注解

在接口处使用自定义注解标记：

```less
    @LogInfo
    @GetMapping("/get")
    public String get(String name,int age){
        System.out.println("执行了get方法");
        return name;
    }
```

执行结果如下：

![](https://pic.yupi.icu/5563/202403201916944.png)

即使我们没有在接口方法中写任何的日志逻辑，只要标记了注解，就会自动调用注解方法！

### 整合成`@Around`注解

有了之前，有了之后，还会有一个包围的注解！

上面的`@Before`和`@After`可以合并为一个注解：`@Around`

一般开发中都是使用`@Around`注解比较多，因为这样只用写一个注解方法就可以了。

使用方法也很简单，就是用`Object result = point.proceed();`来隔开之前和之后执行的两部分。

`Object result = point.proceed();`语句就是执行接口方法的意思，执行完这条语句，接口方法就执行完了。

特别注意：用`@Around`注解标注的方法入参必须是：\`ProceedingJoinPoint`类型的，因为`proceed()`方法是在`ProceedingJoinPoint`接口中定义的，`JoinPoint`接口中没有定义。

把之前的`logBefore方法`和`logAfter方法`都注释掉，然后写一个新的`logAround方法`：

```java
    @Around("@annotation(LogInfo)")
    public void logAround(ProceedingJoinPoint joinPoint) throws Throwable{
		
		……	//这里代表logBefore方法的代码，一模一样拷贝过来即可
		
        // 执行原方法
        Object result = joinPoint.proceed();

        // 在方法执行后记录日志
        log.info(className + "****************" + methodName + "****************end");
        
    }
```

然后再来请求一下接口，看看控制台输出：

![image-20240314182424697](https://pic.yupi.icu/5563/202403201916946.png)

可以看到效果是跟之前的。

------

## 使用拦截器

其实自定义注解并不适用于系统日志，而是更适用于一些特定的场景，举个简单的例子：**审计日志**。

**审计日志**记录系统的操作审计信息，包括用户的操作行为、权限变更等，用于合规性和追踪用户操作。

而我们上面实现的是**系统日志**，记录系统的运行状态和事件，如系统启动、关闭、重启等，用于系统监控和故障排查。

审计日志与系统日志最大的区别是，系统日志中一般会记录着大部分甚至是所有的接口执行信息，而审计日志只需记录用户操作的关键步骤。

例如：

老师A创建了学生B。这个过程中依次调用了`list、add`这两个接口。 系统日志会记录这两个接口的所有信息。 而审计日志会记录：老师A创建了学生B。

那么我们就可以在`add`这个接口上标注我们的自定义注解，这样既节省了日志空间，也解决了代码冗余的问题！

之前我们说过自定义代码不适用于系统日志，因为我们发现：有了自定义注解，代码比之前简洁了，其实我们会发现，每个方法头上都要顶一个自定义注解，这其实也是代码冗余。

那么有没有一种办法，既能像自定义注解那样方便，而且也不用在每个方法头上分别标注呢？

答案依然是肯定的！

我们可以使用拦截器来代替自定义注解的操作.

拦截器与自定义注解的实现步骤相类似，除了拦截器不用定义注解，其他步骤跟上面是一样的。只需把元注解里的切点表达式换成路径的形式即可：

```java
    @Around("execution(* com.pidanxia.sqlboy.controller.*.*(..))")
    public void logInterceptor(ProceedingJoinPoint joinPoint) throws Throwable{
		…… //内容与logAround方法一样
    }
@Around`里的切点表达式变成了`"execution(* com.pidanxia.sqlboy.controller.*.*(..))"
```

意思是：

- `execution`: 表示匹配方法执行的连接点。
- `*`: 第一个`*`表示匹配任意返回类型的方法。
- `com.pidanxia.sqlboy.controller.*`: 表示匹配`com.pidanxia.sqlboy.controller`包下的任意类。
- `*`: 第二个`*`表示匹配任意方法名。
- `(..)`: 表示匹配任意参数列表。

这段代码的含义是：拦截`com.pidanxia.sqlboy.controller`包下所有类的所有方法，并在这些方法执行之前和之后执行自定义的逻辑。

为了看出区别，我把之前的自定义注解注释掉，并且定义一个新的自定义注解：`LogInfo2`，下面是新注解的执行方法：

```java
    @Around("@annotation(LogInfo2)")
    public void LogInfo2Around(ProceedingJoinPoint joinPoint) throws Throwable{
        // 获取方法名称
        String methodName = joinPoint.getSignature().getName();
        log.info("我是LogInfo2注解，我记录了执行了" + methodName + "方法~~~");
        // 执行原方法
        Object result = joinPoint.proceed();
    }
```

然后我定义了两个接口：`get和post`，`get`方法没有加自定义注解，而`post`方法加了新的自定义注解

```kotlin
    @GetMapping("/get")
    public String get(String name,int age){
        System.out.println("执行了get方法");
        return name;
    }

    @LogInfo2
    @PostMapping("/post")
    public Num post(@RequestBody Num num){
        System.out.println("执行了post方法");
        return num;
    }
```

分别请求两个注解看看有什么不一样的地方：

![](https://pic.yupi.icu/5563/202403201916988.png)

可以看到虽然`get`方法中没有标注任何的注解，但是也记录了日志。而`post`方法中，还打印出了自定义注解的“审计日志”。

总结：

- **拦截器适合用于**跨越多个请求处理器的通用操作，如日志记录、权限检查等。更适用于**大范围**的通用的操作。
- **自定义注解适合用于**标记特定的类、方法或字段，并根据标记执行相应的逻辑，可以**更灵活**地定义特定行为。