# 如何快速忽略 Git 文件提交？

> 作者：[程序员鱼皮](https://space.bilibili.com/12890453/)，[编程导航](https://yuyuanweb.feishu.cn/wiki/VC1qwmX9diCBK3kidyec74vFnde) 编号 1



当我们使用 IDEA 等开发工具或脚手架创建好新项目后，使用 IDEA 开发工具打开项目，进入底部的 `Git` 标签，会发现很多和项目无关的 IDEA 自动生成的工程文件被添加到了 Git 托管。

![](https://pic.yupi.icu/1/1699348521888-443df7c7-ff16-47a6-a9f8-6fca2db66258.png)



但我们是不希望提交这些文件的，没有意义，所以需要使用 `.gitignore` 文件来忽略这些文件，不让它们被 Git 托管。

如何编写 .gitignore 文件呢？

其实很简单，不用自己编写！我们在 IDEA 的 Settings => Plugins 中搜索 `.ignore` 插件并安装：

![](https://pic.yupi.icu/1/1699348755922-4a97a0d7-1cbf-47de-a3f4-b1ae3ae81ac6.png)



然后在项目根目录处选中右键，使用 .ignore 插件创建 .gitignore 文件：

![](https://pic.yupi.icu/1/1699348817484-a77c150f-9fc3-476b-b77f-67e141e7a811.png)



.ignore 插件提供了很多默认的 .gitignore 模板，根据自己的项目类型和使用的开发工具进行选择，此处我们选择 Java 和 JetBrains 模板：

![](https://pic.yupi.icu/1/1699348931526-9608280d-dbfd-4d38-86c1-cb5eecf60017.png)



然后可以在项目根目录看到生成的 .gitignore 文件，模板已经包含了常用的 Java 项目忽略清单，比如编译后的文件、日志文件、压缩包等：

![](https://pic.yupi.icu/1/1699349391749-55fd3c6c-cbc4-4ec0-a7d0-73a203cc28d0.png)



让我们再手动添加几个要忽略的目录和文件，比如打包生成的 target 目录：

![](https://pic.yupi.icu/1/1699349485840-4da51d88-d92c-49ec-ad7b-066f3e7af601.png)



但是，我们会发现，即使有些文件已经添加到了 .gitignore 文件中，在 IDEA 中显示的还是绿色（已被 Git 托管）状态。如下图：

![](https://pic.yupi.icu/1/1699349281523-07d73d50-7cd4-4809-a384-36ac86134327.png)



这是因为这些文件已经被 Git 跟踪。而 .gitignore 文件仅影响未跟踪的文件，如果文件已经被 Git 跟踪，那么 .gitignore 文件对它们没有影响。

所以我们需要打开终端，在项目根目录下执行如下命令，取消 Git 跟踪：

```shell
git rm -rf --cached .
```



执行效果如图：

![](https://pic.yupi.icu/1/1699349241520-7d6a09e0-1119-4ace-9722-33af3276fb22.png)



可以看到文件变成了红色（未被 Git 托管）或黄色（被忽略）状态：

![](https://pic.yupi.icu/1/1699349699120-e39169e3-2c77-4730-a24e-685fbcabe474.png)



然后，让我们将 .gitignore 文件添加到 Git 暂存区，让它能够被 Git 管理。

![](https://pic.yupi.icu/1/1699349777115-eb7b08a4-a5f3-4b2d-b76a-dac90e96bc0d.png)



至此，就已经完成一个干净的 Git 仓库项目啦~