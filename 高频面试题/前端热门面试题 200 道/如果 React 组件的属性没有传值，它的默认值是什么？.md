## 如果 React 组件的属性没有传值，它的默认值是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)


## 回答重点

在 React 中，如果组件的属性（props）没有传值，它的默认值是 undefined。不过 React 提供了几种方式来设置默认值：

### 1）使用函数组件时的默认值设置

可以通过解构赋值时设置默认值：

```jsx
function Button({ text = '点击', type = 'primary' }) {
  return <button className={type}>{text}</button>;
}
```

### 2）使用 defaultProps（类组件）

虽然现在不推荐使用类组件，但在类组件中可以使用 defaultProps：

```jsx
class Button extends React.Component {
  render() {
    return <button>{this.props.text}</button>;
  }
}

Button.defaultProps = {
  text: '点击'
};
```

## 扩展知识

### 1）属性校验

为了更好地管理组件属性，我们可以：

使用 PropTypes 进行类型检查（开发环境下）：

```jsx
import PropTypes from 'prop-types';

function Button({ text }) {
  return <button>{text}</button>;
}

Button.propTypes = {
  text: PropTypes.string
};
```

### 2）TypeScript 支持

如果项目使用 TypeScript，可以通过接口定义来规范属性：

```typescript
interface ButtonProps {
  text?: string;  // 问号表示该属性是可选的
  type?: 'primary' | 'secondary';
}

function Button({ text = '点击', type = 'primary' }: ButtonProps) {
  return <button className={type}>{text}</button>;
}
```

### 3）注意事项

1）undefined 和 null 的区别：

- 未传递属性值时是 undefined
- 显式传递 null 时值为 null

2）布尔类型属性：

- 如果只写属性名不写值，默认为 true
- 例如 <Button disabled /> 等同于 <Button disabled={true} />

相关文档地址：

- <https://zh-hans.react.dev/reference/react/Component>
- <https://zh-hans.react.dev/learn/passing-props-to-a-component>



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)