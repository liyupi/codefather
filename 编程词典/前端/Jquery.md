# Jquery

Jquery 是一款十分优秀的 JavaScript 库。其主要功能是辅助开发者快速而方便地操作 HTML 文档、事件处理、动画效果、Ajax 请求等。其最为显著的优点就是优秀的兼容性，通过简单的语法和API可以完成更加复杂的功能效果。

可以想象一个开发者需要用原生 JavaScript 实现一个添加 DOM 元素并设置样式的功能，会花费很多时间和精力去写这样的代码，而使用 Jquery 就可以轻轻松松地实现。Jquery 提供了一个强大而简单的 DOM 操作方式，你只需要用极少的代码就可以完成复杂的 DOM 操作。

举个例子，如果你想通过 JavaScript 改变一个元素的样式属性，可能需要写很多重复的代码，写成这样：

```
var obj = document.getElementById("myDiv");
obj.style.color = "#000";
obj.style.background = "#f5f5f5";
obj.style.fontSize = "12px";
obj.style.fontWeight = "normal";
```

而使用 Jquery，就是这样：

```
$("#myDiv").css({color:"#000", background:"#f5f5f5", fontSize:"12px",fontWeight:"normal"});
```

是不是十分简单易懂呢？实现方法简单而且代码量明显减少了，这便是 Jquery 集学习、开发与效率为一体的优秀库的特点。

总之，Jquery 改变了前端开发方式，让开发人员能够更加快速、方便地开发出兼容性更好、交互更加丰富、更具有响应性的网页。