## 线程的生命周期在 Java 中是如何定义的？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
在 Java 中，线程的生命周期可以细化为以下几个状态：

- New（初始状态）：线程对象创建后，但未调用 start() 方法。
- Runnable（可运行状态）：调用 start() 方法后，线程进入就绪状态，等待 CPU 调度。
- Blocked（阻塞状态）：线程试图获取一个对象锁而被阻塞。
- Waiting（等待状态）：线程进入等待状态，需要被显式唤醒才能继续执行。
- Timed Waiting（含等待时间的等待状态）：线程进入等待状态，但指定了等待时间，超时后会被唤醒。
- Terminated（终止状态）：线程执行完成或因异常退出。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/OdNovYUz_image_mianshiya.png" alt="image.png" width="100%" />


## 扩展知识
### 操作系统中线程的生命周期

操作系统中线程的生命周期通常包括以下五个阶段：

- 新建（New）：线程对象被创建，但尚未启动。
- 就绪（Runnable）：线程被启动，处于可运行状态，等待CPU调度执行。
- 运行（Running）：线程获得CPU资源，开始执行run()方法中的代码。
- 阻塞（Blocked）：线程因为某些操作（如等待锁、I/O操作）被阻塞，暂时停止执行。
- 终止（Terminated）：线程执行完成或因异常退出，生命周期结束。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)