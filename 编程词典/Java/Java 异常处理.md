# 异常处理

编写 Java 代码时，程序可能会出现一些错误或异常，比如说用户输入的数据格式不正确、文件未找到等等。这些错误或异常如果没有被良好处理，可能会导致程序崩溃或运行结果不正确，让用户觉得程序不可靠。

因此，在编写 Java 代码时，我们需要使用异常处理来优雅地应对这些错误或异常，避免程序崩溃，同时让程序更加健壮。

## 什么是异常处理

异常处理是一种机制，可以在程序中处理错误或异常情况，让程序继续执行而不崩溃。在 Java 中，异常处理的核心是异常类、throw 和 try-catch-finally 代码块。

## 异常类

Java 中内置了很多异常类，这些异常类都继承自 Throwable 类，又分为两种：一种是非检查异常（RunTimeException）；另一种是检查异常（CheckedException）。

非检查异常通常是一些编程错误，比如说数组下标越界、除数为零等等。在编写程序时，可以不处理这些异常，编译器也不会提示错误。常见的非检查异常有 ArithmeticException（算术异常）、NullPointerException（空指针异常）等等。

检查异常通常是一些外部错误，比如说文件未找到、网络异常等等。在编写程序时，需要显式地处理这些异常。常见的检查异常有 FileNotFoundException（文件未找到异常）、IOException（输入输出异常）等等。

## throw

throw 关键字是用于抛出异常的，它可以抛出一个异常对象。

## try-catch-finally 

try-catch-finally 是异常处理语句的核心，它由三个部分组成：

- try 块：在 try 块中，我们放置可能会出现异常的代码。
- catch 块：如果 try 块中的代码抛出异常，则程序会跳转到 catch 块中。catch 块中处理相关的异常。
- finally 块：不管程序是否跳转到 catch 块中，finally 块中的代码都会被执行。

下面给出一个简单的例子：

```
public class ExceptionDemo {

    public static void main(String[] args) {
        try {
            int a = 5 / 0; // 抛出 ArithmeticException
        } catch (Exception e) {
            System.out.println("发生了异常：" + e.toString());
        } finally {
            System.out.println("finally 块中的代码已经执行完毕");
        }
    }
}
```

在这个例子中，由于除数为零，会抛出 ArithmeticException。因为我们使用了 try-catch-finally 代码块，所以程序不会崩溃。在 catch 块中，我们捕获了异常并打印了异常信息。在 finally 块中，我们打印了一条信息，表示 finally 块中的代码已经执行完毕。

## 异常处理的注意事项

- 如果在 try 块中抛出异常，但是在 catch 块中没有捕获到异常，那么程序会终止运行并显示异常信息。
- catch 块可以有多个，每个 catch 块捕获不同的异常。
- finally 块中的代码不一定是必需的，但是一般情况下都建议编写，用来释放资源或者关闭流等操作。
- 在 Java 中，异常处理是开销比较大的操作，因此要避免过度使用异常处理。