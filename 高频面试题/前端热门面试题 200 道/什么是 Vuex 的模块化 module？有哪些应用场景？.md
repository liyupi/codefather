## 什么是 Vuex 的模块化 module？有哪些应用场景？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
Vuex 的模块化（module）是指在 Vuex 中将 store 分割成更小的、可维护的模块，每个模块拥有自己的 state、mutation、action、getter，甚至可以嵌套子模块。这样做的目的是为了管理大型的应用状态，让 store 更加可控和易于维护。

有了模块化之后，你就可以把不同功能板块的状态存放在独立的模块中，比如说用户管理模块、产品管理模块、购物车模块等等。这些模块化的设计可以大大提升代码的可读性和组织性。

应用场景包括但不限于：
1） 当你有多个独立子功能模块需要管理状态时，比如不同页面或组件需要独立的状态管理。
2） 项目规模较大时，将 store 划分成多个模块可以减少文件复杂性，提升代码可维护性。
3） 团队开发时，不同开发人员可以专注于自己负责的模块，而不用担心与其他模块的状态冲突。

## 扩展知识

1）**模块化的基本配置**：
在主 store 文件中，你可以通过 `modules` 选项引入子模块。例如：
```javascript
import Vue from 'vue';
import Vuex from 'vuex';
import userModule from './modules/user';
import productModule from './modules/product';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user: userModule,
    product: productModule,
  }
});

export default store;
```

2）**在子模块中配置自己的状态和操作**：
每个子模块可以像主 store 一样配置 state, mutations, actions, getters 以及嵌套的 modules。例如：
```javascript
// modules/user.js
const state = {
  userDetails: {},
};

const mutations = {
  SET_USER_DETAILS(state, details) {
    state.userDetails = details;
  },
};

const actions = {
  fetchUserDetails({ commit }) {
    // 假设有一个 API 请求来获取用户数据
    API.getUserDetails().then(details => {
      commit('SET_USER_DETAILS', details);
    });
  },
};

const getters = {
  userDetails: state => state.userDetails,
};

export default {
  namespaced: true,  // 用于命名空间管理
  state,
  mutations,
  actions,
  getters,
};
```

3）**命名空间（Namespacing）**：
在模块化配置中，使用 `namespaced: true` 可以使模块内的 getters, actions 和 mutations 自动根据模块名空间化。这意味着你在组件中使用时，需要加上模块名作为前缀：
```javascript
this.$store.dispatch('user/fetchUserDetails');
```

4）**模块复用**：
模块化不仅仅是为了分割代码，每个模块还可以单独复用。例如，同一模块可以被多个主 store 引用，也可以在多个项目中跨项目复用。

5）**动态注册模块**：
Vuex 支持动态注册模块，这在一些场景下非常有用，比如当组件加载时才动态添加需要的模块，提高性能：
```javascript
store.registerModule('dynamic', {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
});
```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)