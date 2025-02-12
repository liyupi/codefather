## 什么是 Node.js 全局对象？有哪些全局对象？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
Node.js 全局对象是指那些在任何地方都可以访问的对象，而不需要通过 `require()` 进行引入。这些对象提供了一些基本的功能和常用的工具函数，使得开发者可以更方便地进行程序设计。

主要的全局对象包括：
1）`global`：这是 Node.js 全局命名空间对象，类似于浏览器中的 `window` 对象。
2）`process`：提供有关当前 Node.js 进程的信息和控制功能。
3）`__dirname` 和 `__filename`：分别表示当前脚本文件所在目录的绝对路径和当前脚本文件的绝对路径。
4）`console`：用于打印标准输出和错误输出信息。
5）`module` 和 `exports`：与模块系统相关，用于导出和导入模块。
6）定时器函数：包括 `setTimeout()`, `clearTimeout()`, `setInterval()`, 和 `clearInterval()`。
7）`Buffer`：用于处理二进制数据。

## 扩展知识
深入了解 Node.js 全局对象有助于提高代码的效率和简洁性。我来进一步说明其中一些对象及其实际用途。

1）**global**
在 Node.js 中，`global` 是一个类似于浏览器中的 `window` 对象的全局对象。所有的全局变量（无论是模块间共享的，还是当前模块独有的）都可以通过 `global` 对象来访问。
```javascript
global.myGlobalVar = "Hello, World!";
console.log(global.myGlobalVar);  // "Hello, World!"
```

2）**process**
`process` 对象提供了与当前运行的 Node.js 进程相关的信息和方法。常用的方法包括：
- `process.argv`：返回一个数组，包含启动 Node.js 进程时的命令行参数。
- `process.env`：返回一个包含用户环境信息的对象。
- `process.exit()`：退出当前进程，并可以指定退出码。
```javascript
console.log(process.argv);  // 输出命令行参数数组
console.log(process.env.PATH);  // 输出环境变量 PATH
process.exit(1);  // 退出进程并返回状态码 1
```

3）**__dirname 和 __filename**
- `__dirname` 表示当前执行脚本所在的目录的绝对路径。
- `__filename` 表示当前执行脚本的绝对路径。
```javascript
console.log(__dirname);  // 比如 /user/home/project
console.log(__filename);  // 比如 /user/home/project/index.js
```

4）**console**
`console` 对象提供了简单的日志打印功能，包括 `console.log()`、`console.warn()` 和 `console.error()` 等方法，用来打印不同级别的日志信息。
```javascript
console.log("This is a log message.");
console.warn("This is a warning message.");
console.error("This is an error message.");
```

5）**Buffer**
`Buffer` 对象是用来处理二进制数据的一种方式，它在处理文件、网络等二进制数据时非常有用。
```javascript
const buf = Buffer.from('Hello, World!', 'utf-8');
console.log(buf.toString('hex')); // 输出十六进制表示字符串
```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)