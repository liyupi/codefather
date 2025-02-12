## HTML5 相比于 HTML 有哪些更新？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

HTML5 是 HTML 最新的标准，它⽐ HTML 更加规范，并添加了很多新的特性：
1）语义化更强的 HTML 元素：引入如 article、section、nav、header 和 footer 等元素，帮助创建结构更清晰、语义明确的网页，有利于 SEO 和内容的可访问性。
2）表单控件增强：新增多种表单输入类型（如 email、date），直接支持数据验证，极大地提高了表单的易用性和功能性。
3）音视频支持：原生支持音频（audio）和视频（video）内容，无需依赖外部插件，提高了多媒体内容的访问速度和兼容性。
4）新的 API 支持：引入了多个强大的 API，如 Canvas、Geolocation、Drag and Drop，增强了网页的功能性，使其能支持更复杂的用户交互。
5）Web 存储和 WebSockets：提供了更先进的数据存储方案（localStorage 和 sessionStorage）和实时通信能力（WebSockets），让网页应用更像传统的桌面应用。
6）更好的连接性和离线支持：通过应用程序缓存（Application Cache）支持离线应用，使得 Web 应用能够更灵活地在没有网络的环境下使用。

## 1、语义化标签
- header：定义文档的页眉（头部）。
- footer：定义文档或节的页脚（底部）。
- nav：定义导航链接的部分。
- article：定义独立的文章内容。
- section：定义文档中的节（section、区段）。
- aside：定义与页面主内容相关联但又相对独立的内容，如侧边栏。

## 2、媒体标签
HTML5 提高了原生媒体支持，无需额外插件即可播放音频和视频：
1）Audio 标签：用于嵌入音频内容。

```html
<audio src="audio.mp3" controls autoplay loop></audio>
```
2）Video 标签：用于嵌入视频内容。

```html
<video src="video.mp4" poster="poster.jpg" controls></video>
```
3）Source 标签：在音视频标签内使用，为不同的浏览器提供多种格式的媒体文件。

```html
<video controls>
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
</video>
```
## 3、表单增强
HTML5 对表单控件也进行了扩展，增加了多种类型的输入控件，使得收集和验证用户输入更加方便：

- type="email"、type="url"：自动验证用户输入格式。
- type="number"、type="range"：输入数字或范围。
- type="search"：优化的搜索框。
- type="color"：颜色选择器。
- placeholder：输入框为空时显示的提示文字。
- required、pattern：简化了数据验证过程。
- time：时分秒
- data：日期选择年月日
- datatime：时间和日期(目前只有Safari支持)
- datatime-local：日期时间控件
- week：周控件
- month：月控件

## 4、新的 API
HTML5 引入了许多强大的 JavaScript API，支持更复杂的网页应用：
1）拖放API：允许用户拖放文件直接到网页中。

```html
<img draggable="true" />
```
2）Web Storage：提供 localStorage 和 sessionStorage，用于在客户端存储数据。
3）Canvas API：用于在网页上绘制图形。

```html
<canvas id="myCanvas" width="200" height="100"></canvas>
```
4）Geolocation API：允许网站访问用户的地理位置。

## 5、进度条和度量器
progress：显示操作的进度（IE、Safari不支持）。
meter：显示磁盘使用情况的标量值。（IE、Safari不支持）

## 6、更好的连接性
Offline Web Applications：HTML5 提供了应用程序缓存，允许网站在离线状态下运行。

## 7、 WebSockets
提供了一种在单个连接上进行全双工通讯的方式，使得实时数据通讯（如聊天应用）更加有效和资源节约。

## 8、 更丰富的图形和效果
CSS3 Integration：HTML5 与 CSS3 紧密集成，支持更复杂和动态的视觉效果。
SVG Integration：支持可缩放矢量图形 (SVG) 的直接嵌入。

## 9、移除过时元素
比如纯表现的元素：basefont，big，center，font, s，strike，tt，u;
对可用性产生负面影响的元素：frame，frameset，noframes；

## 扩展知识点
1）HTML5 解析算法：HTML5 规范定义了如何解析标记语言的详细算法，这对开发兼容性更强、更健壮的浏览器和工具有重要意义。
2）微数据（Microdata）：HTML5 支持微数据，这是一种将数据嵌入 HTML 文档的方式，有助于搜索引擎和其他应用程序更好地理解、索引和利用网页的数据。
3）HTML5 安全性：虽然 HTML5 带来了许多新特性，但也引入了新的安全挑战。例如，跨源资源共享（CORS）、Web 存储和离线应用等特性需要开发者采取额外的安全措施。
4）HTML5 和 CSS3 的关系：HTML5 常与 CSS3 一同使用，共同支持网页的布局、样式和动画效果，使网页更具吸引力和动态性。
5）全局属性的扩展：HTML5 扩展了一些全局属性，如 contenteditable，允许用户编辑网页的任何元素，spellcheck，自动检查拼写错误。
6）HTML5 的未来发展：随着 Web 技术的不断进步，HTML5 也在持续发展中。例如，Web Components 技术允许开发者创建封装好的可重用的组件，这将进一步改变 Web 开发的方式。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)