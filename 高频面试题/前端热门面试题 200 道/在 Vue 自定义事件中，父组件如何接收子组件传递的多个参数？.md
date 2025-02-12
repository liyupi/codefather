## 在 Vue 自定义事件中，父组件如何接收子组件传递的多个参数？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
在 Vue 中，父组件要接收子组件传递的多个参数，可以通过 `$emit` 方法传递多个参数，然后在父组件中定义一个方法来处理这些参数。

### 示例代码：
假设我们有一个子组件 `ChildComponent` 和一个父组件 `ParentComponent`。

**子组件 ChildComponent.vue**:
```html
<template>
  <button @click="sendData">Send Data</button>
</template>

<script>
export default {
  methods: {
    sendData() {
      this.$emit('customEvent', 'param1', 'param2', 'param3');
    }
  }
}
</script>
```

**父组件 ParentComponent.vue**:
```html
<template>
  <ChildComponent @customEvent="handleCustomEvent"/>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: {
    ChildComponent
  },
  methods: {
    handleCustomEvent(param1, param2, param3) {
      console.log(param1, param2, param3);
    }
  }
}
</script>
```

在这个示例中，子组件通过 `$emit` 触发 `customEvent` 并传递三个参数。父组件通过 `@customEvent` 监听事件，并在 `handleCustomEvent` 方法中接收这些参数。

## 扩展知识

1）**事件总线**：
   在复杂的 Vue 应用中，通过 `$emit` 和 `@event` 传递事件和数据的方式可能会显得不够灵活。事件总线（EventBus）是一种常见的替代方案，可以在全局范围内传递事件和数据。

**创建事件总线**:
```javascript
// EventBus.js
import Vue from 'vue';
export const EventBus = new Vue();
```

**在组件中使用**:
```javascript
// ChildComponent.vue
<template>
  <button @click="sendData">Send Data</button>
</template>

<script>
import { EventBus } from './EventBus';

export default {
  methods: {
    sendData() {
      EventBus.$emit('customEvent', 'param1', 'param2', 'param3');
    }
  }
}
</script>
```

```javascript
// ParentComponent.vue
<template>
  <div>Parent Component</div>
</template>

<script>
import { EventBus } from './EventBus';

export default {
  created() {
    EventBus.$on('customEvent', this.handleCustomEvent);
  },
  beforeDestroy() {
    EventBus.$off('customEvent', this.handleCustomEvent);
  },
  methods: {
    handleCustomEvent(param1, param2, param3) {
      console.log(param1, param2, param3);
    }
  }
}
</script>
```

2）**使用 Vuex**：
   Vuex 是 Vue 的状态管理模式，在处理跨组件的状态共享时非常实用。通过 Vuex 你可以将状态提升到全局，避免通过事件频繁传递数据的问题。

3）**Scoped Slots**：
   Scoped Slots 使得父组件可以在子组件内部作用域中渲染内容，适用于需要在子组件渲染过程中传递数据回父组件的场景。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)