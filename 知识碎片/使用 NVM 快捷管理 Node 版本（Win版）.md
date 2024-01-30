# 使用 NVM 快捷管理 Node 版本（Win版）

> 作者：[Yovvis](https://blog.yovvis.top)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 22369

在Windows环境中安装NVM对不同的Node版本进行管理，同时提供npm和yarn包管理器常用配置。

## NVM管理Node版本

> 环境：win11 注意：^标识为推荐掌握

### 1、下载NVM

**1、下载的是免安装版**`nvm-noinstall.zip`，版本号为：`1.1.12`

![](https://pic.yupi.icu/5563/202401261637488.png)

**免安装版本是没有settings文件的**

![](https://pic.yupi.icu/5563/202401261637694.png)

**需要加一个**`settings.txt`文件，下方配置可以自行修改

```awk
root: D:\envs\nvm
path: D:\envs\nvm\nodejs
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

1. **root** **解压缩nvm的路径**
2. **path** **要安装nodejs的路径**
3. **node_mirror** **node镜像源 可替换为taobao的**
4. **npm_mirror** **npm镜像源 可替换为taobao的**

### 2、配置系统参数

**系统变量**`比对settings.txt`文件的的root和path

```taggerscript
NVM_HOME 
D:\envs\nvm

NVM_SYMLINK 
D:\envs\nvm\nodejs
```

**环境路径（没有安装yarn就不需要配yarn的相关配置）**

```taggerscript
%NVM_HOME%

%NVM_SYMLINK%

-- 如果配置了第5点和第6点需要新加下面配置，yarn的配置路径需要具体到bin
D:\envs\nvm\node_global
D:\envs\nvm\yarn_global\bin
```

***ps（提醒）：***

- **up的prefix和folder是放在同一目录的，请各位酌情而定，具体为啥给出上述配置，相信看到第五步和第六步的可以理解；**
- **这里先给出node和yarn的全局安装目录的路径，仅起强调作用，具体的路径需看实际情况，有的uu喜欢放在C盘。**

**这里给上up的环境变量配置**

**1、系统变量**

![](https://pic.yupi.icu/5563/202401261637370.png)

**2、环境配置**

![](https://pic.yupi.icu/5563/202401261638626.png)

### 3、安装Node

**指定版本号安装（推荐使用）**

```apache
nvm install 18.16.0
```

**查看可安装版本（常用，在想安装之前执行一下）**

```arduino
nvm list available
```

`^`安装最新版本（不推荐）

```cmake
nvm install latest
```

`^`安装最新LTS版本（不常用）

```cmake
nvm install lts
删除某个版本Node
nvm uninstall 16.20.1
```

***切换Node版本***

**查看已安装的Node版本**

```bash
nvm ls
```

使用某个版本Node，并查看

```sh
nvm use 18.16.0
```

![](https://pic.yupi.icu/5563/202401261644707.png)

**yes，成功！**

### 4、修改npm路径

***ps：默认是在C盘下，不介意全在C盘可以不配置***

```routeros
npm config set prefix "D:\envs\nvm\node_global"
npm config set cache "D:\envs\nvm\node_cache"
```

`^`查看全局命令

```coffeescript
npm prefix -g 
npm config ls
```

**执行**`npm config ls`，得到配置如下

![](https://pic.yupi.icu/5563/202401261645136.png)

### 5、修改yarn配置

***ps：默认是在C盘下，不介意全在C盘可以不配置,***

***安装yarn之前务必确认第五步需不需要，再检查有没有配置环境变量***

**全局安装yarn**

```cmake
npm install yarn -g
```

**配置yarn路径（不配置yarn安装的包会在C盘下，不介意可以不配）**

```routeros
yarn config set prefix "D:\envs\nvm\yarn_global"
yarn config set global-folder "D:\envs\nvm\yarn_global"
yarn config set cache-folder "D:\envs\nvm\yarn_cache"
```

`^`关闭代理服务器访问（可以不配，如果yarn安装包报证书失效可以执行）

```routeros
yarn config set "strict-ssl" false -g
```

`^`查看yarn目录

```python
yarn global bin
yarn global dir
yarn cache dir
```

`^`查看配置命令

```arduino
yarn config list
```

**执行**`yarn config list`，配置如下

![](https://pic.yupi.icu/5563/202401261646268.png)

### 6、检查nvm文件夹

**最后的最后，如果就是检查一下**

- **我们npm全局安装的在node_global下**
- **我们yarn全局安装的在yarn_global下（在本目录或者下一级的bin目录中）**

![](https://pic.yupi.icu/5563/202401261646840.png)

