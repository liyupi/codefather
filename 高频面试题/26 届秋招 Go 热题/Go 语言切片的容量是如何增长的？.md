## Go 语言切片的容量是如何增长的？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

在 Go 语言中，切片的容量是一种动态增长的机制。当切片的长度达到或超过容量时，Go 语言会自动扩展其底层数组的容量，一般由`append`触发。切片容量增长（growslice）的具体规则在不同版本的规则不同。

对于 go1.18 之前来说：
- 如果期望容量大于当前容量的两倍就会使用期望容量；
- 如果当前切片的长度小于 1024 的话， growslice 时就会将容量翻倍；
- 如果当前切片的长度大于 1024 的话，growslice 时会每次增加 25% 的容量，直到新容量大于期望容量。

对于 go1.18 之后来说，**减小了倍增阈值**，但是在后续25%的幅度增加的时候**把阈值作为基准的一部分**，来避免扩容次数过多的问题：

- 如果期望容量大于当前容量的两倍就会使用期望容量；
- 如果当前切片的长度小于阈值 256的话，growslice 时就会将容量翻倍；
- 如果当前切片的长度大于等于256，就会每次增加 `(newcap + 3*threshold)/4`的容量，直到新容量大于期望容量。

此外，在扩容之后还会进行一步`roundupsize`，这一步主要是**靠内存对齐的优化**，来计算出最终的容量。

## 扩展知识

要深入了解 Go 语言切片的容量增长机制，得从它的底层实现说起。

1）1.18之前和之后的源码实现

1.18之前，可以发现在大于 1024 阈值之后，是每次按照1/4的容量幅度增长的。

```go
func growslice(et *_type, old slice, cap int) slice {
    // ...
    newcap := old.cap
    doublecap := newcap + newcap
    if cap > doublecap {
        newcap = cap
    } else {
        if old.cap < 1024 {
            newcap = doublecap
        } else {
            // Check 0 < newcap to detect overflow
            // and prevent an infinite loop.
            for 0 < newcap && newcap < cap {
                newcap += newcap / 4
            }
            // Set newcap to the requested cap when
            // the newcap calculation overflowed.
            if newcap <= 0 {
                newcap = cap
            }
        }
    }
    // ...
    return slice{p, old.len, newcap}
}
```
go 1.18 之后，可以看到在大于阈值 256 之后，每次是按照`(newcap + 3*threshold)/4`的幅度增长。
```go
func growslice(et *_type, old slice, cap int) slice {
    // ...
    newcap := old.cap
    doublecap := newcap + newcap
    if cap > doublecap {
        newcap = cap
    } else {
        const threshold = 256
        if old.cap < threshold {
            newcap = doublecap
        } else {
            // Check 0 < newcap to detect overflow
            // and prevent an infinite loop.
            for 0 < newcap && newcap < cap {
                // Transition from growing 2x for small slices
                // to growing 1.25x for large slices. This formula
                // gives a smooth-ish transition between the two.
                newcap += (newcap + 3*threshold) / 4
            }
            // Set newcap to the requested cap when
            // the newcap calculation overflowed.
            if newcap <= 0 {
                newcap = cap
            }
        }
    }
    // ...
    return slice{p, old.len, newcap}
}
```
1）切片与底层数组的关系：
- 切片本质上是一个对底层数组的抽象。一个切片包含三个部分：指向底层数组的指针、切片的长度和切片的容量。
- 切片是动态数组，它的大小并非固定不变，而是可以根据需要动态扩展。

2）切片容量增大的过程：
- 当我们向切片中追加元素，如果已有的容量不足以容纳新的元素，Go 语言会自动分配一个更大的底层数组，并将旧的元素复制到新的数组中。
- 在容量小于 1024 时，新的容量至少是旧容量的两倍。而当容量达到或超过 1024 时，增长因子减小为 1.25。

3）示例代码：
- 这段代码展示了切片容量的自动增长。

```go
  package main

  import "fmt"

  func main() {
      var s []int

      // 初始值为5
      s = append(s, 1, 2, 3, 4, 5)
      fmt.Printf("Length: %d, Capacity: %d\n", len(s), cap(s)) // Length: 5, Capacity: 8
      
      // 添加更多元素，会使容量增长
      s = append(s, 6, 7, 8, 9, 10)
      fmt.Printf("Length: %d, Capacity: %d\n", len(s), cap(s)) // Length: 10, Capacity: 16
  }
  ```
4）什么是内存分配和复制？
- 当切片的容量扩展时，Go 运行时会新分配一块更大的内存空间，这涉及到内存分配操作。
- 然后，运行时将旧的底层数组的内容复制到新的内存空间。复制操作虽然是透明的，但是它的开销不容忽视，尤其是在大规模数组操作时。因此，为了减少频繁的容量扩展，通常我们可以在初始化切片时就指定一个合理的容量。

5）Go 语言优化措施：
- Go 语言中的切片设计考虑了性能和灵活性，它采用了倍增和低倍增的机制来实现容量的自动成长。
- 这种设计使得切片既能在小规模数据处理时保持高效，又能在处理大规模数据时避免频繁的内存分配和数据复制开销。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)