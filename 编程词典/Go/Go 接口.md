# 接口

在 Go 中，接口是一种定义方法的类型。接口类型是由一组方法签名定义的，接口类型的变量可以存储实现这些方法的任何值。换句话说，接口是一种约束或者规范，规定了类型应该实现哪些方法。

## 接口的定义

接口的定义格式如下：

```go
type 接口名 interface {
    方法名(参数列表) 返回值列表
}
```

其中，接口名为合法的标识符，参数列表和返回值列表表示方法的参数类型和返回值类型。接口中的方法必须全部实现，否则将无法通过编译。

下面是一个例子，定义了一个 Point 接口：

```go
type Point interface {
    Distance() float64
    Move(dx, dy float64)
}
```

## 接口的实现

在 Go 中，一个类型只需要实现了接口中定义的方法，那么它就自动实现了这个接口，无需显式地声明。

下面是一个例子，定义了一个 Point 类型，并为其实现 Point 接口：

```go
type Point struct {
    X, Y float64
}

func (p *Point) Distance() float64 {
    return math.Sqrt(p.X * p.X + p.Y * p.Y)
}

func (p *Point) Move(dx, dy float64) {
    p.X += dx
    p.Y += dy
}
```

## 接口的多态

在 Go 中，接口是实现多态的关键。由于接口类型变量可以存储任何实现了该接口的类型的值，所以我们可以为不同的类型实现同一接口，从而实现多态。

例如，我们可以定义一个 Rectangle 类型，并为其实现 Point 接口中的 Distance 和 Move 方法：

```go
type Rectangle struct {
    X1, Y1, X2, Y2 float64
}

func (r *Rectangle) Distance() float64 {
    return math.Sqrt(math.Pow(r.X2-r.X1, 2) + math.Pow(r.Y2-r.Y1, 2))
}

func (r *Rectangle) Move(dx, dy float64) {
    r.X1 += dx
    r.Y1 += dy
    r.X2 += dx
    r.Y2 += dy
}
```

然后，我们可以将 Point 类型的变量指向一个 Rectangle 类型的变量，实现多态效果：

```go
p := &Point{3, 4}
r := &Rectangle{0, 0, 5, 5}

// 同时调用 Point 接口的 Distance 和 Move 方法
shapes := []Point{p, r}

for _, shape := range shapes {
    fmt.Println(shape.Distance())
    shape.Move(1, 1)
}
```

## 接口的类型断言

由于接口类型变量可以存储任何实现了该接口的类型的值，所以在某些情况下，需要判断一个接口类型变量存储的值是哪种类型。

可以使用类型断言来判断一个接口类型变量存储的值是否为某个类型。类型断言的基本格式为：

```go
value, ok := interface.(Type)
```

其中，value 表示类型断言后的变量，ok 表示类型断言是否成功。如果成功，ok 的值为 true，否则为 false。还可以直接使用以下形式：

```go
value := interface.(Type)
```

如果类型断言失败，将会抛出 panic，因此在使用类型断言时需要格外小心。

下面是一个使用类型断言的例子，判断一个接口类型变量存储的值是否为 Point 类型：

```go
var i interface{} = &Point{3, 4}

switch v := i.(type) {
case Point:
    fmt.Println("存储的值是 Point 类型")
default:
    fmt.Println("存储的值不是 Point 类型")
}
```

## 总结

本文介绍了 Go 中的接口类型，包括接口的定义、实现、多态和类型断言等相关内容。通过使用接口，我们可以实现面向对象编程中的多态等特性，使代码更为灵活和可扩展。