## JavaScript 的 BigInt 和 Number 类型有什么区别？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)


## 回答重点

BigInt 和 Number 是 JavaScript 中两种不同的数值类型，主要区别如下：

### 1）数值范围

Number 类型：受 64 位双精度浮点数限制，安全整数范围是 -(2^53-1) 到 2^53-1 之间。

BigInt 类型：可以表示任意大的整数，没有位数限制。

### 2）数值精度

Number 类型：小数计算可能存在精度损失。

BigInt 类型：只能表示整数，不能有小数部分。

### 3）类型标识

Number 类型：直接使用数字字面量。

BigInt 类型：数字末尾需要加 n，或使用 BigInt() 构造函数。

## 扩展知识

### 1）创建方式

```javascript
// Number
const num = 123;
const floatNum = 123.456;

// BigInt
const bigInt1 = 123n;
const bigInt2 = BigInt(123);
const bigInt3 = BigInt("123");
```

### 2）运算规则

BigInt 不能与 Number 直接进行混合运算：

```javascript
const bigInt = 1n;
const num = 1;
// TypeError: Cannot mix BigInt and other types
console.log(bigInt + num); 

// 需要进行类型转换
console.log(bigInt + BigInt(num));
```

### 3）类型转换

BigInt 转 Number：

```javascript
const bigInt = 123n;
const num = Number(bigInt);
// 注意：如果 BigInt 超出 Number 安全范围会丢失精度
```

Number 转 BigInt：

```javascript
const num = 123;
const bigInt = BigInt(num);
// 注意：不能转换小数，会报错
```

### 4）使用场景

BigInt 适用于：

- 需要处理超大整数的计算
- 需要精确的整数运算
- 处理时间戳（微秒级）
- 金融计算中的整数部分

Number 适用于：

- 常规的数值计算
- 需要处理小数的场景
- 与第三方库配合（很多库可能不支持 BigInt）

### 5）注意事项

- BigInt 不支持 Math 对象的方法
- JSON.stringify() 不能直接序列化 BigInt
- BigInt 不能使用一元加号运算符
- 比较运算符可以在 BigInt 和 Number 之间使用

```javascript
console.log(1n > 0); // true
console.log(1n === 1); // false
console.log(1n == 1); // true
```

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)