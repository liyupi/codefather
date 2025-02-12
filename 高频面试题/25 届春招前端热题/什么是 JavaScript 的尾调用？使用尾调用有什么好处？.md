## 什么是 JavaScript 的尾调用？使用尾调用有什么好处？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)



## 回答重点

尾调用是指函数的最后一步操作是调用另一个函数。在 ES6 中，符合特定条件的尾调用会进行尾调用优化，这种优化通过复用当前函数的调用帧来节省内存。

### 1）尾调用的形式

最简单的尾调用形式是在函数返回时直接调用另一个函数：

```javascript
function f(x) {
  return g(x);
}
```

### 2）尾调用优化条件

- 必须是严格模式（'use strict'）
- 调用是函数的最后一步操作
- 尾调用函数不能引用当前函数作用域中的变量
- 尾调用的结果就是函数的返回值

## 扩展知识

### 1）尾调用与普通调用的区别

普通递归调用：

```javascript
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1); // 不是尾调用，需要保留当前函数的调用帧
}
```

尾递归优化：

```javascript
function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total); // 是尾调用，可以复用调用帧
}
```

### 2）尾调用优化的好处

- 节省内存：每个函数调用都会创建一个调用帧，尾调用优化可以复用调用帧
- 防止栈溢出：对于深度递归，尾调用优化可以避免调用栈过深
- 提升性能：减少了内存分配和回收的开销

### 3）常见的尾调用场景

递归函数优化：

```javascript
// 斐波那契数列
function fibonacci(n, a = 1, b = 1) {
  if (n <= 1) return b;
  return fibonacci(n - 1, b, a + b);
}
```

函数组合：

```javascript
function compose(f, g) {
  return function(...args) {
    return f(g(...args)); // 尾调用
  };
}
```

### 4）注意事项

- 不是所有的 JavaScript 引擎都实现了尾调用优化
- 只在严格模式下生效
- 间接尾调用也可以被优化：

```javascript
function f(x) {
  const g = x > 0 ? fn1 : fn2;
  return g(x); // 仍然是尾调用
}
```

### 5）调试建议

在开发环境中，可以通过以下方式验证尾调用优化是否生效：

- 使用开发者工具的调用栈查看器
- 添加调试日志观察函数调用过程
- 测试大量递归时的内存占用情况

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)