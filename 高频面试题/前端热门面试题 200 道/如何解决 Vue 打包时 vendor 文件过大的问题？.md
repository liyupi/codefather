## 如何解决 Vue 打包时 vendor 文件过大的问题？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
要解决 Vue 项目打包时 vendor 文件过大的问题，我建议使用以下几种方法：
1）拆分代码：通过代码分割功能（Code Splitting）将大的文件拆分成多个小的文件，并按需加载。
2）优化依赖：剔除不必要的第三方库，或者使用更轻量的替代库。
3）设置 externals：将一些常用的、体积较大的库排除在打包之外，改为通过 CDN 的方式引入。
4）Tree Shaking：确保使用 Tree Shaking 技术，只打包实际使用的代码部分。
5）生产环境构建优化：开启生产环境的构建优化配置，例如移除调试信息、压缩代码等。

## 扩展知识
1）**拆分代码（Code Splitting）**：在 Vue 项目中，可以使用动态 import 和 Vue Router 的懒加载功能来实现代码分割。比如 
   ```javascript
   const Home = () => import(/* webpackChunkName: "home" */ './views/Home.vue');
   const About = () => import(/* webpackChunkName: "about" */ './views/About.vue');
   ```

2）**优化依赖**：审查项目中使用的第三方库，很多时候用到了非常重的库但仅仅用了很少功能。比如把 lodash 替换为 lodash-es，或是直接使用原生 JavaScript 实现。也可以通过类似 BundlePhobia 的工具来分析库的体积。

3）**设置 externals**：通过 webpack 的 `externals` 配置，指定某些包不打包进 vendor 文件，例如：
   ```javascript
   module.exports = {
     externals: {
       'vue': 'Vue',
       'vue-router': 'VueRouter'
     }
   };
   然后在 HTML 中通过 CDN 引入：
   <script src="https://cdn.jsdelivr.net/npm/vue@2.6.12"></script>
   <script src="https://cdn.jsdelivr.net/npm/vue-router@3.4.9"></script>
   ```

4）**Tree Shaking**：确保你的项目构建工具（如 webpack）能进行 Tree Shaking，只导入和打包实际使用的模块。例如，使用 ES6 模块的语法 `import` 和 `export` ，并使用生产环境的构建工具选项如 `mode: 'production'`.

5）**生产环境构建优化**：打开生产环境特定的优化配置，例如压缩代码（使用 `optimization.minimize`）、剔除不必要的注释和调试信息等。
```javascript
module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
  },
};
```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)