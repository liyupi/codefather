## 什么是 Webpack？它有什么作用？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

Webpack 是一个前端资源打包工具，用于将 JavaScript、CSS、图片等项目资源进行模块化管理和打包。它能够将复杂的项目结构转化为浏览器友好的代码，提高前端项目的开发效率和性能。

1）模块打包：Webpack 将项目中的各个模块及依赖打包成一个或多个文件，优化代码结构和加载速度。

2）按需加载：通过代码拆分（Code Splitting），Webpack 可以实现按需加载，即将不同模块分成小包，只在需要时加载，减少初次加载时间。

3）资源管理：Webpack 通过各种加载器（Loaders）和插件（Plugins），处理样式、图片、字体等各种静态资源，并支持自动优化。

4）开发友好：Webpack 提供热更新、实时重载等功能，大幅提升开发体验。

通过这些功能，Webpack 能够简化代码管理、优化性能，并提供良好的开发体验，特别适合构建复杂的前端应用。

## 扩展知识

### 1） 核心概念
   - 入口（entry）：Webpack 构建的起点，通常指向应用的主文件，如 index.js。
   - 输出（output）：Webpack 打包后的文件存放位置与文件名配置。
   - 加载器（loaders）：Webpack 用于处理非 JavaScript 文件（如 CSS、图片）的工具，通过加载器可以将这些资源转为可打包模块。
   - 插件（plugins）：Webpack 功能扩展工具，用于优化、注入变量等，如压缩代码的 UglifyJSPlugin，提取样式的 MiniCssExtractPlugin 等。

### 2） 常用配置示例
以下是一个基础的 Webpack 配置示例，包含入口、输出、加载器和插件：

   ```javascript
   const path = require('path');
   const HtmlWebpackPlugin = require('html-webpack-plugin');
   const MiniCssExtractPlugin = require('mini-css-extract-plugin');

   module.exports = {
       entry: './src/index.js', // 入口文件
       output: {
           filename: 'bundle.js', // 输出文件名
           path: path.resolve(__dirname, 'dist'), // 输出目录
       },
       module: {
           rules: [
               { 
                   test: /\.css$/, // 处理 CSS 文件
                   use: [MiniCssExtractPlugin.loader, 'css-loader'],
               },
               {
                   test: /\.(png|jpg|gif)$/, // 处理图片文件
                   type: 'asset/resource',
               },
           ],
       },
       plugins: [
           new HtmlWebpackPlugin({ template: './src/index.html' }), // 自动注入 HTML
           new MiniCssExtractPlugin({ filename: 'styles.css' }),    // 提取 CSS 文件
       ],
       devServer: {
           contentBase: path.join(__dirname, 'dist'),
           hot: true,  // 启用热更新
       },
   };
   ```

### 3） Webpack 优化技巧
   - Tree Shaking：Webpack 默认支持树摇（Tree Shaking），能够在打包时自动去除未引用的代码，减少包体积。
   - 懒加载：通过代码拆分与动态 import，可以实现懒加载（Lazy Loading），在需要时才加载模块。
   - 持久化缓存：将不常变动的第三方库单独打包，并设置缓存策略，减少加载次数。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)