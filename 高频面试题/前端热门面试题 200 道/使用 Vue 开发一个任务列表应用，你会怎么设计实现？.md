## 使用 Vue 开发一个任务列表应用，你会怎么设计实现？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
我会设计一个任务列表应用，核心模块包括任务的展示、添加、新增与删除功能，页面效果用 Vue 来实现，数据会用 Vue 的响应式特性来管理。

1）创建一个 Vue 项目以及组件
2）定义任务的状态和功能方法
3）使用模板语法来展示任务列表
4）实现任务的增删改查操作
5）处理样式和用户交互

## 扩展知识

1）**创建 Vue 项目和组件：**

   我会首先使用 Vue CLI 创建一个新的 Vue 项目，这样可以快速搭建好项目的基础结构。接下来会创建几个必要的组件，比如 `TaskList.vue`、`TaskItem.vue` 和 `AddTask.vue`。

2）**定义数据和状态管理：**

   任务列表的数据可以存储在 Vue 组件的 `data()` 中，比如：
   ```javascript
   export default {
     data() {
       return {
         tasks: [
           { id: 1, title: 'Task 1', completed: false },
           { id: 2, title: 'Task 2', completed: true }
         ],
         newTaskTitle: ''
       };
     },
     methods: {
       addTask() {
         if (this.newTaskTitle) {
           this.tasks.push({ id: Date.now(), title: this.newTaskTitle, completed: false });
           this.newTaskTitle = '';
         }
       },
       deleteTask(taskId) {
         this.tasks = this.tasks.filter(task => task.id !== taskId);
       },
       toggleTaskCompletion(taskId) {
         const task = this.tasks.find(task => task.id === taskId);
         if (task) {
           task.completed = !task.completed;
         }
       }
     }
   };
   ```
   
3）**使用模板语法展示任务列表：**
   在 `TaskList.vue` 中，使用 `v-for` 指令来遍历并展示任务列表，同时绑定相应的事件处理函数：
   ```html
   <template>
     <div>
       <h1>任务列表</h1>
       <ul>
         <li v-for="task in tasks" :key="task.id">
           <span @click="toggleTaskCompletion(task.id)" :class="{ completed: task.completed }">
             {{ task.title }}
           </span>
           <button @click="deleteTask(task.id)">Delete</button>
         </li>
       </ul>
       <input v-model="newTaskTitle" placeholder="新增任务">
       <button @click="addTask">Add Task</button>
     </div>
   </template>
   ```

4）**任务的增删改查操作：**

   通过绑定事件听器（例如 `@click`）调用相应的方法来实现对任务的增删改查。添加任务可以使用 `v-model` 双向绑定来获取用户输入的新任务内容。

5）**处理样式和用户交互：**

   在 `TaskList.vue` 模板中的 `span` 标签上，使用 `:class` 动态绑定来添加样式类，从而根据任务是否完成来变化其样式标识：
   ```css
   .completed {
     text-decoration: line-through;
   }
   ```

我总结了上面这几个步骤，你基本上就可以设计一个简单但功能齐全的任务列表应用。当然，在实际开发中你可能还需要添加更多细节和优化，比如添加任务的编辑功能、任务列表的持久化存储（例如使用 localStorage），这些都可以根据实际需求和时间安排来进一步扩展。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)