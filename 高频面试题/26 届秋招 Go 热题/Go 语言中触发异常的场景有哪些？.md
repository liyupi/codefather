## Go 语言中触发异常的场景有哪些？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 重点回答
在 Go 语言中，使用 error 类型来处理错误，并通过 panic 和 recover 来处理程序的异常情况。以下是一些可能触发 panic（即异常）的场景：
1. **数组或切片越界**
2. **空指针解引用**
3. 调用 panic 函数
4. **非法类型断言**
5. **数学错误**
6. 内存越界或非法操作
8. 运行时错误
9. 使用不安全的库或代码

在上述**1、2、4和5**是在写代码中最常遇见的异常场景。

## 扩展知识
### 1. 数组或切片越界

访问数组或切片时，如果索引超出范围，会触发 panic。例如：

```go
arr := []int{1, 2, 3}
fmt.Println(arr[5]) // 触发 panic: runtime error: index out of range
```

### 2. 空指针解引用
解引用一个 nil 指针会导致 panic。例如：

```go
var ptr *int
fmt.Println(*ptr) // 触发 panic: runtime error: invalid memory address or nil pointer dereference

var m map[string]string
m["a"] = "3123" // 触发 panic: assignment to entry in nil map
```

### 3. 调用 panic 函数

可以手动触发 panic，通常用于程序中的非预期情况：

```go
panic("something went wrong") // 触发 panic
```

### 4. 非法类型断言

进行非法类型断言时会触发 panic。例如：

```go
var i interface{} = "string"
num := i.(int) // 触发 panic: interface conversion: interface {} is string, not int
```

### 5. 数学错误

某些数学操作可能触发 panic，例如除以零：

```go
result := 1 / 0 // 触发 panic: runtime error: integer divide by zero
```

### 6. 内存越界或非法操作
使用 unsafe 包进行非法内存操作可能会导致 panic，例如：


```go
import "unsafe"

var p unsafe.Pointer
*(*int)(p) = 42 // 触发 panic: runtime error: invalid memory address or nil pointer dereference
```

### 7. 运行时错误

有些运行时错误（如堆栈溢出）可能会导致 panic。这类错误通常很难预测和处理。

### 8. 使用不安全的库或代码

某些第三方库或不安全的代码片段可能会引发 panic，尤其是那些直接操作内存的库。

### 如何处理 Panic

Go 语言提供了 defer 和 recover 来处理 panic。defer 可以用来确保某些清理操作总是会执行，而 recover 可以用来捕获 panic 并防止程序崩溃。例如：


```go
func safeDivide(a, b int) (result int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered from panic: %v", r)
        }
    }()
    result = a / b
    return
}
```
在这个例子中，如果 a / b 触发了 panic（例如 b 为 0），recover 可以捕获这个 panic 并将其转换为一个错误。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)