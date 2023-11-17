# 多线程编程

计算机的多核处理器使多线程编程变得越来越重要。通过使用多线程，我们可以将 CPU 资源分配到不同的任务中并发执行，提高程序的执行效率。在 C++ 中实现多线程编程可以使用标准库中的 `std::thread` 类和 `std::mutex` 类。

## std::thread 类

`std::thread` 是 C++11 中引入的线程类。通过 `std::thread` 类，我们可以创建一个新的线程并执行指定的函数或者成员函数。以下是一个简单的例子：

```c++
#include <thread>
#include <iostream>

void hello() {
    std::cout << "Hello from thread " << std::this_thread::get_id() << std::endl;
}

int main() {
    std::thread t(hello);
    std::cout << "Hello from main thread " << std::this_thread::get_id() << std::endl;
    t.join();
    return 0;
}
```

在上面的代码中，`std::thread t(hello)` 创建了一个新的线程，并执行了函数 `hello`。`std::this_thread::get_id()` 返回当前线程的 ID。在主线程中，我们也输出了同样的信息。`t.join()` 等待新线程执行完毕并结束。

## std::mutex 类

`std::mutex` 类用来控制多个线程之间的访问。如果多个线程同时访问同一个共享资源，就有可能引起数据竞争和一系列的问题。在 C++ 中，我们可以通过 `std::mutex` 类来解决这些问题。以下是一个例子：

```c++
#include <thread>
#include <mutex>

std::mutex m;

void increment(int& value) {
    for (int i = 0; i < 100000; ++i) {
        m.lock();
        ++value;
        m.unlock();
    }
}

int main() {
    int value = 0;

    std::thread t1(increment, std::ref(value));
    std::thread t2(increment, std::ref(value));

    t1.join();
    t2.join();

    std::cout << "value = " << value << std::endl;

    return 0;
}
```

在上面的代码中，我们创建了两个线程，分别执行函数 `increment`。如果我们不加控制的访问共享变量 `value`，就有可能出现数据竞争和结果错误。为了解决这个问题，我们添加了互斥锁 `m` 来保护值的访问，并在 `increment` 函数里使用 `m.lock()` 和 `m.unlock()` 控制访问。

## 总结

多线程编程需要注意的问题很多，常见的问题包括数据竞争、死锁、优先级反转等。因此，在使用多线程编程的时候，要非常小心。