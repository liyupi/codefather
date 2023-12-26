# 【Java基础】消灭魔法值-常量&枚举详述

> 作者：[观止.](https://blog.csdn.net/m0_66570338)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 6872

## 一.引入

在开发中我们经常会遇到用一个值（诸如数字或字符串）表示一种状态的情况，例如：

- 用 1 表示男，用 0 表示女
- 用 0 表示状态正常，用 1 表示异常，用 2 表示封禁
- 用 admin 表示管理员，用 common 表示普通用户
- .....

如果直接在代码中书写这些数值将大大破坏代码的可维护性，即使本人亲自编写的代码，在一段时间没接触之后，需要重新上手都得重新翻阅以前写的批注，如果没有写又不记得.....更何况有些时候代码都不是自己所编写的....

阿里巴巴Java开发规范手册中有提到：**不允许任何魔法值（即未经定义的常量）直接出现在代码中**。为了提高我们代码的可维护性，这也是许多人都遵从的一点。

**什么是魔法值呢？**

它通常是指在代码编写时**莫名出现的数字或字符串，我们无法直接判断数值代表的含义**，必须通过联系代码上下文分析才可以明白，严重降低了代码的可读性。结合我们上述所举的例子：

```java
// 不推荐
gender.setGender(1); // 设置性别为男
// 这里所使用的 1 就是一个魔法值
```

除此之外，如果在代码中使用了大量的魔法值，假设我们需要对其值进行修改那么工作量也是极其巨大的而且极易遗漏。

为了解决这个问题，我们可以采用如下两种方式来做信息标志和分类：

- 常量
- 枚举

## 二.常量

我们可以先声明一个变量并且赋值，然后再使用，但是这样做用户可以随意的修改变量值，导致安全性大大降低。由此我们可以选择使用常量。

### (1) 语法

- **定义**：使用了`public static final`**修饰的成员变量**，**必须有初始化值**，一旦初始化后，在执行的过程中**其值不能再被改变**。
- **命名规范**：通常使用英文单词**全部大写**，**多个单词下划线连接**起来。

```java
// 使用示例，也可以写成接口形式
// 标识用户状态常量
public class UserStatus {
    // 0 -》 正常 
    public static final Integer USER_NORMAL  = 0;
    // 1 -》 异常
    public static final Integer USER_ABNORMAL  = 1;
    // 2 -》 禁止
    public static final Integer USER_PROHIBIT  = 2;
}
```

类似于我们正常声明成员变量，只不过为了**保证其不可修改**的特性，加上了`public static final`修饰。

**补充说明**：

在我们使用常量的时候，Java会在编译阶段**自动**进行“宏替换”，也就是把使用常量的地方全部替换成真实的字面量，提高一点系统的性能。

```java
// 比如我们使用常量 UserStatus.USER_NORMAL
System.out.println(UserStatus.USER_NORMAL);
// java会在编译阶段替换为字面量 0
System.out.println(0);
```

### (2) 去魔法化

假设我们需要将用户的状态设置为异常状态，

以前我们直接使用数字，并加上注释（可能有些人注释都懒得加）：

```java
// 设置用户状态为异常
user.setStatus(1); // 不推荐
```

在一个规模比较小或者使用处极少的项目中可能问题不大，但如果项目规模比较庞大，开发时间跨度大，使用处比较多，那么上述写法便非常的不友好，由此我们可以使用上述所学的常量。

**常量代替：**

```java
// 还是使用我们语法介绍部分声明的常量
// 使用变量代替魔法值，设置用户状态为异常
user.setStatus(UserStatus.USER_ABNORMAL); // 推荐√
```

可能会有人觉得这样写也太长了，但是对于一个有代码提示的IDE来说其实并不算什么问题，更何况它的可读性明显提高了。当我们需要修改指代状态数字时，仅仅需要在`UserStatus`类中修改一次即可处处生效。

## 三.枚举

虽然常量也可以达成目的，但**在一些约束性比较强的情况下，枚举类更加的适合**。例如，你期待接收已定义的常量数值，事实上程序可以接受任意符合参数类型的数值。

### (1) 语法

枚举是Java中的一种特殊类型，需要先创建一个枚举类再进行使用。

**语法格式**：

```java
修饰符 enum 枚举名称{
     // 罗列枚举类实例的名称，以逗号（,）分隔实例,以分号（;）标识结尾
}
```

- 示例一：

  - 对于一些简单的场景，我们可以直接使用枚举示例：

  ```java
  // ,分割实例 ;标识结尾
  public enum SeasonEnum {
      // 上下左右
      UP, 
      DOWN, 
      LEFT, 
      RIGHT;
  }
  ```

  - 调用与使用抽离到单独类中的常量类似

  ```java
  public class App {
      public static void main(String[] args) {
          System.out.println(SeasonEnum.UP);
          System.out.println(SeasonEnum.DOWN);
          System.out.println(SeasonEnum.LEFT);
          System.out.println(SeasonEnum.RIGHT);
      }
  }
  ```

  - 可以看到除了枚举类内置的方法以外，我们只能使用事先罗列的枚举类实例。

![](https://pic.yupi.icu/5563/202312211026528.png)

- 示例二：

  - 对于一些稍复杂的情况，我们只使用实例仅仅能完成标识，无法完成存储等用途。由此我们还可以为每个实例**增加一个至多个值**。

    ```java
    public enum UserStatusEnum {
        // 根据构造器枚举实例，此时不含无参构造器，必须要赋值枚举
        NORMAL(0),
        ABNORMAL(1),
        PROHIBIT(2);
    
        // 必须提供对应参数构造器
        UserStatusEnum(Integer value) {
            this.value = value;
        }
        
    	// 不建议给用户提供二次修改枚举值的权限
        // 可以有多个字段
        private final Integer value;
    
        // 仅开放获取实例值权限
        public Integer getValue() {
            return value;
        }
    }
    ```

  - 使用上与上述类似，不过多了些许自定义方法,例如：getValue

  ```java
  public class App {
      public static void main(String[] args) {
          // 可以仅获取枚举值
          System.out.println(UserStatusEnum.NORMAL); // NORMAL
          // 还可以获取枚举值所指代的数值
          System.out.println(UserStatusEnum.NORMAL.getValue()); // 0
      }
  }
  ```

  - 可以看到与上述类似，不过多了我们提供的获取值方法

![](https://pic.yupi.icu/5563/202312211026540.png)

![](https://pic.yupi.icu/5563/202312211026544.png)

### (2) 特点

- 枚举类都是继承了枚举类型：java.lang.Enum
- 枚举**都是最终类，不可以被继承**。
- 构造器都是私有的，枚举对外**不能通过**`new`**创建对象**。
- 枚举类的**第一行默认都是罗列枚举对象的名称**的。
- 枚举类相当于是**多例模式**。

我们可以**反编译后**结合上述观察枚举的特征：

![](https://pic.yupi.icu/5563/202312211026519.png)

### (3) 去魔法化

假设我们同样需要将用户的状态设置为异常状态：

```java
// 设置用户状态为异常
user.setStatus(1); // 不推荐
// 使用常量
user.setStatus(UserStatus.USER_ABNORMAL); // 推荐一√
```

我们也可以使用上述所学的枚举值进行代替

```java
// 还是使用我们语法介绍部分声明的枚举值
// 使用枚举值代替魔法值，设置用户状态为异常
user.setStatus(UserStatusEnum.ABNORMAL.getValue()); // 推荐二√
```

可能有人会发现这样写其实和使用没啥区别，如果仅仅是这样用确实没什么区别。但是在方法参数列表中，让枚举类当作参数那便有很强的约束性。

```java
public class App {
    public static void main(String[] args) {
        setStatus(UserStatusEnum.NORMAL);
    }

    public static void setStatus(UserStatusEnum userStatus){
        User user = new User();
        user.setStatus(userStatus.getValue());
    }
}
```

这样一来我们要想设置用户状态便只能传递枚举类中已经存在的几个枚举实例。

此外对于一些方法只能接受数值的情况，我们还先通过values获取所有值进行判断数值正确性,再进行处理。

```java
public class App {
    public static void main(String[] args) {
        setStatus(1);

    }

    // 假设只能接收非枚举实例类型
    public static void setStatus(Integer status) {
        // 判断参数是否为对于枚举实例
        if (isTrueValue(status)) {
            User user = new User();
            user.setStatus(status);
        } else {1
            System.out.println("非法参数");
        }

    }

    // 判断参数是否为对于枚举实例
    public static boolean isTrueValue(Integer num) {
        UserStatusEnum[] values = UserStatusEnum.values();
        for (UserStatusEnum statusEnum : values) {
            Integer value = statusEnum.getValue();
            if (value.equals(num)) {
                return true;
            }
        }
        return false;
    }
}
```

虽说使用常量结合哈希也能解决上述问题，但这终究需要因情况决定用法。