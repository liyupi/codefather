大家好，我是程序员鱼皮。

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)

AI 绘画是 23 年最火的技术之一。对程序员来说，以前我们想做个网站，会经常因为没有图片素材而发愁；而现在用 AI 绘画技术，想要什么图片，**只要输入文字就能快速生成了**。

比如我们公司官网的主图，就是用 AI 绘画生成的，效果非常惊艳！

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1702031098464-c2d015f3-4241-4422-85cc-7aeee2eafdc8.png)



设计师：我失业了？

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1702031170366-70ac7506-fff5-4a0a-9641-28268c7cd92d.png)



当然，设计师有了 AI 绘画，更是如虎添翼，可以给自己增加无穷的灵感，比如让小猫咪敲代码：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1702031355547-919342a5-4f0b-4f1e-bd27-55ad3cc8ecad.png)



那么问题来了，这么牛的 AI 绘画技术，我们如何使用呢？

我们肯定需要一个强大的 AI 绘画工具。目前主流的 AI 绘画工具有 Stable Diffusion、DreamStudio、Midjourney、DALL·E2 等，这里鱼皮推荐大家选择当前较火的 **开源工具** Stable Diffusion，比起使用其他开发者封装的平台，可以更灵活、定制化地生成图像。



![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1702034102121-b8861d53-d08d-44d3-bd39-a29140ca7e4a.png)



那么如何使用 Stable Diffusion 呢？

其实非常简单！这篇文章是一个保姆级教程，我就教大家用最简单易学的方式，快速搭建一个属于自己的 Stable Diffusion AI 绘画工具，没有限制，想画什么就能画什么。。。



## 使用教程

### 一、选择环境

Stable Diffusion 本质上是一套开源的代码，既然是代码，就得想办法部署运行。

我们可以用自己的电脑部署。但是，Stable Diffusion 对硬件是有要求的：不少于 16 GB 内存，并且拥有 60 GB 以上的硬盘空间，需要用到 CUDA 架构，推荐使用 N 卡等等。

虽然目前已经有了对 A 卡的相关支持，但运算的速度明显慢于 N 卡。



结果我一看自己电脑的配置，发现算力根本不够啊！直接倒在了第一步。。。

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701927245080-35af807d-2fd5-4778-9a94-ee3a4a74bf43.png)



没关系，自己的电脑不行，我们可以搞一个 GPU 云服务器，来部署 Stable Diffusion。

有了云服务器后，我们通常还需要自己安装各种依赖软件，以支持 Stable Diffusion 的部署。对于不熟悉 Linux 的同学来说，这其实是很麻烦的一件事。

有没有什么云服务器，可以直接帮我们装好 Stable Diffusion 呢？让我们可以直接使用。

当然有，大厂自然能考虑到这个痛点。比如腾讯云最近新出了一个高性能应用服务 `HAI`，是一款面向 AI 和科学计算的 GPU 应用服务，提供了即插即用的算力和常用的 AI 环境。

官方：https://cloud.tencent.com/product/hai



![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1702637467627-8968eb33-5968-4f39-8e77-d21b7d850ba4.png)



HAI 提供了很多预装的模型，能够一键部署常用的 AI 应用环境，比如本文主讲的 Stable Diffusion、LLM 等；还提供了 Python 开发者常用的 JupyterLab 等可视化界面。

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1702637628239-f7830465-bf9d-4d6c-ae28-a96722071b68.png)



简单来说，HAI = GPU 服务器 + 开箱即用的应用，就像一台给你安装好了各种软件的电脑，拿来就能使用了~



腾讯云的 HAI 不仅可以预装 Stable Diffusion，还可以选择其它 AI 模型，例如 ChatGLM2 6B、Llama2 7B、Llama 13B 等，对 AI 应用开发者会很有帮助。

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1702016574157-7a9d4614-163e-4c1a-9cdb-bac8cc0cf22a.png)



还可以预装 AI 框架，比如 Pytorch2.0.0、Tensorflow2.9.0 等：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701941737719-b7da3a3d-bb22-4047-82bd-5df944fe5059.png)



那既然我们选好了开发环境，下一步就可以开始部署 AI 绘画平台啦~



### 二、安装 Stable Diffusion

首先从腾讯云 HAI 官网进入算力管理页面，点击 `新建` 按钮，新增一台服务器。

指路：https://console.cloud.tencent.com/hai/instance



![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1702637771561-e6f0e680-a705-4930-910f-067d8da2efc4.png)



然后选择服务器的规格。其实这里只要设置一下实例名称，其余保持默认就好：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1702637825763-c5c19733-4566-4208-a322-d32efee07989.png)



然后等待创建：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701743254929-e414b354-1ca8-4f81-af4b-564ab69a323e.png)



创建的过程中，可以进行加速设置，选择你创建的地域即可免费加速：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701745722857-63811e53-480b-4317-9e34-3441695462e6.png)



大概几分钟左右，GPU 服务器就创建完毕啦，可以看到 HAI 正在运行中：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701745869649-dcd260fc-9c17-46aa-b5ff-e11609e5b2fb.png)



然后点击算力连接，可以看到 `Gradio WebUI`，这是 HAI 服务器帮我们安装好的 Stable Diffusion 使用界面：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701850588229-7f31ecf3-5fdf-4625-ae9b-4f1b007b66d9.png)



打开它，就能够愉快地使用 AI 绘画啦~ 就这么简单！

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701850664510-3dba50a3-a998-4c3f-8287-b832ea14d266.png)



