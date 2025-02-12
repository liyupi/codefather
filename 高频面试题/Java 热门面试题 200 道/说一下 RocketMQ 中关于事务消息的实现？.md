## 说一下 RocketMQ 中关于事务消息的实现？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

RocketMQ 中的事务消息通过**两阶段提交**的方式来确保消息与本地事务的一致性。

**第一阶段（消息发送）**：
- 生产者先将消息发送到 RocketMQ 的 Topic，此时消息的状态为**半消息（Half Message）**，消费者不可见。
- 然后，生产者执行本地事务逻辑，并根据本地事务的执行结果来决定下一步的操作。

**第二阶段（提交或回查）**：
- 如果本地事务成功，生产者会向 RocketMQ 提交 `Commit` 操作，将半消息变为正式消息，消费者可见。
- 如果本地事务失败，生产者会向 RocketMQ 提交 `Rollback` 操作，RocketMQ 会丢弃该半消息。
- 如果生产者没有及时提交 `Commit` 或 `Rollback` 操作，RocketMQ 会定时回查生产者本地事务状态，决定是否提交或回滚消息。

## 扩展知识

### 事务消息的实现细节

**半消息**：
- 是 RocketMQ 中的一种特殊状态的消息，此时对 Consumer 是不可见的，而且也不是存在真正要发送的队列中，而是存在一个特殊队列中。
- 只有在事务确认后，半消息才会转换为正式消息。

**事务回查（Transaction Check）**：
  - 当 RocketMQ 检测到某条半消息长时间未被提交或回滚时，会主动向生产者发起事务状态的回查请求。
  - 生产者实现 `checkLocalTransaction` 方法，根据该消息对应的业务逻辑状态，返回事务的执行状态（如提交、回滚、未知）。
  - RocketMQ 根据生产者返回的状态进行相应的处理，确保消息与业务操作的一致性。

**事务状态的三种类型**：
  - **`COMMIT_MESSAGE`**：表示本地事务已成功，RocketMQ 将半消息标记为可投递，正式被消费者消费。
  - **`ROLLBACK_MESSAGE`**：表示本地事务失败，RocketMQ 将删除该半消息，消费者不可见。
  - **`UNKNOWN`**：表示本地事务状态暂时无法确定，RocketMQ 会在一段时间后重新回查。


### 使用示例与主要流程

我们再来简单的看下如何使用，我根据官网示例代码简化了下。

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/naiuJhDi_21202341-8a28-428a-a377-d4e593a78d1b_mianshiya.png" alt="企业微信截图_21202341-8a28-428a-a377-d4e593a78d1b.png" width="703" /></p>

可以看到使用起来还是很简便直观的，无非就是多加个反查事务结果的方法，然后把本地事务执行的过程写在 TransationListener 里面。

至此 RocketMQ 事务消息大致的流程已经清晰了，我们画一张整体的流程图来过一遍，其实到第四步这个消息要么就是正常的消息，要么就是抛弃什么都不存在，此时这个事务消息已经结束它的生命周期了。


<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/NeKSI5Qz_46be3dc5-2f6d-4c62-a838-2fa51e1c39d1_mianshiya.png" alt="企业微信截图_46be3dc5-2f6d-4c62-a838-2fa51e1c39d1.png" width="737" /></p>


### RocketMQ 事务消息源码分析

然后我们再从源码的角度来看看到底是怎么做的，首先我们看下 `sendMessageInTransaction` 方法，方法有点长，不过没有关系结构还是很清晰的。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/oV5OwPlw_1f2faeb0-156c-4b74-950a-a7db843a9218_mianshiya.png" alt="企业微信截图_1f2faeb0-156c-4b74-950a-a7db843a9218.png" width="100%" />


流程也就是我们上面分析的，将消息塞入一些属性，标明此时这个消息还是半消息，然后发送至 Broker，然后执行本地事务，然后将本地事务的执行状态发送给 Broker ，我们现在再来看下 Broker 到底是怎么处理这个消息的。

在 Broker 的 `SendMessageProcessor#sendMessage` 中会处理这个半消息请求，因为今天主要分析的是事务消息，所以其他流程不做分析，我大致的说一下原理。

