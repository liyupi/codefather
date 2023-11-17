# Lambda 表达式

Lambda 表达式是 C++11 新增的一种语法，也是函数式编程中的核心概念之一。它可以方便地定义一个匿名函数，使得代码更加灵活、简洁。在 STL 和多线程等领域都有着重要作用。

## 语法

Lambda 表达式的基本语法如下：

```
[capture list](parameter list) -> return type {
    // 函数体
}
```

- `capture list`：捕获列表，指定在 lambda 表达式内部使用的外部变量。可以为传值捕获、引用捕获和隐式捕获。
- `parameter list`：函数参数列表，可以为空。
- `return type`：返回值类型，可以省略并通过自动类型判断推导出来。
- `函数体`：Lambda 函数体，与普通函数一样。

以上内容都可以省略，具体使用根据实际情况选择。Lambda 表达式可以作为函数参数或返回值，或者在需要一个函数对象的地方将其赋值给一个变量。下面通过一个例子来说明其用法。

## 举例说明

假设有一个数组，现在需要对其中的元素进行求和。我们需要创建一个函数来实现这个功能，并通过 Lambda 表达式传递给另外一个函数。代码如下：

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main()
{
    std::vector<int> nums {1, 2, 3, 4, 5};

    // 使用 Lambda 表达式作为 reduce() 函数的参数
    int sum = std::reduce(nums.begin(), nums.end(), 0, [](int x, int y) {
        return x + y;
    });

    std::cout << "Sum: " << sum << std::endl;

    return 0;
}
```

在上述代码中，我们使用 Lambda 表达式作为 `std::reduce()` 函数的第四个参数，从而实现了对数组元素的求和。Lambda 表达式的具体含义如下：

- 捕获列表为空，即没有使用外部变量。
- 参数列表为 `int x, int y`，表示 Lambda 表达式接收两个参数。
- 返回类型为 `int`，即返回一个整型值。
- 函数体为 `return x + y;`，即对两个参数求和并返回结果。

## 更多应用场景

Lambda 表达式还可以用于许多其他应用场景，例如：

### STL 算法

Lambda 表达式在 STL 算法中既可以用于作为谓词，也可以作为其他类型的函数对象使用。例如：

```cpp
std::vector<int> nums {1, 2, 3, 4, 5};

// 统计偶数元素的个数
int count = std::count_if(nums.begin(), nums.end(), [](int x) {
    return x % 2 == 0;
});

std::cout << "Count: " << count << std::endl;
```

### 并行编程（多线程）

C++11 的标准库中新增加了一个 `<thread>` 头文件，其中包含了一些创建线程的工具。Lambda 表达式可以很方便地传递函数对象给新线程，从而实现多线程编程。

```cpp
#include <iostream>
#include <thread>

void task(int id)
{
    std::cout << "Task " << id << " is running." << std::endl;
}

int main()
{
    std::thread t1(task, 1);

    // 通过 Lambda 表达式创建新线程
    std::thread t2([] {
        std::cout << "Task 2 is running." << std::endl;
    });

    t1.join();
    t2.join();

    return 0;
}
```

在上述代码中，我们使用 Lambda 表达式创建了另外一个线程，并在其中执行一个简单的任务。

### GUI 编程

在 GUI 编程中，Lambda 表达式可以用于事件响应函数。例如：

```cpp
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QPushButton>

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
    QMainWindow window;

    QPushButton *button = new QPushButton("Click me!", &window);
    QObject::connect(button, &QPushButton::clicked, [] {
        std::cout << "Button is clicked." << std::endl;
    });

    window.show();
    return app.exec();
}
```

在上述代码中，我们创建了一个简单的 Qt 窗口，并在其中创建了一个按钮，当它被点击时，Lambda 表达式将被调用。

## 总结

Lambda 表达式是 C++11 新增的一种语法，可以方便地定义匿名函数，提高了代码的灵活性和可读性。除了上述介绍的应用场景外，Lambda 表达式还可以用于函数对象的传递、闭包等许多其他领域，是 C++ 中一个非常重要的概念。