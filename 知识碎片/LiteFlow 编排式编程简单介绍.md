# LiteFlow 编排式编程简单介绍

> 作者：[想飞天的猪头](https://www.code-nav.cn/user/1630821133601288193/info)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 9414

一个好用的编排式编程框架，简单入门介绍

## 背景

在日常工作中，业务逻辑并不像我们平时学习的代码逻辑那么简短，设计到核心业务系统的代码一定是复杂的，少则千行多则万行代码，如果日后线上出现bug，或者业务上出现了异常，需要我们尽快排查问题的时候，传统的编码模式是很难迅速定位产生问题的代码位置，包括日常维护扩展也只会不断的产生更多的分支，也就是我们常说的屎山代码。即便拆分成了多个不同的方法，但是说白了其实还是没有降低耦合度，一小段改动就会影响到其他的模块，而且在测试的时候也需要完成的走一遍代码流程来验证代码的正确性。

### 问题

比如一个系统需求如下: 需要进行查询前的校验,先进行A校验->B校验->>C校验->>D校验,这时候怎么办?..责任链? 那如果流程改了 B校验->A校验->>C校验->>D校验 或者 B校验->D校验->>A校验->>C 思考一下?你是不是想打一顿产品?别急,这时候新玩意来了

LiteFlow就可以解决这些问题，它可以很方便打造一个低耦合的系统。

## 优势

1. 可以将瀑布式代码转换为以组件为核心的代码结构，这种结构的好处是可以任意编排，组件和组件之间是解耦的。
2. 组件之间的执行顺序可以用脚本来定义，语法简单，上手容易。

![](https://pic.yupi.icu/5563/202311230840732.png)

1. 组件热更替：如果想在现有逻辑中加入一个新逻辑，可以随时更换，可以类比换掉汽车中某个生锈的零件，不需要把整个车拆掉。

![](https://pic.yupi.icu/5563/202311230840216.png)

1. 支持多种脚本语言，基本上可以用脚本可以实现任何逻辑

![](https://pic.yupi.icu/5563/202311230840072.png)

## 设计原则

LiteFlow是基于工作台模式进行设计的，何谓工作台模式？

n个工人按照一定顺序围着一张工作台，按顺序各自生产零件，生产的零件最终能组装成一个机器，每个工人只需要完成自己手中零件的生产，而无需知道其他工人生产的内容。每一个工人生产所需要的资源都从工作台上拿取，如果工作台上有生产所必须的资源，则就进行生产，若是没有，就等到有这个资源。每个工人所做好的零件，也都放在工作台上。

这个模式有几个好处：

- 每个工人无需和其他工人进行沟通。工人只需要关心自己的工作内容和工作台上的资源。这样就做到了每个工人之间的解耦和无差异性。
- 即便是工人之间调换位置，工人的工作内容和关心的资源没有任何变化。这样就保证了每个工人的稳定性。
- 如果是指派某个工人去其他的工作台，工人的工作内容和需要的资源依旧没有任何变化，这样就做到了工人的可复用性。
- 因为每个工人不需要和其他工人沟通，所以可以在生产任务进行时进行实时工位更改：替换，插入，撤掉一些工人，这样生产任务也能实时的被更改。这样就保证了整个生产任务的灵活性。

这个模式映射到LiteFlow框架里，工人就是组件，工人坐的顺序就是流程配置，工作台就是上下文，资源就是参数，最终组装的这个机器就是这个业务。正因为有这些特性，所以LiteFlow能做到统一解耦的组件和灵活的装配。

## 整合Spring案例

### 引入依赖

```xml
 <dependency>
      <groupId>com.yomahub</groupId>
      <artifactId>liteflow-spring-boot-starter</artifactId>
      <version>${project.parent.version}</version>
 </dependency>
```

### 编写流程节点

这里我们简单模拟一个下单业务，分为三个节点

1. 初始化库存

```java
// 在库存里放100份可乐
@LiteflowCmpDefine
@LiteflowComponent
public class InitProductsFlow {
    @LiteflowMethod(LiteFlowMethodEnum.PROCESS)
    public void business(NodeComponent component) throws Exception{
        ExtractorResultContext contextBean = component.getContextBean(ExtractorResultContext.class);
        Product product = new Product();
        product.setId(1L);
        product.setName("可乐");
        product.setNumber(100);
        contextBean.setProduct(product);
        System.out.println("初始化库存:"+JSONObject.toJSONString(contextBean));
    }
}
```

1. 生成订单

```java
//某个人买了一份可乐
@LiteflowCmpDefine
@LiteflowComponent
public class CreateOrderFlow {
    @LiteflowMethod(LiteFlowMethodEnum.PROCESS)
    public void business(NodeComponent component) throws Exception{
        ExtractorResultContext contextBean = component.getContextBean(ExtractorResultContext.class);
        Order order = new Order();
        order.setId(110L);
        order.setProductId(1L);
        order.setGoodName("可乐");
        order.setPrice(new BigDecimal(3));
        contextBean.setOrder(order);
        System.out.println("创建订单:"+JSONObject.toJSONString(contextBean));
    }
}
```

1. 更新库存

```java
//更新一下库存数量
@LiteflowCmpDefine
@LiteflowComponent
public class SubProductsFlow {
    @LiteflowMethod(LiteFlowMethodEnum.PROCESS)
    public void business(NodeComponent component) throws Exception{
        ExtractorResultContext contextBean = component.getContextBean(ExtractorResultContext.class);
        Product product = contextBean.getProduct();
        product.setNumber(product.getNumber()-1);
        contextBean.setProduct(product);
        System.out.println("更新库存:"+JSONObject.toJSONString(contextBean));
    }
}
```

这里只是简单模拟，不要在意细节。

### 编排节点

![](https://pic.yupi.icu/5563/202311230840062.png)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<flow>
    <chain name="TFlow" desc="测试">
        <pre value="initProductsFlow"/>
        <then value="createOrderFlow"/>
        <finally value="subProductsFlow"/>
    </chain>
</flow>
```

配置文件

```yaml
liteflow:
  rule-source: config/flow.xml
  enable: true
```

### 

这个脚本就可以帮组我们按照这个顺序去执行逻辑。

### 流程测试

```java
		@Resource
    private FlowExecutor flowExecutor;
    @Test
    void contextLoads() throws Exception {
        ExtractorResultContext extractorResultContext = new ExtractorResultContext();
        flowExecutor.execute2Resp("TFlow",extractorResultContext,ExtractorResultContext.class);
    }
```

执行结果

![](https://pic.yupi.icu/5563/202311230840726.png)

如果有一天突然产品要求我们说，要先减库存再生成订单，那么我们只需要修改一下编排规则就可以了

```xml
<flow>
    <chain name="TFlow" desc="测试">
        <pre value="initProductsFlow"/>
        <then value="subProductsFlow"/>
        <finally value="createOrderFlow"/>
    </chain>
</flow>
```

是不是很方便，省下的时间又能摸鱼了哈哈。

### 关于配置文件

```properties
liteflow.rule-source=config/flow.xml
#------以下非必须-------
#slot的数量，默认值为1024
liteflow.slot-size=2048
#异步线程最长的等待时间秒(只用于when)，默认值为15
liteflow.when-max-wait-second=20
#是否开启监控log打印，默认值为false
liteflow.monitor.enable-log=true
#监控队列存储大小，默认值为200
liteflow.monitor.queue-limit=300
#监控一开始延迟多少执行，默认值为300000毫秒，也就是5分钟
liteflow.monitor.delay=10000
#监控日志打印每过多少时间执行一次，默认值为300000毫秒，也就是5分钟
liteflow.monitor.period=10000
```

### 关于配置方式

官方提供的配置方式有多种，[详细的可以看这里](https://liteflow.cc/pages/6fa87e/#规则组成部分)。

### 关于执行方法

#### 返回类型 LiteflowResponse

```java
//参数为流程ID，无初始流程入参，上下文类型为默认的DefaultContext
public LiteflowResponse execute2Resp(String chainId)
//第一个参数为流程ID，第二个参数为流程入参。上下文类型为默认的DefaultContext
public LiteflowResponse execute2Resp(String chainId, Object param);
//第一个参数为流程ID，第二个参数为流程入参，后面可以传入多个上下文class
public LiteflowResponse execute2Resp(String chainId, Object param, Class<?>... contextBeanClazzArray)
//第一个参数为流程ID，第二个参数为流程入参，后面可以传入多个上下文的Bean
public LiteflowResponse execute2Resp(String chainId, Object param, Object... contextBeanArray)
```

#### 返回类型 Future

```java
public Future<LiteflowResponse> execute2Future(String chainId, Object param, Class<?>... contextBeanClazzArray)
```

如果调用这个方法，那就是无阻塞的，想要拿到response，请用得到的future.get()就可以了。

同时，主执行器在这个模式下的线程数和线程池也可以自定义，具体配置如下，LiteFlow已经设置了预设值，你也可自己定义。

```properties
liteflow.main-executor-works=64
liteflow.main-executor-class=com.yomahub.liteflow.thread.LiteFlowDefaultMainExecutorBuilder
```

这里大家可能对请求参数有疑问，那我到底传什么呢，传入的值怎么取出来呢？

```java
// 我在在执行流程前传入一个方便面对象
@Test
void contextLoads() throws Exception {
    ExtractorResultContext extractorResultContext = new ExtractorResultContext();
    Product product = new Product();
    product.setId(2L);
    product.setName("方便面");
    product.setNumber(20);
    flowExecutor.execute2Resp("TFlow",product,extractorResultContext,ExtractorResultContext.class);
}
//这里的extractorResultContext 是我们的上下文，推荐在执行的时候先初始化。
Object requestData = component.getRequestData();
System.out.println("请求参数,"+JSONObject.toJSONString(requestData));
```

![](https://pic.yupi.icu/5563/202311230840773.png)

### 获取上下文数据

流程在执行过程中，会对上下文数据进行读写操作。一个流程的返回数据也应当包含在上下文中。

你获得了`LiteFlowResponse`对象之后，可以这样获得上下文Bean：

```java
LiteflowResponse response = flowExecutor.execute2Resp("chain1", 初始参数, CustomContext.class);
CustomContext context = response.getContextBean(CustomContext.class);
```

对于多上下文来说，也是一样的用法：

```java
LiteflowResponse response = flowExecutor.execute2Resp("chain1", 初始参数, OrderContext.class, UserContext.class);
OrderContext orderContext = response.getContextBean(OrderContext.class);
UserContext userContext = response.getContextBean(UserContext.class);
```