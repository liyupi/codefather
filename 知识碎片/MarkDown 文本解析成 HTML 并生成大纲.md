# MarkDown 文本解析成 HTML 并生成大纲

> 作者：[过....](https://wx.zsxq.com/dweb2/index/footprint/212511211885411)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 30885

markdown转换成html参考：https://blog.csdn.net/weixin_45894305/article/details/106362783?spm=1001.2014.3001.5506

### 渲染后样式跟预期不符

添加css即可，一般直接在父标签上设定一个类名然后给子标签加样式： 可以在github上找一个用：https://github.com/sindresorhus/github-markdown-css

### 转换成html无法通过js操作

这是因为转换后dom加载需要一定的时间，在这个时间内操作会出现 null 问题，解决：

```go
setTimeout(() => {
      //要处理转换html后的逻辑
  },1)
```

一般参数1毫秒即可，最好设大一点

### 生成大纲

#### 拿到所有子标签

当dom渲染上去后，我们去获取到用于渲染html文本的标签的所有子标签

```go
document.querySelector(".markdown-body").children
```

#### 通过正则表达式提取出h1-h10之间的标签

```go
const regex =  /h(10|[1-9])/g;
      for (let i = 0; i < document.querySelector(".markdown-body").children.length; i++){
        if (htmlContent[i].localName.match(regex)) {
            
        }
}
```

#### 处理每个标题

大纲一般都有父子关系，我们需要去对每个标题进行父子关系的处理，比如标题 3 在标题 1 的后面，那他就是标题 1 的子标题

```go
const  treeData = ref([]);
//是否找到子目录
let isFind = false;
//解析子目录
const setSubDirectory = (directory, level, label) => {
  //表示当前的目录层级
  const curr = directory
  //表示递归的目录层级
  const children = directory.children
  if (children.length > 0) {
    //递归子目录，从最后一个孩子开始
    setSubDirectory(directory.children[children.length-1],level,label)
  }
  //子目录已经归位
  if (isFind === true) return;
  //当前层级小于等于目录层级，表示找到了目录
  if (curr.level < level) {
    isFind = true
    curr.children.push({ level, label,children: []})
  }
}

//解析html，生成目录树
const setTreeDataByHtml = (htmlContent) => {
  const regex =  /h(10|[1-9])/g;
      for (let i = 0; i < htmlContent.length; i++){
        if (htmlContent[i].localName.match(regex)) {
          const level = parseInt(htmlContent[i].localName.replace("h", ""))
          const label = htmlContent[i].innerText
          //不需要找子目录
          if (treeData.value.length === 0 || treeData.value[treeData.value.length - 1].level >= level) {
              treeData.value.push({ label, level,children: []})
          } else {
            isFind = false
            setSubDirectory(treeData.value[treeData.value.length - 1],level,label)
          } 
        }
}
}
```

> 细节：我们将标题分为两类，一种是直接可以用作父标题，一种则是需要添加在父标题中的子标题 如果当前标题的层级小于等于数据中最后一个父标题的层级，那么他就是父标题，直接添加到数组中即可 子标题通过递归的方式，先找到最底层的标题，依次往上寻找，直到找到合适的位置即可 合适的位置：子标题的层级大于父标题的层级，这里我们用level来表示

#### 解析生成大纲

通过 element-plus 中的 tree组件库来实现

#### 测试结果

![](https://pic.yupi.icu/5563/202401081829355.png)

#### 完整代码

> tips: 复制过去记得改，是拿以前项目写的

文章详情页，在此引用大纲页面，为 ArticleTree，调用 ArticleTree 里的函数生成大纲的函数在82行

```go
<template>
  <div class="container view">
    <div class="card">
      <div class="card-body">
        <h3>{{ share.title }}</h3>
        <span class="author_descibe" style="margin-left: 0px">作者：</span>
        <router-link class="ToOpenShare" :to="{ name: 'home' }">
          <img :src="share.authorPhoto" alt="" />
          <span class="author" style="font-size: 18px; margin-left: 10px"
            >{{ share.author }}
          </span>
        </router-link>
        <span class="createtime">{{ share.createtime }}</span>
        <span class="reading_descibe">阅读</span>
        <span class="reading">{{ share.reading }}</span>
        <hr />

        <div v-html="share.content" class="markdown-body"></div>
      </div>
    </div>

    <hr />

    <CommentView :shareId="route.params.shareId" />
  </div>
 <ArticleTree ref="ArticleTreeRef"/> 
</template>

<script>
import $ from "jquery";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { reactive, onMounted,ref } from "vue";
import CommentView from "@/views/share/comment/CommentView.vue";
import { marked } from 'marked';
import ArticleTree from "./ArticleTree.vue";

export default {
  components: {
    CommentView,ArticleTree
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const ArticleTreeRef = ref(null)
    const share = reactive({
      title: "",
      createtime: "",
      content: "",
      reading: null,
      authorPhoto: "",
      author: "",
    });
    onMounted(() => {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = 'https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css'
    document.head.appendChild(link)
});

    
    //打开某一分享页面就调用
    const getShare = () => {
      $.ajax({
        url: "https://app5608.acapp.acwing.com.cn/api/get/share/",
        type: "get",
        data: {
          userId: store.state.user.id,
          shareId: route.params.shareId,
        },
        headers: {
          Authorization: "Bearer " + store.state.user.token,
        },

        success(resp) {
          // eslint-disable-next-line no-empty
          if (resp.error_message === "successfully") {
            share.title = resp.share.title;
            share.createtime = resp.share.createTime;
            share.content = marked(resp.share.content)
            setTimeout(() => {
      ArticleTreeRef.value.setTreeDataByHtml(document.querySelector(".markdown-body").children)
  },1)
            share.reading = resp.share.reading;
            share.authorPhoto = resp.authorPhoto;
            share.author = resp.author;
          }
        },
        error() {},
      });
    };

    getShare();

    return {
      share,
      route,
      ArticleTreeRef,
    };
  },
};
</script>

<style scoped>
.view {
  margin-top: 20px;
}

.container {
  max-width: 900px;
}
hr {
  color: gray;
}
img {
  border-radius: 50%;
  width: 4vh;
  height: 4vh;
  margin-left: 10px;
  line-height: 15px;
}

.author_descibe,
.createtime,
.reading_descibe,
.reading {
  font-size: 12px;
  color: gray;
  margin-left: 10px;
}

.ToOpenShare {
  color: rgb(51, 122, 199);
  text-decoration: none;
  line-height: 30px;
  font-size: 16px;
}

.ToOpenShare:hover {
  color: rgb(35, 82, 124);
  text-decoration: underline;
}
</style>
```

ArticleTree

```go
<!-- 将文章目录以树的形式展示 -->
<template>
  <el-tree :data="treeData" :expand-on-click-node="false" class="tree"></el-tree>
</template>

<script setup>
import { ref,defineExpose } from "vue";
const  treeData = ref([]);
//是否找到子目录
let isFind = false;
//解析子目录
const setSubDirectory = (directory, level, label) => {
  //表示当前的目录层级
  const curr = directory
  //表示递归的目录层级
  const children = directory.children
  if (children.length > 0) {
    //递归子目录，同层级下，数组下标在其范围即可
    setSubDirectory(directory.children[children.length-1],level,label)
  }
  //子目录已经归位
  if (isFind === true) return;
  //当前层级小于等于目录层级，表示找到了目录
  if (curr.level < level) {
    isFind = true
    curr.children.push({ level, label,children: []})
  }
}

//解析html，生成目录树
const setTreeDataByHtml = (htmlContent) => {
  const regex =  /h(10|[1-9])/g;
      for (let i = 0; i < htmlContent.length; i++){
        if (htmlContent[i].localName.match(regex)) {
          const level = parseInt(htmlContent[i].localName.replace("h", ""))
          const label = htmlContent[i].innerText
          //不需要找子目录
          if (treeData.value.length === 0 || treeData.value[treeData.value.length - 1].level >= level) {
              treeData.value.push({ label, level,children: []})
          } else {
            isFind = false
            setSubDirectory(treeData.value[treeData.value.length - 1],level,label)
          } 
        }
}
}
defineExpose({
  setTreeDataByHtml
})
</script>


<style scoped>
.tree{
  width: 20%;
  position: fixed;
  top: 80px;  /* 从页面顶部的距离 */
  right: 50px; /* 从页面左侧的距离 */
}
</style>
```

### 点击目录导航到对应标题位置

只要获取到dom实例，通过scrollIntoView函数即可完成 示例：

```go
element.scrollIntoView({
          behavior: "instant",
          block: "center",
        });
```

### 当滚动条滚动到标题位置，设置目录里标题高亮

通过IntersectionObserver实例来做，当监听的dom出现在视图区域中，会触发回调函数，从而来设置高亮 示例：

```go
// 创建 Intersection Observer 实例
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // 目标元素进入可视区域
      treeRef.value.setCurrentKey(entry.target.id)
    }
  });
}, { threshold: 0 });
//将要监听的目标元素加入Observer中
observer.observe(htmlContent[i])
```

> htmlContent[i] 代表你要监听目标元素的dom