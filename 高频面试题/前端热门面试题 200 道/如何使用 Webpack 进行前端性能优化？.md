## 如何使用 Webpack 进行前端性能优化？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

使用 Webpack 进行前端性能优化主要可以通过以下几个方面：

1） 代码分割：通过动态导入或入口配置，将应用拆分成多个小块，按需加载，提高首次加载速度。

2） 资源压缩：使用 TerserWebpackPlugin 对 JavaScript 进行压缩，使用 css-minimizer-webpack-plugin 压缩 CSS，减少文件体积。

3） 图片优化：使用 image-webpack-loader 压缩图片，降低加载时间，改善用户体验。

4） 预加载和预取：使用 Webpack 的 `webpackPrefetch` 和 `webpackPreload` 提高资源加载效率。

5） 缓存管理：设置合适的缓存策略，通过 hash 文件名管理缓存，避免用户下载过期资源。

6） Tree Shaking：通过 ES6 模块的静态分析，去除未使用的代码，减小打包后的体积。

## 扩展知识

### 压缩 js

webpack5 的话通过 terser-webpack-plugin 来压缩 JS，但在配置了 mode: production
时，会默认开启

```ts
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    optimization: {
        // 开启压缩
        minimize: true, // 压缩⼯具
        minimizer: [new TerserPlugin({})],
    },
};
```

需要注意⼀个地⽅：⽣产环境会默认配置 terser-webpack-plugin ，所以如果你还有其它压缩插件使⽤的话需要将 TerserPlugin 显⽰配置或者使⽤ ... ，否则 terser-webpack-plugin 会被覆盖。

```ts
 const TerserPlugin = require("terser-webpack-plugin");
 optimization: {
 minimize: true,
 minimizer: [new TerserPlugin({}), // 显⽰配置// "...", // 或者使⽤展开符，启⽤默认插件// 其它压缩插件new CssMinimizerPlugin(),
 ],
 },

```

### 压缩 css

压缩 css 我们使⽤ css-minimizer-webpack-plugin
同时，应该把 css 提取成单独的⽂件，使⽤ mini-css-extract-plugin

```ts
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    // 提取成单独的⽂件
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            // 定义输出⽂件名和⽬录
            filename: 'asset/css/main.css',
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            // 压缩 cssnew CssMinimizerPlugin({}),
        ],
    },
};
```

### 压缩 html

压缩 html 使⽤的还是 html-webpack-plugin 插件。该插件⽀持配置⼀个 minify 对象，⽤来配置压缩 html 。

```TS
 module.export = {
 plugins: [new HtmlWebpackPlugin({// 动态⽣成 html ⽂件
 template: "./index.html",
 minify: {// 压缩HTML
 removeComments: true, // 移除HTML中的注释
 collapseWhitespace: true, // 删除空⽩符与换⾏符
 minifyCSS: true // 压缩内联css
 },
 })
 ]
 }
```

### 压缩图⽚

可以通过 image-webpack-loader 来实现

```TS
module.exports = {module: {
 rules: [
 {
 test: /\.(png|jpg|gif|jpeg|webp|svg)$/,
 use: ["file-loader",
 {
 loader: "image-webpack-loader",
 options: {
 mozjpeg: {
 progressive: true,
 },
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
 },
 },
 ],
 exclude: /node_modules/, //排除 node_modules ⽬录
 },
 ]
 },
 }
```

### 按需加载

很多时候我们不需要⼀次性加载所有的 JS ⽂件，⽽应该在不同阶段去加载所需要的代码。将路由⻚⾯/触发性功能单独打包为⼀个⽂件，使⽤时才加载，好处是 减轻⾸屏渲染的负担 。因为项⽬功能越多其打包体积越⼤，导致⾸屏渲染速度越慢。实际项⽬中⼤部分是对懒加载路由，⽽懒加载路由可以打包到⼀个 chunk ⾥⾯。⽐如某个列表⻚和编辑⻚它们之间存在相互跳转，如果对它们拆分成两个 import() js 资源加载模块，在跳转过程中视图会出现⽩屏切换过程。因为在跳转期间，浏览器会动态创建 script 标签来加载这个 chunk ⽂件，在这期间，⻚⾯是没有任何内容的。所以⼀般会把路由懒加载打包到⼀个 chunk ⾥⾯

```TS
const List = lazyComponent('list', () => import(/* webpackChunkName: "list" */
'@/pages/list'));
const Edit = lazyComponent('edit', () => import(/* webpackChunkName: "list" */
'@/pages/edit'));
```

但需要注意⼀点：动态导⼊ import() ⼀个模块，这个模块就不能再出现被其他模块使⽤同步 import ⽅式导⼊。⽐如，⼀个路由模块在注册 <Route /> 时采⽤动态 import() 导⼊，但在这个模块对外暴露了⼀些变量⽅法供其他⼦模块使⽤，在这些⼦模块中使⽤了同步 ESModule import ⽅式引⼊，这就造成了动态 import() 的失效。

### prload、prefetch

对于某些较⼤的模块，如果点击时再加载，那可能响应的时间反⽽延⻓。我们可以使⽤ prefetch 、 preload 去加载这些模块 prefetch ：将来可能需要⼀些模块资源（⼀般是其他⻚⾯的代码），在核⼼代码加载完成之后 带宽空闲 的时候再去加载需要⽤到的模块代码。preload ：当前核⼼代码加载期间可能需要模块资源（当前⻚⾯需要的但暂时还没使⽤到的），其是和核⼼代码⽂件⼀起去加载的。
只需要通过 魔法注释 即可实现，以 prefetch 为例：

