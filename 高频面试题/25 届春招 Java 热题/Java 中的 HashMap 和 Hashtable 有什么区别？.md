## Java 中的 HashMap 和 Hashtable 有什么区别？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

1）**线程安全性**：
   - **HashMap**：**非线程安全**，多线程环境下可能会产生数据不一致问题。
   - **Hashtable**：**线程安全**，内部大部分方法都使用了 `synchronized` 关键字进行同步，保证了多线程的并发安全性。

2）**性能差异**：
   - **HashMap**：由于没有线程同步开销，因此在单线程环境下性能优于 `Hashtable`。
   - **Hashtable**：由于方法的同步锁机制，性能低于 `HashMap`。由于使用全局锁的方式，使得即使是不同的操作也会被串行化。

3）**允许空值**：
   - **HashMap**：允许一个 `null` 键和多个 `null` 值。
   - **Hashtable**：不允许 `null` 键和 `null` 值，插入 `null` 键或 `null` 值时会抛出 `NullPointerException`。

4）**继承结构**：
   - **HashMap**：继承自 `AbstractMap`，是 `Map` 接口的实现类。
   - **Hashtable**：继承自 `Dictionary`（已废弃），后来也实现了 `Map` 接口。它是一种较为古老的类，在 Java 2 之后逐渐被 `HashMap` 所取代（不推荐使用）。

5）**迭代器类型**：
   - **HashMap**：使用的是**快速失败**的 `Iterator`，在迭代过程中如果对 `Map` 进行结构性修改，会抛出 `ConcurrentModificationException`。
   - **Hashtable**：使用的是**弱一致性**的 `Enumerator`，虽然也不建议在迭代过程中修改 `Map`，但不会抛出 `ConcurrentModificationException`。

## 扩展知识

### **ConcurrentHashMap vs Hashtable**：
   - **ConcurrentHashMap** 是 `Hashtable` 的替代方案。它在实现线程安全的同时，通过分段锁机制提高了并发性能，避免了全局锁导致的性能瓶颈。适用于高并发环境。
   - `ConcurrentHashMap` 的读操作无锁化，写操作则使用了局部锁分段，使得在高并发下性能大大优于 `Hashtable`。

### ConcurrentHashMap 相关面试题

- [461. Java 中 ConcurrentHashMap 1.7 和 1.8 之间有哪些区别？](https://www.mianshiya.com/bank/1788408712975282177/question/1780933294813114369)
- [462. Java 中 ConcurrentHashMap 的 get 方法是否需要加锁？](https://www.mianshiya.com/bank/1788408712975282177/question/1780933294829891585)
- [463. 为什么 Java 的 ConcurrentHashMap 不支持 key 或 value 为 null？](https://www.mianshiya.com/bank/1788408712975282177/question/1780933294834085890)

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)