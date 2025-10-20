## 说说你对 fetch 的理解，它有哪些优点和不足？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)


## 回答重点

Fetch 是一个现代的网络请求 API，用于在浏览器中发起 HTTP 请求。它是 XMLHttpRequest 的升级版，提供了更简洁和强大的接口，并且原生支持 HTTP/2 的一些特性。

### 1）优点

原生支持 Promise：fetch 基于 Promise 实现，支持链式调用和 async/await 语法，让异步请求的处理更加优雅。

请求和响应对象：提供了 Request 和 Response 对象，让开发者能更灵活地处理请求和响应。

支持 HTTP/2 流式处理：可以通过 Response.body 获取到原始的响应流，这使得它能够支持类似 ChatGPT 这样的大语言模型的流式响应，实现打字机效果的实时输出。这是 XMLHttpRequest 所不具备的能力。

### 2）不足

不会自动携带 cookie：默认情况下，fetch 不会发送 cookie，需要手动设置 credentials 选项。

无法原生取消请求：fetch 本身不提供中断请求的方法，需要借助 AbortController 实现。

无法原生监控请求进度：fetch 不能直接获取请求的进度信息，这在上传大文件时可能会有影响。

## 扩展知识

### 1）基本用法示例

最简单的 GET 请求：

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

POST 请求示例：

```javascript
fetch('https://api.example.com/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'John' })
})
```

### 2）常用配置项

credentials：控制请求是否携带 cookie

- omit：默认值，不发送
- same-origin：同源请求时发送
- include：总是发送

mode：请求的模式

- cors：默认值，允许跨域请求
- no-cors：只允许简单请求
- same-origin：只允许同源请求

### 3）错误处理注意事项

fetch 只有在网络请求失败时才会 reject，HTTP 错误状态（如 404、500）不会导致 Promise 进入 rejected 状态。因此需要手动检查 response.ok：

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
```

### 4）取消请求

使用 AbortController 取消请求：

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch('https://api.example.com/data', { signal })
  .then(response => response.json())
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    }
  });

// 取消请求
controller.abort();
```

### 5）超时处理

fetch 本身不提供超时功能，可以通过 Promise.race 实现：

```javascript
const timeout = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), time);
  });
};

Promise.race([
  fetch('https://api.example.com/data'),
  timeout(5000)
]);
```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)