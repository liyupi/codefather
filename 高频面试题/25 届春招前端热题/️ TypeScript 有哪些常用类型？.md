## ️ TypeScript 有哪些常用类型？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

TypeScript 的常用类型包括：

1. 基础类型：string、number、boolean、null、undefined、symbol、bigint
2. 复杂类型：array、tuple、enum、object
3. 特殊类型：any、unknown、never、void

下面分别讲解：

## 基础类型

- string：表示字符串。例如：let name: string = "John"
- number：表示数字数据，包括整数和浮点数。例如：let age: number = 30
- boolean：表示布尔值，只有 true 和 false 两种取值。例如：let isActive: boolean = true
- null：表示空值，通常与 undefined 一起使用
- undefined：表示未定义的值
- symbol：表示独一无二的值，主要用于对象属性的唯一标识。例如：let sym: symbol = Symbol()
- bigint：表示任意精度的整数。例如 12345678901234567890123456
- 数组 []
- 元组 Tuple

## 复杂类型
1）array 数组：表示元素类型固定的列表。例如：

```typescript
// 1、在元素类型后面接上[]，表示由此类型元素组成的一个数组
let numbers: number[] = [1, 2, 3];
// 2、使用数组泛型，Array<元素类型>
let numbers: Array<number> = [1, 2, 3];
```
2）tuple 元祖：表示已知数量和类型的数组。例如：

```typescript
let x: [string, number] = ["hello", 10];

当访问一个已知索引的元素，会得到正确的类型：
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'

当访问一个越界的元素，会使用联合类型替代
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型
console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString
x[6] = true; // Error, 布尔不是(string | number)类型
```
3）enum 枚举：用于定义一组命名常量。例如：

enum 类型是对 JavaScript 标准数据类型的一个补充。 像 C# 等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。
 
```typescript
enum Color {
  Red,
  Green,
  Blue
}
let c: Color = Color.Green;
```

默认情况下，从 0 开始为元素编号。 你也可以手动的指定成员的数值。或者，全部都采用手动赋值

```
// 1、手动的指定成员的数值
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;

// 2、全部都采用手动赋值
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```

4）object：表示非原始类型的值，例如对象、数组等。例如：

```typescript
let person: { name: string; age: number } = { name: "John", age: 30 };
```
## 特殊类型
1）any：表示**任意类型**，允许任何类型的值。通常用于处理动态内容或逐步迁移到 TypeScript 的项目。例如：

```typescript
let anything: any = "hello";
anything = 10;
```
2）unknown：表示未知类型，与 any 类似，但更安全，必须在使用之前进行类型检查。例如：

```typescript
let notSure: unknown = 4;
if (typeof notSure === "number") {
    let sure: number = notSure;
}
```
3）never：表示不会发生的值，通常用于标识函数从不会返回（如抛出异常）或永远不会有结果的情况。例如：

```typescript
function error(message: string): never {
    throw new Error(message);
}
```
4）void：表示没有返回值的函数。例如：

```typescript
function warnUser(): void {
    console.log("This is a warning message");
}
```

某种程度上来说，void 类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void

## 扩展知识
除了上述常用类型，TypeScript 还支持一些高级类型和类型操作，比如：

1）联合类型（`|`）和交叉类型（`&`）：
例如：

```typescript
let id: string | number;
let person: Person & Serializable;
```
2）type 类型别名：用于为类型创建别名。
例如：

```typescript
type Point = { x: number; y: number; };
```
3）interface 接口：用于定义对象的类型。
例如：

```typescript
interface Person {
    name: string;
    age: number;
}
let john: Person = { name: "John", age: 30 };
```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)