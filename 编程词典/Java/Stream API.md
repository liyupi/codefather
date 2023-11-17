# Stream API

在 Java 8 中，引入了一个 Stream API，可以帮助我们更加便捷地处理集合中的数据。它可以让我们做到“Lambda 表达式+Stream API”做任何事情，当然，这里说任何事情是针对 Java 领域的。

你可以将 Stream 看成一个管道，集合数据就像流水一样，在管道中传输，Stream API 提供了非常多的操作，可以让流在管道中进行转换和处理。

## 创建 Stream

在 Java 8 中，想要创建 Stream 可以通过以下几种方式：

### 通过 Collection 接口的 stream() 方法来创建

例如，如果想要对一个 List 集合执行操作，可以这样创建 Stream：

```java
List<String> list = Arrays.asList("apple", "banana", "orange");
Stream<String> stream = list.stream();
```

### 通过 Arrays 类的 stream() 方法来创建

如果想要对数组执行操作，可以这样创建 Stream：

```java
int[] nums = {1, 2, 3};
IntStream stream = Arrays.stream(nums);
```

### 通过 Stream 类的 of() 方法来创建

还可以通过 Stream 类的 of() 静态方法来创建 Stream，例如：

```java
Stream<Integer> stream = Stream.of(1, 2, 3);
```

### 通过 Stream 类的 iterate() 和 generate() 方法来创建

Stream 类的 iterate() 和 generate() 静态方法可以用来创建无限流，例如：

```java
Stream<Integer> stream1 = Stream.iterate(0, n -> n + 2).limit(10); // 0, 2, 4, ..., 18

Stream<Double> stream2 = Stream.generate(Math::random).limit(3); // 3 个随机数
```

## Stream 的核心操作

### Intermediate 操作

Intermediate 操作是指对 Stream 中的数据元素进行转换、过滤等处理，会返回一个新的 Stream。例如，map() 方法可以将 Stream 中的元素转换为新的元素：

```java
Stream<String> stream = Stream.of("hello", "world", "stream");

Stream<String> newStream = stream.map(String::toUpperCase);
newStream.forEach(System.out::println);

// 输出：HELLO WORLD STREAM
```

### Terminal 操作

Terminal 操作是指触发 Stream 执行计算并产生结果的操作。在 Terminal 操作中，我们需要指定 Stream 处理完毕之后的结果，例如，forEach() 方法可以用来迭代 Stream 中的元素并对每个元素执行指定操作：

```java
Stream<String> stream = Stream.of("hello", "world", "stream");

stream.forEach(System.out::println);

// 输出：hello world stream
```

### Short-circuiting 操作

Short-circuiting 操作可以让 Stream 在满足指定条件时结束计算，通常用来提高程序的效率。例如，limit() 方法可以用来限制 Stream 的大小：

```java
Stream<Integer> stream = Stream.iterate(0, n -> n + 1);

Stream<Integer> newStream = stream.limit(10);
newStream.forEach(System.out::println);

// 输出：0 1 2 3 4 5 6 7 8 9
```

## 总结

以上就是 Stream API 的一些基础用法，虽然只是简单的介绍，但是 Stream API 一直是 Java 相对较难掌握的部分之一，因此，想要更加深入地学习 Stream API，还需要结合具体的业务场景进行学习和实践。