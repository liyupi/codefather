# 面试超高频考点：HashMap 源码逐行解析

> 作者：[樵豆包子](https://www.codefather.cn)，[编程导航](https://www.codefather.cn) 编号 33181

## 总览

HashMap 实现了 Map 接口。这种实现提供了各种映射操作，并允许有空值和空键。（HashMap类大致相当于Hashtable，只是它是非同步的，并且允许有空值。）HashMap 不能保证映射的顺序；特别是，它不保证顺序会随时间保持不变（比如在 resize 时会重新计算 hash，元素的存储位置会改变）。

HashMap 为基本操作（get和put）提供了常量时间的性能。而迭代 HashMap 需要的时间与 HashMap 实例的“容量”（桶的数量）加上其大小（键值对的数量）成正比。因此如果迭代性能很重要，就不要将初始容量设置得太高（或者将负载因子设置得太低）。

HashMap 有两个与性能有关的参数：初始容量和负载因子。初始容量就是在创建哈希表时的桶的数量，也就是数组的大小。负载因子是在数组中填充键值对的最大程度，可以理解为数组被填充的最大密度。当哈希表中的条目数量（键值对的数量）超过负载因子和当前容量的乘积时，哈希表将进行扩容，使哈希表的容量加倍，其中的每一个键值对都要根据键值重新哈希，并且转移到新的位置上。

一般来说，默认的负载因子（0.75）在时间和空间成本之间提供了良好的折衷。更高的值减少了空间开销，但增加了查找成本（反映在HashMap类的大多数操作中，包括get和put）。在设置其初始容量时，应考虑映射中预期的键值对数量及其负载因子，以尽量避免 HashMap 的扩容操作。如果初始容量大于条目数量除以负载因子的最大值，那么将永远不会发生扩容操作。

如果多个键返回相同的 hashCode 值，即它们在哈希表的哈希函数下产生哈希冲突，这将降低哈希表的性能。哈希表的效率很大程度上依赖于其能够将元素均匀分布在不同的桶中。当多个键产生相同的哈希值时，它们会被存放在同一个桶中，这会导致该桶中的元素数量过多，从而增加了查找、插入和删除操作的时间复杂度。

为了缓解由于哈希冲突导致的性能下降问题，当键实现了 Comparable 接口时（即键是可比较的），如果两个键的哈希值相同，哈希表可以通过比较它们的大小顺序来决定它们在桶中的存储位置，从而减少冲突的可能性，提高性能。

## 关键变量

1. `table`：用于存储键值对的数组，是 HashMap 的核心数据结构。
2. `size`：HashMap 中当前存储的键值对数量。
3. `threshold`：HashMap 在进行扩容之前的容量阈值，等于 table.length * loadFactor。
4. `loadFactor`：负载因子，用于控制 HashMap 在何时进行扩容，默认为 0.75.
5. `DEFAULT_INITIAL_CAPACITY` = 16：HashMap 默认的初始容量。
6. `MAXIMUM_CAPACITY = 1 << 30`：HashMap 中容量的最大限制。
7. `TREEIFY_THRESHOLD = 8`：链表转换为红黑树的阈值，当链表长度大于等于这个值时，会将链表转换为红黑树。
8. `UNTREEIFY_THRESHOLD = 6`：红黑树转换为链表的阈值，当红黑树节点数量小于等于这个值时，会将红黑树转换为链表。
9. `MIN_TREEIFY_CAPACITY = 64`：当桶中的节点数大于等于这个值时，桶中的链表将转换为红黑树。

## 关键内部类

HashMap 中的节点类，实现了 Map.Entry 接口，是数组中存储的对象。

```java
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash; // 存储键的哈希值
    final K key; // 键
    V value; // 值
    Node<K,V> next;
    // 成员方法略
}
```

## 关键方法

## 构造方法

```java
/**
 * 构造方法
 * 
 * @param initialCapacity 初始容量
 * @param loadFactor 负载因子
 */
public HashMap(int initialCapacity, float loadFactor) {
    // 检查参数合法性
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
    // 如果初始容量大于 HashMap 容量的最大限制，则将初始容量设为最大容量                                       initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                           loadFactor);
    this.loadFactor = loadFactor;
    // 这里的存放到 threshold 中的值并不是容量阈值
    // 这里用 threshold 临时存储容量，也就是数组大小，用于初始化时使用
    // HashMap 的长度是 2 的幂，通过 tableSizeFor 方法计算得到
    this.threshold = tableSizeFor(initialCapacity);
}
```

## 扰动函数

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

为什么要用扰动函数？

答：扰动函数就是减少碰撞问题。HashMap 在计算键值对在数组中的下标时，使用的公式是

```ini
                                i = (n - 1) & hash
```

通过使用位运算实现了哈希值到数组下标的映射，而不是一般的取余。这样计算有一个前提，即 n 是 2 的幂，因此 （n - 1）的所有二进制位上都是 1，再进行按位与运算，确保得到的数全部小于 n

以数组长度 16 为例，计算某个哈希值为 10101010 在数组中的下标：

n - 1 = 16 - 1 = 15 的 2进制表示是 00001111 和 10101010 进行按位与运算结果为 00001010 也就是 10，实现了哈希值到数组下标的映射。

但是在这种情况下，得到的结果就是截取了最低的四位值，而舍弃了其他位上的信息。这样就算散列值分布再松散，要是只取最后几位的话，哈希碰撞也会很严重。如果散列本身做得不好，分布上成等差数列的漏洞，恰好使最后几个低位呈现规律性重复，则碰撞会更严重。因此使用扰动函数来解决这个问题。

扰动函数主要包括三步：

1. 使用 key.hashCode() 计算键值的哈希值并赋值给变量 h
2. 将 h 向无符号右移 16 位
3. 将变量 h 和向右移16位的 h 做异或运算

这样右移 16 位正好为 32bit 的一半，也就是自己的高半区和低半区做异或，从而混合原始哈希的高位和低位，来加大低位的随机性。而且混合后的低位掺杂了高位的部分特征，使高位的信息也被保留下来。

## resize 扩容

```java
/**
 * 对哈希表进行扩容或初始化操作。
 * 扩容时，会将原有的键值对重新分配到新的数组中，并更新容量阈值。
 *
 * @return 扩容或初始化后的新数组
 */
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table; // 原哈希表数组
    int oldCap = (oldTab == null) ? 0 : oldTab.length; // 原数组容量
    int oldThr = threshold; // 原容量阈值
    int newCap, newThr = 0; // 新数组容量、新容量阈值

    // 处理数组已经初始化好的情况
    // 如果原数组容量大于 0
    if (oldCap > 0) {
        // 如果原数组容量已达到最大容量上限
        if (oldCap >= MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE; // 将容量阈值设置为最大值
            return oldTab; // 返回原数组
        }
        // 如果扩容后没超过最大容量
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // 扩充容量阈值为原来的两倍
    }
    // 处理还没有初始化数组的情况
    // 如果原数组容量为 0，但初始容量阈值大于 0
    else if (oldThr > 0)
        newCap = oldThr; // 使用了执行构造方法时在 threshold 中暂存的容量
    else { // 如果既没有原数组也没有初始容量阈值
        newCap = DEFAULT_INITIAL_CAPACITY; // 新容量设为默认初始容量
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY); // 计算新容量阈值
    }

    // 如果新容量阈值仍为 0，根据新容量和负载因子计算新容量阈值
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }

    threshold = newThr; // 更新容量阈值

    @SuppressWarnings({"rawtypes","unchecked"})
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap]; // 创建新数组
    table = newTab; // 更新哈希表数组

    // 如果原数组为空，说明正在执行初始化，直接返回创建好的新数组
    // 如果原数组不为空，说明正在扩容，将原数组中的键值对重新分配到新数组中
    if (oldTab != null) {
        // 遍历原数组
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            // 如果当前桶中有节点
            if ((e = oldTab[j]) != null) {
                // 清空桶
                oldTab[j] = null;
                // 如果桶中只有一个节点
                // 也就是节点不是链表头节点或树的根节点
                if (e.next == null)
                    // 直接移动当前节点
                    newTab[e.hash & (newCap - 1)] = e;
                // 节点是树节点，调用树节点的拆分方法
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // 当前节点是链表的头节点
                    // 两个新的链表头和链表尾
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    // 将原链表进行拆分
                    // 由于新容量是旧容量的两倍，因此在计算下标时会多截取一位
                    // 多截取的一位只能是 0 或者 1
                    // 因此当前链表在新的 HashMap 中会被分到两个桶中
                    // 遍历链表
                    do {
                        next = e.next;
                        // oldCap 是 2 的幂，只在多截取的那一位上是 1
                        // 如果多截取的位上是 0
                        // 把当前节点接到新链表 1 的尾
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        } else { // 把当前节点接到新链表 2 的尾
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    // 将两个链表放入新数组的相应位置
                    if (loTail != null) {
                        loTail.next = null;
                        // hash 值不变，多截取的位上是 0
                        // 因此在新数组中的下标不变
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) {
                        hiTail.next = null;
                        // hash 值不变，多截取的位上是 1
                        // 因此新的下标 = 旧下标 + 旧数组容量
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab; // 返回新数组
}
```

## put 方法

```java
/**
 * 将指定的键值对插入到哈希表中。
 *
 * @param hash 键的哈希值
 * @param key 要插入的键
 * @param value 要插入的值
 * @param onlyIfAbsent 如果为 true，则只有在键不存在时才插入
 * @param evict 如果为 false，则表示哈希表处于创建模式，一般情况下为 true
 * @return 如果修改了已有键值对中的值，则返回旧值；否则返回 null
 */
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; // 哈希表数组
    Node<K,V> p; // 当前节点
    int n, i; // 哈希表长度、计算的数组下标

    // 如果哈希表数组为空或长度为 0，则进行初始化
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;

    // 计算数组下标并获取对应位置的节点
    if ((p = tab[i = (n - 1) & hash]) == null)
        // 如果该位置为空，则直接插入新节点
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; // 临时节点，用于存放有相同键的节点
        K k; // 临时键

        // 如果该位置已经存在与要插入的键相同的节点，则修改该节点
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        // 如果该位置的节点是树节点，则调用树节点的插入方法
        // 如果有相同的键，插入方法返回对应的节点；否则返回 null
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            // 遍历以当前节点位链表头的链表，并且计算链表上的节点数
            for (int binCount = 0; ; ++binCount) {
                // 如果遍历到链表尾仍未找到
                if ((e = p.next) == null) {
                    // 在链表尾插入新的节点
                    p.next = newNode(hash, key, value, null);
                    // 如果链表长度达到了转化为树的阈值，则进行树化操作
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                // 如果找到了与要插入的键相同的节点，则跳出循环，准备修改当前节点
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                // p = p.next
                p = e;
            }
        }

        // 如果找到了与要插入的键相同的节点
        if (e != null) {
            // 存储旧值，最后返回
            V oldValue = e.value;
            // 如果允许覆盖或者原值为空，则更新值
            // onlyIfAbsent 如果为 true，则只有在键不存在时才插入
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            // 执行节点访问后的操作，是一个回调函数
            // 用于 LinkedList 的功能实现，在 HashMap 中是空方法，详解见下文
            afterNodeAccess(e);
            // 返回旧值
            return oldValue;
        }
    }

    // 哈希表修改次数加 1
    ++modCount;
    // 如果键值对数量超过了阈值，则进行扩容
    if (++size > threshold)
        resize();
    // 在 HashMap 中是空方法，详解见下文
    afterNodeInsertion(evict);
    // 返回 null
    return null;
}
在 HashMap 中有部分方法是用来给子类做扩展使用的，比如
void afterNodeAccess(Node<K,V> p) { }
void afterNodeInsertion(boolean evict) { }
void afterNodeRemoval(Node<K,V> p) { }
他们在 HashMap 中都是空方法，用于给 LinkedHashMap 做额外处理的方法，LinkedHashMap 继承 HashMap 后重写这些回调函数就可以在 HashMap 的原始操作中增加额外处理。
源码注释如下：
The following package-protected methods are designed to be overridden by LinkedHashMap, but not by any other subclass.
```

## get 方法

```java
/**
 * 获取指定键对应的值
 * @param key 键
 * @return 如果存在指定键对应的值，则返回该值；否则返回 null
 */
public V get(Object key) {
    // 从哈希表中获取指定键对应的节点
    Node<K,V> e;
    // 调用 getNode 方法获取节点
    return (e = getNode(key)) == null ? null : e.value;
}

/**
 * get 和相关方法的具体实现
 * @param key 键
 * @return 键值对节点，如果不存在对应键则返回 null
 */
final Node<K,V> getNode(Object key) {
    // 哈希表数组、第一个节点、当前节点、哈希表长度、键的哈希值、键
    Node<K,V>[] tab; 
    Node<K,V> first, e; 
    int n, hash; 
    K k;
    // 检查哈希表是否为空且长度大于 0，并获取指定下标位置上的第一个节点
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & (hash = hash(key))]) != null) {
        // 检查第一个节点是否就是所需节点
        if (first.hash == hash && 
            ((k = first.key) == key || (key != null && key.equals(k))))
            return first;
        // 如果第一个节点不是所需节点，且有后续节点，则遍历链表或树查找节点
        if ((e = first.next) != null) {
            // 如果第一个节点是树节点，则调用树节点的查找方法
            if (first instanceof TreeNode)
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);
            // 如果第一个节点是链表节点，遍历链表查找节点
            do {
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    // 未找到所需节点，返回 null
    return null;
}
```

## 总结

1. HashMap 有两个重要参数，初始容量和负载因子（默认为 0.75）。初始容量就是在创建哈希表时的桶的数量，也就是数组的大小。负载因子是在数组中填充键值对的最大程度，可以理解为数组被填充的最大密度，当键值对数量大于数组容量乘负载因子时数组会进行扩容。
2. 构造函数并不负责底层数组的实例化。
3. resize 方法整合了数组的初始化以及扩容操作，且无论是扩容还是初始化都需要实例化新的数组并且赋值给 table 属性。
4. put 方法执行时，根据哈希值找到数组下标，如果数组当前位置为空，则直接放入新的键值对。否则则比较数组中的元素的键是否相同，如果键相同就直接覆盖。如果不同，再根据结点是链表还是红黑树执行不同的遍历方法。