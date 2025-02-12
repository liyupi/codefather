## 在 React Router 的 history 模式中，push 和 replace 方法有什么区别？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)


## 回答重点

React Router 中的 push 和 replace 方法都是用于页面导航的方法，但它们对浏览器历史记录的处理方式不同：

### 1）push 方法

push 方法会向浏览器的历史记录栈中添加一条新的记录。当用户点击浏览器的后退按钮时，可以回到之前的页面。

### 2）replace 方法

replace 方法会替换掉当前的历史记录，不会新增历史记录。当用户点击浏览器的后退按钮时，会回到替换前的页面。

## 扩展知识

### 1）使用场景

push 方法的使用场景：

- 普通的页面导航跳转
- 需要保留导航历史的场景
- 用户可能需要回到前一个页面的情况

replace 方法的使用场景：

- 重定向页面
- 登录成功后的跳转
- 表单提交成功后的跳转
- 不需要保留导航历史的场景

### 2）代码示例

```jsx
// 使用 push 方法导航
navigate('/home');  
history.push('/home');

// 使用 replace 方法导航
navigate('/home', { replace: true });
history.replace('/home');
```

### 3）导航状态管理

React Router 的导航方法会触发组件的重新渲染。为了优化性能，React Router 会：

1）将导航更新包装在 transition 中，这样可以：

- 避免不必要的加载指示
- 让导航可以被打断
- 保持已显示内容的可见性

2）支持导航过程中的加载状态显示：

- 可以使用 isPending 状态来显示导航进度
- 可以自定义加载指示器的样式

### 4）注意事项

1）历史记录堆栈：

- push 会导致历史记录堆栈增加，频繁使用可能导致堆栈过大
- replace 不会增加堆栈大小，适合用于临时性的导航

2）用户体验：

- 使用 push 时要考虑用户回退的路径是否合理
- 使用 replace 时要确保替换的是合适的历史记录点

3）性能优化：

- 可以使用 React 的 Suspense 和 transition 来优化导航体验
- 合理使用 replace 可以避免历史记录堆栈过大

相关文档链接：

- React Router 官方文档: <https://reactrouter.com/docs/en/v6/api/history>
- React Suspense 文档: <https://zh-hans.react.dev/reference/react/Suspense>


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)