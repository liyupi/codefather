# 抽象类

在 C++ 中，抽象类是一种特殊的类，不能被实例化，只能被用作其他派生类的基类。抽象类是通过在类的声明中使用纯虚函数（protected 或 public 的）来定义的，这些函数只有函数声明而没有函数定义，即不包含函数体。而派生类必须实现这些函数才可以实例化。

## 纯虚函数

所谓纯虚函数，就是在函数声明后面加上 "= 0"，表示这个函数不用在抽象类中实现，由其子类来实现。具体实现参考如下：

```c++
class Shape { 
   public:
      // 纯虚函数
      virtual double getArea() = 0;
      void setWidth(double w) {
         width = w;
      }
      void setHeight(double h) {
         height = h;
      }
   protected:
      double width;
      double height;
};

// 派生类
class Rectangle: public Shape {
   public:
      double getArea() { 
         return (width * height); 
      }
};

// 派生类
class Triangle: public Shape {
   public:
      double getArea() { 
         return (width * height / 2); 
      }
};
```

上述代码中，Shape 是一个抽象类，其中的 getArea() 是一个纯虚函数，Rectangle 和 Triangle 是其子类。在使用 Shape 指针时，可以正常访问 Shape 类的成员变量和实现部分的成员函数，但不能调用 Shape 的纯虚函数。

## 具体使用

在实际开发中，抽象类经常用来设计程序的最上层接口，只声明接口不实现功能。这样，派生类就可以继承这些接口，并根据自己的需要加以实现。这种方式也称为接口隔离。

比如，假设我们需要设计一个游戏接口类，定义所有游戏都必须实现的方法，同时为了支持多种游戏模式和后续扩展，该类是个抽象类，如下所示：

```c++
// 游戏接口
class GameInterface {
public:
    virtual void init() = 0;  // 初始化
    virtual void run() = 0;   // 运行
    virtual void exit() = 0;  // 退出
    virtual ~GameInterface() {};   // 虚析构函数
};
```

然后我们定义一个继承自 GameInterface 的具体游戏类，实现其抽象方法，如下所示：

```c++
// 具体游戏类
class Game: public GameInterface {
public:
    void init() override {/* init */};
    void run() override {/* run */};
    void exit() override {/* exit */};
};
```

这样我们就完成了一个游戏接口的设计，可以在后续如果要设计新的游戏的时候，无需去考虑初始化、运行、退出三个功能的细节，只需要继承 GameInterface 并实现对应接口即可。

抽象类的使用可以在软件开发中大大提升代码的可维护性和复用性。然而，如果过度使用抽象类，反而会导致过多的间接性和复杂性，出现“抽象类地狱”的问题。