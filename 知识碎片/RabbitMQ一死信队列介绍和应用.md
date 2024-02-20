# RabbitMQ一死信队列介绍和应用

> 作者：[吃遍全国汉堡](https://wx.zsxq.com/dweb2/index/footprint/585222581154244)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 24506

介绍RabbitMQ死信队列的基本概念和其在项目中的应用

## 前言

最近在做一个BI项目，用到了RabbitMQ异步化生成图表，同时还添加了死信队列处理无法被消费者正常消费的消息。于是便有了这篇文章，下面由我带大家介绍RabbitMQ的死信队列和其在项目中的应用吧。

## 死信和死信队列的概念

什么是死信？简单来说就是无法被消费和处理的消息。一般生产者将消息投递到broker或者queue，消费者直接从中取出消息进行消费。但有时因为某些原因导致消息不能被消费，导致消息积压在队列中，这样的消息如果没有后续的处理就会变成死信，那么专门存放死信的队列就是死信队列。

## 什么是死信交换机？

那么什么是死信交换机呢？死信交换机是指专门将死信路由到死信队列的交换机。

## 产生死信的原因

根据官方文档，我们发现一般有三种场景会产生死信。

![](https://pic.yupi.icu/5563/202402051847170.png)

1. 消息超过TTL，即消息过期
2. 消息被nack或reject，且不予重新入队
3. 队列达到最大长度

## 死信队列实战和应用

死信队列的应用并不难，无非就是多定义了一个交换机、routingKey和队列罢了。在声明普通队列时传入Map参数，往Map中put死信队列名称、死信routingKey、消息TTL等参数即可完成死信自动投递到死信队列的流程。通过如下代码即可绑定普通队列和死信交换机了，而且还能设置routingKey和队列长度等参数，无需像传统的那样通过channel绑定。

```java
Map<String, Object> arguments = new HashMap<>(); // 过期时间 arguments.put("x-message-ttl", 10000); // 正常队列设置死信交换机 arguments.put("x-dead-letter-exchange", DEAD_EXCHANGE); // 设置死信routingKey arguments.put("x-dead-letter-routing-key", "lisi"); // 设置正常队列的长度限制 arguments.put("x-max-length", 10);
```

流程图：

![](https://pic.yupi.icu/5563/202402051847720.png)

生产者Producer：

public class Producer { // 普通交换机名称 public static final String NORMAL_EXCHANGE = "normal_exchange";

```java
public static void main(String[] args) throws IOException {
    Channel channel = RabbitMQUtils.getChannel();
    //死信消息 设置TTL时间
    AMQP.BasicProperties properties = new AMQP.BasicProperties()
            .builder().expiration("10000").build();

    // 延迟消息
    for (int i = 0;i < 10;i++) {
        String message = i + "info";
        channel.basicPublish(NORMAL_EXCHANGE, "zhangsan", properties, message.getBytes());
    }
}
```

}

普通队列消费者C1：

```java
public class Consumer01 {
    // 普通交换机名称
    public static final String NORMAL_EXCHANGE = "normal_exchange";
    // 死信交换机名称
    public static final String DEAD_EXCHANGE = "dead_exchange";
    // 普通队列名称
    public static final String NORMAL_QUEUE = "normal_queue";
    // 死信队列名称
    public static final String DEAD_QUEUE = "dead_queue";

    public static void main(String[] args) throws IOException {
        Channel channel = RabbitMQUtils.getChannel();
        // 声明死信和普通交换机，类型为direct
        channel.exchangeDeclare(NORMAL_EXCHANGE, BuiltinExchangeType.DIRECT);
        channel.exchangeDeclare(DEAD_EXCHANGE, BuiltinExchangeType.DIRECT);
        // 声明普通队列
        Map<String, Object> arguments = new HashMap<>();
        // 过期时间
        arguments.put("x-message-ttl", 10000);
        // 正常队列设置死信交换机
        arguments.put("x-dead-letter-exchange", DEAD_EXCHANGE);
        // 设置死信routingKey
        arguments.put("x-dead-letter-routing-key", "lisi");
        // 设置正常队列的长度限制
        arguments.put("x-max-length", 10);

        // 声明普通队列
        channel.queueDeclare(NORMAL_QUEUE, false, false, false, arguments);
        // 声明死信队列
        channel.queueDeclare(DEAD_QUEUE, false, false, false, null);

        channel.queueBind(NORMAL_QUEUE, NORMAL_EXCHANGE, "zhangsan");
        channel.queueBind(DEAD_QUEUE, DEAD_EXCHANGE, "lisi");
        System.out.println("consumer01等待接收消息");

        DeliverCallback deliverCallback = (consumerTag, message) -> {
            String msg = new String(message.getBody(), "UTF-8");
            if (msg.equals("info5")) {
                System.out.println("consumer01接收的消息：" + new String(message.getBody()));
                System.out.println(msg + "：此消息是被拒绝的");
                channel.basicReject(message.getEnvelope().getDeliveryTag(), false); //拒绝此消息并不放回普通队列
            } else {
                System.out.println("consumer01接收的消息：" + new String(message.getBody()));
                channel.basicAck(message.getEnvelope().getDeliveryTag(), false);
            }
        };

        CancelCallback cancelCallback = consumerTag -> {
            System.out.println("C1取消消息");
        };
        channel.basicConsume(NORMAL_QUEUE, false, deliverCallback, cancelCallback);
    }
}
```

死信队列消费者C2

```java
public class Consumer02 {
    // 死信队列名称
    public static final String DEAD_QUEUE = "dead_queue";

    public static void main(String[] args) throws IOException {
        Channel channel = RabbitMQUtils.getChannel();
        System.out.println("consumer02等待接收消息");
        DeliverCallback deliverCallback = (consumerTag, message) -> {
            System.out.println("consumer02接收的消息：" + new String(message.getBody()));
        };

        CancelCallback cancelCallback = consumerTag -> {
            System.out.println("C2取消消息");
        };
        channel.basicConsume(DEAD_QUEUE, true, deliverCallback, cancelCallback);
    }
}
```

依次启动生产者，和两个消费者，并停掉普通队列的消费者，我们发现生产者发送的消息被死信队列消费者C2给接收了。

![](https://pic.yupi.icu/5563/202402051847015.png)

![](https://pic.yupi.icu/5563/202402051848349.png)

![](https://pic.yupi.icu/5563/202402051848550.png)

> 在上面的代码中，我在普通队列中设置了消息的TTL为5s，但是我又在生产者设置发送的消息TTL为10s，那么RabbitMQ会以哪个为准呢？其实RabbitMQ会以较短的TTL为准

## BI项目添加死信队列

### 声明交换机、队列和routingKey的配置类

```java
@Configuration
public class TtlQueueConfig {
    private final String COMMON_EXCHANGE = "bi_common_exchange"; // 普通交换机名称
    private final String COMMON_QUEUE = "bi_common_queue"; // 普通队列名称
    private final String DEAD_LETTER_EXCHANGE = "bi_dead_letter_exchange"; // 死信交换机名称
    private final String DEAD_LETTER_QUEUE = "bi_dead_letter_queue"; // 死信队列名称
    private final String COMMON_ROUTINGKEY = "bi_common_routingKey"; // 普通routingKey
    private final String DEAD_LETTER_ROUTINGKEY = "bi_dead_letter_routingKey"; // 死信routingKey

    // 普通交换机
    @Bean("commonExchange")
    public DirectExchange commonExchange() {
        return new DirectExchange(COMMON_EXCHANGE);
    }

    // 死信交换机
    @Bean("deadLetterExchange")
    public DirectExchange deadLetterExchange() {
        return new DirectExchange(DEAD_LETTER_EXCHANGE);
    }

    // 普通队列
    @Bean("commonQueue")
    public Queue commonQueue() {
        Map<String, Object> map = new HashMap<>(3);
        map.put("x-message-ttl", 20000);
        map.put("x-dead-letter-exchange", DEAD_LETTER_EXCHANGE);
        map.put("x-dead-letter-routing-key", DEAD_LETTER_ROUTINGKEY);
        return QueueBuilder.durable(COMMON_QUEUE).withArguments(map).build();
    }

    // 死信队列
    @Bean("deadLetterQueue")
    public Queue deadLetterQueue() {
        return QueueBuilder.durable(DEAD_LETTER_QUEUE).build();
    }

    @Bean
    public Binding commonQueueBindingCommonExchange(@Qualifier("commonQueue") Queue commonQueue,
                                                    @Qualifier("commonExchange") DirectExchange commonExchange) {
        return BindingBuilder.bind(commonQueue).to(commonExchange).with(COMMON_ROUTINGKEY);
    }

    @Bean
    public Binding deadQueueBindingDeadExchange(@Qualifier("deadLetterQueue") Queue deadLetterQueue,
                                                @Qualifier("deadLetterExchange") DirectExchange deadLetterExchange){
        return BindingBuilder.bind(deadLetterQueue).to(deadLetterExchange).with(DEAD_LETTER_ROUTINGKEY);
    }
}
```

### 普通消费者（负责异步生成图表信息）

```java
@Configuration
public class TtlQueueConfig {
    private final String COMMON_EXCHANGE = "bi_common_exchange"; // 普通交换机名称
    private final String COMMON_QUEUE = "bi_common_queue"; // 普通队列名称
    private final String DEAD_LETTER_EXCHANGE = "bi_dead_letter_exchange"; // 死信交换机名称
    private final String DEAD_LETTER_QUEUE = "bi_dead_letter_queue"; // 死信队列名称
    private final String COMMON_ROUTINGKEY = "bi_common_routingKey"; // 普通routingKey
    private final String DEAD_LETTER_ROUTINGKEY = "bi_dead_letter_routingKey"; // 死信routingKey

    // 普通交换机
    @Bean("commonExchange")
    public DirectExchange commonExchange() {
        return new DirectExchange(COMMON_EXCHANGE);
    }

    // 死信交换机
    @Bean("deadLetterExchange")
    public DirectExchange deadLetterExchange() {
        return new DirectExchange(DEAD_LETTER_EXCHANGE);
    }

    // 普通队列
    @Bean("commonQueue")
    public Queue commonQueue() {
        Map<String, Object> map = new HashMap<>(3);
        map.put("x-message-ttl", 20000);
        map.put("x-dead-letter-exchange", DEAD_LETTER_EXCHANGE);
        map.put("x-dead-letter-routing-key", DEAD_LETTER_ROUTINGKEY);
        return QueueBuilder.durable(COMMON_QUEUE).withArguments(map).build();
    }

    // 死信队列
    @Bean("deadLetterQueue")
    public Queue deadLetterQueue() {
        return QueueBuilder.durable(DEAD_LETTER_QUEUE).build();
    }

    @Bean
    public Binding commonQueueBindingCommonExchange(@Qualifier("commonQueue") Queue commonQueue,
                                                    @Qualifier("commonExchange") DirectExchange commonExchange) {
        return BindingBuilder.bind(commonQueue).to(commonExchange).with(COMMON_ROUTINGKEY);
    }

    @Bean
    public Binding deadQueueBindingDeadExchange(@Qualifier("deadLetterQueue") Queue deadLetterQueue,
                                                @Qualifier("deadLetterExchange") DirectExchange deadLetterExchange){
        return BindingBuilder.bind(deadLetterQueue).to(deadLetterExchange).with(DEAD_LETTER_ROUTINGKEY);
    }
}

普通消费者（负责异步生成图表）

@Component
@Slf4j
public class BIMessageConsumer {
    @Resource
    private ChartService chartService;

    @Resource
    private RabbitTemplate rabbitTemplate;

    @Resource
    private AIManager aiManager;

    @Resource
    RedisTemplate<String, Object> redisTemplate;

    // 制定消费者监听哪个队列和消息确认机制
    @SneakyThrows
    @RabbitListener(queues = {"bi_common_queue"}, ackMode = "MANUAL")
    public void receiveMessage(String message, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) {
        log.info("receiveMessage is {}", message);
        if(StringUtils.isBlank(message)) {
            // 如果失败，消息拒绝
            channel.basicNack(deliveryTag, false, false);
            log.info("消息为空拒绝接收");
            log.info("此消息正在被转发到死信队列中");
        }

        long chartId = Long.parseLong(message);
        Chart chart = chartService.getById(chartId);
        if (chart == null) {
            channel.basicNack(deliveryTag, false, false);
            log.info("图标为空拒绝接收");
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "图表为空");
        }

        // 先修改图表任务状态为“执行中”。等执行成功后，修改为“已完成”、保存执行结果；执行失败后，状态修改为“失败”，记录任务失败信息。
        Chart updateChart = new Chart();
        updateChart.setId(chart.getId());
        updateChart.setStatus("running");
        boolean b = chartService.updateById(updateChart);
        if (!b) {
            channel.basicNack(deliveryTag, false, false);
            handlerChartUpdateError(chart.getId(), "更新图表执行状态失败");
            return;
        }
        // 调用AI
        String result = aiManager.doChat(CommonConstant.BI_MODEL_ID, buildUserInput(chart));
        String[] splits = result.split("【【【【【");
        if (splits.length < 3) {
            channel.basicNack(deliveryTag, false, false);
            handlerChartUpdateError(chart.getId(), "AI生成错误");
            return;
        }
        String genChart = splits[1].trim();
        String genResult = splits[2].trim();
        Chart updateChartResult = new Chart();
        updateChartResult.setId(chart.getId());
        updateChartResult.setGenChart(genChart);
        updateChartResult.setGenResult(genResult);
        updateChartResult.setStatus("succeed");
        boolean updateResult = chartService.updateById(updateChartResult);
        if (!updateResult) {
            channel.basicNack(deliveryTag, false, false);
            handlerChartUpdateError(chart.getId(), "更新图表成功状态失败");
        }
        Long userId = chartService.queryUserIdByChartId(chartId);
        String myChartId = String.format("lingxibi:chart:list:%s", userId);
        redisTemplate.delete(myChartId);

        // 如果任务执行成功，手动执行ack
        channel.basicAck(deliveryTag, false);
    }


    private void handlerChartUpdateError(long chartId, String execMessage) {
        Chart updateChartResult = new Chart();
        updateChartResult.setId(chartId);
        updateChartResult.setStatus("failed");
        updateChartResult.setExecMessage(execMessage);
        boolean updateResult = chartService.updateById(updateChartResult);
        if (!updateResult) {
            log.error("更新图表失败状态失败" + chartId + "," + execMessage);
        }
    }

    /**
     * 构建用户输入
     * @param chart
     * @return
     */
    private String buildUserInput(Chart chart) {
        String goal = chart.getGoal();
        String chartType = chart.getChartType();
        String csvData = chart.getChartData();

        // 构造用户输入
        StringBuilder userInput = new StringBuilder();
        userInput.append("分析需求：").append("\n");
        // 拼接分析目标
        String userGoal = goal;
        if (StringUtils.isNotBlank(chartType)) {
            userGoal += ",请使用" + chartType;
        }
        userInput.append(userGoal).append("\n");
        userInput.append("原始数据：").append("\n");
        // 压缩后的数据

        userInput.append(csvData).append("\n");
        return userInput.toString();
    }
}
```

### 死信队列消费者（负责处理死信）

收到死信后我是直接确认了，这种方式可能不好，你也可以换成其他方式比如重新入队，或者写入数据库并打上日志等等。

```java
@Component
@Slf4j
public class TtlQueueConsumer {
    @Resource
    BIMessageProducer biMessageProducer;

    @SneakyThrows
    @RabbitListener(queues = "bi_dead_letter_queue", ackMode = "MANUAL")
    public void doTTLMessage(String message, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) {
        log.info("已经接受到死信消息：{}", message);
        biMessageProducer.sendMessage(message);
        channel.basicAck(deliveryTag, false);
    }
}
```

如果我的文章对你有帮助的话，不妨给我点个赞呗，我会持续带来不一样的内容。如果对Java相关知识感兴趣的话，可以关注我，带你走进Java的世界。