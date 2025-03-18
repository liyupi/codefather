## 如何使用 Webpack 解决开发环境中的跨域问题？

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

使用 Webpack 解决开发环境中的跨域问题，通常采用代理配置。具体步骤如下：

1） 安装 Webpack 及相关依赖

确保已经安装了 Webpack 和 Webpack Dev Server：

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server
```

2） 配置 Webpack Dev Server

在 Webpack 配置文件（`webpack.config.js`）中，添加 devServer 选项，设置代理：

```javascript
const path = require("path");

module.exports = {
  // 其他配置...
  devServer: {
    contentBase: path.join(__dirname, "dist"), // 静态文件目录
    compress: true,
    port: 9000,
    proxy: {
      "/api": {
        target: "http://your-api-server.com", // 目标 API 服务器
        changeOrigin: true,
        pathRewrite: { "^/api": "" }, // 可选：重写路径
      },
    },
  },
};
```

3） 启动开发服务器

在命令行中使用以下命令启动 Webpack Dev Server：

```bash
npx webpack serve
```

4） 访问 API

在代码中，通过代理路径访问 API，例如：

```javascript
fetch("/api/endpoint")
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## 扩展知识

### 代理配置参数说明

- target：指定要代理的目标服务器的 URL。
- changeOrigin：是否更改请求的 Origin 头部，通常设置为 true，以避免 CORS 问题。
- pathRewrite：可选，用于重写请求路径。

### CORS 和代理的区别

CORS（跨域资源共享）是浏览器的安全特性，限制不同源之间的请求。通过服务器设置响应头来解决跨域问题。

使用代理是为了在开发环境中方便调试，Webpack 代理通过转发请求到目标服务器，避免浏览器的 CORS 限制。

### 其他解决方案

1）CORS（跨域资源共享）：这是后端解决跨域问题的一种常用方式，通过设置 HTTP 头部的字段 Access-Control-Allow-Origin。然而，这种方式需要后端进行配置，某些场景下可能无法修改后端代码。

2）JSONP：一种通过动态创建 `<script>` 标签来实现的跨域请求方法，不过它只适用于 GET 请求。

3）

```
Access-Control-Allow-Origin: *
```

> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)
