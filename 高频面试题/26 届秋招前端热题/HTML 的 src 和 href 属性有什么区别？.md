## HTML 的 src 和 href 属性有什么区别？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

- src（source，来源） 属性的作用是 **指定要加载的资源路径**，常出现于 `<script>`、`<img>`、`<audio>`、`<video>` 和 `<iframe>` 等标签中，用于加载 JavaScript 脚本、图像、音频、视频或嵌入的网页文件。
- href （hyperlink reference，超链接引用）属性的作用是 **指定超链接的目标地址**或定义文档与外部资源的关联，主要用在 `<a>`、`<link>`、`<area>` 等标签中。例如，当你创建一个超链接 `<a>` 时，需要用 href 属性指定用户点击后跳转的目标 URL；或者当你在文档头部使用 `<link>` 标签引入外部样式表时，也是使用 href 属性来指定样式表的地址。

除了作用的不同之外，**资源加载方式**也有差异：

- 当浏览器解析到适用于 src 属性的标签（比如 `<script>` ）时，会暂停其他资源的下载和处理，直到将该资源加载、编译（如果是 JavaScript）、执⾏（如果是脚本）完成。**这种方式称为阻塞加载**，所以⼀般建议将 JavaScript 脚本放在页面底部。（这里要注意仅指的是脚本，像 `<img>` 图片加载和渲染是异步的，不会阻塞 HTML 的解析 ）
- 当浏览器识别到适用于 href 属性的标签（比如 `<a>` 和 `<link>`）时，会并⾏下载资源，不会停⽌对当前⽂档的处理。**这种方式称为非阻塞加载**，浏览器可以同时处理超链接或引入样式表。

## 扩展知识

### src 加载机制

**触发立即加载：** 浏览器在解析到带有 `src` 属性的元素时，会立即向指定 URL 发送请求。

**阻塞情况：**
 - **阻塞行为：** 对于 `<script>`，如果没有加 `async` 或 `defer` 属性，浏览器会暂停 HTML 的解析，等待脚本加载并执行完成。
 - **非阻塞行为：** 对于 `<img>` 和 `<iframe>`，资源加载是异步的，不会阻塞页面解析。

### href 加载机制
 
**资源引用：** 浏览器解析到 `href` 时，标记该资源为外部引用，不会立即加载到页面中。
 
**延迟加载：** 对于 `<a>` 标签，用户点击链接后，才会触发页面跳转。

**预加载情况：** 对于 `<link rel="stylesheet">`，浏览器会解析 CSS 并应用到页面中，可能会延迟页面的渲染（Render Blocking）。

### src 的性能优化

**异步加载脚本：**
 - 使用 `async` 属性让脚本与 HTML 解析并行加载，加载完成后立即执行。
 - 使用 `defer` 属性让脚本与 HTML 解析并行加载，但执行顺序与页面解析顺序一致，且在解析完成后才执行。

**图片懒加载：**
 - 添加 `loading="lazy"` 属性，延迟加载不在视口范围内的图片。

**CDN 优化：**
 - 将常用的脚本（如 jQuery、FontAwesome）存储在 CDN 上，提高加载速度。

**资源压缩：**
 - 对图像资源使用更高效的格式（如 WebP）。
 - 对脚本资源进行压缩和丑化（Minification）。

### href 的性能优化

**预加载关键资源：**
 - 使用 `<link rel="preload" href="style.css" as="style">` 指定关键资源，提高页面加载速度。

**防止阻塞渲染：**
 - 将非关键 CSS 文件标记为延迟加载，例如：`<link rel="stylesheet" href="style.css" media="print" onload="this.media='all';">`。

**动态加载：**
 - 使用 JavaScript 动态创建 `<link>` 标签以加载非必要资源。

### 错误处理机制

**`src` 错误处理：** 如果资源未找到（如 404 错误），可能导致功能或显示异常（如图片不显示、脚本无法执行）。
 
 **解决方法：**

1）图片加载失败时设置替代图片：
   ```html
   <img src="invalid.jpg" onerror="this.src='fallback.jpg';" />
   ```

2）脚本加载失败时处理错误：
   ```javascript
   const script = document.createElement('script');
   script.src = 'invalid.js';
   script.onerror = () => console.error('Script failed to load.');
   document.head.appendChild(script);
   ```

**`href` 错误处理：** 超链接地址错误时，点击链接可能会跳转到错误页面或返回 404 页面。

**解决方法：**
 - 提供用户友好的 404 页面，提示用户返回首页或重试。
 - 在导航中动态检查链接有效性。




> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)