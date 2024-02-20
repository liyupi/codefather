# 详解 SpringBoot 自定义 Starter

> 作者：[观止.](https://www.code-nav.cn/user/1619305100524748802)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 6872

## 一.概述

在使用SpringBoot进行开发的时候，我们发现使用很多技术都是直接导入对应的starter，然后就实现了springboot整合对应技术，再加上一些简单的配置，就可以直接使用了。那什么是Starter呢？使用Starter对我们开发有什么好处？自定义Starter能对我们有什么帮助呢？

### (1) 什么是Starter？

官方文档给出了如下描述:

> Starters are a set of convenient dependency descriptors that you can include in your application. You get a one-stop shop for all the Spring and related technologies that you need without having to hunt through sample code and copy-paste loads of dependency descriptors. For example, if you want to get started using Spring and JPA for database access, include the `spring-boot-starter-data-jpa` dependency in your project.

概述来说就是：当我们想使用某项技术与Spring结合进行使用时，很多时候可直接导入该技术的starter，而不必再去找该技术所依赖的n个坐标一起cv进去。

例如：我们想使用Spring开发web项目,不使用Starter可能需要导入这些坐标:

![](https://pic.yupi.icu/5563/202402112020579.png)

有没有一种想跑路的感觉，此外如果你导的不同jar包之间存在版本不兼容还会产生一系列版本冲突问题。而使用springboot提供的starter只需要导入一个坐标即可包含上面所有的jar包以及自动适配版本。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### (2) 为什么要自定义Starter？

**问题产生：**

在我们的日常开发工作中，经常会有一些独立于业务之外的通用模块，在许多场景下都能够用到，我们经常将其备份到一个地方下，然后如果在某一个工程中需要用这块功能的时候，需要将代码硬拷贝到其中，重新集成一遍，麻烦至极。

**问题解决：**

我们在开发过程为了方便常常会封装各种工具类，使我们在项目中能很方便的进行调用。同样的，我们也可以将这些可独立于业务代码之外的功通用模块封装成一个个starter，复用的时候只需要将其在pom中引用依赖即可，SpringBoot为我们完成自动装配，简直不要太爽。通过我们自定义的Starter相当于一个大的工具模块，导入其他项目能够快速的实现功能的引入与剔除。

**常见场景：**

例如短信发送模块，自定义一些sdk使得调用者更加方便使用等等功能。

## 二.使用示例

### (1) 引入

在我们的web项目中，例如博客等，可能会添加一个记录系统访客IP及访问次数的功能，而这个功能模块可以应用到很多的地方。接下来我们一起通过实现这个模块来学习如何自定义Starter,来看看如何做到只需要一个Starter坐标以及简单的yml配置即可在项目中无感引入或摘除这个功能模块。

![](https://pic.yupi.icu/5563/202402112021560.png)

**功能介绍：**

本案例的功能是统计网站独立IP访问次数的功能，并将访问信息在后台持续输出。整体功能是在后台每10秒输出一次监控信息（格式：IP+访问次数） ，当用户访问网站时，对用户的访问行为进行统计。

例如：张三访问网站功能15次，IP地址：192.168.0.135，李四访问网站功能20次，IP地址：61.129.65.248。那么在网站后台就输出如下监控信息，此信息每10秒刷新一次。

```tex
         IP访问监控
+-----ip-address-----+--num--+
|     192.168.0.135  |   15  |
|     61.129.65.248  |   20  |
+--------------------+-------+
```

**实现分析：**

1. 如何记录访问数据

   如上所述，我们记录的数据是一个字符串（IP地址）对应一个数字（访问次数）的形式，此处存储数据我们可以使用java提供的map模型，也就是key-value的键值对模型，或者具有key-value键值对模型的存储技术，例如redis技术。本案例使用map作为实现方案，当然你也可以根据需要使用redis作为解决方案。

2. 统计功能运行位置，因为每次web请求都需要进行统计，我们有若干个接口，不可能在每个请求中都手动调用一遍吧？因此使用拦截器会是比较好的选择。不过在实现初期，先使用调用的形式进行测试，等功能完成了，再改成拦截器的实现方案。

3. 为了提升统计数据展示的灵活度，为统计功能添加配置项。输出频度，输出的数据格式，统计数据的显示模式均可以通过配置实现调整。

- 输出频度，默认10秒
- 数据特征：累计数据 / 阶段数据，默认累计数据
- 输出格式：详细模式 / 极简模式

> A typical Spring Boot starter contains code to auto-configure and customize the infrastructure of a given technology, let’s call that "acme". To make it easily extensible, a number of configuration keys in a dedicated namespace can be exposed to the environment. Finally, a single "starter" dependency is provided to help users get started as easily as possible.

**概述来说就是**：我们在引入一个starter后可轻松开始使用并且能够在配置文件中设置参数对其实现灵活调整。

如此我们便按照官方文档所推荐用法简单的设计了一个简单starter~

**项目整体结构一览：**

![](https://pic.yupi.icu/5563/202402112022436.png)

### (2) 功能开发

### (2.1) 环境搭建

创建一个SpringBoot工程，实现本案例相关功能只需要导入如下坐标即可

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### (2.2) 统计访问ip&次数

功能类的制作并不复杂，创建一个业务类，声明一个Map对象，用于记录ip访问次数，key是ip地址，value是访问次数。制作统计操作对应的方法，每次访问后对应ip的记录次数+1。需要分情况处理，如果当前没有对应ip的数据，新增一条数据，否则就修改对应key的值+1即可。

因为当前功能模块最终需要导入到其他项目中进行，而导入当前功能的项目是一个web项目，可以从容器中直接获取请求对象，因此获取IP地址的操作可以通过自动装配得到请求对象，然后获取对应的访问IP地址。

```JAVA
public class IpCountService {
    // 1.当前类加载成bean以后是一个单例对象，不存在多个对象共享数据的问题
   //  因此不用设置为static静态变量
    private Map<String, Integer> ipCountMap = new HashMap<>();

    // 2. 从容器中直接获取请求对象
    @Resource
    private HttpServletRequest httpServletRequest;

    // 3. 统计ip&次数
    public void count() {
        System.out.println("----触发统计ip&次数方法------");
        //每次调用当前操作，就记录当前访问的IP，然后累加访问次数
        //1.获取当前操作的IP地址
        String ip = httpServletRequest.getRemoteAddr();
        //2.根据IP地址从Map取值，并递增次数
        ipCountMap.put(ip, ipCountMap.getOrDefault(ip, 0) + 1);
    }
}
```

### (2.3) 定义自动配置类

**步骤一：定义自动配置类**

我们需要做到的效果是导入当前模块即可启动模块提供功能，因此可以使用自动配置实现功能的自动装载，需要我们创建自动配置类在启动项目时加载当前功能。

```JAVA
public class IpAutoConfiguration {
    @Bean
    public IpCountService ipCountService(){
        return new IpCountService();
    }
}
```

**步骤二：加载自动配置类**

在创建的`spring.factories`文件对其进行配置使得其变成自动配置类加载。

```properties
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=cn.guanzhi.autoconfig.IpAutoConfiguration
```

**项目加载流程**：加载模块 -> 加载`spring.factories`文件 -> 加载`IpAutoConfiguration`类 -> 加载`IpCountService`类

**我们已经自定义好了一个starter**！震惊不？已经可以导入其他项目中使用了，只能功能没开始描述的那么齐全。

### (2.4) 在新项目测试功能(终)

**步骤一：安装到本地**

先在自定义Starter项目中用Maven:install一下，使得其能重新编译并安装到本地仓库，以便我们在其他项目中导入坐标能够获取到该坐标。

![](https://pic.yupi.icu/5563/202402112022453.png)

**步骤二：创建测试项目**

为了测试功能需要（也可以在已有的web项目中进行测试），我们再创建一个springboot的web工程。

**导入坐标：**

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
```

**创建测试接口：**

```java
@RestController
public class DemoController {

    @GetMapping("/guanzhi")
    public void ipDemo() {
    	System.out.println("方法触发成功")
    }

}
```

**步骤三：导入项目**

在调用项目中导入我们自己开发的starter进行使用

```XML
<dependency>
    <groupId>cn.guanzhi</groupId>
    <artifactId>ip-spring-boot-starter</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</dependency>
```

**步骤四：进行调用**

由于我们开发的功能还不完善，暂时需要自己注入`ipCountService`对象并调用`count`方法进行使用。

```JAVA
@RestController
public class DemoController {
    @Resource
    private IpCountService ipCountService;
    
    @GetMapping("/guanzhi")
    public void ipDemo() {
        ipCountService.count();
    	System.out.println("方法触发成功");
    }
}
```

**步骤五：效果检验**

当我们发送请求调用该方法后，能够触发我们在starter中定义count方法，因此可以在控制台输出当前访问的IP地址，此功能可以在count操作中添加日志或者输出语句进行测试。

![](https://pic.yupi.icu/5563/202402112022019.png)

**可以看到我们已经成功使用了我们自定义Starter中的方法**，就是功能有点简陋，接下来让我们一起逐步完善功能细节吧。

### (2.5) 定时打印日志

当前已经实现了在业务功能类中记录访问数据，但是具体还没有输出监控的信息到控制台。我们可以控制监控信息每5秒打印1次，因此需要使用定时器功能。我们可以选择Spring内置的task来完成此功能。

**步骤一：开启配置**

使用定时任务功能需要在当前项目的总配置中进行开启，例如在本项目中，我们可以在自动配置类上加上如下注解开启。加载自动配置类时即启用定时任务功能。

```JAVA
@EnableScheduling
public class IpAutoConfiguration {
    @Bean
    public IpCountService ipCountService(){
        return new IpCountService();
    }
}
```

**步骤二：设置频率**

定义一个打印统计访问Ip&访问次数的print()方法，并设置定时任务，使得其每5秒运行一次统计数据（也可根据需要修改cron数值）。

```JAVA
public class IpCountService {
    private Map<String,Integer> ipCountMap = new HashMap<String,Integer>();
    
    // 定时任务执行频率
    @Scheduled(cron = "0/5 * * * * ?")
    public void print(){
        System.out.println("         IP访问监控");
        System.out.println("+-----ip-address-----+--num--+");
        for (Map.Entry<String, Integer> entry : ipCountMap.entrySet()) {
            String key = entry.getKey();
            Integer value = entry.getValue();
            System.out.println(String.format("|%18s  |%5d  |",key,value));
        }
        System.out.println("+--------------------+-------+");
      }
}
```

其中关于统计报表的显示信息拼接可以使用各种形式进行，此处使用String类中的格式化字符串操作进行。

**步骤三：检验效果**

重新clean然后install一下自定义starter项目，然后我们重新启动我们的测试项目，再次访问接口。

![](https://pic.yupi.icu/5563/202402112022016.png)

通过循环打印的日志可以看到我们已经成功的完成了定时打印日志功能。

### (2.6) 通过yml设置功能参数

> To make it easily extensible, a number of configuration keys in a dedicated namespace can be exposed to the environment

由于我们当前打印日志显示的信息格式是固定，为提高报表信息显示的灵活性，可以通过yml文件提供一些参数给外界使用者进行灵活的更改以达到想要实现的效果。

**步骤一：预设参数**

假设我们预设置3个属性，分别用来控制日志显示周期（cycle），周期数据是否清空（cycleReset），数据显示格式（model）

```YAML
tools:
  ip:
    cycle: 10
    cycleReset: false
    model: "detail"
```

**步骤二：定义封装参数的属性类，读取配置参数**

**为防止项目组定义的参数种类过多，产生冲突**，通常设置属性前缀会**至少使用两级属性作为前缀进行区分**。日志输出模式是在若干个类别选项中选择某一项，对于此种分类性数据建议制作枚举定义分类数据，为了方便使用字符串也可以。**注意写文档注释，后面有作用**！！！

```JAVA
// 指定加载的属性
@ConfigurationProperties(prefix = "tools.ip")
public class IpProperties {
    /**
     * 日志显示周期
     */
    private Long cycle = 5L;
    
    /**
     * 是否周期内重置数据
     */
    private Boolean cycleReset = false;
    
    /**
     * 日志输出模式  detail：详细模式  simple：极简模式
     */
    private String model = LogModel.DETAIL.value;
    
    /**
    * 枚举模式
    */
    public enum LogModel{
        DETAIL("detail"),
        SIMPLE("simple");
        private String value;
        LogModel(String value) {
            this.value = value;
        }
        public String getValue() {
            return value;
        }
    }
}
```

**步骤三：加载属性类**

在配置类指定加载上述`Bean`，也可以直接在属性类中加`@Component`注解

```JAVA
@EnableScheduling
@EnableConfigurationProperties(IpProperties.class)
public class IpAutoConfiguration {
    @Bean
    public IpCountService ipCountService(){
        return new IpCountService();
    }
}
```

**步骤四：业务功能调整**

接下来我们就可以根据配置的不同属性参数，在功能类中进行不同的逻辑处理，以实现不同的功能效果。注意：清除数据的功能一定要在输出后运行，否则每次查阅的数据均为空白数据。

```JAVA
public class IpCountService {
    private Map<String,Integer> ipCountMap = new HashMap<String,Integer>();
    
    // 使用自动装配加载对应的配置bean
    @Resource
    private IpProperties ipProperties;
    
    @Scheduled(cron = "0/5 * * * * ?")
    public void print(){
        // 详细模式日志展示格式
        if(ipProperties.getModel().equals(IpProperties.LogModel.DETAIL.getValue())){
            System.out.println("         IP访问监控");
            System.out.println("+-----ip-address-----+--num--+");
            for (Map.Entry<String, Integer> entry : ipCountMap.entrySet()) {
                String key = entry.getKey();
                Integer value = entry.getValue();
                System.out.println(String.format("|%18s  |%5d  |",key,value));
            }
            System.out.println("+--------------------+-------+");
            
        // 简洁模式日志展示格式
        }else if(ipProperties.getModel().equals(IpProperties.LogModel.SIMPLE.getValue())){
            System.out.println("     IP访问监控");
            System.out.println("+-----ip-address-----+");
            for (String key: ipCountMap.keySet()) {
                System.out.println(String.format("|%18s  |",key));
            }
            System.out.println("+--------------------+");
        }
        
        // 阶段内统计数据是否清除
        if(ipProperties.getCycleReset()){
            ipCountMap.clear();
        }
    }
}
```

**步骤五：效果展示**

我们已经完成了两个属性的动态控制，日志打印周期配置稍稍有些不同，我们先来看看上述配置好的两个属性是否生效。同样是**先clean再install一下**，然后在我们web测试程序端通过控制yml文件中的配置参数对统计信息进行格式控制。

![](https://pic.yupi.icu/5563/202402112022147.png)

### (2.7) 设置定时器注解参数

我们在使用yml配置属性配置中的显示周期数据时，由于**无法在@Scheduled注解上直接使用属性配置类数据**，因此我们需要放弃使用**@EnableConfigurationProperties**注解对应的功能，改成最原始的bean定义格式。

![](https://pic.yupi.icu/5563/202402112022289.png)

**步骤一：读取数值**

我们还是在`@Scheduled`注解中使用`#{}`读取bean属性值，此处读取名称为ipProperties的bean的cycle属性值

```JAVA
@Scheduled(cron = "0/#{ipProperties.cycle} * * * * ?")
public void print(){
}
```

**步骤二：属性类定义bean并指定bean的访问名称**

注意：**如果此处不设置bean的访问名称，spring会使用自己的命名生成器生成bean的长名称，无法实现属性的读取**

```JAVA
// 设置为Bean,并自定义名称便于使用
@Component("ipProperties")
@ConfigurationProperties(prefix = "tools.ip")
public class IpProperties {
}
```

**步骤三：重新读取Bean**

为了使用我们自己定义的Bean名称,还需要弃用原来写的`@EnableConfigurationProperties`注解对应的功能，改为`@Import`导入bean的形式加载配置属性类.

```JAVA
@EnableScheduling
// @EnableConfigurationProperties(IpProperties.class)
@Import(IpProperties.class)
public class IpAutoConfiguration {
    @Bean
    public IpCountService ipCountService(){
        return new IpCountService();
    }
}
```

**步骤四：测试**

再次clean然后install，我们重新在web程序测试端通过控制yml文件中的配置参数对统计信息的显示周期进行控制查看展示效果

![](https://pic.yupi.icu/5563/202402112022752.png)

### (2.8) 拦截器开发

在之前的使用中，我们导入模块后，如果想使用这个功能还得自己创建并注入`IpProperties`对象，然后再中调用其count方法，如果有很多个方法需要使用，那么我们就要cv很多次，假如有一天要移除这个功能，那么又要一处处寻找删除，遗漏了将产生报错，显然十分不方便。我们可以考虑开发一个拦截器统一进行处理，这样我们就能实现，只需导入坐标，进行简单的配置即可轻松引入或摘去功能模块。

**步骤一：开发拦截器**

使用自动装配加载统计功能的业务类，并在拦截器中调用对应功能

```JAVA
public class IpCountInterceptor implements HandlerInterceptor {
    @Autowired
    private IpCountService ipCountService;
    @Override
    public boolean preHandle(HttpServletRequest request, 
                             HttpServletResponse response, Object handler) throws Exception {
        ipCountService.count();
        return true;
    }
}
```

**步骤二：配置拦截器**

配置mvc拦截器，设置拦截对应的请求路径。此处拦截所有请求，用户可以根据使用需要设置要拦截的请求。甚至可以在此处加载IpCountProperties中的属性，通过配置设置拦截器拦截的请求。

```JAVA
@Configuration
public class SpringMvcConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(ipCountInterceptor()).addPathPatterns("/**");
    }
    
    // 加载拦截器
    @Bean
    public IpCountInterceptor ipCountInterceptor(){
        return new IpCountInterceptor();
    }
}
```

**步骤三：导入拦截器**

在配置类中导入我们配置的拦截器

```java
@EnableScheduling
//@EnableConfigurationProperties(IpProperties.class)
@Import({IpProperties.class,SpringMvcConfig.class})
public class IpAutoConfiguration {

    @Bean
    public IpCountService ipCountService() {
        return new IpCountService();
    }
}
```

**步骤四：测试**

我们再次启动进行测试，可以看到我们注释掉了手动注入调用的代码，功能依旧正常执行~

![](https://pic.yupi.icu/5563/202402112022518.png)

### (2.9) 开启yml提示功能

我们在使用springboot的配置属性时，都可以看到提示，尤其是导入了对应的starter后，也会有对应的提示信息出现。但是现在我们自己开发的starter并没有对应的提示功能，这就非常的不友好，接下来我们一起尝试解决自定义starter功能开启配置提示的问题。

![](https://pic.yupi.icu/5563/202402112022314.png)

**步骤一：导入坐标**

springboot提供有专用的工具实现此功能，仅需要导入下列坐标。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

**步骤二：重启install**

程序重新编译后，在META-INF目录中会生成对应的提示文件，我们可以拷贝生成出的文件到自己开发的META-INF目录中，并对其进行编辑。为了避免产生重复的提示效果，我们可以注释掉上述坐标了。

![](https://pic.yupi.icu/5563/202402112022779.png)

**步骤三：进行些许配置**

打开生成的文件，可以看到如下信息。其中`groups`属性定义了当前配置的提示信息总体描述，当前配置属于哪一个属性封装类。`properties`属性描述了当前配置中每一个属性的具体设置，包 含名称、类型、描述、默认值等信息。`hints`属性**默认是空白的，没有进行设置**。

**注意**：文档中的description都是根据我们之前在配置类中的doc文档注释所自动生成的。

![](https://pic.yupi.icu/5563/202402112023184.png)

为了更友好的提供效果，hints属性可以参考springboot源码中的制作，**设置当前属性封装类专用的提示信息**，下例中为日志输出模式属性model设置了两种可选提示信息。

```JAVA
{
    
	......
    
  "hints": [
    {
      "name": "tools.ip.model",
      "values": [
        {
          "value": "detail",
          "description": "详细模式."
        },
        {
          "value": "simple",
          "description": "极简模式."
        }
      ]
    }
  ]
}
```

**步骤四：测试**

同样的，我们在测试项目的yml文件中查看效果，可以看到与官方基本一致啦。

![](https://pic.yupi.icu/5563/202402112023608.png)

### (3) 整体流程总结

别看我们在上述进行了很多步的开发，其实，自定义stater的开发在（2.4）就已经完成了，就是创建独立模块，然后install到自己的本地仓库中，如果需要给别人使用的话，还要deploy到私服上。最后在需要使用的项目中导入对应的starter坐标即可。

**总体流程概括来说就是：**

1. 创建一个功能模块，按照需求导入坐标并实现功能。√（**必须**）
2. 创建一个自动配置类加载功能类(Service)，然后再`spring.factories`中配置自动配置类。**√（必须）**
3. 完成上述两步我们的自定义Starter工作就算完成了，install到本地仓库后就能通过导入坐标在其他项目使用了，只是功能十分简陋，后续我们便是在不断的完善它。
4. 为了能让我们灵活的控制功能模块，我们可以通过读取yml配置属性对外暴露一些参数设置，以供外界进行调整。**√（非必须）**
5. 我们都不可能一直记住配置的每个属性作用，更何况别人，况且没有提示极易写错，因此我们通过设置开启了yml配置提示功能。**√（非必须）**

如此我们便算是简单的完成了一个Starter的开发，是不是没有想象中的那么困难？

## 三.相关说明

### (1) starter命名规范

> 🚩All **official starters** follow a similar naming pattern; `spring-boot-starter-*`, where `*` is a particular type of application. This naming structure is intended to help when you need to find a starter. The Maven integration in many IDEs lets you search dependencies by name. For example, with the appropriate Eclipse or Spring Tools plugin installed, you can press `ctrl-space` in the POM editor and type “spring-boot-starter” for a complete list. 🚩 **third party starters** should **not start** with `spring-boot`, as it is reserved for official Spring Boot artifacts. Rather, a third-party starter typically starts with the name of the project. For example, a third-party starter project called `thirdpartyproject` would typically be named `thirdpartyproject-spring-boot-starter`.

**概述来说就是：**

为了查找方便，官方提供的`starter`命名格式基本都是`spring-boot-starter-xxx`，因此**不建议**我们也使用这种命名格式。它推荐我们使用形如**xxx-spring-boot-starter**的格式进行命名。

![](https://pic.yupi.icu/5563/202402112023770.png)

例如我们在上述案例中自定义的Starter

```xml
    <groupId>cn.guanzhi</groupId>
    <artifactId>ip-spring-boot-starter</artifactId>
    <version>0.0.1-SNAPSHOT</version>
```

### (2) 参数前缀命名

> If your starter provides configuration keys, **use a unique namespace for them**. In particular, do not include your keys in the namespaces that Spring Boot uses (such as `server`, `management`, `spring`, and so on). If you use the same namespace, we may modify these namespaces in the future in ways that break your modules. As a rule of thumb, prefix all your keys with a namespace that you own (for example `acme`).

**概述来说就是：**

在为我们暴露给外界读取设置的参数前缀进行命名时，必须确保其唯一性，否则SpringBoot在启动时可能会修改这些名称，导致一些不可预知的错误。

例如在上述案例中，为了防止意外，我们使用了两级前缀和自己项目名以示区别：

```java
// 参数设置
tools:
  ip:
    cycle: 10
    cycleReset: false
    model: "detail"


// 指定加载的属性前置
@ConfigurationProperties(prefix = "tools.ip")
```

### (3) yml提示相关

> Make sure that configuration keys are documented by adding field javadoc for each property。

**概述来说就是：**

我们在上述开启yml提示功能之后，可以看到输入部分数值后，不但会联想配置参数，参数后面还有一些相关说明，这些其实都是因为我们在配置参数类中使用了doc文档注释所生成的描述。例如：

```java
// 指定加载的属性
@ConfigurationProperties(prefix = "tools.ip")
public class IpProperties {
    /**
     * 日志显示周期
     */
    private Long cycle = 5L;
    
    /**
     * 是否周期内重置数据
     */
    private Boolean cycleReset = false;
    
}
```

输入/**+再按回车即可快捷生成相应注释格式。

此外官方给出的一些命名或描述相关建议可以根据需要进行遵守。

![](https://pic.yupi.icu/5563/202402112023398.png)

