## 有哪些 CSS 选择器？请分别介绍
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)


## 回答重点
CSS 选择器是用来选择 HTML 元素，以应如何用 CSS 样式。主要包括下面几种类型：

- **基础选择器**：类型选择器、类选择器、ID选择器、通配符选择器
- **层次选择器**：后代选择器、子选择器、相邻兄弟选择器、通用兄弟选择器
- **属性选择器**：如 `[attr=value]`
- **伪类选择器**：如 `:hover`、`:nth-child()`
- **伪元素选择器**：如 `::before`、`::after`

### 详细介绍

| **选择器类型** | **语法** | **作用** | **优先级权重** |
| --- | --- | --- | --- |
| 通配选择器 | * | 选择所有元素 | 0 |
| 元素选择器（标签选择器） | element | 选择所有指定的元素 | 1 |
| 伪元素选择器 | ::pseudo-element | 选择元素的某个部分，如首字母、首行等 | 1 |
| 后代选择器 | ancestor descendant | 选择所有属于指定祖先元素的后代元素 | 2 |
| 子元素选择器 | parent > child | 选择所有属于指定父元素的直接子元素 | 2 |
| 相邻兄弟选择器 | previous + next | 选择紧接在指定元素后的相邻兄弟元素 | 2 |
| 通用兄弟选择器 | previous ~ siblings | 选择指定元素之后的所有兄弟元素 | 2 |
| 类选择器 | .class | 选择所有具有指定类名的元素 | 10 |
| 属性选择器 | [attribute] | 选择具有指定属性的所有元素 | 10 |
| 伪类选择器 | :pseudo-class | 选择特定状态的元素，如悬停、焦点等 | 10 |
| 属性值选择器 | [attribute=value] | 选择具有指定属性值的所有元素 | 10 |
| 部分属性值选择器 | [attribute^=value] | 选择指定属性值以某个值开头的元素 | 10 |
| 部分属性值选择器 | [attribute$=value] | 选择指定属性值以某个值结尾的元素 | 10 |
| 部分属性值选择器 | [attribute*=value] | 选择指定属性值包含某个值的元素 | 10 |
| 群组选择器 | selector1, selector2 | 选择多个元素，并对它们应用相同的样式 | 根据其中优先级最高的选择器确定 |
| ID选择器 | #id | 选择具有指定ID的单个元素 | 100 |

### Demo 示例

```css
/* 通配选择器，优先级：0 */
* {
  margin: 0;
  padding: 0;
}

/* 元素选择器（标签选择器），优先级：1 */
p {
  color: blue;
}

/* 伪元素选择器，优先级：1 */
p::first-line {
  font-weight: bold;
} 


/* 后代选择器，优先级：2 */
div p {
  color: red;
} 

/* 子元素选择器，优先级：2 */
ul > li {
  list-style: none;
} 

/* 相邻兄弟选择器，优先级：2 */
h1 + p {
  margin-top: 0;
} 

/* 通用兄弟选择器，优先级：2 */
h1 ~ p {
  color: grey;
} 

/* 类选择器，优先级：10 */
.intro {
  font-size: 14px;
} 

/* 属性选择器，优先级：10 */
[type="text"] {
  border: 1px solid;
} 

/* 伪类选择器，优先级：10 */
a:hover {
  color: red;
} 

/* 属性值选择器，优先级：10 */
[type="button"] {
  background: green;
} 

/* 部分属性值选择器，优先级：10 */
[class^="btn-"] {
  padding: 5px;
} 

/* 部分属性值选择器，优先级：10 */
[href$=".pdf"] {
  color: red;
} 

/* 部分属性值选择器，优先级：10 */
[title*="hello"] {
  font-style: italic;
}

/* 群组选择器，优先级：根据其中优先级最高的选择器确定 */
h1, h2, h3 {
  margin: 0;
} 

/* ID选择器，优先级：100 */
#header {
  background: yellow;
} 
```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)