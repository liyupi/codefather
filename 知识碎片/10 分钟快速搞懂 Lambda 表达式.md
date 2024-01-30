# 10 分钟快速搞懂 Lambda 表达式

> 作者：[骑猪少年](https://wx.zsxq.com/dweb2/index/footprint/212555242214811)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 23765

## Lambda简介

Lambda表达式是`Java8`引入的一个重要特性，相当于一个语法糖。

> 语法糖（Syntactic sugar）是指在编程语言中引入的一种语法，它可以使代码更易读、更简洁，但并没有引入新的功能或改变语言的底层机制。语法糖并不会改变语言的语义，只是提供了一种更方便的编写方式。

- Lambda表达式可以被视为**匿名函数**
- 允许在**需要函数**的地方以**更简洁的方式定义功能**

**使用条件：\**只要是\**函数式接口**就可以用Lambda表达式简化

> 函数式接口：接口中有且只有一个未实现的方法，这个接口就叫函数式接口

如果接口中有超过一个未实现方法，则不是函数式接口，不能用Lambda表达式 如果接口中有一个未实现方法，有一个默认实现方法，则是函数式接口，可以用Lambda表达式

如：

```csharp
// 接口中有超过一个未实现方法,不是函数式接口
interface MyInterface {
    int sum(int a, int b);
    int min(int a, int b);
}

// 接口中只有一个未实现的方法,是函数式接口
interface MyCase{
    int hello();
    default int hello(int a){return a;} //默认实现
}
```

可以用`jdk`中提供的检查注解`@FunctionalInterface`来检查该接口是否为函数式接口

正常情况：

![](https://pic.yupi.icu/5563/202401112124131.png)

异常情况：

![](https://pic.yupi.icu/5563/202401112124464.png)

------

## Lambda表达式与函数式接口

举个例子：

有一个接口`MyInterface`，里面有一个方法`sum()`。

```angelscript
interface MyInterface {
    int sum(int a, int b);
}
```

如果想要实现这个接口，我们可以使用两种方法。

1. 自己写实现类

   ```angelscript
   class MyInterfaceImpl implements MyInterface {
       @Override
       public int sum(int a, int b) {
           return a + b;
       }
   }
   ```

   然后调用

   ```arduino
   public class Lambda {
       public static void main(String[] args) {
           MyInterface myInterface = new MyInterfaceImpl();
           int result = myInterface.sum(1, 2);
           System.out.println(result);
       }
   }
   ```

2. 创建匿名实现类

   如果每个接口都要写实现类的话，总觉得会有点麻烦。

   而且，如果在以后的业务中，要实现的方法不是两数之和，而是两数的平方和的话，那我岂不是要再写一个实现类？

   为了解决这个问题，我们可以采用[匿名实现类](https://pidanxia.ink/inner-class/)，**动态的**去实现接口。

   ```java
   public class Lambda {
       public static void main(String[] args) {
   
           // 1. 自己创建实现类对象
           MyInterface myInterface = new MyInterfaceImpl();
           int result = myInterface.sum(1, 2);
           System.out.println("我是 自己创建的实现类对象 " + result);
   
           // 2. 创建匿名实现类
           MyInterface myInterface1 = new MyInterface() {
               @Override
               public int sum(int a, int b) {
                   return a*a + b*b;
               }
           };
           int result1 = myInterface1.sum(1, 2);
           System.out.println("我是 匿名实现类 " + result1);
       }
   }
   ```

   运行结果：

   ![](https://pic.yupi.icu/5563/202401112124458.png)

可以看到，每次创建匿名实现类的时候，有很多格式上的东西是每次都要写的，这样就很冗余。比如下面我选中的这部分：

![](https://pic.yupi.icu/5563/202401112124848.png)

这部分在上面的接口`interface MyInterface`中就已经定死了。就算不写`new MyInterface()`，从创建匿名实现类的前面部分**MyInterface** myInterface1，也可以看出实现的就是`MyInterface`接口。

与前面相比，lambda表达式只保留动态的东西，把写死的东西去掉。 用lambda表达式的方式实现接口：

```java
        // 3. Lambda表达式实现接口  参数列表 + 箭头 + 方法体
        MyInterface myInterface2 = (int a, int b) -> {
            return a * a + b * b;
        };
```

这是lambda表达式的完整写法，然而我们可以看到，入参的类型在接口中也是定好的。这就说明还有更**简化的写法**：

1. 参数类型可以不写，只写参数名，参数变量名随意定义

   ```coffeescript
           MyInterface myInterface3 = (x, y) -> {
               return  x * x + y * y;
           };
   ```

   参数名不一定是接口中定义的`(a,b)`，也可以定义为其他的名字，比如`(x,y)`

2. 参数部分在没有入参的时候，最少可以只有一个`()`，**但是不能不写括号！！！！**

   或者在只有一个入参的时候，只有一个参数名

   ```java
   interface MyCase{
       int hello();
   }
   
   public class Lambda {
       public static void main(String[] args) {
           MyCase myCase = () -> {
               return 1;
           };
       }
   }
   ---------------------------------------------------
   interface MyCase1{
       int hello(int a);
   }
   
   public class Lambda {
       public static void main(String[] args) {
           MyCase1 myCase1 = a -> {
               return a + 1;
           };
       }
   }
   ```

3. 方法体只有一句话的时候，`{}`和`return`可以省略

   ```csharp
   interface MyCase1{
       int hello(int a);
   }
   
   public class Lambda {
       public static void main(String[] args) {
           MyCase1 myCase11  = a ->  a + 2;
           // 调用方法
           System.out.println(myCase11.hello(1));
       }
   }
   ```

------

## Lambda表达式使用

未来使用函数时接口会比较频繁，当调用某个方法传入参数，这个参数实例是一个接口对象，且只定义了一个方法，就可以直接用Lambda简化写法

### 比较器的使用

当我们使用比较器的时候，可以使用Lambda表达式简化写法

```typescript
public class Lambda {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<String>();
        names.add("Pidanxia");
        names.add("Lucy");
        names.add("Bob");
        names.add("Tom");
        
        // 普通写法
        Collections.sort(names,new Comparator<String>() {
            @Override
            public int compare(String o1, String o2) {
                return o1.compareTo(o2);
            }
        });
        
        // Lambda写法
        Collections.sort(names,(o1,o2)->o1.compareTo(o2));
    }
}
```

可以看到Lambda表达式与普通写法相比，简洁了非常多。 除了Lambda表达式之外，还可以用方法引用来简化写法。如：

```
Collections.sort(names, String::compareTo);
```

> 类::方法：表示引用类中的实例方法。
>
> 比如例子中的语句，就是说，以`names`为入参，调用`String类`中的`compareTo`方法

### 线程的使用

```csharp
        // 普通写法
        new Thread(){
            @Override
            public void run() {
                System.out.println("Hello");
            }
        }.start();
        // Lambda写法
        new Thread(()->System.out.println("Hello")).start();
```