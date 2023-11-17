# Go module

在 Go 1.11 版本中加入了新的项目管理方式 Go module，解决了旧方式包管理工具 govendor、dep 等存在的问题。Go module 可以从 https://golang.org/ref/mod 了解。

Go module 的主要作用是：

1. 实现了版本控制。Go module 中添加了类似于 Git 中 tag 的版本概念，开发人员可以根据自己需求制定版本。

2. 更好的支持私有代码仓库的依赖管理。传统的 GOPATH 方式有一个致命的问题就是，不能很好地处理私有库的依赖抓取和管理，而 Go module 可以支持从私有的代码仓库中获取依赖。

3. 支持多个版本的同时存在。在 Go 1.11 之前，当我们需要使用两个项目的不同版本时，必须使用不同的 GOPATH。但在 Go module 中，可以在同一个 GOPATH 下，使用不同的版本，且版本之间不会冲突。

4. 更好的支持跨平台编译。Go module 引入了 go.sum 文件，用于记录当前项目所依赖的第三方包具体版本和哈希值，并且可以锁定依赖包的版本，免去了多人协同开发出现的版本冲突。

在使用 Go module 时，需要在项目根目录下初始化模块：

```
go mod init example.com/hello
```

这条命令会在当前目录下生成一个 go.mod 文件，用于管理当前模块的依赖包信息。在项目中使用 Go module 后，下载第三方包不再需要使用 GOPATH，而是直接使用以下命令：

```
go get example.com/hello
```

Go module 是 Go 语言生态圈中不可或缺的重要组成部分，学会使用 Go module，将有利于我们更好地管理项目并提高开发效率。