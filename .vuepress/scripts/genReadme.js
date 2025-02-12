// @ts-ignore
const fs = require("fs");
// @ts-ignore
const path = require("path");

// 定义生成 README.md 文件的函数
function genReadme(directory) {
  if (!fs.existsSync(directory)) {
    console.error(`错误：目录 "${directory}" 不存在`);
    process.exit(1);
  }

  const dirName = path.basename(directory);
  const readmeContent = generateContent(directory, dirName);
  const readmePath = path.join(directory, "README.md");

  // 写入 README.md 文件
  fs.writeFileSync(readmePath, readmeContent);
  console.log(`README.md 文件已生成在 ${readmePath}，⚠️注意检查是否有问题！`);
}

// 递归生成 Markdown 内容
function generateContent(directory, dirName) {
  let content = `# ${dirName}\n\n`;
  content += `> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)\n\n`;

  // 处理当前目录下的 Markdown 文件
  const files = getFilesInDirectory(directory);
  if (files.length > 0) {
    for (let i = 0; i < Math.min(files.length, 10); i++) {
      const file = files[i];
      // 跳过 README.md 文件
      if (path.basename(file).toLowerCase() === "readme.md") {
        continue;
      }
      const relativePath = path.relative(directory, file)?.replaceAll(" ", "%20");
      content += `[${path.basename(file, ".md")}](${relativePath})\n\n`;
    }
  }

  // 处理子目录
  const subDirs = getSubDirectories(directory);
  for (const subDir of subDirs) {
    const subDirName = path.basename(subDir);

    // content += `## [${subDirName}](/${dirName}/${subDirName.replaceAll(" ", "%20")}/)\n`;
    content += `## ${subDirName} \n`;
    const subDirFiles = getFilesInDirectory(subDir);
    for (let i = 0; i < Math.min(subDirFiles.length, 10); i++) {
      const file = subDirFiles[i];
      // 跳过 README.md 文件
      if (path.basename(file).toLowerCase() === "readme.md") {
        continue;
      }
      const relativePath = path.relative(directory, file)?.replaceAll(" ", "%20");
      content += `[${path.basename(file, ".md")}](${relativePath})\n\n`;
    }
  }

  // 添加底部内容
  content += `> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)\n\n`;

  return content;
}

// 获取目录下的所有子目录
function getSubDirectories(directory) {
  const items = fs.readdirSync(directory, { withFileTypes: true });
  return items.filter((item) => item.isDirectory()).map((dir) => path.join(directory, dir.name));
}

// 获取目录下的所有 Markdown 文件
function getFilesInDirectory(directory) {
  const items = fs.readdirSync(directory, { withFileTypes: true });
  return items
    .filter((item) => item.isFile() && path.extname(item.name) === ".md")
    .map((file) => path.join(directory, file.name));
}

// 从命令行参数获取目标目录
const targetDirectory = process.argv[2];
if (!targetDirectory) {
  console.error("错误：请提供目标目录路径作为参数");
  process.exit(1);
}

// 调用生成 README.md 文件的函数
genReadme(targetDirectory);
