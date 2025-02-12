## 什么是 Java 的 CAS（Compare-And-Swap）操作？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

CAS 是一种**硬件级别的原子操作**，它比较内存中的某个值是否为预期值，如果是，则更新为新值，否则不做修改。

**工作原理**：
- 比较（Compare）：CAS 会检查内存中的某个值是否与预期值相等。
- 交换（Swap）：如果相等，则将内存中的值更新为新值。
- 失败重试：如果不相等，说明有其他线程已经修改了该值，CAS 操作失败，一般会利用重试，直到成功。

## 扩展知识

### 举例说明

我们经常有累加需求，比较一个值是否等于 1，如果等于 1 我们将它替换成 2，如果等于 2 替换成 3。

这种比较在多线程的情况下就不安全，比如此时同时有两个线程执行到比较值是否等于 1，然后两个线程发现都等于 1。

然后两个线程都将它变成了 2，这样明明加了两次，值却等于 2。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/q7ICGVwa_image_mianshiya.png" alt="image.png" width="421px" />

这种情况其实加锁可以解决，但是加锁是比较消耗资源的。

因此硬件层面就给予支持，将这个比较和交换的动作封装成一个指令，这样就保证了原子性，不会判断值确实等于 1，但是替换的时候值已经不等于 1了。

这指令就是 CAS。

CAS 需要三个操作数，分别是旧的预期值(图中的1)，变量内存地址(图中a的内存地址)，新值(图中的2)。

指令是根据变量地址拿到值，比较是否和预期值相等，如果是的话则替换成新值，如果不是则不替换。

### CAS 的优缺点

优点：
- 无锁并发：CAS 操作不使用锁，因此不会导致线程阻塞，提高了系统的并发性和性能。
- 原子性：CAS 操作是原子的，保证了线程安全。

缺点：
- ABA 问题：CAS 操作中，如果一个变量值从 A 变成 B，又变回 A，CAS 无法检测到这种变化，可能导致错误。
- 自旋开销：CAS 操作通常通过自旋实现，可能导致 CPU 资源浪费，尤其在高并发情况下。
- 单变量限制：CAS 操作仅适用于单个变量的更新，不适用于涉及多个变量的复杂操作。

### ABA 问题

ABA 问题是指当变量值从 A 变为 B 再变回 A 时，CAS 操作无法检测到这种变化。解决 ABA 问题的一种常见方法是引入版本号或时间戳，每次更新变量时同时更新版本号，从而检测到变量的变化。

Java 中的 `AtomicStampedReference` 就提供了版本号解决方案，它内部提供了一个 Pair 封装了引用和版本号，利用 `volatile` 保证了可见性。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/mvcA75wT_image_mianshiya.png" alt="image.png" width="100%" />


在内部 CAS 中，添加了版本号的对比：

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/Ph924xai_image_mianshiya.png" alt="image.png" width="100%" />

这样就避免的 ABA 的问题。简单使用示例如下：

```java
    private AtomicStampedReference<Integer> atomicStampedReference = new AtomicStampedReference<>(0, 0);

    public void updateValue(int expected, int newValue) {
        int[] stampHolder = new int[1];
        Integer currentValue = atomicStampedReference.get(stampHolder);
        int currentStamp = stampHolder[0];

        boolean updated = atomicStampedReference.compareAndSet(expected, newValue, currentStamp, currentStamp + 1);
        if (updated) {
            System.out.println("Value updated to " + newValue);
        } else {
            System.out.println("Update failed");
        }
    }
```

Java 还提供了一个 `AtomicMarkableReference` 类，原理和 `AtomicStampedReference` 类似，差别就是它内部只要一个 bool 值，只能表示数据是否被修改过。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/XBpKXTks_image_mianshiya.png" alt="image.png" width="100%" />

而`AtomicStampedReference` 中的 stamp 是int，可以表现数据被修改了几次。其它原理都是一致的。
 
### CAS 在 Java 中的实现

在 Java 中，CAS 操作由 `sun.misc.Unsafe` 类提供，**但该类是内部类**，不推荐直接使用。具体是通过 JNI（Java Native Interface）调用这些底层的硬件指令来实现 CAS 操作，从而确保操作的原子性。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/sGcSIEVy_image_mianshiya.png" alt="image.png" width="100%" />

在 Java 中，可以使用并发包中 Atomic 类（如 AtomicInteger、AtomicLong 等），这些类封装了 CAS 操作，提供了线程安全的原子操作：

```java
 boolean updated = atomicInteger.compareAndSet(expected, newValue);
    if (updated) {
        System.out.println("Value updated to " + newValue);
    } else {
        System.out.println("Update failed");
    }
```

CAS 操作的底层实现依赖于硬件的原子指令，如 x86 架构上的 cmpxchg 指令。

在 JDK9 之前，会根据当前处理器是否是多处理器在 cmpxchg 前加上 lock 前缀，给对应写指令的内存区域加锁，使得其它处理器无法读写这块内存区域，保证指令执行的原子性。如果是单处理器则不会添加 lock 前缀指令。

但是 JDK9 移除了这个判断，直接添加 lock 前缀指令（基本上市面上都是多处理器了）。

### CAS 总线风暴

lock 前缀指令会把写缓冲区中的所有数据立即刷新到主内存中。

在对称多处理器架构下，每个 cpu 都会通过嗅探总线来检查自己的缓存是否过期。如果某个 cpu 刷新自己的数据到主存，就会通过总线通知其它 cpu 过期对应的缓存，这就实现了内存屏障，保证了缓存一致性。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/AiNnhu94_image_mianshiya.png" alt="image.png" width="100%" />

而通过总线来回通信称为 cache 一致性流量。因为都需要通过总线通信，如果这个流量过大，总线就会成为瓶颈，导致本地缓存更新延迟。

如果 CAS 修改同一个变量并发很高，就会导致总线风暴。这也是 CAS 高并发下的一个性能瓶颈。







> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)