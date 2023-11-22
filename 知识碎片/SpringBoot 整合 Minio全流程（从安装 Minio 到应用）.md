# SpringBoot 整合 Minio全流程（从安装 Minio 到应用）

> 作者：[南侠](https://gitee.com/crzzx)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 29240

详细介绍了如何在centos7系统安装docker，然后在docker上安装minio，最后在spring boot集成minio并应用的全过程

## 一、centos7安装docker

参考博客：centos7安装Docker详细步骤（无坑版教程）-腾讯云开发者社区-腾讯云 https://cloud.tencent.com/developer/article/1701451 以下是我个人操作的过程截图。

```bash
Linux 内核：官方建议 3.10 以上，3.8以上貌似也可。
注意：本文的命令使用的是 root 用户登录执行，不是 root 的话所有命令前面要加 sudo
[root@zzx ~]# uname -r
3.10.0-957.21.3.el7.x86_64
安装需要的软件包， yum-util 提供yum-config-manager功能，另两个是devicemapper驱动依赖
[root@zzx ~]# yum install -y yum-utils device-mapper-persistent-data lvm2
Loaded plugins: fastestmirror
Determining fastest mirrors
 * centos-sclo-rh: ftp.sjtu.edu.cn
base                                                                                                                                                      | 3.6 kB  00:00:00     
centos-sclo-rh                                                                                                                                            | 3.0 kB  00:00:00     
epel                                                                                                                                                      | 4.7 kB  00:00:00     
extras                                                                                                                                                    | 2.9 kB  00:00:00     
updates                                                                                                                                                   | 2.9 kB  00:00:00     
zerotier                                                                                                                                                  | 3.0 kB  00:00:00     
(1/3): epel/x86_64/updateinfo                                                                                                                             | 1.0 MB  00:00:00     
(2/3): epel/x86_64/primary_db                                                                                                                             | 7.0 MB  00:00:00     
(3/3): updates/7/x86_64/primary_db                                                                                                                        |  24 MB  00:00:00     
Resolving Dependencies
--> Running transaction check
---> Package device-mapper-persistent-data.x86_64 0:0.8.5-3.el7_9.2 will be installed
---> Package lvm2.x86_64 7:2.02.187-6.el7_9.5 will be installed
--> Processing Dependency: lvm2-libs = 7:2.02.187-6.el7_9.5 for package: 7:lvm2-2.02.187-6.el7_9.5.x86_64
--> Processing Dependency: liblvm2app.so.2.2(Base)(64bit) for package: 7:lvm2-2.02.187-6.el7_9.5.x86_64
--> Processing Dependency: libdevmapper-event.so.1.02(Base)(64bit) for package: 7:lvm2-2.02.187-6.el7_9.5.x86_64
--> Processing Dependency: liblvm2app.so.2.2()(64bit) for package: 7:lvm2-2.02.187-6.el7_9.5.x86_64
--> Processing Dependency: libdevmapper-event.so.1.02()(64bit) for package: 7:lvm2-2.02.187-6.el7_9.5.x86_64
---> Package yum-utils.noarch 0:1.1.31-54.el7_8 will be installed
--> Processing Dependency: python-kitchen for package: yum-utils-1.1.31-54.el7_8.noarch
--> Running transaction check
---> Package device-mapper-event-libs.x86_64 7:1.02.170-6.el7_9.5 will be installed
---> Package lvm2-libs.x86_64 7:2.02.187-6.el7_9.5 will be installed
--> Processing Dependency: device-mapper-event = 7:1.02.170-6.el7_9.5 for package: 7:lvm2-libs-2.02.187-6.el7_9.5.x86_64
---> Package python-kitchen.noarch 0:1.1.1-5.el7 will be installed
--> Processing Dependency: python-chardet for package: python-kitchen-1.1.1-5.el7.noarch
--> Running transaction check
---> Package device-mapper-event.x86_64 7:1.02.170-6.el7_9.5 will be installed
--> Processing Dependency: device-mapper = 7:1.02.170-6.el7_9.5 for package: 7:device-mapper-event-1.02.170-6.el7_9.5.x86_64
---> Package python-chardet.noarch 0:2.2.1-3.el7 will be installed
--> Running transaction check
---> Package device-mapper.x86_64 7:1.02.149-10.el7_6.8 will be updated
--> Processing Dependency: device-mapper = 7:1.02.149-10.el7_6.8 for package: 7:device-mapper-libs-1.02.149-10.el7_6.8.x86_64
---> Package device-mapper.x86_64 7:1.02.170-6.el7_9.5 will be an update
--> Running transaction check
---> Package device-mapper-libs.x86_64 7:1.02.149-10.el7_6.8 will be updated
---> Package device-mapper-libs.x86_64 7:1.02.170-6.el7_9.5 will be an update
--> Finished Dependency Resolution

Dependencies Resolved

=================================================================================================================================================================================
 Package                                                 Arch                             Version                                        Repository                         Size
=================================================================================================================================================================================
Installing:
 device-mapper-persistent-data                           x86_64                           0.8.5-3.el7_9.2                                updates                           423 k
 lvm2                                                    x86_64                           7:2.02.187-6.el7_9.5                           updates                           1.3 M
 yum-utils                                               noarch                           1.1.31-54.el7_8                                base                              122 k
Installing for dependencies:
 device-mapper-event                                     x86_64                           7:1.02.170-6.el7_9.5                           updates                           192 k
 device-mapper-event-libs                                x86_64                           7:1.02.170-6.el7_9.5                           updates                           192 k
 lvm2-libs                                               x86_64                           7:2.02.187-6.el7_9.5                           updates                           1.1 M
 python-chardet                                          noarch                           2.2.1-3.el7                                    base                              227 k
 python-kitchen                                          noarch                           1.1.1-5.el7                                    base                              267 k
Updating for dependencies:
 device-mapper                                           x86_64                           7:1.02.170-6.el7_9.5                           updates                           297 k
 device-mapper-libs                                      x86_64                           7:1.02.170-6.el7_9.5                           updates                           325 k

Transaction Summary
=================================================================================================================================================================================
Install  3 Packages (+5 Dependent packages)
Upgrade             ( 2 Dependent packages)

Total download size: 4.4 M
Downloading packages:
Delta RPMs disabled because /usr/bin/applydeltarpm not installed.
(1/10): device-mapper-event-1.02.170-6.el7_9.5.x86_64.rpm                                                                                                 | 192 kB  00:00:00     
(2/10): device-mapper-1.02.170-6.el7_9.5.x86_64.rpm                                                                                                       | 297 kB  00:00:00     
(3/10): device-mapper-libs-1.02.170-6.el7_9.5.x86_64.rpm                                                                                                  | 325 kB  00:00:00     
(4/10): device-mapper-event-libs-1.02.170-6.el7_9.5.x86_64.rpm                                                                                            | 192 kB  00:00:00     
(5/10): device-mapper-persistent-data-0.8.5-3.el7_9.2.x86_64.rpm                                                                                          | 423 kB  00:00:00     
(6/10): lvm2-libs-2.02.187-6.el7_9.5.x86_64.rpm                                                                                                           | 1.1 MB  00:00:00     
(7/10): lvm2-2.02.187-6.el7_9.5.x86_64.rpm                                                                                                                | 1.3 MB  00:00:00     
(8/10): python-kitchen-1.1.1-5.el7.noarch.rpm                                                                                                             | 267 kB  00:00:00     
(9/10): python-chardet-2.2.1-3.el7.noarch.rpm                                                                                                             | 227 kB  00:00:00     
(10/10): yum-utils-1.1.31-54.el7_8.noarch.rpm                                                                                                             | 122 kB  00:00:00     
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Total                                                                                                                                             14 MB/s | 4.4 MB  00:00:00     
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Updating   : 7:device-mapper-libs-1.02.170-6.el7_9.5.x86_64                                                                                                               1/12 
  Updating   : 7:device-mapper-1.02.170-6.el7_9.5.x86_64                                                                                                                    2/12 
  Installing : 7:device-mapper-event-libs-1.02.170-6.el7_9.5.x86_64                                                                                                         3/12 
  Installing : 7:device-mapper-event-1.02.170-6.el7_9.5.x86_64                                                                                                              4/12 
  Installing : 7:lvm2-libs-2.02.187-6.el7_9.5.x86_64                                                                                                                        5/12 
  Installing : device-mapper-persistent-data-0.8.5-3.el7_9.2.x86_64                                                                                                         6/12 
  Installing : python-chardet-2.2.1-3.el7.noarch                                                                                                                            7/12 
  Installing : python-kitchen-1.1.1-5.el7.noarch                                                                                                                            8/12 
  Installing : yum-utils-1.1.31-54.el7_8.noarch                                                                                                                             9/12 
  Installing : 7:lvm2-2.02.187-6.el7_9.5.x86_64                                                                                                                            10/12 
  Cleanup    : 7:device-mapper-libs-1.02.149-10.el7_6.8.x86_64                                                                                                             11/12 
  Cleanup    : 7:device-mapper-1.02.149-10.el7_6.8.x86_64                                                                                                                  12/12 
  Verifying  : 7:device-mapper-event-libs-1.02.170-6.el7_9.5.x86_64                                                                                                         1/12 
  Verifying  : python-chardet-2.2.1-3.el7.noarch                                                                                                                            2/12 
  Verifying  : 7:lvm2-libs-2.02.187-6.el7_9.5.x86_64                                                                                                                        3/12 
  Verifying  : device-mapper-persistent-data-0.8.5-3.el7_9.2.x86_64                                                                                                         4/12 
  Verifying  : 7:device-mapper-1.02.170-6.el7_9.5.x86_64                                                                                                                    5/12 
  Verifying  : 7:device-mapper-event-1.02.170-6.el7_9.5.x86_64                                                                                                              6/12 
  Verifying  : python-kitchen-1.1.1-5.el7.noarch                                                                                                                            7/12 
  Verifying  : 7:lvm2-2.02.187-6.el7_9.5.x86_64                                                                                                                             8/12 
  Verifying  : 7:device-mapper-libs-1.02.170-6.el7_9.5.x86_64                                                                                                               9/12 
  Verifying  : yum-utils-1.1.31-54.el7_8.noarch                                                                                                                            10/12 
  Verifying  : 7:device-mapper-libs-1.02.149-10.el7_6.8.x86_64                                                                                                             11/12 
  Verifying  : 7:device-mapper-1.02.149-10.el7_6.8.x86_64                                                                                                                  12/12 

Installed:
  device-mapper-persistent-data.x86_64 0:0.8.5-3.el7_9.2                  lvm2.x86_64 7:2.02.187-6.el7_9.5                  yum-utils.noarch 0:1.1.31-54.el7_8                 

Dependency Installed:
  device-mapper-event.x86_64 7:1.02.170-6.el7_9.5 device-mapper-event-libs.x86_64 7:1.02.170-6.el7_9.5 lvm2-libs.x86_64 7:2.02.187-6.el7_9.5 python-chardet.noarch 0:2.2.1-3.el7
  python-kitchen.noarch 0:1.1.1-5.el7            

Dependency Updated:
  device-mapper.x86_64 7:1.02.170-6.el7_9.5                                            device-mapper-libs.x86_64 7:1.02.170-6.el7_9.5                                           

Complete!
设置一个yum源
[root@zzx ~]# yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
Loaded plugins: fastestmirror
adding repo from: http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
grabbing file http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo to /etc/yum.repos.d/docker-ce.repo
repo saved to /etc/yum.repos.d/docker-ce.repo
查看Docker可用版本有哪些
[root@zzx ~]# yum list docker-ce --showduplicates | sort -r
Loading mirror speeds from cached hostfile
Loaded plugins: fastestmirror
docker-ce.x86_64            3:24.0.7-1.el7                      docker-ce-stable
docker-ce.x86_64            3:24.0.6-1.el7                      docker-ce-stable
docker-ce.x86_64            3:24.0.5-1.el7                      docker-ce-stable
docker-ce.x86_64            3:24.0.4-1.el7                      docker-ce-stable
docker-ce.x86_64            3:24.0.3-1.el7                      docker-ce-stable
docker-ce.x86_64            3:24.0.2-1.el7                      docker-ce-stable
docker-ce.x86_64            3:24.0.1-1.el7                      docker-ce-stable
docker-ce.x86_64            3:24.0.0-1.el7                      docker-ce-stable
docker-ce.x86_64            3:23.0.6-1.el7                      docker-ce-stable
docker-ce.x86_64            3:23.0.5-1.el7                      docker-ce-stable
docker-ce.x86_64            3:23.0.4-1.el7                      docker-ce-stable
docker-ce.x86_64            3:23.0.3-1.el7                      docker-ce-stable
docker-ce.x86_64            3:23.0.2-1.el7                      docker-ce-stable
docker-ce.x86_64            3:23.0.1-1.el7                      docker-ce-stable
docker-ce.x86_64            3:23.0.0-1.el7                      docker-ce-stable
docker-ce.x86_64            3:20.10.9-3.el7                     docker-ce-stable
docker-ce.x86_64            3:20.10.8-3.el7                     docker-ce-stable
docker-ce.x86_64            3:20.10.7-3.el7                     docker-ce-stable
docker-ce.x86_64            3:20.10.6-3.el7                     docker-ce-stable
docker-ce.x86_64            3:20.10.5-3.el7                     docker-ce-stable
docker-ce.x86_64            3:20.10.4-3.el7                     docker-ce-stable
docker-ce.x86_64            3:20.10.3-3.el7                     docker-ce-stable
docker-ce.x86_64            3:20.10.24-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.2-3.el7                     docker-ce-stable
docker-ce.x86_64            3:20.10.23-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.22-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.21-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.20-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.19-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.18-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.17-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.16-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.15-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.14-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.1-3.el7                     docker-ce-stable
docker-ce.x86_64            3:20.10.13-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.12-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.11-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.10-3.el7                    docker-ce-stable
docker-ce.x86_64            3:20.10.0-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.9-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.8-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.7-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.6-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.5-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.4-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.3-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.2-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.15-3.el7                    docker-ce-stable
docker-ce.x86_64            3:19.03.14-3.el7                    docker-ce-stable
docker-ce.x86_64            3:19.03.1-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.13-3.el7                    docker-ce-stable
docker-ce.x86_64            3:19.03.12-3.el7                    docker-ce-stable
docker-ce.x86_64            3:19.03.11-3.el7                    docker-ce-stable
docker-ce.x86_64            3:19.03.10-3.el7                    docker-ce-stable
docker-ce.x86_64            3:19.03.0-3.el7                     docker-ce-stable
docker-ce.x86_64            3:18.09.9-3.el7                     docker-ce-stable
docker-ce.x86_64            3:18.09.8-3.el7                     docker-ce-stable
docker-ce.x86_64            3:18.09.7-3.el7                     docker-ce-stable
docker-ce.x86_64            3:18.09.6-3.el7                     docker-ce-stable
docker-ce.x86_64            3:18.09.5-3.el7                     docker-ce-stable
docker-ce.x86_64            3:18.09.4-3.el7                     docker-ce-stable
docker-ce.x86_64            3:18.09.3-3.el7                     docker-ce-stable
docker-ce.x86_64            3:18.09.2-3.el7                     docker-ce-stable
docker-ce.x86_64            3:18.09.1-3.el7                     docker-ce-stable
docker-ce.x86_64            3:18.09.0-3.el7                     docker-ce-stable
docker-ce.x86_64            18.06.3.ce-3.el7                    docker-ce-stable
docker-ce.x86_64            18.06.2.ce-3.el7                    docker-ce-stable
docker-ce.x86_64            18.06.1.ce-3.el7                    docker-ce-stable
docker-ce.x86_64            18.06.0.ce-3.el7                    docker-ce-stable
docker-ce.x86_64            18.03.1.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            18.03.0.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            17.12.1.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            17.12.0.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            17.09.1.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            17.09.0.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            17.06.2.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            17.06.1.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            17.06.0.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            17.03.3.ce-1.el7                    docker-ce-stable
docker-ce.x86_64            17.03.2.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            17.03.1.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            17.03.0.ce-1.el7.centos             docker-ce-stable
 * centos-sclo-rh: ftp.sjtu.edu.cn
Available Packages
选择一个版本并安装：yum install docker-ce-版本号
[root@zzx ~]# yum -y install docker-ce-18.03.1.ce
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
 * centos-sclo-rh: ftp.sjtu.edu.cn
Resolving Dependencies
--> Running transaction check
---> Package docker-ce.x86_64 0:18.03.1.ce-1.el7.centos will be installed
--> Processing Dependency: container-selinux >= 2.9 for package: docker-ce-18.03.1.ce-1.el7.centos.x86_64
--> Processing Dependency: pigz for package: docker-ce-18.03.1.ce-1.el7.centos.x86_64
--> Running transaction check
---> Package container-selinux.noarch 2:2.119.2-1.911c772.el7_8 will be installed
---> Package pigz.x86_64 0:2.3.4-1.el7 will be installed
--> Finished Dependency Resolution

Dependencies Resolved

=================================================================================================================================================================================
 Package                                    Arch                            Version                                              Repository                                 Size
=================================================================================================================================================================================
Installing:
 docker-ce                                  x86_64                          18.03.1.ce-1.el7.centos                              docker-ce-stable                           35 M
Installing for dependencies:
 container-selinux                          noarch                          2:2.119.2-1.911c772.el7_8                            extras                                     40 k
 pigz                                       x86_64                          2.3.4-1.el7                                          epel                                       81 k

Transaction Summary
=================================================================================================================================================================================
Install  1 Package (+2 Dependent packages)

Total download size: 35 M
Installed size: 35 M
Downloading packages:
(1/3): container-selinux-2.119.2-1.911c772.el7_8.noarch.rpm                                                                                               |  40 kB  00:00:00     
(2/3): pigz-2.3.4-1.el7.x86_64.rpm                                                                                                                        |  81 kB  00:00:00     
warning: /var/cache/yum/x86_64/7/docker-ce-stable/packages/docker-ce-18.03.1.ce-1.el7.centos.x86_64.rpm: Header V4 RSA/SHA512 Signature, key ID 621e9f35: NOKEY MB  00:00:00 ETA 
Public key for docker-ce-18.03.1.ce-1.el7.centos.x86_64.rpm is not installed
(3/3): docker-ce-18.03.1.ce-1.el7.centos.x86_64.rpm                                                                                                       |  35 MB  00:00:02     
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Total                                                                                                                                             15 MB/s |  35 MB  00:00:02     
Retrieving key from https://mirrors.aliyun.com/docker-ce/linux/centos/gpg
Importing GPG key 0x621E9F35:
 Userid     : "Docker Release (CE rpm) <docker@docker.com>"
 Fingerprint: 060a 61c5 1b55 8a7f 742b 77aa c52f eb6b 621e 9f35
 From       : https://mirrors.aliyun.com/docker-ce/linux/centos/gpg
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : 2:container-selinux-2.119.2-1.911c772.el7_8.noarch                                                                                                            1/3 
setsebool:  SELinux is disabled.
  Installing : pigz-2.3.4-1.el7.x86_64                                                                                                                                       2/3 
  Installing : docker-ce-18.03.1.ce-1.el7.centos.x86_64                                                                                                                      3/3 
  Verifying  : pigz-2.3.4-1.el7.x86_64                                                                                                                                       1/3 
  Verifying  : docker-ce-18.03.1.ce-1.el7.centos.x86_64                                                                                                                      2/3 
  Verifying  : 2:container-selinux-2.119.2-1.911c772.el7_8.noarch                                                                                                            3/3 

Installed:
  docker-ce.x86_64 0:18.03.1.ce-1.el7.centos                                                                                                                                     

Dependency Installed:
  container-selinux.noarch 2:2.119.2-1.911c772.el7_8                                                  pigz.x86_64 0:2.3.4-1.el7                                                 

Complete!
启动 Docker 并设置开机自启
[root@zzx ~]# systemctl start docker
[root@zzx ~]# systemctl enable docker
Created symlink from /etc/systemd/system/multi-user.target.wants/docker.service to /usr/lib/systemd/system/docker.service.
验证
[root@zzx ~]# docker version
Client:
 Version:      18.03.1-ce
 API version:  1.37
 Go version:   go1.9.5
 Git commit:   9ee9f40
 Built:        Thu Apr 26 07:20:16 2018
 OS/Arch:      linux/amd64
 Experimental: false
 Orchestrator: swarm

Server:
 Engine:
  Version:      18.03.1-ce
  API version:  1.37 (minimum version 1.12)
  Go version:   go1.9.5
  Git commit:   9ee9f40
  Built:        Thu Apr 26 07:23:58 2018
  OS/Arch:      linux/amd64
  Experimental: false
[root@zzx ~]# 
```

## 二、linux系统docker安装minio并部署

## （1）docker安装

详情请看：P1

## （2）docker安装配置minio

该部分基本照抄这篇博客，找了很多资料和博客，就这篇最靠谱：[Docker 搭建 Minio 对象存储服务 - 掘金 (juejin.cn)](https://juejin.cn/post/7203258813893345340)

### MinIO

MinIO 是一款基于 Go 语言发开的高性能、分布式的对象存储系统，客户端支持 Java，Net，Python，Javacript，Golang语言。

MinIO 的主要目标是作为私有云对象存储的标准方案，非常适合于存储大容量非结构化的数据，例如图片、视频、日志文件、备份数据、容器和虚拟机镜像等，而一个对象文件可以是任意大小，从几 kb 到最大 5T。

如果有搭建私有对象存储服务的需求，MinIO 非常适合。本文将介绍使用 Docker 快速搭建一个 MinIO 服务。

### 使用 Docker 部署 MinIO 服务

在 Docker Hub 搜索 MinIO 相关镜像，使用这一个：

[![](https://pic.yupi.icu/5563/202311171841217.png)](https://imgloc.com/image/ngYO5)

按照文档的说明，下载镜像：

```shell
shell
复制代码$ docker pull bitnami/minio
```

查看下载好的镜像：

```bash
bash复制代码$ docker images
REPOSITORY            TAG       IMAGE ID       CREATED             SIZE
bitnami/minio         latest    5ce0a7a9aaff   About an hour ago   218MB
```

创建数据卷目录，并提升权限：

```shell
shell复制代码$ mkdir -p /minio1/data
$ chmod -R 777 /minio/data
```

使用镜像启动一个 `minio` 容器：

```ini
ini复制代码$ docker run -it -d --name minio \
-p 9000:9000 -p 9001:9001 \
-v /minio/data:/data \
-e MINIO_ROOT_USER="minio_root" \
-e MINIO_ROOT_PASSWORD="minio_123456" \
bitnami/minio:latest
```

参数说明：

- -it：-i 表示以交互模式运行容器，-t 表示为容器重新分配一个伪输入终端，两个参数必须结合使用才能启动一个容器
- -d：以守护进程方式来启动容器，这也是常用参数，防止阻塞当前窗口
- -p 9000:9000：MinIO 服务会暴露 9000 端口来对外提供对象访问，也就是通过此端口运行的服务来访问资源
- -p 9001:9001：MinIO 服务会提供一个可视化管理系统，默认在 9001 端口运行
- -v /minio/data:/data：挂载数据卷，将 minio 容器内存储的文件映射到宿主机
- -e MINIO_ROOT_USER="minio_root"：设置 root 用户名
- -e MINIO_ROOT_PASSWORD="minio_123456"：设置 root 的密码，长度至少 8 位

在 minio 镜像的文档中提到了：

> Make sure that the environment variables `MINIO_ROOT_PASSWORD` and `MINIO_SERVER_SECRET_KEY` meet the 8 character minimum length requirement enforced by MinIO(R).

也就是通过环境变量 `MINIO_ROOT_PASSWORD` 设置 root 用户密码时，长度至少为 8 位，这一点需要注意。

查看 minio 容器的启动日志：

```ruby
ruby
复制代码$ docker lgos minio -f
```

可以看到一些关键信息：

`API` 也就是对外提供资源存取服务的地址，`Console` 是控制台，也就是一个后台管理系统。`RootUser` 是通过环境变量设置的 root 用户名，`RootPass` 是 root 用户密码。创建容器时没有指定这两个环境变量的话，这里会提供两个默认的值，分别是 `minio` 和 `miniosecret`。

[![](https://pic.yupi.icu/5563/202311171841346.png)](https://imgloc.com/image/ngDlX)

查看 minio 容器的信息：

```ruby
ruby
复制代码$ docker ps
```

可以看到容器的 ID，所使用的的镜像，运行状态，端口等信息： [![](https://pic.yupi.icu/5563/202311171841618.png)](https://imgloc.com/image/ngdEs)

### 开放安全组端口

MinIO 服务用到了 9000 和 9001 端口，如果使用的是云服务器，需要在安全组中开放端口：

![](https://pic.yupi.icu/5563/202311171845030.png)

### 访问 MinIO

打开浏览器，访问 `域名:9001` 或者 `IP:9001` ，即可访问 MinIO 服务的管理系统，使用设置好的用户名和密码，登录系统：

![](https://pic.yupi.icu/5563/202311171844496.png)

进入系统首页，默认展示存储桶列表，由于现在是一个新的服务，所以还是空的：

[![](https://pic.yupi.icu/5563/202311171841291.png)](https://imgloc.com/image/ng9XC)

### 创建桶

根据提示，点击 “Create a Bucket” 开始创建第一个存储桶：

[![](https://pic.yupi.icu/5563/202311171841069.png)](https://imgloc.com/image/ngG0t)

点击按钮即可完成桶的创建，如下，是刚刚创建的存储桶的卡片展示：

[![](https://pic.yupi.icu/5563/202311171841055.png)](https://imgloc.com/image/ngN1m)

[![](https://pic.yupi.icu/5563/202311171841904.png)](https://imgloc.com/image/ngaaN)

### 上传文件

![](https://pic.yupi.icu/5563/202311171843371.png)

上方的路径可以复制下来，拼接上 MinIO 服务的地址，就是此文件的 URL 了。一定要把桶的访问策略改为 Public，否则访问此 URL 将返回 403。

> 另外可在域名解析（这个要在云服务中）中，将ip解析到域名中，从而避免保留ip，就像下图一样，可自行查阅资料。

[![ntCQp.png](https://pic.yupi.icu/5563/202311171841912.png)](https://imgloc.com/image/ntCQp)

## （3）最后

通过 Docker 快速部署了一个简单易用的对象存储服务 MinIO，它提供的用户界面也非常友好。

## 三、Spring boot集成Minio并应用

## （1）引言

MinIO是一个开源的对象存储服务器，设计用于存储和检索大量的数据对象，例如文本数据、图像、视频和其他类型的文件。它提供了分布式存储、高可用性和可扩展性，并支持S3协议，这使得它兼容很多与云存储相关的应用和工具。

以下是MinIO的一些主要作用和特点：

1. **对象存储：** MinIO专注于对象存储，允许用户将文件以对象的形式存储。这些对象可以是任何类型的数据，例如文本、图像、视频等。
2. **分布式存储：** MinIO可以部署为分布式系统，允许在多个节点上存储和检索数据。这样的设计提供了高可用性和可伸缩性，因为数据可以分散存储在不同的节点上，而且如果某个节点失败，系统仍然能够正常运行。
3. **S3兼容性：** MinIO支持Amazon S3协议，这意味着它可以与使用S3协议的许多应用和工具进行集成。这使得MinIO成为一个强大的对象存储解决方案，可以轻松替代或与云存储服务（如Amazon S3）配合使用。
4. **开源和可定制：** 作为开源项目，MinIO的源代码是公开的，用户可以根据自己的需求进行定制和修改。这种开放性使得开发者能够根据具体的场景和需求对MinIO进行灵活的配置和扩展。
5. **用于构建私有云存储：** 由于MinIO的设计目标是提供私有云存储解决方案，它适用于那些希望在本地或私有环境中构建存储基础设施的组织。

总体而言，MinIO为开发者提供了一个功能强大的对象存储解决方案，旨在满足大规模数据存储和检索的需求。

## （2）集成前提

已经安装了minio程序并部署成功，如在docker上。如未安装，可参考本文P2

## （3）集成步骤

借鉴博客：[SpringBoot2整合minio - dkn -  (cnblogs.com)](https://www.cnblogs.com/daikainan/p/14413759.html)

### 1.引入依赖

尽可能新，如出现bug可尝试换版本，视springboot版本而定。

```xml
<!--Minio-->
<!-- https://mvnrepository.com/artifact/io.minio/minio -->
<dependency>
    <groupId>io.minio</groupId>
    <artifactId>minio</artifactId>
    <version>8.3.4</version>
</dependency>
```

### 2.设置配置文件

#### 2.1 设置minio参数

![](https://pic.yupi.icu/5563/202311171842067.png)

如出现报错，可按下方方式解决（来自博客：[Minio上传图片时遇到的问题S3 API Requests must be made to API port._minio 上传失败_Micek的博客-](https://blog.csdn.net/Gracener/article/details/127820613?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2~default~CTRLIST~Rate-2-127820613-blog-127102500.235^v38^pc_relevant_anti_t3_base&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2~default~CTRLIST~Rate-2-127820613-blog-127102500.235^v38^pc_relevant_anti_t3_base&utm_relevant_index=5)）

![](https://pic.yupi.icu/5563/202311171841340.png)

#### 2.2 文件上传配置

```yml
spring:
  # 文件上传
  servlet:
    multipart:
      # 启动开关
      enabled: true
      # 文件大小限制
      max-file-size: 50MB
      # 限制整个请求的大小，包括所有文件和其他部分
      max-request-size: 100MB
```

可根据自身情况设置，具体参数说明如下：

> 除了设置文件上传的大小限制之外，您可以通过其他属性来细化配置文件上传，以提高安全性和控制。以下是一些可能有用的属性：
>
> 1. **`spring.servlet.multipart.max-request-size`：** 该属性限制整个请求的大小，包括所有文件和其他部分。如果请求超过此大小，将拒绝上传。例如：
>
>    ```yaml
>    spring:
>      servlet:
>        multipart:
>          max-request-size: 100MB
>    ```
>
> 2. **`spring.servlet.multipart.file-size-threshold`：** 该属性设置一个阈值，低于该阈值的文件将保留在内存中，而不写入磁盘。高于该阈值的文件将被写入磁盘。这可以帮助提高性能并减少磁盘IO。例如：
>
>    ```yaml
>    spring:
>      servlet:
>        multipart:
>          file-size-threshold: 2KB
>    ```
>
> 3. **`spring.servlet.multipart.location`：** 如果希望将所有上传的文件保存到特定目录而不是默认的临时目录，可以使用此属性。例如：
>
>    ```yaml
>    spring:
>      servlet:
>        multipart:
>          location: /path/to/upload/directory
>    ```
>
> 4. **`spring.servlet.multipart.enabled`：** 可以使用此属性来禁用或启用文件上传功能。默认情况下，它是启用的。例如：
>
>    ```yaml
>    spring:
>      servlet:
>        multipart:
>          enabled: false
>    ```
>
> 5. **`spring.servlet.multipart.resolve-lazily`：** 默认情况下，Spring Boot在请求处理时解析`MultipartFile`，但您可以通过将此属性设置为`true`来推迟解析，直到实际需要访问文件内容时才进行解析。这可以减少内存占用。例如：
>
>    ```yaml
>    spring:
>      servlet:
>        multipart:
>          resolve-lazily: true
>    ```
>
> 这些属性可以根据您的需求进行调整，以提高文件上传的安全性和性能。确保根据您的应用程序的要求和环境来选择适当的配置。

### 3. 编写配置类

```java
package sspu.zzx.sspuoj.utils.file.minio;

import io.minio.MinioClient;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
public class MinioConfig
{
    @Value("${minio.endpoint}")
    private String endpoint;
    @Value("${minio.accessKey}")
    private String accessKey;
    @Value("${minio.secretKey}")
    private String secretKey;
    @Value("${minio.bucketName}")
    private String bucketNameImage;

    @Bean
    public MinioClient minioClient()
    {
        MinioClient minioClient = MinioClient.builder().endpoint(endpoint).credentials(accessKey, secretKey).build();
        return minioClient;
    }

}
```

### 4. 编写工具类

```java
package sspu.zzx.sspuoj.utils.file.minio;

import io.minio.*;
import io.minio.http.Method;
import io.minio.messages.Item;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 参考 https://github.com/minio/minio-java/tree/master/examples
 */

@Service
@Slf4j
public class MinioUtils
{
    @Autowired
    MinioConfig minioConfig;
    @Autowired
    MinioClient minioClient;

    //获取列表
    public List<String> listObjects() {
        List<String> list=new ArrayList<>();
        try {

            ListObjectsArgs listObjectsArgs = ListObjectsArgs.builder()
                    .bucket(minioConfig.getBucketNameImage())
                    .build();

            Iterable<Result<Item>> results =minioClient.listObjects(listObjectsArgs);
            for (Result<Item> result : results) {
                Item item = result.get();
                log.info(item.lastModified() + ", " + item.size() + ", " + item.objectName());
                list.add(item.objectName());
            }
        }catch (Exception e){
            log.error("错误："+e.getMessage());
        }
        return list;
    }

    //删除
    public void deleteObject(String objectName) {
        try {
            RemoveObjectArgs removeObjectArgs = RemoveObjectArgs.builder()
                    .bucket(minioConfig.getBucketNameImage())
                    .object(objectName)
                    .build();
            minioClient.removeObject(removeObjectArgs);
        }catch (Exception e){
            log.error("错误："+e.getMessage());
        }
    }

    //上传
    public void uploadObject(InputStream is,String fileName,String contentType) {
        try {
            PutObjectArgs putObjectArgs = PutObjectArgs.builder()
                    .bucket(minioConfig.getBucketNameImage())
                    .object(fileName)
                    .contentType(contentType)
                    .stream(is, is.available(), -1)
                    .build();
            minioClient.putObject(putObjectArgs);
            is.close();
        }catch (Exception e){
            log.error("错误："+e.getMessage());
        }
    }

    //获取minio中地址
    public String getObjectUrl(String objectName){
        try {
            GetPresignedObjectUrlArgs getPresignedObjectUrlArgs = GetPresignedObjectUrlArgs.builder()
                    .method(Method.GET)
                    .bucket(minioConfig.getBucketNameImage())
                    .object(objectName)
                    .expiry(7, TimeUnit.DAYS)
                    .build();
            return minioClient.getPresignedObjectUrl(getPresignedObjectUrlArgs);
        }catch (Exception e){
            e.printStackTrace();
            log.error("错误："+e.getMessage());
        }
        return "";
    }



    //下载minio服务的文件
    public InputStream getObject(String objectName){
        try {
            GetObjectArgs getObjectArgs = GetObjectArgs.builder()
                    .bucket(minioConfig.getBucketNameImage())
                    .object(objectName)
                    .build();
            return minioClient.getObject(getObjectArgs);
        }catch (Exception e){
            log.error("错误："+e.getMessage());
        }
        return null;
    }


}
```

### 5. 编写测试类

BaseResponse和ResultUtils为通用返回类，可自行创建

```java
package sspu.zzx.sspuoj.controller;

import org.apache.commons.lang3.StringUtils;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sspu.zzx.sspuoj.common.BaseResponse;
import sspu.zzx.sspuoj.common.ErrorCode;
import sspu.zzx.sspuoj.common.ResultUtils;
import sspu.zzx.sspuoj.exception.BusinessException;
import sspu.zzx.sspuoj.utils.file.minio.MinioUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/minio")
public class MinioController
{

    @Autowired
    MinioUtils minioService;

    //列表
    @GetMapping("/list")
    public BaseResponse<List<String>> list()
    {
        List<String> strings = minioService.listObjects();
        return ResultUtils.success(strings);
    }

    //删除
    @PutMapping("/delete")
    public BaseResponse<Boolean> delete(@RequestParam String filename)
    {
        minioService.deleteObject(filename);
        return ResultUtils.success(true);
    }

    //上传文件
    @PostMapping("/upload")
    public BaseResponse<String> upload(@RequestParam("file") MultipartFile file)
    {
        try
        {
            // todo 完善文件命名逻辑
            InputStream is = file.getInputStream(); //得到文件流
            String fileName = file.getOriginalFilename(); //文件名
            String newFileName = System.currentTimeMillis() + "." + StringUtils.substringAfterLast(fileName, ".");
            // todo 完善类型校验逻辑
            String contentType = file.getContentType();  //类型
            minioService.uploadObject(is, newFileName, contentType);
            return ResultUtils.success(newFileName);
        } catch (Exception e)
        {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "上传失败");
        }
    }

    //下载minio服务的文件
    @GetMapping("/download")
    public void download(@RequestParam String filename, HttpServletResponse response)
    {
        try
        {
            InputStream fileInputStream = minioService.getObject(filename);
            // todo 完善文件命名逻辑
            String newFileName = System.currentTimeMillis() + "." + StringUtils.substringAfterLast(filename, ".");
            response.setHeader("Content-Disposition", "attachment;filename=" + newFileName);
            response.setContentType("application/force-download");
            response.setCharacterEncoding("UTF-8");
            IOUtils.copy(fileInputStream, response.getOutputStream());
        } catch (Exception e)
        {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "下载失败");
        }
    }

    //获取minio文件的下载地址
    @GetMapping("/getHttpUrl")
    public BaseResponse<String> getHttpUrl(@RequestParam String filename)
    {
        try
        {
            String url = minioService.getObjectUrl(filename);
            return ResultUtils.success(url);
        } catch (Exception e)
        {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, e.getMessage());
        }
    }


}
```

### 6. 测试

其他接口请自行测试。

![](https://pic.yupi.icu/5563/202311171841018.png)