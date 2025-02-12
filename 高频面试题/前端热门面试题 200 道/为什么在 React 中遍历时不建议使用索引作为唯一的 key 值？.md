## 为什么在 React 中遍历时不建议使用索引作为唯一的 key 值？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)



## 回答重点

在 React 中不建议使用索引作为 key 值，主要有以下几个原因：

### 1）性能问题

当使用索引作为 key 时，如果列表项目顺序发生变化（如排序、过滤），React 会错误地认为所有元素都发生了变化，从而导致不必要的重新渲染，影响性能。

### 2）组件状态问题

如果列表项包含状态或用户输入，使用索引作为 key 可能会导致状态出现错误。因为 React 使用 key 来追踪组件身份，错误的 key 会导致状态与错误的组件关联。

### 3）列表操作问题

在进行添加、删除、重排序等操作时，基于索引的 key 会导致 React 无法正确识别哪些项目实际发生了变化，可能引起意外的渲染结果。

## 扩展知识

### 1）正确的 key 设置方式

1）使用稳定的唯一标识符：

```jsx
const todoItems = todos.map(todo => (
  <li key={todo.id}>
    {todo.text}
  </li>
));
```

2）使用数据的唯一属性：

```jsx
const userList = users.map(user => (
  <UserCard key={user.email} user={user} />
));
```

### 2）key 的特性

1）唯一性：

- key 在兄弟节点之间必须唯一
- 不需要全局唯一
- 可以在不同的数组中使用相同的 key

2）稳定性：

- key 应该是稳定的，在数据不变的情况下保持不变
- 不应该是随机生成的值或索引

### 3）特殊情况处理

1）如果确实没有唯一值可用：

- 可以组合多个字段创建唯一 key
- 使用 uuid 或 nanoid 等工具生成唯一标识

```jsx
import { nanoid } from 'nanoid';

const items = data.map(item => (
  <ListItem
    key={`${item.category}-${item.name}-${nanoid()}`}
    item={item}
  />
));
```

2）静态列表：

- 如果列表是静态的且永远不会重新排序或过滤，使用索引作为 key 是可以接受的
- 但这种情况非常少见，最好还是使用唯一标识符

相关文档地址：

- <https://zh-hans.react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key>
- <https://zh-hans.react.dev/reference/react/useId>


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)