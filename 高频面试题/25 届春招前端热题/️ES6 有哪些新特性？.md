## ️ES6 有哪些新特性？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
1）let 和 const：具有块级作用域，let 用来声明变量可重新赋值，const 用来声明常量不可再次赋值。

2）箭头函数：新的函数声明方式，语法简洁。

3）模版字符串：字符串插值功能，可定义多行字符串。

4）解构赋值：是一种 JavaScript 表达式，‌它允许从数组或对象中提取属性或值，‌并将这些值赋给其他变量。‌

5）默认参数：函数参数可设置默认值。

6）扩展运算符：可以将数组展开为逗号分隔的参数序列，或者合并多个对象或数组。

7）类与模块：通过 class 关键字定义类，使用 import 和 export 来导入和导出模块。

8）Promise：用于处理异步操作。

9）Symbol 和迭代器：提供了一种新的原始数据类型和自定义迭代行为的方式。

10）新的数据结构：Map、Set。

11）其他：对象属性简写，属性和方法简写，提升了 JavaScript 的编码效率和可读性。
## 扩展知识
### 一、let 和 const
1）let 和 const 具有块级作用域，‌这意味着它们只在声明所在的代码块内有效。

```js
if (true) {
    let variable = "let variable";
    const constantVariable = "const variable";
    // 正常输出
    console.log(variable); // let variable
    console.log(constantVariable); // const variable
}
// 写在代码块外就会报错：
console.log(variable); // ReferenceError: variable is not defined
console.log(constantVariable); //ReferenceError: constantVariable is not defined
```
2）let 声明的变量可以被修改；const 声明的变量是常量，‌一旦声明后就不能被重新赋值或修改。‌
```js
let variable = 'let variable';
variable = 'new let variable'; // 允许重新赋值

const constantVariable = 'const variable';
// 不允许重新赋值，会报错：
constantVariable = 'new const variable'; // TypeError: Assignment to constant variable.
```
### 二、箭头函数
箭头函数提供了更简洁的语法来定义函数，并且会继承当前上下文的 this。
```js
const add = (a, b) => a + b;
console.log(add(2, 3)); // 输出 5
```
### 三、模版字符串
1）用反引号 ` 包裹字符串，支持插值表达式 ${}。
```js
const name = 'World';
const greeting = `Hello, ${name}!`;
console.log(greeting); // 输出 Hello, World!
```
2）支持多行字符串
```js
console.log(`string text line 1
string text line 2`);
// 正常输出：
string text line 1
string text line 2
```
### 四、解构赋值
1）对于数组解构赋值，数组的元素是按次序排列的，变量的取值由它的位置决定。

2）对于对象解构赋值，如果对象中有与变量同名的属性，那么该属性值就会被赋给对应的变量。
```js
const [a, b] = [1, 2];
console.log(a, b); // 输出 1 2

const {name, age} = {name: 'John', age: 25};
console.log(name, age); // 输出 John 25
```
### 五、默认参数
当定义函数时，可以为参数指定一个默认值。

如果调用函数时没有为该参数提供值，那么就会使用这个默认值。

如果调用函数时传了新的参数，则会使用新的值。
```js
const greet = (name = 'Guest') => `Hello, ${name}!`;
console.log(greet()); // 输出 Hello, Guest!
console.log(greet('Alice')); // 输出 Hello, Alice!
```
### 六、扩展运算符
用于将数组或对象展开成一系列参数或合并多个参数为一个数组的语法特性。它由三个点号（...）表示。
```js
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2];
console.log(combined); // 输出 [1, 2, 3, 4]

const obj1 = {a: 1};
const obj2 = {b: 2};
const merged = {...obj1, ...obj2};
console.log(merged); // 输出 {a: 1, b: 2}
```
### 七、类与模块
1）引入了类的概念，通过 class 关键字定义类，支持面向对象编程。
```js
class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    console.log(`Hello, ${this.name}!`);
  }
}
const person = new Person('John');
person.greet(); // 输出 Hello, John!
```
2）引入模块的语法，使用 import 和 export 来导入和导出模块。
```js
// module.js
export const name = 'John';
export const greet = () => console.log('Hello, John!');

// main.js
import {name, greet} from './module.js';
console.log(name); // 输出 John
greet(); // 输出 Hello, John!
```
### 八、Promise
Promise 是 ES6 中用于处理异步操作的新特性。它是一个对象，具有三种状态：初始状态（pending）、已完成（fulfilled）和已失败（rejected）。当状态从 pending 变为 fulfilled 或 rejected 时，会触发相应的回调函数。Promise 提供了两种处理错误的方式：在 then 方法中传递两个回调，其中第二个是错误回调；或者使用 catch 方法来捕获异常。
```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Done!'), 1000);
});
promise.then(result => console.log(result)); // 输出 Done!（一秒后）
```
### 九、Symbol 和迭代器
引入了 Symbol 数据类型和迭代器协议，提供了一种新的原始数据类型和自定义迭代行为的方式。
```js
const symbol = Symbol('unique');
console.log(symbol); // 输出 Symbol(unique)

const iterable = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
};
for (const value of iterable) {
  console.log(value); // 输出 1 2 3
}
```
### 十、Map、Set 等新的数据结构
1）Map 对象是键值对的集合。Map 中的一个键只能出现一次。

2）Set 是 ES6 中引入的一种数据结构，用于存储不重复的元素。
```js
const map = new Map();
map.set('key', 'value');
console.log(map.get('key')); // 输出 value

const set = new Set([1, 2, 3]);
set.add(2); // 重复添加无效
console.log(set); // 输出 Set { 1, 2, 3 }
```
### 十一、对象属性简写，属性和方法简写
提升了 JavaScript 的编码效率和可读性
```js
const x = 1;
const y = 2;
const obj = {x, y}; // 属性简写
console.log(obj); // 输出 {x: 1, y: 2}

const method = () => console.log('method');
const obj2 = {
  method // 方法简写
};
obj2.method(); // 输出 method
```

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)