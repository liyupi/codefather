## Go 语言的接口是怎么实现的？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

在 Go 语言中，接口（interface）是一种**动态类型**，允许定义对象的行为，而不需要指定具体的实现。

它本质上是一个**动态类型**和**动态值**的组合：
- 动态类型：接口持有的具体数据的类型。
- 动态值：接口持有的具体数据的值或引用。

接口通过这两部分，实现对不同类型的统一操作。

Go 采用鸭子类型的设计哲学，不需要显式声明实现关系。只要一个类型的方法集满足接口的所有方法，编译器自动认为该类型实现了该接口。也就是说，**一个类型只需要定义接口要求的方法，就可以被视为实现了该接口**。

```go
//定义接口
type Speaker interface {
    Speak()
}

// 实现接口的类型
type Duck struct {}

// 定义接口要求的方法
func (d Duck) Speak() {
    fmt.Println("mianshiya!")
}

func main() {
    var s Speaker = Duck{} // 接口赋值
    s.Speak()             // 接口方法调用
}
```

## 扩展知识

### Go 接口的底层实现

Go 的接口底层数据结构是一个包含两个字段的 `iface` 结构（非空接口）或 `eface` 结构（空接口）。

#### `iface`：非空接口的数据结构

```go
// 非空接口
type iface struct {
    tab *itab         // 指向类型信息和方法表
    data unsafe.Pointer // 指向实际的数据
}
```

- **`tab *itab`**：`itab` 是一个指向方法表的指针，包含接口类型和实际类型的配对信息。`itab` 中存储了具体实现类型的方法地址，这样当接口调用方法时，可以直接通过 `tab` 访问具体类型的方法。
- **`data unsafe.Pointer`**：`data` 是一个指针，指向实际的数据。这是一个不安全指针（`unsafe.Pointer`），能够指向任意类型的内存地址。

#### `eface`：空接口的数据结构

```go
// 空接口
type eface struct {
    _type *_type         // 数据类型信息
    data  unsafe.Pointer  // 指向实际的数据
}
```

- **`_type *_type`**：空接口中 `_type` 字段指向数据的类型信息，用于描述接口的动态类型。
- **`data unsafe.Pointer`**：`data` 指向具体的数据，与 `iface` 中的 `data` 类似，用于存储实际的值或指针。

#### 类型表（`itab`）的结构

在非空接口中，`itab` 是实现接口动态分派的核心数据结构。`itab` 中包含接口类型和实际类型的关联信息及其方法地址。

```go
type itab struct {
    inter *interfacetype // 接口类型信息
    _type *_type         // 实现接口的具体类型信息
    hash  uint32         // 类型 hash 值
    _     [4]byte
    fun   [1]uintptr     // 实现接口方法的函数地址
}
```

- **`inter *interfacetype`**：接口的类型信息。
- **`_type *_type`**：具体类型的类型信息。
- **`fun [1]uintptr`**：这是一个函数指针数组，用于存储实际类型实现的接口方法地址。当接口调用某个方法时，会根据 `fun` 中存储的地址直接找到具体的实现。


```go
type interfacetype struct {
	typ     _type
	pkgpath name
	mhdr    []imethod // 具体方法列表
}
```

### 源码解析

在 Go 中，接口赋值的过程会初始化这些底层结构。源码中实现接口的关键部分如下（简化版）：

```go
func convT2I(inter *interfacetype, tab *itab, t *_type, v unsafe.Pointer) (iface, bool) {
    var i iface
    if tab == nil {
        tab = getitab(inter, t, false)
    }
    if tab == nil {
        return i, false
    }
    i.tab = tab
    i.data = v
    return i, true
}
```

`convT2I` 函数用于将具体类型转换为接口类型。

**步骤**：
  - 获取 `itab` 表，通过 `getitab` 函数找到 `inter`（接口类型）和 `t`（具体类型）对应的 `itab` 表。
  - 将接口的 `tab` 字段设置为 `itab`，将 `data` 指向实际的数据 `v`。

在实际调用接口方法时，会根据 `itab` 中存储的函数地址调用具体实现。例如，当我们调用 `i.Method()` 时，Go 会通过 `i.tab.fun[methodIndex]` 获取函数地址，然后进行方法调用。

### 类型断言的底层实现

类型断言的底层机制也依赖于接口的数据结构，通过检查接口的 `Type`，判断断言类型是否与接口的实际类型匹配。

```go
func assertE2I(inter *interfacetype, e eface) (i iface) {
    tab := getitab(inter, e._type, true)
    i.tab = tab
    i.data = e.data
    return
}
```

- **`assertE2I`**：用于将空接口断言为非空接口。
- `getitab` 会返回匹配的 `itab`，确认断言类型是否与接口的类型一致。如果一致，则将 `eface` 转换为 `iface`，这样类型断言就成功了。

### 示例：接口底层实现过程

拿上述代码举例：

```go
//定义接口
type Speaker interface {
    Speak()
}

// 实现接口的类型
type Duck struct {}

// 定义接口要求的方法
func (d Duck) Speak() {
    fmt.Println("mianshiya!")
}

func main() {
    var s Speaker = Duck{} // 接口赋值
    s.Speak()             // 接口方法调用
}
```

- 在 `var s Speaker = Duck{}` 中，Go 语言会初始化 `s` 的 `iface` 结构，`tab` 指向 `Duck` 类型对应的 `itab` 表，`data` 指向 `Duck{}` 的值。
- 调用 `s.Speak()` 时，会通过 `s.tab.fun` 中的地址直接调用 `Duck.Speak` 方法，输出 `"mianshiya!"`。

### 接口的类型断言与类型判断

- **类型断言**：`i.(T)` 用于断言接口 `i` 是否为类型 `T`，如果接口的 `Type` 与 `T` 匹配，返回对应的 `Value`，否则引发 `panic`。
- **类型判断（type Switch）**：使用 `switch i.(type)` 可以匹配接口持有的具体类型。Go 通过底层的 `Type` 信息支持这种模式匹配，实现接口多态调用。

### 接口的零值与 `nil` 判断

接口的零值为 `nil`，当且仅当接口的 `Type` 和 `Value` 都为 `nil` 时，接口本身才是 `nil`。

如果一个接口的 `Type` 不为 `nil` 而 `Value` 为 `nil`，则接口并不等于 `nil`。（这种情况常出现在接口赋值时，例如将一个指针值为 `nil` 的结构体赋值给接口变量时）


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)