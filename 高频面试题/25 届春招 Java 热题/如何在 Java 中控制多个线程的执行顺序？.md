## 如何在 Java 中控制多个线程的执行顺序？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

在 Java 中控制多个线程的执行顺序有很多种方法：

1） CompletableFuture，它内部有 thenRun 的方法，假设我们现在有三个任务T1、T2、T3 需要按序执行，那么仅需使用以下伪代码即可：

```java
CompletableFuture.runAsync(() -> {do t1 sth})
   .thenRun(()-> {do t2 sth})
   .thenRun(()-> {do t3 sth});
```
2）synchronized + wait()/notify() ，通过对象锁和线程间通信机制来控制线程的执行顺序。

3）ReentrantLock + condition。

4）Thread 类的 join()，通过调用这个方法，可以使一个线程等待另一个线程执行完毕后再继续执行。

5）CountDownLatch，使一个或多个线程等待其他线程完成各自工作后再继续执行。

6）CyclicBarrier，使多个线程互相等待，直到所有线程都到达某个共同点后再继续执行。

7）Semaphore，控制线程的执行顺序，适用于需要限制同时访问资源的线程数量的场景。

8）线程池，内部仅设置一个线程来执行任务，按序的将任务提交到线程池中就可以了。

## 扩展知识

### Thread#join

简单控制示例：

```java
public class JoinExample {
    public static void main(String[] args) throws InterruptedException {
        Thread thread1 = new Thread(() -> {
            System.out.println("Thread 1");
        });

        Thread thread2 = new Thread(() -> {
            System.out.println("Thread 2");
        });

        thread1.start();
        thread1.join();  // 等待 thread1 执行完毕
        thread2.start();
        thread2.join();  // 等待 thread2 执行完毕

        System.out.println("Main thread");
    }
}
```

实际上 Thread#join 方法底层用的就是 synchronized + wait 机制，调用 join 就是加锁然后 wait 等待，看下源码：

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/l23lmXWq_image_mianshiya.png" alt="image.png" width="100%" />

在上述示例代码中，等 thread1 执行完毕后， JVM 底层会调用 `lock.notify_all(thread)`，唤醒持有 thread1 对象锁的所有线程，这样就可以唤醒主线程了。


### CompletableFuture

[什么是 Java 的 CompletableFuture？](https://www.mianshiya.com/question/1780933294951526402)

### CountDownLatch

[什么是 Java 的 CountDownLatch？](https://www.mianshiya.com/question/1780933294943137794)

### CyclicBarrier

[什么是 Java 的 CyclicBarrier？](https://www.mianshiya.com/question/1780933294938943489)

### Semaphore

[什么是 Java 的 Semaphore？](https://www.mianshiya.com/question/1780933294934749186)

### 线程池

[你了解 Java 线程池的原理吗？](https://www.mianshiya.com/question/1780933294892806145)






> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)