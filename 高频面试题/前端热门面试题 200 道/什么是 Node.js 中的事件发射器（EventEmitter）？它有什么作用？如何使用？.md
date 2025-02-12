## 什么是 Node.js 中的事件发射器（EventEmitter）？它有什么作用？如何使用？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
在 Node.js 中，事件发射器（EventEmitter）是一个核心模块，提供了一种机制，可以创建、触发和监听自定义事件。它的作用是允许我们对异步事件进行订阅并在事件发生时执行回调函数。你可以把 EventEmitter 看作是一个发布-订阅模式的实现，那种有点像“我通知你XX事情发生了，你就做点什么” 的概念。

它的使用包括两个主要步骤：
1）创建一个事件发射器对象。
2）使用 `on()` 方法为特定事件注册监听器；
3）用 `emit()` 方法触发事件。

举个简单的例子：
```javascript
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// 注册一个事件和对应的监听器
eventEmitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// 触发事件
eventEmitter.emit('greet', 'World');
```

在这段代码中，我们创建了一个新的事件发射器并注册了一个名为 'greet' 的事件。当事件被触发时，即调用 `emit()` 方法时，监听器会被执行并输出 “Hello, World!”。

## 扩展知识
作为一个程序员，我觉得了解 Node.js 中的 EventEmitter 模块在异步编程中是很重要的。它使得事件驱动机制变得更加直观和灵活，尤其是在处理 I/O 操作时。例如，几乎所有 Node.js 内置模块都继承了这个机制。

### 继承 EventEmitter
在实际项目中，我们经常需要创建带有事件功能的自定义对象。可以通过继承 EventEmitter 来实现这个需求。示例如下：
```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on('event', () => {
  console.log('An event occurred!');
});

myEmitter.emit('event');
```
通过这样，你可以很方便地将事件功能集成到自己的业务逻辑中。

### 错误处理
你还需要注意的是，EventEmitter 提供了 `error` 事件来捕获和响应错误。如果没有为 `error` 事件注册监听器，当发生错误事件时，Node.js 会将其视为未捕获的异常，这会导致程序退出。所以通常我们需要为 `error` 事件添加监听器：
```javascript
myEmitter.on('error', (err) => {
  console.error('An error occurred:', err);
});
```

### 增强的事件监听器
EventEmitter 模块还提供了一些高级特性，例如一次性监听器（`once` 方法），它会在监听器执行一次后自动移除。示例如下：
```javascript
myEmitter.once('onlyOnce', () => {
  console.log('This will be logged only once');
});

myEmitter.emit('onlyOnce');
myEmitter.emit('onlyOnce');  // 不会再被触发
```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)