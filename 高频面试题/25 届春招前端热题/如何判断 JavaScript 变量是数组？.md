## 如何判断 JavaScript 变量是数组？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

1）使用 Object.prototype.toString.call() 做判断
这是一个通用的类型判断方法，适用于判断各种数据类型，Object.prototype.toString.call(obj) 会返回一个类似 [object Array] 的字符串，通过切片操作获取其中的类型部分并与 'Array' 比较，示例如下：

```javascript
Object.prototype.toString.call(obj).slice(8,-1) === 'Array';
```
2）通过原型链做判断
通过检查对象的原型链是否指向 Array.prototype，但是直接访问 __proto__ 不推荐，因为它是非标准属性，虽然现在大多数浏览器都支持，示例如下：

```javascript
obj.__proto__ === Array.prototype;
```
3）使用 ES6 的 Array.isArray() 判断
这是 ES6 中新增的方法，专门用于判断一个变量是否为数组，非常简洁且可靠，示例如下：

```javascript
Array.isArray(obj);
```
4）使用 instanceof 做判断
比较常用的原型链判断方法，示例如下：

```javascript
obj instanceof Array
```
5）使用 Array.prototype.isPrototypeOf
检查 Array.prototype 是否存在于对象的原型链中，示例如下：

```javascript
Array.prototype.isPrototypeOf(obj)
```
---


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)