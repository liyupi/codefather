# String 的 intern() 方法

> 作者：[小何同学](https://wx.zsxq.com/dweb2/index/footprint/185541482828452)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 18055

> 来源：在使用对秒杀券**一人一单**实现过程中用**悲观锁**用到`synchronized (id.toString().intern()){}`，实现根据用户id加锁

## 问题：

1. String s1 = “a” + “b”; //创建了几个对象？
2. String s2 = new String(“ab”); //创建了几个对象？
3. String s3 = new String(“a”) + new String(“b”); //创建了几个对象？
4. String s4= new String(“a”) + new String(“a”); s4.intern(); //创建了几个对象？

## 关于intern()：

String.intern()方法是**一种手动将字符串加入常量池**中的方法，如果有则返回，没有则是JDK７以及JDK前的区别

### （1）JDK7前：

String调用intern()方法时回去找常量池是否存在当前内容， 如果不存在会在常量池中创造对象并做引用 如果存在则直接返回

**原理**：JDK6中常量池位于PermGen（永久代）中，PermGen是一块主要用于存放已加载的类信息和字符串池的大小固定的区域，因此当无用的对象存储多后容易栈溢出。另外问题是堆区和PermGen隔离，容易创建多个相同值对象。

### （2）JDK7

Jdk7将常量池从PermGen区移到了Java堆区，执行intern操作时，如果常量池**已经存在**该字符串，则直接返回字符串引用，**否则**复制该字符串对象的引用到常量池中并返回。

回到开始的问题：

1. String s1 = “a” + “b”; //创建了几个对象？

- 最多一个。会被优化为"ab"，然后寻找常量池是否存在"ab"，不存在则创建对象

1. String s2 = new String(“ab”); //创建了几个对象？

- 一个或两个。new时在堆区创建一个对象，如果在常量池不存在"ab"则在常量池再创建一个

1. String s3 = new String(“a”) + new String(“b”);创建了几个对象？

- 至少4个，最多6个。

首先new两个对象，String的加法会new一个StringBuilder，然后toString()底层会new一个String 另外可能会在常量池创建"a"，"b"

1. String s4= new String(“a”) + new String(“b”);s3.intern();创建了几个对象？

- 至少4个，最多7个

同样两个new，一个StringBuilder，一个toString()，"a"，"b"可能在常量池创建 最后**调用intern()**方法时候，会去判断"ab"是否存在 JDK7之前：不存在会在常量池new一个对象 JDK7：只创建"ab"引用，并指向堆区"ab"的StringBuilder对象地址