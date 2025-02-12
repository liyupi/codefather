## 什么是 package.json 文件？它的作用是什么？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点
package.json 文件是一个放在 Node.js 项目根目录下的 JSON 格式文件，它用于定义项目的各种元数据。这个文件相当于项目的配置文件，其中包含了项目的基本信息、项目所依赖的包、可执行的脚本命令等。其主要作用是帮助开发者管理和构建项目，方便其他开发者了解和使用你的项目。

1）描述项目基本信息：如项目名称、版本号、描述、关键词、许可证等。
2）定义项目依赖：记录项目运行和开发时所需的依赖包及其版本信息。
3）管理脚本命令：可以定义一些常用的脚本命令，如启动、测试、构建等。
4）项目其他配置信息：如项目的入口文件、仓库地址、bug 报告地址等。

## 扩展知识
1）**项目基本信息**：
   - **name**：项目的名称。注意，名字一定要唯一，并且遵循 npm 的命名规则，因为这个名字在 npm 注册时会作为唯一标识。
   - **version**：版本号，通常按照语义化版本化规则进行管理，例如 "1.0.0"。
   - **description**：项目的简短描述。

2）**项目依赖**：
   - **dependencies**：生产环境依赖，是项目在运行时需要的依赖包，比如 express、react 等。
   - **devDependencies**：开发环境依赖，是仅在开发过程中使用的依赖包，比如 babel、webpack 等。
   - **peerDependencies**： 对等依赖，通常用于插件开发，指定依赖但不自动安装。
   - **optionalDependencies**：可选依赖，如果安装失败不会影响整个安装过程。

3）**管理脚本命令**：
   - **scripts**：在这里你可以定义项目中的脚本命令，例如启动服务器、运行测试、构建项目等。下面是一些常用的脚本命令：
     - **start**：项目启动命令，比如 `node server.js`。
     - **test**：测试命令，如 `mocha`。
     - **build**：构建命令，如 `webpack`。

4）**其他配置**：
   - **main**：声明项目的入口文件。
   - **repository**：仓库地址，包含 type（如 git）和 url。
   - **bugs**：Bug 提交地址，通常是一个 issue 链接。
   - **keywords**：关键词数组，有助于说明项目的相关领域或用途。

除此之外，package.json 文件还可以配置如 **eslintConfig**、**browser**、**browserslist** 等，用于代码质量检查、兼容性配置等进一步增强项目的可维护性。

## 例子
以下是一个简单的 package.json 示例：

```json
{
  "name": "my-sample-project",
  "version": "1.0.0",
  "description": "这是一个示例项目",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "mocha"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo.git"
  },
  "keywords": ["nodejs", "example", "sample"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "mocha": "^8.3.2"
  }
}
```



> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)