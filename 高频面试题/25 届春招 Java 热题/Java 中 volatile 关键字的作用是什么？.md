## Java 中 volatile 关键字的作用是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

### **回答重点**

volatile 它的主要作用是保证变量的**可见性**和**禁止指令重排优化**。

1）**可见性（Visibility）**：
   - `volatile` 关键字确保变量的可见性。当一个线程修改了 `volatile` 变量的值，新值会立即被刷新到主内存中，其他线程在读取该变量时可以立即获得最新的值。这样可以避免线程间由于缓存一致性问题导致的“看见”旧值的现象。

2）**禁止指令重排序（Ordering）**：
   - `volatile` 还通过内存屏障来禁止特定情况下的指令重排序，从而保证程序的执行顺序符合预期。对 `volatile` 变量的写操作会在其前面插入一个 StoreStore 屏障，而对 `volatile` 变量的读操作则会在其后插入一个 LoadLoad 屏障。这确保了在多线程环境下，某些代码块执行顺序的可预测性。

## **扩展知识**

### **可见性问题与 volatile 的解决**

在 Java 的多线程环境中，每个线程都有自己的工作内存（CPU 缓存），它会从主内存中读取变量的副本进行操作。

<p align="center"><img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/AiNnhu94_image_mianshiya.png" alt="image.png" width="632" /></p>


因此，线程 A 修改了某个变量后，线程 B 不一定能立即看到这个修改。`volatile` 通过强制线程直接从主内存读取或写入变量，从而解决了可见性问题。

**示例**：在没有 `volatile` 的情况下，一个线程可能永远不会看到另一个线程对共享变量的修改：

```java
private static boolean flag = false;

public static void main(String[] args) {
  new Thread(() -> {
      while (!flag) {
          // do something
      }
      System.out.println("Thread terminated.");
  }).start();

  try {
      Thread.sleep(1000);
  } catch (InterruptedException e) {
      e.printStackTrace();
  }

  flag = true; // 没有 volatile, 这个改变对其他线程不可见
}
```

如果 `flag` 变量被声明为 `volatile`，线程 A 修改 `flag` 后，线程 B 能立即看到修改并终止循环。

### 禁止指令重排序与 volatile 的应用

Java 编译器和 CPU 为了优化性能，可能会对指令进行重排序。一般这不会影响单线程程序的正确性，但在多线程环境中，重排序可能导致意想不到的结果。

**经典双重检查锁定（Double-Checked Locking）问题**：在单例模式中，`volatile` 可以防止指令重排序，从而避免未完全初始化的对象被使用：

```java
public class Singleton {
  private static volatile Singleton instance;

  private Singleton() {}

  public static Singleton getInstance() {
      if (instance == null) {
          synchronized (Singleton.class) {
              if (instance == null) {
                  instance = new Singleton();
              }
          }
      }
      return instance;
  }
}
```

  在上面的例子中，如果不使用 `volatile`，指令重排序可能导致 `instance` 在其构造函数完成之前被返回，从而使其他线程访问到一个未初始化完全的对象。

### 注意 volatile 不能保证操作的原子性

虽然 `volatile` 保证了可见性和有序性，但它不能保证操作的原子性。原子性意味着一个操作不可分割，不能被中断。典型的例子是 `i++` 操作，这实际上分为读取 `i` 的值、递增、写回三个步骤。如果多个线程同时执行 `i++`，最终结果可能不正确，因为每个线程都可能读取到相同的初始值。

**示例**：

```java
private static volatile int count = 0;

public static void main(String[] args) {
  for (int i = 0; i < 1000; i++) {
      new Thread(() -> count++).start();
  }
  System.out.println(count); // 结果可能不为 1000
}
```

解决这个问题的方法是使用 `AtomicInteger` 或者 `synchronized` 块。

### volatile 与 synchronized 的对比

- **性能**：`volatile` 是一种轻量级的同步机制，开销较小，但它只能用于变量的可见性和禁止重排序，无法实现复杂的同步逻辑。`synchronized` 则是重量级的同步机制，可以保证代码块的原子性和可见性，但开销较大。
- **使用场景**：`volatile` 适用于简单的状态标志、标记等场景，而 `synchronized` 更适合复杂的临界区保护，需要确保多个操作的原子性时。

### Java 内存模型（JMM）与 volatile

Java 内存模型（Java Memory Model, JMM）定义了多线程环境下共享变量的可见性和指令重排序规则。`volatile` 是 JMM 的关键组成部分，提供了一种简化的方式来实现线程间的内存可见性。

JMM 中规定了以下规则：

- 对一个 `volatile` 变量的写操作，happens-before 于每一个后续对这个 `volatile` 变量的读操作。
- `volatile` 变量的操作不会与其他内存操作进行重排序。


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)