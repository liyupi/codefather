## JavaScript 中 Object.keys 的返回值是无序的吗？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)


## 回答重点

Object.keys 方法返回一个数组，该数组的元素是一个对象自身可枚举属性的字符串键。尽管对象的属性在 ECMAScript 标准中没有明确的顺序要求，但现代 JavaScript 引擎对对象的属性顺序做出了一定保证，因此我们通常可以认为 Object.keys 返回值是有序的。

### 1）数字属性优先

数字属性（包括可以转换为数字的字符串属性）会被优先返回，并按照数值大小升序排序。

### 2）字符串属性其次

非数字的字符串属性按照它们被添加到对象时的顺序排序。

### 3）Symbol 属性不会被返回

Object.keys 不会返回 Symbol 类型的属性，如果需要获取 Symbol 属性，需要使用 Object.getOwnPropertySymbols。

## 扩展知识

### 1）属性顺序示例

```javascript
const obj = {
  b: 'b',
  1: '1',
  a: 'a',
  2: '2'
};

console.log(Object.keys(obj)); 
// 输出: ['1', '2', 'b', 'a']
```

### 2）属性类型判定

JavaScript 引擎如何判断一个属性是否为数字属性：

- 属性名能被转换为 32 位无符号整数
- 转换后的数字和原属性名严格相等
- 例如：'1' 是数字属性，而 '01' 不是

### 3）特殊情况处理

对于数组：

```javascript
const arr = ['a', 'b', 'c'];
arr.test = 'test';

console.log(Object.keys(arr)); 
// 输出: ['0', '1', '2', 'test']
```

对于类数组对象：

```javascript
const arrayLike = {
  length: 3,
  0: 'a',
  1: 'b',
  2: 'c'
};

console.log(Object.keys(arrayLike)); 
// 输出: ['0', '1', '2', 'length']
```

### 4）相关方法对比

Object.keys 和其他遍历对象属性方法的区别：

- Object.keys：返回对象自身的可枚举属性名数组
- Object.getOwnPropertyNames：返回对象自身的所有属性名数组（包括不可枚举属性）
- Object.entries：返回对象自身可枚举属性的键值对数组
- for...in：遍历对象自身和原型链上的所有可枚举属性

### 5）性能考虑

在需要确保属性顺序的场景下，建议：

- 使用 Map 数据结构，它能保证按照插入顺序遍历
- 使用数组存储需要有序的数据
- 如果必须使用对象，可以通过命名规范来确保属性按预期顺序排列

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)