```TS
 document.getElementById('btn1').onclick = function() {import(
 /* webpackChunkName: "btnChunk" /
 * /* webpackPrefetch: true*/'./module1.js'
 ).then(fn => fn.default());
 }
```

这⾏代码表⽰在浏览器空闲时加载 module1.js 模块，并且单独拆⼀个 chunk，叫做 btnChunk 可以看到 ，在 head ⾥⾯，我们的懒加载模块被直接引⼊了，并且加上了 rel='prefetch' 。
这样，⻚⾯⾸次加载的时候，浏览器空闲的会后会提前加载 module1.js 。当我们点击按钮的时候，会直接从缓存中读取该⽂件，因此速度⾮常快。

### 代码分割

在项⽬中，⼀般是使⽤同⼀套技术栈和公共资源。如果每个⻚⾯的代码中都有这些公开资源，就会导致资源的浪费。在每⼀个⻚⾯下都会加载重复的公共资源，⼀是会浪费⽤⼾的流量，⼆是不利于项⽬的性能，造成⻚⾯加载缓慢，影响⽤⼾体验。⼀般是把不变的第三⽅库、⼀些公共模块（⽐如 util.js）这些单独拆成⼀个 chunk，在访问⻚⾯的时候，就可以⼀直使⽤浏览器缓存中的资源 webpack ⾥⾯通过 splitChunks 来分割代码

```javascript
module.exports = {//...
 optimization: {
 splitChunks: {
 chunks: 'async', // 值有 all，async 和 initial
 minSize: 20000, // ⽣成 chunk 的最⼩体积（以 bytes 为单位）。
 minRemainingSize: 0,
 minChunks: 1, // 拆分前必须共享模块的最⼩ chunks 数。
 maxAsyncRequests: 30, // 按需加载时的最⼤并⾏请求数。
 maxInitialRequests: 30, // ⼊⼝点的最⼤并⾏请求数。
enforceSizeThreshold: 50000,
cacheGroups: {
defaultVendors: {
test: /[\/]node_modules[\/]/, //第三⽅模块拆出来
priority: -10,
reuseExistingChunk: true,
},
util.vendors: {
test: /[\/]utils[\/]/, //公共模块拆出来
minChunks: 2,
priority: -20,
reuseExistingChunk: true,
},
},
},
},
};
```

### tree shaking

tree shaking 在⽣产模式下已经默认开启了
只是需要注意下⾯⼏点：

1. 只对 ESM ⽣效
2. 只能是静态声明和引⽤的 ES6 模块，不能是动态引⼊和声明的。
3. 只能处理模块级别，不能处理函数级别的冗余。
4. 只能处理 JS 相关冗余代码，不能处理 CSS 冗余代码。
   ⽽可能样式⽂件⾥⾯有些代码我们也没有使⽤，我们可以通过 purgecss-webpack-plugin 插件来对 css 进⾏ tree shaking

```TS
const path = require("path");
  const PurgecssPlugin = require("purgecss-webpack-plugin");
 const glob = require("glob"); // ⽂件匹配模式module.exports = {//...
 plugins: [
 ...new PurgeCSSPlugin({
 paths: glob.sync(`${PATH.src}/**/*`, { nodir: true }),
 })
 // Add your plugins here// Learn more about plugins from https://webpack.js.org/configuration/plugins/
 ],
 };
```

### gzip

前端除了在打包的时候将⽆⽤的代码或者 console 、注释剔除之外。我们还可以使⽤ Gzip 对资
源进⾏进⼀步压缩。那么浏览器和服务端是如何通信来⽀持 Gzip 呢？

1. 当⽤⼾访问 web 站点的时候，会在 request header 中设置 accept-encoding:gzip ，
   表明浏览器是否⽀持 Gzip 。
2. 服务器在收到请求后，判断如果需要返回 Gzip 压缩后的⽂件那么服务器就会先将我们的
   JS\CSS 等其他资源⽂件进⾏ Gzip 压缩后再传输到客⼾端，同时将 response headers
   设置 content-encoding:gzip 。反之，则返回源⽂件。
3. 浏览器在接收到服务器返回的⽂件后，判断服务端返回的内容是否为压缩过的内容，是的话则进⾏
   解压操作。
   ⼀般情况下我们并不会让服务器实时 Gzip 压缩，⽽是利⽤ webpack 提前将静态资源进⾏ Gzip
   压缩，然后将 Gzip 资源放到服务器，当请求需要的时候直接将 Gzip 资源发送给客⼾端。
   我们只需要安装 compression-webpack-plugin 并在 plugins 配置就可以了

```TS
const CompressionWebpackPlugin = require("compression-webpack-plugin");
module.exports = {
 plugins: [new CompressionWebpackPlugin()
 ]
 }

```

### 作⽤域提升

Scope Hoisting 可以让 webpack 打包出来的代码⽂件体积更⼩，运⾏更快。在开启 Scope Hoisting 后，构建后的代码会按照引⼊顺序放到⼀个函数作⽤域⾥，通过适当重命名某些变量以防⽌变量名冲突，从⽽减少函数声明和内存花销。需要注意： Scope Hoisting 需要分析模块之间的依赖关系，所以源码必须采⽤ ES6 模块化语法
Scope Hoisting 是 webpack 内置功能，只需要在 plugins ⾥⾯使⽤即可，或者直接开启⽣产环境也可以让作⽤域提升⽣效。

```TS
module.exports = {
  //⽅式1
 mode: 'production',
 //⽅式2
 plugins: [// 开启 Scope Hoisting 功能new
webpack.optimize.ModuleConcatenationPlugin()
 ]
 }

```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)