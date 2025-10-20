## 不分配内存的指针类型能在 Go 语言中使用吗？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

在 Go 语言中，不分配内存的指针类型可以使用，但是只能用该指针本身，不可以用`*`去解引用出具体的值，会导致 panic 。这是因为 Go 允许声明指针变量，但如果不分配内存（没有指向有效的地址），该指针会是 nil。访问 nil 指针会导致运行时错误。

简单的说，Go 中声明一个指针变量是非常直接的，你可以使用 `*Type` 来声明一个指针类型，但注意在你对指针进行解引用操作之前，你必须确保它指向了一个有效的地址。否则，会引发 panic。

下面代码中，p 是一个指向 int 类型的指针变量。Go 语言会自动为其分配8字节的内存空间来存储一个指针值。但是 p 并不指向任何有效的 int 值，因为还没有为其分配或指定一个 int 类型的内存区域。此时 p 被称为空指针或未初始化的指针。
```go
package main

import "fmt"

func main() {
    var p *int // 声明指针变量，但不分配内存，此时 p 是 nil

    if p == nil {
        fmt.Println("p 是 nil 指针")
    }

    // 这行代码会引发运行时错误
    // fmt.Println(*p)
}
```
## 扩展知识

### 推荐使用姿势

在 Go 语言中，如果要使用指针，为了避免导致程序运行出错（比如 panic），最好在使用之前判空处理一下，并且，在如果是结构体指针，则需要多重判空，示例代码如下：
```go
package main

import (
	"fmt"
)

type Address struct {
	City string
}

type Person struct {
	Name    string
	Age     int
	Address *Address  // Person 结构体中含有一个 Address指针 成员
}

func main() {
	var p *Person  // p 是一个指向Person的指针

        //访问 City 成员前，必须确认 p 和 p.Address 都不为nil
	if p != nil && p.Address != nil {
		fmt.Println(p.Address.City)  
	} else {
		fmt.Println("Nil pointer detected.")
	}
}
```

### 指针使用方式

Go 语言中的指针使用方式其实与 C、C++ 等传统语言基本相似，但也有一些独特之处：

1）**分配内存**： 可以使用 new 函数或者通过 & 操作符来分配内存，使指针指向一个有效的地址。举例如下：

```go
package main

import "fmt"

func main() {
    // 使用 new 分配内存
    p := new(int)
    *p = 42
    fmt.Println(*p) // 输出：42

    // 使用 & 操作符分配内存
    var x int = 10
    px := &x
    fmt.Println(*px) // 输出：10
}
```
2）**nil 指针**： 如同前述，如果一个指针没有被分配内存，那么它的值就是 nil。试图解引用这样的指针会引起运行时错误。类似于下面的代码：

```go
package main

func main() {
    var p *int
    if p != nil {
        // 这种情况不会发生，因为 p 是 nil
        println(*p)
    }
}
```
3）**指针和切片、映射**： Go 语言的切片和映射本质上包含了对底层数组和哈希表的指针，因此在传递这些数据结构时，不需要显式使用指针来避免拷贝。它们已自带指针语义。

4）**方法接收者**：在定义方法时，可以用值接收者或者指针接收者。使用指针接收者可以避免拷贝，且可以改变接收者的状态。

```go
package main

import "fmt"

type Rect struct {
    Width, Height int
}

// 指针接收者方法
func (r *Rect) Area() int {
    return r.Width * r.Height
}

// 值接收者方法
func (r Rect) Perimeter() int {
    return 2 * (r.Width + r.Height)
}

func main() {
    r := Rect{Width: 10, Height: 5}
    fmt.Println("Area:", r.Area())
    fmt.Println("Perimeter:", r.Perimeter())
}
```

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)