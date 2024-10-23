# MySQL8 绿色版安装

> 作者：Leo，[编程导航](https://www.codefather.cn) 编号 12644

## 1.前言☕

> 注意：这里简单粗暴，我是考虑到后面可能搭建集群，不想太麻烦，这里就考虑的是MySQL绿色版。

## 2.下载MySQL

1. 进入官网找到自己所需的安装包：[MySQL :: Developer Zone](https://dev.mysql.com/downloads/mysql/)，

2. 软件路径：DOWNLOAD–>MYSQL Community Downloads–>MYSQL on Windows

   ![](https://pic.yupi.icu/5563/202403311957025.png)

## 3.进行解压

可以看到这个就是我们刚下载的MySQL8.2压缩包

![](https://pic.yupi.icu/5563/202403311957990.png)

**解压zip压缩包至想要安装的目录，比如解压到 D:\mysql-8.2.0-winx64**

![](https://pic.yupi.icu/5563/202403311957969.png)

## 4.配置my.ini文件

**在解压目录**mysql-8.2.0-winx64中创建[MySQL配置文件](https://so.csdn.net/so/search?q=MySQL配置文件&spm=1001.2101.3001.7020)**my.ini**

![](https://pic.yupi.icu/5563/202403311957979.png)

配置文件**my.ini**内容如下

```sql
[mysqld]
# 设置3307端口
port=3307
# 设置mysql的安装目录
basedir=D:\\software\mysql-8.2.0-winx64
# 设置mysql数据库的数据的存放目录
datadir=D:\\software\MySQLData\mysql81\Data
# 允许最大连接数
max_connections=200
# 允许连接失败的次数。这是为了防止有人从该主机试图攻击数据库系统
max_connect_errors=10
# 服务端使用的字符集默认为UTF8
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
# 默认使用“mysql_native_password”插件认证
default_authentication_plugin=mysql_native_password
[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8mb4
[client]
# 设置mysql客户端连接服务端时默认使用的端口
port=3306
default-character-set=utf8
```

![](https://pic.yupi.icu/5563/202403311957081.png)

## 5.安装前准备

**以管理员身份打开命令行，切换到安装MySQL的目录下，再切换到bin目录下**

![](https://pic.yupi.icu/5563/202403311957041.png)

**然后切换到mysql的bin目录下**

## 6.开始安装

**执行MySQL初始化命令，如下：**

```sql
mysqld --initialize --console
```

![](https://pic.yupi.icu/5563/202403311957384.png)

**初始化完成后生成的用户名和密码（红框所示位置即为密码），即root用户和生成的密码，后续我们可以更改。**

**安装MySQL的服务mysqld，同样在bin目录下，执行MySQL服务安装命令 mysqld --install 服务名(不写的话默认服务名是mysql)**

```scss
mysqld --install 你的服务名 (笔者这里设置为mysql81)
```

![](https://pic.yupi.icu/5563/202403311957488.png)

看到以下 `successfully`就表示已经成功了。

![](https://pic.yupi.icu/5563/202403311957481.png)

启动MySQL服务，命令为：net start mysql81。其中(停止服务：net stop mysql81 ，卸载服务：sc delete 服务名)

![](https://pic.yupi.icu/5563/202403311957559.png)

## 7.登录MySQL

**输入命令：mysql -u root -p ，（其中-u root表示用户名为root，-p表示登录密码）登录，然后提示输入密码，密位为先前初始化红框所示。**

![](https://pic.yupi.icu/5563/202403311957762.png)

密码填上刚才给我生成的密码。

![](https://pic.yupi.icu/5563/202403311957837.png)

可以看到，我们成功登录到系统中。

**由于自动生成的密码比较复杂，我们可以更改密码，更改密码命令为：**

```sql
ALTER USER root@localhost IDENTIFIED BY 'root';
```

**其中单引号内为更改后的密码**

![](https://pic.yupi.icu/5563/202403311957880.png)

**然后输入exit;命令退出mysql，重新登录mysql检验一下密码是否修改成功，**

![](https://pic.yupi.icu/5563/202403311957870.png)

## 8.远程测试

本地工作基本已经完成了，但是我们日常工作中是不会使用这个黑框框的。我们都会使用远程来数据库管理软件来操作我们的数据库。

笔者这里使用的是Navicat，大家自行选择即可，如果需要Navicat最新版可私信博主获取下载链接。

我们打开Navicat。

这里建立一个MySQL连接，然后填写密码和端口号。

![](https://pic.yupi.icu/5563/202403311957106.png)

首先点一下测试连接，看看是否正常。

![](https://pic.yupi.icu/5563/202403311957163.png)

可以看出来完全没有问题。![](https://pic.yupi.icu/5563/202403311957267.png)

然后就进去了这个界面，发现我们的MySQL8安装已经完工啦！