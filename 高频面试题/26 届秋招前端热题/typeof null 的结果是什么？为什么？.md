## typeof null 的结果是什么？为什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

typeof null 的结果是 "object"

### 为什么 typeof null 是 "object"？
1）JavaScript 在最初设计时，使用了32位系统。为了优化性能，JavaScript 的值被存储为二进制数据，低位用来表示数据的类型。
2）对象的类型标识符是 000，而 null 被认为是一个空指针（即零地址），它的二进制表示全是 0，也即 00000000。
3）由于 null 的二进制表示和对象的类型标识符相同，typeof null 结果就被错误地设置为 "object"。
4）尽管这个错误很早就被发现，但为了保持向后兼容性，修复这个错误会导致大量现有代码出错。因此，这个行为被保留下来了。

### 运行示例
```javascript
console.log(typeof null); // 输出: "object"
```
### 扩展知识
#### 判断 null 的正确方法
1）直接比较
最简单的方法是直接使用严格相等 === 进行比较，示例如下：

```javascript
let value = null;
console.log(value === null); // 输出: true
```
2）使用 == 比较
使用 == 也可以，但不推荐，因为它会进行类型转换，示例如下：

```javascript
let value = null;
console.log(value == null); // 输出: true
```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)