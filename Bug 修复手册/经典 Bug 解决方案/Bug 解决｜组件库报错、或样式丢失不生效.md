# Bug 解决｜组件库报错、或样式丢失不生效

> 程序员鱼皮的编程宝典：https://codefather.cn/



我相信很多同学在做项目的时候都会遇到组件库相关的问题， 明明用了这个样式怎么不生效？为什么还报错了？



其实很多时候不是咱们用的不对，是我们使用的组件库更新了！老的代码和新的版本不兼容，导致的各种问题。

所以如果我们觉得代码写的没毛病，那么首先就去确认下版本。

**强烈建议使用各种组件的时候，需要对着官方文档来哦！**



下面分享一些组件库报错或样式丢失的案例，供大家参考。



### 版本问题

#### 1、使用 VantUI 的 toast 组件报错？

新版本的 VantUI 语法改变了，成功需要用 `showSuccessToast()`，失败用 `showFailToast()`。



#### 2、引入 VantUI 组件库后，toast 组件样式丢失了？

![](https://pic.yupi.icu/5563/202404161535471.png)



因为版本不一致，鱼皮视频教程中用的是 Vant3，而最新的 Vant4 版本需要这样设置：

1）先修改 main.ts 文件

```tsx
把
import'./style.css'

改为：
import'vant/lib/index.css'
```



2）修改 `vite.config.ts` 文件

```tsx
把
// https://vitejs. dev/config/
export default defineConfig({
  plugins: [vue(),
  Components({
    resolvers: [VantResolver()],
  }),
  ],
})

改为
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    Components({
    resolvers: [VantResolver({
      importStyle: false,
    }
    )],
  }),
  ],
})
```



同理，如果要使用 vant 4 的 `data-picker、time-picker` 代替 vant 3 的 `datetime-picker` ，需要改下代码。

vant3 组件代码：

```tsx
<van-field
  is-link
  readonly
  name="datetimePicker"
  label="过期时间"
  :placeholder="addTeamData.expireTime??'点击选择过期时间"
  @click="showPicker = true"
1>
<van-popup v-model:show="showPicker" position="bottom">
<van-datetime-picker
  v-model="addTeamData.expireTime"
  @confirm="showPicker = false"
  type="datetime"
  title="请选择过期时间"
  :min-date="minDate"
/>
```



vant4 组件代码：

```tsx
<van-field
  is-link
  readonly
  name="datetimePicker"
  label="过期时间"
  :placeholder="currentDate[0] + '-' + currentDate[1] + '-' + currentDate[2]
  +''+ currentTime[0]+'：'+ currentTime[1]??'点击选择过期时间"
  @click="showPicker = true"
/>
<van-popup v-model:show="showPicker" position="bottom">
<van-picker-group
  title="请选择过期时间"
  ：tabs="['选择日期”，‘选择时间]”
  next-step-text="下一步"
  @confirm="showPicker = false"
  @cancel="onCancel"
  <van-date-picker
  V-model="currentDate"
  :min-date="minDate"
/>
	<van-time-picker v-model="currentTime"/>
</van-picker-group>
```



#### 3、使用 Ant Design Vue 组件库，启动后显示 antd.css 不存在？

报错信息：路径 `"ant-design-vue/dist/antd.css"`不存在 css 文件。

原因是官方修改了样式文件的名称！现在这个 css 文件改名为 `reset.css`。

修改为：

```xml
import "ant-design-vue/dist/reset.css";
```



#### 4、Vant UI 组件库引入的 tabs 组件报错

这是因为 vant 组件库的版本更新了，需要修改 `packeage.json` 文件里的 `ant-design-vue` 版本。

使用官方文档提供的最新命令下载：

```bash
npm i --save ant-design-vue@next
```



#### 5、Vant UI 组件的 Dialog.componemets 失效

还是看官方文档：https://vant-ui.github.io/vant/#/zh-CN/dialog#zu-jian-diao-yong。

在 `script setup` 中导入 `import { Dialog } from 'vant'; `。

然后加入 `const VanDialog = Dialog.Component;`。



这里强烈建议大家 **对照官方文档的语法和使用方式** 来编写代码，因为组件库升级了，很多时候视频里的写法无法兼容！



### 代码问题

1） 比如 toast  引入 popup 之后，只显示白色？

![](https://pic.yupi.icu/5563/202404161535533.png)

这时候需要手动 `import 'vant/es/toast/style';`



因为在不引用 `popup` 的时候，默认的样式 `index.css` 是可以让 `toast` 正常显示，而引入 `popup` 后被 `popup` 的 `background` 样式所覆盖掉，从而显示白色。



![](https://pic.yupi.icu/5563/202404161535884.png)



2）为什么替换页面样式布局（界面配置）不生效？

点击右边蓝色的设置图标，可以打开抽屉来设置样式，调整完样式后直接复制配置即可。



![](https://pic.yupi.icu/5563/202404161535581.png)



复制配置后，粘贴到 `defaultSettings.ts`。



![](https://pic.yupi.icu/5563/202404161535501.png)



把 app.tsx 的 `initialState?.settings` 换成 `defaultSetting` 即可生效。



![](https://pic.yupi.icu/5563/202404161535493.png)



3）为什么页面只有文本，格式乱码（或组件紧凑居中在页面上）？

![](https://pic.yupi.icu/5563/202404161535871.png)



1. 在  main.ts 引入 `'vant/lib/index.css'`后，把其他的样式文件都删了。
2. 注释掉(或删除)在 main.ts 中的`import./style.css`。



4）md 编辑器全屏后有其他组件的出现？



![](https://pic.yupi.icu/5563/202404161535906.png)

```tsx
:deep(.bytemd-fullscreen.bytemd) {
  z-index: 100;
}
```



### 其他问题

1）页面右下角没有"小米饭图标"怎么没了？或者为什么打开 umi ui（小米饭图标） 后，所有的组件都是空白的？

因为项目前端使用的 umi 框架在持续升级，所以现在不建议使用 umi ui 了，兼容性不好。鱼皮的项目中也没有用到，可以忽略，不影响后续的学习。



2）为什么登录时密码框有两个“眼睛”？

![](https://pic.yupi.icu/5563/202404161535923.png)



这是因为 ie 和 edge 浏览器会自带眼睛，所以才会出现这个问题。

解决方案：

```tsx
<style>
      /*去除ie edge的密码框默认的快速清除钮（X图标）以及密码文字显示钮*/
      input[type="password"]::-ms-reveal{
        display: none;
      }
      input[type="password"]::-ms-clear{
        display: none;
      }
      input[type="password"]::-o-clear{
        display: none;
      }
</style>
```

