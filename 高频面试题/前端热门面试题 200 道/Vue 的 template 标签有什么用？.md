## Vue 的 template 标签有什么用？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

template 主要是作为一个占位符去使用，在 Vue 2 和 Vue 3 中 template 的表现有一些区别：

Vue 2：作为一个占位符去使用或者是在组件中传递一个插槽内容。无论什么情况，template 在 compiler 后会被去除。

Vue 3：用法同 Vue 2，但是在不使用 v-if、v-else-if 或 v-else、v-slot、v-for 的时候，Vue 不会进行处理，会直接渲染成一个 HTML 原生的 template 标签。

## 扩展知识
### Vue 2 表现分析

Vue 2 中对应 template 仅仅是属于一个占位符，在 `vue-template-compiler` 处理完毕后，其并不会保留在 render 函数中。换句话说，其最后并不会影响到渲染到页面上的 DOM。

讲实际例子前，我们先讲一下 render 函数中一些方法作用：

```js
_c: 创建 VNode 节点
_v: 创建文本节点
_e: 创建一个空的 VNode 节点
_u: 处理插槽数据
```

我们可以用 `vue-template-compiler`  来验证一下上面的结论：

```javascript
const compiler = require('vue-template-compiler')

// 这里解析的是 Vue 单文件的模板
const res = compiler.compile(`<div class='root-container'>
  <template>
    <div>测试元素1</div><div>测试元素2</div>
  </template>
  <template #slotName>
    <div>测试元素1</div><div>测试元素2</div>
  </template>
  <template v-if="true">
    <div>测试元素1</div><div>测试元素2</div>
  </template>
  <template v-if="false">
    <div>测试元素1</div><div>测试元素2</div>
  </template>
</div>`)
```

上面会输出一些结果，我们只需要关注 render 这个属性就行了。

下面解析一下 render 结果：

```js
with (this) {
  return _c(
    'div',
    {
      staticClass: "root-container",
      // 插槽属性，这个元素最后会挂载到特定组件的定义好的插槽位置上
      scopedSlots: _u(
        [{
          key: "slotName",
          fn: function () {
            // 可以看到这里是直接将 template 中的元素给平铺了出来，template 这个元素本身并没有被渲染出来
            return [
              _c('div', [_v("插槽元素1")]),
              _c('div', [_v("插槽元素2")])
            ]
          },
          proxy: true
        }]
      )
    },
    // 空格占位符（因为 2 个 template 之间有换行）
    [_v(" "),
    // 解析：无条件元素这里的 2 个元素是直接作为元素被创建
    [
      _c('div', [_v("无条件元素1")]), _c('div', [_v("无条件元素2")])
    ],
    // 空格占位符（因为 2 个 template 之间有换行）
    _v(" "),
    // 这里的 2 个元素是根据 v-if 传进去的条件来决定是否渲染。否的话会创建一个空的 VNode 节点
    (true) ? [
      _c('div', [_v("有条件元素1")]), _c('div', [_v("有条件元素2")])
    ] : _e()],
    2)
}
```

我们可以将下面这段代码放到 Vue 2 中去跑下。这里把 slot 去掉了，只看 template 带不带条件的表现：

```html
<template>
  <div class='root-container'>
    <template>
      <div>无条件元素1</div><div>无条件元素2</div>
    </template>
    <template v-if="true">
      <div>有条件元素1</div><div>有条件元素2</div>
    </template>
  </div>
</template>
```

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1817119088510447617/CfbJ6bRe_image-20240803111716351_mianshiya.png" alt="image-20240803111716351.png" width="100%" />

可以看到，和分析的是一致的。

## Vue 3 表现分析

Vue3 中的 template 与 Vue 2 中的有些差别：

template 如果上面不携带任何指令，那么它将被渲染成一个原生的 [template ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)标签。

template 只有与下面的指令一起使用时，里面的元素才会被 Vue 内部进行处理。也就是决定它展示或不展示，或者展示到哪个插槽的位置。

```text
v-if 、 v-else-if 或 v-else
v-for
v-slot（简写为 #插槽名）
```

我们可以将下面这段代码放到 Vue 3 中去跑下：

```html
<template>
  <template v-if="false">
    <div>
      template with false
    </div>
  </template>
  <template v-if="true">
    <div>
      template with true
    </div>
  </template>
  <template>
    <div>
      origin template
    </div>
  </template>
</template>
```

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1817119088510447617/9oZXmX4R_image-20240803112544779_mianshiya.png" alt="image-20240803112544779.png" width="100%" />

可以看到只有条件为 true 的 template 中的元素被展示到了 DOM 上。而不带任何条件的 template 则被解析成了 HTML 原生的 template 元素。

### 使用场景

1）对多个同级元素进行统一显隐：

```html
<template>
  <div>
    <template v-if="mode === 'male'">
      <div>子级元素1</div>
      <div>子级元素2</div>
      <div>子级元素3</div>
      <div>子级元素4</div>
      <div>子级元素5</div>
    </template>
		<template v-else-if>
      <div>子级元素1</div>
      <div>子级元素2</div>
      <div>子级元素3</div>
      <div>子级元素4</div>
      <div>子级元素5</div>
    </template>
    <div>other children....</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mode: 'male'
    }
  }
}
</script>
```

好处：**template 不会在 DOM 上真实渲染，提高简洁性。** 如果换成其他元素的话，则这些元素会在 DOM 上真实渲染。

实际效果：

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1817119088510447617/snXSEW6P_image-20240803113840186_mianshiya.png" alt="image-20240803113840186.png" width="100%" />

例如：

```html
<template>
  <div>
    <div v-if="mode === 'male'">
      <div>子级元素1</div>
      <div>子级元素2</div>
      <div>子级元素3</div>
      <div>子级元素4</div>
      <div>子级元素5</div>
    </div>
		<div v-else-if>
      <div>子级元素1</div>
      <div>子级元素2</div>
      <div>子级元素3</div>
      <div>子级元素4</div>
      <div>子级元素5</div>
    </div>
    <div>other children....</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mode: 'male'
    }
  }
}
</script>
```

则会变成这样：外层元素多了一个 div 元素，就显得没这么简洁了。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1817119088510447617/FLLw1riY_image-20240803114037222_mianshiya.png" alt="image-20240803114037222.png" width="452px" />


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)