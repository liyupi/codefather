## ️ 什么是 TypeScript 的对象类型？怎么定义对象类型？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 基本概念
### 什么是 TypeScript 的对象类型？
在 TypeScript 中，对象类型用于描述非原始类型的值，比如具有特定结构的对象、数组和函数等。

### 如何定义对象类型？
我们可以通过 3 种主要方式来定义对象类型：匿名、类型别名、接口。

1）匿名对象。
可以直接用类 JavaScript 的语法定义对象属性，示例如下：

```typescript
function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}
```
该函数接受包含属性 name（必须是 string）和 age（必须是 number）的对象。

2）类型别名。通过 `type` 关键字来创建，它为一个特定的对象类型创建了一个新名称。示例如下：

```typescript
type Person = {
  name: string;
  age: number;
};

function greet(person: Person) {
  return "Hello " + person.name;
}
```
类型别名适用于复杂的类型组合，如联合类型、交叉类型或条件类型。

3）接口。通过 `interface` 关键字定义，示例如下：

```typescript
interface Person {
  name: string;
  age: number;
}

function greet(person: Person) {
  return "Hello " + person.name;
}
```
接口与类型别名类似，但接口可以扩展（继承）其他接口：

```typescript
interface Employee extends Person {
    employeeId: number;
}

let jane: Employee = {
    name: "Jane",
    age: 25,
    employeeId: 1234
};
```
接口还可以用于描述函数类型，示例如下：

```typescript
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
};
```
## 扩展知识
TypeScript 的对象类型有很多实用的特性，下面分别讲解。

### 属性修饰符
对象类型中的每个属性都可以指定一些内容：类型、属性是否可选、属性是否可以写入。

#### 1、可选属性
在对象类型中，我们可以使用 `?` 来标识可选属性：

```typescript
interface Person {
    name: string;
    age?: number;  // age 是可选的
}

let john: Person = {
    name: "John"
};
```
#### 2、只读属性
通过 `readonly` 关键字，可以定义只读属性，防止它们在对象创建后被修改：

```typescript
interface Point {
    readonly x: number;
    readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
// p1.x = 5; // 错误，x 是只读属性
```
#### 3、索引签名
有时你无法提前知道对象属性的所有名称（key），但你可以明确 key 的类型，就可以使用索引签名。
索引签名允许对象具有未知数量的属性，比如：

```typescript
interface StringArray {
    [index: number]: string;
}

let myArray: StringArray = ["Bob", "Fred"];
let first: string = myArray[0];  // Bob
```
### 类型扩展
#### 1、继承
接口是支持继承的，便于我们扩展对象类型，而且支持多继承，示例代码如下：

```typescript
interface Colorful {
  color: string;
}
 
interface Circle {
  radius: number;
}
 
interface ColorfulCircle extends Colorful, Circle {}
 
const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```
#### 2、交叉类型
除了通过继承实现对象扩展外，TypeScript 还提供了交叉类型，用于组合现有的对象类型。
交叉类型是使用 `&` 运算符定义的，示例代码如下：

```typescript
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;
```
上述代码将 Colorful 和 Circle 相交，生成了一个包含 Colorful 和 Circle 的所有成员的新类型。

### 泛型对象类型
TypeScript 还支持泛型对象类型，通过泛型，可以编写能够适用于多种类型的函数、类和接口，而无需在编写代码时指定具体的类型，能够使代码更具通用性和复用性。
常见的使用场景包括泛型接口、泛型类、泛型函数、泛型约束等，示例如下：

#### 1、泛型接口
泛型接口允许我们定义可以适用于多种类型的接口。例如，定义一个可以操作不同类型数据的容器接口：

```typescript
interface Container<T> {
    value: T;
}

let stringContainer: Container<string> = { value: "Hello, TypeScript" };
let numberContainer: Container<number> = { value: 42 };
```
`Array<T>` 类型就是一个 TypeScript 内置的泛型接口。

#### 2、泛型类
泛型类与泛型接口类似，允许定义可以操作多种类型数据的类。例如，定义一个泛型栈类：

```typescript
class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }
}

let stringStack = new Stack<string>();
stringStack.push("Hello");
console.log(stringStack.pop()); // "Hello"

let numberStack = new Stack<number>();
numberStack.push(42);
console.log(numberStack.pop()); // 42
```
#### 3、泛型函数
可以灵活地定义函数的参数和返回值类型，例如，一个返回输入参数的函数：

```typescript
function identity<T>(arg: T): T {
    return arg;
}

let output1 = identity<string>("myString");
let output2 = identity<number>(100);

```
#### 4、泛型约束
有时我们希望泛型类型满足某些条件，这时候可以使用泛型约束。例如，定义一个只能操作具有 length 属性的泛型函数：

```typescript
interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

logLength("Hello"); // 输出: 5
logLength([1, 2, 3]); // 输出: 3
// logLength(42); // 错误: number 没有 length 属性
```
上述代码使用 `extends` 关键字约束 T 必须满足 Lengthwise 接口，即必须具有 length 属性。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)