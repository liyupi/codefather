## 使用 link 和 @import 引用 CSS 的区别
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

在 HTML 文档中，可以通过 `<link>` 标签或 CSS 中的 @import 语句来引用外部样式表。两者在使用方式、加载顺序、兼容性等方面有一些重要的区别。  

| **特性** | **`<link>` 标签** | **@import** |
| --- | --- | --- |
| 用法 | 在 HTML 文档的 `<head>` 部分使用 | 在 CSS 文件或 `<style>` 标签内使用 |
| 加载顺序 | 页面加载时立即加载样式表 | 在加载包含它的 CSS 文件后加载 |
| 浏览器支持 | 支持所有主流浏览器 | 支持 IE5+ 和所有现代浏览器 |
| 性能 | 加载并行进行，速度较快 | 加载顺序依赖，速度较慢 |
| DOM 可操作性 | 可通过 JavaScript 操作和控制 | 不易通过 JavaScript 操作 |
| 样式权重 | 样式权重相同 | 样式权重相同 |

为了提高页面加载性能和保持较好的浏览器兼容性，推荐使用 `<link>` 标签来引入 CSS 样式，但在某些情况下，为了实现样式模块化，可以在 CSS 文件中使用 `@import` 规则，不过需注意其对性能的影响。

### 1、 `<link>`
用于 HTML 文档中引用 CSS 文件，因为其加载速度更快，兼容性更好，并且可以通过 JavaScript 操作。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link vs Import</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <h1>Hello, world!</h1>
  </body>
</html>
```
### 2、 @import：
可以在 CSS 文件中引用其他 CSS 文件，但由于加载速度较慢，不建议在需要高性能的应用中使用。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link vs Import</title>
    <style>
      @import url("styles.css");
    </style>
  </head>
  <body>
    <h1>Hello, world!</h1>
  </body>
</html>
```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)