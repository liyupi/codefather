const fs = require("fs");
const path = require("path");

function generateSidebarConfig(dirPath) {
  const absolutePath = path.resolve(process.cwd(), dirPath);
  const sidebarItems = [];

  // 如果根目录有 README.md，添加空字符串
  if (fs.existsSync(path.join(absolutePath, "README.md"))) {
    sidebarItems.push("");
  }

  // 读取目录内容
  function scanDirectory(currentPath, relativeDirPath = "") {
    const items = [];
    const files = fs.readdirSync(currentPath);

    files.forEach((file) => {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isFile() && file.endsWith(".md") && file !== "README.md") {
        // 如果有相对路径，添加相对路径
        const relativePath = relativeDirPath
          ? `${relativeDirPath}/${file.replace(".md", "")}`
          : file.replace(".md", "");
        items.push(relativePath);
      }
    });

    return items.sort();
  }

  // 检查目录是否包含子目录
  function hasSubDirectories(dirPath) {
    const items = fs.readdirSync(dirPath);
    return items.some((item) => {
      const fullPath = path.join(dirPath, item);
      return fs.statSync(fullPath).isDirectory();
    });
  }

  // 处理目录
  function processDirectory(currentPath, isRoot = true) {
    const dirs = fs.readdirSync(currentPath, { withFileTypes: true });

    // 如果当前目录只包含文件（没有子目录）
    if (!hasSubDirectories(currentPath)) {
      const files = scanDirectory(currentPath);
      if (files.length > 0) {
        sidebarItems.push({
          title: path.basename(currentPath),
          collapsable: false,
          children: files,
        });
      }
      return;
    }

    // 处理包含子目录的情况
    dirs.forEach((dir) => {
      if (dir.isDirectory() && !dir.name.startsWith(".")) {
        const fullPath = path.join(currentPath, dir.name);
        const children = [];

        // 扫描子目录中的文件
        function scanSubDirectory(subPath, relPath) {
          const subItems = fs.readdirSync(subPath);
          subItems.forEach((item) => {
            const itemPath = path.join(subPath, item);
            const itemStat = fs.statSync(itemPath);

            if (itemStat.isFile() && item.endsWith(".md")) {
              if (item === "README.md") {
                // children.push(`${relPath}/`);
              } else {
                // 如果包含特殊字符
                if (item.includes("!")) {
                  children.push(`${relPath}/${encodeURI(item.replace(".md", ""))}`);
                } else {
                  children.push(`${relPath}/${item.replace(".md", "")}`);
                }
              }
            } else if (itemStat.isDirectory()) {
              scanSubDirectory(itemPath, `${relPath}/${item}`);
            }
          });
        }

        scanSubDirectory(fullPath, `${dir.name}`);

        if (children.length > 0) {
          sidebarItems.push({
            title: dir.name,
            collapsable: true,
            children: children.sort(),
          });
        }
      }
    });
  }

  processDirectory(absolutePath);
  return sidebarItems;
}

// 接收命令行参数
const targetDir = process.argv[2] || ".";

try {
  // 检查目录是否存在
  if (!fs.existsSync(targetDir)) {
    throw new Error(`目录 "${targetDir}" 不存在`);
  }

  // 生成配置
  const sidebarConfig = generateSidebarConfig(targetDir);

  // 生成 TypeScript 代码
  const tsContent = `// 自动生成的侧边栏配置

export default ${JSON.stringify(sidebarConfig, null, 2)};

`;

  // 写入文件
  fs.writeFileSync("temp.ts", tsContent, "utf-8");
  console.log("侧边栏配置已生成到 temp.ts 文件中");

  // 输出生成的配置预览
  console.log("\n生成的配置预览：");
  console.log(JSON.stringify(sidebarConfig, null, 2));
} catch (error) {
  console.error("错误：", error instanceof Error ? error.message : "未知错误");
  process.exit(1);
}
