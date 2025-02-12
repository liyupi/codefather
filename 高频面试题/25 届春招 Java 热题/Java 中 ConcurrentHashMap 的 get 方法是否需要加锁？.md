## Java 中 ConcurrentHashMap 的 get 方法是否需要加锁？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

 **不需要加锁**。

通过 `volatile` 关键字，`ConcurrentHashMap` 能够确保 `get` 方法的线程安全，即使在写入发生时，读取线程仍然能够获得最新的数据，不会引发并发问题。

具体是通过`Unsafe#getXXXVolatile` 和用 volatile 来修饰节点的 val 和 next 指针来实现的。

## 扩展知识

### **写时加锁**：

写操作如 `put` 和 `remove` 需要加锁，以确保写入时的线程安全性和一致性，但 `get` 操作不需要锁。通过这种方式，`ConcurrentHashMap` 实现了高效的读写分离，读操作不会阻塞写操作，从而提高了并发性能。

### ConcurrentHashMap#get 方法源码分析

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/lctBikgm_image_mianshiya.png" alt="image.png" width="668" /></p>

主要的定位逻辑在 `e = tabAt(tab, (n - 1) & h)) != null` 这行。

而 tabAt 内部使用的就是`Unsafe#getObjectVolatile`来保证可见性。

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/aIl2YPR8_image_mianshiya.png" alt="image.png" width="706" /></p>


`getObjectVolatile` 实际是一个 native 方法，即本地方法，通过 JNI（Java Native Interface）调用底层的 C++ 实现。

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/8zT0Nnmz_image_mianshiya.png" alt="image.png" width="719" /></p>

它的原理就是根据对象的起始地址和字段的偏移量，直接从内存中读取字段的值。然后通过内存屏障确保该读取操作是 `volatile` 的，即对于其他线程是可见的。

所谓的内存屏障指的是 `getObjectVolatile` 方法会确保在读取操作之前插入一个读取屏障（load barrier），在读取操作之后插入一个读取屏障（load barrier）。这保证了字段的值在读取之前和之后都不会被 CPU 缓存，从而实现了 volatile 的语义。

因此，不需要加锁，利用 `Unsafe` 获取元素，再对比 hash 值以及 key 即可获取 value（这个流程就是普通的 map 的 get 流程，这里不再赘述）。

然后 Node 节点内的 val 和 next 指针也是被 `volatile` 修饰的，因此也可以保证可见性。


<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/gsndtATm_image_mianshiya.png" alt="image.png" width="651" /></p>

综上，不论是通过 hash 映射到数组中具体的 node 节点，还是因为 hash 冲突可能需要利用 next 指针遍历链表，定位到最终的 node 节点后需要获取 val 值，这几个关键点都可以保证可见性，因此不需要加锁。

### Unsafe

`Unsafe` 类是 Java 提供的一个内部类，用于执行不安全的操作（从名字就可以看出来了）。它提供了**直接操作内存和线程的能力**。

列举 Unsafe 类的一些关键功能：
- 直接内存访问：允许直接分配、释放、读写内存。
- 对象操作：允许直接操作对象的字段，如设置或获取对象的字段值。
- 线程操作：包括暂停和恢复线程、管理锁等。
- CAS 操作：提供了 compare-and-swap 操作，支持原子性更新操作。


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)