# 前端初始化 Ant Design Pro 笔记

> 作者：[D](https://www.codefather.cn/user/1725503305326653441/info)，[编程导航](https://www.codefather.cn) 编号 29052

1. npm i @ant-design/pro-cli -g
2. npx pro create myapp

## 注意 如果需要UMI UI插件就选择umi@3

![](https://pic.yupi.icu/5563/202311220900308.png) 3. 打开项目后，需要运行npm

1. 终端运行yarn,下载依赖
2. 运行：在package.json中找到start并运行

## 然后就是小米饭插件的构建，这里请运行下面的命令，且保证是在umi@3项目中 （重要的事情说三遍文件夹myapp）

1. yarn add @umijs/preset-ui -D

### Node降级

#### 使用nvm

下面是nvm的下载地址（推荐下载1.1.7 nvm-setup.zip）

https://github.com/coreybutler/nvm-windows/releases/tag/1.1.7

##### 解压，安装后在终端查看是否安装成功：nvm -v

如果出现nvm的版本号就是成功！！！

### nvm配置淘宝镜像

在 settings.txt 文件中最后一行添加如下两行配置：

node_mirror: https://npm.taobao.org/mirrors/node/ npm_mirror: https://npm.taobao.org/mirrors/npm/

#### 使用以下命令安装Node.js 16.15：（可能需要一丢丢时间，受网速影响）

nvm install 16.15

#### 安装完成后，使用以下命令切换到Node.js 16.15：

nvm use 16.15

#### 如果你想将Node.js 16.15设置为默认版本：

nvm alias default 16.15

### Node配置淘宝镜像

- 全局使用淘宝源

  npm config set registry [https://registry.npm.taobao.org](https://registry.npm.taobao.org/)

- 临时使用淘宝源

  npm --registry [https://registry.npm.taobao.org](https://registry.npm.taobao.org/) install [node](https://so.csdn.net/so/search?q=node&spm=1001.2101.3001.7020)-red-contrib-composer@latest

- 查看当前源

  npm config get registry

### 安装yarn

全局安装命令：

npm install -g yarn

#### 同样先在yarn的安装目录下创建yarn_global和yarn_cache文件夹，并打开命令窗口执行以下命令。

- yarn config set global-folder （跟着yarn的安装路径）
- yarn config set cache-folder （跟着yarn的安装路径）

### 更换镜像源

- 查看当前源

  yarn config get registry

- 修改为淘宝镜像源

  yarn config set registry [https://registry.npm.taobao.org](https://registry.npm.taobao.org/)

- 修改为官方镜像源

yarn config set registry [https://registry.yarnpkg.com](https://registry.yarnpkg.com/)

## 前端瘦身（只记了这几个，不敢删太多怕跑不起来）

- 去除国际化

在package.json包中执行 “i8n-remove ” 脚本

- src下的e2e包可以删除（里面是测试业务流程的）
- src-services-swagger包可以删除（接口文档工具）
- config-openapi.json(定义项目用到的接口)，看了鱼皮启动报错了，记得找到用到的openAPI配置删除
- Tests文件可以删除（除非大项目）

### 注意删一个文件启动一遍，预防项目跑不起来！！！

## 下面是我前端初始化踩的坑

- Node版本过高（最初Node版本是18.18.0），在运行Ant Design Pro的时候报错了，接着又弄了半天的nvm
- 在弄nvm的时候问GPT需不需要卸载前面安装的Node版本，GPT回答不需要，然而结果是需要的，被GPT虚晃一枪了
- 在弄小米饭插件的时候又弄了yarn,因为用的npm下的yarn然后没有配环境，又接着弄了半小时，唉，也许当初直接使用nvm就不会踩坑，浪费了好多时间
- 接着装上小米饭插件又访问不到界面，挂了梯子也不行，emmm,问了编程导航里的小伙伴，还是没有找到问题所在处，也无关紧要了，反正后面用不到这个插件

## 总结

- 了解前端初始化Ant Design Pro的过程
- 知道了企业中是使用nvm来切换Node版本的（确实很方便）