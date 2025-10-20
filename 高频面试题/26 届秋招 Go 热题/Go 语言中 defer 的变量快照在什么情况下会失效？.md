## Go 语言中 defer 的变量快照在什么情况下会失效？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 重点回答
在 Go 语言中，`defer` 的变量快照是指在 `defer` 语句**定义时所捕获的变量的状态**。但有些情况下，`defer` 语句中的变量快照可能会失效，导致不如预期那样行为，如下：

1）**匿名函数闭包**：当 `defer` 语句中使用的**匿名函数捕获了外部变量**时。如果变量的值在 `defer` 语句定义后发生变化，`defer` 执行时会使用变化后的值。

2）**引用类型**：当 `defer` 引用持有**引用类型的变量**（如指针、切片、映射、通道和函数）时，虽然引用本身的地址不会变，但指向的内容可能变化，这也会导致最终的结果和预期的快照结果不同。

## 扩展知识

在编程的时候，经常需要打开一些资源，比如数据库连接、文件、锁等，这些资源需要在用完之后释放掉，否则会造成内存泄漏。在 Go 中 `defer` 一般用于资源清理、文件关闭、解锁互斥量等操作。

### 1） defer常见用法

在函数开始时定义 defer ，确保退出时资源能够正确释放。

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    file, err := os.Open("example.txt")
    if err != nil {
        fmt.Println("Error opening file:", err)
        return
    }
    defer file.Close()

    // 处理文件的逻辑
}
```
### 2）闭包的defer变量


```go
package main

import "fmt"

func main() {
    x := 0
    defer func() { fmt.Println("deferred x:", x) }() // 这里捕获的是x的引用
    x = 1
    fmt.Println("Normal x:", x)
}

```
输出结果：

```go
Normal x: 1
deferred x: 1
```

### 3）defer+引用类型

当 `defer` 引用持有引用类型的变量时，如果变量指向的内容发生变化，这也会导致最终的结果和预期的快照结果不同。

```go
package main

import "fmt"

func main() {
    x := []int64{0}
    defer fmt.Println("deferred x:", x) // 这里捕获的是x的引用
    x[0] = 1
    fmt.Println("Normal x:", x)
}
```
输出结果：

```go
Normal x: [1]
deferred x: [1]
```

### 4）defer+函数参数

把变量作为函数的参数传递给匿名函数，defer 后面跟的就是一个函数调用了。

```go
package main

import "fmt"

func main() {
    for i := 0; i < 3; i++ {
        defer func(item int) {  // 函数调用
                fmt.Println(item)
        }(i)
    }
}
```
输出结果：

```go
2
1
0
```

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)