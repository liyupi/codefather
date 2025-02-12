## 如何优化 Webpack 打包 Vue 应用的速度？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
优化 Webpack 打包 Vue 应用的速度，可以从以下几个方面入手：

1）**减少文件体积**：通过代码分割、压缩等方式减小打包后的文件体积，从而减少打包时间。
2）**合理配置 loaders 和 plugins**：减少不必要的配置项，按需加载。
3）**第三方库资源优化**：利用 CDN 加载第三方库，减少打包的体积。
4）**缓存**：利用缓存机制，如 DLLPlugin 等，减少打包时重复构建的时间。
5）**并行打包**：使用多进程/多实例来提高打包效率，比如 `thread-loader`。
6）**增加打包的并发数**：配置 `TerserWebpackPlugin` 使其在并发数上更高效工作。

## 扩展知识
下面我具体地聊一聊如何分别实现这些优化：

1）**减少文件体积**：
  - **代码分割（Code Splitting）**：使用 Webpack 的 `splitChunks` 进行代码分割，可以将 Vendor (第三方库) 和应用程序代码分割开来。
  - **Tree Shaking**：开启生产模式，并配置 `optimization: { usedExports: true }`，只打包用到的模块。
  - **压缩代码**：使用 `TerserWebpackPlugin` 来压缩 JavaScript 代码，使用 `cssnano` 等工具压缩 CSS 代码。

2）**合理配置 loaders 和 plugins**：
  - **减少 loader 数量**：只在需要的文件上使用合适的 loader。使用 `include` 和 `exclude` 指定 loader 作用的文件范围。
  - **Plugins**：有些插件在开发模式下可能不需要加载，比如 `MiniCssExtractPlugin`，可以在生产模式下再引入。Carefully use `plugin` for specific runtime like `analys` in production stage.

3）**第三方库资源优化**：
  - **CDN 引入**：可以通过 `externals` 配置将常用的第三方库（如 Vue、Lodash）放到 CDN 上，以减少本地的打包时间和体积。配置方式如下：
    ```javascript
    externals: {
      vue: 'Vue',
      lodash: '_'
    }
    ```
  - **尽量在打包时采用 tree-shakable 的库**，比如 lodash-es 代替 lodash。

4）**缓存**：
  - **DLLPlugin**：DLLPlugin 为我们在开发时打包第三方库的代码，只在库有改动时才重新打包。
  - **硬盘缓存**：从 Webpack 5 开始支持一些内置的缓存策略，我们可以利用 `Cache` 功能启用硬盘缓存。

5）**并行打包**：
  - 使用 `thread-loader` 可以并行处理一些耗时较长的 loader，如 Babel。
  - 结合 HappyPack 插件或 `babel-preset-env` 的 `useBuiltIns: 'usage'`, `webpack-bundle-analyzer` 进行分析优化。

6）**增加打包的并发数**：
  - `TerserWebpackPlugin` 在默认的情况下已经开启多进程并行压缩代码，我们可以通过配置 `parallel: true` 来指定并发数，以提高性能：
    ```javascript
    new TerserWebpackPlugin({
      parallel: true,
      // other options...
    })
    ```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)