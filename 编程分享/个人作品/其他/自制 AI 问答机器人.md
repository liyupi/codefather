# 自制 AI 问答机器人

> 本文作者：[程序员鱼皮](https://yuyuanweb.feishu.cn/wiki/Abldw5WkjidySxkKxU2cQdAtnah)
>
> 本站地址：[https://codefather.cn](https://codefather.cn)

大家好，我是鱼皮，自从做了知识分享，我的微信就没消停过，平均每天会收到几百个消息，大部分都是学编程的朋友向我咨询编程问题。

但毕竟我只有一个人，没法所有消息都一个个回复，所以也是很愧疚和无力吧；另外我发现，大家的很多问题是重复的，而且大多数我都专门写文章来回答过。

所以，我决定自制一个 AI 问答机器人，帮我自动回复大家的常见问题，减少重复工作。

结果没想到，制作过程中被 Bug 坑惨了，闹了不少笑话，感兴趣的朋友可以看看视频哈哈：

> 地址：https://www.bilibili.com/video/BV1Vq4y1B7zu/

![](https://pic.yupi.icu/5563/202311090817273.png)

由于制作方法实在太简单，所以给大家分享下完整的教程，让大家也能轻松制作自己的 AI 机器人。

### 自制 AI 机器人教程

> 预计整个制作过程 10 分钟

先描述下需求：做一个能够自动回答微信消息的机器人。

要实现这个需求，有两个要点：

1. 如何让程序接收到微信发来的消息？
2. 如何根据消息来回复对应的内容？

这两个问题，如果没有一定的专业知识，是很难自行解决的。但如今是开源的时代，我们可以站在巨人的肩膀上，用现成的技术来解决这些问题。

#### 接受消息

可以使用开源的 `wechaty` 库来实现对微信的自动化操作，比如收发消息、通过好友、拉群等。

![](https://pic.yupi.icu/5563/202311090817787.png)

> 开源微信机器人库

使用方法很简单，在 wechaty 仓库的项目介绍文件中，有最简单的入门示例代码，只需要 **6 行代码** ，就能启动一个帮你接受消息的机器人！

wechaty 支持几乎所有主流的编程语言，其中 JavaScript 的入门代码如下：

```
import { WechatyBuilder } from 'wechaty'
// 启动
WechatyBuilder.build()
  .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
  .on('login',            user => console.log(`User ${user} logged in`))
  .on('message',       message => console.log(`Message: ${message}`))
  .start()
```

解释一下上述代码，你会发现，wechaty 中定义了很多事件，比如扫码、用户登录、接受消息、接受好友请求等。你不需要关心事件是如何被它触发的，只需要针对不同事件来编写处理方法就好，比如收到消息后自动回复同样的消息，示例代码如下：

```
// 初始化机器人
const bot = WechatyBuilder.build({
  name: 'yupi-wxrobot',
  // 用于兼容不同 IM 协议，不用关心
  puppet: 'wechaty-puppet-wechat',
})
// 处理消息
bot.on('message', async function (msg) {
  // 获取消息发送人
  const contact = msg.talker()
  // 获取消息内容
  const text = msg.text()
  // 获取群聊信息
  const room = msg.room()
  // 是私聊
  if (contact && text) {
    // 回复相同内容
    msg.say(text, contact);
  }
}
```

但是，大家 **千万不要** 直接运行上述代码！因为一旦你启动了机器人、又没有限制回复者昵称的话，它会对所有给你发消息的人生效！

我刚开始没注意，就被坑了。。。

![](https://pic.yupi.icu/5563/202311090817116.png)

所以，如果你只想自动回复某人或某群聊的消息，记得在代码中补充相应的过滤逻辑，比如：

```
// 处理消息
bot.on('message', async function (msg) {
  // 获取消息发送人
  const contact = msg.talker()
  // 获取消息内容
  const text = msg.text()
  // 获取群聊信息
  const room = msg.room()

  // 不处理自己的消息
  if (msg.self()) {
    return
  }
  // 群聊还是私聊
  if (room) {
    if(room.topic() === '鱼皮群') {
      // 回复
    }
  } else {
    if(contact.name() === '小号') {
      // 回复
    }
  }
}
```

OK，使用上述代码，就能实现接受消息和自动回复啦！

那么你是否好奇，wechaty 是如何接受到微信消息的呢？其实原理很简单，执行 wechaty 程序时，它会利用无头浏览器技术悄悄打开一个网页版微信，然后在你运行程序的控制台弹出微信网页版的登录二维码，在你扫码登录后，程序只需要监听页面元素的变化、或者自动触发点击事件即可。

![](https://pic.yupi.icu/5563/202311090817760.png)

> 网页版微信

其实道理很简单，就是把我们能对网页进行的人工操作转化为后台自动化执行。

#### 智能回复

第一个问题解决了，那么如何根据不同的问题给出不同的回复呢？

很多同学肯定上来就说 AI，那都是被我用的 “智能” 一次带偏了。其实如果只是简单的自动回复，问题规则可收敛、可枚举的情况下，直接用 `if ... else ...` 就能解决了！

```
if(/你好/.test(text)) {
  msg.say('好的');
} else if (/谢谢/.test(text)) {
  msg.say('不客气');
} else if (/加群/.test(text)) {
  msg.say('公众号[程序员鱼皮],回复[加群]');
} else {
  msg.say('我不懂');
}
```

不是说人工智能的本质就是 if else 么哈哈，只不过是让机器来帮你去做 if else 而已。

但现实是，我的读者对于同一个问题也会有不同的表达方式，比如 “怎么学 Java？”、“我想学 Java，怎么学？” 等等。因此，还是需要人工智能登场了。

到哪里去搞人工智能呢？

![](https://pic.yupi.icu/5563/202311090817832.png)

我们可以直接利用 `微信对话开放平台` 提供的强大能力，一行代码都不用写，就能免费实现智能对话！

> 地址：https://openai.weixin.qq.com/

登录后先创建一个机器人：

![](https://pic.yupi.icu/5563/202311090817813.png)

> 创建机器人

然后可以为机器人添加技能，你可以自定义技能，向机器人灌输指定的问题和回答；也可以直接使用平台提供的默认技能，比如听歌、聊天、百科等：

![](https://pic.yupi.icu/5563/202311090817030.png)

> 配置技能

我的需求是自动回答读者的编程相关问题，因此需要创建一个新技能。在这里，可以灵活地自定义题目、不同的问法以及回答，全部用界面操作即可，轻松打造你的专属机器人：

![](https://pic.yupi.icu/5563/202311090817014.png)

> 自定义技能

配置好之后，就可以发布和使用机器人了。我们可以将机器人和公众号 / 小程序绑定，自动回复读者消息；可以直接在 H5 网页中接入智能客服；还可以在程序中调用开放接口来使用智能对话能力：

![](https://pic.yupi.icu/5563/202311090817055.png)

> 发布和使用

此处我们希望在 wechaty 程序中自动获得回复，所以要使用 **开放接口** 的方式，也很简单，就是用个请求库去调用接口，示例代码如下：

```
// 获取 API 签名，2小时过期
// token 需从平台获取
const url = `https://openai.weixin.qq.com/openapi/sign/${token}`;
const {signature} = (await axios.post(url, {
    userid: 'test'
})).data;

// 调用 AI 接口，获取答案
async function getAnswer(userid, text) {
  const apiUrl = `https://openai.weixin.qq.com/openapi/aibot/${token}`;
  return (await axios.post(apiUrl, {
    "signature": signature,
    "userid": userid,
    "query": text,
  })).data?.answer;
}
```

大概就是这样，又简单又实用，感兴趣的同学可以用它来做出很多有趣的功能~



------


我是鱼皮，周末肝文不易，有帮助的话还希望能给个 **点赞 + 在看** 支持下，谢谢大家。

![](https://pic.yupi.icu/5563/202311090817776.png)