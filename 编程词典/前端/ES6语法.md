# ES6语法

随着Web前端的发展，JavaScript已经成为越来越多的开发者的首选语言。随之也催生出了众多的框架如Vue，React等。

作为JavaScript的下一代标准，ES6引入了众多新特性，不仅提高了JavaScript的语言表现力，同时也增加了JavaScript的代码可读性和可维护性。

## let和const关键字
在ES6之前，JavaScript只有var关键字定义变量。而为了更好的语义化和更好的变量作用域定义，ES6引入了let和const关键字。

let关键字定义的变量和var不同的是，let定义的变量只存在于当前块级作用域中。而var定义的变量则存在于函数作用域中。

const定义的是常量，定义之后就不能更改，适用于那些不会发生改变的值。

## 变量的解构赋值
在JavaScript中给变量赋值就是让一个变量指向一个值。而新引入的变量的解构赋值，就是让左边对象或数组匹配相应的的右边的值，并赋值给左边的变量。

比如下面这个例子，我们可以再次满足语义化的称呼，让代码更加易懂。

`let [a, b, c] = [1, 2, 3];`

## 对象字面量的增强写法
在ES6中新增了很多对象字面量的语法，比如支持定义方法和属性的缩写，支持动态属性和表达式作为属性名。

比如我们可以这样定义一个对象：`let obj = {name, age, sayHi(){console.log('Hi~');}};`

## 箭头函数
ES6中另一个非常重要的特性——箭头函数，它提供了更加简洁的函数定义方式，避免了this的指向问题，改善了函数的作用域。

`const fn = () => {console.log('Hello ES6!');}`

## Promise对象
异步编程一直是前端开发中最主要的问题之一。 ES6中加入了Promise对象，可以优雅的处理异步编程的情况，并可以将链式调用的方式使得异步代码更加优美。

比如我们可以这样使用Promise对象：

```
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Hello ES6!');
  }, 1000);
});

promise.then(res => console.log(res));
```

以上就是ES6语法的一些重要特性，随着Web前端的发展，越来越多的开发者使用ES6来编写代码，ES6也成为了定义JavaScript标准的一个重要里程碑。