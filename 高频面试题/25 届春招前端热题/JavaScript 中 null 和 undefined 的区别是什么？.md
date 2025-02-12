## JavaScript 中 null 和 undefined 的区别是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

undefined 是 JavaScript 的一种内置数据类型，表示变量声明了但未赋值。null 同样是一种内置数据类型，表示一个空对象引用。

### 两者区别
**类型检测**
1）使用 typeof 检测 undefined 会返回 "undefined"。
2）使用 typeof 检测 null 会返回 "object"，这是一个历史遗留问题。

```javascript
console.log(typeof undefined); // 输出: "undefined"
console.log(typeof null); // 输出: "object"
```
**比较操作**
1）undefined 和 null 使用双等号 == 比较时会被认为相等，因为它们都代表“没有值”的概念。
2）使用严格等号 === 比较时，它们是不相等的，因为它们是不同类型的值。

```javascript
console.log(undefined == null); // 输出: true
console.log(undefined === null); // 输出: false
```
**变量赋值**
1）undefined 是 JavaScript 引擎自动赋予未赋值变量的值，而 null 是开发者显式赋值以表示变量没有值。

```javascript
let x; // 未赋值，默认是 undefined
let y = null; // 明确赋值为 null
```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)