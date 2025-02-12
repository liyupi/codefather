## Java 中如何创建多线程？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

常见有以下五种方式创建使用多线程：

1）**实现 `Runnable` 接口**：
   - 实现 `Runnable` 接口的 `run()` 方法，使用 `Thread` 类的构造函数传入 `Runnable` 对象，调用 `start()` 方法启动线程。
   - 例子：`Thread thread = new Thread(new MyRunnable()); thread.start();`

2）**继承 `Thread` 类**：
   - 继承 `Thread` 类并重写 `run()` 方法，直接创建 `Thread` 子类对象并调用 `start()` 方法启动线程。
   - 例子：`MyThread thread = new MyThread(); thread.start();`

3）**使用 `Callable` 和 `FutureTask`**：
   - 实现 `Callable` 接口的 `call()` 方法，使用 `FutureTask` 包装 `Callable` 对象，再通过 `Thread` 启动。
   - 例子：`FutureTask<Integer> task = new FutureTask<>(new MyCallable()); Thread thread = new Thread(task); thread.start();`

4）**使用线程池（`ExecutorService`）**：
   - 通过 `ExecutorService` 提交 `Runnable` 或 `Callable` 任务，不直接创建和管理线程，适合管理大量并发任务。
   - 例子：`ExecutorService executor = Executors.newFixedThreadPool(10); executor.submit(new MyRunnable());`

5）**CompletableFuture（本质也是线程池，默认 forkjoinpool）**：
   - Java 8 引入的功能，非常方便地进行异步任务调用，且通过 `thenApply`、`thenAccept` 等方法可以轻松处理异步任务之间的依赖关系。
   - `CompletableFuture<Void> future1 = CompletableFuture.runAsync(() -> {});`


## 扩展知识

1）**`Runnable` vs `Callable`**：
   - `Runnable` 的 `run()` 方法不返回结果，不能抛出检查异常；`Callable` 的 `call()` 方法可以返回结果，并允许抛出检查异常。使用 `Callable` 更适合需要返回结果或处理异常的并发任务。

2）**线程池的优势**：
   - 使用线程池可以有效管理和重用线程，避免频繁创建和销毁线程带来的开销。常用的线程池有 `FixedThreadPool`、`CachedThreadPool` 和 `ScheduledThreadPool`，每种线程池适用于不同的场景。
   - [472. 你了解 Java 线程池的原理吗？](https://www.mianshiya.com/question/1780933294892806145)
   - [474. 如何设置 Java 线程池的线程数？](https://www.mianshiya.com/question/1780933294905389057)

3）**虚拟线程（Java 21 及之后）**：
   - 虚拟线程是 Java 21 引入的新特性，它是一种轻量级的线程实现，可以更高效地处理大量并发任务。与传统的操作系统线程相比，虚拟线程的创建和上下文切换开销更低，非常适合高并发应用场景。
   - 例子：`Thread.startVirtualThread(() -> System.out.println("Hello from a virtual thread"));`
   - [468. 什么是协程？Java 支持协程吗？](https://www.mianshiya.com/question/1780933294863446018)

4) **CompletableFuture**：
 - [485. 什么是 Java 的 CompletableFuture？](https://www.mianshiya.com/question/1780933294951526402)


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)