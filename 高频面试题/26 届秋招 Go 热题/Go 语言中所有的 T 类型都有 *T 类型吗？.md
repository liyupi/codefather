## Go 语言中所有的 T 类型都有 *T 类型吗？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

### 重点回答
不是。在 Go 语言中，几乎所有的类型 `T` 都可以有一个对应的指针类型 `*T`，**不过接口类型的指针是无效的**。

### 扩展知识

#### 1）普通情况

对于大多数类型（包括基础类型、自定义类型、结构体、切片、映射、通道等），你可以使用 *T 来表示类型 T 的指针。以下是一些示例：

- 基础类型：

    ```go
    var a int = 10
    var p *int = &a
    ```

- 结构体：

    ```go
    type Person struct {
        Name string
        Age  int
    }

    var p Person
    var pPtr *Person = &p
    ```

- 切片、映射、通道：

    ```go
    var s []int
    var sPtr *[]int = &s

    var m map[string]int
    var mPtr *map[string]int = &m

    var ch chan int
    var chPtr *chan int = &ch
    ```
#### 2) 特殊情况
- **数组：**
数组类型 `T` 也可以有一个对应的指针类型 `*T`。在 Go 中，数组的指针类型 `*[N]int`（例如 `*[5]int`）表示一个固定大小为 `N` 的数组的指针。
- **接口：**
接口类型的指针 `*interface{}` 是无效的。接口是引用类型，它们本身就可以直接引用其他对象，没有必要使用指针类型。
- **函数：**
函数类型也可以有一个指针类型。例如，`func() int` 类型的函数可以有一个 `*func() int` 类型的指针，但通常我们不常见函数指针类型的直接使用。


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)