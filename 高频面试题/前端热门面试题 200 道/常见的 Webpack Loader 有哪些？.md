## 常见的 Webpack Loader 有哪些？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

Webpack Loader 是一种转换器，用于将不同类型的文件转换为可以被 Webpack 处理的模块。常见的 Webpack Loader 有以下几种：

1）babel-loader：

用于将 ES6+ 代码转换为向后兼容的 JavaScript 代码，以支持旧版浏览器。

2）css-loader 和 style-loader：

css-loader：解析 CSS 文件中的 @import 和 url()，并将其转换为模块；style-loader：将 CSS 注入到 DOM 中的 style 标签中。这两个 loader 在项目中通常会同时进行使用。

3）file-loader：

用于处理文件（如图片、字体等），并将这些文件发送到输出目录，返回文件的 URL。

4）url-loader：

类似于 file-loader，但在文件小于设定的字节限制时，返回 base64 编码的 Data URL。

5）sass-loader：

用于将 Sass/SCSS 文件编译为 CSS 文件。

6）ts-loader：

用于将 TypeScript 代码转换为 JavaScript。

## 扩展知识

### 1）配置示例：

典型的 Webpack 配置中，Loaders 是通过 module.rules 配置的。例如：

```javascript
module.exports = {
module: {
 rules: [
   {
     test: /\.js$/,
     exclude: /node_modules/,
     use: 'babel-loader',
   },
   {
     test: /\.css$/,
     use: ['style-loader', 'css-loader'],
   },
   {
     test: /\.(png|jpg|gif)$/,
     use: [
       {
         loader: 'file-loader',
         options: {
           name: '[name].[hash].[ext]',
           outputPath: 'images/',
         },
       },
     ],
   },
 ],
},
};
```

### 2）其他常见 Loaders：

less-loader：用于将 Less 文件编译为 CSS。
vue-loader：用于处理 Vue 单文件组件。
html-loader：用于导入 HTML 文件，并将其中的资源作为依赖处理。

### 3）Loader 的工作原理：

Loaders 可以链式调用，从右到左顺序执行，每个 Loader 接受前一个 Loader 的处理结果作为输入。

### 4）自定义 Loader：

Webpack 允许开发者编写自定义 Loader，以满足特定的处理需求，比如这个 loader 的功能是将所有的字符串转换为大写。


```ts
module.exports = function(source) {
  // source 是输入的文件内容
  return source.replace(/["'](.*?)["']/g, function(match) {
    // 将引号内的内容转换为大写
    return match.toUpperCase();
  });
};
```

在 Webpack 配置文件中使用这个 loader:

```ts
module.exports = {
  // ...其他配置
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve('./uppercase-loader.js')
          }
        ]
      }
    ]
  }
};
```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)