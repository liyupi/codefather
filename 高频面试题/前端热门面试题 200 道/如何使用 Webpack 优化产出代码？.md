## 如何使用 Webpack 优化产出代码？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

使用 Webpack 优化产出代码可以显著提高应用性能和加载速度。以下是一些常见的优化策略：

1） 代码分割：使用 splitChunks 选项将大文件拆分成多个小文件，减少初始加载时间。

2） Tree Shaking：确保使用 ES6 模块，Webpack 能够去除未使用的代码，从而减小包的体积。

3） 压缩和混淆：使用 TerserWebpackPlugin 进行 JavaScript 代码压缩，减少文件大小，提高加载速度。

4） 资源优化：使用 image-webpack-loader 等加载器优化图像资源，减小图片体积。

5） 开启生产模式：通过设置 mode: 'production' 启用内置的优化功能，如压缩和删除空代码。

## 扩展知识

### 1） 代码分割配置

以下是一个示例配置，展示如何在 Webpack 中实现代码分割：

```javascript
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all', // 分割所有类型的代码
            minSize: 20000, // 最小文件大小
            maxSize: 0, // 不限制最大文件大小
            minChunks: 1, // 至少被多少个模块引用
            maxAsyncRequests: 30, // 异步请求的最大数量
            maxInitialRequests: 30, // 初始请求的最大数量
        },
    },
};
```

### 2） Tree Shaking 配置

确保使用 ES6 模块语法，如 import 和 export，Webpack 自动执行树摇。通常需要确保 mode 设置为 production。

```javascript
module.exports = {
    mode: 'production',
};
```

### 3） 压缩配置

使用 Terser 插件压缩代码，示例配置如下：

```javascript
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
};
```

### 4） 资源优化示例

使用图像加载器优化图像：

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65,
                            },
                            pngquant: {
                                quality: [0.65, 0.9],
                                speed: 4,
                            },
                        },
                    },
                ],
            },
        ],
    },
};
```

### 5） 开启其他优化

可以通过配置 Webpack 的 `devtool` 选项以便在生产环境中生成 source map：

```javascript
module.exports = {
    devtool: 'source-map', // 生成 source map
};
```

### 6）合理配置 externals 和 alias：

可以让一些库通过外部 CDN 来加载，通过 externals 配置项来实现：

```javascript
module.exports = {
    externals: {
        jquery: 'jQuery',
    },
};
```

这样 jQuery 就不会捆绑在你的 bundle 中，而是在运行时从 CDN 加载。

至于 alias，可以缩短引用路径，提高打包速度：

```javascript
module.exports = {
resolve: {
alias: {
'@': path.resolve(\_\_dirname, 'src/'),
// 其他 alias
},
},
};
```

### 7）缓存：

为了更高效的缓存，可以使用 [contenthash] 来生成唯一的文件名。在 webpack 配置输出部分设置：

```javascript
module.exports = {
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    // ...
};
```

这样当文件内容未变化时，文件名也不会变，浏览器可以更高效的缓存。

### 8）优化图片和其他资源：

可以通过 image-webpack-loader 来压缩图片。安装插件并配置：

```javascript
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65,
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.9],
                                speed: 4,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75,
                            },
                        },
                    },
                ],
            },
        ],
    },
};
```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)