## 如何使用 webpack-dev-server 监控文件编译？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

使用 webpack-dev-server 监控文件编译可以实现实时更新和自动重新加载，大大提高开发效率。以下是设置和使用 webpack-dev-server 的基本步骤：

1） 安装 webpack-dev-server：在项目中安装 webpack-dev-server。

```bash
npm install webpack-dev-server --save-dev
```

2） 配置 webpack-dev-server：在 webpack.config.js 中配置 devServer 选项。

```javascript
module.exports = {
    // ... 其他配置
    devServer: {
        contentBase: './dist', // 指定静态文件目录
        compress: true, // 启用 gzip 压缩
        port: 3000, // 指定端口
        hot: true, // 启用热模块替换
        open: true, // 自动打开浏览器
    },
};
```

3） 启动服务：在 package.json 的 scripts 中添加启动命令。

```json
"scripts": {
    "start": "webpack serve"
}
```

然后在终端运行以下命令：

```bash
npm start
```

## 扩展知识

### 1） 热模块替换（HMR）

热模块替换是 webpack-dev-server 的一个强大特性，可以在不重新加载整个页面的情况下，替换已修改的模块。要启用 HMR，需要在 webpack.config.js 中设置 `hot: true`，并在入口文件中引入 HMR 相关代码：

```javascript
if (module.hot) {
    module.hot.accept('./module.js', function () {
        // 处理模块更新
    });
}
```

### 2）Source map
   - 在开发模式下使用 Source map 有助于调试，从而可以在浏览器调试工具中查看原始代码。你可以在 webpack 配置中添加 `devtool: 'inline-source-map'` 以启用 Source map。

### 3）文件监控
   - webpack-dev-server 默认监控文件变化，并使用文件系统事件通知重新编译。对于特定场景（如网络文件存储或自定义文件监控），你还可以手动配置 watchOptions：

   ```javascript
   devServer: {
     watchOptions: {
       poll: 1000,  // 每秒检查一次变更
       ignored: /node_modules/  // 忽略 node_modules 中的文件
     }
   }
   ```

### 4） 配置代理

在开发过程中，如果需要调用后端 API，可以配置代理，以避免跨域问题：

```javascript
devServer: {
    proxy: {
        '/api': 'http://localhost:5000', // 将/api的请求转发到后端服务
    },
}
```

### 4） 日志输出

webpack-dev-server 默认会在控制台输出编译信息和错误。如果需要更详细的日志，可以在配置中设置 clientLogLevel。

```javascript
devServer: {
    clientLogLevel: 'info', // 其他可选值: 'warning', 'error'
}
```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)