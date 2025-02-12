## Go 语言中的 rune 类型是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

在 Go 语言中，rune 类型是用来表示 Unicode 码点的。它本质上是 int32 类型的别名，**用来区分字符值跟整数值**。

rune类型定义在`builtin/builtin.go`文件中，它的定义为：
```go
type rune = int32
```

由于Go语言中采用的是统一的UTF-8编码，英文字母在底层占1个字节，特殊字符和中文汉字则占用1～3个字节，这样设计的目的是为了让开发者更容易地处理 Unicode 字符，**处理中文的计数和分割问题**，特别是在处理多语言文本时。
## 扩展知识

### 如何使用

1）如果要不区分中英文的统计字符串中的字符数量的时候，需要借用`rune`类型，例子如下：
```go
package main
 
import "fmt"
 
func main() {
	s := "今天happy"
	fmt.Println(len(s))         //输出11
	fmt.Println(len([]rune(s))) //输出7
}
```
2）当在一段包含中英文的字符串中，要想截取某字符的时候，需要借用`rune`类型，例子如下：
```go
package main

import "fmt"

func main() {
	s := "今天happy"
	fmt.Println(s[:2])                 //输出乱码�
	fmt.Println(string([]rune(s)[:2])) //输出今天
}

```

### 其他扩展展示
1）Unicode 和码点：

Unicode 是一种字符编码标准，它为全球的所有字符和符号设定了唯一的数字编码，称为码点（code point）。
每个 Unicode 码点通常表示一个字符，比如字母、数字或者符号。

2）为何使用 rune：

Go 语言的字符串实际上是 UTF-8 编码的字节序列。在这种情况下，一个字符可能需要多个字节来表示。作为 byte（uint8）的补充，rune 可以帮助处理和操作单个 Unicode 字符。
rune 可以直接表示一个字符；这对于处理和操作全世界范围内的字符是非常有用的。

3）byte vs rune：

byte 是 uint8 类型的别名，用来表示单个字节；通常用于操作原始的二进制数据。
rune 是 int32 类型的别名，用来表示一个 Unicode 码点；可以用于处理字符和操作字符串。

4）示例代码：

```go
package main

import "fmt"

func main() {
    var r rune = '世'
    fmt.Printf("Rune: %c, Unicode Code Point: %U\n", r, r)

    s := "你好"
    for i, r := range s {
        fmt.Printf("Character %d: %c, Unicode Code Point: %U\n", i, r, r)
    }
}
```
在这段代码中，rune 被用来表示字符 '世' 和字符串 "你好" 中的每个字符。可以看到 rune 是如何便利地表示和操作 Unicode 字符的。

5）rune 和字符串：

在 Go 语言中，字符串实际上是一个 byte 切片（[]byte），用来存储 UTF-8 编码的字节序列。
使用 range 循环字符串时，Go 会自动将每个字符解码为 rune，这简化了多字节字符的处理。
如果直接转换字符串为 []rune，可以方便地按字符访问字符串：
```go
s := "你好，世界"
runes := []rune(s)
for _, r := range runes {
    fmt.Printf("%c ", r)
}
```

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)