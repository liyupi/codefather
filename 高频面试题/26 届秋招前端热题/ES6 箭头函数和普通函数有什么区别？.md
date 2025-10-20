## ES6 箭头函数和普通函数有什么区别？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
1）定义方式：箭头函数使用箭头(=>)语法，省略了 function 关键字。

2）参数处理：如果只有一个参数，箭头函数可以省略括号。

3）函数体：如果函数体只有一条语句，箭头函数可以省略花括号和 return 关键字。

4）箭头函数没有自己的 this 对象，而是从其作用域链的上一层继承 this。‌箭头函数中 this 的指向在它被定义的时候就已经确定了。

5）箭头函数的 this 指向不能通过 call、apply、bind 等方法改变。

6）箭头函数不可以当作构造函数，不可以对箭头函数使用 new 命令。

7）其他特性：箭头函数没有自己的 arguments 对象，没有原型 prototype，不能用作 Generator 函数，不能使用 yeild 关键字，没有 super。


## 扩展知识
### **一、定义方式**
1）箭头函数使用箭头(=>)语法，省略了 function 关键字

```js
// 普通函数
let fun = function (a) {
    return `我是普通函数 ${a}`;
};
// 箭头函数
let fun2 = (a) => {
    return `我是箭头函数 ${a}`;
};
```
2）括号与箭头之间不能换行

```js
// 执行报错：SyntaxError: Unexpected token '=>'
let fun3 = (a)
    => {
    return `我是箭头函数 ${a}`;
}; 
```
### **二、参数处理**
1）没有参数，直接写一个空括号

```js
let fun = () => {
    console.log("没有参数");
};
```
2）如果参数只有一个，可以不写括号

```js
let fun = name => {
    console.log(`只有一个参数${name}`);
};
```
3）如果有多个参数，就用逗号隔开，放在括号里面

```js
let fun = (var1, var2, var3) => {
    console.log(var1, var2, var3);
};
```
### **三、关于箭头函数的函数体**
1）如果箭头函数的函数体只需**返回某个变量或者一个简单的 JS 表达式**，可以省略函数体的大括号和 return 关键字。

```js
// 普通函数
let sum = function (num1, num2) {
    return num1 + num2;
};
// 箭头函数：可省略大括号和return
let sum = (num1, num2) => num1 + num2;
```
2）如果箭头函数的函数体**只有一条语句并且不需要返回值（最常见是调用一个函数）**,可以给这条语句前面加一个 void 关键字。
```js
let fun = () => void doesNotReturn();
```
#### **总结：箭头函数最常见的用法就是用来简化回调函数**
它的语法比一般的函数更简洁、清晰、快捷。

```js
// 正常函数
[3, 1, 9, 7, 5].sort(function (a, b) {
    return a - b;
});
// 箭头函数
[3, 1, 9, 7, 5].sort((a, b) => a - b);
```

### 四、**箭头函数没有自己的 this 对象**
来看 MDN 上对箭头函数 this 的解释: 
> 箭头函数不会创建自己的 this，所以它没有自己的 this，它只会从自己的作用域链的上一层继承 this。

箭头函数捕获的是自己在**定义时**所处的**外层执行环境的 this**。所以，***箭头函数中 this 的指向在它被定义的时候就已经确定了，之后永远不会改变***。
```js
var id = "GLOBAL";
let obj = {
  id: "OBJ",
  // 普通函数
  a: function () {
    console.log(this.id);
  },
  // 箭头函数
  b: () => {
    console.log(this.id);
  },
};
obj.a(); //'OBJ'--普通函数作为对象的方法调用时，this 指向它所属的对象
obj.b(); //"GLOBAL" --箭头函数的 this 继承它定义时所处的全局环境中的 this
```
### 五、call()、apply()、bind() 也无法改变箭头函数中 this 的指向

```js
var id = "Global";
let fun1 = () => {
  console.log(this.id);
};
fun1();//"GLOBAL"
fun1.call({ id: "obj" });//"GLOBAL"
fun1.apply({ id: "obj" });//"GLOBAL"
fun1.bind({ id: "obj" })();//"GLOBAL"
```
### 六、箭头函数不可以当作构造函数，不可以对箭头函数使用 new 命令，否则会抛出错误。

箭头函数没有自己的 this 且 this 指向外层的执行环境，所以不能当作构造函数使用，
 如果使用 new 关键字调用则会抛出错误。
```js
let fun = (a) => {
    return `我是箭头函数 ${a}`;
};
let newFun = new fun(1)； //报错：TypeError: fun is not a constructor
```
### 七、其他特性
1）箭头函数没有自己的 arguments 对象

在箭头函数中访问 arguments 实际上获得的是它外层函数的 arguments 值，如果要用，可以用 rest 参数代替来访问箭头函数的参数列表。

```js
// 普通函数
function logArguments() {
  console.log(arguments);
}
// 箭头函数
const logArguments = (...args) => {
  console.log(args);
};
```
2）箭头函数没有原型 prototype

由于箭头函数不能作为构造函数，它们也没有 prototype 属性
```js
let fun = (a) => {
    return `我是箭头函数 ${a}`;
};
console.log(fun.prototype); // undefined
```
3）箭头函数不能用作 Generator 函数，不能使用 yeild 关键字

4）箭头函数没有 super 绑定在类的继承中，在类的继承中，‌普通函数可以使用 super 关键字调用父类的方法，而箭头函数不能。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)