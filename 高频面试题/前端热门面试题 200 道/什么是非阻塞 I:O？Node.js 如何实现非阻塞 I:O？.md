## 什么是非阻塞 I:O？Node.js 如何实现非阻塞 I:O？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
非阻塞 I/O 是一种在输入输出操作时不需要等待数据传输完毕的方式，它允许程序继续执行其他任务，而不被当前的 I/O 操作阻塞。在非阻塞 I/O 模式下，当程序发起一个 I/O 请求时，可以立即得到响应，不需要等待 I/O 操作完成就可以继续进行其他操作。这极大地提高了系统的并发性和效率，也就是我们常说的 "不会卡住"。

Node.js 实现非阻塞 I/O 的核心技术是事件驱动和异步回调机制。Node.js 使用了一个单线程的事件循环来处理非阻塞 I/O，这意味着即使是一个长时间的 I/O 操作，也不会阻塞其他任务的执行。

## 扩展知识
为了更深入理解非阻塞 I/O 和 Node.js 实现非阻塞 I/O 的机制，可以进一步探讨一下以下几个方面：

1）**事件循环**: 事件循环是 Node.js 实现非阻塞 I/O 的核心机制。它本质上是一个无限循环，可以被分解为以下几个阶段：
   - 杂务队列（Timers）： 执行 `setTimeout` 和 `setInterval` 的回调函数。
   - I/O 回调：执行几乎所有的回调函数，除了为关闭的回调函数、杂务队列监听器和那些使用 `setImmediate` 安排的回调。
   - 空闲、准备：仅在内部使用。
   - 检查：即 `setImmediate` 回调函数在此被执行。
   - 关闭的回调函数：例如 `socket.on('close', ...)`。

2）**异步 I/O**: 当 Node.js 进行一个 I/O 操作（例如文件读取或网络请求），它不会等待操作完成，而是将回调函数挂到事件循环上等待 I/O 事件触发，这样可以继续执行其他代码。

3）**Libuv**: Node.js 依赖于一个名为 Libuv 的库，这是一个事件驱动的跨平台非阻塞 I/O 库。它为 Node.js 提供了一致的表现，并屏蔽了底层操作系统的 I/O 差异。

4）**异步编程模型**: 使用 Promise 和 `async/await` 语法，可以将回调地狱转化为更加可读的代码。例如：

```javascript
const fs = require('fs').promises;

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    console.log(data);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

readFile('example.txt');
```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)