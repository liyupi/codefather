## Go 语言的 GoRoot 和 GoPath 有什么用？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点  

**GOROOT**：是 Go 语言安装目录的路径，包含了 Go 语言的核心工具链和标准库。  
   1. 存放 Go 编译器、构建工具（如 `go build`、`go fmt` 等）以及标准库的代码。  
   2. 编译和运行 Go 程序时，Go 编译器会从 GOROOT 中查找标准库的源代码。  
   3. 默认位置由 Go 安装程序设置，例如：`/usr/local/go`（Linux） 或 `C:\Go`（Windows）


**GOPATH**：是用户工作目录的路径，用于存储 Go 项目源代码、依赖包和构建生成的二进制文件。   
   1. 定义了 Go 项目的工作目录，Go 代码必须放在 GOPATH 下的 `src` 目录中。 
   2. 下载的依赖包会被存放在 GOPATH 下的 `pkg` 目录。  
   3. 编译后的可执行文件会被放在 GOPATH 下的 `bin` 目录。  
   4. Go 1.8 及以上版本中，如果没有设置 GOPATH，Go 会使用默认的工作目录，例如：`$HOME/go`（Linux/macOS）或 `%USERPROFILE%\go` （Windows）

**结构**：  
```plaintext
GOPATH/
├── src/   # 源代码目录
│   └── myproject/
│       └── main.go
├── pkg/   # 编译后的包文件
│   └── <os>_<arch>/
└── bin/   # 可执行文件
   └── myproject
```  

总结表格如下：
| **对比项**       | **GOROOT**                      | **GOPATH**                         |  
|------------------|---------------------------------|----------------------------------|  
| **作用**         | Go 安装目录，包含标准库和工具链   | Go 工作目录，存储项目和依赖包       |  
| **是否可修改**    | 一般不需要修改，由安装时自动设置  | 用户可以根据需求设置多个工作路径     |  
| **存储内容**      | Go 编译器、工具和标准库          | Go 代码、第三方依赖和可执行文件      |  
| **目录结构**      | 无固定要求                      | 必须包含 `src`、`pkg` 和 `bin` 三个目录 |  


## 扩展知识  

### 设置 GOROOT 和 GOPATH  

1）**查看当前 GOROOT 和 GOPATH**：  
```bash
go env GOROOT
go env GOPATH
```

2）**手动设置 GOPATH（示例）**：  
```bash
export GOPATH=$HOME/go  # Linux/Mac
set GOPATH=C:\go-workspace  # Windows
```

3）**同时支持多个 GOPATH**（用冒号 `:` 分隔）：  
```bash
export GOPATH=$HOME/go:$HOME/projects/go
```

### Go Modules 与 GOPATH 的关系  

**Go Modules** 是 Go 1.11 引入的依赖管理方式，逐渐取代了 GOPATH。启用 Go Modules 后，项目代码不必放在 GOPATH 下，可以放在任何位置。  

**GOROOT** 依旧保留，用于查找标准库代码。  

示例：启用 Go Modules  
```bash
go mod init myproject
```
此时，项目的依赖管理与 GOPATH 无关，而是基于 `go.mod` 文件。  


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)