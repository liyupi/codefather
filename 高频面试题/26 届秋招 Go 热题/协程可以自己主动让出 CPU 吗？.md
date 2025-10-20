## 协程可以自己主动让出 CPU 吗？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
可以使用 `runtime.Gosched()` 函数来主动让出 CPU 的使用权。这个操作会将当前协程标记为可运行状态（不会挂起当前的协程），将其放回调度队列中，允许其他协程运行。

> 注意：runtime.Gosched() 不是阻塞操作，调用后，当前协程仍然处于可运行状态，不会被挂起。
它只是让当前协程暂时退出执行，重新参与调度。

## 扩展知识

### runtime.Gosched() 使用示例

例如以下代码：
```go
package main

import (
	"fmt"
)

func show(i int) {
	fmt.Println(i)
}

func main() {

	for i := 0; i < 10; i++ {
		go show(i)
	}

	fmt.Println("mianshiya")
}
```

编译运行后仅输出 "mianshiya"，不会输出数字。

加入 `runtime.Gosched()` 后，有机会输出数字。

```go
package main

import (
	"fmt"
	"runtime"
)

func show(i int) {
	fmt.Println(i)
}

func main() {

	for i := 0; i < 10; i++ {
		go show(i)
	}
	runtime.Gosched()
	fmt.Println("mianshiya")
}
```



<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/zdd27wgT_image_mianshiya.png" alt="image.png" width="607" />

### 主动让出 CPU 的应用场景
1. 避免协程长期占用 CPU：在某些计算密集型操作中，主动让出 CPU 可以让其他协程有机会运行，避免调度不公平。
2. 手动控制调度：在实现协程间同步、限流等复杂逻辑时，可以使用 runtime.Gosched() 协调执行顺序。
3. 调试程序时。

### **其他相关的调度函数**
- `runtime.GOROOT()` 获取 goroutine 的根路径。
- `runtime.NumGoroutine()` 获取当前运行的 goroutine 数量，便于监控和调试。
- `runtime.Goexit()` 立刻终止当前 goroutine。




> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)