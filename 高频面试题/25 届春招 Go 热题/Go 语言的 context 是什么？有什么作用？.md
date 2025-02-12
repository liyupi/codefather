## Go 语言的 context 是什么？有什么作用？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

Go 语言的 context 是一个标准库中的包，提供了用于上下文管理的功能，包主要用于在多个 goroutine 之间传递上下文信息，比如：截止时间、取消信号以及携带请求特定值。在并发编程中，它可以帮助我们更好地管理 goroutine 的生命周期和资源使用。常用在 Web 服务器、API 调用、数据库操作等需要跨多个 goroutine 协同工作的场景中

context 有以下几个主要作用： 

1）**控制并发任务的生命周期**：通过在多个 goroutine 之间共享一个 context.Context，可以实现一处取消，处处响应，如果一个请求超时或客户端取消了请求，那么可以通过 context 传播取消信号，通知所有相关的 goroutine 停止工作，从而避免资源泄露。 

2）**传递请求范围内的数据**：在处理HTTP请求时，context可以用来传递一些请求相关的数据，比如认证Token、用户信息等。 （不建议过多使用）

3）**设置超时时间**：可以通过context来设置某个操作的超时时间，一旦超时，相关的goroutine就会被取消。

## 扩展知识

context 是一个包，context.Context 是一个 interface 。下面分别讲解 context.Context 这个接口中提供的若干方法，与 context 包内置的一些对象的实现。

### context.Context 接口中提供的若干方法

定义：

```go
type Context interface {
	Deadline() (deadline time.Time, ok bool)
	Done() <-chan struct{}
	Err() error
	Value(key any) any
}

```
> 使用示例在最后

**1）Deadline() (deadline time.Time, ok bool)：用在需要对某个操作设置超时时间的场景。**

作用：Deadline 方法返回一个时间点（time.Time），表示该 Context 何时会超时。返回的 ok 布尔值用于指示是否设置了这个截止时间。

- 如果 ok 返回 false，说明这个 Context 没有设置截止时间。
- 如果 ok 返回 true，则 deadline 是截止时间。在这之后，Context 会自动取消。

**2）Done() <-chan struct{} ：是实现取消操作的核心方法。**

作用：Done 方法返回一个 channel，当 Context 被取消或超时时，这个 channel 会关闭。可以通过监听该方法返回的 channel 来判断 Context 何时被取消。例如，如果在等待某个任务完成时发现 Done() 返回的 channel 已关闭，那么可以立即终止操作。

**3） Err() error：用于在上层代码中检查和处理不同的取消情况。**

作用：Err 方法返回一个错误，指示 Context 为什么被取消。在 Done channel 关闭之后，可以调用 Err() 来了解取消的原因。可能的返回值包括：
- nil：如果 Context 没有被取消。
- context.Canceled：如果 Context 被手动取消。
- context.DeadlineExceeded：如果 Context 的截止时间已过。

**4） Value(key any) any：用于传递跨 API 边界的请求范围数据，例如身份验证令牌、请求标识符等。**

作用：Value 方法用于从 Context 中检索与某个键相关联的值。它允许将少量的请求范围内的状态或数据传递给子 goroutine。可以通过`context.WithValue()`来设置 key-value 对，但不要滥用 Value 来传递大量数据或使用它来传递控制信号。

### context 包内置的对象实现

1）emptyCtx类型（本质是一个int）
```go
type emptyCtx int
```
在该类型下有两个全局变量

```go
var (
	background = new(emptyCtx) 
	todo       = new(emptyCtx)
)
```
二者是相同类型的不同变量，只是语义不同，分别在代码中使用
```go
ctx := context.Background() //一个空的Context。注意是指针类型
ctx := context.TODO()       //一个待完成的Context，常用于代码初期占位。注意是指针类型
```
> 注意，程序中多次调用`context.Background()`，其实得到的是相同对象而已。`context.TODO()`同理

二者的唯一区别是在调用`.String()`方法时：
```go
func (e *emptyCtx) String() string {
	switch e {
	case background:
		return "context.Background"
	case todo:
		return "context.TODO"
	}
	return "unknown empty Context"
}
```

2）派生Context：

context.WithCancel(parent Context)：基于父 Context 创建一个可取消的子 Context，并返回这个子 Context 和一个取消函数。调用取消函数会取消该 Context。（并且如果父的取消了，子的也会取消）

context.WithDeadline(parent Context, deadline time.Time)：基于父 Context 创建一个有截止时间的子 Context，并返回子 Context 和一个取消函数。时间到达后，子 Context 会自动取消。

context.WithTimeout(parent Context, timeout time.Duration)：创建一个超时Context，实质上是WithDeadline的简化版。

context.WithValue(parent Context, key, val)：创建一个携带特定值的Context。（一般不用）

注意，这里`parent`参数在初始时可以传参为`context.Background()`

### Context的使用场景：

HTTP服务器中：在处理一个HTTP请求时，可以使用context来管理请求的生命周期、传递请求范围内的数据或者设置请求处理的超时时间。

数据库操作：在数据库操作中，可以用context来控制查询的超时时间或取消正在进行的查询。

长时间运行的任务：在一些需要长时间运行的任务中，使用context可以更好地控制这些任务的生命周期，避免因为某些意外情况而导致资源泄露。


### 示例

展示如何使用context来管理goroutine的生命周期：

```go
package main

import (
	"context"
	"fmt"
	"time"
)

func main() {
	// 创建一个可取消的context
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()  // 确保函数结束时取消context

	// 启动一个goroutine，监听cancel信号
	go func(ctx context.Context) {
                // 判断是否有设置Deadline，如果没有则为设置了cancel函数
                if deadline, ok := ctx.Deadline(); ok {
                    fmt.Println("Deadline set for:", deadline)
                } else {
                    fmt.Println("No deadline set.")
                }
		for {
			select {
			case <-ctx.Done():
				fmt.Println("Goroutine被取消")
				return
			default:
				fmt.Println("Goroutine运行中")
				time.Sleep(1 * time.Second)
			}
		}
	}(ctx)

	// 运行3秒后取消Context
	time.Sleep(3 * time.Second)
	cancel()

	// 等待一会儿以便观察输出
	time.Sleep(1 * time.Second)
	fmt.Println("主程序结束")
}
```








> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)