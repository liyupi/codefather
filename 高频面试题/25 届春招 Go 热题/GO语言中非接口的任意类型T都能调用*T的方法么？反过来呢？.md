## GO语言中非接口的任意类型T都能调用*T的方法么？反过来呢？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
都可以的。在Go语言中，对于非接口的任意类型T，确实可以调用 * T（指向T的指针）的方法。这是因为当你尝试在一个T类型的值上调用一个 * T 方法时，Go编译器会隐式地获取该值的地址，然后调用相应的方法。这种行为被称为指针接收者的方法调用的自动解引用。
### 示例代码

```GO
package main

import "fmt"

type MyStruct struct {
	field int
}

func (ms MyStruct) ValueReceiverMethod() {
	fmt.Println("ValueReceiverMethod")
}

func (ms *MyStruct) PointReceiverMethod() {
	fmt.Println("PointReceiverMethod")
}

func main() {
	var s MyStruct
	s.ValueReceiverMethod() // 输出 ValueReceiverMethod
	s.PointReceiverMethod() // 输出 PointReceiverMethod
	tmpS := &s
	tmpS.ValueReceiverMethod() // 输出 ValueReceiverMethod
	tmpS.PointReceiverMethod() // 输出 PointReceiverMethod
}
```
## 扩展知识
1. **方法集（Method Sets）**：在Go中，每个类型都有一个与之关联的方法集。对于类型T，其方法集包含所有接收者类型为T的方法；而对于* T，其方法集包含所有接收者类型为T和* T的方法。这意味着，如果你有一个* T类型的值，你可以调用T和* T两种类型的方法，而如果你只有T类型的值，你只能调用T类型的方法，但Go编译器会隐式地获取该值的地址，然后调用相应的方法。
2. **接口（Interfaces）**：Go的接口是一种类型，它定义了一组方法签名，任何实现了这些方法的具体类型都被认为实现了该接口。当你将一个具体类型的值赋给一个接口类型的变量时，Go会检查该具体类型的方法集是否包含了接口定义的所有方法。
3. **值接收者和指针接收者**：在定义方法时，可以选择使用值接收者（T）或指针接收者（* T）。使用值接收者时，方法内部对接收者的修改不会影响到原始值；而使用指针接收者时，方法内部对接收者的修改会影响到原始值。
4. **多态（Polymorphism）**：通过接口，Go实现了多态。这意味着你可以使用接口类型的变量来持有实现了该接口的任何具体类型的值，并调用接口定义的方法，而不需要关心具体类型是什么。
5. **嵌入类型（Embedded Types）**：Go支持类型嵌入，这是一种将一个类型嵌入到另一个类型中，使得被嵌入类型的方法成为外部类型的方法的机制。这提供了一种类似于继承的代码重用方式。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)