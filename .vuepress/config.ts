import { defineConfig } from "vuepress/config";
import extraSideBar from "./extraSideBar";
import footer from "./footer";
import navbar from "./navbar";
import sidebar from "./sidebar";

const author = "程序员鱼皮";
const domain = "https://code.yupi.icu";
const tags = ["程序员", "编程", "计算机"];

export default defineConfig({
  title: "鱼皮的编程宝典",
  description: "贴心的编程学习路线，全面的编程知识百科",
  head: [
    // 站点图标
    ["link", { rel: "icon", href: "/favicon.ico" }],
    // SEO
    [
      "meta",
      {
        name: "keywords",
        content: "程序员鱼皮, 编程学习路线, 编程知识百科, Java, 编程导航, 前端, 开发, 编程分享, 项目, IT, 求职, 面经",
      },
    ],
    // 百度统计
    [
      "script",
      {},
      `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?2675818a983a3131404cee835018f016";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
      `,
    ],
  ],
  permalink: "/:slug",

  // 监听文件变化，热更新
  extraWatchFiles: [".vuepress/*.ts", ".vuepress/sidebars/*.ts"],
  markdown: {
    // 开启代码块的行号
    lineNumbers: true,
    // 支持 4 级以上的标题渲染
    extractHeaders: ["h2", "h3", "h4", "h5", "h6"],
  },
  // @ts-ignore
  plugins: [
    ["@vuepress/back-to-top"],
    // Google 分析
    [
      "@vuepress/google-analytics",
      {
        ga: "GTM-WVS9HM6W", // 补充自己的谷歌分析 ID，比如 UA-00000000-0
      },
    ],
    [
      "vuepress-plugin-zooming",
      {
        selector: ".custom-content img",
        delay: 1000,
        options: {
          bgColor: "black",
          zIndex: 10000,
        },
      },
    ],
    // https://github.com/lorisleiva/vuepress-plugin-seo
    [
      "seo",
      {
        siteTitle: (_, $site) => $site.title,
        title: ($page) => $page.title,
        description: ($page) => $page.frontmatter.description || $page.description,
        author: (_, $site) => $site.themeConfig.author || author,
        tags: ($page) => $page.frontmatter.tags || tags,
        type: ($page) => "article",
        url: (_, $site, path) => ($site.themeConfig.domain || domain || "") + path,
        image: ($page, $site) =>
          $page.frontmatter.image &&
          (($site.themeConfig.domain && !$page.frontmatter.image.startsWith("http")) || "") + $page.frontmatter.image,
        publishedAt: ($page) => $page.frontmatter.date && new Date($page.frontmatter.date),
        modifiedAt: ($page) => $page.lastUpdated && new Date($page.lastUpdated),
      },
    ],
    // https://github.com/ekoeryanto/vuepress-plugin-sitemap
    [
      "sitemap",
      {
        hostname: domain,
      },
    ],
    // https://github.com/IOriens/vuepress-plugin-baidu-autopush
    ["vuepress-plugin-baidu-autopush"],
    // https://github.com/zq99299/vuepress-plugin/tree/master/vuepress-plugin-tags
    ["vuepress-plugin-tags"],
    // https://github.com/znicholasbrown/vuepress-plugin-code-copy
    [
      "vuepress-plugin-code-copy",
      {
        successText: "代码已复制",
      },
    ],
    // https://github.com/webmasterish/vuepress-plugin-feed
    [
      "feed",
      {
        canonical_base: domain,
        count: 10000,
        // 需要自动推送的文档目录
        posts_directories: [],
      },
    ],
    // https://github.com/tolking/vuepress-plugin-img-lazy
    ["img-lazy"],
    [
      "vuepress-plugin-readmore-popular",
      {
        // 已申请的博客 ID
        blogId: "56209-2002664463317-162",
        // 已申请的微信公众号名称
        name: "程序员鱼皮",
        // 已申请的微信公众号回复关键词
        keyword: "编程宝典",
        // 已申请的微信公众号二维码图片
        qrcode: "https://pic.code-nav.cn/common/qrcode-mpcoder_yupi.jpg",
        // 文章内容的 JS 选择器，若使用的不是官方默认主题，则需要根据第三方的主题来设置
        selector: "div.theme-default-content",
        // 自定义的 JS 资源链接，可用于 CDN 加速
        libUrl: "https://qiniu.techgrow.cn/readmore/dist/readmore.js",
        // 自定义的 CSS 资源链接，可用于适配不同风格的博客
        cssUrl: "https://qiniu.techgrow.cn/readmore/dist/vuepress.css",
        // 文章排除添加引流工具的 URL 规则，支持使用路径、通配符、正则表达式的匹配规则
        excludes: { strExp: [], regExp: [] },
        // 是否反转 URL 排除规则的配置，即只有符合排除规则的文章才会添加引流工具
        reverse: false,
        // 文章内容的预览高度(例如 300)，设置值为 auto 则表示预览高度自适应
        height: "auto",
        // 是否添加微信公众号引流工具到移动端页面
        allowMobile: false,
        // 文章解锁后凭证的有效天数
        expires: 365,
        // 定时校验凭证有效性的时间间隔（秒）
        interval: 60,
        // 等待 DOM 节点加载完成的时间（毫秒），如果部分页面的引流功能无法生效，可适当增大此参数的值
        waitDomMills: 1000,
        // 每篇文章随机添加引流工具的概率，范围在 0.1 ~ 1.0 之间，代表 10% ~ 100%，其中 1.0 表示所有文章默认都添加引流工具
        random: 1.0,
      },
    ],
  ],
  // 主题配置
  themeConfig: {
    logo: "/logo.png",
    nav: navbar,
    sidebar,
    lastUpdated: "最近更新",

    // GitHub 仓库位置
    repo: "liyupi/codefather",
    docsBranch: "master",

    // 编辑链接
    editLinks: true,
    editLinkText: "完善页面",

    // @ts-ignore
    // 底部版权信息
    footer,
    // 额外右侧边栏
    extraSideBar,
  },
});
