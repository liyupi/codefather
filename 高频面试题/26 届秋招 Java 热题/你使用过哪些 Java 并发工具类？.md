## 你使用过哪些 Java 并发工具类？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

比如：ConcurrentHashMap、AtomicInteger、Semaphore、CyclicBarrier、CountDownLatch、BlockingQueue 等等。

这个问题只要把你知道的一些并发类名字说出来就行了，然后等面试官选择其中一个去询问即可（一般需要结合简历中项目的业务场景，所以需要根据自己的业务提前准备）。

具体的并发类分析看扩展知识。

## 扩展知识

### 1. **ConcurrentHashMap**
   - **作用：** 是一个线程安全且高效的哈希表，支持并发访问。
   - **用法：** 多个线程可以同时进行读写操作，而不会导致线程安全问题。
   ```java
   ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
   map.put("key1", 1);
   Integer value = map.get("key1");
   map.computeIfAbsent("key2", k -> 2);
   ```

### 2. **AtomicInteger**
   - **作用：** 提供一种线程安全的方式对 `int` 类型进行原子操作，如增减、比较。
   - **用法：** 适用于需要频繁对数值进行无锁操作的场景。
   ```java
   AtomicInteger atomicInt = new AtomicInteger(0);
   atomicInt.incrementAndGet(); // 递增
   atomicInt.decrementAndGet(); // 递减
   atomicInt.compareAndSet(1, 2); // 比较并设置
   ```

### 3. **Semaphore**
   - **作用：** 控制访问资源的线程数，可以用来实现限流或访问控制。
   - **用法：** 在资源有限的情况下，控制同时访问的线程数量。
   ```java
   Semaphore semaphore = new Semaphore(3);
   try {
       semaphore.acquire(); // 获取许可
       // 执行任务
   } finally {
       semaphore.release(); // 释放许可
   }
   ```

### 4. **CyclicBarrier**
   - **作用：** 让一组线程到达一个共同的同步点，然后一起继续执行。常用于分阶段任务执行。
   - **用法：** 适用于需要所有线程在某个点都完成后再继续的场景。
   ```java
   CyclicBarrier barrier = new CyclicBarrier(3, () -> {
       System.out.println("所有线程都到达了屏障点");
   });
   Runnable task = () -> {
       try {
           // 执行任务
           barrier.await(); // 等待其他线程
       } catch (Exception e) {
           e.printStackTrace();
       }
   };
   new Thread(task).start();
   new Thread(task).start();
   new Thread(task).start();
   ```

### 5. **CountDownLatch**
   - **作用：** 一个线程（或多个）等待其他线程完成操作。
   - **用法：** 适用于主线程需要等待多个子线程完成任务的场景。
   ```java
   CountDownLatch latch = new CountDownLatch(3);
   Runnable task = () -> {
       try {
           // 执行任务
       } finally {
           latch.countDown(); // 任务完成，计数器减一
       }
   };
   new Thread(task).start();
   new Thread(task).start();
   new Thread(task).start();
   latch.await(); // 等待所有任务完成
   System.out.println("所有任务都完成了");
   ```

### 6. **BlockingQueue**
   - **作用：** 是一个线程安全的队列，支持阻塞操作，适用于生产者-消费者模式。
   - **用法：** 生产者线程将元素放入队列，消费者线程从队列中取元素，队列为空时消费者线程阻塞。
   ```java
   BlockingQueue<String> queue = new LinkedBlockingQueue<>();
   Runnable producer = () -> {
       try {
           queue.put("item"); // 放入元素
       } catch (InterruptedException e) {
           e.printStackTrace();
       }
   };
   Runnable consumer = () -> {
       try {
           String item = queue.take(); // 取出元素
       } catch (InterruptedException e) {
           e.printStackTrace();
       }
   };
   new Thread(producer).start();
   new Thread(consumer).start();
   ```
### 关联题目

[什么是 Java 的 Semaphore？](https://www.mianshiya.com/bank/1789249312885223425/question/1780933294934749186)

[什么是 Java 的 CyclicBarrier？](https://www.mianshiya.com/bank/1789249312885223425/question/1780933294938943489)

[什么是 Java 的 CountDownLatch？](https://www.mianshiya.com/bank/1789249312885223425/question/1780933294943137794)

[什么是 Java 的 StampedLock？](https://www.mianshiya.com/bank/1789249312885223425/question/1780933294947332098)

[什么是 Java 的 CompletableFuture？](https://www.mianshiya.com/bank/1789249312885223425/question/1780933294951526402)

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)