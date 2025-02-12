## 如何检测 CSS 动画的 FPS 值？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
检测 CSS 动画的 FPS（帧率）值，即每秒呈现的帧数，可以通过 JavaScript 与 `requestAnimationFrame` 方法配合相应的时间计算来实现。基本思路是每帧动画时记录当前时间，并通过时间差计算帧率。核心代码如下：

```javascript
let lastTime = performance.now();
let frameCount = 0;

function measureFPS() {
    let currentTime = performance.now();
    frameCount++;
    
    if (currentTime - lastTime >= 1000) {  // 每秒统计一次
        let fps = frameCount;
        console.log(`FPS: ${fps}`);
        frameCount = 0;
        lastTime = currentTime;
    }
    
    requestAnimationFrame(measureFPS);
}

requestAnimationFrame(measureFPS);
```

这个代码实现了一个实时的 FPS 监测，每秒钟计算一次 FPS 并打印到控制台。

## 扩展知识
这个问题涉及一些关于前端动画性能优化的知识点，我可以进一步讲解几个重要的方面：

1）**requestAnimationFrame 方法**：这是一个用于告知浏览器你希望执行动画并请求浏览器在下一次重绘之前调用指定的回调函数的方法。与传统的 `setInterval` 不同，`requestAnimationFrame` 能够更智能地优化动画效果，使其更加流畅。浏览器会根据自身的刷新频率（通常是60Hz）来调用这个函数，让动画帧率更加稳定。

2）**性能检测工具**：除手写 FPS 检测代码外，许多浏览器自带开发者工具也可以帮助检测动画性能。例如，Chrome 开发者工具的 "Performance" 标签，Safari 的 "Timelines" 标签，这些工具可以记录并分析动画执行情况，显示 CPU 使用率和 FPS。

3）**资源优化技巧**：
- **CSS3硬件加速**：通过使用 `transform`、`opacity` 等属性代替 `top`、`left` 可以显著提升动画性能，因为前者可以利用 GPU 进行硬件加速。
- **减少重排和重绘**：保证动画过程中不会频繁触发布局（重排）和绘制（重绘），这可以通过精简 DOM 结构和避免昂贵的样式计算来实现。
- **动画特效库**：使用专门为高性能设计的动画库如 `GSAP`、`Three.js` 也能进一步优化动画的流畅度和性能，很多库都内建了高效的动画管理机制。

4）**现代 Web API**：
- **Intersection Observer**：对于涉及视窗内外切换的动画，可以通过 Intersection Observer 来监测 DOM 元素是否在视窗内，来基于元素可见性动态控制动画的开启与关闭。
- **Web Animations API**：提供了更强大、细粒度的动画控制，对于创建复杂的动画效果，可以更方便地使用并优化动画性能。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)