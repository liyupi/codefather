## Java 中 ConcurrentHashMap 1.7 和 1.8 之间有哪些区别？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

JDK 1.7 `ConcurrentHashMap` 采用的是**分段锁**，即每个 `Segment` 是独立的，可以并发访问不同的 `Segment`，默认是 16 个 `Segment`，所以最多有 16 个线程可以并发执行。

而 JDK 1.8 移除了 `Segment`，锁的粒度变得更加细化，锁只在链表或红黑树的**节点级别**上进行。通过 CAS 进行插入操作，只有在更新链表或红黑树时才使用 `synchronized`，并且只锁住链表或树的头节点，进一步减少了锁的竞争，并发度大大增加。

并且 JDK 1.7 `ConcurrentHashMap` 只使用了**数组 + 链表**的结构，而 JDK 1.8 和 `HashMap`一样引入了红黑树。

除此之外，还有扩容的区别以及 `size` 方法的计算也不一样。

## 扩展知识

### ConcurrentHashMap 1.7 简单图解

我们来看下大致的结构。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/20220219203435_mianshiya.png" alt="20220219203435.png" width="100%" />

原理就是先通过 key 的 hash 判断得到 Segment 数组的下标，将这个 Segment 上锁，然后再次通过 key 的 hash 得到 Segment 里 HashEntry 数组的下标，下面这步其实就是 HashMap 一致了，所以我说差别就是引入了一个 Segments 数组。

因此可以简化的这样理解：每个 Segment 数组存放的就是一个单独的 HashMap。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/20220219203444_mianshiya.png" alt="20220219203444.png" width="100%" />

可以看到，图上我们有 6 个 Segment，那么等于有六把锁，因此共可以有六个线程同时操作这个 ConcurrentHashMap，并发度就是 6，相比于直接将 put 方法上锁，并发度就提高了，这就是**分段锁**。

具体上锁的方式来源于 Segment，**这个类实际继承了 ReentrantLock**，因此它自身具备加锁的功能。

可以看出，1.7 的分段锁已经有了细化锁粒度的概念，它的一个缺陷是 Segment 数组一旦初始化了之后不会扩容，只有 HashEntry 数组会扩容，这就导致并发度过于死板，不能随着数据的增加而提高并发度。

### ConcurrentHashMap 1.8 简单图解

1.8 ConcurrentHashMap 做了更细粒度的锁控制，可以理解为 1.8 HashMap 的数组的每个位置都是一把锁，这样扩容了锁也会变多，并发度也会增加。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/20220219203455_mianshiya.png" alt="20220219203455.png" width="100%" />

思想的转变就是把粒度更加细化。不分段了，我直接把 Node 数组的每个节点分别上一把锁，这样并发度不就更高了吗？

并且 1.8 也不借助于 ReentrantLock 了，直接用 synchronized，这也侧面证明，都 1.8 了 synchronized 优化后的速度已经不下于 ReentrantLock 了。

具体实现思路也简单：当塞入一个值的时候，先计算 key 的 hash 后的下标，如果计算到的下标还未有 Node，那么就通过 cas 塞入新的 Node。如果已经有 node 则通过 synchronized 将这个 node 上锁，这样别的线程就无法访问这个 node 及其之后的所有节点。

然后判断 key 是否相等，相等则是替换 value ，反之则是新增一个 node，这个操作和 HashMap 是一样的。

### 扩容的区别

**JDK 1.7 中的扩容**：
- **基于 Segment**：`ConcurrentHashMap` 是由多个 `Segment` 组成的，每个 `Segment` 中包含一个 `HashMap`。当某个 `Segment` 内的 `HashMap` 达到扩容阈值时，单独为该 `Segment` 进行扩容，而不会影响其他 `Segment`。
- **扩容过程**：每个 `Segment` 维护自己的负载因子，当 `Segment` 中的元素数量超过阈值时，该 `Segment` 的 `HashMap` 会扩容，整体的 `ConcurrentHashMap` 并不是一次性全部扩容。


**JDK 1.8 中的扩容**：
- **全局扩容**：`ConcurrentHashMap` 取消了 `Segment`，变成了一个全局的数组（类似于 `HashMap`）。因此，当 `ConcurrentHashMap` 中任意位置的元素超过阈值时，整个 `ConcurrentHashMap` 的数组都会被扩容。
- **基于 CAS 的扩容**：在扩容时，`ConcurrentHashMap` 采用了类似 `HashMap` 的方式，但通过**CAS 操作**确保线程安全，避免了锁住整个数组。在扩容时，多个线程可以同时帮助完成扩容操作。
- **渐进式扩容**：JDK 1.8 的 `ConcurrentHashMap` 引入了渐进式扩容机制，扩容时并不是一次性将所有数据重新分配，而是多个线程共同参与，逐步迁移旧数据到新数组中，降低了扩容时的性能开销。

#### 渐进式扩容分析

当 put 的时候，发现当前 node hash 值是 -1，则表明当前的节点正在扩容，则会触发协助扩容机制：

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1800715091727163393/yrjrC1S9_image_mianshiya.png" alt="image.png" width="723" /></p>

其实大家大致理解下就够了：

扩容无非就是搬迁 Node，假设当前数组长度为 32，那就可以分着搬迁，31-16 这几个下标的 Node 都由线程 A 来搬迁，然后线程 B 来搬迁 15-0 这几个下标的 Node。

简单说就是会维护一个 transferIndex 变量，来的线程死循环 cas 争抢下标，如果下标已经分配完了，那自然就不需要搬迁了，如果 cas 抢到了要搬运的下标，那就去帮忙搬就好了，就是这么个事儿。

### size 逻辑的区别

1.7 有个尝试的思想，当调用 size 方法的时候不会加锁，而是先尝试三次不加锁获取 sum。

如果三次总数一样，说明当前数量没有变化，那就直接返回了。如果总数不一样，那说明此时有线程在增删 map，于是加锁计算，这时候其他线程就操作不了 map 了。

```java
if (retries++ == RETRIES_BEFORE_LOCK) {
       for (int j = 0; j < segments.length; ++j)
           ensureSegment(j).lock(); // force creation
}
   ...再累加数量
```

而 1.8 不一样，它就是直接计算返回结果，具体采用的是类似 LongAdder 的思想，累加不再是基于一个成员变量，而是搞了一个数组，每个线程在自己对应的下标地方进行累加，等最后的时候把数组里面的数据统一一下，就是最终的值了。

所以这是一个分解的思想，分而治之。

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/20220219203519_mianshiya.png" alt="20220219203519.png" width="545" /></p>

在 put 的时候，就会通过 addCount 方法维护 counterCells 的数量，当然 remove 的时候也会调用此方法。

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/20220219203527_mianshiya.png" alt="20220219203527.png" width="693" /></p>

总而言之，就是平日的操作会维护 map 里面的节点数量，会先通过 CAS 修改 baseCount ，如果成功就直接返回，如果失败说明此时有线程在竞争，那么就通过 hash 选择一个 CounterCell 对象就行修改，最终 size 的结果就是 baseCount + 所有 CounterCell 。

这种通过 counterCell 数组来减少并发下场景下对单个成员变量的竞争压力，提高了并发度，提升了性能，**这也就是 LongAdder 的思想**。

### CAS

- [500. 什么是 Java 的 CAS（Compare-And-Swap）操作？](https://www.mianshiya.com/question/1780933295027023873)



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)