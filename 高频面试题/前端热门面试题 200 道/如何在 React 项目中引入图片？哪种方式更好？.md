## 如何在 React 项目中引入图片？哪种方式更好？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)



## 回答重点

在 React 项目中引入图片主要有以下几种方式：

### 1）import 导入

适用于项目内的静态图片资源：

```javascript
import logo from './images/logo.png'

function Header() {
  return <img src={logo} alt="logo" />
}
```

### 2）require 方式

适用于动态导入图片：

```javascript
function Avatar() {
  const avatar = require('./images/avatar.png')
  return <img src={avatar} alt="avatar" />
}
```

### 3）public 文件夹

适用于不需要经过打包处理的静态资源：

```javascript
function Banner() {
  return <img src="/images/banner.png" alt="banner" />
}
```

## 扩展知识

### 1）各种方式的区别

import 方式：
1）在编译时会将图片转换为 base64 或单独文件
2）支持 Tree Shaking
3）可以获得 TypeScript 类型提示
4）webpack 会自动处理图片的 hash 和版本

require 方式：
1）运行时动态加载
2）可以根据条件动态引入不同图片
3）不支持 Tree Shaking
4）没有类型提示

public 文件夹：
1）图片直接通过 URL 访问
2）不会被打包和优化
3）适合较大的图片资源
4）便于 CDN 部署

### 2）图片优化建议

1）小图片使用 import 方式
建议将小于 10KB 的图片通过 import 引入，webpack 会自动将其转为 base64，减少 HTTP 请求。

2）大图片使用 public 文件夹
大于 100KB 的图片建议放在 public 文件夹，便于 CDN 分发和浏览器缓存。

3）动态图片使用 require
当图片路径需要动态生成时，使用 require 方式更合适。

### 3）webpack 配置优化

可以通过配置 webpack 来优化图片加载：

```javascript
module: {
  rules: [
    {
      test: /\.(png|jpg|gif)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'static/media/[name].[hash:8].[ext]'
          }
        }
      ]
    }
  ]
}
```

### 4）现代图片格式支持

1）使用 WebP 格式

```javascript
<picture>
  <source srcSet={logo.webp} type="image/webp" />
  <img src={logo.png} alt="logo" />
</picture>
```

2）响应式图片

```javascript
<img 
  src={smallImage} 
  srcSet={`${largeImage} 2x`}
  alt="responsive" 
/>
```

### 5）最佳实践

1）根据图片大小选择合适的引入方式
2）使用现代图片格式如 WebP
3）配置适当的图片压缩和优化
4）考虑使用懒加载提升性能
5）为图片设置合适的尺寸，避免布局偏移

相关文档：
<https://zh-hans.react.dev/learn/assets-in-create-react-app>
<https://create-react-app.dev/docs/adding-images-fonts-and-files>



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)