## 如何使用 Webpack 和 LocalStorage 实现静态资源的离线缓存？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

使用 Webpack 和 LocalStorage 实现静态资源的离线缓存，通常结合 **Service Worker** + **LocalStorage**。主要流程如下：

1） 配置 Webpack 打包 Service Worker：通过 Webpack 配置，让项目支持 Service Worker，拦截网络请求，缓存静态资源。

2） 使用 Service Worker 缓存资源：Service Worker 会监听用户的网络请求，将资源缓存到浏览器，离线状态下可直接从缓存读取资源。

3） 结合 LocalStorage 存储数据：LocalStorage 存储少量的应用数据，如用户配置、上次访问时间等，保证在离线时也能获取这些数据。

以下是实现离线缓存的步骤。

## 扩展知识

### 1） 配置 Webpack 打包 Service Worker

使用 `workbox-webpack-plugin` 插件，它能够自动生成 Service Worker 脚本，用于处理静态资源的缓存。以下是 Webpack 配置示例：

```javascript
const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: './src/index.js', // 入口文件
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        // Workbox 插件自动生成 Service Worker
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        }),
    ],
};
```

这个配置会自动生成一个 Service Worker 文件，负责缓存项目的静态资源。

### 2） 在项目中注册 Service Worker

在主 JavaScript 文件中注册 Service Worker：

```javascript
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log(
                    'ServiceWorker registration successful:',
                    registration
                );
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
```

这个脚本确保浏览器在支持 Service Worker 时会注册并启用离线缓存功能。

### 3） 使用 Service Worker 缓存资源

默认情况下，Workbox 会缓存所有 Webpack 输出的静态资源。如果你想更具体地控制缓存策略，比如为 API 请求、图片或其他资源设置不同的缓存规则，可以手动配置 Workbox。例如：

```javascript
new WorkboxPlugin.GenerateSW({
    runtimeCaching: [
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg)$/, // 匹配图片资源
            handler: 'CacheFirst', // 优先从缓存加载，缓存没有时再从网络获取
        },
        {
            urlPattern: new RegExp('/api/'), // 匹配 API 请求
            handler: 'NetworkFirst', // 优先从网络获取，失败时再从缓存获取
        },
    ],
});
```

### 4） 结合 LocalStorage 实现数据缓存

除了静态资源，LocalStorage 可以用于存储小型数据，例如用户设置或某些接口返回的数据。示例代码：

```javascript
// 保存数据到 LocalStorage
function saveDataToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// 从 LocalStorage 读取数据
function loadDataFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// 示例：缓存用户设置
const userSettings = {
    theme: 'dark',
    fontSize: '16px',
};
saveDataToLocalStorage('settings', userSettings);

// 离线时读取用户设置
const cachedSettings = loadDataFromLocalStorage('settings');
if (cachedSettings) {
    console.log('Loaded settings from cache:', cachedSettings);
}
```

### 5） 离线访问时的结合使用

通过 Service Worker，可以实现静态资源的离线缓存，保证用户在离线状态下依然可以访问网页。与此同时，LocalStorage 可以用于保存用户交互数据，例如表单数据、用户偏好等。在离线时，从 LocalStorage 获取这些数据，确保应用能继续运行。

### 6） 注意事项

-   **LocalStorage 限制**：LocalStorage 通常限制为 5-10MB，不适合大文件的存储。大文件资源应该通过 IndexedDB 或直接由 Service Worker 进行缓存。
-   **Service Worker 生命周期**：Service Worker 在后台运行，可能在浏览器关闭后仍然执行任务，确保缓存策略正确以免占用过多空间或造成不必要的请求。

通过 Webpack 的静态资源打包结合 Service Worker 和 LocalStorage，能够显著提升应用的离线体验。


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)