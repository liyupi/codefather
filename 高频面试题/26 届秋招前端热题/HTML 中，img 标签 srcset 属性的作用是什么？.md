## HTML 中，img 标签 srcset 属性的作用是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

在开发响应式页面时，经常需要考虑图像在不同设备上的显示效果。srcset 属性就非常有用，它允许我们为 `<img>` 标签指定多个源图像，并根据设备的屏幕大小和分辨率来选择最合适的图像。这样做的好处是可以避免在小屏设备上加载过大的图像，节省带宽并提升页面的加载速度。  

## 主要作用
srcset 属性可为同一图像提供多个文件源和各自的分辨率描述符。浏览器会根据当前设备的屏幕尺寸（如宽度）和像素密度（如 DPI ）来选择最合适的图像源进行加载。这样，就能 **获得与其设备相匹配的最佳图像体验，而不必加载比所需更大或更高分辨率的图像**，从而节省带宽并加快页面加载速度。用法如下：

```html
<img 
  src="small.jpg" 
  srcset="small.jpg 500w, 
  medium.jpg 1000w, 
  large.jpg 1500w" 
  alt="示例图片"
/>
```
这里的示例中：根据设备的屏幕宽度，浏览器会从三个图像中选择一个最合适的来显示。如果屏幕宽度接近 500 像素，它会加载 small.jpg；如果接近 1000 像素，则会加载 medium.jpg，以此类推。
一般情况下，srcset 和 sizes 属性一起使用，因为 sizes 可以帮助浏览器更准确地知道在不同视图下应该显示多大的图像，这样浏览器在选择图像时就更加精准了。

```html
<img 
  src="small.jpg"
  srcset="small.jpg 500w, 
  medium.jpg 1000w, 
  large.jpg 1500w"
  sizes="(max-width: 600px) 500px, (max-width: 900px) 1000px, 1500px"
  alt="示例图像"
>
```
srcset：列出了三个图像源和它们各自的宽度描述符。500w、1000w和1500w告诉浏览器每个图像的自然宽度。
sizes：

- 当视口宽度最大为 600px 时，图像的显示大小应为 500px 宽。
- 当视口宽度最大为 900px 时，图像的显示大小应为 1000px 宽。
- 如果视口宽度超过 900px 时，图像的显示大小应为 1500px 宽。

这种方法非常有效，因为它确保了图像不会过大或过小，从而避免了不必要的带宽消耗，并确保图像在各种设备上都能快速且正确地加载。

## 扩展知识
srcset 还可以与 `<picture>` 元素结合使用。`<picture>` 元素提供了更复杂的图像源选项，可以根据不同的媒体条件（如屏幕宽度和分辨率）指定不同的图像源。这对于艺术方向性的响应式图像特别有用，比如当你希望在不同设备上显示不同裁剪或方向的图片时。用法如下：

```html
<picture>
  <source 
    media="(min-width: 800px)"
    srcset="large-1.jpg 1x, large-2.jpg 2x"
    sizes="(min-width: 1200px) 600px, (min-width: 1000px) 50vw, 100vw">
  <source 
    media="(min-width: 400px)"
    srcset="medium-1.jpg 1x, medium-2.jpg 2x">
  <img 
    src="default.jpg" 
    srcset="small-1.jpg 1x, small-2.jpg 2x"
    alt="Responsive image">
</picture>
```
`<source>` 元素：

- 第一个 `<source>` 元素针对视口宽度至少为 800px 的设备。使用 srcset 提供了两种分辨率（1x 和 2x）的大图像，适用于高分辨率显示设备。sizes 属性进一步定义了不同视口宽度下图像的显示宽度，提供更精细的控制。
- 第二个 `<source>` 元素针对视口宽度至少为 400px 的设备。同样使用 srcset 提供普通和高分辨率的中等尺寸图像。

`<img>` 元素：

- 作为所有 `<source>` 元素的后备选项。如果没有任何 `<source>` 元素的条件被满足，或者浏览器不支持 `<picture>` 元素，将加载 `<img>` 中定义的图像。这里还使用了 srcset 来为小图提供不同分辨率的版本。



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)