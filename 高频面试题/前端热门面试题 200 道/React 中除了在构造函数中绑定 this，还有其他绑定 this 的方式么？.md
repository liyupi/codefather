## React 中除了在构造函数中绑定 this，还有其他绑定 this 的方式么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)



## 回答重点

在 React 类组件中，除了在构造函数中绑定 this，还有以下几种绑定 this 的方式：

### 1）使用箭头函数定义类方法

```jsx
class Button extends React.Component {
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return <button onClick={this.handleClick}>点击</button>;
  }
}
```

### 2）在 render 方法中使用箭头函数

```jsx
class Button extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    return <button onClick={() => this.handleClick()}>点击</button>;
  }
}
```

### 3）使用 bind 方法在 render 中绑定

```jsx
class Button extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    return <button onClick={this.handleClick.bind(this)}>点击</button>;
  }
}
```

## 扩展知识

### 1）各种绑定方式的优缺点

箭头函数类属性：

- 优点：写法简洁，永远绑定正确的 this
- 缺点：每个实例都会创建一个新的函数

render 中使用箭头函数：

- 优点：写法灵活，可以传递额外参数
- 缺点：每次渲染都会创建新的函数，可能影响性能

bind 方法：

- 优点：可以提前绑定，不会每次渲染都创建新函数
- 缺点：写法较繁琐

### 2）最佳实践建议

1）优先使用箭头函数类属性方式，因为：

- 代码清晰易读
- this 绑定稳定可靠
- 性能影响在大多数场景下可以忽略

2）如果需要传递参数，可以这样写：

```jsx
class Button extends React.Component {
  handleClick = (id) => {
    console.log('id:', id);
  }

  render() {
    return <button onClick={() => this.handleClick(1)}>点击</button>;
  }
}
```

### 3）现代 React 开发建议

目前 React 官方推荐使用函数组件 + Hooks 的方式进行开发，这样就不需要考虑 this 绑定的问题：

```jsx
function Button() {
  const handleClick = () => {
    console.log('clicked');
  }

  return <button onClick={handleClick}>点击</button>;
}
```

相关文档地址：

- <https://zh-hans.react.dev/reference/react/Component>
- <https://zh-hans.react.dev/learn/responding-to-events>


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)