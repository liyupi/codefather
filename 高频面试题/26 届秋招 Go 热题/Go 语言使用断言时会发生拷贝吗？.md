## Go 语言使用断言时会发生拷贝吗？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

在 Go 语言中，**类型断言是否发生拷贝**取决于接口内部持有的数据类型：

- **值类型**：当接口持有的是值类型（例如 `int`、`float`、`struct` 等），进行类型断言时会**发生拷贝**，因为接口存储的是这个值的副本，断言后得到的是该值的拷贝。
- **引用类型**：当接口持有的是引用类型（例如指针、切片、映射、通道等），进行类型断言时不会发生拷贝，因为接口存储的是一个引用，断言得到的也是相同的引用。

因此，如果接口中存储的是一个结构体实例，通过断言得到的是结构体的值拷贝，修改断言后的变量不会影响接口中的值；而如果接口中存储的是指针，通过断言得到的依然是指针引用，修改断言后的指针值会影响接口内的原数据。

## 扩展知识

### 什么是类型断言

类型断言用于将接口类型的值转换为具体类型的值。如果你有一个接口类型的变量，可以使用类型断言来提取其动态类型和值。

断言的格式为：
```
<目标类型的值>，<布尔参数> := <表达式>.( 目标类型 ) 
```
可以把类型的值(x)，转换成类型(T)。代码表示为：x.(T)

要正确使用断言，对 x 和 T 的类型有限制如下：

- 类型断言的必要条件就x是接口类型，非接口类型的x不能做类型断言；
- T可以是非接口类型，如果想断言合法，则T必须实现x的接口；
- T也可以是接口，则x的动态类型也应该是接口T；

示例：
```go
var x interface{} = 10
y := x.(int)  // 将 x 断言为 int 类型
```
在这个例子中，x 是 interface{} 类型的变量，包含一个动态类型 int 和一个 int 类型的值 10。使用类型断言将其转换为 int 类型，并赋值给变量 y。

### 注意类型断言错误处理

类型断言如果失败会触发 panic。如果不确定接口值的动态类型，可以如下代码写法来避免运行时错误：

```go
package main

import (
  "fmt"
)

func main() {

  var x interface{}
  x =100
  value1,ok :=x.(int)
  if ok { 
    fmt.Println(value1) // 输出100
  }
  value2,ok :=x.(string)
  if ok { // ok=false，所以不进入这个分支
    fmt.Println(value2)
  }
}
```
这种方式可以安全地检查类型并避免程序崩溃。


### 为什么值类型会发生拷贝

Go 的接口是一种特殊的类型，用来存储实现了接口的任何数据。接口存储数据时会包含两部分：**类型信息**（Type）和**值信息**（Value）。当接口持有值类型时，接口内部存储的就是该值的副本，因此类型断言会复制出一个新的副本，而不会直接影响接口中的值。

```go
var i interface{} = 12       // 接口持有一个 int 类型的值
v := i.(int)                 // 断言后 v 是 i 中 int 的拷贝
v = 100                      // 修改 v 不会影响接口 i 中的值
fmt.Println(i)               // 输出 42
```

在上例中，`v` 是 `i` 中 `int` 的一个拷贝，因此修改 `v` 不会影响 `i` 中的值。

### 为什么引用类型不会发生拷贝

对于引用类型，接口中存储的是指向该数据的引用，因此类型断言得到的仍然是相同的引用。无论接口是否通过类型断言解引用，最终都是指向同一个数据，因此不会产生拷贝。

```go
type MyStruct struct {
    Field int
}
var i interface{} = &MyStruct{Field: 12}  // 接口持有一个 *MyStruct 指针
v := i.(*MyStruct)                        // 断言后 v 是同一个 *MyStruct 指针
v.Field = 100                             // 修改 v 会影响接口 i 中的数据
fmt.Println(i.(*MyStruct).Field)          // 输出 100
```

在这个例子中，`v` 是指向 `MyStruct` 的指针，与接口 `i` 中的指针指向相同的地址，因此修改 `v` 的值会影响接口 `i` 中的数据。

### 对比值类型与引用类型的类型断言示例

```go
package main

import (
    "fmt"
)

type MyStruct struct {
    Field int
}

func main() {
    var i interface{} = MyStruct{Field: 12}

    if ms, ok := i.(MyStruct); ok {
        // 使用 %p 显示内存地址
        fmt.Printf("Address of ms: %p\n", &ms)
        fmt.Printf("Address of i: %p\n", &i)
        fmt.Println(ms.Field) // 输出: 12

        // 尝试修改 ms 的 Field 值
        ms.Field = 123

        // 无法修改，依然输出12
        if ms2, ok := i.(MyStruct); ok {
                fmt.Println(ms2.Field) // 输出: 12
        }
    }

    // 如果我们想要通过接口修改原始值，需要确保接口持有的是引用类型（如指针）
    var ip interface{} = &MyStruct{Field: 12}
    if msp, ok := ip.(*MyStruct); ok {
        msp.Field = 1234567
    }

    // 现在通过断言再次获取值，验证修改
    if ms, ok := ip.(*MyStruct); ok {
        fmt.Println(ms.Field) // 输出: 1234567
    }
}
```

输出结果如下：

```go
Address of ms: 0xc00008e098
Address of i: 0xc00008c290
12
12
1234567
```

### 类型断言和类型转换

类型断言和类型转换在使用场景和方式上有所不同。类型断言是用在接口变量上，而类型转换则是在具有相同底层数据结构的不同类型之间进行转换。

```go
var a int = 10
var b int32 = int32(a)  // 类型转换
```

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)