简单的说就是 sendMessage 中查到接受来的消息的属性里面 `MessageConst.PROPERTY_TRANSACTION_PREPARED` 是 true ，那么可以得知这个消息是事务消息，然后再判断一下这条消息是否超过最大消费次数，是否要延迟，Broker 是否接受事务消息等操作后，将这条消息真正的 topic 和队列存入属性中，然后重置消息的 topic 为 `RMQ_SYS_TRANS_HALF_TOPIC` ，并且队列是 0 的队列中，使得消费者无法读取这个消息。

以上就是整体处理半消息的流程，我们来看一下源码。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/Snipaste_2024-06-17_15-27-59_mianshiya.jpg" alt="Snipaste_2024-06-17_15-27-59.jpg" width="100%" />

就是来了波狸猫换太子，其实延时消息也是这么实现的，最终将换了皮的消息入盘。

Broker 处理提交或者回滚消息的处理方法是 `EndTransactionProcessor#processRequest` ，我们来
看一看它做了什么操作。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/fR5Fby2B_cd4e8d08-6a68-462a-ae01-52b57a0489a6_mianshiya.png" alt="企业微信截图_cd4e8d08-6a68-462a-ae01-52b57a0489a6.png" width="100%" />

可以看到，如果是提交事务就是把皮再换回来写入真正的topic所属的队列中，供消费者消费，如果是回滚则是将半消息记录到一个 half_op 主题下，到时候后台服务扫描半消息的时候就依据其来判断这个消息已经处理过了。

那个后台服务就是 `TransactionalMessageCheckService` 服务，它会定时的扫描半消息队列，去请求反查接口看看事务成功了没，具体执行的就是 `TransactionalMessageServiceImpl#check` 方法。

我大致说一下流程，这一步骤其实涉及到的代码很多，我就不贴代码了，有兴趣的同学自行了解。不过我相信用语言也是能说清楚的。

首先取半消息 topic 即 `RMQ_SYS_TRANS_HALF_TOPIC` 下的所有队列，如果还记得上面内容的话，就知道半消息写入的队列是 id 是 0 的这个队列，然后取出这个队列对应的 half_op 主题下的队列，即`RMQ_SYS_TRANS_OP_HALF_TOPIC` 主题下的队列。

这个 half_op 主要是为了记录这个事务消息已经被处理过，也就是说已经得知此事务消息是提交的还是回滚的消息会被记录在 half_op 中。

然后调用 `fillOpRemoveMap` 方法，从 half_op 取一批已经处理过的消息来去重，将那些没有记录在 half_op 里面的半消息调用 `putBackHalfMsgQueue` 又写入了 commitlog 中，然后发送事务反查请求，这个反查请求也是 oneWay，即不会等待响应。当然此时的半消息队列的消费 oﬀset 也会推进。

然后 producer 中的 `ClientRemotingProcessor#processRequest` 会处理这个请求，会把任务扔到 `TransactionMQProducer` 的线程池中进行，最终会调用上面我们发消息时候定义的 `checkLocalTransactionState` 方法，然后将事务状态发送给 Broker，也是用 oneWay 的方式。

看到这里相信大家会有一些疑问，比如为什么要有个 half_op ，为什么半消息处理了还要再写入 commitlog 中别急听我一一道来。

首先 **RocketMQ 的设计就是顺序追加写入**，所以**说不会更改已经入盘的消息**，那事务消息又需要更新反查的次数，超过一定反查失败就判定事务回滚。

因此每一次要反查的时候就将以前的半消息再入盘一次，并且往前推进消费进度。而 half_op 又会记录每一次反查的结果，不论是提交还是回滚都会记录，因此下一次还循环到处理此半消息的时候，可以从 half_op 得知此事务已经结束了，因此就被过滤掉不需要处理了。

如果得到的反查的结果是 UNKNOW，那 half_op 中也不会记录此结果，因此还能再次反查，并且更新反查次数。

到现在整个流程已经清晰了，我再画个图总结一下 Broker 的事务处理流程。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/E6zlQntC_34baa02d-e536-4019-8561-17ce9f8e0934_mianshiya.png" alt="企业微信截图_34baa02d-e536-4019-8561-17ce9f8e0934.png" width="100%" />

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)