### 三、使用 AI 绘画

AI 绘画是一门学问，要想画出最理想的图片，就要认真编写 `prompt`，也就是输入给 AI 的文字。

如果你不知道怎么写 prompt，也很简单，可以直接从 `Civitai` 网站中选择一个好看的图片并直接获取到现成的 prompt。

比如这里我选一只猫：

示例图片：https://civitai.com/images/4121406



![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701850856934-9b88c8a3-a639-4ac5-ad14-752adba0bab0.png)



当然，也可以选择别的图（我知道你们想选什么，别想了）：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1702033263150-b41779c4-a28c-489c-ab38-31a8b0b550dd.png)



言归正传。我们从上述网站中复制图片的 prompt 以及 Negative prompt，并粘贴到 Stable Diffusion 平台：

Negative prompt：用户指定模型在图像生成过程中应该避免的提示，例如畸形手脚、低画质等

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701848995088-5de3d3a8-4834-4fe4-b9c9-4df5cb3627a2.png)



还可以在 Stable Diffusion 平台设置一些其他的参数，来优化生成的效果，比如 Sampling method、Sampling steps、CFG Scale、Seed 等，这些都可以从上面的网站复制，或者自己调试。

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701849025642-c4aeafff-5a85-455d-a6f5-f044d882fded.png)



点击 Generate，然后等待十几秒，就能看到效果了：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1702034462861-e715073d-1f9d-44ed-b28b-7ff80f90c0e7.png)



诶，出来了！猫出来了！

虽然猫是画出来了，但大家仔细一看就会发现，这只猫有点奇怪啊！尤其是腿和尾巴，这只猫放到 2023 年显得有点过于先进了。

这是因为 Stable Diffusion 内置的基础模型能力一般，答应我，千万别画人！我怕你晚上睡不着觉。。。

为了让图像更加真实美观，我们可以在 Civitai 找个更专业的动物模型来优化生成的图像。



### 四、使用模型优化图像

首先从 Civitai 网站中下载模型：

指路：https://civitai.com/models

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701847873040-e827f714-ae2e-4605-8bdb-e4ce4da8abf0.png)



这里我选择的是包含 `ANIMAL` 标签中的第一个，如下图：

指路：https://civitai.com/models/122793/fenrisxl

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701847910226-e1c17fe5-5290-4e18-a0fb-dd9cb4e69d50.png)



点击右侧下载模型：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701847931637-0445f750-de15-419a-beba-22efa1d9cf47.png)



下载完毕后可以通过一个牛 X 的 SD 法术解析网站来查看下载的模型信息和用法：

指路：https://spell.novelai.dev/

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701842563892-6cefb6f1-8158-4b8e-9061-3abbdaa6b83a.png)



可以按照模型用法的指示将 model 文件放到对应的文件夹中。

有个问题，怎么把模型文件放到咱的服务器上呢？

其实 HAI 在新建成功后，就会自动帮我们安装 `JupyterLab`，一个基于 Web 的开源交互式开发环境，可以直接在网页上运行 Python 代码、执行终端命令来操作服务器、管理文件等。

直接在 HAI 控制台打开 JupyterLab：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701745912580-52e6a456-1a9f-4047-a60d-9b31c2132b48.png)



进入 JupyterLab 的界面：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701746335730-f6790bac-c940-45fb-82bd-f86531f29628.png)



通过 JupyterLab，我们可以很方便地进入到 `/root/stable-diffusion-webui/models/Stable-diffusion` 目录下：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701842729217-5356584e-0593-4dc1-9389-d0c871541be3.png)



然后点击上传，将下载好的模型文件上传到服务器上：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701842787580-88c9b71b-8204-4fdf-bddf-fabdff636a4d.png)



此时会在后台默默上传，建议不要关闭当前的 JupyterLab 页面，可在 JupyterLab 下方查看文件上传进度：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701849947361-9cf685b3-cb75-4c9f-8b92-69ee542f6c06.png)



然后进入 Gradio WebUI，此时可以在左上角选择我们刚刚下载的模型：

记得先点击下刷新按钮

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701852338596-4b797949-5c20-4fb4-8a38-60f2aa831863.png)



切换好模型后，再次点击 Generate 生成，这次生成的效果图：

![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1701852447872-3ddd1c16-c3f7-423d-9e45-dee57f476fae.png)

先看整体，嗯，不错！

再看细节，瞳孔、前爪、后腿都没问题。甚至还给我多了一部分背景，nice~



## 最后

以上就是本期 AI 绘画教程，总结一下，我们能这么快、不写代码地搭建 AI 绘画平台，得益于 Stable Diffusion 的开源以及腾讯云 HAI 的能力，开箱即用真的是太爽了。

腾讯云 HAI 的价格是 1.2 元 / 小时。这里鱼皮分享个省钱小技巧 —— 用完就关！就很实惠了~

注意，如果你的硬盘选择了默认的 80 GB 容量，那么在创建的 15 天内是可以实现关机免计费的，15天后关机也只需要 0.02 元 / 小时。



👇 点击下方阅读原文，或者访问网站 https://cloud.tencent.com/product/hai 就可以使用腾讯云 HAI 啦~

学会的同学，点个赞或在看支持一下吧，感谢！



![](https://yupi-picture-1256524210.cos.ap-shanghai.myqcloud.com/1702035035700-274db9cb-1092-41a8-a185-d9359aa80401.png)