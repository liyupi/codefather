## 如何优化 Webpack 打包后文件的体积？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

优化 Webpack 打包后文件的体积可以通过以下几种方法：

1）代码拆分（Code Splitting）： 通过把一些大的源文件拆分成更小的文件，可以提高浏览器加载效率，同时实际打包出来的体积也能显著减少。Webpack 提供了 SplitChunksPlugin 插件专门用于这个目的。

2）使用 Tree Shaking： Tree Shaking 是一个用来剔除 JavaScript 中未被引用代码的过程。Webpack 内置了 Tree Shaking 功能，通过配置 mode 为 production，它会自动帮助我们移除那些没有被使用到的代码。

3）启用压缩（Compression）： 对于生产环境的打包，使用压缩插件如 TerserWebpackPlugin 或者 BabelMinifyWebpackPlugin 来压缩 JavaScript 代码，图片等资源也可以使用其他压缩工具来处理。

4）合理设置第三方库的引入方式： 一些第三方库如果直接整包引入，体积可能会非常大。推荐使用按需加载方式引入，避免引入整个库，而只使用我们需要的功能模块。

5）移除无用插件与 polyfills： 确保配置文件中没有引入过多冗余的插件或代码。对于一些不再需要支持的浏览器，可以减少 polyfills 的数量。


## 扩展知识

### 1）Tree Shaking

Tree Shaking 是一种用于移除 JavaScript 中未使用代码的技术。Webpack 在生产模式下会自动进行 Tree Shaking，但需要确保代码使用了 ES6 模块语法（import/export）。例如：

```javascript
// utils.js
export function usedFunction() {
  console.log('This is used');
}

export function unusedFunction() {
  console.log('This is unused');
}

// main.js
import { usedFunction } from './utils';
usedFunction();
```

在这种情况下，unusedFunction 将不会被打包。

### 2）代码分割（Code Splitting）

代码分割可以将代码拆分成更小的块，以便按需加载。Webpack 提供了多种代码分割的方法，如动态导入和 SplitChunksPlugin。

- 动态导入：使用 import() 函数实现动态加载模块。
- SplitChunksPlugin：用于提取公共模块，减少重复代码。例如：

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

### 3）压缩代码

使用 TerserPlugin 等工具压缩 JavaScript 代码，减少文件体积。Webpack 默认在生产模式下使用 TerserPlugin。

### 4）使用合适的加载器和插件

- Babel-loader：用于转换现代 JavaScript 语法，确保代码兼容性。
- MiniCssExtractPlugin：用于提取 CSS 文件，支持 CSS 压缩。
- Image-webpack-loader：用于优化图像文件体积。

### 5）移除无用插件和 polyfills

审查并移除项目中不必要的插件和 polyfills，以减少打包的代码量。


### 6）分析工具

使用 Webpack Bundle Analyzer 等工具分析打包后的文件，识别并优化大文件和重复模块。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)