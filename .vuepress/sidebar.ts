import { SidebarConfig4Multiple } from "vuepress/config";
import codeNavSideBar from "./sidebars/codeNavSideBar";
import interviewQuestion from "./sidebars/interviewQuestion";
import knowledgeSideBar from "./sidebars/knowledgeSideBar";
import roadmapSideBar from "./sidebars/roadmapSideBar";
import projectSideBar from "./sidebars/projectSideBar";
import productSideBar from "./sidebars/productSideBar";
import selfStudySideBar from "./sidebars/selfStudySideBar";
import programmingShareSideBar from "./sidebars/programmingShareSideBar";
import bugFixManual from "./sidebars/bugFixManual";
// @ts-ignore
export default {
  "/学习路线/": roadmapSideBar,
  "/项目实战/": projectSideBar,
  "/编程导航/": codeNavSideBar,
  "/高频面试题/": interviewQuestion,
  "/产品服务/": productSideBar,
  "/知识碎片/": knowledgeSideBar,
  "/Bug手册/": bugFixManual,
  "/自学之路/": selfStudySideBar,
  "/编程分享/": programmingShareSideBar,
  "/关于我们/": ["", "个人经历"],
  // 降级，默认根据文章标题渲染侧边栏
  "/": "auto",
} as SidebarConfig4Multiple;
