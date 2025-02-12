## 什么是 Java 内存模型（JMM）？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

**Java 内存模型（Java Memory Model, JMM）** 是 Java 虚拟机 (JVM) 定义的一种规范，用于描述多线程程序中变量（包括实例字段、静态字段和数组元素）如何在内存中存储和传递的规则。规范了线程何时会从主内存中读取数据、何时会把数据写回主内存。


JMM 的核心目标是确保多线程环境下的**可见性、有序性和原子性**，从而避免由于硬件和编译器优化带来的不一致问题。

- **可见性**：确保一个线程对变量的修改，能及时被其他线程看到。关键字 `volatile` 就是用来保证可见性的，它强制线程每次读写时都直接从主内存中获取最新值。
- **有序性**：指线程执行操作的顺序。JMM 允许某些指令重排序以提高性能，但会保证线程内的操作顺序不会被破坏，并通过 `happens-before` 关系保证跨线程的有序性。
- **原子性**：是指操作不可分割，线程不会在执行过程中被中断。例如，`synchronized` 关键字能确保方法或代码块的原子性。

## 扩展知识

### 为什么需要 JMM

操作系统有一套内存模型，而 Java 是跨平台实现的，因此它需要自己定义一套内存模型屏蔽各操作系统之间的差异。

JMM [（JSR133）](https://www.cs.umd.edu/~pugh/java/memoryModel/CommunityReview.pdf) 定义了 Java 源码到 CPU 指令执行一套规范，我们仅需直接使用 Java 提供的并发类（synchronized、volatile 等），知晓它定义的 happens-before 原则，即可写出并发安全的代码，无需关心底层的 CPU 指令重排、多级缓存等各种底层原理。

抽象的来看 JMM 会把内存分为本地内存和主存，每个线程都有自己的私有化的本地内存，然后还有个存储共享数据的主存。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/DorcKkWc_image_mianshiya.png" alt="image.png" width="100%" />


从图中可以看出，变量-1 实际上是一个共享变量，线程 A 和 B 都操作这个变量，如果没有规则约定，那么就会产生并发安全问题。

例如线程 A 修改了变量-1，但是线程 B 是不知道这个情况的，因此它可能会针对老数据进行修改，且修改后刷新到主存，又覆盖了线程 A 的修改。

而由 JMM 就是来定义这两个内存之间的交互规则，我们只要遵守它定义的规则，就不会出现并发安全问题。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/oAUF7E75_image_mianshiya.png" alt="image.png" width="100%" />

这里要注意本地内存只是一种抽象的说法，实际指代：寄存器、CPU 缓存等等。

总之 JMM 屏蔽了各大底层硬件的细节，是抽象出来的一套虚拟机层面的内存规范。

可以参考《Java 并发编程的艺术》对 JMM 的设计示意图：

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/wPSQbRdS_image_mianshiya.png" alt="image.png" width="100%" />

### Happens-Before
上图的 Happens-Before 是 JMM 中的重要概念，用于确定两个操作之间的执行顺序，确保多线程程序的正确性和一致性，底层主要是利用内存屏障来实现的。

具体来说：**Happens-Before 关系定义了某个操作的结果对另一个操作可见，即如果操作 A Happens-Before 操作 B，则操作 A 的结果对操作 B 可见**。

Happens-Before 规则包括以下几个重要的顺序：

1）程序顺序规则：

在一个线程内，按照代码顺序，前面的操作 Happens-Before 后面的操作。

2）监视器锁规则：

对一个锁的解锁操作 Happens-Before 后续对这个锁的加锁操作。

3）volatile 变量规则：

对一个 volatile 变量的写操作 Happens-Before 后续对这个 volatile 变量的读操作。

4）线程启动规则：

对线程的 Thread.start() 调用 Happens-Before 该线程中的每一个动作。

5）线程终止规则：

线程中的所有操作 Happens-Before 其他线程检测到该线程已经终止（通过 Thread.join()、Thread.isAlive() 返回的值等）。

6）线程中断规则：

对线程的 interrupt() 调用 Happens-Before 检测到中断事件的代码（如 Thread.interrupted() 或 Thread.isInterrupted()）。

7）对象终结规则：

一个对象的初始化完成 Happens-Before 它的 finalize() 方法的开始。

8）传递性：

如果操作 A Happens-Before 操作 B，操作 B Happens-Before 操作 C，则操作 A Happens-Before 操作 C。

参考《Java 并发编程的艺术》对 JMM 和 Happens-Before 的关系：

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/cuvhmW5v_image_mianshiya.png" alt="image.png" width="100%" />




> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)