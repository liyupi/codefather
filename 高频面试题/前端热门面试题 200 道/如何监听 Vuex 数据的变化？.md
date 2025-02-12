## 如何监听 Vuex 数据的变化？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
在 Vuex 中，有多种方法可以监听数据的变化，其中最常用的两种方式是 `watch` 和 `subscribe` 方法。 `watch` 主要用来监听 Vuex state 的变化，而 `subscribe` 则更适用于对提交 mutation 的时候的监听。

1）使用 `watch` 方法监听 Vuex state 的变化：
```javascript
// 在 Vue 组件中
this.$store.watch(
  (state) => state.someState,
  (newValue, oldValue) => {
    console.log('someState changed from', oldValue, 'to', newValue);
  }
);
```

2）使用 `subscribe` 方法监听 mutation 的变化：
```javascript
// 在 Vuex store 中
store.subscribe((mutation, state) => {
  console.log('mutation.type:', mutation.type);
  console.log('mutation.payload:', mutation.payload);
});
```

## 扩展知识

1）`mapState` / `mapGetters` 和组件的 `watch` 结合使用：
如果你想监听 Vuex 中某个模块的具体状态，可以结合 `mapState` 或 `mapGetters` 和 Vue 组件的 `watch` 方法，代码更加简洁和模块化。
```javascript
// 在 Vue 组件中
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      someState: state => state.someModule.someState
    })
  },
  watch: {
    someState(newValue, oldValue) {
      console.log('someState in module someModule changed from', oldValue, 'to', newValue);
    }
  }
};
```

2）`subscribeAction` 方法监听 action 的触发：
如果你对 actions 的触发感兴趣，可以使用 Vuex 提供的 `subscribeAction` 方法来监听 action 的触发。
```javascript
// 在 Vuex store 中
store.subscribeAction((action, state) => {
  console.log('action.type:', action.type);
  console.log('action.payload:', action.payload);
});
```

3）Custom Plugin：
有时候你需要在 Vuex 中进行更高级的监听和操作，此时可以考虑编写一个自定义的 Vuex 插件。
```javascript
const myPlugin = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'SOME_MUTATION') {
      console.log('Reacting to SOME_MUTATION');
      // 执行一些自定义逻辑
    }
  });
};

const store = new Vuex.Store({
  // your store options
  plugins: [myPlugin]
});
```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)