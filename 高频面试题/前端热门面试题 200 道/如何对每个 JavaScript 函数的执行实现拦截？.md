## 如何对每个 JavaScript 函数的执行实现拦截？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
要对每个 JavaScript 函数的执行实现拦截，可以使用 JavaScript 的 Proxy 和 Reflect 这两个对象。Proxy 对象用于定义自定义行为（如函数调用、属性访问等）的拦截器，Reflect 则可以确保原生操作的默认行为得以执行。通过这种方式，我们可以在捕获函数调用时添加我们自定义的逻辑。

示例代码：
```javascript
function interceptFunction(func) {
    return new Proxy(func, {
        apply(target, thisArg, argumentsList) {
            console.log(`Intercepting function call: ${target.name}`);
            // 可以在这里添加自定义逻辑
            return Reflect.apply(target, thisArg, argumentsList);
        }
    });
}

function myFunction(a, b) {
    return a + b;
}

const interceptedFunction = interceptFunction(myFunction);
console.log(interceptedFunction(1, 2)); // 输出 3，同时会有拦截日志
```
通过上述代码创建了一个 Proxy 包装的函数拦截器，在每次函数调用时打印一句拦截日志，并继续调用原函数。

## 扩展知识
1）**Proxy 对象**：Proxy 对象可以用来定义对象基本操作的自定义行为（如属性访问、赋值、枚举、函数调用等）。它允许你拦截并自定义对目标对象的基本操作。

2）**Reflect 对象**：Reflect 对象提供了一些默认行为的方法，这些方法和 Proxy 捕获器一一对应，用来执行默认行为。使用 Reflect 可以使代码更为简洁且避免手动重复实现原生操作。

3）**函数拦截的常见场景**：函数拦截在实际开发中应用广泛，例如：
   - 为函数调用添加日志记录。
   - 计算函数调用的执行时间。
   - 添加数据验证和转换逻辑。
   - 实现 AOP（面向切面编程），比如事务管理、缓存等。

4）**其他拦截方式**：除了使用 Proxy 对象，另一种常见的拦截函数调用的方法是手动重写函数。但这种方式不如 Proxy 灵活和简洁。例如：
   ```javascript
   const originalFunc = obj.someFunc;
   obj.someFunc = function(...args) {
       console.log('Intercepted call');
       return originalFunc.apply(this, args);
   };
   ```

这个方法虽然简单，但不够优雅且需要手动管理每个函数的重写，非常容易在大型项目中出错。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)