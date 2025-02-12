## Vue Router 中如何获取路由传递过来的参数？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
在 Vue Router 中，我们有两种常见的方式可以传递参数：动态路由匹配和查询参数。对于获取这些参数的方法如下：

1）**动态路由匹配**：在 Vue Router 中，我们可以通过类似 `/user/:id` 这样的路径来定义一个动态路由参数。这时，我们可以通过 `this.$route.params` 来获取传递的参数。例如：
```html
<template>
  <div>User ID: {{ userId }}</div>
</template>

<script>
export default {
  computed: {
    userId() {
      return this.$route.params.id;
    }
  }
};
</script>
```

2）**查询参数**：在 URL 中使用查询字符串的形式传递参数，例如 `/user?id=123`。此时，可以通过 `this.$route.query` 来获取查询参数。例如：
```html
<template>
  <div>User ID from Query: {{ userId }}</div>
</template>

<script>
export default {
  computed: {
    userId() {
      return this.$route.query.id;
    }
  }
};
</script>
```

## 扩展知识
相关的知识点和使用场景：
1）**动态路由匹配的应用场景**：动态路由匹配通常用于资源路径，例如用户页面 `/user/123`、文章页面 `/article/456`。这种方式的好处是 URL 简洁明了，更符合语义化。

2）**查询参数的应用场景**：查询参数通常用于筛选、搜索等功能。例如在搜索页面 `/search?query=vue` 这样的场景下，通过查询参数可以实现更为灵活的参数传递。查询参数更适合多参数组合且顺序不固定的场景。

3）**混合使用**：有时我们会同时使用动态路由和查询参数，例如 `/user/123?tab=info`，这种方式结合了两者的优点，既保证了路径的简洁，又增加了参数的多样性。

4）**观察参数变化**：
假设我们在当前页面使用路由参数做一些交互，那么我们可能需要监听路由参数的变化。可以通过 Vue 的 `$watch` 或 lifecycle hook 实现。例如在 `watch` 中：
```javascript
watch: {
  '$route' (to, from) {
    // 处理路由变化
    console.log(to.params.id);
  }
}
```
这可以使你的应用更为灵活应对参数变动。

5）**路由传参的最佳实践**：在实际开发中，尽量保持路由参数的简洁和有意义。考虑到可能的数据量、SEO需求、用户可读性等因素，合理选择使用动态路由还是查询参数。同时，做好参数验证和默认值处理，防止因参数未传递或传递错误而导致的BUG。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)