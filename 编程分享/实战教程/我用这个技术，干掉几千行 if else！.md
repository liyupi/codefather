# 我用这个技术，干掉几千行 if else！

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)

大家好我是鱼皮，今天我将用一个有趣的小例子来带大家入门企业开发中非常实用的技术—— 工作流，用好这个技术，可以帮你消除项目中大量的 if else 代码，让你的项目更好维护和扩展。

> 本文视频演示：https://www.bilibili.com/video/BV13d4y1o7iB/

## 什么是工作流？

工作流顾名思义，就是一系列工作所组成的流程。

就像工厂加工产品一样，确认好生产步骤后，所有工人只需做好自己的事情即可。

![](https://pic.yupi.icu/5563/202311080936772.png)

比如我现在要做一个养鸡系统，  每一只鸡都需要依次通过唱、跳、RAP、篮球的考核，并且还要练习时长两年半，才能出售，否则就算是 “蔡鸡”，要打回去重新练习。

对应的流程图如下：

![](https://pic.yupi.icu/5563/202311080936938.png)

那如果让你来写代码实现这个逻辑，你会怎么写呢？

想必会是一大段的 if ... else ... 吧，像下面这样：

![](https://pic.yupi.icu/5563/202311080936288.png)

对于简单的程序来说，这样写没有问题。但在企业开发中，我们的业务流程往往是非常复杂的，比如下面这个系统：

![](https://pic.yupi.icu/5563/202311080936028.png)

再加上多人协作开发，大家都在一个文件里写 if else 也不现实。

所以为了更好地开发和维护工作流，我们一般会使用 `工作流引擎` 技术。可以通过可视化拖拽的方式来绘制流程图、并自动生成业务流程代码，而不用自己写 if else，大幅降低开发成本、非程序员也能用。

![](https://pic.yupi.icu/5563/202311080936616.png)

> 可视化绘制工作流

比较成熟的工作流引擎有 Activiti、flowable-engine 等等，但它们都需要一些学习成本，对于第一次接触工作流的同学来说，可能会有点复杂。

所以我选了一个相对轻量纯净的工作流引擎 CompileFlow 来演示，便于大家理解。

![](https://pic.yupi.icu/5563/202311080936699.png)



> 下面我们用它来实现刚刚提到的养鸡系统。

## 工作流实现养鸡系统

### **1、准备操作**

使用 Compile Flow 非常简单，直接进入代码仓库主页，引入代码包即可：

![](https://pic.yupi.icu/5563/202311080936185.png)

这里我建议大家首次使用时下载官方提供的示例代码：https://github.com/compileflow/compileflow-demo

这是一个 Maven + Spring Boot 的项目，我们用 IDEA 开发工具打开它，可以看到目录中有很多 bpm 业务流程管理文件，用来定义我们的工作流。

![](https://pic.yupi.icu/5563/202311080936179.png)

但是 bpm 文件是用 XML 编写的，看着就很复杂，真要自己写这个玩意还不如写 if else 呢！

![](https://pic.yupi.icu/5563/202311080936934.png)

> bpm 文件

所以我们要先下载一个 `Compileflow Designer` 插件，这样就能可视化地编辑工作流了：

![](https://pic.yupi.icu/5563/202311080936329.png)

### **2、新建项目**

让我们在资源目录下新建一个 bpm 文件，就叫 `ji.bpm`，然后点编辑器底部切换到可视化编辑视图。

![](https://pic.yupi.icu/5563/202311080936814.png)

在这里，我们就能像画流程图一样设计我们的程序流程了，让我们试着复现一下之前画的流程图。

![](https://pic.yupi.icu/5563/202311080936325.png)

> 可视化编辑流程

左边的内容称为 `节点` ，每个流程图必须包含一个开始和一个结束节点，不同的节点有不同的流程控制规则。

节点又可以指向其他节点，表示工作的执行顺序，双击节点可以编辑节点名称：

![](https://pic.yupi.icu/5563/202311080936076.png)

> 编辑节点

一番操作后，我们的流程图就变成了下面这个样子：

![](https://pic.yupi.icu/5563/202311080936081.png)

但目前这个流程图是静态的，我们需要给它绑定数据和程序代码，来让整个流程动起来。

### **3、绑定数据**

我们要先确定整个流程的输入和输出，此处我们的输入就是一只鸡（Ji 对象）、输出是考核结果（boolean 类型），我们把这些信息叫做工作流的 `上下文` 。可以理解为全局变量，工作流的每个节点都可以读取这些数据。

![](https://pic.yupi.icu/5563/202311080936430.png)

> 确定上下文

双击编辑器空白处，就可以配置上下文。这里要注意选择 inOutType 的值，全局入参为 param、全局返回值为 result，如果你需要在部分节点中传递变量，可以用 inner 类型。

![](https://pic.yupi.icu/5563/202311080936444.png)

> 全局上下文配置

### **4、绑定方法**

配置好上下文后，我们要给每个节点绑定一个方法，也就是这个节点要做什么事。

这里我们从之前的 if else 程序中提取出需要的方法，每个分支都是一个独立的方法，比如 checkChang、考核成功、考核失败等：

![](https://pic.yupi.icu/5563/202311080936586.png)

> 每个节点一个方法

然后双击流程图中的节点，点击行为配置，选择我们的方法，配置输入参数和返回值。这里我们的输入参数从上下文中获取，返回值同步给上下文，配置如图：

![](https://pic.yupi.icu/5563/202311080936736.png)

> 绑定方法

### **5、绑定条件**

最后我们还要再给判断节点绑定条件，区分 yes 或 no。

单击箭头，然后输入表达式，如果表达式成立，那么会往下执行，还可以配置优先级来选择判断顺序（类似代码中 if else 的顺序）：

![](https://pic.yupi.icu/5563/202311080936532.png)

> 绑定条件

### **6、执行流程**

至此，我们的流程图就编辑完了，然后我们就可以在代码中执行流程。

比如我这里新建一个 main 方法，new 一只鸡，作为输入参数放到流程上下文中，然后调用流程引擎的 start 方法，就能得到结果了。

示例代码如下：

```
public static void main(String[] args) {
  // 输入一只鸡
  Ji ji = new Ji();
  ji.setName("cai");
  ji.setCanChang(true);
  ji.setCanTiao(true);
  ji.setCanRap(true);
  ji.setCanLanQiu(true);
  ji.setPracticeYear(2.5D);
  // 找到 bpm 文件的位置
  String code = "bpm.ji";

  // 设置上下文（输入参数）
  Map<String, Object> context = new HashMap<>();
  context.put("ji", ji);

  try {
    // 执行流程
    ProcessEngine processEngine = ProcessEngineFactory.getProcessEngine();
    Map<String, Object> result = processEngine.start(code, context);
    // 获取结果
    System.out.println(result.get("result"));
  } catch (Exception e) {
    e.printStackTrace();
  }
}
```

运行一下试试看：

![](https://pic.yupi.icu/5563/202311080936342.png)

大功告成，以上就是工作流引擎的用法了。

不过由于这个例子比较简单，可能无法突出工作流引擎的优势，这也说明了一点：任何技术都要结合实际场景来选择是否运用。

一般工作流引擎在 ERP 系统、OA 系统中用的比较多，那大家感兴趣的话也可以试着完成 demo 项目中更复杂的例子 `orderFulfillmentFlow.bpm` ，感受工作流引擎开发的高效。

![](https://pic.yupi.icu/5563/202311080936938.png)

> 更复杂的例子

## 原理

Compile Flow 工作流引擎的原理其实也很 “简单”，就是将用户编辑好的 XML 视图文件编译为 Java 代码。我们点开编译后的 Java 代码就可以看到全局变量、流程等等：

![](https://pic.yupi.icu/5563/202311080936689.png)

虽然说还是用到了 if else，但是开发者不需要关心这些 if else 了，定义好流程、写好每个节点要做的工作即可。



------


最后补充一句，Compile Flow 其实好久没更新了，文档写的也过于精简。我只是为了便于大家理解，给大家演示使用。如果你想系统地学习或在企业开发中使用工作流，还是更推荐 Activiti 等成熟的，国产好用的工作流引擎也很多。

以上就是本期分享，学会的朋友们点个赞吧，之后大家如果忘了工作流，就想想唱跳 RAP 篮球。

![](https://pic.yupi.icu/5563/202311080936683.png)

欢迎学编程的朋友们加入我的 [编程导航](https://mp.weixin.qq.com/s?__biz=MzI1NDczNTAwMA==&mid=2247521173&idx=1&sn=00e79de2ac253248e33c764f137e317b&chksm=e9c27462deb5fd747092c34d1bff990102cab5df7733d95ee21f5b0090b398b8f3d79c293e6c&token=1288511242&lang=zh_CN&scene=21#wechat_redirect) （点击了解详情），一起学习进步~

![](../../image/join_us.png)