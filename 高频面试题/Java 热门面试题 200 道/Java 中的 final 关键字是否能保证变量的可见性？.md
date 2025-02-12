## Java 中的 final 关键字是否能保证变量的可见性？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
不可以。

你可能看到一些答案说可以保证可见性，那不是我们常说的可见性。 

一般而言我们指的可见性是一个线程修改了共享变量，另一个线程可以立马得知更改，得到最新修改后的值。

而 final 并不能保证这种情况的发生，volatile 才可以。

而有些答案提到的 final 可以保证可见性，其实指的是 final 修饰的字段在构造方法初始化完成，并且期间没有把 this 传递出去，那么当构造器执行完毕之后，其他线程就能看见 final 字段的值。

如果不用 final 修饰的话，那么有可能在构造函数里面对字段的写操作被排序到外部，这样别的线程就拿不到写操作之后的值。

来看个代码就比较清晰了。

```java
public class YesFinalTest {
   final int a; 
   int b;
   static YesFinalTest testObj;

   public void YesFinalTest () { //对字段赋值
       a = 1;
       b = 2;
   }

   public static void newTestObj () {  // 此时线程 A 调用这个方法
       testObj = new YesFinalTest ();
   }

   public static void getTestObj () {  // 此时线程 B 执行这个方法
       YesFinalTest object = testObj; 
       int a = object.a; //这里读到的肯定是 1
       int b = object.b; //这里读到的可能是 2
   }
}
```
对于 final 域，编译器和处理器要遵守两个重排序规则(参考自infoq程晓明)：
1. 在构造函数内对一个 final 域的写入，与随后把这个被构造对象的引用赋值给一个引用变量，这两个操作之间不能重排序。
2. final 域的对象的引用，与随后初次读这个 final 域，这两个操作之间不能重排序。

所以这才是 final 的可见性，这种可见性和我们在并发中常说的可见性不是一个概念！

所以 final 无法保证可见性！

## 扩展知识

- [502. 什么是 Java 中的原子性、可见性和有序性？ ](https://www.mianshiya.com/bank/1789249312885223425/question/1780933295035412481)

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)