## Go 语言 channel 底层的数据结构是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

在Golang中channel底层的数据结构叫`hchan`，它是如下数据结构：

```Go
type hchan struct {
	qcount   uint           // 队列中所有数据总数
	dataqsiz uint           // 环形队列的 size
	buf      unsafe.Pointer // 指向 dataqsiz 长度的数组
	elemsize uint16         // 单个元素大小
	closed   uint32         // 队列是否已经被关闭
	elemtype *_type // 保存的元素类型
	sendx    uint   // 已发送的元素在环形队列中的位置
	recvx    uint   // 已接收的元素在环形队列中的位置
	recvq    waitq  // 接收者的等待队列
	sendq    waitq  // 发送者的等待队列

	lock mutex  // 数据保护锁
}
```

### 有缓冲channel

故名思意有缓冲channel即内部有缓存数据的地方，即源码中的buf，buf的长度即为缓冲的长度。

1. buf指向一个数组，数组用作环形队列。
2. 写入数据是放到数组的sendx的位置。
3. 读取数据是从recvx位置开始读，当recvx与sendx相等是表示无数据。

### 无缓冲channel

无缓冲chnanel的buf字段指向unsafe.Pointer(nil)，即无缓冲队列。

1. 当数据写入时，把当前的发送端写入到sendq中，并使当前发送端进入阻塞态。
2. 当数据接收时，获取sendq队列中的元素，并将数据交给接收端，同时解除sendq的阻塞。
3. 当数据接收先触发时则进行相反操作。

Github源码：https://github.com/golang/go/blob/master/src/runtime/chan.go#L33

## 扩展知识

### 性能优化

1. **缓冲区大小**： 合理设置 `channel` 的缓冲区大小可以提高性能，减少 goroutine 的阻塞和上下文切换。
2. **避免不必要的阻塞**： 在高并发场景中，尽量避免 `channel` 的发送和接收操作阻塞，可以通过增加缓冲区大小或使用 `select` 语句来实现。
3. **减少锁竞争**： `channel` 的底层实现使用了互斥锁，频繁的锁竞争会影响性能。可以通过减少对共享资源的访问来优化性能。

### 常见陷阱

1）**关闭已关闭的 `channel`**： 关闭一个已经关闭的 `channel` 会导致 panic，因此在关闭 `channel` 前应确保它未被关闭。

```go
func safeClose(ch chan int) {
   defer func() {
       if recover() != nil {
           fmt.Println("Channel already closed")
       }
   }()
   close(ch)
}
```

   

2）**从已关闭的 `channel` 接收数据**： 从已关闭的 `channel` 接收数据不会阻塞，并且会返回 `channel` 元素类型的零值。

```go
ch := make(chan int)
close(ch)
value, ok := <-ch
fmt.Println(value, ok) // 输出: 0 false
```

   

3）**死锁**： 如果所有的 `channel` 操作都阻塞，程序会发生死锁。应避免在没有其他 goroutine 运行的情况下进行阻塞操作。

```go
func main() {
   ch := make(chan int)
   ch <- 1 // 死锁，因为没有其他 goroutine 接收数据
}
```

### 最佳实践

1. **使用 `select` 语句处理多个 `channel`**： 在需要同时处理多个 `channel` 的情况下，使用 `select` 语句可以提高代码的健壮性和可读性。
2. **合理设置缓冲区大小**： 根据具体的应用场景，合理设置 `channel` 的缓冲区大小，以平衡性能和资源使用。
3. **避免滥用 `channel`**： 虽然 `channel` 是 Go 语言中强大的并发工具，但在某些情况下，使用互斥锁（`sync.Mutex`）或其他同步机制可能更合适。
4. **关闭 `channel` 的时机**： 只有在确定没有其他发送操作时才关闭 `channel`，并且通常由发送方负责关闭 `channel`。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)