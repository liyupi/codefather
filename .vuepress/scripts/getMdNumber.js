const fs = require("fs");
const path = require("path");

/**
 * 递归计算目录下的 .md 文件数量
 * @param {string} dirPath 目录路径
 * @returns {number} .md 文件数量
 */
function countMarkdownFiles(dirPath) {
  let count = 0;

  try {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        count += countMarkdownFiles(filePath); // 递归子目录
      } else if (path.extname(file) === ".md") {
        count++;
      }
    }
  } catch (error) {
    console.error(`读取目录出错: ${error.message}`);
  }

  return count;
}

// 获取用户输入的路径
const inputPath = process.argv[2];
if (!inputPath) {
  console.error("请提供目录路径作为参数");
  process.exit(1);
}

// 计算并输出结果
const absolutePath = path.resolve(inputPath);
const markdownCount = countMarkdownFiles(absolutePath);
console.log(`目录 '${absolutePath}' 下共有 ${markdownCount} 个 .md 文件。`);
