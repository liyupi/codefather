# Redission 解锁异常解决方案

> 作者：[想飞天的猪头](https://www.sweetmore.cn/)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 9414

> 记录 redission 解锁遇到异常 “attempt to unlock lock, not locked by current thread by node id ” 解决方法

## Redission中的"attempt to unlock lock, not locked by current thread by node id"问题分析与解决方案

### 问题描述

在分布式系统中，锁是常用的同步机制，用于保护共享资源，在并发量很大时候，锁的使用也尤为重要，为了避免并发冲突，Redission提供了分布式锁，但是有时候在用的时候我们会遇到这个问题，即：` attempt to unlock lock, not locked by current thread by node id` 这个异常提示我们尝试解锁一个没有被当前线程锁定的锁，可能会让人感到困惑。本文章将详细分析这个异常出现的原因，并提供解决方案，帮助大家更好地使用Redission。

### 异常出现的场景

1. **锁被其他的线程或节点锁定**：当一个线程或节点已经获得了该锁，而另一个线程或节点尝试解锁时，就会出现这个异常，其实这是Redission 为了确保解锁的安去性而做的检查。
2. **锁超时**: 如果锁设定了超时时间，如果某次请求进来正好响应时间大于这个设定的超时时间，这个锁就会被提前释放掉，这个时候不应该再手动去解锁。

### 解决方案

> **针对这个异常，我们可以采取以下措施来解决：**

1. **确保锁是由当前线程或者节点获得的: ** 在解锁之前,我们需要确保当前线程或者节点已经获得了该锁。可以在解锁前用`isLocked()`方法检查锁的状态，确保只有获得锁的线程或节点才能解锁。
2. **避免重复解锁**: 如果锁已经超时自动释放，就不需要再动手动脚的。我们可以在解锁前使用`isHeldByCurrentThread()` 方法来检查当前的线程是否持有该锁，避免重复解锁。

### 示例代码

> **下面是一个示例代码，演示如何避免出现attempt to unlock lock, not locked by current thread by node id异常**

```java
RLock lock = redissonClient.getLock(SHUI_WEN_ST_PPTN_R_QUEUE);
try {
    // 尝试获取锁，等待10秒，锁自动释放时间为30秒
    boolean isLocked = lock.tryLock(10, 30, TimeUnit.SECONDS);
    if (isLocked) {
        // 执行需要保护的代码
    } else {
    	// 未获得锁，处理锁定失败的情况
        log.info("获取redisson锁失败");
    }
} catch (InterruptedException e) {
    // 处理中断异常
} finally {
    // 解锁前检查当前线程是否持有该锁
    if (lock != null && lock.isHeldByCurrentThread()) {
        lock.unlock();
    }
}
```

### 总结

通过以上的解决方案，我们可以避免"attempt to unlock lock, not locked by current thread by node id"异常的出现，保证在使用Redission分布式锁时的稳定性和正确性，保护共享资源。