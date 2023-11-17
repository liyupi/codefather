# defer

在 Go 语言中，defer 是一个非常特殊的关键字。它可以将一个函数的执行推迟到当前函数返回之前。也就是说，无论在函数的哪个代码行执行了 defer 函数，在该函数返回之前都会执行被 defer 的函数。这个特性很像其他语言中的 try-finally 语句块，但实际上，defer 的应用要更加广泛而且更加方便。

在理解 defer 时，最好的办法就是将其视为 "注册" 函数，这些函数会在程序离开当前处理流程之前执行。当我们注册一个函数时，它的逻辑代码不会被执行，但在编译器编译程序过程中，该函数将被添加到一个专门的 "栈" 中。当该函数的 "注册" 帧生效时，函数才会被真正调用。

让我们来看一个简单的例子。假设我们需要跟踪程序的执行信息，那么我们可以使用 defer 在执行代码后打印该代码的信息：

```go
func main() {
    defer fmt.Println("closing program.")
    fmt.Println("running program")
}
```

由于 defer 定义的语句不会立即执行，因此先打印的是 "running program" 字符串。然后，当程序退出 main 函数时，defer 语句才会被执行，输出 "closing program." 字符串。这对于资源管理和错误处理是非常实用的。

关于 defer 的一点需要注意的地方是，多个 defer 语句会按照 LIFO（后进先出）的顺序执行。这意味着，最后一条 defer 语句将在函数返回前第一个被执行，而第一条 defer 语句将在函数返回前最后一个被执行。这种处理方式是因为在很多情况下，我们希望先处理创建任务产生的资源，最后再处理完结相关任务时产生的资源。

除了普通函数，还可以通过 defer 语句来恢复发生的 panic。在函数发生 panic 的时候，程序将会立刻停止执行，并开始按照堆栈的方式打印错误信息。如果在函数中使用了 defer panic 函数调用，那么在函数结束之前该函数将会被调用。

```go
func cleanup() {
    if r := recover(); r != nil {
        fmt.Println("recovered from ", r)
    }
}

func badCall() {
    panic("bad end.")
}

func testDefer() {
    defer cleanup()
    defer fmt.Println("deferred call in testDefer")
    badCall()
    fmt.Println("testDefer finished.")
}
```

当 badCall() 函数调用 panic() 函数的时候，会触发程序错误并调用 cleanup() 函数，它会输出错误信息，程序将会继续操作。defer 语句的作用是在确保程序在 panic() 函数之后继续执行的同时，做出一些工作。

引入 defer 关键字的目的是，让程序员更加专注于程序逻辑本身，而不是内存和资源的管理。同时，它也能确保程序遵循一些最佳实践，如锁的释放和文件的关闭操作。无独有偶，在 Python 和 Swift 等语言中也有类似的机制。但是，defer 不应该被滥用，很多情况下，通过返回错误来处理异常情况可能是更好的选择。