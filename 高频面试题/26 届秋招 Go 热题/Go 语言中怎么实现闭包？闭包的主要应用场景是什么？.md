## Go 语言中怎么实现闭包？闭包的主要应用场景是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

在 Go 语言中，闭包（Closure）是一个函数值，它可以引用其外部作用域中的变量。在 Go 中实现闭包的方法非常简单，我们可以通过在一个函数内部定义另一个函数，并让其访问外部函数的变量来实现。

> 即函数可以访问被引用的变量并对其赋值，函数被“绑定”到变量上。

下面是一个简单的 Go 语言闭包示例：

```go
package main

import "fmt"

// 实现闭包的函数
func adder() func(int) int {
    sum := 0                   // 定义外部作用域的变量
    return func(x int) int {   // 返回一个匿名函数
        sum += x               // 操作外部作用域的变量
        return sum             // 返回结果
    }
}

func main() {
    pos, neg := adder(), adder()   // 创建两个闭包
    for i := 0; i < 10; i++ {
        fmt.Println(pos(i), neg(-2*i))  // 调用闭包
    }
}
```
在这个示例中，adder 函数返回一个闭包，该闭包内部引用并操作了 sum 这个外部变量。

闭包在实际编程中具有广泛的应用，其主要应用场景包括但不限于：

1）**伪全局变量**：由于闭包可以捕获外部变量，因此通过闭包可以实现类似全局变量的效果。而相比全局变量，使用闭包可以通过变量的作用域限制变量的范围。

2）**函数工厂**: 根据不同的配置参数来动态创建函数。

3）**装饰器模式**：通过闭包在不修改原有函数的情况下，动态地添加新的功能，实现装饰器模式。

3）**回调函数**：将一个函数作为参数传递给另一个函数，通过闭包，捕获一些上下文信息并执行该函数

4）**并发编程**：可以安全地在多个goroutine中共享和修改变量，一种简洁的方式

5）**保存中间态**：用于累加器或者计数器，以保存中间状态。

## 扩展知识

既然我们已经了解了如何在 Go 语言中实现闭包，下面我们来扩展一下对闭包的理解和它的一些更高级的应用场景。

1）保存中间态： 闭包可以用来持久化某些状态，比如用作计数器或累加器。你只需每次调用它，它就会“记住”上一次的运行状态。

```go
package main

import "fmt"

func incrementer() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

func main() {
    inc := incrementer()
    fmt.Println(inc()) // 1
    fmt.Println(inc()) // 2
    fmt.Println(inc()) // 3
}
```

2）工厂模式：比如下例子中，分别提供加法、减法、乘法和除法的闭包函数，并封装为函数工厂，使得函数的创建更加灵活和可定制。

```go
package main

import "fmt"

func CalcFactory(operation string) func(int, int) int {
	switch operation {
	case "add":
		return func(a, b int) int {
			return a + b
		}
	case "subtract":
		return func(a, b int) int {
			return a - b
		}
	case "multiply":
		return func(a, b int) int {
			return a * b
		}
	case "divide": // 这里是向下取整了，因为函数签名返回是int
		return func(a, b int) int {
			if b != 0 {
				return a / b
			}
			return 0
		}
	default:
		return nil
	}
}

func main() {
	addFunc := CalcFactory("add")
	subtractFunc := CalcFactory("subtract")
	multiplyFunc := CalcFactory("multiply")
	divideFunc := CalcFactory("divide")

	fmt.Println(addFunc(4, 5)) //9
	fmt.Println(subtractFunc(4, 5)) // -1
	fmt.Println(multiplyFunc(4, 5))// 20
	fmt.Println(divideFunc(5, 4))// 1
}

```
3）实现装饰器模式： 装饰器模式通过闭包可以方便地实现，即在不修改原有函数的情况下，动态地添加新的功能。

```go
package main

import "fmt"

func doubleAndPrint(fn func(int) int) func(int) int {
    return func(x int) int {
        result := fn(x)
        fmt.Println("Result:", result*2)
        return result
    }
}

func square(x int) int {
    return x * x
}

func main() {
    doubleSquare := doubleAndPrint(square)
    doubleSquare(3) // 18 (3*3*2)
}
```

4）回调函数：可以用于我们需要等待某个长时间的操作或者某个事件触发之后的场景。比如下面例子，使用匿名函数创建了一个闭包，用于做回调函数。在执行异步操作时将计算结果传递给回调函数。

```go
package main

import (
    "fmt"
    "time"
)

func TaskAsync(input int, callback func(int)) {
    go func() {
       time.S leep(1 * time.Second)// 模拟运算操作
       result := input * 3
       callback(result)
    }()
}

func main() {
    callback := func(result int) {
       fmt.Println("操作结果：", result) // 输出30
    }
    TaskAsync(10, callback) 
    time.S leep(5 * time.Second) // 让主协程hang主，避免程序结束。
}

```

5）并发编程：比如下例子中，使用for循环为每个任务创建一个匿名函数。这些匿名函数使用闭包来捕获循环变量i和任务函数task。在每个匿名函数内部，我们调用任务函数，并将结果存储在相应的位置。
```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	var urls = []string{
		"http://www.google.com/",
		"http://golang.org/",
		"http://m.baidu.com/",
	}
	for _, url := range urls {
		wg.Add(1)
		go func(url string) {
			defer wg.Done()
			// http.Get(url)
			fmt.Println(url)
		}(url)
	}
	wg.Wait()
}
```
6）封装逻辑： 通过闭包可以将某些逻辑封装起来，使得代码更加简洁和易读，尤其是在处理回调函数或事件处理程序时。

7）模拟私有变量： 闭包可以模拟一些语言中私有变量的功能，从而实现数据的封装和隐藏。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)