## 如何在 Node.js 中处理 HTTP 请求的路由？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
在Node.js中处理HTTP请求的路由，我推荐使用Express.js，这是一个基于Node.js的极简灵活的Web开发框架。Express.js提供了强大的路由功能，可以快速地实现HTTP请求的处理。

你可以按照以下步骤来实现：

1）安装Express.js：
   ```
   npm install express
   ```

2）创建一个基础的Express应用：
   ```javascript
   const express = require('express');
   const app = express();
   const port = 3000;
   
   app.get('/', (req, res) => {
     res.send('Hello World!');
   });
   
   app.listen(port, () => {
     console.log(`Example app listening at http://localhost:${port}`);
   });
   ```

3）处理不同的HTTP请求方法和路径：
   ```javascript
   app.get('/hello', (req, res) => {
     res.send('GET request to /hello');
   });

   app.post('/hello', (req, res) => {
     res.send('POST request to /hello');
   });

   app.put('/hello', (req, res) => {
     res.send('PUT request to /hello');
   });

   app.delete('/hello', (req, res) => {
     res.send('DELETE request to /hello');
   });
   ```

这样，一个简单的Express.js应用就搭建好了，并可以处理不同路径和方法的HTTP请求了。

## 扩展知识
除了基础的路由功能，Express.js还提供了很多先进的特性和中间件，使得开发变得非常方便和高效。

1）路由参数：
   ```javascript
   app.get('/user/:id', (req, res) => {
     res.send(`User ID is ${req.params.id}`);
   });
   ```
   通过这种方式，你可以在路径中传递参数，并通过`req.params`获取。

2）中间件：
   中间件是Express.js强大功能的基石。它们可以处理请求中的数据、记录日志、执行验证等。
   ```javascript
   // 定义一个简单的中间件
   const myLogger = (req, res, next) => {
     console.log('LOGGED');
     next();
   };

   // 使用中间件
   app.use(myLogger);

   app.get('/', (req, res) => {
     res.send('Hello World!');
   });
   ```

3）处理静态文件：
   Express.js可以很容易地服务静态文件，比如HTML、CSS、JavaScript等。
   ```javascript
   app.use(express.static('public'));
   ```
   通过这种方式，位于`public`目录下的静态文件就可以直接通过URL访问了。

4）路由模块化：
   随着应用规模扩大，将路由拆分到不同的文件和模块中，有助于代码的组织和维护。
   ```javascript
   const userRouter = require('./routes/user');
   app.use('/user', userRouter);
   ```
   在routes/user.js中：
   ```javascript
   const express = require('express');
   const router = express.Router();

   router.get('/:id', (req, res) => {
     res.send(`User ID is ${req.params.id}`);
   });

   module.exports = router;
   ```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)