## CSS 中可继承与不可继承属性有哪些？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
CSS 中的属性分为**可继承**和**不可继承**两类。可继承属性会从父元素传递给子元素，而不可继承属性则只应用于定义它们的元素。一般来说，可继承属性主要涉及文本和字体相关的属性，以及一些布局相关属性。

### 1、**可继承属性**：
   - color
   - font-family
   - font-size
   - font-style
   - font-variant
   - font-weight
   - letter-spacing
   - line-height
   - text-align
   - text-indent
   - text-transform
   - visibility
   - white-space
   - word-spacing

### 2、**不可继承属性**：
   - background
   - border
   - display
   - height
   - margin
   - padding
   - width
   - position
   - top, right, bottom, left
   - z-index
   - float
   - clear

## 扩展知识
在实际开发中，理解CSS属性的继承性非常重要，因为它会影响页面元素的样式和布局。为了更好地理解和应用这一概念，这里还有一些实用的小窍门和深入的知识点。

### 1、**默认值和继承**：
某些CSS属性虽然不是继承属性，但它们在没有明确定义时，某些浏览器会默认继承。例如，`line-height`通常会被继承用于更好的文本对齐。

### 2、**使用 `inherit` 关键字**：
CSS 提供了一个 `inherit` 关键字，可以明确地让某个属性继承其父元素的值。例如：
   ```css
   .child {
       color: inherit; // 强制继承父元素的文字颜色
   }
   ```

### 3、**全局关键字**：
除了 `inherit` 之外，还有 `initial` 和 `unset` 等CSS全局关键字：
   - `initial` ：把属性设置为其默认值。
   - `unset` ：对于可继承属性，行为与 `inherit` 相同；对于不可继承属性，行为与 `initial` 相同。

### 4、**特殊情况**：
有一些属性是部分可继承的，比如 `list-style` 属性，其中 `list-style-type` 和 `list-style-position` 是可继承的，而 `list-style-image` 则不是。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)