# fail-fast 机制是什么？

> 作者：[ONE PIECE](https://blog.csdn.net/weixin_51675464?type=blog)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 2020

Java中有个fail-fast错误检测机制，一旦检测到可能发生错误，就会立马抛出异常，程序不能继续执行下去。

先来看看下面的三段代码，你觉得有哪几个会报错，那几个会正确输出list

```java
List<String> list = new ArrayList<>();
        list.add("2");
        list.add("2");
        for(String str:list){
            if("2".equals(str)){
                list.remove(str);
            }
        }
        System.out.println(list);
List<String> list = new ArrayList<>();
        list.add("2");
        list.add("2");
        list.add("3");
        for(String str:list){
            if("2".equals(str)){
                list.remove(str);
            }
        }
        System.out.println(list);
List<String> list = new ArrayList<>();
        list.add("1");
        list.add("2");
        list.add("3");
        for(String str:list){
            if("2".equals(str)){
                list.remove(str);
            }
        }
        System.out.println(list);
    }
```

先公布答案 上面上段代码执行结果分别是： `[2]`

```Exception
	at java.util.ArrayList$Itr.checkForComodification(ArrayList.java:911)
	at java.util.ArrayList$Itr.next(ArrayList.java:861)
	at com.xmz.test.Test.main(Test.java:16)
[1, 3]
```

## 先说正确规范

在阿里巴巴手册中明确规定了，不要在foreach中使用`remove\add`操作。 ![](https://pic.yupi.icu/5563/202311300826859.png)

## 【问题】为什么上面代码1，3没问题？2会抛异常

**异常的原因**： 因为增强for循环是根据迭代器遍历的，在循环中修改集合大小，会导致迭代器中的数据不一致，可能导致错误。 Java中有个fail-fast错误检测机制，一旦检测到可能发生错误，就会立马抛出异常，程序不能继续执行下去。 **1和3为什么不报异常？** 因为在某些特殊情况下，`list.remove(str)`可以在不触发`fail-fast`机制的情况下删除元素。 例如在上面的第一、三两个代码中，我们删除的是列表中的倒数第二个元素，那么就不会抛出异常，因为这种情况下，删除了元素，同时也改变了列表的大小，使得列表的大小和当前的cursor的大小一样，因此就不会执行`checkForComodification()`方法，也就不会抛出异常。

## 【方案】怎么在集合中正确使用`remove\add`操作

### 方案一、使用普通for循环进行操作

```java
 List<String> list = new ArrayList<>();
        list.add("2");
        list.add("2");
        list.add("3");
        for (int i = 0; i < list.size(); i++) {
            if("2".equals(list.get(i))){
                list.remove(list.get(i));
            }
        }
        System.out.println(list);
```

但是这种方案在remove的时候，会存在漏删的情况。 输出结果：`[2, 3]`

### 方案二、使用Iterator提供的remove方法。

这也就是在阿里巴巴开发手册中的方法

```java
List<String> list = new ArrayList<>();
        list.add("2");
        list.add("2");
        list.add("3");
        Iterator<String> iterator = list.iterator();
        while (iterator.hasNext()){
            String str = iterator.next();
            if("2".equals(str)){
                iterator.remove();
            }
        }
        System.out.println(list);
```

输出结果：`[3]` 这是最正确的方案

### 方案三、使用filter过滤

```java
List<String> list = new ArrayList<>();
        list.add("2");
        list.add("2");
        list.add("3");
        list = list.stream().filter(str -> !"2".equals(str)).collect(Collectors.toList());
        System.out.println(list);
```

输出结果：`[3]`

### 方案四、使用增强for循环也可以，但是每次要break

如果这个集合中只有一个我们要删除的元素，就可以使用这种方案，像set集合，如果list集合里面有多个要删除的元素，最终只能成功删除第一个

```java
List<String> list = new ArrayList<>();
        list.add("1");
        list.add("2");
        list.add("3");
        for(String str:list){
            if("1".equals(str)){
                list.remove(str);
                break;
            }
        }
        System.out.println(list);
```

输出结果：`[2, 3]`

### 方案五、使用fail-fast集合类

在Java中，有一些fail-fast机制的集合类。这样的集合容器在遍历时不是直接在集合内容上访问的，而是先复制原有集合内容，在拷贝的集合上进行遍历。 由于在迭代时是对原集合的拷贝进行遍历，所以在遍历过程中对原集合所作的修改并不能背迭代器检测到。

```java
        ConcurrentLinkedDeque<String> concurrentLinkedDeque = new ConcurrentLinkedDeque<>();
        concurrentLinkedDeque.add("2");
        concurrentLinkedDeque.add("2");
        concurrentLinkedDeque.add("3");
        for(String str:concurrentLinkedDeque){
            if("2".equals(str)){
                concurrentLinkedDeque.remove(str);
            }
        }
        System.out.println(concurrentLinkedDeque);
```

### 参考文章

[参考文章：什么是fail-fast](https://www.cnblogs.com/54chensongxia/p/12470446.html)