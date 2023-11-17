# Go routine

Go 语言的并发编程为开发者提供了非常强大的支持，最基本的并发编程机制就是 goroutine。

所谓 goroutine，可以类比与操作系统中的线程，都是具有独立执行流的实体。但是在 Go 语言中，启动和管理 goroutine 是非常轻量和高效的。

在 Go 语言内部，其实就是将一个线程分成了多个小线程，每个 goroutine 依然由操作系统的线程所驱动。

当你运行一个函数时，只需要在函数前加上关键字 go，该函数就会作为一个 goroutine 运行。

例如：

```go
func main() {
    go function()  // 启动一个新的 goroutine
}
``` 

需要注意的是，创建一个 goroutine 是非常廉价的。Go 语言为每个 goroutine 分配的默认栈大小仅为 2KB，远远小于线程默认的栈大小，因此它可以在单个程序中创建数千个 goroutine，而不用担心内存消耗。并且，开发者不必手动管理 goroutine 的生命周期，它们会随着应用程序的运行自动退出。

需要注意的是，启动 goroutine 时不能对其本身的实例进行更改，这会导致原始的状态受到破坏。通常的做法，是将参数作为 goroutine 的可选值来传递，并将结果传递回主 goroutine。

下面是一个简单的例子，展示了如何启动 goroutine，等待其执行完毕，并获取其结果：

```go
func main() {
    // 启动 goroutine，并将结果放入 channel 中
    ch := make(chan int)
    go func() {
        ch <- sum(1, 2)
    }()
    
    // 等待 goroutine 执行
    result := <-ch
    fmt.Println(result)
}

func sum(a, b int) int {
    return a + b
}
```

在这个例子中，`sum` 函数被运行在一个单独的 goroutine 中，并将其结果通过 channel 返回。主 goroutine 等待 channel 中有值后再读取出来，从而实现了 goroutine 同步。

总之，goroutine 是 Go 语言最基本的并发编程机制，具有非常轻量和高效的特点，能够快速地启动和管理多个并发执行流，因而成为了 Go 语言并发编程的核心。