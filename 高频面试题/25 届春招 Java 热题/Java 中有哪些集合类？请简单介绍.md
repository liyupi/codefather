## Java 中有哪些集合类？请简单介绍
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

### 回答重点

Java 中的集合类主要分为两大类：Collection 接口和 Map 接口。前者是存储对象的集合类，后者存储的是键值对（key-value）。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/20220219202800_mianshiya.png" alt="20220219202800.png" width="100%" />

Collection 接口下又分为 List、Set 和 Queue 接口。每个接口有其具体实现类。以下是主要的集合类：

#### List 接口：

- ArrayList：基于动态数组，查询速度快，插入、删除慢。
- LinkedList：基于双向链表，插入、删除快，查询速度慢。
- Vector：线程安全的动态数组，类似于 ArrayList，但开销较大。

#### Set 接口：

- HashSet：基于哈希表，元素无序，不允许重复。
- LinkedHashSet：基于链表和哈希表，维护插入顺序，不允许重复。
- TreeSet：基于红黑树，元素有序，不允许重复。

所以网上有些说 Set 是无序集合非常不准确，因为需要看具体的实现类。

#### Queue 接口：

- PriorityQueue：基于优先级堆，元素按照自然顺序或指定比较器排序。
- LinkedList：可以作为队列使用，支持 FIFO（先进先出）操作。

#### Map 接口：

存储的是键值对，也就是给对象（value）设置了一个 key，这样通过 key 可以找到那个 value。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/20220219202845_mianshiya.png" alt="20220219202845.png" width="386px" />

- HashMap：基于哈希表，键值对无序，不允许键重复。
- LinkedHashMap：基于链表和哈希表，维护插入顺序，不允许键重复。
- TreeMap：基于红黑树，键值对有序，不允许键重复。
- Hashtable：线程安全的哈希表，不允许键或值为 null。
- ConcurrentHashMap：线程安全的哈希表，适合高并发环境，不允许键或值为 null。

> 这题一般会在面试刚开始的时候被问，主要用于暖场热身，不需要说的那么详细，大致讲下，面试官会根据你回答的点继续挖的。


PS：可尝试结合类图，对常见的实现类关系重点记忆，面试时可对自己擅长的实现类详细介绍或引导，也可做一定的取舍。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1816450440005341186/pLwh6DJV_image_mianshiya.png" alt="image.png" width="100%" />

注意类图中“接口-->抽象类 -->实现类”的整体框架，可以体现一点 Java 的设计理念，可根据此记忆也可根据此在面试的时候详细说明，可延展出 Java 的接口和抽象类的区别。

### 扩展：LinkedHashMap


[什么是 Java 的 LinkedHashMap？](https://www.mianshiya.com/bank/1788408712975282177/question/1780933294783754241)

### 扩展：TreeMap

[什么是 Java 的 TreeMap？](https://www.mianshiya.com/bank/1788408712975282177/question/1780933294796337153)





> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)