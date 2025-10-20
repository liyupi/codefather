## 常用的 HTML meta 标签有哪些？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

`<meta>` 标签由 name 和 content 属性定义，**用来描述网页文档的属性**，比如网页的作者，网页描述，关键词等，除了 HTTP 标准固定了一些 name 作为大家使用的共识，还可以自定义 name。
name 属性在 `<meta>` 标签中用来指定元数据的名称，想描述的信息类型。content属性用来提供与 name 属性对应的实际数据或信息。值是具体的内容，可以是文本、网址或其他数据。

## 常用的 meta 标签
1） charset 声明文档使用的字符编码。一般是 UTF-8 编码，支持国际化字符集，是现代网页的标准字符集。

```html
<meta charset="UTF-8">
```
2）viewport 是为了响应式设计而设置的，确保页面在不同设备上正确缩放和渲染。width=device-width 使页面宽度等于设备的屏幕宽度，initial-scale=1.0 设置初始缩放比例。  

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
其中， content 参数有以下几种：

- width viewport：宽度(数值/device-width)；
- height viewport：高度(数值/device-height)；
- initial-scale：初始缩放比例；
- maximum-scale：最大缩放比例；
- minimum-scale：最小缩放比例；
- user-scalable：是否允许用户缩放(yes/no）

3）description 提供了页面的简短描述，这些描述在搜索引擎结果中可能会显示为页面的摘要。用于提高页面的SEO效果。  

```html
<meta name="description" content="这是一个页面描述。">
```
4）keywords 可以在 SEO 中设置以尝试优化搜索结果。  

```html
<meta name="keywords" content="关键词1, 关键词2">
```
5）author 用于指明文档的作者名字。  

```html
<meta name="author" content="作者名">
```
6）refresh 用于设置页面在一定时间后刷新或重定向到另一个URL。content="30" 表示每30秒刷新页面一次。  

```html
<meta http-equiv="refresh" content="30">
```
7）robots 用于告诉搜索引擎蜘蛛不要索引这个页面，或不要跟踪页面上的链接。noindex 防止页面被索引，nofollow 防止搜索引擎跟踪链接。  

```html
<meta name="robots" content="noindex, nofollow">
```
其中，content 参数有以下几种：

- all：文件将被检索，且页面上的链接可以被查询；
- none：文件将不被检索，且页面上的链接不可以被查询；
- index：文件将被检索；
- follow：页面上的链接可以被查询；
- noindex：文件将不被检索；
- nofollow：页面上的链接不可以被查询。

8）X-UA-Compatible 为了指定 Internet Explorer 浏览器使用最新的内核渲染当前页面，有助于解决某些兼容性问题。

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```
9）Open Graph 一般用于社交媒体/平台上，定义了当网页被分享时显示的标题、描述、图片和链接等信息。这些信息有助于提高链接分享的吸引力和信息的完整性。  

```html
<meta property="og:title" content="标题">
<meta property="og:description" content="描述">
<meta property="og:image" content="图片URL">
<meta property="og:url" content="网页URL">
```
10）Twitter Card 与 Open Graph 类似，Twitter Card 标签允许控制分享到 Twitter 时的呈现方式。用于增加推文的吸引力和点击率。 

```html
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@用户名">
<meta name="twitter:title" content="页面标题">
<meta name="twitter:description" content="页面描述">
<meta name="twitter:image" content="图片URL">
```
11） Content-Type 用来定义 HTML 文档的内容类型和字符集，但它的使用已经比较少见，因为较新的 HTML5 规范推荐使用简单的 charset（第一个）定义。   

```html
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
```


> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)