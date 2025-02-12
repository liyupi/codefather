## Go 语言中 init() 函数在什么时候执行？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

`init()` 函数在 Go 程序执行之前自动调用，会在 `main()` 函数执行之前。

它**用于初始化包级别的变量**，用来设置初始状态或者执行一次性初始化操作（它不能有参数，也不能返回值）。每个包中的 `init()` 函数在该包的其他代码执行之前运行，每个包可以有多个 `init()` 函数。
  
**执行顺序**：
  1. **包的初始化顺序**：如果一个包被多个包依赖，Go 会首先执行所有导入的包的 `init()` 函数，依赖的包 `init()` 函数会先执行。
  2. **同一个包内的多文件多 `init()` 函数**：以文件名的顺序调用 `init()`，同一个文件内的多个 `init()` 则是以出现的顺序依次调用。
  3. **程序入口**：最终在 `main()` 函数开始执行之前，所有相关包的 `init()` 函数都已经执行完毕。


以下图片来自《Go语言高级编程》：
<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/PyP2Z68U_image_mianshiya.png" alt="image.png" width="820px" />


## 扩展知识

### 注意点

在 `main.main` 函数执行之前所有代码都运行在同一个 `Goroutine` 中，即主系统线程中。

但是如果某个 `init()` 函数内部用启动了新的 `Goroutine` ，那么新的 `Goroutine` 和 `main.main` 函数是并发执行的。

### 使用场景与实际例子

**初始化数据库连接**：`init()` 可以用于初始化数据库连接或进行其他资源的配置。
```go
func init() {
  db, err := sql.Open("mysql", "user:password@tcp(localhost:3306)/dbname")
  if err != nil {
      log.Fatal(err)
  }
  fmt.Println("数据库连接成功")
}
```

**注册自定义的日志记录器**：当程序启动时，`init()` 可用于设置全局的日志记录配置。
```go
func init() {
  log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
}
```




> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)