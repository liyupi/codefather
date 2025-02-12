## Core Web Vitals 是什么？它包括哪些指标？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

Core Web Vitals 是 Google 提出的核心网页指标，用于衡量网站的用户体验，包含三个关键指标：

### 1）LCP（Largest Contentful Paint）

最大内容渲染时间，衡量加载性能，优秀值应在 2.5 秒内完成，超过 4.0 秒则需要改进。

### 2）INP（Interaction to Next Paint）

交互后下一帧绘制时间，衡量互动性，优秀值应在 200 毫秒内，超过 500 毫秒则需要改进。

### 3）CLS（Cumulative Layout Shift）

累积布局偏移，衡量视觉稳定性，优秀值应保持在 0.1 以内，超过 0.25 则需要改进。

## 扩展知识

### 1）指标评分标准

1）LCP 评分标准：

- 优秀：≤ 2.5 秒
- 需要改进：2.5 秒 - 4.0 秒
- 差：> 4.0 秒

2）INP 评分标准：

- 优秀：≤ 200 毫秒
- 需要改进：200 - 500 毫秒
- 差：> 500 毫秒

3）CLS 评分标准：

- 优秀：≤ 0.1
- 需要改进：0.1 - 0.25
- 差：> 0.25

### 2）优化建议

1）LCP 优化：

- 优化服务器响应速度
- 实施资源预加载
- 优化图片加载
- 使用 CDN 加速

2）INP 优化：

- 减少主线程阻塞
- 优化事件处理程序
- 使用防抖和节流
- 优化 JavaScript 执行效率

3）CLS 优化：

- 为图片和视频元素预设尺寸
- 避免在已有内容上方插入新内容
- 使用固定的容器尺寸
- 合理预留广告位置

### 3）监控方法

1）使用工具监控：

- Chrome DevTools
- Google Search Console
- PageSpeed Insights
- Lighthouse

2）代码实现监控：

```javascript
// 使用 web-vitals 库监控
import {getLCP, getCLS, getINP} from 'web-vitals';

// 监控 LCP
getLCP(console.log);
// 监控 CLS
getCLS(console.log);
// 监控 INP
getINP(console.log);
```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)