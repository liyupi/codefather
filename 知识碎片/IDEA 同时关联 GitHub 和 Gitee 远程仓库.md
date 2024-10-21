# IDEA 同时关联 GitHub 和 Gitee 远程仓库

> 作者：聪ζ，[编程导航](https://www.codefather.cn) 编号 12852

一. 前言

各位选择代码托管可能选择 GitHub 或者 Gitee，推送也可能 push 其中一个，有没有想过如何同时 push到 GitHub 和 Gitee 以我的 sql-slow-mirror 项目为例子，我使用小号作为演示。 工具：IDEA

二. GitHub 准备工作

新建仓库

1）在 GitHub 上面新建空白项目

![](https://pic.yupi.icu/5563/202404212025543.png)

2）新建空白项目之后得到一条.git的仓库地址，记录下来后续有用

仓库地址举例：https://github.com/xxxx/sql-slow-mirror.git

![](https://pic.yupi.icu/5563/202404212025553.png)

三. Gitee 准备工作

新建仓库

1）和 GitHub 操作同理，新建空白项目：

![](https://pic.yupi.icu/5563/202404212025669.png)

2）新建空白项目之后得到一条 .git 的链接，记录下来后续有用

仓库地址举例：https://gitee.com/xxx/sql-slow-mirror.git

![](https://pic.yupi.icu/5563/202404212025533.png)

四. idea 配置远程仓库地址

为了演示效果，将 .idea 文件夹删除

建立本地 git本地代码仓库

相信各位新建项目，想推送到远程代码仓库都是这样的：

![](https://pic.yupi.icu/5563/202404212025564.png)

点击 create Git repository，就能将代码托管到本地

配置远程代码仓库地址

1）本地git

此时可以找到git->GitHub->share project on GitHub 可以推送到 GitHub，即可退出

此操作就不需要在GitHub上创建新仓库

![](https://pic.yupi.icu/5563/202404212025545.png)

以上操作可以通过 idea 简单地完成单一远程代码仓库 GitHub 托管，如果我想每次更新都能推送 GitHub 和 Gitee 甚至 GitLab 或其他呢？就可以点击 Manage Remotes：

![](https://pic.yupi.icu/5563/202404212025152.png)

2）连接远程地址

此时，上文所提及到的远程地址就有用处了 需要填写 Name 和 URL，NAME 就填写一个，个人习惯是按照仓库不同填写 Gitee 和 Github:

![](https://pic.yupi.icu/5563/202404212025344.png)

填写 Gitee 和 GitHub之后如下：

![](https://pic.yupi.icu/5563/202404212025208.png)

3）愉快的代码提交

接下来我们进行代码修改需要推送，git push操作就可以推送到我们想要推送的远程代码仓库中了：

![](https://pic.yupi.icu/5563/202404212025205.png)

就可以分别推送到 GitHub 和 Gitee：﻿﻿

![](https://pic.yupi.icu/5563/202404212025221.png)

4）推送成功

点击 Psuh 成功后就能在自己的仓库页面看到更新内容啦：

![](https://pic.yupi.icu/5563/202404212025331.png)

