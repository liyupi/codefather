# SpringBoot + Quartz 简易定时任务

> 作者：[A达达](https://music.163.com/#/user/home?id=1711732324)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 19158

springboot项目使用Quartz 实现简易定时任务 相比较@scheduled 注解 更具灵活性 后续可实现定时任务的增删改查等待 实现动态定时任务

**springboot+Quartz 实现简易定时任务（配置在yml文件中）**

首先我们要知道一个定时任务由以下三个部分构成：

- Job：执行实际任务的对象。需要实现一个可以被执行的方法或是继承一个抽象类并实现它的抽象方法。
- Trigger：规定任务何时被执行的对象。你可以设置它的执行时间、执行频率以及其他一些参数。
- Scheduler：管理和调度 Job 和 Trigger 的对象。它负责将任务与触发器绑定在一起，并按照指定的时间表执行任务。

------

- **首先导入Quartz依赖**

```java
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-quartz</artifactId>
    <version>2.2.3</version>
</dependency>
```

- **然后创建我们的定时Job ：此时演示一个定时插入数据的任务 简单来说就是定时调用一个mapper中的方法**

```java
@Slf4j
public class InsertJob implements Job {
    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        System.out.println(new Date());
        System.out.println("执行定时任务");
        MeterReadingMonthMapper meterReadingMonthMapper = SpringContextHolder.getBean(MeterReadingMonthMapper.class);
        try {
            meterReadingMonthMapper.insertLastMonthlyWaterConsumption();
            System.out.println("定时任务执行成功！");
        }catch (Exception e){
            throw new JobExecutionException("定时任务执行失败！");
        }
    }
}
```

**注意：上面没有用注解@Autowired或 @Resouce引入bean 因为这样行不通，因为定时任务的 Job 对象实例化的过程是通过 Quartz 内部自己完成的，但是我们通过 Spring 进行注入的 Bean 却是由 Spring 容器管理的，Quartz 内部无法感知到 Spring 容器管理的 Bean，所以没有办法在创建 Job 的时候就给装配进去。这时我们就需要一个SpringContextHolder工具类助手帮我们完成。**

- **然后新建SpringContextHolder工具类**

```java
/**
 * 随时取spring bean的工具类
 */
@Component
public class SpringContextHolder implements ApplicationContextAware {

   private static ApplicationContext applicationContext;
   
    /**
     * 实现ApplicationContextAware接口的context注入函数, 将其存入静态变量.
     */
    public void setApplicationContext(ApplicationContext applicationContext) {
        SpringContextHolder.applicationContext = applicationContext;
    }

    /**
     * 取得存储在静态变量中的ApplicationContext.
     */
    public static ApplicationContext getApplicationContext() {
        checkApplicationContext();
        return applicationContext;
    }

    /**
     * 从静态变量ApplicationContext中取得Bean, 自动转型为所赋值对象的类型.
     */
    @SuppressWarnings("unchecked")
    public static <T> T getBean(String name) {
        checkApplicationContext();
        return (T) applicationContext.getBean(name);
    }

    /**
     * 从静态变量ApplicationContext中取得Bean, 自动转型为所赋值对象的类型.
     * 如果有多个Bean符合Class, 取出第一个.
     */
    @SuppressWarnings("unchecked")
    public static <T> T getBean(Class<T> clazz) {
        checkApplicationContext();
        Map beanMaps = applicationContext.getBeansOfType(clazz);
        if (beanMaps!=null && !beanMaps.isEmpty()) {
            return (T) beanMaps.values().iterator().next();
        } else{
            return null;
        }
    }
    /**
     * spring容器是否包含该实例
     * @param name
     * @return
     */
    public static boolean containsBean(String name) {
       return applicationContext.containsBean(name);
    }

    private static void checkApplicationContext() {
        if (applicationContext == null) {
            throw new IllegalStateException("applicaitonContext未注入,请在applicationContext.xml中定义SpringContextHolder");
        }
    }
}
```

- **创建调度器scheduler与触发器trigger**

**附：**[Cron - 在线Cron表达式生成器 (](http://cron.ciding.cc/)<ciding.cc>[)](http://cron.ciding.cc/)

```java
public class InsertRunner extends Thread{

    @Override
    public void run() {
        try {
            // 1、创建Scheduler（调度器）
            SchedulerFactory schedulerFactory = new StdSchedulerFactory();
            Scheduler scheduler = schedulerFactory.getScheduler();
            Trigger trigger = TriggerBuilder.newTrigger()
                    .withIdentity("everymonth", "myInsert") // 触发器名称和分组自定义
                    .withSchedule(CronScheduleBuilder.cronSchedule("0/5 * * * * ? ")) // 定时：此处cron表达式每5s执行一次
                    .build();
                TriggerKey key = trigger.getKey();
                JobDetail job = JobBuilder.newJob(InsertJob.class)
                        .withIdentity(key.getName(), key.getGroup())
                        .build();
                //4、将Job和Trigger交给Scheduler调度
                scheduler.scheduleJob(job, trigger);
            // 5、启动Scheduler
            scheduler.start();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
```

- **配置在项目启动时启动：可以将以下代码编写在同包下的service实现类中**

```java
@Value("${task.insertTask.insertMonth}")
private String insertMonth;
@PostConstruct
public void init() throws Exception {
    // 开启定时任务
    if (insertMonth.equals("1")) {
        Thread thread = new Thread(new InsertRunner());
        thread.start();
    }
}
```

- **根据上述，将配置项目启动配置在application.yml中 ，值为1则开启定时任务**

```java
task:
  insertTask:
    insertMonth: 1 #是否开启定时任务
```

- **最后，启动项目，大功告成！**