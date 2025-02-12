## Vue Router 如何配置 404 页面？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
在 Vue 项目中，如果你想配置一个 404 页面（即找不到页面提示），你需要通过 Vue Router 来设置。这通常通过将路由配置中的 *（通配符）指向一个 404 组件来实现。

下面提供一个示例，为 Vue Router 配置一个 404 页面：

```javascript
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/components/Home.vue';
import NotFound from '@/components/NotFound.vue'; // 这是你的 404 页面组件

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '*', // 通配符，一定要放在最后
    component: NotFound
  }
];

const router = new VueRouter({
  mode: 'history', // 使用 HTML5 History 模式
  routes
});

export default router;
```

在这个配置中，`path: '*'` 的这一行定义了一个通配符路由，这个路由会匹配所有未定义的路径，并将其路由到 `NotFound` 组件。确保这条规则是路由配置中的最后一条规则。

## 扩展知识

1）**Vue Router 模式**：在上面的示例中，我使用了 `mode: 'history'` 来设置路由的模式，这避免了 URL 中出现 `#` 符号。如果不设置，默认是 `hash` 模式。需要注意的是，如果使用 `history` 模式，你需要在服务器端做一些配置，让所有的路径都指向你的 `index.html` 文件。

2）**懒加载路由组件**：为了优化性能，可以使用 Vue 的异步组件来懒加载路由组件，例如：

```javascript
const NotFound = () => import('@/components/NotFound.vue');
```

这样只有在访问该路由时才会加载对应的组件，减少初始加载时间。

3）**通配符路由位置**：一定要注意，通配符路由 `path: '*'` 一定要放在所有路由规则的最后一条。如果放在前面或中间会导致后面的路由规则永远无法被匹配到。

4）**404 组件设计**：你的 404 页面组件可以设计得更丰富一些，比如可以包含一个返回首页的按钮，或者一些友好的提示信息，让用户体验更好。

5）**导航守卫**： Vue Router 还提供了导航守卫，可以在路由跳转前进行一些操作，比如鉴权或者日志记录，这是在大项目中经常会使用到的。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)