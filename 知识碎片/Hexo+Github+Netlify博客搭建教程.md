# Hexo+Github+Netlify博客搭建教程

> 作者：Leo，[编程导航](https://www.codefather.cn) 编号 12644



> 大家好，我是Leo🫣🫣🫣，前段时间有朋友问了一些关于博客搭建的相关问题，考虑到我之前发的那一篇博客搭建教程比较久远了，所以最近打算重新
>
> 重构一下博客搭建教程，以我现在最新的博客站点为例，带大家从零开始搭建Hexo博客，记录属于你的自己的故事吧，
>
> 好了，话不多说让我们开始吧😎😎😎。

## 1.前言

**博客初步的页面效果可以看一下我的博客**：[Leo](https://manamn.space/)，欢迎大家支持访问。

![](https://pic.yupi.icu/5563/202403220818956.jpg)

本博客基于[Hexo](https://hexo.io/zh-cn/)，所以首先要了解一下我们搭建博客所要用到的框架。**Hexo**是高效的静态网站生成框架，它基于**Node.js**快速，简单且功能强大，是搭建博客的首选框架。大家可以进入[hexo](https://hexo.io/zh-cn/)官网进行详细查看，因为**Hexo**的创建者是台湾人，对中文的支持很友好，可以选择中文进行查看。通过 **Hexo**，你可以直接使用**Markdown**语法来撰写博客。相信很多小伙伴写工程都写过**README.md** 文件吧，对，就是这个格式的！写完后只需两三条命令即可将生成的网页上传到**github**或者**coding**等代码管理托管平台，然后别人就可以浏览你的博客网页啦。是不是很简单？你无需关心网页源代码的具体生成细节，只需要用心写好你的博客文章内容就行了。

**教程大致分三个部分**，

- 第一部分：**Hexo**的初级搭建还有部署到 **Github page**上，以及个人域名的绑定。
- 第二部分：**Hexo**的基本配置，更换主题，实现多终端工作，以及在**coding page** 部署实现国内外分流
- 第三部分：**Hexo**添加各种功能，包括搜索的**SEO**，阅读量统计，访问量统计和评论系统等，并在国外**netlify**进行托管。

## 2.Hexo搭建

### 2.1 安装nodejs

**Hexo**是基于**node.js**编写的，所以需要安装一下**node.js**和里面的**npm**工具。

**windows：**下载稳定版或者最新版都可以[Node.js](http://nodejs.cn/download/)，安装选项全部默认，一路点击**Next**。 最后安装好之后，按Win+R打开命令提示符，输入**node -v**和**npm -v**，如果出现版本号，那么就安装成功了。

建议直接到[nodejs官网](http://nodejs.cn/)去下载，如下所示:

![](https://pic.yupi.icu/5563/202403220818151.jpg)

然后解压到你指定的文件夹即可，比如我解压到我系统的 D:\software\nodejs 目录下了，如图:

![](https://pic.yupi.icu/5563/202403220818979.jpg)

这样我们在所有用户下，都可以使用**npm**，也可以使用**npm**安装的包的命令。成功的将**nodejs**安装并配置到全局环境下。

安装完后，打开命令行终端，输入:

```bash
node -v
npm -v
```

检查一下有没有安装成功

![image-20231013214435098](https://pic.yupi.icu/5563/202403220818051.jpg)

**看到以上版本号即使安装成功！**

### 2.2 添加国内镜像源

如果没有梯子的话，可以使用阿里的国内镜像进行加速。

```bash
npm config set registry https://registry.npm.taobao.org
```

### 2.3 安装Hexo

前面**git**和**nodejs**安装好后，就可以安装**Hexo**了，你可以先创建一个文件夹Hexo**(这里名字随意)**，用来存放自己的博客文件，然后cd到这个文件夹下（或者在这个文件夹下直接右键**git bash**打开）。

比如我的博客文件都存放在D:\Hexo目录下。

在该目录下右键点击**Git Bash Here**，打开**Git**的控制台窗口，以后我们所有的操作都在**Git**控制台进行，就不用**Windows**自带的cmd了。

定位到该目录下，输入以下命令安装**Hexo**。可能会有几个报错，无视它就行。

```bash
npm install -g hexo-cli
```

安装完后输入以下 验证是否安装成功。

```bash
hexo -v
```

![](https://pic.yupi.icu/5563/202403220819330.jpg)

看到以上内容，至此Hexo就安装完了。

接下来初始化一下**Hexo**,即初始化我们的网站，进入我们主题根目录**Hexo**，输入**hexo init**初始化文件夹

```bash
hexo init 
```

这个Hexo可以自己取什么名字都行，然后，接着输入**npm install**安装必备的组件。

这样本地的网站配置也弄好啦，输入**hexo g**生成静态网页，然后输入**hexo s**打开本地服务器，

```bash
hexo g
hexo server(或者简写:hexo s）
```

![](https://pic.yupi.icu/5563/202403220818483.png)

按ctrl+c关闭本地服务器。

### 2.4 注册Github账号创建个人仓库

接下来就去注册一个**github**账号，用来存放我们的网站。大多数小伙伴应该都有了吧，作为一个合格的程序猿(媛)还是要有一个的。

打开https://github.com/，新建一个项目仓库 `New repository`，如下所示：

![](https://pic.yupi.icu/5563/202403220818913.jpg)

要创建一个和你用户名相同的仓库，后面加[http://github.io，只有这样，将来要部署到GitHub](http://github.xn--io,,github-q11qw9ne15ath9areb69fw27lj3sbqgza9oe/) page的时候，才会被识别，

也就是 [http://xxxx.github.io，其中xxx就是你注册GitHub的用户名。例如我的：[http://gaoziman.github.io](http://xxxx.github.xn--io,xxxgithub-794sn8kz4jhka298as10bl6xltrwi6a061bxsg.xn--:[http-9v9ii49dotrzx0c//gaoziman.github.io)](http://gaoziman.github.io/)

### 2.5 生成SSH添加到GitHub

生成SSH添加到 **GitHub**，连接**Github**与本地。 右键打开**git bash**，然后输入下面命令：

```bash
git config --global user.name "yourname"
git config --global user.email "youremail"
```

注意：第一次使用git后需要将用户名和邮箱进行初始化

这里的`yourname`输入你的`GitHub`用户名，`youremail`输入你`GitHub`的邮箱。这样`GitHub`才能知道你是不是对应它的账户。例如我的：

```bash
git config --global user.name "gaiolan"
git config --global user.email "2942892675@qq.com"
```

可以用以下两条，检查一下你有没有输对

```bash
git config user.name
git config user.email
```

然后创建**SSH**,一路回车

**SSH**，简单来讲，就是一个秘钥，其中，**id_rsa**是你这台电脑的私人秘钥，不能给别人看的，id_rsa.pub 是公共秘钥，可以随便给别人看。把这个公钥放

在**GitHub**上，这样当你链接**GitHub**自己的账户时，它就会根据公钥匹配你的私钥，当能够相互匹配时，才能够顺利的通过**Git**上传你的文件到**GitHub**

上。

```bash
ssh-keygen -t rsa -C "youremail"
```

这个时候它会告诉你已经生成了**.ssh**的文件夹。在你的电脑中找到这个文件夹。或者**git bash**中输入

```bash
cat ~/.ssh/id_rsa.pub
```

将输出的内容复制到框中，点击确定保存。

打开[github](http://github.com/)，在头像下面点击`settings`，再点击`SSH and GPG keys`，新建一个`SSH`，名字随便取一个都可以，把你的`id_rsa.pub`里面的信息复制进去。如图：

![](https://pic.yupi.icu/5563/202403220818034.png)

在**git bash**输入以下命令。

```bash
ssh -T git@github.com
```

如果如下图所示，出现你的用户名，那就成功了。

![](https://pic.yupi.icu/5563/202403220818239.png)

### 2.6 将Hexo部署到GitHub

这一步，我们就可以将**Hexo**和**GitHub**关联起来，也就是将hexo生成的文章部署到GitHub上，打开博客根目录下的 **_config.yml**文件，这是博客的配置文件，在这里你可以修改与博客配置相关的各种信息。

修改最后一行的配置：

```yml
deploy:
  type: git
  repository: https://github.com/gaoziman/gaoziman.github.io.git
  branch: master
```

repository修改为你自己的**github**项目地址即可就是部署时候告诉工具，将生成网页通过 **Git** 方式上传到你对应的链接仓库中。

这个时候需要先安装**deploy-git** ，也就是部署的命令,这样你才能用命令部署到**GitHub**。

```bash
npm install hexo-deployer-git --save
```

然后Hexo三连即可将我们本地的代码上传到Github仓库了。

```bash
hexo clean
hexo generate
hexo deploy
```

其中 **hexo clean**清除了你之前生成的东西，也可以不加。 **hexo generate**顾名思义，生成静态文章，可以用 **hexo g**缩写 ，**hexo deploy**部署文章，可以用 **hexo d** 缩写

> 注意deploy时可能要你输入**username**和 **password**。

### 2.7 设置个人域名

现在你的个人网站的地址是yourname.github.io，如果觉得这个网址逼格不太够，这就需要你设置个人域名了。但是需要花钱。

> 不过，这一步不是必要的，如果目前还不想买域名可以先跳过，继续看后面的，以后想买域名了在还看这块

首先你得购买一个专属域名，`xx`云都能买，看你个人喜好了。

这篇以阿里云为例，阿里云官网购买：

![](https://pic.yupi.icu/5563/202403220818681.png)

然后实名认证后进入阿里云控制台，点云解析进去，找到你刚买的域名，点进去添加两条解析记录，如下图所示：

![](https://pic.yupi.icu/5563/202403220818833.png)

然后打开你的**github**博客项目，点击**settings**，拉到下面**Custom domain**处，填上你自己的域名，保存：

![](https://pic.yupi.icu/5563/202403220818013.jpg)

这时候你的项目根目录应该会出现一个名为**CNAME**的文件了。如果没有的话，打开你本地博客**/source**目录，我的是**D:\Hexo\source**，新建**CNAME**文件，注意没有后缀。然后在里面写上你的域名，保存。最后运行**hexo g、hexo d**上传到**Github**。

过不了多久，再打开你的浏览器，输入你自己的专属域名，就可以看到搭建的网站啦！

### 2.8 写文章并发布文章

首先在博客根目录下右键打开**git bash**，然后输入hexo new post "我的第一篇博客"，新建一篇文章。

然后打开**D:\Hexo\source_posts**的目录，可以发现下面多了一个文件夹和一个.md文件，一个用来存放你的图片等数据，另一个就是你的文章文件啦。 你可以会直接在webstrom或者VSCode里面编写**markdown**文件，可以实时预览，也可以用用其他编写md文件的软件的工具编写---->这里强烈推荐**typora**。 编写完markdown文件后，根目录下输入hexo g生成静态网页，然后输入**hexo s**可以本地预览效果，最后输入**hexo d**上传到**Github**上。这时打开你的**github.io**主页就能看到发布的文章啦。

到这儿基本第一部分就完成了，已经完整搭建起一个比较简陋的个人博客了，接下来我们就可以对我们的博客进行个性化定制了。

## 3.主题的应用

我们要定制自己的博客的话，首先就要来了解一下`Hexo`博客的一些目录和文件的作用，以及如何平滑更换漂亮的主题模板并加入自己的定制源代码实现个性化定制

### 3.1 Hexo相关目录文件

#### 1.1 博客目录构成介绍

------

我们博客的目录结构如下：

```json
- node_modules
- public
- scaffolds
- source
    - _posts
- themes
```

下面依次介绍上面各个文件或者目录的用途：

- **_config.yml**： 站点配置文件，很多全局配置都在这个文件中。
- **package.json**： 应用数据。从它可以看出hexo版本信息，以及它所默认或者说依赖的一些组件。
- **scaffolds**： 模版文件。当你创建一篇新的文章时，hexo会依据模版文件进行创建，主要用在你想在每篇文章都添加一些共性的内容的情况下。
- **scripts**： 放脚本的文件夹， 就是放js文件的地方
- **source**： 这个文件夹就是放文章的地方了，除了文章还有一些主要的资源，比如文章里的图片，文件等等东西。这个文件夹最好定期做一个备份，丢了它，整个站点就废了。
- **themes**： 主题文件夹。

我们平时写文章只需要关注source/_posts这个文件夹就行了。

#### 1.2 Hexo基本配置

在文件根目录下的_config.yml，就是整个Hexo框架的配置文件了。可以在里面修改大部分的配置。详细可参考官方的[配置描述](https://hexo.io/zh-cn/docs/configuration)。

![image-20231014010735038](https://pic.yupi.icu/5563/202403220818125.jpg)

##### 1. 网站

参数描述**title**网站标题**subtitle**网站副标题description网站描述**author**您的名字**language**网站使用的语言timezone网站时区。**Hexo** 默认使用您电脑的时区。时区列表。比如说：**America/New_York, Japan,** 和 **UTC** 。

其中，**description**主要用于**SEO**，告诉搜索引擎一个关于您站点的简单描述，通常建议在其中包含您网站的关键词。**author**参数用于主题显示文章的作者。

##### 2. 网址

参数描述url网址root网站根目录 **permalink**文章的[永久链接 ](https://hexo.io/zh-cn/docs/permalinks)格式permalink_defaults永久链接中各部分的默认值

在这里，你需要把url改成你的 **网站域名**。

permalink，也就是你生成某个文章时的那个链接格式。

比如我新建一个文章叫temp.md，那么这个时候他自动生成的地址就是http://yoursite.com/2022/05/08/temp。

以下是官方给出的示例，关于链接的变量还有很多，需要的可以去官网上查找 [永久链接](https://hexo.io/zh-cn/docs/permalinks) 。

> 参数结果:year/:month/:day/:title/2023/10/10/hello-world :year-:month-:day-:title.html 2019-08-10-hello-world.html
>
> :category/:titlefoo/bar/hello-world

再往下翻，中间这些都默认就好了。

下面给出我的网站配置

![](https://pic.yupi.icu/5563/202403220818541.jpg)

```yml
theme: landscap
```

theme就是选择什么主题，也就是在**themes**这个文件夹下，在官网上有很多个主题，默认给你安装的是**lanscap**这个主题。当你需要更换主题时，在官网上下载，把主题的文件放在themes文件夹下，再修改这个主题参数就可以了。

##### 3. Front-matter

**Front-matter** 是md文件最上方以 **---**分隔的区域，用于指定个别文件的变量，举例来说：

```bash
title: Hexo+Github博客搭建记录
date: 2023-10-13 15:15:44
```

下是预先定义的参数，您可在模板中使用这些参数值并加以利用。

参数描述**layout**布局 **title**标题 date建立日期 **update**更新日期 **comments**开启文章的评论功能 **tags**标签（不适用于分页）**categories**分类（不适用于分页）**permalink**覆盖文章网址。

其中，分类和标签需要区别一下，分类具有顺序性和层次性，也就是说**Foo**，**Bar**不等于**Bar**，**Foo**；而标签没有顺序和层次。

### 3.2 更换主题

![](https://pic.yupi.icu/5563/202403220818247.jpg)

Hexo官方为我们提供了很多开发者大佬提供的精美主题供大家更换，大家看选择一个自己喜欢的即可。

官网：https://hexo.io/themes/

笔者这里选择了一个相对于简约的主题，名字叫keep，大家喜欢的也可以来试试。

这里是附上他的Github地址： https://github.com/XPoet/hexo-theme-keep

- 简单漂亮，文章内容美观易读
- 响应式设计，博客在桌面端、平板、手机等设备上均能很好的展现
- 首页 `Banner` 图片
- 时间轴式的归档页
- **词云**的标签页和分类页
- 丰富的关于我页面
- 可自定义的数据的友情链接页面
- 支持文章置顶
- 支持 `MathJax`
- 美观的**TOC**目录
- 可设置复制文章内容时追加版权信息
- **Twikoo**、[Valine](https://valine.js.org/) 和 [Disqus](https://disqus.com/) 评论模块（推荐使用**Twikoo** ）
- 集成了[不蒜子统计](http://busuanzi.ibruce.info/)、谷歌分析（**Google Analytics**）和文章字数统计等功能
- 支持在首页的音乐播放和视频播放功能

他的介绍文档写得非常的详细，https://keep-docs.xpoet.cn/，简直是保姆级教程，大家可以慢慢去探索。

![](https://pic.yupi.icu/5563/202403220818012.jpg)

## 4.优化功能

使用**Netlify** 的继承部署可以在它的服务器按照你设定的命令，自动进行部署网站，也就是说，当你把源码直接提交到github的时候，netlify就会自动部署好你的网站。github用来保存博客的源码 ,而**netlify**存有静态网站。

可以使用github的账号直接登录，这样关联仓库的时候也更加方便。

![](https://pic.yupi.icu/5563/202403220818366.jpg)

配置好**Hexo**的部署命令，并设置发布目录。如图。

部署命令与本地部署的命令是一样的

```bash
hexo generate
```

![](https://pic.yupi.icu/5563/202403220818415.jpg)

配置你的域名，**netlify** 默认给你一个二级域名，你可以修改它，也可以绑定自己已有的域名。同时你也可以使用免费提供的ssl证书,开启Https。

到这里配置就基本完成了。此时你的网站就可以使用它分配或你绑定的域名访问了。你也可以根据你自己的需要进行别的改动。

当你写完文档时，把**Hexo**目录直接提交到**Git**仓库中，**netlify**会把网站自动部署好，你可以在**nelify**查看你的部署日志。这样你的**Git**仓库就只用来保存hexo的源码，而网站是放在**netlify**上的。**netlify**也有cdn，但是速度仍然不是很好，服务器在国外，也就是这样了。你也可以使用了自己的**cdn**服务，以加快网站的访问速度。

**最后效果**

让我们看看最后的效果吧

![](https://pic.yupi.icu/5563/202403220818935.jpg)

感兴趣的小伙伴别犹豫了，抓紧搭建起来！

## 5.总结

以上便是本文的全部内容，本人才疏学浅，文章有什么错误的地方，欢迎大佬们批评指正！我是**Leo**，一个在互联网行业的小白，立志成为更好的自己。