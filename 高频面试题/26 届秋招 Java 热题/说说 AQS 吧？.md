## 说说 AQS 吧？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

> 如果面试官问你为什么需要 AQS ，不要长篇大论，容易把自己和面试官绕进去。
就这样简要的回答：

简单来说 AQS 就是起到了一个抽象、封装的作用，将一些排队、入队、加锁、中断等方法提供出来，便于其他相关 JUC 锁的使用，具体加锁时机、入队时机等都需要实现类自己控制。 

它主要通过维护一个共享状态（state）和一个先进先出（FIFO）的等待队列，来管理线程对共享资源的访问。

state 用 volatile 修饰，表示当前资源的状态。例如，在独占锁中，state 为 0 表示未被占用，为 1 表示已被占用。

当线程尝试获取资源失败时，会被加入到 AQS 的等待队列中。这个队列是一个变体的 CLH 队列，采用双向链表结构，节点包含线程的引用、等待状态以及前驱和后继节点的指针。

AQS 常见的实现类有 `ReentrantLock、CountDownLatch、Semaphore` 等等。
 
然后面试官会引申问你具体 ReentrantLock 的实现原理是怎样的呢? 

参见这题：[ReentrantLock 原理](https://www.mianshiya.com/bank/1789249312885223425/question/1780933295014440961)。

## AQS 扩展知识

### AQS 的核心机制

1）状态（State）：

AQS 通过一个 volatile 类型的整数 state 来表示同步状态。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/9cDBEmbJ_image_mianshiya.png" alt="image.png" width="100%" />

子类通过 getState()、setState(int) 和 compareAndSetState(int, int) 方法来检查和修改该状态。

状态可以表示多种含义，例如在 ReentrantLock 中，状态表示锁的重入次数；在 Semaphore 中，状态表示可用的许可数。

2）队列（Queue）：

AQS 维护了一个 FIFO 的等待队列，用于管理等待获取同步状态的线程。每个节点（Node）代表一个等待的线程，节点之间通过 next 和 prev 指针链接。

```java
static final class Node {
    static final Node SHARED = new Node();
    static final Node EXCLUSIVE = null;
    volatile int waitStatus;
    volatile Node prev;
    volatile Node next;
    volatile Thread thread; // 保存等待的线程
    Node nextWaiter;
    .....
}
```

当一个线程获取同步状态失败时，它会被添加到等待队列中，并自旋等待或被阻塞，直到前面的线程释放同步状态。

3）独占模式和共享模式：

- 独占模式：只有一个线程能获取同步状态，例如 ReentrantLock。
- 共享模式：多个线程可以同时获取同步状态，例如 Semaphore 和 ReadWriteLock。

### 简单俯瞰 AQS 框架

AQS 整体架构图-（[图来自美团技术](https://tech.meituan.com/2019/12/05/aqs-theory-and-apply.html)）：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/82077ccf14127a87b77cefd1ccf562d3253591_mianshiya.png" alt="82077ccf14127a87b77cefd1ccf562d3253591.png" width="100%" />

一般实现类仅需重写图中的 API 层，来控制加锁和入队等时机（仅关注这层就够了，其他 AQS 都封装好了）。具体如何获取到锁由上图第二层的方法提供，如果未获取到锁，则进入排队层。然后上述从 API 层到排队层都依赖数据层提供的支持。

关键方法介绍，子类通过重写这些方法来实现特定的同步器：

1）tryAcquire(int arg)：

尝试以独占模式获取同步状态。由子类实现，返回 true 表示获取成功，返回 false 表示获取失败。

2）tryRelease(int arg)：

尝试以独占模式释放同步状态。由子类实现，返回 true 表示释放成功，返回 false 表示释放失败。

3）tryAcquireShared(int arg)：

尝试以共享模式获取同步状态。由子类实现，返回一个非负数表示获取成功，返回负数表示获取失败。

4）tryReleaseShared(int arg)：

尝试以共享模式释放同步状态。由子类实现，返回 true 表示释放成功，返回 false 表示释放失败。

5）isHeldExclusively()：

判断当前线程是否以独占模式持有同步状态。由子类实现，返回 true 表示当前线程持有同步状态，返回 false 表示没有持有。


### 简单基于 AQS 实现一个独占锁

定义一个 Sync 继承 AQS 自定义 tryAcquire、tryRelease、isHeldExclusively 即可实现一个独占锁，非常简单。所以说 AQS 把一切都封装的很好，基于 AQS 可以便于其他相关 JUC 锁的使用！

```java

public class SimpleLock {
    private static class Sync extends AbstractQueuedSynchronizer {
        @Override
        protected boolean tryAcquire(int acquires) {
            if (compareAndSetState(0, 1)) {
                setExclusiveOwnerThread(Thread.currentThread());
                return true;
            }
            return false;
        }

        @Override
        protected boolean tryRelease(int releases) {
            if (getState() == 0) throw new IllegalMonitorStateException();
            setExclusiveOwnerThread(null);
            setState(0);
            return true;
        }

        @Override
        protected boolean isHeldExclusively() {
            return getState() == 1;
        }

        final ConditionObject newCondition() {
            return new ConditionObject();
        }
    }

    private final Sync sync = new Sync();

    public void lock() {
        sync.acquire(1);
    }

    public void unlock() {
        sync.release(1);
    }

    public boolean isLocked() {
        return sync.isHeldExclusively();
    }

    public Condition newCondition() {
        return sync.newCondition();
    }
}
```

### ReentrantLock 对 AQS 的使用

简单基于 AQS 实现一个独占锁之后，我们来看看 ReentrantLock 是如何基于 AQS 实现的。

可以看到，同样是定义一个 Sync 继承 AQS 自定义 tryAcquire、tryRelease、isHeldExclusively 等方法：

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/Rb49st27_image_mianshiya.png" alt="image.png" width="100%" />


先简单分析下 nonfairTryAcquire 尝试申请锁的方法，看源码注释应该就很清晰了。本质就是 CAS 修改 state 并且实现了可重入：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/bY6Pt1dR_image_mianshiya.png" alt="image.png" width="100%" />

再看下 tryRelease 尝试释放锁的方法：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/eL5zy62A_image_mianshiya.png" alt="image.png" width="100%" />

如果有重入或者共享状态，那么来一个线程则可以将 `state + 1`，同理释放的时候将 `state - 1`，如果 state 为 0 说明线程已经不需要这把锁了，此时尝试释放锁即可。

所以本质还是对 state 的修改！

再看一下 ReentrantLock 尝试公平锁的加锁实现：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/q0mjsuzx_image_mianshiya.png" alt="image.png" width="100%" />


再看下 ReentrantLock 强制加锁，如果未抢到则入队的过程：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/yQtebgCN_image_mianshiya.png" alt="image.png" width="100%" />

> 源码中 selfInterrupt 的作用是什么?

这里需要先看下 acquireQueued 方法：

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/WJF6cfvJ_image_mianshiya.png" alt="image.png" width="100%" />

着重看我圈起来的那块。

我们都知道线程是可以被中断的，如果当前线程阻塞等待锁的过程被中断唤醒，此时如果前面有排队抢锁的线程，那么被中断的线程还是会因为抢不到锁而再次阻塞等待。

这样就无法响应这个中断了！

因此 acquireQueued 通过 interrupted 变量记录了之前产生过的中断，然后 acquire 方法判断，如果 `interrupted = true` 说明之前被中断过，则自己主动触发一次中断补上之前的中断！


### AQS 中变型的 CLH

[ReentrantLock 原理](https://www.mianshiya.com/bank/1789249312885223425/question/1780933295014440961)。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)