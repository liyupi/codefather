# recover

在 Go 语言中，当一个 Goroutine panic 时，可以使用 recover 函数捕获 panic，避免程序意外崩溃。

这里有两个概念需要区分一下：panic 和 recover。

Panic 通常出现在运行时，当某个异常情况发生时，一些函数可能调用 panic，导致程序中断运行。在这种情况下，程序不会继续执行，而是将控制权返回到顶层函数（main 函数），并逐层弹出函数调用栈，直到终止程序。

不过，有时候我们不希望程序直接退出，而是希望能通过某种方式，处理一些异常情况后，继续使程序正常运行下去，而这时 recover 就能派上用场。

recover 是一个 Go 内置的函数，它可以让程序从 panic 中恢复并继续执行后续代码。如果一个函数调用了内置函数 recover，并且其中参数没有是 nil，那么这个函数必须是在一个 defer 语句中执行的。这样当出现异常时，程序就可以捕获到 panic，并在后续代码中恢复。

下面来看一个简单的例子，直观演示 recover 的使用方法：

```go
func main() {
    defer func() {
        if p := recover(); p != nil {
            fmt.Println(p)    // 输出：supper error：a=1
        }
    }()
 
    fmt.Println("开始 panic 前")
    panic(errors.New("supper error：a=1"))
    fmt.Println("panic 之后")
}
```

通过这个例子，我们可以看到，当 panic 抛出异常后，defer 函数中的 recover 函数就会开始执行，然后程序能够正常交出控制权，继续执行，并输出成功信息，避免程序异常结束。