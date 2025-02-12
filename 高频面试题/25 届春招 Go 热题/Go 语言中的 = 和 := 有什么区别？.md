## Go 语言中的 = 和 := 有什么区别？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

### 回答重点
在 Go 语言中，`=` 和 `:=` 都是用来进行**赋值**的，但它们的用法和场景有所不同。它们的主要区别如下：

1） `=` 是用来给**已声明的变量赋新值**，变量必须是已经声明过且有类型的。

```go
var y int = 20 // 函数内声明+赋值变量
fmt.Println("y:", y) // 输出：y: 20

y = 50 // 重新赋值
fmt.Println("y:", y) // 输出：y: 50
```

2）`:=` 是用来**声明并初始化新变量**，变量在使用时必须是全新的，不能用于已有变量的重新赋值。


```go
y := 20 // 声明+赋值新变量
fmt.Println("y:", y) // 输出：20

// y := 30 // 不允许对已有变量赋值
```
### 扩展知识

#### 1） 包级别变量
在声明包级别变量时，只能使用 `=` 声明初始化包级别变量，而不能使用`:=`，`:=` 只能在函数内部使用。

**代码例子：**

```go
package main

import (
    "fmt"
)

var x = 10 // 声明并初始化包级变量 x
// x := 10 // 不允许

func main() {
    fmt.Println("x:", x) // 输出：x: 10
}
```

#### 2）Go 语言会自动推断变量的类型

在 Go 中可以直接使用`=` 和 `:=` 来赋值，而无需带变量的类型，Go 语言会自动推断变量的类型。

**代码例子：**

```go
package main

import (
    "fmt"
    "reflect"
)

func main() {
    var x = 10
    y := 20
    z := "hello"
    fmt.Println("x:", x) // 输出：10
    fmt.Println("y:", y) // 输出：20
    fmt.Println("z:", z) // 输出：hello

    fmt.Println("x type:", reflect.TypeOf(x)) // 输出：int
    fmt.Println("y type:", reflect.TypeOf(y)) // 输出：int
    fmt.Println("z type:", reflect.TypeOf(z)) // 输出：string
}
```
在上述例子中，我们可以看到在对` x、y、z` 变量进行赋值时，并没有声明变量类型，但我们通过  `reflect` 包中的 `TypeOf()`方法可以获取到变量的类型。由此可见，Go 语言会自动推断变量的类型。

#### 3）多重赋值

在 Go 语言中，支持多重赋值方式，可以同时为多个变量赋值。这种语法特别适用于交换变量值、从函数返回多个值等场景。

**代码例子：**

```go
package main

import (
    "fmt"
)

func main() {
    var x, y int = 10, 20
    fmt.Println("x:", x) // 输出：10
    fmt.Println("y:", y) // 输出：20

    // 场景：交换变量值
    y, x = x, y
    fmt.Println("x:", x) // 输出：20
    fmt.Println("y:", y) // 输出：10

    x, z := 30, 40       // 允许,z 是新变量
    fmt.Println("x:", x) // 输出：30
    fmt.Println("z:", z) // 输出：40

    // x, y := 1, 2      // 不允许,至少要有一个未声明过的变量才能使用 :=
}
```
**注意**：在使用`:=`进行多重赋值时，**至少要有一个未声明过的变量才能使用**。针对已经声明过的变量，就是赋值操作；未声明过的变量，就是声明+赋值。




> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)