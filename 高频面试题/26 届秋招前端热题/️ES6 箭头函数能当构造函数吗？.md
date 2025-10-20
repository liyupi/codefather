## ️ES6 箭头函数能当构造函数吗？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
不能。箭头函数没有自己的 this 对象，没有 argument、caller、prototype 属性，且无法通过 new 关键字调用。
## 扩展知识 

#### 1）箭头函数与构造函数对比

**构造函数的定义：**

> 在 JavaScript 中，用 new 关键字来调用的函数，称为构造函数。构造函数首字母一般大写。

创建一个构造函数： 首先会创建一个新的对象，将新建的对象设置给函数中 this，在构造函数中可以使用 this 来引用新建的对象。**构造函数内部的 this 指向当前对象的实例**。

**而箭头函数的 this 的指向是在定义时确定的，‌不是在调用时确定。** 从这个特性可以看出箭头函数不能作为构造函数使用。因为它们无法正确地创建和初始化新的对象实例。‌

**打印下箭头函数和构造函数来看看**
```js
// 箭头函数
let fun = () => {
    console.log("我是箭头函数")
}
// 构造函数
function cFun(){
    console.log("我是构造函数")
}
console.dir(fun);
console.dir(cFun);
```

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1816277363887144962/X1qGQ7lc_WechatIMG243_mianshiya.jpg" alt="WechatIMG243.jpg" width="100%" />


可以看到**箭头函数没有 argument、caller、prototype。** 也可以看到箭头函数有 Prototype（`__proto__`）属性，所以箭头函数本身存在原型链，有自己的构造函数，但它没有 prototype 属性，没法让他的实例 Prototype（`__proto__`）属性指向，所以箭头函数也就无法作为构造函数使用。

#### 2）箭头函数无法通过 new 关键字调用

```js
// 箭头函数
let fun = () => {
    console.log("我是箭头函数")
}
new fun(); // 报错：TypeError: fun is not a constructor
```
综上所述，箭头函数不能当作构造函数使用。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)