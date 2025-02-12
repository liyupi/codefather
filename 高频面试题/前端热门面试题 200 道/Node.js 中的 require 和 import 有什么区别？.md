## Node.js 中的 require 和 import 有什么区别？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
在Node.js中，`require`和`import`是用于引入模块的两种不同方式。`require`是基于CommonJS模块规范的，而`import`则是基于ES6模块规范的。以下是它们的核心区别：

1）模块规范：`require`遵循CommonJS规范，而`import`则遵循ES6（ES2015）模块规范。

2）语法形式：`require`的语法是：`const module = require('module_name');`，而`import`的语法是：`import module from 'module_name';`。

3）执行时机：`require`是同步加载模块并立即执行，`import`则是异步加载，这点在未来的ES module实现中更加的明显。

4）支持范围：`require`在Node.js中被广泛使用且原生支持，而`import`需要babel等编译器的支持才能在当前Node.js版本中使用。

## 扩展知识
为了更好地理解这两者的区别，我们可以进一步探讨它们的使用场景和兼容性问题。

1）具体使用场景：
   - `require` 常用于需要立即同步加载模块的场合，因为它是同步的，一旦调用`require`，程序会等待模块加载完成后再继续执行。
   - `import` 更适合于现代前端项目和需要异步加载模块的场景，因为它是异步加载的，不会阻塞主线程。

2）ES Modules的优势：
   - 静态分析：在编译时可以知道哪些模块被使用，这对于性能优化和错误检测非常重要。
   - 树摇优化(Tree Shaking)：能够做到只引入代码中实际用到的部分，从而减小bundle的体积。

3）使用变迁：
   - 在早期Node.js版本中，CommonJS是唯一的选择，因为那是最早支持的模块系统。随着JavaScript语言的发展以及ES6的推出，ES模块系统（ESM）逐渐成为了主流规范。
   - 在最近的Node.js版本中（14.0.0及以上），原生支持ESM。但在实际项目中，为了确保兼容性，许多人仍然使用`require`或通过babel将ES6模块代码转译为CommonJS。

典型代码例子：
```javascript
// CommonJS - require
const fs = require('fs');
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// ES6 Modules - import
import fs from 'fs/promises';
fs.readFile('file.txt', 'utf8')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)