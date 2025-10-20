## Synchronized 和 ReentrantLock 有什么区别？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

Synchronized 是 Java 内置的关键字，实现基本的同步机制，不支持超时，非公平，不可中断，不支持多条件。

ReentrantLock 是 JUC 类库提供的，由 JDK 1.5 引入，支持设置超时时间，可以避免死锁，比较灵活，并且支持公平锁，可中断，支持多条件判断。

ReentrantLock 需要手动解锁，而 Synchronized 不需要，它们都是可重入锁。

一般情况下用 Synchronized 足矣，比较简单，而 ReentrantLock 比较灵活，支持的功能比较多，所以复杂的情况用 ReentrantLock 。

> 性能问题：很多年前，Synchronized 性能不如 ReentrantLock，现在基本上性能是一致的。

## 扩展知识

### 可重入锁

重入锁指的是同一个线程在持有某个锁的时候，可以再次获取该锁而不会发生死锁。例如以下代码：

outer 还需要调用 inner，它们都用到了同一把锁，如果不可重入那么就会导致死锁。
```java
public class ReentrantLockExample {
    private final ReentrantLock lock = new ReentrantLock();

    public void outer() {
        lock.lock();
        try {
            inner();
        } finally {
            lock.unlock();
        }
    }

    public void inner() {
        lock.lock();
        try {
            // critical section
        } finally {
            lock.unlock();
        }
    }
}
```

在递归调用或循环调用上锁时，可重入这个特性就十分重要了。

#### 可重入锁实现方式
一般可重入锁是通过计数的方式实现，例如维护一个计数器，当前线程抢到锁则+1，如果当前线程再次抢到锁则继续+1。

如果当前线程释放锁之后，则计数器-1，当减到 0 则释放当前锁。


### 扩展 Synchronized 性能优化

Synchronized 在 JDK 1.6 之后进行了很多性能优化，主要包括以下几种：

- 偏向锁：如果一个锁被同一个线程多次获得，JVM 会将该锁设置为偏向锁，以减少获取锁的代价。
- 轻量级锁：如果没有线程竞争，JVM 会将锁设置为轻量级锁，使用 CAS 操作代替互斥同步。
- 锁粗化：JVM 会将一些短时间内连续的锁操作合并为一个锁操作，以减少锁操作的开销。
- 锁消除：JVM 在 JIT 编译时会检测到一些没有竞争的锁，并将这些锁去掉，以减少同步的开销。


###  Synchronized 的实现

- [Java 的 synchronized 是怎么实现的？](https://www.mianshiya.com/bank/1789249312885223425/question/1780933294980886530)

### ReentrantLock 的实现

- [Java 中 ReentrantLock 的实现原理是什么？](https://www.mianshiya.com/bank/1789249312885223425/question/1780933295014440961)


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)