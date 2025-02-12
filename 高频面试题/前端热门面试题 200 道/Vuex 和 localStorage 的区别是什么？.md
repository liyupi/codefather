## Vuex 和 localStorage 的区别是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
Vuex 和 localStorage 是两个完全不同的概念。Vuex 是一种状态管理模式，用于管理 Vue 应用中的组件之间的共享状态；而 localStorage 是浏览器提供的本地存储机制，用于在客户端持久化数据。

## 扩展知识
我们先来看看这两者有什么不同之处：

1）数据作用范围
   - Vuex：Vuex 管理的是 Vue 应用中的状态，数据只在应用运行期间有效。如果刷新页面，状态会重置，除非我们进行状态持久化处理。
   - localStorage：localStorage 是浏览器 API，数据存储在客户端，页面刷新、浏览器重启或者关机重开，数据仍会保留。

2）数据同步机制
   - Vuex：Vuex 内部是基于 Vue 的响应式机制，状态改变时，订阅该状态的组件会自动更新，非常适合复杂单页应用中的数据共享和状态管理。
   - localStorage：localStorage 本身不具备响应式数据更新机制，更适用于存储一些简单的用户偏好设置、缓存数据等。如果需要监听数据变化，通常会结合 `window.addEventListener('storage', callbackFunction)` 事件来实现。

3）使用场景
   - Vuex：适合管理复杂的应用状态，例如用户信息、全局通知、异步请求数据等。这些状态通常需要在不同组件之间共享和交互。
   - localStorage：适合存储简单的、需要持久化的数据，比如用户设置、缓存数据等。可以与 Vuex 结合，存储一些需要持久化的数据，如：在 Vuex 的状态被清除后，可以从 localStorage 中恢复状态。

4）数据操作
   - Vuex：所有状态管理操作都通过 Vuex 的官方 API 实现，例如 `commit` 提交 mutation 改变状态，`dispatch` 触发 action，确保数据变化过程可预测、可追溯。
   - localStorage：对数据的操作是通过调用浏览器提供的 API，如 `localStorage.setItem(key, value)`、`localStorage.getItem(key)` 等。

在实际应用中，你会发现很多情况需要结合两者的特性来使用。比如在Vuex中存放用户状态，并利用 localStorage 来持久化保存用户数据，这样即使刷新页面，用户信息也不会丢失。

### 小结


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)