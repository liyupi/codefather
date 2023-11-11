# Git & GitHub 学习路线 by 程序员鱼皮

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)


不喜欢阅读文字的同学可以看视频讲解：[https://www.bilibili.com/video/BV1KZ4y1e7cG](https://www.bilibili.com/video/BV1KZ4y1e7cG)
## 介绍
### Git / GitHub 是什么？

Git 是目前最主流的 `分布式版本控制系统` （Version Control System），是团队协作开发不可或缺的工具。它可以保存和管理文件的所有更新记录、并且使用 **版本号** 进行区分。从而支持将编辑后的文档恢复到修改前的状态（历史版本）、对比不同版本的文件差异、防止旧版本覆盖新版本等功能。

GtiHub 是目前最主流的、免费的 `代码开源托管平台` ，可以理解为一个存储和管理代码的 “网盘”。所有用户或团队都可以把自己的代码上传到 GitHub 进行共享和维护、从 GitHub 下载代码等。开发者们可以从 GitHub 上白嫖代码，进行学习或引用。

很多同学刚开始容易把这两个概念搞混，其实很好区分，Git 和 GitHub 的区别和关系如下：

1. Git 是工具，而 GitHub 是平台。
2. 我们可以用 Git 之外的版本控制系统（比如 SVN）来向 GitHub 提交代码；同样可以用 Git 将代码提交到 GitHub 之外的其他代码托管平台（比如企业级代码托管平台 GitLab）上。

> SVN 和 Git  是同类的工具，两者的用法很相似。但目前 Git 相对更主流一些，因此只学习 Git 足够了。


### 为什么要用 Git / GitHub？
#### Git

Git 起初是由 Linux 的创始人 Linus Torvalds 为了更好地管理 Linux 内核开发而创立的。Linux 的内核开发极其复杂，我们可以试想一下，如果有 100 个人要共同来开发这样一个大型项目、维护同一个代码目录和文件，怎么样才能够保证大家的代码不重复、不冲突、即时共享呢？难道要把代码放到 U 盘里，每个人写完代码后再拷贝到别人电脑上么？

肯定不行对吧，这样做不仅麻烦，而且只能人为去解决冲突，可能会出现下面的对话：

A：“哎，这行我改了，你别改！”

B：“TNND，你改了也不跟我说一声。”

所以 Git 的出现正是为了解决上述难题。

使用 Git 工具，大家可以很方便地拉取和提交代码、及时得到代码的修改信息、对比新老代码之间的差异等，让系统代替人工来自动检查和解决冲突。从而提高团队协作开发的效率，保证代码和项目的稳定推进。

除了团队开发外，我们自己做项目时也可以用 Git 来管理代码，如果一不小心改错或者删除了文件，可以快速还原。

因此 Git 也是目前开发岗同学 **必学** 的技能，企业开发的基本功。

#### GitHub

既然要团队协作开发，那么大家肯定要 **共享代码** ，在同一套代码的基础上进行开发。所以需要一个集中存储和管理代码的地方，所有团队成员都能访问到。而且不同于网盘，最好大家能使用 Git 工具来操作代码的上传和拉取，并且在平台上方便地浏览和对比代码。

于是，有能力的公司开始自己建设公司内部的代码托管平台。但是对大多数小公司来说，他们没有这种条件自建，只能依赖其他大公司的代码托管服务。

此外，在 Linux 之父以及很多优秀程序员的影响下，越来越多的程序员倡导 **开源** ，认为软件开发应当是开放的，所有开发者都可以加入贡献。而开源的背后，必须要有一个开放共享的代码托管平台来支撑，而不是每个公司的代码都被封闭在自己内部的平台上。

于是，以 GitHub 为代表的代码托管平台出现了。团队可以利用 GitHub 进行协作开发；开发者可以轻松阅读并参与到世界知名的开源项目中；我们每位同学也都可以免费使用 GitHub 上的代码，站在巨人的肩膀上打造自己的项目，或者通过参与开源来提升个人影响力等。

此外，如今的 GitHub 还提供了更多强大的功能，比如问题讨论、在线编程、托管网站、自动构建项目等，对开发者非常有帮助。除了代码外，鱼皮也经常把一些需要团队内共享的文档上传到 GitHub 私仓和其他成员协作，免费无限制谁不爱呢？

当然，GitHub 只是代码托管平台中最有代表性的一个，其他知名的代码开源托管平台有国内的 Gitee、国外的 Bitbucket 等；面向企业的私有代码托管平台有 GitLab、腾讯工蜂等。它们没有什么本质的区别，都是平台而已，会用 GitHub，就会用其他的。

综上，强烈建议大家养成使用 GitHub 的习惯，感受开源的魅力。

## 学习条件

1. 学过至少一门编程语言后就可以学习 Git 了
2. 准备开发个人完整项目前建议学习。注意是完整项目，还停留在初学编程语言写练习阶段的同学先不用学，抓紧熟悉编程语言就好。
3. 正式找工作前必须学习！

## 学习建议

1. Git 只是工具，学 Git 的时候可以轻松一些，千万不要去背命令！初学者只要先了解工作中常用命令的作用、提交代码的流程，然后跟着教程实操一遍，有个大致的印象就够了。忘了的话就掏出说明书（百度 / 文档等），随用随查即可。因此建议将专门学习 Git 的时间控制在 1 天内，一般几个小时就足够了，最快的话只用十几分钟也能上手。
2. 虽然现在有很多傻瓜式可视化 Git 工具，但还是建议初学 Git 的同学多自己手敲 Git 命令，可以多把自己平时写的练习代码用 Git 上传到 GitHub 上管理，用的多了自然就熟悉了。
3. Git 的学习不是一蹴而就的。随着你使用 Git 管理的项目越来越多、工作经验越来越丰富，你对 Git 和 GitHub 的熟练程度才会越来越高。总之，想学好 Git，实践是关键。

## 学习路线

⭐️ - 重点知识 / 强烈推荐
😐 - 了解即可

### 大纲
![Git & GitHub 学习路线 by 程序员鱼皮.png](https://cdn.nlark.com/yuque/0/2022/png/398476/1655990159102-a826251e-fbb3-461b-9318-d560cd32a13d.png#clientId=ua3c55a2b-7415-4&from=paste&height=3197&id=ub68f9a98&originHeight=7033&originWidth=1728&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1000924&status=done&style=shadow&taskId=u64a6f249-5014-41bc-82a2-ac71f7a368c&title=&width=785.454528430277)

### 零、无痛上手

Git 本身只是一个工具，不涉及太多复杂的的理论知识，看了说明书就能用；再加上现在很多主流的开发工具都支持可视化地操作 Git 来管理项目，将它的使用成本降到了最低。所以我们可以随用随学，哪怕之前完全不会，工作用到时也可以直接 **赶鸭子上架** ，做到能用界面来拉取和提交代码、完成开发即可。

我自己刚开始接触 Git 的时候就是这样，完全没有上网搜教程，就是看别人提交项目的时候用到了这个工具、在编辑器上点几下就可以了，觉得很厉害很方便。然后我就有样学样地用起了这个工具，而且很长一段时间我都是用 GitHub Desktop 来傻瓜式的操作，遇到问题了再上网搜解决方案。

这里我建议大家无论是否要学习 Git，都可以先把它安装到你的电脑中（直接去官网安装）。因为有可能一些软件或工具会依赖 Git，不装的话后面会出现一些问题。

#### 目标

1. 能用软件操作 Git 来拉取和提交代码

#### 资源

⭐️ Git 官方下载：[https://git-scm.com/downloads](https://git-scm.com/downloads)

Git 可视化管理软件：

> 一般情况下不用额外安装软件，用开发工具自带的 Git 可视化功能即可（比如 IDEA、VS Code 等）


- ⭐️ GitKraken：https://www.gitkraken.com/（炫酷且友好）
- Sourcetree：[https://www.sourcetreeapp.com/](https://www.sourcetreeapp.com/)
- TortoiseGit：[https://tortoisegit.org/](https://tortoisegit.org/)
- GitHub Desktop：[https://desktop.github.com/](https://desktop.github.com/)
- Git GUI（安装 Git 后自带）

### 一、Git 基础

虽然使用可视化工具也可以操作 Git 完成开发工作，但如果不了解 Git 的概念和每个操作具体做了什么，在团队开发中很容易出现问题（比如出现冲突）。

因此本阶段的目标如下：

#### 目标

1. 了解 Git 基本概念和常用命令的作用（理论）
2. 能够使用 Git 命令来管理和提交项目代码（实践）

#### 知识点

- ⭐️ 基本概念 
   - 什么是 Git（版本控制系统）
   - 什么是 GitHub（代码托管平台）
   - Git 和 GitHub 的作用
   - Git 和 GitHub 的联系与区别
- ⭐️ Git 概念 
   - 工作区
   - 暂存区（索引）
   - 本地版本库
   - 远程仓库
   - Git 文件状态
   - 版本
   - HEAD
   - 分支
- Git 的安装
- Git 常见配置（git config） 
   - 修改配置 
      - 个人信息
   - 查看配置
- ⭐️ Git 基本操作（开发流程） 
   - 初始化仓库（git init）
   - 克隆（git clone）
   - 暂存（git add）
   - 提交（git commit）
   - 推送（git push）
   - 拉取（git fetch）
   - 拉取合并（git pull）
   - 😐 查看状态（git status）
   - 😐 查看历史（git log）
- ⭐️ 分支操作 
   - 创建分支
   - 查看分支
   - 切换分支
   - 删除分支
   - 合并分支（git merge）

#### 学习方法

入门 Git 时没必要买书，而是直接看网上的文档或视频教程，大概花几分钟 ~ 几小时就可以入门了。

比如 [猴子都能懂的 Git 入门](https://backlog.com/git-tutorial/cn/) ，图文并茂、通俗易懂，看完入门篇就足够了：

![](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/1/image-20220623195749271.png#id=qSReP&originHeight=780&originWidth=2008&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=shadow&title=)

或者看 B 站上一些免费的分享，比如下面资源里提到的一节课入门视频，可以帮助你快速了解 Git。

但是大家要切记，**一定要跟着教程敲命令** ，自己走完一套从新建文件到提交文件的完整流程！

还可以配合可视化工具来观察每个命令执行带来的效果，比如 IDEA 会自动把 Git 托管的文件变成绿色，从而帮助你理解每个命令的作用。

Git 的分支概念还是很重要的，大家可以使用 [Learning Git Branching](https://learngitbranching.js.org/?locale=zh_CN) 这个在线游戏来学习和理解分支。

> 当然，习惯阅读官方文档的同学也可以直接看 Git 官方文档入门。


#### 资源

在线文档：

- ⭐️ 猴子都能懂的 Git 入门：https://backlog.com/git-tutorial/cn/（强烈推荐）
- 菜鸟教程：[https://www.runoob.com/git/git-tutorial.html](https://www.runoob.com/git/git-tutorial.html)
- 廖雪峰的教程：[https://www.liaoxuefeng.com/wiki/896043488029600/](https://www.liaoxuefeng.com/wiki/896043488029600/)
- Git 简明指南：[http://rogerdudler.github.io/git-guide/index.zh.html](http://rogerdudler.github.io/git-guide/index.zh.html)（几分钟看一遍就好，可以用来复习）

视频教程：

> Git 相关的入门视频太多了，B 站随便一搜一大把


- 一节课入门：[https://www.bilibili.com/video/BV1s3411g7PS](https://www.bilibili.com/video/BV1s3411g7PS)（18 分钟）
- 一节课入门：[https://www.bilibili.com/video/BV1KD4y1S7FL](https://www.bilibili.com/video/BV1KD4y1S7FL)（10 分钟）
- 5h 打通 Git 全套教程：[https://www.bilibili.com/video/BV1vy4y1s7k6](https://www.bilibili.com/video/BV1vy4y1s7k6)（较完整，时间多的话可以看）

在线游戏：

- ⭐️ Learning Git Branching：[https://learngitbranching.js.org/?locale=zh_CN](https://learngitbranching.js.org/?locale=zh_CN)（帮助你学习 Git 分支的用法）

工具：

- ⭐️ Git 命令大全：[https://backlog.com/git-tutorial/cn/reference/](https://backlog.com/git-tutorial/cn/reference/)（适合收藏）
- Git 参考手册：[http://gitref.justjavac.com/](http://gitref.justjavac.com/)（只列举了常用的命令，不是很全）

### 二、GitHub 基础

可以把 GitHub 简单理解为一个资源网站，第一次接触 GitHub 时直接注册一个账号，然后在搜索框里输入你想搜的东西就可以了，不需要任何的教程。但是如果我们想上传代码到 GitHub、更好地用它来管理项目，还是有必要了解一下平台的玩法。

#### 目标

1. 熟悉 GitHub 基本操作，并能够使用 GitHub 来管理代码
2. 了解如何利用 GitHub 搜索和下载项目代码
3. 了解 GitHub 协作流程；了解开源，并能向开源项目提交代码

#### 知识点

-  什么是 GitHub？ 
-  ⭐️ 如何访问 GitHub？ 
-  ⭐️ 基本概念 
   - 仓库
   - 分支 
      - 主分支
   - README
   - Star
   - Follow
   - 账户类型（个人 / 组织）
-  必备操作 
   -  ⭐️ 搜索仓库 / 代码 
   -  创建仓库 
      -  公开 
      -  私有 
   -  Fork 仓库 
   -  Watch 仓库 
   -  ⭐️ 上传本地代码 
   -  修改个人信息 
-  ⭐️ GitHub Flow 协作流程 
   - 克隆 / Fork 仓库
   - 创建分支
   - 修改代码
   - 发起 Pull Request
   - Code Review
   - Merge 分支
   - 删除分支
-  ⭐️ 了解 GitHub Issues 
-  ⭐️ 贡献代码流程 

#### 学习方法

我们学 GitHub 时主要是了解这个平台提交代码的规则以及和他人协作的方法，因此还是以实践为主。

推荐先在 B 站上找一个 GitHub 的短视频分享，了解下 GitHub 是个啥，大概咋用（下面有推荐视频）。然后再按照 GitHub  官方提供的 [Hello World 入门教程](https://docs.github.com/cn/get-started/quickstart/hello-world) 来实操一遍流程，基本就了解大家是如何在 GitHub 上协作的了。

之后我建议大家可以像读课外书一样阅读下 [《GitHub 漫游指南》](https://github.phodal.com/) ，能够比较全面地加深你对 GitHub 的了解。

#### 资源

文档：

- ⭐️ GitHub 官方 Hello World 入门：[https://docs.github.com/cn/get-started/quickstart/hello-world](https://docs.github.com/cn/get-started/quickstart/hello-world)（带你体验一次完整的 GitHub 开发流程）
- ⭐️ GitHub 漫游指南：[https://github.phodal.com/](https://github.phodal.com/)（很多作者个人的实战经验，建议当课外书读，受益匪浅）
- ⭐️ 教你给开源项目贡献代码：[https://github.com/firstcontributions/first-contributions/blob/master/translations/README.chs.md](https://github.com/firstcontributions/first-contributions/blob/master/translations/README.chs.md)
- ⭐️ 开源指北：[https://oschina.gitee.io/opensource-guide/](https://oschina.gitee.io/opensource-guide/)（给开源新手的保姆级开源百科，建议当课外书读）

视频：

- 一节课入门：[https://www.bilibili.com/video/BV1hS4y1S7wL](https://www.bilibili.com/video/BV1hS4y1S7wL)
- 5 分钟入门：[https://www.bilibili.com/video/BV1hS4y1S7wL](https://www.bilibili.com/video/BV1hS4y1S7wL)
- 如何利用 GitHub 找到优质项目：[https://www.bilibili.com/video/BV1Ki4y1T7Cu](https://www.bilibili.com/video/BV1Ki4y1T7Cu)（鱼皮早期作品，特么青涩！）

工具：

- ⭐️ 如何更快地访问 GitHub：[https://github.com/dotnetcore/FastGithub](https://github.com/dotnetcore/FastGithub)（进不去可以自行百度：fast github）
- ⭐️ GitHub 备忘清单：[https://training.github.com/downloads/zh_CN/github-git-cheat-sheet/](https://training.github.com/downloads/zh_CN/github-git-cheat-sheet/)（包含了常用命令）

### 三、Git 进阶

企业开发项目可能会比较复杂，往往会面临两个问题：

1. 项目更大，更难管理
2. 协作人员更多，更容易出现冲突

如果协作开发时出现了代码冲突，又不了解如何解决的话，就很可能导致提交了错误的代码影响项目，或者丢失自己写过的代码。

因此我们需要进一步了解 Git，学习实际工作中可能要用到的操作、经验和技巧，更好地管理团队项目和协作。

#### 目标

1. 学习 Git 高级操作，尤其是能够熟练地规避和解决冲突
2. 了解企业常用的 Git 协作流程和规范，能独立管理项目

#### 知识点

- 高级操作 
   - 标签（git tag）
   - 检出（git checkout）
   - ⭐️ 贮藏（git stash）
   - 清理（git clean）
   - 变基（git rebase）
   - 重置（git reset）
   - 还原（git revert）
   - 😐 检索（git grep）
   - 😐 展示差异（git diff）
   - 😐 溯源（git blame）
   - 😐 参考日志（git reflog）
   - 😐 交互式命令行（-i 参数）
- ⭐️ 预防冲突
- ⭐️ 解决冲突（重中之重）
- ⭐️ 配置 SSH
- 子模块
- Git 钩子 
   - 提交钩子（pre-commit）
- ⭐️ 忽略提交（Gitignore）
- ⭐️ cherry-pick
- 分布式工作流程
- Git worktree
- Git Flow
- 😐 Git 内部原理
- Monorepo
- 了解其他版本控制系统，和 Git 对比

#### 学习方法

其实我们在大多数情况下是用不到上面那些高级命令的，但是一定要知道有这么个命令和用法，在关键时刻才能想起来，然后再去通过官方文档和百度去搜详情即可。

所以，建议大家有空完整地阅读一遍 Git 的官方文档（支持中文、详细又权威），有些地方看不懂或记不住也没关系（比如像 reset 的几种模式），有个大致的印象就行。

学好 Git 最主要的方法还是多实操，比如实际工作中最实用的技能之一 —— 解决代码冲突，只有经历过的同学才会懂。不过如今的编辑器基本都自带了可视化解决冲突的功能，通过红绿等颜色来区分代码，可比我们用命令行要方便和清晰多了，所以也不用去记忆相关的命令。

另外，建议大家去网上了解一下企业开发中常用的 Git 协作机制，比如怎么定义分支、怎么个提交代码的流程等，如图：

![](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/1/webp#id=nopW5&originHeight=341&originWidth=586&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=shadow&title=)

还可以了解一些 “先进” 的协作方式，比如一些大公司在采用的 Monorepo（单仓 / 大仓）方案，了解它和传统项目管理模式的优缺点。

此外，大家感兴趣的话也可以深入下 Git 工具的原理，如果能够自己做出一个类似的系统，相信在简历上也会是个不错的项目~

#### 资源

- ⭐️ Git 官方文档：[https://git-scm.com/book/zh/v2](https://git-scm.com/book/zh/v2)（强烈推荐，有图有文，全面详细）
- Git Flow 演示学习：[http://danielkummer.github.io/git-flow-cheatsheet/index.zh_CN.html](http://danielkummer.github.io/git-flow-cheatsheet/index.zh_CN.html)
- Git Flow 学习：[https://www.git-tower.com/learn/git/ebook/cn/command-line/advanced-topics/git-flow](https://www.git-tower.com/learn/git/ebook/cn/command-line/advanced-topics/git-flow)
- Monorepo 学习：[https://www.jianshu.com/p/c10d0b8c5581](https://www.jianshu.com/p/c10d0b8c5581)

工具：

- Git 中文开发手册：[https://www.php.cn/manual/view/34943.html](https://www.php.cn/manual/view/34943.html)（可以用来查命令）

### 四、GitHub 进阶

如今 GitHub 的能力已经非常强了，除了代码的管理和检索外，它还集成了各种辅助团队开发和运营的功能。

#### 目标

1. 按需学习更多 GitHub 功能，提升研发效率、更好地管理项目
2. 尝试用心维护和推广自己的 GitHub 项目

#### 知识点

- 开发 
   - ⭐️ 配置 SSH 拉取
   - 😐 GitHub 快捷键
   - 😐 GitHub 命令面板
   - 😐 GitHub Apps
   - 代码安全
- 协作 
   - ⭐️ GitHub Codespaces
   - GitHub Discussions
   - Pull Requests
- 项目管理 
   - Organizations 组织
   - GitHub Issues 问题反馈
   - 😐 GitHub Projects 项目管理
   - Insights 数据分析
   - 贡献者管理
   - 开源协议
- DevOps 
   - ⭐️ GitHub Pages 网站托管
   - Gitpod 代码托管
   - GitHub Actions
   - 😐 GitHub Packages
   - GitHub Webhook
- 😐 Git 私服搭建 
   - GitLab
   - Gogs

#### 学习方法

进阶 GitHub 最好的方式就是 **阅读官方文档** ！

因为首先官方文档通常比任何教程都 **全面、权威、准确** ；再加上 GitHub 的更新迭代很快、时不时会推出一些新功能，导致网上的教程和文章很难做到实时和官方同步。

而 GitHub 的官方文档不仅支持中文，而且写的非常通俗好懂，本身就是一个贴心的教程了。所以建议大家跟着文档来学习，完整阅读一遍后，相信你会学到很多之前完全没关注过的 GitHub 功能，帮助自己更好地利用这个平台。

此外，大家也可以多看一些其他同学分享的 GitHub 小技巧，比如我之前分享过的：按句号键就能用 web 编辑器直接打开项目，从而给我们带来极大的方便。（下面也给大家列举了一些我之前分享过的 GitHub 骚操作）

#### 资源

文档：

- ⭐️ GitHub 官方文档：[https://docs.github.com/cn](https://docs.github.com/cn)
- ⭐️ GitHub 秘籍：[https://snowdream86.gitbooks.io/github-cheat-sheet/content/zh/](https://snowdream86.gitbooks.io/github-cheat-sheet/content/zh/)（收录了一些 Git 和 Github 非常酷同时又少有人知的功能）
- ⭐️ GitHub 隐藏技巧：[https://www.bilibili.com/video/BV1q54y1f7h6](https://www.bilibili.com/video/BV1q54y1f7h6)
- 让你的 GitHub 秒变高大上：[https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247491908&idx=1&sn=568e8c0dcb54a610d886eb992d424273&scene=21#wechat_redirect](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247491908&idx=1&sn=568e8c0dcb54a610d886eb992d424273&scene=21#wechat_redirect)
- GitHub 骚操作：[https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247495440&idx=1&sn=99147cdcb7c881c9d983e7b2373abcdb&scene=21#wechat_redirect](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247495440&idx=1&sn=99147cdcb7c881c9d983e7b2373abcdb&scene=21#wechat_redirect)

工具：

- GitHub 快捷键：[https://docs.github.com/cn/get-started/using-github/keyboard-shortcuts](https://docs.github.com/cn/get-started/using-github/keyboard-shortcuts)
- GitHub 命令面板：[https://docs.github.com/cn/get-started/using-github/github-command-palette](https://docs.github.com/cn/get-started/using-github/github-command-palette)

## 面试考点

其实 Git 在面试中的占比一般是很低的，至少我秋招 20 多轮面试中 1 次都没被问到过。所以大家不用刻意去准备，多去用它、积累经验就好了。

不过时间足够的同学也可以了解一下常见的面试题，比如下面这些：

#### 理论

1. 简述 Git 的原理和工作流程
2. 什么是版本控制系统？为什么需要版本控制系统？
3. git fetch 和 git pull 命令的区别？
4. git rebase 和 git merge 命令的区别？
5. 什么是 Git Flow，它有什么好处？
6. 什么是暂存区？Git 为什么需要暂存区？

#### 实践

1. 分享下你在团队中使用 Git 协作开发的流程（从拉取项目到上线）
2. 如何控制某些文件不被提交？
3. 什么情况下提交会冲突，如何解决冲突？
4. 不小心改错了代码、删除了文件，如何恢复？
5. 不小心提交错了文件，如何撤销？
6. 团队开发中，如何区分和管理分支？
7. 如果让你负责团队，会怎么管理项目的代码？
8. 如何防止错误的代码提交？
