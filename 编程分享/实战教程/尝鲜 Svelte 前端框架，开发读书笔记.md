# 尝鲜 Svelte 前端框架，开发读书笔记

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)

提到前端开发框架，我相信大家第一时间想到的就是 Vue、React 和 Angular 三大主流。毕竟它们各个都是 GitHub 上 10w+ star 的知名项目，每个前端工程师至少要学习其中一个框架。

![](https://pic.yupi.icu/5563/202311081010202.png)

但是，最近几年，一个新的前端框架逐渐出现在人们眼前，它就是后起之秀『 Svelte 』。目前已经接近 4w 个 star，虽然暂时无法撼动三大主流框架的霸主地位，但是其恐怖的 star 增速，值得我们关注和思考。

Svelte 到底是什么样的框架？它和三大主流框架有什么不同？为什么发展如此迅猛？

带着这些问题，我们一起来学习下 Svelte 框架，并用它从 0 到 1，开发一个读书笔记小网站。

可以先通过一分钟的小视频简单地了解下 Svelte ~





，时长00:46



###  

### 揭开 Svelte 的神秘面纱

按照官网的描述，Svelte 是一种构建用户界面的框架，框架自身具有反应性，可以帮助开发者书写更精简的代码，开发出体积更小、更迅速的 App。

![](https://pic.yupi.icu/5563/202311081010441.png)

使用 Svelte 框架进行开发，需要遵循其特定的语法，编写 `.svelte` 后缀的文件。如下是 Svelte 框架的 `Hello World` 代码：

![](https://pic.yupi.icu/5563/202311081010097.png)

你可能会质疑：这不就和 Vue、React 之类的前端框架一样么？不就是用个数据绑定、抄个 API 和语法风格、改个文件后缀名么？凭什么能获得 4w 的 star？

![](https://pic.yupi.icu/5563/202311081010067.png)

其实，近几年出现的新前端框架并不少，但都被遮挡在了三座大山下，没有一个能够像 Svelte 一样在短期内得到大量的关注。

究竟是什么让 Svelte 框架破圈突围，剑指 Angular ？

### Svelte 新在哪儿？

我们先来看两张图，是对 20 多种前端框架 Demo 项目的性能对比和评测。

第一张图是对比各框架开发的项目的**尺寸**：

![](https://pic.yupi.icu/5563/202311081010453.png)

第二张图是对比各项目的 Lighthouse 性能评分：

![](https://pic.yupi.icu/5563/202311081010947.jpeg)

从上面两张图，我们发现，Svelte 框架无论是在项目尺寸还是性能方面，都表现卓越。一个用 Svelte 开发的 Demo 项目竟然仅有 15 KB！怎么会这么小呢？有黑魔法？

![](https://pic.yupi.icu/5563/202311081010448.png)

这和 Svelte 独特的设计思想有关。基本所有传统的前端框架，在项目运行时都会依赖框架本身的代码，即引入了框架作为 runtime（运行时），因此需要将框架代码打进项目包，占用了一定的包大小。

比如 Vue 项目的包管理文件 `package.json` 中，将 Vue 作为生产环境运行时依赖引入。

```
"dependencies": {
  "vue": "^2.6.11"
}
```

而 Svelte 框架的核心思想在于『 通过静态编译减少框架运行时的代码量 』（尤雨溪大佬的解释）。

Svelte 不会将自己打包进项目，而是在编译打包阶段，将 Svelte 组件转换为原生 DOM 操作。因此，使用 Svelte 开发的项目，并不依赖 runtime，更没有像 Vue 和 React 中的 Virtual DOM，项目的体积也非常地小。

下面是 Svelte 项目的 `package.json` 文件，可以发现，svelte 是被作为开发时依赖引入。

```
"devDependencies": {
  "svelte": "^3.0.0"
}
```

这是 Svelte 和其他前端框架的明显区别。与其说是 “新”，倒不如说是回归原始，返璞归真。

除了不依赖 runtime 和 Virtual DOM 外，Svelte 另一个 “新” 体现在其自身具有**反应性**，可以轻松地实现状态管理，而无需像 Vue 和 React 框架一样引入 Vuex 和 Redux 之类的状态管理库。这一点给开发者提供了极大地便利。

了解了 Svelte 框架的独特之处，让我们趁热打铁，做一个小项目来感受使用 Svelte 进行开发的高效和乐趣~

![](https://pic.yupi.icu/5563/202311081010567.jpeg)

### 十分钟开发读书笔记

接下来，我们要开发一个读书笔记，来记录自己每日的学习内容。

先分析下需求，读书笔记需要有如下基本功能：

1. 添加读书笔记
2. 展示已添加的读书笔记
3. 删除某一条读书笔记
4. 导出读书笔记成 Markdown 格式的文件，并下载至本地

**成品效果如下：**

![](https://pic.yupi.icu/5563/202311081010922.gif)

体验地址：https://read-note.now.sh/

总共分为四步，顺利的话，只用十分钟就可以开发完成并部署上线~

#### 1. 启动模板项目

可以通过以下两种方式下载 Svelte 的模板项目。

**方式一**

直接下载压缩包，并手动解压，地址：https://github.com/sveltejs/template/archive/master.zip

**方式二**

通过 npx 命令创建一个 Svelte 模板项目：

```
npx degit sveltejs/template svelte-app
```

下载模板到本地后，进入项目目录，输入命令安装依赖：

```
npm install
```

Svelte 框架使用 Rollup 作为 JS 模块打包工具（也是大佬写的轮子），依赖安装完成后，通过控制台输入命令，在本地启动项目：

```
npm run dev
```

控制台看到如下输出，项目启动成功：

![](https://pic.yupi.icu/5563/202311081010565.png)

浏览器访问 localhost:5000，可以看到如下界面：

![](https://pic.yupi.icu/5563/202311081010651.png)

#### 2. 开发界面

完成项目模板的下载和启动后，开始进入读书笔记界面的开发。

读书笔记只有一个主页面，先观察页面的布局，分为上下两部分，上方是一张张相同样式卡片组成的列表，下方是操作面板：

![](https://pic.yupi.icu/5563/202311081010919.png)

因此，我们只需要开发两个组件，**卡片** 和 **操作面板**。然后将多张卡片组成列表放在主页面上方，操作面板固定在主页面底部。

在项目 src 目录下新建几个 `.svelte` 文件（Svelte 框架的页面文件，`App.svelte` 为模板自带的主页面），此时目录结构如下：

![](https://pic.yupi.icu/5563/202311081010918.png)

`.svelte` 文件的语法结构和 Vue 框架非常类似，由行为、页面、样式三部分组成，分别对应 JavaScript、HTML、CSS 代码。一个标准的 `.svelte` 文件代码如下：

```
<script>
 // 编写网页交互行为
</script>

<div>
 <!-- 编写页面内容结构 -->
</div>

<style>
 /* 编写 CSS 样式 */
</style>
```

##### 

#####  

##### 2.1 开发卡片组件

读书笔记的每张卡片都要有标题、内容和创建日期，还要给卡片编号，并给不同编号的卡片加上不同的颜色。当鼠标移到卡片上时，出现删除按钮。

![](https://pic.yupi.icu/5563/202311081010762.png)

打开 `Card.svelte` 文件，先在 `script` 标签中用 JavaScript 定义几个属性变量（组件内唯一）和一个删除函数：

```
<script>
  // 定义变量
  export let title; // 标题
  export let content; // 内容
  export let creationTime; // 创建日期
  export let index = 0; // 卡片序号
  
  // 删除卡片
  function doDelete() { }
</script>
```

然后编写卡片的内容，先用一个根 `div` 标签括起所有的内容，然后编写标题、内容、创建时间的 `div` 标签。在 Svelte 中，可以直接使用尖括号来输出变量的值，使用 `on:click` 指令来绑定鼠标点击事件：

```
<div class={`card bg-color-${index % 5}`}>
  <div class="title">
    {title} <span class="del-btn" on:click={doDelete}>x</span>
  </div>
  <div class="content">{content}</div>
  <div class="creationTime">{creationTime}</div>
</div>
```

在 `style` 标签中编写 CSS 代码，让卡片变得美美哒：

```
<style>
  .card {
    padding: 1rem;
    margin: 1rem;
    color: #fff;
    border-radius: 0.5rem;
  }
  
  /* 省略... */
  
  /* 当鼠标移到卡片上，展示删除按钮 */
  .card:hover .del-btn {
    opacity: 1;
  }
</style>
```

##### 

#####  

##### 2.2 开发操作面板组件

操作面板包含两个输入框和两个按钮，用于添加卡片和导出笔记。

![](https://pic.yupi.icu/5563/202311081010460.png)

打开 `AddCard.svelte` 文件，和开发卡片一样，先编写 JavaScript，定义几个属性变量，以及 “添加” 和 “导出” 函数：

```
<script>
  // 在 src 目录下新建 utils 工具类，编写获取当前日期的函数
  import {getNowDateFormat} from "./utils";

  // 定义变量
  let title = ''; // 标题
  let content = ''; // 内容

  // 添加卡片
  function doAdd() { }

  // 导出笔记
  function doExport() { }
</script>
```

然后编写操作面板的内容，Svelte 通过 `bind:value` 指令实现表单数据的双向绑定：

```
<div class="add-card">
  <div class="input-wrapper">
    <input class="input-title" type="text" placeholder="输入标题" bind:value={title} />
    <textarea class="input-content" placeholder="输入内容" bind:value={content}></textarea>
  </div>
  <button class="add-btn" on:click={doAdd}>添加</button>
  <button class="export-btn" on:click={doExport}>导出</button>
</div>
```

最后编写 CSS 代码，让操作面板变得美美哒~ 此处使用 Flex 布局：

```
<style>
  /* 操作面板固定在页面底部 */
  .add-card {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
    background-image: linear-gradient(135deg, #FEC163 10%, #DE4313 100%);
    display: flex;
  }

  .input-wrapper {
    flex: 4; /* 使用 Flex 布局 */
  }

  /* 省略... */
  
  .add-btn, .export-btn {
    flex: 1;
    margin-left: 1rem;
    color: #666;
  }
</style>
```

##### 

#####  

##### 2.3 将组件放入主页面

开发完卡片和操作面板组件后，只需要将这些组件丢到 Svelte 模板项目默认生成的主页面 `App.svelte` 中，在 `script` 标签中通过 `import` 关键字引入组件：

```
<script>
  import Card from "./Card.svelte";
  import AddCard from "./AddCard.svelte";
</script>
```

在 div 标签中，通过 `{# each ... } {/each}` 循环语句实现卡片列表，直接通过组件名引入组件：

```
<div id="app">
  {#each $cards as card, i}
    <Card {...card} index={i}/>
  {/each}
  <AddCard/>
</div>
```

细心的小伙伴可能会好奇，上述代码第 2 行的 `$cards` 变量是从哪儿来的呢？不着急，稍后揭晓~

![](https://pic.yupi.icu/5563/202311081010966.jpeg)

大功告成！读书笔记的界面开发好了，但这时，所有的按钮都没有任何作用，下面我们来给读书笔记添加功能。

#### 3. 实现功能

不知道大家有没有发现，我们要做的读书笔记，其实就是个简单的增删改查项目！

既然是增删改查，那肯定要有地方存储数据，记录数据的变化。通常数据是存在数据库中的，通过向后端发出请求来操作和查询数据库中的数据。

但这里我们只是一个前端项目，没有数据库，怎么办呢？可以直接使用 Svelte 自带的状态管理 API 来实现本地数据管理，无需引入任何新的依赖！

##### 3.1 管理卡片数据

在项目 src 目录下新建 `store.js`，作为数据管理文件，此时目录结构如下：

![](https://pic.yupi.icu/5563/202311081010194.png)

在 `store.js` 文件中通过 `writable` 函数定义 `cards` 可写变量：

```
import {writable} from "svelte/store";

export const cards = writable([]);
```

定义好之后，`cards` 已经被 Svelte 框架管理了，可以直接把 `cards` 当做一个全局变量来使用。

在主页面中引入 `cards`，并通过循环语句展示已添加的卡片列表。注意，想要使用状态变量，要在变量名前添加 `$` 符号。此时的主页面文件  `App.svelte` 内容如下：

```
<script>
  import {cards} from './store'; // 引入 cards
  import Card from "./Card.svelte";
  import AddCard from "./AddCard.svelte";
</script>

<div id="app">
  {#each $cards as card, i}
    <Card {...card} index={i}/>
  {/each}
  <AddCard/>
</div>
```

完成了 `cards` 的展示后，我们依次实现 `cards` 的添加和删除吧~

##### 3.2 添加卡片

点击操作面板的添加按钮，可以添加卡片。须实现 `AddCard.svelte` 文件的添加函数：

```
<script>
  // 引入状态
  import {cards} from './store';
  import {getNowDateFormat} from "./utils";

  let title = '';
  let content = '';

  function doAdd() {
    // 校验
    if (!title || !content) {
      alert('标题和内容必须都填！');
      return;
    }
    
    // 更新卡片状态，追加一个新卡片
    cards.update(item => {
      item = [...item, {
        title,
        content,
        creationTime: getNowDateFormat()
      }];
      return item;
    })
  }
</script>
```

上述文件第 15 行起，通过调用 `cards` 状态变量的 `update` 函数，在原数组后追加一个元素，实现新增卡片。

##### 3.3 删除卡片

点击卡片上的删除按钮，可以删除当前卡片。须实现 `Card.svelte` 文件的删除函数：

```
<script>
  import {cards} from "./store";
 
  // 删除卡片
  function doDelete() {
    cards.update(item => {
      item.splice(index, 1);
      return item;
    })
  }
</script>
```

删除卡片和添加卡片操作类似，都是调用 `cards` 状态变量的 `update` 函数，对原数组进行处理，并使用处理后的数组进行更新。

##### 3.4 导出笔记

点击操作面板上的导出按钮，将已添加的卡片导出为 Markdown 格式的笔记文件，实现比较简单。

首先安装 `file-saver` 库，依赖这个库实现下载功能：

```
npm i file-saver
```

实现 `AddCard.svelte` 文件中的导出函数，将 `cards` 状态数组保存为文件：

```
<script>
  import {cards} from './store';
  // 引入 file-saver
  import {saveAs} from 'file-saver';
  
 // 导出为 read_note.md 文件
  function doExport() {
    const texts = [];
    // 读取 cards 状态数组
    for (const card of $cards) {
      let text = `### ${card.title}\n${card.content}\n${card.creationTime}\n`;
      texts.push(text);
    }
    // 写入文件
    const blob = new Blob(texts, {type: "text/plain;charset=utf-8"});
    saveAs(blob, "read_note.md");
  }
</script>
```

大功告成！一个精美的读书笔记就开发完成啦！

![](https://pic.yupi.icu/5563/202311081010111.jpeg)

##### 3.5 改进

到目前为止，我们只实现了读书笔记最基本的功能，但这个笔记还存在很多问题：

1. 其实目前我们还没有给卡片添加不同的颜色，大家可以在项目中的 `public/global.css` 文件添加颜色样式。
2. 关掉网页后，已经添加的卡片会消失，可以通过浏览器的 Cookie 实现持久化存储，卡片更新时，保存到 Cookie 中，再次打开网站时，从 Cookie 恢复卡片数据，并保存为状态。

感兴趣的读者可以试着实现上述改进功能，还可以发挥自己的想象，给读书笔记添加新功能哦~

![](https://pic.yupi.icu/5563/202311081010786.jpeg)

#### 4. 发布上线

本地开发完成后，怎么将网站发布，让所有人都能看到呢？

首先通过命令打包项目：

```
npm run build
```

会在 `public` 目录下生成 `bundle.js` 文件：

![](https://pic.yupi.icu/5563/202311081010182.png)

此时的 `public` 目录结构如下：

![](https://pic.yupi.icu/5563/202311081010181.png)

怎么发布网站到线上呢？先买台服务器？

大可不必，可以使用 **Vercel**。

![](https://pic.yupi.icu/5563/202311081010704.png)

Vercel 是免费网站托管平台，可以帮我们部署网站，并生成可访问的网址。先通过 npm 安装 Vercel：

```
npm install -g vercel
```

安装完成后，进入 `public` 目录，通过 `vercel` 命令发布网站：

```
cd public
vercel deploy --name read-note
```

发布成功，会得到一个网址，打开就能看到精美的读书笔记网站啦！

![](https://pic.yupi.icu/5563/202311081010947.png)

在网站中启用开发者工具（按 `F12`），能够看到网页文件的加载信息，发现整个读书笔记网站大小才 **16 KB**！

![](https://pic.yupi.icu/5563/202311081010301.png)

简直不讲武德啊！

![](https://pic.yupi.icu/5563/202311081010175.jpeg)

### 亿点看法

翻阅了一些论坛，发现大家对于 Svelte 框架的看法褒贬不一。

有的朋友认为 Svelte 为了减少几十 KB 的体积，而放弃了原本的 runtime 设计和完善的生态，得不偿失。毕竟随着网络和多媒体的发展，如今一张图片的大小都要几百 KB 了，一个页面可能好几 MB，还有必要纠结那点大小么？

也有的朋友认为 Svelte 的强大之处正是在于没有使用 runtime，可以像原生 JS 一样融合进任何框架和组件，非常适合微前端架构。

![](https://pic.yupi.icu/5563/202311081010202.jpeg)

我觉得，姑且不论 Svelte 现在的生态怎么样、有没有人用，首先作者这种打破思维定式、返璞归真的勇气和探索精神值得我们肯定和学习。

**脱离业务场景的技术选型都是耍流氓**，也许在某些配置较低、网络较差的小设备中，减小几十 KB 的包大小真的很有必要！这时，我们可能会摒弃那些重量级的框架，重回原生的怀抱。

Svelte 框架在保证高效极简开发体验的同时，保留了原生项目的轻小体积和高性能，这是能够吸引开发者的爽点。只是目前，Svelte 这种无 Virtual DOM 的设计在生产项目中究竟能发挥多大的优势、在大型应用中的性能到底如何，还有待观察，需要更多的打磨和企业的实际检验。

相信未来，Svelte 的开发者、建设者和布道者会越来越多，未来可期！

**毕竟，多一种技术选型何乐而不为呢？**

![](https://pic.yupi.icu/5563/202311081010862.gif)

如果想要进一步学习 Svelte，推荐直接使用官方提供的学习教程，简洁清晰、容易上手，还能使用在线编辑器进行实时练习和调试。

![](https://pic.yupi.icu/5563/202311081010401.png)

**点击下方阅读原文一键传送** 至 Svelte 官方学习教程哦~