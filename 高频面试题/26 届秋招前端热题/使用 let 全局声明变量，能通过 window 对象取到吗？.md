## 使用 let 全局声明变量，能通过 window 对象取到吗？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
在 JavaScript 中，使用 `let` 声明的全局变量**不能**通过 `window` 对象直接访问。与之相对的是使用 `var` 声明的全局变量和在最外层作用域中定义的函数，它们可以通过 `window` 对象访问。

例如：
```javascript
let globalLet = "This is a let variable";
var globalVar = "This is a var variable";
function globalFn() {
    return "This is a global function";
}

console.log(window.globalLet); // undefined
console.log(window.globalVar); // "This is a var variable"
console.log(window.globalFn);  // [Function: globalFn]
```

## 扩展知识
1) **作用域和变量提升**：
   `let` 和 `const` 声明的变量在块级作用域内有效，而 `var` 声明的变量在函数作用域或全局作用域内有效。此外，变量提升发生在 `var` 声明的变量上，而 `let` 和 `const` 则不会。不过，即使提升了，`let` 和 `const` 也会因 TDZ（Temporal Dead Zone，暂时性死区）的缘故不能在声明前使用。

2) **全局对象（Global Object）与顶层作用域**：
   虽然在浏览器环境中 `window` 对象是全局对象，但是在 `let` 和 `const` 引入之前，`var` 声明的变量和顶层（global scope）中的函数，都会被绑定到 `window` 对象上。然而，ECMAScript 2015（ES6）规范引入 `let` 和 `const`，它们虽然还是声明全局变量，但是不再绑定到 `window` 对象，这改善了全局变量污染的问题。

3) **模块化和ES6**：
   ES6 模块系统更进一步封装作用域，以`import`和`export`指令引入和输出模块内容，进一步减少全局变量污染。例如，在模块文件里声明的变量和函数不会成为 `window` 对象属性，这是因为模块会自动遵循一种更严格的作用域规则。

4) **补充：TDZ（Temporal Dead Zone）详解**：
   TDZ 指的是在 `let` 和 `const` 声明变量之前，该变量是不可访问的，虽然在代码运行到此位置时，变量已经存在了。TDZ 的出现是为了防止变量声明前被使用带来的意外错误。

例如：
```javascript
console.log(a); // ReferenceError: a is not defined
let a = 5;
```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)