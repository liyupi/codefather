## Go 语言中的局部变量是分配在栈上还是堆上？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

**Go 语言中的局部变量既可能分配在栈上，也可能分配在堆上**

如果变量的生命周期**局限于函数作用域**，并且不会逃逸到函数外，则分配在栈上。

如果局部变量的生命周期**超出函数作用域**（如通过指针返回给外部使用），编译器会将变量分配在堆上，确保变量在作用域外仍然有效，这种机制称为“逃逸分析”。


## 扩展知识

### 栈和堆的区别

**栈分配：**
- 栈是线程私有的，分配和释放内存由编译器管理。
- 分配速度快，通常用于函数的局部变量。

**堆分配：**
- 堆是全局共享的，内存的分配和释放由垃圾回收器（GC）管理。
- 适用于动态分配和长生命周期的内存，但性能较慢。

### 逃逸分析的工作原理

#### **什么是逃逸分析？**

逃逸分析是一种**编译时优化技术**，编译器通过分析变量的使用场景，确定变量的生命周期及其存储位置是在堆上还是在栈上。

**核心逻辑是判断变量的引用是否超出了函数的生命周期**。

#### **触发堆分配的场景：**

1）**返回指针：** 如果局部变量的地址被返回，则变量会逃逸到堆上。
 ```go
 func createPointer() *int {
     x := 10
     return &x // x 逃逸到堆上
 }
 ```

2）**闭包捕获：** 如果局部变量被闭包捕获，其生命周期可能超过函数范围，因此需要堆分配。 
 ```go
 func closure() func() int {
     x := 10
     return func() int { // x 逃逸到堆上
         return x
     }
 }
 ```

3）**跨 Goroutine 传递：** 如果局部变量被传递到另一个 Goroutine，则无法保证其安全存储在栈上。
 ```go
 func goroutine() {
     x := 10
     go func() {
         fmt.Println(x) // x 逃逸到堆上
     }()
 }
 ```

#### **如何查看逃逸分析结果？**

使用 `go build` 或 `go run` 的 `-gcflags="-m"` 参数可以查看逃逸分析结果：
 ```bash
 go build -gcflags="-m" main.go
 ```
 示例输出：
 ```plaintext
 main.go:5:6: moved to heap: x
 ```

### 栈分配与堆分配代码示例

```go
package main

import "fmt"

func stackAllocation() {
    x := 42 // x 分配在栈上
    fmt.Println(x)
}

func heapAllocation() *int {
    x := 42 // x 分配在堆上，因为返回了指针
    return &x
}

func main() {
    stackAllocation()

    p := heapAllocation()
    fmt.Println(*p)
}
```

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)