# Lambda表达式

介绍：Lambda 表达式是 Java 8 中引入的新特性，主要用于简化使用函数接口的代码。所谓函数接口就是只有一个抽象方法的接口。而 Lambda 表达式可以实现这种函数接口的实例化与调用。这种特性可以大量简化代码，提高开发效率。

## Lambda表达式的语法及结构

Lambda 表达式语法的基本格式如下：

```
(parameters) -> expression
```

其中，`parameters` 表示参数列表，`expression` 表示方法体。如果参数列表为空，则可以省略小括号；如果方法体中只有一条语句，则可以省略大括号。

下面是一些示例：

- 一个参数：

```
// 无论单个参数用什么符号代替，都可以使用 Lambda 表达式
x -> System.out.println(x)

(x) -> System.out.println(x)

(String x) -> System.out.println(x)

```

- 多个参数：

```
(x, y) -> System.out.println(x + " " + y)
```

- 没有参数：

```
() -> System.out.println("Hello world!")
```

- 方法体有多行代码：

```
x -> {
    int a = x + 1;
    int b = x + 2;
    return a + b;
}
```

## Lambda表达式的应用场景

Lambda 表达式通常用于接口实现，或函数式接口（functional interface）的调用。函数式接口指只有一个抽象方法的接口。

示例：

```
@FunctionalInterface
interface Printer {
    void print(String x);
}

public class LambdaDemo {
    public static void main(String[] args) {
        Printer p = (x) -> System.out.println(x);
        p.print("Hello world!");
    }
}
```

对于上述例子，我们在定义 `Printer` 接口的时候加了注解 `@FunctionalInterface`，这个注解代表该接口是函数接口，即只有一个抽象方法。然后通过 `Lambda` 表达式的方式具体实现了这个接口并进行调用。

## Lambda表达式的优点

Lambda 表达式的出现有效地简化了代码，并提高了开发效率。相比匿名内部类，它使代码更加清晰易懂。特别是在使用函数接口时，可以不用写冗长的匿名内部类直接实现。

Lambda 表达式的使用可以使代码变得更加简洁，阅读起来也更加顺畅易懂。但是，不要过分使用 Lambda 表达式，否则可能会使代码难以维护。

## 小结

本文简单介绍了 Lambda 表达式的语法、应用场景以及优点。Java8 带来的许多新的特性都非常值得我们去学习和使用，但是在使用时也要注意掌握一定的度。