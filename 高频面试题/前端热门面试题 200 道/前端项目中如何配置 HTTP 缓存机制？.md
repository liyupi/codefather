## 前端项目中如何配置 HTTP 缓存机制？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

前端项目配置 HTTP 缓存主要从两个方面入手：

1）服务端配置响应头：

- Cache-Control
- ETag
- Last-Modified

2）前端资源处理：

- 文件名 Hash 化
- 合理划分缓存策略
- 配置不同资源类型的缓存时间

## 扩展知识

### 1）HTTP 缓存类型

1）强缓存：

```bash
Cache-Control: max-age=31536000
Cache-Control: no-cache
Cache-Control: no-store
Cache-Control: private
Cache-Control: public
```

2）协商缓存：

```bash
ETag/If-None-Match
Last-Modified/If-Modified-Since
```

### 2）Nginx 配置示例

1）静态资源配置：

```bash 
location /static/ {
    expires 1y;
    add_header Cache-Control "public, no-transform";
}
```

2）HTML 文件配置：

```bash
location / {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

3）接口配置： 

```bash
location /api/ {
    add_header Cache-Control "no-cache";
    add_header ETag "";
}
```

### 3）资源文件处理

1）webpack 配置：

- 使用 contenthash
- 提取公共代码
- 配置长期缓存

2）示例配置：

```javascript
output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js'
}
```

### 4）缓存策略制定

1）HTML 文件：

- 不缓存或短期缓存
- 配置协商缓存
- 及时更新

2）静态资源：

- JavaScript 文件使用长期缓存
- CSS 文件使用长期缓存
- 图片等媒体文件使用长期缓存

3）API 接口：

- 动态数据不缓存
- 半动态数据使用协商缓存
- 静态数据使用强缓存

### 5）常见问题处理

1）版本更新：

- 使用版本号
- 清理缓存
- 强制刷新

2）缓存清理：

- 使用 CDN 刷新
- 更新文件名
- 使用 Service Worker

3）调试方案：

- 禁用缓存
- 使用隐身模式
- 手动清理缓存

### 6）最佳实践

1）资源分类：

- 经常变动的资源
- 不经常变动的资源
- 永久不变的资源

2）缓存时间：

- HTML：协商缓存
- JS/CSS：1 年或更长
- 图片：1 年或更长
- 字体：1年或更长

3）更新策略：

- 文件名 Hash 化
- 使用 CDN
- 合理的缓存清理机制

通过合理配置 HTTP 缓存，可以显著提升网站性能和用户体验。记住要根据实际业务场景和资源特点，制定合适的缓存策略。同时要注意在开发环境和生产环境使用不同的缓存配置。


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)