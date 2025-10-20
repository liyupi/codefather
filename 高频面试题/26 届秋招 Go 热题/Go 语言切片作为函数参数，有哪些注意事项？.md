## Go 语言切片作为函数参数，有哪些注意事项？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

在 Go 语言中，把切片作为函数参数时，有以下几个注意事项：

1）函数内使用 for 循环修改数组值时（比如对 s 这个切片），需要取下标然后对`s[i]`操作，不可以直接`for _, v := range s`然后对v进行修改，这样无法修改到 s 的值。

2）如果想要在函数内部对切片进行追加、删除等操作时，依然希望可以影响到函数外的原切片的话，可以把切片的指针作为参数传递进来。

2）切片是引用类型，因此传递到函数时不会拷贝数据，而是传递对底层数组的引用。

3）由于切片具有动态大小，所以在函数内部对切片进行追加、删除等操作时，可能会引发底层数组的重新分配，从而导致原切片和函数内部切片指向不同的底层数组。

4）如果函数需要修改切片本身的结构（例如增加或减少元素），最好通过返回新的切片来传递修改后的结果，避免意外修改外部切片。

5）如果函数只需要读取切片数据，可以明确将切片参数声明为 const 或者只读，虽然 Go 语言并不支持真正的只读属性，但通过命名约定可以明确意图。

## 扩展知识

在 Go 语言中，切片是对数组的一个引用，这意味着传递切片参数实际上是传递引用，这与大多数程序员习惯的传值、传引用概念有一些区别。我们从以下几个方面进行扩展说明：

1）函数内修改slice的值的推荐写法
```go
package main

func main() {
	s := []int{0, 0}
	f(s)
	fmt.Println(s) // [10,10,10]
}

func f(s []int) {
	// 这样不能改变s中元素的值
	//for _, v := range s {
	//	v=10
	//}
	
        // 这样可以
	for i := range s {
		s[i] = 10
	}
}
```

2）通过传递指针来在函数内对切片进行append
```go
func f(s []int) []int {
	// 这里 s 是改变了，但是不会影响外层函数的 s。因为s本身就是一个值拷贝。
	s = append(s, 100)
	return s
}

func fPtr(s *[]int) {
	// 会改变外层 s 本身
	*s = append(*s, 10)
	return
}

func main() {
	s := []int{0,0}
	newS := f(s)

	fmt.Println(s) //[0,0]
	fmt.Println(newS)//[0,0]

	s = newS

	fPtr(&s)
	fmt.Println(s) //[0,0,10]
}
```

3）切片传递示例

```go
package main

import "fmt"

func modify(slice []int) {
	slice[0] = 100
}

func main() {
	s := []int{1, 2, 3}
	modify(s)
	fmt.Println(s) // 输出 [100, 2, 3]
}
```
在这个例子中，modify 函数中修改了第一个元素。因为切片是引用传递，所以原始切片 s 在 main 函数中也被修改了。

4）切片扩容与重新分配

```go
package main

import "fmt"

func appendAndPrint(slice []int) {
	fmt.Printf("slice start: %p\n", slice)
	slice = append(slice, 4)
	fmt.Printf("slice end: %p\n", slice)
}

func main() {
	s := make([]int, 3, 3)
	appendAndPrint(s)
	fmt.Printf("main slice: %p\n", s) // 地址不同了
}
```
在这个例子中，我们看到切片在 append 操作后，可能会重新分配底层数组，因此函数内部和外部的切片可能会指向不同的底层数组，从而导致改动不一致。

5）返回新切片

为了解决上述问题，可以在函数中返回新的切片：

```go
package main

import "fmt"

func addElement(slice []int, element int) []int {
	slice = append(slice, element)
	return slice
}

func main() {
	s := []int{1, 2, 3}
	s = addElement(s, 4)
	fmt.Println(s) // 输出 [1, 2, 3, 4]
}
```
通过函数返回新的切片，我们明确了函数的修改，避免了意外的副作用。同时，这种方式也是 Go 语言推荐的一种函数设计模式。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)