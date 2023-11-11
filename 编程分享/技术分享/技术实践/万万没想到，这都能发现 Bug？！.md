# 万万没想到，这都能发现 Bug？！

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)

> Bug 总会不约而至

大家好，我是鱼皮，昨天工作中遇到一个挺好玩儿的小 Bug，和大家分享下，小白可懂～

事情是这样的，为了保证发到线上的项目代码能正常运行，每次构建发布前，我们都会执行一遍单元测试，对业务流程、一些增删改查之类的代码片段进行验证。

以前我上线项目都是有节奏有规划的，也没注意跑一遍单元测试要花多长时间，反正慢点我就先去干别的事儿。直到昨天，我急着修复一个线上 Bug，结果发现单元测试竟然特么跑了近 20 分钟，直接给我整不会了。

![](https://pic.yupi.icu/5563/202311072018438.png)

虽说随着项目功能的不断增多，测试用例也越来越多，是会比以前多花一点时间。但整个测试数据库量级都不过千，怎么会这么慢呢？

于是，我又执行了一遍所有测试用例，观察各用例的耗时，结果发现有一个简单的查询接口竟然执行了近 10 分钟。

由于不能透露真实的业务场景，给大家打个比方，这个接口的作用大概就是查询某用户信息以及他关联的所有资产详情列表，每个资产详情都要查几个不同的表才能得到完整数据，相对比较耗时。

用一段伪代码来描述，大概是这样的：

```
// 耗时 0.1 秒
let user = getUser();
// 循环
for(id in user.assetIds) {
  // 耗时 0.1 秒
  let asset = getDetail();
  // 耗时 0.1 秒
  asset.xx = getXX();
  // 耗时 0.1 秒
  asset.yy = getYY();
  // 耗时 0.1 秒
  asset.zz = getZZ();
}
```

可以看出，如果该用户有很多资产的话，查询耗时将线性增加。

那肯定有同学要吐槽了：为啥是查询所有，而不是分页一批一批去查呢？这个就得从实际的业务场景去考虑了。我们系统情况是：用户一般不会有太多资产详情的，而且要把数据全部返回给前端展示，所以不分页会更方便些。

但万万没想到啊，每次测试插入资产的方法时，我都指定了该资产的所属用户 id = 1！日积月累，最终导致该用户名下的资产数多达近千个！然后又恰好，我测试该查询接口时，查的就是用户 id = 1 的数据，就导致了悲剧的发生。

![](https://pic.yupi.icu/5563/202311072018391.png)

解决方案也很简单，把顺序查询转为并发查询即可。

具体的步骤就是开一个线程池，然后 Java 的话可以用 `CompletableFuture` 类来创建并发查询任务，每个任务负责查询一个资产的详情，最后等所有资产详情都查询好，再整体返回。

Java 代码大概是这样的（不保证能运行）：

```
// 开个线程池，取任务执行
ExecutorService executor = new ThreadPoolExecutor(
  8, 100, 5,
  TimeUnit.MINUTES,
  new ArrayBlockingQueue<>(10000)
);
// 任务列表
List<CompletableFuture<Asset>> fList = new ArrayList<>();
for (int id : assetIds) {
  // 创建任务
  CompletableFuture<Asset> f = CompletableFuture.supplyAsync(
    () -> {
      Asset asset = getDetail();
      asset.xx = getXX();
      asset.yy = getYY();
      asset.zz = getZZ();
     return asset;
   },
    executor
  );
  fList.add(f);
}
// 阻塞，等待所有任务执行完成
List<Asset> CompletableFuture
  .allOf(fList.toArray(new CompletableFuture[0]))
  .get();
```

唉，本来是想着就几条数据没必要用并发查询的，没想到还是潜移默化间影响了自己开发上线项目的效率。

不过，这次的小事件也再次说明了单元测试的重要性，这玩意不仅能测出程序不能正常运行的问题，还能侧面反映出你系统上存在的风险和缺陷。所以，大家做项目时还是不能偷懒，要好好写单元测试哈！



------


以上就是本期分享，有帮助的话还请给鱼皮一个 **点赞 + 在看** ，谢谢大家！

![](https://pic.yupi.icu/5563/202311072018445.png)