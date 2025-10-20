## 什么是 Go 语言中的深拷贝和浅拷贝？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

在 Go 语言中，深拷贝和浅拷贝是两种不同的拷贝方式。

1）深拷贝：深拷贝会复制所有的字段以及它们所引用的内存，从而保证**和源数据完全独立**。即使源数据被修改，深拷贝产生的数据也不会受到影响。

2）浅拷贝：浅拷贝只是复制了引用或指针，但不**复制引用的数据本身**。当你进行浅拷贝时，如果你后续修改了引用的数据，浅拷贝后的数据也会随之改变。

Go 语言的类型中，默认为深拷贝的类型有bool、int、float、string、array、struct等**值类型**。注意如果是 struct 类型，需要保证其嵌套的所有字段都是值类型。

Go 语言的类型中，默认为浅拷贝的类型有 slice、map、指针 ptr、函数 func、通道 chan、接口 interface 等**引用类型**。

## 扩展知识

深入了解深拷贝和浅拷贝，我们可以讨论一下如何在 Go 中实现这两种拷贝方式。

1）深拷贝的实现：

在 Go 语言中，大多数内置**基本类型**的拷贝操作默认都是深拷贝。

```go
package main

import "fmt"

type Person struct {
    Name string
    Age  int
}

func main() {
    p1 := Person{"Alice", 30}
    p2 := p1 // 深拷贝
    p2.Name = "Bob"
    
    fmt.Println(p1) // {Alice 30}
    fmt.Println(p2) // {Bob 30}
    
    s1 := "hello"
    s2 := s1
    s2 = "world"

    fmt.Println(s1) // hello
    fmt.Println(s2) // world
}
```
在上述例子中，p2 是 p1 的深拷贝，当我们修改 p2.Name 时，p1 保持不变。

对于嵌套类型，我们需要手动实现深拷贝：

```go
package main

import "fmt"

type Person struct {
	Name    string
	Age     int
	Friends []string
}

func deepCopy(p Person) Person {
	copyP := p
	copyP.Friends = make([]string, len(p.Friends))
	copy(copyP.Friends, p.Friends)
	return copyP
}
func main() {
	s := "Alice"
	p1 := Person{s, 30, []string{"Bob", "Charlie"}}
	p2 := deepCopy(p1) // 深拷贝
	p2.Friends[0] = "David"

	fmt.Println(p1.Friends) // [Bob Charlie]
	fmt.Println(p2.Friends) // [David Charlie]

}

```
在上述例子中，deepCopy 函数实现了 Person 结构的深拷贝，即使修改 p2.Friends，p1 也不会受到影响。注意，如果结构体中还有嵌套（或比如结构体里 Friends 字段的类型定义是`[]*string`），则也需要递归解析每一层结构体进行深拷贝，并且每一层都确认实现了`deepCopy`。

2）浅拷贝的实现：

对于复杂数据结构，比如嵌套的结构体、切片、映射、指针等，如果不主动实现深拷贝，那么就会影响原来的值，即形成浅拷贝。例子如下：

```go
package main

import "fmt"

type Person struct {
	Name    *string
	Age     int
	Friends []string
}

func main() {
	s := "Alice"
	p1 := Person{&s, 30, []string{"Bob", "Charlie"}}
	p2 := p1 // 浅拷贝
        
        // 比如对 slice 类型，如果只实现浅拷贝，则会对原数据造成影响
	p2.Friends[0] = "David"

	fmt.Println(p1.Friends) // [David Charlie]
	fmt.Println(p2.Friends) // [David Charlie]

	// 比如对指针类型，如果只实现浅拷贝，则会对原数据造成影响
	*p2.Name = "Bob"
	fmt.Println(*p1.Name) // Bob
	fmt.Println(*p2.Name) // Bob

}
```
在上述例子中，只实现了浅拷贝，因此对 p2 的 Name 和 Friends 字段做修改，会影响到 p1 的值。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)