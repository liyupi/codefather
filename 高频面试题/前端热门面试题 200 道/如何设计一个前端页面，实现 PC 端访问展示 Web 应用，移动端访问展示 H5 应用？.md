## 如何设计一个前端页面，实现 PC 端访问展示 Web 应用，移动端访问展示 H5 应用？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
设计一个前端页面，实现 PC 端访问展示 Web 应用，移动端访问展示 H5 应用，主要有以下关键步骤：

1）用户设备检测：可以通过 User-Agent 来检测用户的设备类型（PC 或移动设备）。

2）页面跳转：根据设备类型，跳转到相应的页面（Web 应用或 H5 应用）。

实现代码示例如下：

```javascript
window.onload = function() {
    var userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) {
        // 如果检测到是移动设备
        window.location.href = "https://m.example.com";
    } else {
        // 如果检测到是PC设备
        window.location.href = "https://www.example.com";
    }
};
```

## 扩展知识
这个问题其实涉及到了响应式设计和多端适配技术，下面我会进一步展开讲一讲：

1）User-Agent 检测：
   - User-Agent 是一个以字符串形式存在的标识，由浏览器发送给服务器，用来标识客户访问的设备和浏览器类型。合理利用 User-Agent 可以有效地检测用户的设备类型。
   - 然而，User-Agent 字符串并不是一成不变的，很多浏览器修改了默认的 User-Agent，因此在设备检测时也会面对不准确的情况。

2）响应式 Web 设计（RWD）：
   - 响应式设计是指能够根据屏幕大小动态调整布局的设计方法。主要通过 CSS 媒体查询（@media rules）实现。例如：
   
```css
/* 针对大屏幕设备 */
@media (min-width: 1024px) {
    .container {
        width: 80%;
    }
}

/* 针对小屏幕设备 */
@media (max-width: 1024px) {
    .container {
        width: 100%;
    }
}
```
   - 这样可以让同一套代码适配不同屏幕大小，而无需做页面跳转。

3）前后端分离设计：
   - 前后端分离设计是一种现代 Web 开发思想，强调前端页面和后端服务之间的独立性。通过 URL 跳转并不难实现 PC 端和移动端页面分离，重点在于如何维护和运维不同终端的页面。可以采用相同的 API 但不同的前端代码库。

4）动态加载和多端支持：
   - 现代 Web 开发常使用一些框架，如 React、Vue，可以通过模块化方式，实现 PC 和移动端不同组件的动态加载。这减少了代码重复，也提高了维护性。

5）渐进式 Web 应用（PWA）：
   - PWA 使得 Web 应用拥有类似于原生应用的体验。对于移动端用户，可以通过使用 Service Worker 等技术提供离线访问能力。可以通过检测用户设备类型和网络状态，灵活地为用户提供 Web 或 H5 应用。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)