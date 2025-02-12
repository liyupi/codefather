## 什么是 Java 中的 ABA 问题？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## **回答重点**

**ABA 问题**是指在多线程环境下，某个变量的值在一段时间内经历了从 A 到 B 再到 A 的变化，这种变化可能被线程误认为值没有变化，从而导致错误的判断和操作。ABA 问题常发生在使用 **CAS（Compare-And-Swap）** 操作的无锁并发编程中。

> 补充解释 CAS ABA 问题影响

CAS 是一种无锁算法，用于在多线程环境下实现原子操作。它通过比较内存中的值是否与预期值一致，来决定是否更新变量的值。在这种机制下，如果一个线程读取到的变量值是 A，而在它执行 CAS 操作之前，另一个线程将该变量的值从 A 改成 B 然后又改回 A，**那么第一个线程会认为变量的值没有变化，从而错误地进行下一步操作**。


## **扩展知识**

### ABA 问题的示例

假设有一个简单的无锁栈，其 `pop` 操作如下：

```java
public class LockFreeStack<T> {
    private AtomicReference<Node<T>> head = new AtomicReference<>();

    public T pop() {
        Node<T> oldHead;
        Node<T> newHead;
        do {
            oldHead = head.get();
            if (oldHead == null) {
                return null;
            }
            newHead = oldHead.next;
        } while (!head.compareAndSet(oldHead, newHead));
        return oldHead.value;
    }
}
```

在这种实现中，如果线程 A 读取了 `oldHead`，此时另一个线程 B 修改了栈的内容，将 `oldHead` 移除（即将栈顶元素从 A 变为 B，又变为 A），当线程 A 再次执行 `compareAndSet` 时，尽管值是一样的（即 `oldHead` 没有变化），但实际上栈的状态已经被修改过，这可能导致数据一致性问题。

### 解决 ABA 问题的方法

**1）引入版本号**：

最常见的解决 ABA 问题的方法是使用版本号。在每次更新一个变量时，不仅更新变量的值，还更新一个版本号。CAS 操作在比较时，除了比较值是否一致，还比较版本号是否匹配。这样，即使值回到了初始值，版本号的变化也能检测到修改。

Java 中的 `AtomicStampedReference` 提供了版本号机制来避免 ABA 问题。

```java
AtomicStampedReference<Integer> stampedRef = new AtomicStampedReference<>(1, 0);
int[] stampHolder = new int[1];
Integer ref = stampedRef.get(stampHolder);
```

   在这段代码中，每次更新 `stampedRef` 时，都会一起更新对应的版本号（或“戳”）。通过检查版本号，能够有效防止 ABA 问题。

**2）使用 `AtomicMarkableReference`**：

这是另一种类似的机制，它允许在引用上标记一个布尔值，帮助区分是否发生了特定变化。虽然不直接使用版本号，但标记位可以用来追踪状态的变化。

```java
AtomicMarkableReference<Integer> markableRef = new AtomicMarkableReference<>(1, false);
```

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)