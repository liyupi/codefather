## 如何在 Node.js 中创建一个简单的 HTTP 服务器？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
在 Node.js 中创建一个简单的 HTTP 服务器，你可以使用内置的 `http` 模块。具体步骤如下：

1）首先，引入 `http` 模块：
```javascript
const http = require('http');
```

2）接着，创建一个服务器并定义请求处理逻辑：
```javascript
const server = http.createServer((req, res) => {
  res.statusCode = 200; // 设置 HTTP 状态码为 200 (成功)
  res.setHeader('Content-Type', 'text/plain'); // 设置响应头
  res.end('Hello, World!\n'); // 设置响应体
});
```

3）最后，选择一个端口监听：
```javascript
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

这样，你就创建了一个在端口 3000 上运行、处理 GET 请求并返回“Hello, World!”字符串的简单 HTTP 服务器。

## 扩展知识
创建一个简单的 HTTP 服务器是 Node.js 的基本用法之一，接下来我来扩展一些更深入的知识点。

1）**更复杂的路由处理**：
你可以使用 `url` 模块解析请求路径，根据不同路径返回不同的内容。示例如下：
```javascript
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === '/about') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('About Page\n');
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found\n');
  }
});
```

2）**使用第三方模块（如 Express）**：
对于复杂的应用程序，手动编写路由和处理请求会变得繁琐。可以使用 `Express` 框架简化开发工作，代码如下：
```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/about', (req, res) => {
  res.send('About Page');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```
`Express` 提供了更高层次的抽象，极大程度简化了路由和中间件的管理。

3）**错误处理**：
在生产环境中，需要更全面的错误处理。你可以为 `server` 实例添加错误事件监听器：
```javascript
server.on('error', (err) => {
  console.error(`Server encountered an error: ${err.message}`);
});
```

4）**性能优化**：
对于高并发的 HTTP 请求，可以启用 Node.js 的集群（Cluster）模块，从而利用多核 CPU 性能：
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Worker进程共享同一个TCP连接
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!\n');
  });

  server.listen(3000);
}
```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)