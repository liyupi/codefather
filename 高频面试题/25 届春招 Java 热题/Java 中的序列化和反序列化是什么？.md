## Java 中的序列化和反序列化是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
### 序列化

是将对象转换为字节流的过程，这样对象可以通过网络传输、持久化存储或者缓存。Java 提供了 `java.io.Serializable` 接口来支持序列化，只要类实现了这个接口，就可以将该类的对象进行序列化。

### 反序列化

是将字节流重新转换为对象的过程，即从存储中读取数据并重新创建对象。

### 其它
- **应用场景**：包括网络传输、远程调用、持久化存储（如保存到文件或数据库）、以及分布式系统中数据交换。
- **Java 序列化关键类和接口**：`ObjectOutputStream` 用于序列化，`ObjectInputStream` 用于反序列化。类必须实现 `Serializable` 接口才能被序列化。
- **transient 关键字**：在序列化过程中，有些字段不需要被序列化，例如敏感数据，可以使用 `transient` 关键字标记不需要序列化的字段。
- **serialVersionUID**：每个 `Serializable` 类都应该定义一个 `serialVersionUID`，用于在反序列化时验证版本一致性。如果没有明确指定，Java 会根据类的定义自动生成一个 UID，版本不匹配可能导致反序列化失败。
- **序列化性能问题**：Java 的默认序列化机制可能比较慢，尤其是对于大规模分布式系统，可能会选择更加高效的序列化框架（如 Protobuf、Kryo）。
- **安全性**：反序列化是一个潜在的安全风险，因为通过恶意构造的字节流，可能会加载不安全的类或执行不期望的代码。因此，反序列化过程需要进行输入验证，避免反序列化漏洞。

## 扩展知识

### 序列化与反序列化理解

序列化其实就是将对象转化成可传输的字节序列格式，以便于存储和传输。 

因为对象在 JVM 中可以认为是“立体”的，会有各种引用，比如在内存地址 Ox1234 引用了某某对象，那此时这个对象要传输到网络的另一端时候就需要把这些引用“压扁”。

因为网络的另一端的内存地址 Ox1234 可以没有某某对象，所以传输的对象需要包含这些信息，然后接收端将这些扁平的信息再反序列化得到对象。

所以，**反序列化就是将字节序列格式转换为对象的过程**。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1772087337535152129/xbVYRn0Y_a8d32fe2-c98d-4240-a9c8-9961b259a2b7_mianshiya.png" alt="" width="100%" />

### Java 序列化 Serializable 的意义

> 首先说一下 Serializable，这个接口没有什么实际的含义，就是起标记作用。 

来看下源码就很清楚了，除了 String、数组和枚举之外，如果实现了这个接口就走 writeOrdinaryObject ，否则就序列化就抛错。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/image-20210228112426413_mianshiya.png" alt="image-20210228112426413.png" width="100%" />

> serialVersionUID 又有什么用？

`private static final long serialVersionUID = 1L;`

想必经常会看到这样的代码，这个 ID 其实就是用来验证序列化的对象和反序列化对应的对象的 ID 是否是一致的。

所以这个 ID 的数字其实不重要，无论是 1L 还是 idea 自动生成的，只要序列化的时候对象的 serialVersionUID 和反序列化的时候对象的 serialVersionUID 一致的话就行。

如果没有显式指定 serialVersionUID ，则编译器会根据类的相关信息自动生成一个，可以认为是一个指纹。

所以如果你没有定义一个 serialVersionUID 然后序列化一个对象之后，在反序列化之前把对象的类的结构改了，比如增加了一个成员变量，则此时的反序列化会失败。

因为类的结构变了，生成的指纹就变了，所以 serialVersionUID 就不一致了。

**所以 serialVersionUID 就是起验证作用**。

> Java 序列化不包含静态变量

简单地说就是序列化之后存储的内容不包含静态变量的值，看一下下面的代码就很清晰了。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/VOUh1Ohj_image_mianshiya.png" alt="image.png" width="733" />



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)