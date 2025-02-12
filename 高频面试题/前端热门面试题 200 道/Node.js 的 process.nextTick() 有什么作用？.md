## Node.js 的 process.nextTick() 有什么作用？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
`process.nextTick()` 用于将一个回调函数插入到当前执行栈的尾部，在下一次事件轮询（Event Loop）之前调用这个回调函数。换句话说，它优先于其他任何 I/O 事件、定时器或其他 `setImmediate` 回调运行。

## 扩展知识
1）**事件循环（Event Loop）**：在理解 `process.nextTick()` 之前，有必要了解 Node.js 的事件循环。Node.js 是单线程的，借助事件循环可以进行异步操作。事件循环大致分为六个阶段：定时器（Timers）、IO 回调、idle/prepare、轮询（Poll）、检查（Check）、Close 回调。在这些阶段中，不同的回调会被执行。每次事件循环的最大特点就是，当一个阶段中的回调执行完毕之后，才会进入下一个阶段。

2）**与 `setImmediate()` 的区别**：`process.nextTick()` 和 `setImmediate()` 经常被混淆。`process.nextTick()` 会在事件循环的当前阶段完成后立即执行，而 `setImmediate()` 则在事件循环的"检查"阶段执行。这里有一个例子来展示它们的不同：

```javascript
// 使用 process.nextTick()
process.nextTick(() => {
    console.log('nextTick callback');
});

// 使用 setImmediate()
setImmediate(() => {
    console.log('setImmediate callback');
});

console.log('regular code');
```
在上述代码中，输出的顺序是：
```
regular code
nextTick callback
setImmediate callback
```
这是因为 `process.nextTick()` 会在当前路径执行栈完成后立即执行，而 `setImmediate()` 则是等到事件循环的检查阶段。

3）**对性能的影响**：滥用 `process.nextTick()` 可能导致性能问题和“饿死”I/O 回调。因为一个 `process.nextTick()` 回调会在所有其他 I/O 回调之前执行，如果此机制被滥用，大量堆积的回调可能会延迟实际 I/O 操作的执行。因此，应该慎重使用 `process.nextTick()`，以免让其他重要任务得不到及时处理。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)