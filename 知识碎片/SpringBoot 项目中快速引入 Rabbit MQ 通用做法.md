# SpringBoot 项目中快速引入 Rabbit MQ 通用做法

> 作者：[小何同学](https://wx.zsxq.com/dweb2/index/footprint/185541482828452)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 18055

## ⭐由来

本篇是在做**BI项目**时尝试**引入MQ**来优化项目时发现，**MQ引入到项目中做法比较类似**。变的只是谁发消息给谁，谁去监听消息。至于MQ的可靠性（比如生产者可靠性、消费者可靠性、消息可靠性）都是通过固定参数进行配置。

因此将引入MQ到BI项目的过程抽象出来，变成通用的方法～



## 🔶引入MQ目的

砍掉耗时久的业务，缩短单个业务时间，监听者异步执行耗时久任务

做完之后，你可以完成springboot项目中MQ基本配置，并且MQ具有一定可靠性~😀



## ⭕步骤

1. 在Application中配置MQ

1. 1. 生产者确认机制，重连机制、消费者能者多劳、确认机制、失败消息处理策略
   2. 保证可靠性（配备了生产者确认，重连、消费者能者多劳，确认机制，失败消息处理策略） 

***注意：不清楚的建议学习后配置，不要直接复制，按需设置~\***

```xml
spring:
	rabbitmq:
	  # 连接信息
	  host: xxx # 你的IP地址
	  port: 5672
  	# 用户相关信息建议在rabbitMQ中设置好
	  virtual-host: /bi # 可在UI界面创建独属项目的虚拟机与用户名
	  username: xxx # 用户名
	  password: xxx # 密码
	  connection-timeout: 200ms # max waited time
	
	  # 生产者（消息发送者）
	  # 生产者确认机制 - 默认取消，消耗性能
	  publisher-confirm-type: none
	  publisher-returns: false
	  template:
	    # 生产者重连机制
	    retry:
	      enabled: true
	      initial-interval: 1000ms
	      multiplier: 1
	      max-attempts: 3
	
	  # 消费者（监听者）
	  listener:
	    simple:
	      prefetch: 1 # （能者多劳）每次只能获取一条信息，处理完才能获取下一条
	      acknowledge-mode: auto # 消费者确认 - 自动模式
	      retry:
	        enabled: true # 失败消息处理策略
/**
 * 失败者消息处理策略实现
 */
@Bean
public MessageRecoverer messageRecoverer(RabbitTemplate rabbitTemplate){
    return new RepublishMessageRecoverer(rabbitTemplate, BI_ERROR_EXCHANGE, BI_ERROR_ROUTING_KEY);
}
```

1. 统一确定并定义业务的有关MQ常量 `MQConstant.java`

1. 1. 交换机、队列、Key
   2. error交换机，队列，Key（*按需设置*）

1. 开始初始化

1. 1. 业务MQ 与 error交换机MQ，并绑定关系（选一个就行，推荐第二种）

```java
@Configuration
public class ErrorConfiguration {

    @Bean
    public Queue errorQueue() {
        return QueueBuilder.durable(BI_ERROR_QUEUE).build();
    }

    @Bean
    public DirectExchange errorExchange() {
        return ExchangeBuilder.directExchange(BI_ERROR_EXCHANGE).build();
    }

    @Bean
    public Binding errorBinding() {
        return BindingBuilder.bind(errorQueue()).to(errorExchange()).with(BI_ERROR_ROUTING_KEY);
    }

}
@RabbitListener(bindings = @QueueBinding(
        // 队列：
        // name - 队列名字
        // durable - 队列持久化，不会随着MQ关闭而消失
        // arguments：使队列为Lazy queue将消息尽快写入磁盘
        value = @Queue(
                name = BI_QUEUE_NAME,
                durable = "true",
                arguments = @Argument(name = "x-queue-mode", value = "lazy")),
        // 交换机:指定交换机的名字与类型(默认direct)
        exchange = @Exchange(name = BI_EXCHANGE_NAME, type = ExchangeTypes.DIRECT),
        // 按交换机类型(Direct、Topic),设置Key
        key = BI_ROUTING_KEY
))
public void receiveMessage(String msg) {
```

1. 1. JSON消息转换器（替换掉原生的JDK）

```java
/**
 * 消息转换器
 * @return
 */
@Bean
public MessageConverter messageConverter(){
    return new Jackson2JsonMessageConverter();
}
```

1. 编写业务代码（根据实际业务）

1. 1. 发送信息：砍掉耗时久的业务，变成发送消息

1. 1. 1. 选用唯一性的信息，如id
      2. 确定好消息的数据类型

1. 1. 监听信息：添加监听者，执行耗时久的业务。

1. 1. 1. 需要根据实际情况修改代码
      2. 可以根据业务实际情况使：**业务幂等性**

```java
@RabbitListener(bindings = @QueueBinding(
        // 队列：
        // name - 队列名字
        // durable - 队列持久化，不会随着MQ关闭而消失
        // arguments：使队列为Lazy queue将消息尽快写入磁盘
        value = @Queue(
                name = BI_QUEUE_NAME,
                durable = "true",
                arguments = @Argument(name = "x-queue-mode", value = "lazy")),
        // 交换机:指定交换机的名字与类型(默认direct)
        exchange = @Exchange(name = BI_EXCHANGE_NAME, type = ExchangeTypes.DIRECT),
        // 按交换机类型(Direct、Topic),设置Key
        key = BI_ROUTING_KEY
))
public void receiveMessage(Long chatId) {
    // 0. 业务幂等性判断 - 基于乐观锁改造
    boolean update = chartService.lambdaUpdate()
            .set(Chart::getStatus, RUNNING_STATUS)
            .eq(Chart::getId, chatId)
            .eq(Chart::getStatus, WAIT_STATUS)
            .update();
    if (!update) {
        handleChartUpdateError(chatId, "该图表正在生成中！请耐心等待");
        return;
    }
```



当然，还可以对其进行拓展，比如对error队列进行监听，针对错误消息进行特殊业务处理等等~

至此之后，MQ基本操作以及配置完毕~并且MQ可靠性相对高。

最后，希望对你有用~