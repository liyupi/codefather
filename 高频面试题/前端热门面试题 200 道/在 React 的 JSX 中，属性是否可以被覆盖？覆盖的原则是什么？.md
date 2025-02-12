## 在 React 的 JSX 中，属性是否可以被覆盖？覆盖的原则是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)


## 回答重点

在 React 的 JSX 中，属性是可以被覆盖的，遵循以下覆盖原则：

### 1）从左到右覆盖

JSX 中的属性会按照从左到右的顺序进行覆盖，也就是说后面的属性会覆盖前面的同名属性。

### 2）展开运算符的覆盖规则

当使用展开运算符（...）传递 props 时，展开运算符后面的属性会覆盖展开运算符中的同名属性。

### 3）显式属性优先

直接声明的属性会覆盖通过展开运算符传入的同名属性。

## 扩展知识

### 1）属性覆盖的实际应用

在实际开发中，属性覆盖的特性经常用于以下场景：

组件默认值覆盖：通过展开运算符设置默认属性，然后用具体属性覆盖。

```jsx
// 默认样式
const defaultProps = {
  className: 'btn',
  type: 'button'
};

// 使用时覆盖默认值
<button {...defaultProps} className="btn-primary" />
// 最终 className 为 "btn-primary"
```

### 2）特殊属性的处理

style 属性：当传入多个 style 对象时，会进行浅合并而不是完全覆盖。

className 属性：多个 className 不会自动合并，需要手动处理。

### 3）注意事项

1）属性值不可变性：一旦属性传递给了 JSX，就不应该再修改这些值。

2）避免重复属性：虽然后面的属性会覆盖前面的，但是为了代码可读性，应该避免在同一个元素上多次声明同一个属性。

3）展开运算符的使用：虽然展开运算符很方便，但过度使用会导致不必要的属性传递，影响性能。建议只传递组件需要的属性。

### 4）相关文档链接

可以在以下 React 官方文档地址了解更多信息：

1）JSX 基础：<https://zh-hans.react.dev/learn/writing-markup-with-jsx>

2）组件 Props：<https://zh-hans.react.dev/learn/passing-props-to-a-component>

3）条件渲染：<https://zh-hans.react.dev/learn/conditional-rendering>


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)