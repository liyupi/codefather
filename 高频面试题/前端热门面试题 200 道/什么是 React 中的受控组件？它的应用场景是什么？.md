## 什么是 React 中的受控组件？它的应用场景是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)


## 回答重点

受控组件是指表单元素的值由 React state 控制的组件。在受控组件中，表单数据由 React 组件处理，而不是由 DOM 本身处理。

### 实现受控组件的关键点

1）将表单元素的值与 state 绑定

```javascript
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />
```

2）必须提供 onChange 事件处理函数
当用户输入时，onChange 事件处理函数会被触发，通过 setState 更新组件的 state，从而更新表单元素的值。

3）表单元素的值始终等于 state 中的值
React 确保显示的值始终与 state 中的值保持同步。

## 扩展知识

### 1）受控组件的应用场景

即时字段验证：在用户输入时立即验证输入内容的有效性。

条件禁用提交按钮：根据表单验证状态动态控制提交按钮的禁用状态。

强制输入格式：限制用户只能输入特定格式的内容，如电话号码、信用卡号等。

多个输入联动：一个输入框的值需要依赖另一个输入框的值。

### 2）不同类型表单元素的受控实现

文本输入框：

```javascript
<input value={value} onChange={e => setValue(e.target.value)} />
```

复选框：

```javascript
<input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />
```

选择框：

```javascript
<select value={selected} onChange={e => setSelected(e.target.value)}>
  <option value="1">选项一</option>
  <option value="2">选项二</option>
</select>
```

### 3）性能优化考虑

当使用受控组件时，每次输入都会触发 state 更新和组件重渲染。如果表单较复杂，可以考虑以下优化方式：

1）使用 state 提升，将表单状态提升到需要的最小公共父组件。

2）使用 debounce/throttle 来控制更新频率。

3）如果不需要即时反馈，可以考虑使用非受控组件。

### 4）注意事项

1）受控组件的 value 属性不能为 undefined 或 null。

2）如果只需要默认值，应使用 defaultValue 而不是 value。

3）受控组件必须搭配 onChange 事件处理函数，否则输入框会变成只读。

相关文档链接：

- <https://zh-hans.react.dev/reference/react-dom/components/input>
- <https://zh-hans.react.dev/reference/react-dom/components/select>
- <https://zh-hans.react.dev/reference/react-dom/components/textarea>


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)