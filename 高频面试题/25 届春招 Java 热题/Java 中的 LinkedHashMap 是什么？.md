## Java 中的 LinkedHashMap 是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
LinkedHashMap 是 Java 集合框架中的一个实现类，它继承自 HashMap，并且**保留了键值对的插入顺序或访问顺序**。

它内部是通过维护了一个双向链表来记录元素的插入顺序或访问顺序。

**使用场景：**
- 缓存实现：可以根据访问顺序移除最久未使用的元素，常用于 LRU（Least Recently Used）缓存。
- 数据存储：需要保持元素插入顺序的场景。


## 扩展知识

### 插入顺序或访问顺序

LinkedHashMap 提供了多个构造方法，包括默认构造方法和带有访问顺序选项的构造方法。通过指定 accessOrder 参数为 true，可以让 LinkedHashMap 以访问顺序排序，而不是插入顺序。

### LinkedHashMap 内部实现剖析

LinkedHashMap 的父类是 HashMap，所以 HashMap 有的它都有，然后基于 HashMap 做了一些扩展。

首先它把 HashMap 的 Entry 加了两个指针：before 和 after。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/20220219203048_mianshiya.png" alt="20220219203048.png" width="100%" />

这目的已经很明显了，就是要把塞入的 Entry 之间进行关联，串成双向链表，如下图红色的就是新增的两个指针：

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/20220219203058_mianshiya.png" alt="20220219203058.png" width="100%" />

并且内部还有个 accessOrder 成员，默认是 false， 代表链表是顺序是按插入顺序来排的，如果是 true 则会根据访问顺序来进行调整，就是咱们熟知的 LRU 那种，如果哪个节点访问了，就把它移到最后，代表最近访问的节点。

具体实现其实就是 HashMap 埋了几个方法，然后 LinkedHashMap 实现了这几个方法做了操作，比如以下这三个，从方法名就能看出了：访问节点之后干啥；插入节点之后干啥；删除节点之后干啥。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/20220219203123_mianshiya.png" alt="20220219203123.png" width="100%" />

举个 afterNodeInsertion 的例子，它埋在 HashMap 的 put 里，在塞入新节点之后，会调用这个方法

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/20220219203133_mianshiya.png" alt="20220219203133.png" width="100%" />

然后 LinkedHashMap 实现了这个方法，可以看到这个方法主要用来移除最老的节点。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/20220219203142_mianshiya.png" alt="20220219203142.png" width="100%" />

看到这你能想到啥？假如你想用 map 做个本地缓存，由于缓存的数量不可能无限大，所以你就能继承 LinkedHashMap 来实现，当节点超过一定数量的时候，在插入新节点的同时，移除最老最久没有被访问的节点，**这样就实现了一个 LRU 了**。

具体做法是把 accessOrder 设置为 true，这样每次访问节点就会把刚访问的节点移动到尾部，然后再重写 removeEldestEntry 方法，LinkedHashMap 默认的实现是直接返回 true。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783397053004488705/20220219203154_mianshiya.png" alt="20220219203154.png" width="100%" />

你可以搞个：

```java
 protected boolean removeEldestEntry(Entry<K, V> eldest) {
       return this.size() > this.maxCacheSize;
 }

```

这样就简单的实现一个 LRU 了！下面展示下完整的代码，非常简单：

```java
    private static final class LRUCache<K, V> extends LinkedHashMap<K, V> {
        private final int maxCacheSize;

        LRUCache(int initialCapacity, int maxCacheSize) {
            super(initialCapacity, 0.75F, true);
            this.maxCacheSize = maxCacheSize;
        }

        protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
            return this.size() > this.maxCacheSize;
        }
    }
```

这里还能引申出一个笔试题，手写实现一个 LRU 算法，来我给你写！

```java
public class LRUCache<K,V> {
    class Node<K,V> {
        K key;
        V value;
        Node<K,V> prev, next;
        public Node(){}
        public Node(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }
    private int capacity;
    private HashMap<K,Node> map;
    private Node<K,V> head;
    private Node<K,V> tail;
    public LRUCache(int capacity) {
        this.capacity = capacity;
        map = new HashMap<>(capacity);
        head = new Node<>();
        tail = new Node<>();
        head.next = tail;
        tail.prev = head;
    }

    public V get(K key) {
        Node<K,V> node = map.get(key);
        if (node == null) {
            return null;
        }
        moveNodeToHead(node);
        return node.value;
    }

    public void put(K key, V value) {
         Node<K,V> node = map.get(key);
       if (node == null) {
            if (map.size() >= capacity) {
                map.remove(tail.prev.key);
                removeTailNode();
            }
            Node<K,V> newNode = new Node<>(key, value);
            map.put(key, newNode);
            addToHead(newNode);
        } else {
            node.value = value;
            moveNodeToHead(node);
        }
    }

    private void addToHead(Node<K,V> newNode) {
        newNode.prev = head;
        newNode.next = head.next;
        head.next.prev = newNode;
        head.next = newNode;
    }

    private void moveNodeToHead(Node<K,V> node) {
        removeNode(node);
        addToHead(node);
    }

    private void removeNode(Node<K,V> node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void removeTailNode() {
        removeNode(tail.prev);
    }

    public static void main(String[] args) {
        LRUCache<Integer,Integer> lruCache = new LRUCache<>(3);
        lruCache.put(1,1);
        lruCache.put(2,2);
        lruCache.put(3,3);
        lruCache.get(1);
        lruCache.put(4,4);
        System.out.println(lruCache); // toString 我就没贴了，代码太长了
    }
}

```

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)