 # Java 8 新特性：Stream 流快速入门

> 作者：[可柠](https://wx.zsxq.com/dweb2/index/footprint/212822221215421)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 31010

### 前言

在 java 中，涉及到对数组、集合等集合类元素的操作时，通常我们使用的是循环的方式进行逐个遍历处理，或者使用 stream 流的方式进行处理。

### 什么是 Stream？

Stream（流）是一个来自数据源的元素队列并支持聚合操作,流在管道中传输， 并且可以在管道的节点上进行处理， 比如筛选， 排序，聚合等。 Stream（流）的组成包含:元素、数据源、聚合操作、内部迭代、Pipelining等。

### 创建 Stream 流

1）stream()

```java
Stream<String> stream = stringList.stream();
```

2）parallelStream()

```java
Stream<String> stringStream = stringList.parallelStream();
```

### Stream 流常用操作

1）forEach 

```java
stringList.forEach(System.out::println);
```

2）map

```java
stringList.stream().map(i->i.equals("juejin"));
```

3）filter

```java
stringList.stream().filter(i->i.equals("juejin"));
```

4）limit

```java
integerList.stream().limit(3);
```

5）skip

```java
integerList.stream().skip(5).limit(3);
```

6）distinct

```java
integerList.stream().distinct().collect(Collectors.toList());
```

7）sorted

```java
integerList.stream().sorted();
```

8）sorted(Comparator com)

```java
integerList.stream().sorted(Comparator.comparing(Integer::intValue));
```

9）Collectors 收集器

![](https://pic.yupi.icu/5563/202401242026474.png)

- 恒等处理 Collectors

所谓**恒等处理**，指的就是Stream的元素在经过Collector函数处理前后完全不变，例如toList()操作，只是最终将结果从Stream中取出放入到List对象中，并没有对元素本身做任何的更改处理

```java
list.stream().collect(Collectors.toList());
list.stream().collect(Collectors.toSet());
list.stream().collect(Collectors.toCollection());
```

- 归约汇总 Collectors

对于**归约汇总**类的操作，Stream流中的元素逐个遍历，进入到Collector处理函数中，然后会与上一个元素的处理结果进行合并处理，并得到一个新的结果，以此类推，直到遍历完成后，输出最终的结果

| counting     | 统计流中的元素个数                                           |
| ------------ | ------------------------------------------------------------ |
| summingInt   | 计算流中指定int字段的累加总和。针对不同类型的数字类型，有不同的方法，比如summingDouble等 |
| averagingInt | 计算流中指定int字段的平均值。针对不同类型的数字类型，有不同的方法，比如averagingLong等 |
| joining      | 将流中所有元素（或者元素的指定字段）字符串值进行拼接，可以指定拼接连接符，或者首尾拼接字符 |
| maxBy        | 根据给定的比较器，选择出值最大的元素                         |
| minBy        | 根据给定的比较器，选择出值最小的元素                         |

- 分组分区 Collectors

- - 仅仅是做一个常规的数据分组操作时，可以仅传入一个分组函数即可

```java
public void groupBySubCompany() {
    // 按照子公司维度将员工分组
    Map<String, List<Employee>> resultMap =
            getAllEmployees().stream()
                    .collect(Collectors.groupingBy(Employee::getSubCompany));
    System.out.println(resultMap);
}
```

- - 如果不仅需要分组，还需要对分组后的数据进行处理的时候，则需要同时给定分组函数以及值收集器

```java
public void groupAndCaculate() {
    // 按照子公司分组，并统计每个子公司的员工数
    Map<String, Long> resultMap = getAllEmployees().stream()
            .collect(Collectors.groupingBy(Employee::getSubCompany,
                    Collectors.counting()));
    System.out.println(resultMap);
}
```

### 总结

简而言之，Stream API 提供了一种高效且易于使用的处理数据的方式。让程序员写出高效率、干净、简洁的代码。

