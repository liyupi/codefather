## 你了解 Java 线程池的原理吗？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

线程池是一种池化技术，用于预先创建并管理一组线程，避免频繁创建和销毁线程的开销，提高性能和响应速度。 

它几个关键的配置包括：核心线程数、最大线程数、空闲存活时间、工作队列、拒绝策略。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/GnON4IVI_image_mianshiya.png" alt="image.png" width="100%" />


主要工作原理如下：

1. 默认情况下线程不会预创建，任务提交之后才会创建线程（不过设置 prestartAllCoreThreads 可以预创建核心线程）。
2. 当核心线程满了之后不会新建线程，而是把任务堆积到工作队列中。
3. 如果工作队列放不下了，然后才会新增线程，直至达到最大线程数。
4. 如果工作队列满了，然后也已经达到最大线程数了，这时候来任务会执行拒绝策略。
5. 如果线程空闲时间超过空闲存活时间，并且当前线程数大于核心线程数的则会销毁线程，直到线程数等于核心线程数（设置 allowCoreThreadTimeOut 为 true 可以回收核心线程，默认为 false）。

## 扩展知识

### 图解线程池

任务提交，线程池线程数还未达到核心线程数：

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/bXRpAeCu_image_mianshiya.png" alt="image.png" width="601" /></p>


核心线程数已满，任务队列未满的情况：

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/kFJ4tnHn_image_mianshiya.png" alt="image.png" width="601" /></p>


核心线程数已满，任务队列已满的情况：

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/Qy8wBV7q_image_mianshiya.png" alt="image.png" width="601" /></p>



线程池中线程数已达最大线程数的情况：

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/ndOHKdea_image_mianshiya.png" alt="image.png" width="601" /></p>


**注意，核心线程和非核心线程在线程池中是一样的，并没有特殊的标识区分！图中区分仅为说清创建的顺序**

### prestartAllCoreThreads 源码

线程池初始化会执行以下代码，默认的 `prestartAllCoreThreads` 为 false，因此默认不会创建核心线程。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/gxiUEn4D_image_mianshiya.png" alt="image.png" width="695" />

不过，可以通过 `setPrestartAllCoreThreads` 将其改为 true。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/Pn4d1TdM_image_mianshiya.png" alt="image.png" width="702" />


#### processWorkerExit 源码

可以看到，根据 `allowCoreThreadTimeOut` 参数，实际可以控制线程池的最小线程数，使得核心线程数也可以被销毁。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/jZ4wmNeW_image_mianshiya.png" alt="image.png" width="714" />



### 线程池相关参数解释

- corePoolSize：核心线程数，即线程池中始终保持的线程数量。
- maximumPoolSize：最大线程数，即线程池中允许的最大线程数量。
- keepAliveTime：线程空闲时间，超过这个时间的非核心线程会被销毁。
- workQueue：任务队列，存放待执行的任务。
- threadFactory：线程工厂，用于创建新线程。
- rejectedExecutionHandler：任务拒绝处理器，当任务无法执行时的处理策略。

### 工作队列类型

- SynchronousQueue：不存储任务，直接将任务提交给线程。
- LinkedBlockingQueue：链表结构的阻塞队列，大小无限。
- ArrayBlockingQueue：数组结构的有界阻塞队列。
- PriorityBlockingQueue：带优先级的无界阻塞队列。

### 提供的线程池类型

[Java 并发库中提供了哪些线程池实现？它们有什么区别？](https://www.mianshiya.com/bank/1789249312885223425/question/1780933294913777665)

### 线程池拒绝策略

[Java 线程池有哪些拒绝策略？](https://www.mianshiya.com/bank/1789249312885223425/question/1780933294909583361)


### 为什么线程池要先使用阻塞队列，而不是直接增加线程？

因为每创建一个线程都会占用一定的系统资源（如栈空间、线程调度开销等），直接增加线程会迅速消耗系统资源，导致性能下降。

使用阻塞队列可以将任务暂存，避免线程数量无限增长，确保资源利用率更高。

如果阻塞队列都满了，说明此时系统负载很大，再去增加线程到最大线程数去消化任务即可。

举个例子：老板现在手下有 10 个人在干活（核心线程数），突然活变多了，每个人干不过来了，此时老板不会立马招人，它会让这些活积累一下（放到阻塞队列中），看看过段时间能不能消化掉。如果老板发现这个活积累的实在太多了（队列满了），他才会继续招人（达到最大线程数）。这就是所谓的人员（线程）有成本。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)