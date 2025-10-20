## 为什么 JavaScript 中 0.1 + 0.2不等于0.3，如何让其相等？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

在 JavaScript 中，数字是以二进制浮点数表示的。这种表示方式会导致某些十进制小数在二进制下无法精确表示，例如 0.1 和 0.2。它们在二进制中是无限循环的小数，示例如下：

```
0.1 的二进制表示约为：0.0001100110011001100110011001100110011001100110011001101...

0.2 的二进制表示约为：0.001100110011001100110011001100110011001100110011001101...
```
将这些二进制数相加时，由于精度限制，结果不能完全精确地表示为 0.3，而是一个非常接近的值：0.30000000000000004。

### 如何让其相等？
1）使用误差范围
一个常见的解决方案是设置一个误差范围，通常称为“机器精度”。在 JavaScript 中，这个值为 Number.EPSILON，它表示可接受的最小误差范围，示例如下：

```javascript
function numbersAreEqual(num1, num2) {
  return Math.abs(num1 - num2) < Number.EPSILON;
}
console.log(numbersAreEqual(0.1 + 0.2, 0.3)); // 输出: true
```
2）使用 toFixed() 方法
将结果四舍五入到指定的小数位数。toFixed() 方法会返回一个字符串类型的结果，因此需要注意类型转换，示例如下：

```javascript
let sum = 0.1 + 0.2;
let roundedSum = Number(sum.toFixed(1)); // 注意: toFixed 返回字符串，所以需要转换为数字
console.log(roundedSum === 0.3); // 输出: true
```
3）使用 Number.toPrecision() 方法
toPrecision() 方法也可以用于格式化数字并减少精度问题，示例如下：

```javascript
let sum = 0.1 + 0.2;
let preciseSum = Number(sum.toPrecision(12)); // 12 是常用的精度位数
console.log(preciseSum === 0.3); // 输出: true
```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)