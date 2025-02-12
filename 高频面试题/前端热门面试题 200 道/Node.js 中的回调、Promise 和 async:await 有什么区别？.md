## Node.js 中的回调、Promise 和 async:await 有什么区别？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
回调、Promise 和 async/await 是在Node.js中处理异步操作的三种不同方式。它们的区别主要体现在编码风格、可读性和处理错误的方式上。

1）**回调（Callback）**：
回调是最基本的异步处理方式。这种方式需要将一个函数作为参数传递给另一个函数，并在异步操作完成后调用这个回调函数。回调函数容易造成“回调地狱”，使得代码难以阅读和维护。

2）**Promise**：
Promise 是对回调的改进，是一种更现代的异步处理方式。它表示一个未来将完成的异步操作（resolved）或失败的操作（rejected）。Promise 可以链式调用，解决了回调地狱的问题，并提供了更清晰的错误处理机制。

3）**async/await**：
async/await 是基于 Promise 的语法糖，提供了更加直观和同步风格的编码体验。使用 async/await 可以让异步代码看起来像是同步代码，从而提高代码的可读性和可维护性。错误处理也更加简单，直接使用 try/catch 语句即可。

## 扩展知识
1）**回调详解**：
    - 在 Node.js 中，回调函数非常常见，如下例所示：
    ```javascript
    const fs = require('fs');
    fs.readFile('example.txt', 'utf8', (err, data) => {
        if (err) throw err;
        console.log(data);
    });
    ```
    - 回调函数虽然简单，但容易形成嵌套层次过多的回调地狱：
    ```javascript
    asyncOperation1(() => {
        asyncOperation2(() => {
            asyncOperation3(() => {
                // ...
            });
        });
    });
    ```

2）**Promise详解**：
    - Promise 构造器接收一个执行器函数（executor），该函数包含 resolve 和 reject 两个参数，通过它们来处理成功和失败的情况：
    ```javascript
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Success!');
        }, 1000);
    });
    
    promise.then(result => console.log(result))
           .catch(error => console.error(error));
    ```
    - Promise 可以链式调用，避免了深层嵌套：
    ```javascript
    asyncOperation1()
        .then(result1 => asyncOperation2(result1))
        .then(result2 => asyncOperation3(result2))
        .catch(err => console.error(err));
    ```

3）**async/await详解**：
    - async 函数返回一个 Promise，对应的 await 表达式暂停执行，直到Promise 被解决（resolved）：
    ```javascript
    async function fetchData() {
        try {
            const data = await fs.promises.readFile('example.txt', 'utf8');
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    }
    fetchData();
    ```
    - async/await 让异步代码看起来像是同步代码，从而提高了可读性：
    ```javascript
    async function processOperations() {
        try {
            const result1 = await asyncOperation1();
            const result2 = await asyncOperation2(result1);
            const result3 = await asyncOperation3(result2);
            // ...
        } catch (err) {
            console.error(err);
        }
    }
    processOperations();
    ```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)