# 通过 Windows 脚本执行打包操作

> 作者：[To be a better man](https://wx.zsxq.com/dweb2/index/footprint/414152211212828)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 2908

之前我们打包都是这么操作的：

![](https://pic.yupi.icu/5563/202311271528556.png)

其实还有更方便的操作，即通过编写脚本，然后双击运行脚本来实现打包操作。

### 1. 通过脚本执行打包操作

#### 1.1. windows 打包脚本

1. 文件位置：需要打包的程序的`src`的同级路径下

![](https://pic.yupi.icu/5563/202311271528551.png)



1. 创建`txt`文件，拷贝下面的代码，然后修改文件后缀为`.bat`

```plsql
@echo off
echo [INFO] build and install modules.
call mvn clean install -Dmaven.test.skip=true
pause
```

命令解释：

- @echo off: 关闭命令回显，这样在执行过程中不会显示命令本身。
- echo [INFO] build and install modules.: 输出一条信息，表示正在构建和安装模块。
- call mvn clean install -Dmaven.test.skip=true: 调用Maven命令来执行构建和安装操作。其中，

- - clean表示先清理之前的构建结果
  - install表示安装构建好的模块
  - -Dmaven.test.skip=true是一个Maven参数，用于跳过测试阶段，直接进行构建和安装。

- pause: 暂停程序执行，等待用户按下任意键继续。



1. 双击脚本，即可执行打包操作