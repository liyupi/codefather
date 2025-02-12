## JDK8 有哪些新特性？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

JDK8 较为重要和平日里经常被问的特性如下：

1）用元空间替代了永久代  
2）引入了 Lambda 表达式    
3）引入了日期类、接口默认方法、静态方法  
4）新增 Stream 流式接口  
5）引入 Optional 类  
6）新增了 CompletableFuture 、StampedLock 等并发实现类。  

如果你对 HashMap、ConcurrentHashMap 面试题有准备的话，这时候也可以抛出来，引导面试官来询问。比如：Java 8 修改了 HashMap 和 ConcurrentHashMap 的实现。

## 扩展知识
### 元空间替代了永久代

因为 JDK8 要把 JRockit 虚拟机和 Hotspot 虚拟机融合，而 JRockit 没有永久代，所以把 Hotspot 永久代给去了（本质也是永久代回收效率太低）。

详细可看：面试鸭《[为什么 Java8 移除了永久代，加了元空间？](https://www.mianshiya.com/question/1780933295228350466)》 这题。

### Lambda 表达式

Lambda 是 Java 8 引入的一种匿名函数，可以把 Lambda 表达式理解为是一段可以传递的代码（将代码像数据一样进行传递）。使用它可以写出更简洁、更灵活的代码。

其本质是作为函数式接口的实例。例如：

```java
// 传统方式
Runnable runnable1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("mianshiya.com");
    }
};

// Lambda 表达式
Runnable runnable2 = () -> System.out.println("mianshiya.com");

```
### 日期类

Java 8 引入了新的日期和时间 API（位于 java.time 包中），它们更加简洁和易于使用，解决了旧版日期时间 API 的许多问题。

例如 `Date`、`Calendar` 都是可变类且线程不安全。而新的日期类都是不可变的，一旦创建就不能修改，这样可以避免意外的修改，提升代码的安全性和可维护性。

```java
LocalDate date = LocalDate.now();
LocalTime time = LocalTime.now();
LocalDateTime dateTime = LocalDateTime.now();
```

`Date` 本身不包含时区信息，必须使用 `Calendar` 类来处理时区，但使用起来非常复杂且容易出错。

新 API 提供了专门的时区类（如 `ZonedDateTime`, `OffsetDateTime`, `ZoneId` 等），简化了时区处理，并且这些类的方法更加直观和易用。

### 接口默认方法、静态

默认方法允许在接口中定义方法的默认实现，这样接口的实现类不需要再实现这些方法。之所以提供静态方法，是为了将相关的方法内聚在接口中，而不必创建新的对象。

```java
interface MyInterface {
    default void defaultMethod() {
        System.out.println("Default Method");
    }

    static void hello() { 
        System.out.println("Hello, New Static Method Here"); 
    } 
}
```

### Stream 流式接口

Stream API 提供了一种高效且易于使用的方式来处理数据集合。它支持链式操作、惰性求值和并行处理。

```java
List<String> list = Arrays.asList("a", "b", "c", "d");
List<String> result = list.stream()
                          .filter(s -> s.startsWith("a"))
                          .collect(Collectors.toList());
```

### Optional

`Optional` 类用来解决可能出现的 `NullPointerException` 问题，提供了一种优雅的方式来处理可能为空的值。

```java
Optional<String> optional = Optional.of("mianshiya.com");
optional.ifPresent(System.out::println);
```

Optional 详细可查看面试鸭[《什么是 Optional 类？》 这题](https://www.mianshiya.com/bank/1787463103423897602/question/1800345746421391361)

### CompletableFuture

CompletableFuture 提供了一个新的异步编程模型，简化了异步任务的编写和管理。

```java
CompletableFuture.supplyAsync(() -> "Hello")
                 .thenApply(s -> s + " World")
                 .thenAccept(System.out::println);
```

StampedLock 可查看面试鸭 [《StampedLock 用过吗？》](https://www.mianshiya.com/question/1780933294947332098) 这题。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)