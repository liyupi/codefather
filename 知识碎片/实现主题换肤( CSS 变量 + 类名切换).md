# 实现主题换肤( CSS 变量 + 类名切换)

> 作者：[112233](https://wx.zsxq.com/dweb2/index/footprint/418844184181828)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 280

通过讲解项目中实现切换暗黑模式的方案、tailwind和unocss主题切换，了解前端主题切换方案中CSS变量 + 类名切换来实现主题切换的方法。

### 实战引入：**CSS变量 + 类名切换**

> 通过arcodesign组件库的使用来了解如何切换主题

**主要思路：CSS变量 + 类名切换（组件库提供/自己定义） + 将当前主题模式设置到localStorage + vuex状态管理theme**

1. 定义CSS变量：因为CSS变量组件库已经配好一套黑白变量了，直接拿来用https://arco.design/vue/docs/token 

   ![](https://pic.yupi.icu/5563/202311161420865.png)

2. 为body标签添加相关的属性，参考arcodesign官网：

![](https://pic.yupi.icu/5563/202311161420640.png) 设置到localStorage防止刷新之后主题恢复成默认的配置

```javascript
const isLight = ref();
const theme = ref();
const toggleLight = () => {
  isLight.value = true;
  // 恢复亮色主题
  document.body.removeAttribute("arco-theme");
  localStorage.setItem("theme", "light");
};
const toggleDark = () => {
  isLight.value = false;
  // 设置为暗黑主题
  document.body.setAttribute("arco-theme", "dark");
  localStorage.setItem("theme", "dark");
};
onMounted(() => {
  theme.value = localStorage.getItem("theme");
  if (theme.value === "light") {
    toggleLight();
  } else {
    toggleDark();
  }
});
```

1. 将一些写死的样式改为变量：

![](https://pic.yupi.icu/5563/202311161420070.png)
如果发现官网设计的变量不够，想自己加，可以参考：
https://arco.design/vue/docs/theme
利用组件库平台提供去配置主题：
https://arco.design/docs/designlab/guideline

### Tailwind颜色主题切换

html 代码

```html
<div class="relative flex flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
  <div class="relative px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
    <div class="mx-auto max-w-md">
      <div class="divide-y divide-gray-300/50">
        <div class="space-y-6 py-8 text-base leading-7 text-gray-600">
          <div class="font-medium text-xl"></div>
          <p class="text-xl font-bold text-gray-90 text-center">Thank you 🙏</p>
          <div class="text-sm text-gray-500">We appreciate your support.</div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
```

**更多颜色：**[**https://tailwindcss.com/docs/customizing-colors**](https://tailwindcss.com/docs/customizing-colors)
配置文件中进行配置：**style.css**，将一些基础样式添加到 Tailwind 的基础层，定义颜色变量

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/*如果你想为特定的 HTML 元素添加自己默认的基础样式
使用@layer 指令将这些样式添加到 Tailwind 的基础层*/
@layer base {
  .theme-light {
    --color-base: theme('colors.white'); 
    --color-text-base: theme('colors.black'); 
    --color-off-base: theme('colors.gray.50');
    --color-text-muted: theme('colors.gray.600');
    --color-text-muted-hover: theme('colors.gray.500'); 
    --color-primary: theme('colors.blue.600'); 
    --color-secondary:theme('colors.blue.300'); 
  }

  .theme-dark {
    --color-base: theme('colors.gray.900');
    --color-text-base: theme('colors.gray.100'); 
    --color-off-base: theme('colors.gray.800'); 
    --color-text-muted:theme('colors.gray.300'); 
    --color-text-muted-hover: theme('colors.gray.200');
    --color-primary: theme('colors.blue.500'); 
    --color-secondary: theme('colors.blue.200'); 
  }
}
```

配置文件中进行配置：**tailwind.config.js**，定义了一些背景色和文本颜色的 utility classes

```javascript
module.exports = {
  mode: 'jit',
  theme: {
    extend: {},
    backgroundColor: {
      //utilities like `bg-base` and `bg-primary`
      base: 'var(--color-base)',
      'off-base': 'var(--color-off-base)',
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      muted: 'var(--color-text-muted)',
    },
    textColor: {
      //like `text-base` and `text-primary`
      base: 'var(--color-text-base)',
      muted: 'var(--color-text-muted)',
      'muted-hover': 'var(--color-text-muted-hover)',
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
    },
  },
  variants: {},
  plugins: [],
}
```

在html相关的地方添加上相关的class就行了：
例如，
在需要应用相应主题样式的地方的父元素或自身元素上添加主题的标签: `theme-light`
在需要改变背景的地方添加上：`bg-base`
![](https://pic.yupi.icu/5563/202311161420202.png)
代码：[Tailwind Play](https://play.tailwindcss.com/pGH5RsrfJ0)

### unocss颜色主题切换

html代码

```html
<div class="relative flex flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
  <div class="relative px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
    <div class="mx-auto max-w-md">
      <div class="divide-y divide-gray-300/50">
        <div class="space-y-6 py-8 text-base leading-7 text-gray-600">
          <div class="font-medium text-xl"></div>
          <p class="text-xl font-bold text-gray-90 text-center">Thank you 🙏</p>
          <div class="text-sm text-base">We appreciate your support.</div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
```

配置文件中**unocss.config.ts**进行配置**shortcut**

```javascript
export default defineConfig({
    ... ...
    shortcuts:{
        'bg-base': 'bg-[#ffffff] dark:bg-[#20202a]',
        'card-base': 'bg-[#ffffff] dark:bg-[#10101a]',
        'text-base': 'text-[#20202a] dark:text-[#f0f0f0]',
    },
    ... ...
})
```

在html添加相关标签就行
代码：[UnoCSS Playground](https://unocss.dev/play/?html=DwEwlgbgBAxgNgQwM5ILwCIQIE4GsrYCmiALpIVAGZyEAeVNtAtDAPZxQBWArkmZQE8WhAHYlC2KKwgTqrAO5MAFmBAhRUAEYBzJtuwIhAVgAMUAA5CAbFCQBbAFyWmARgBM6AHwAoKFFCQsIgoGDpMmsgURKTkWrryKuIWzDbmJK5m5ppMABy2SgggCky0HNhgIrouBBW6%2BoZMAJwmJgD0RraOdswI3CSsnQ52CMyKcNqD2KzcIuogTOOD5swuJl6%2Bfv7g0PDIaOjdTL39UMOjTHYg65ubATvB%2B9uqhEwCUE-qegZCAMwt7WsfDcbncgnsMEhzAgYC9rBYhHlxLR0hEkBQaIVakwAOxQJHperWFrXYEg7ZgkLoSisMQXQjgbh2PF0dKlLzAVrbIGk27mCn7fElDjU2madggZnIr4NZqS9IwsQSLwAFQKInwAmmUEAvBuAeT2OeZuTytoFdpTBfY5eFIl4AOoUBDmcxEGBgBBJTXcSRIbhO1jYEgAOg5XI2pJDkCNt05kbD-hjEG5EcT3mTPjTqfJZv20XdsWodAYdBY7C4vH4QgV4kk0lkcGKKjUGjChKYpnhTBs9icQncJNB2dCulRUWIeZkcSYCTASWWnYs6VWFmyeSQBSKilKNUqrm3dW%2BTX%2BHW7h2OAxPIynCwm3amMzm16WK0BcYHDwwp76AzOV8uJLJprvpgkDPK87wgZ8rZ-G0pj-sCb7gugkLQrC87OIiLLWmiUAYuAO64oKrZWMSUbhlmQEiukdj0mAjJWmyngZsafjAHyg7oIKW6UeE4pWq2sqClWSqeKqCDqlAno6vqrSGnGZGAYhFpMoKI52g6Toum6HrTN6vrmP6QZMTyRkggmUZGRmllmd43hAA&config=PTAEFMGcBsEsDsAuBaAJrSBDARtcz5wAPFOQ0eAe2QCcpEbYBjRcVZWAWwAdKbFIAKC69%2BoAN6DQoVOABmCcAGFK8BQHMANFNDc6kcIgCCiBrGwBXRLDkBPbdL1RDASSarID3fsMBVKtoAvqByNJScoADkFlRMkJCRgoLEoogy8pgW0GmyCoQqarDqABSS0jRZUABcoADaOtK1kUwWkIjhtJWRmhKg7tB8NZF0qJGggQC6XlM6kAAWfIgtAjVlAAWgG1uR2OrI2JgGkUO7yLUAxHIADNfXEzKYNADWVacXAExXn%2B%2BYE91SW02m2aj3YByOJz2FzkMNh91Qjxeb3OAEYrmiUb9-kDAWtIqwSPtDuBjlECSgPl8vr8Hs8quSzpcbsy-l5Al4nAYVnUGt5nIh-JRigBKLyOHzGUyMSzWOwisV8rluDylXnSSBMTB4GoogB07wV0iYqHgQzmpm4kCqICgnF182A2Ok41FOhmgWFgiAA&css=PQKgBA6gTglgLgUzAYwK4Gc4HsC2YDCAyoWABYJQIA0YAhgHYAmYcUD6AZllDhWOqgAOg7nAB0YAGLcwCAB60cggDYIAXGBDAAUKDBi0mXGADe2sGC704AWgDuCGAHNScDQFYADJ4Dc5sAACtMLKAJ5gggCMLPK2ABR2pPBIcsoAlH4WAEa0yADWTlBYqEw2yFjK3Bpw5LxxAOTllVDoYpSMYgAs3vUZ2gC%2BmsBAA&options=N4XyA)

### 总结

上面的三个切换主题都是是基于CSS变量 + 类名切换

### 拓展


6种方案：
![](https://pic.yupi.icu/5563/202311161420682.png)