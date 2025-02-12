## typeof 和 instanceof 有什么区别？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

typeof 和 instanceof 是 JavaScript 中用于检查变量类型的两个关键字，但它们的使用场景和功能有所不同。

### typeof
typeof 操作符用于检测变量的类型，返回一个字符串，表示操作数的数据类型，常见的返回值如下：
1）"undefined"：表示值未定义。
2）"boolean"：表示布尔值。
3）"number"：表示数字。
4）"string"：表示字符串。
5）"object"：表示对象（包括 null，数组，对象字面量等）。
6）"function"：表示函数。
7）"symbol"：表示符号（ES6 引入）。
8）"bigint"：表示大整数（ES11 引入）。
示例如下：

```javascript
console.log(typeof undefined); // "undefined"
console.log(typeof true);      // "boolean"
console.log(typeof 42);        // "number"
console.log(typeof "hello");   // "string"
console.log(typeof {});        // "object"
console.log(typeof []);        // "object"
console.log(typeof null);      // "object" (特殊情况)
console.log(typeof function(){}); // "function"
console.log(typeof Symbol());  // "symbol"
console.log(typeof 10n);       // "bigint"
```
### instanceof
instanceof 操作符用于检测某个对象是否是另一个对象（构造函数）的实例，返回一个布尔值，一些使用场景如下：
1）用于检测复杂类型，比如对象、数组、函数等。
2）检测某个对象是否继承自某个构造函数的原型链。
示例如下：

```javascript
console.log({} instanceof Object);           // true
console.log([] instanceof Array);            // true
console.log(function(){} instanceof Function); // true
console.log(new Date() instanceof Date);     // true

function MyClass() {}
let myInstance = new MyClass();
console.log(myInstance instanceof MyClass);  // true
```
### 两者区别
1）检测类型的范围：typeof 主要用于检测基本数据类型（如 number，string，boolean 等）以及函数、未定义类型和 symbol，而 instanceof 主要用于检测对象的具体类型，检查某个对象是否是某个构造函数的实例。
2）检测基本类型和引用类型：typeof 对于基本类型非常有用，但对于复杂引用类型（如数组、对象字面量）只会返回 "object"，而 instanceof 只能用于引用类型，不能用于检测基本数据类型。
3）特殊情况：typeof null 返回 "object"，这是一个 JavaScript 语言的历史遗留问题，而 instanceof 可以用来检测自定义对象的类型，通过检查原型链来确认实例关系。

### 示例代码
```javascript
let num = 42;
console.log(typeof num);          // "number"
console.log(num instanceof Number); // false (因为 num 是基本类型)

let str = new String("hello");
console.log(typeof str);          // "object"
console.log(str instanceof String); // true (因为 str 是 String 对象的实例)

let arr = [1, 2, 3];
console.log(typeof arr);          // "object"
console.log(arr instanceof Array); // true
```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)