## React Router 中的 Router 组件有几种类型？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

在 React Router 中主要有以下几种类型的 Router 组件：

### 1）BrowserRouter

使用 HTML5 的 history API 实现路由，适用于现代浏览器，提供干净的 URL：

```jsx
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 2）HashRouter

使用 URL 的 hash 部分（#）来实现路由，适用于不支持 HTML5 history API 的旧版浏览器：

```jsx
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
```

### 3）MemoryRouter

将历史记录保存在内存中，适用于测试和非浏览器环境（如 React Native）：

```jsx
import { MemoryRouter } from 'react-router-dom';

function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );
}
```

## 扩展知识

### 1）Router 的选择建议

1）开发 Web 应用时：

- 优先使用 BrowserRouter
- 需要兼容旧浏览器时使用 HashRouter

2）特殊场景：

- 测试环境：使用 MemoryRouter
- 静态网站：考虑使用 StaticRouter
- 自定义路由：使用 Router 基础组件

### 2）Router 的特性对比

| Router 类型      | 特性 |
|------------------|----------|
| BrowserRouter    | 使用 HTML5 history API<br>URL 更清晰，没有 # 号<br>需要服务器配置支持 |
| HashRouter       | URL 中带有 # 号<br>不需要服务器配置<br>对 SEO 不友好 |
| MemoryRouter     | 路由状态存储在内存中<br>适合单元测试<br>可以完全控制路由历史 |

### 3）配置注意事项

1）服务器配置：

- BrowserRouter 需要服务器配置所有路由都指向 index.html
- HashRouter 不需要特殊的服务器配置

2）部署考虑：

- 静态文件托管使用 HashRouter 更简单
- 动态服务器建议使用 BrowserRouter

3）路由嵌套：

- 所有类型的 Router 都支持路由嵌套
- 可以使用 Outlet 组件来渲染子路由

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
    </Route>
  </Routes>
</BrowserRouter>
```

相关文档地址：

- <https://reactrouter.com/en/main/router-components/browser-router>
- <https://reactrouter.com/en/main/router-components/hash-router>
- <https://reactrouter.com/en/main/router-components/memory-router>



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)