## 在 React 的 render 函数中，是否可以直接写 if else 判断？为什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)


## 回答重点

在 React 的 render 函数中不能直接写 if else 语句，因为 render 函数返回的是 JSX，而 JSX 本质上是 JavaScript 表达式，表达式内部不能直接使用语句（statements）。

### 1）错误示例

```javascript
render() {
  if (this.state.isLoggedIn) {
    return <div>欢迎回来</div>
  } else {
    return <div>请登录</div>
  }
}
```

### 2）正确的条件渲染方式

三元运算符：

```javascript
render() {
  return (
    <div>
      {this.state.isLoggedIn ? '欢迎回来' : '请登录'}
    </div>
  )
}
```

逻辑与运算符：

```javascript
render() {
  return (
    <div>
      {this.state.isLoggedIn && '欢迎回来'}
    </div>
  )
}
```

## 扩展知识

### 1）render 函数外的条件判断

虽然不能在 JSX 中直接使用 if else，但我们可以在 render 函数外部或函数内部通过以下方式实现条件渲染：

提取条件判断为函数：

```javascript
renderMessage() {
  if (this.state.isLoggedIn) {
    return <div>欢迎回来</div>
  } else {
    return <div>请登录</div>
  }
}

render() {
  return (
    <div>
      {this.renderMessage()}
    </div>
  )
}
```

### 2）立即执行函数

如果逻辑比较复杂，可以使用立即执行函数：

```javascript
render() {
  return (
    <div>
      {(() => {
        if (this.state.isLoggedIn) {
          return '欢迎回来'
        } else {
          return '请登录'
        }
      })()}
    </div>
  )
}
```

### 3）对象映射

当有多个条件时，可以使用对象映射来优化代码：

```javascript
render() {
  const messages = {
    loggedIn: '欢迎回来',
    guest: '请登录'
  }
  
  return (
    <div>
      {messages[this.state.isLoggedIn ? 'loggedIn' : 'guest']}
    </div>
  )
}
```

### 4）性能考虑

1）使用三元运算符和逻辑运算符是最常见也是性能最好的方式。

2）立即执行函数虽然可以实现复杂的条件判断，但会带来额外的函数调用开销。

3）将条件判断提取为单独的方法虽然代码更清晰，但要注意避免不必要的组件重渲染。

相关文档：
<https://zh-hans.react.dev/learn/conditional-rendering>
<https://zh-hans.react.dev/reference/react/Component#render>


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)