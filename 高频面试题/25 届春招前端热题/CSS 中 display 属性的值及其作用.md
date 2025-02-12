## CSS 中 display 属性的值及其作用
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

display 属性是用于定义元素的显示，即元素应如何在页面上布局和显示。每种取值都影响元素的渲染方式和布局特性。以下是常见的 display 属性值及其作用。

| **属性值** | **作用** |
| --- | --- |
| none | 元素不显示，并且不会占据任何空间。 |
| block | 元素显示为块级元素，占据一整行。 |
| inline | 元素显示为行内元素，不会在前后产生换行。 |
| inline-block | 元素显示为行内块级元素，不会换行，但可以设置宽高。 |
| **flex** | **将元素显示为弹性容器，子元素使用弹性布局。** |
| inline-flex | 将元素显示为行内弹性容器，子元素使用弹性布局。 |
| **grid** | 将元素显示为网格容器，子元素使用网格布局。 |
| inline-grid | 将元素显示为行内网格容器，子元素使用网格布局。 |
| table | 将元素显示为块级表格容器。 |
| table-row | 将元素显示为表格行。 |
| table-cell | 将元素显示为表格单元格。 |
| table-row-group | 将元素显示为表格行组。 |
| table-header-group | 将元素显示为表格头部组。 |
| table-footer-group | 将元素显示为表格底部组。 |
| table-column | 将元素显示为表格列。 |
| table-column-group | 将元素显示为表格列组。 |
| table-caption | 将元素显示为表格标题。 |
| list-item | 将元素显示为列表项，并带有列表标记。 |
| initial | 将 display 属性设置为默认值。 |
| inherit | 继承父元素的 display 属性值。 |

**其中 flex 和 grid 是每位前端开发都必须熟练掌握的！**

## 扩展知识

### 1、Flex 布局示例

Flexbox 是一种**一维布局模型**，可以在容器内排列子元素，使其能够以灵活和直观的方式布局和对齐。下面是一个基本的 Flexbox 布局示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flexbox Demo</title>
    <style>
        .container {
            display: flex;
            flex-direction: row; /* 可以设置为 row, column, row-reverse, column-reverse */
            justify-content: center; /* 可以设置为 flex-start, flex-end, center, space-between, space-around */
            align-items: center; /* 可以设置为 flex-start, flex-end, center, baseline, stretch */
            height: 100vh;
        }
        .box {
            width: 100px;
            height: 100px;
            margin: 10px;
            background-color: #f06;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box">1</div>
        <div class="box">2</div>
        <div class="box">3</div>
    </div>
</body>
</html>
```

### 2、Grid 布局示例

CSS Grid 是一种**二维布局模型**，可以在行和列的基础上定义布局。下面是一个基本的 Grid 布局示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grid Layout Demo</title>
    <style>
        .container {
            display: grid;
            grid-template-columns: repeat(3, 1fr); /* 创建3列，宽度相等 */
            grid-gap: 10px; /* 网格间的间隙 */
            height: 100vh;
            padding: 10px;
        }
        .box {
            background-color: #f06;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box">1</div>
        <div class="box">2</div>
        <div class="box">3</div>
        <div class="box">4</div>
        <div class="box">5</div>
        <div class="box">6</div>
    </div>
</body>
</html>
```

### 3、总结
####  1）Flexbox 布局

- **display: flex;**: 将容器设为弹性容器。
- **flex-direction: row;**: 设置主轴方向，可以为行或列。
- **justify-content: center;**: 设置主轴方向上的对齐方式。
- **align-items: center;**: 设置交叉轴方向上的对齐方式。
- **.box**: 子项的样式，设置宽高和背景颜色等。

#### 2）Grid 布局

- **display: grid;**: 将容器设为网格容器。
- **grid-template-columns: repeat(3, 1fr);**: 定义3列，宽度相等。
- **grid-gap: 10px;**: 设置网格项之间的间隙。
- **.box**: 子项的样式，设置高度和背景颜色等。

这两个示例展示了如何使用 Flexbox 和 Grid 布局来创建响应式布局。在我们日常的开发中，最常用的是 Flex 布局，并且 ReactNative 中统一使用的也是 Flex 布局，所以 Flex 布局大家一定要掌握，CSS 布局类考点比如**如何实现垂直水平居中** 常见回答中就有 Flex 布局方式。

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)