## Go 语言中通过指针变量 p 访问其成员变量 title，有哪几种方式？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

在 Go 语言中，通过指针变量 p 访问其成员变量 title 主要有以下两种方式：

1）使用 `(*p).title` 访问成员变量。

2）由于 Go 提供了指针的简写支持，还可以直接使用 `p.title` 来访问成员变量。

这两种方式其实是等价的，Go 编译器会帮你处理其中的细节。

有 4 种情况可以使用简洁支持：

1）通过解引用访问成员变量

2）通过解引用访问方法接受者为指针类型的方法

3）通过解引用访问结构体切片中的指针元素

4）通过解引用访问嵌套结构体中的变量
## 扩展知识

### 1）使用显式解引用

通过显式解引用指针，用 `(*p).title` 访问。这个语法看起来有点繁琐，但是在某些情况下明确的解引用可以让代码更直观。（实际代码开发中不推荐这样操作）

```go
package main

import "fmt"

type Book struct {
    title string
}

func main() {
    b := Book{title: "Go Programming"}
    p := &b
    // 显式解引用
    fmt.Println((*p).title)
}
```

### 2）简写方式

#### 2.1 通过解引用访问成员变量

Go 提供了简化语法，允许直接使用 p.title 访问指针成员，这样代码更简洁，同时也更符合其他主流编程语言的习惯：

```go
package main

import "fmt"

type Book struct {
    title string
}

func main() {
    b := Book{title: "Go Programming"}
    p := &b
    // 简写方式
    fmt.Println(p.title)
}
```
#### 2.2 通过解引用访问方法接受者为指针类型的方法

Go 会自动解引用指针，因此 `p.title` 实际上是 `(*p).title` 的简写形式。这种设计意图是为了让开发者写代码时更加简洁，而不需要频繁地解引用。此外，这种自动解引用在方法调用中也适用：

```go
package main

import "fmt"

type Book struct {
    title string
}

func (b *Book) printTitle() {
    fmt.Println(b.title)
}

func main() {
    b := Book{title: "Go Programming"}
    p := &b
    // 调用方法时，Go 会自动解引用
    p.printTitle()  // 等价于 (*p).printTitle()
}
```

#### 2.3 通过解引用访问结构体切片中的指针元素
在下面示例中，通过解引用操作 `people[0].Name` 来访问结构体切片中的第一个元素的 `Name` 字段。
```go
package main

import "fmt"

type Person struct {
	Name string
	Age  int
}

func main() {
	people := []*Person{{"Alice", 30}, {"Bob", 31}}
	fmt.Println(people[0].Name) // 输出：Alice
}

```
#### 2.4 通过解引用访问嵌套结构体中的变量
在下面示例中，通过解引用操作 `p.Address.City` 来访问嵌套的 `Address` 结构体中的 `City` 字段。
```go
package main

import "fmt"

type Address struct {
	City string
}

type Person struct {
	Name    string
	Age     int
	Address *Address
}

func main() {
	p := &Person{
		Name: "Alice",
		Age:  30,
		Address: &Address{
			City: "Beijing",
		},
	}
	fmt.Println(p.Address.City) // 输出：Beijing
}
```

简洁与明确都是编程中的重要原则，在不同场景下选择合适的方式是重要的。在平时我们可以更多地使用简写语法 `p.title` 来让代码更易读，但在一些复杂的代码中显式解引用 `(*p).title` 也可能会使逻辑更清晰。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)