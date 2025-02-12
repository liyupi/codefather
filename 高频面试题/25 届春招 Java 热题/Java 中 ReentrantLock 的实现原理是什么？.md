## Java 中 ReentrantLock 的实现原理是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

ReentrantLock 其实就是基于 AQS 实现的一个可重入锁，支持公平和非公平两种方式。
 
内部实现依靠一个 state 变量和两个等待队列：同步队列和等待队列。

利用 CAS 修改 state 来争抢锁。

争抢不到则入同步队列等待，同步队列是一个双向链表。

条件 condition 不满足时候则入等待队列等待，是个单向链表。

是否是公平锁的区别在于：线程获取锁时是加入到同步队列尾部还是直接利用 CAS 争抢锁。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/VWa8SBRY_image_mianshiya.png" alt="image.png" width="100%" />


## 扩展知识

### CAS

[什么是 Java 的 CAS（Compare-And-Swap）操作？](https://www.mianshiya.com/question/1780933295027023873)

### 自旋锁

自旋锁（Spinlock） 是一种**轻量级**锁机制。线程在获取锁失败时不会立即进入阻塞状态，而是会在循环中反复尝试获取锁，直到成功。

这种方式避免了线程的上下文切换开销，所以称之为轻量级锁，**适用于锁等待时间较短的场景**。

以下就是一个简单自旋锁的实现：

```java
public class SpinLock {
    private final AtomicBoolean lock = new AtomicBoolean(false);

    public void lock() {
        while (!lock.compareAndSet(false, true)) {
            // 自旋等待
        }
    }

    public void unlock() {
        lock.set(false);
    }
    
 }
```

它的优点能避免线程上下文切换的开销，缺点主要有两点：

- 锁饥饿问题：高并发场景，可能存在某个线程一直 CAS 失败，争抢不到锁。
- 性能问题：多核处理器如果对同一变量高并发进行 CAS 操作，会导致总线风暴问题（参见 CAS 扩展知识）。

### CLH

针对自旋锁的问题，演进出一种基于队列的自旋锁即 CLH（Craig, Landin, and Hagersten），它适用于多处理器环境下的高并发场景。

原理是通过维护一个**隐式队列**，使线程在等待锁时自旋在本地变量上，从而减少了对共享变量的争用和缓存一致性流量。

它将争抢的线程组织成一个队列，通过排队的方式按序争抢锁。且每个线程不再 CAS 争抢一个变量，而是自旋判断排在它前面线程的状态，如果前面的线程状态为释放锁，那么后续的线程则抢锁。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/sI02tJvg_image_mianshiya.png" alt="image.png" width="100%" />

因此，CLH 通过排队按序争抢解决了锁饥饿的问题。通过 CAS 自旋监听前面线程的状态避免的总线风暴问题的产生。

不过 CLH 还是有缺点的：

- 占用 CPU 资源：自旋期间线程会一直占用 CPU 资源，适用于锁等待时间较短的场景。

注意！上面说了 CLH 是通过隐式队列实现的，这里的隐式指的是不同线程之前是没有真正通过指针连接的， 仅仅是利用 AtomicReference + ThreadLocal 实现了隐式关联。

大家可以参考下这个示例代码实现：

```java

public class CLHLock {
    private static class CLHNode {
        volatile boolean isLocked = true; // 默认加锁状态
    }

    private final ThreadLocal<CLHNode> currentNode;
    private final ThreadLocal<CLHNode> predecessorNode;
    private final AtomicReference<CLHNode> tail;

    public CLHLock() {
        this.currentNode = ThreadLocal.withInitial(CLHNode::new);
        this.predecessorNode = new ThreadLocal<>();
        this.tail = new AtomicReference<>(new CLHNode());
    }

    public void lock() {
        CLHNode node = currentNode.get();
        CLHNode pred = tail.getAndSet(node);
        predecessorNode.set(pred);

        // 自旋等待前驱节点释放锁
        while (pred.isLocked) {
        }
    }

    public void unlock() {
        CLHNode node = currentNode.get();
        node.isLocked = false; // 释放锁
        currentNode.set(predecessorNode.get()); // 回收当前节点
    }
}
```

### AQS 对 CLH 的改造

因为 CLH 有占用 CPU 资源问题，因此 AQS 将自旋等待前置节点改成了阻塞线程。

而后续的线程阻塞就无法主动发现前面的线程释放锁，因此前面线程需要需要通知后续线程锁被释放了。

所以 AQS 的变型版 CLH 需要显式地维护一个队列，且是一个双向列表实现，因为前面线程需要通知后续线程。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/G3m5Z1I3_image_mianshiya.png" alt="image.png" width="100%" />

且前面线程如果等待超时或者主动取消后，需要从队列中移除，且后面的线程需要“顶”上来。



<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/RVehD6XX_image_mianshiya.png" alt="image.png" width="100%" />
在 AQS 中，线程的等待状态有以下几种：

- 0，初始化的时候的默认值
- CANCELLED，值为 1，由于超时、中断或其他原因，该节点被取消
- SIGNAL，值为 -1，表示该节点准备就绪，正常等待资源
- CONDITION，值为 -2，表示该节点位于条件等待队列中
- PROPAGATE，值为 -3，当处在 SHARED 情况下，该字段才有用，将 releaseShared 动作需要传播到其他节点
	
	











> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)