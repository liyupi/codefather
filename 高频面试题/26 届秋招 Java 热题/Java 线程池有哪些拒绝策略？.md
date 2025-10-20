## Java 线程池有哪些拒绝策略？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

一共提供了 4 种：

1）AbortPolicy，当任务队列满且没有线程空闲，此时添加任务会直接抛出 RejectedExecutionException 错误，这也是默认的拒绝策略。适用于必须通知调用者任务未能被执行的场景。

2）CallerRunsPolicy，当任务队列满且没有线程空闲，此时添加任务由即调用者线程执行。适用于希望通过减缓任务提交速度来稳定系统的场景。

3）DiscardOldestPolicy，当任务队列满且没有线程空闲，会删除最早的任务，然后重新提交当前任务。适用于希望丢弃最旧的任务以保证新的重要任务能够被处理的场景。

4）DiscardPolicy，直接丢弃当前提交的任务，不会执行任何操作，也不会抛出异常。适用于对部分任务丢弃没有影响的场景，或系统负载较高时不需要处理所有任务。

## 扩展知识

### 自定义拒绝策略

可以实现 RejectedExecutionHandler 接口来定义自定义的拒绝策略。例如，记录日志或将任务重新排队。

```java
public class CustomRejectedExecutionHandler implements RejectedExecutionHandler {
    @Override
    public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
        System.out.println("mianshiya.com Task " + r.toString() + " rejected");
        // 可以在这里实现日志记录或其他逻辑
    }
}
```

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)