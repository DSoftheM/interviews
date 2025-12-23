const fs = require("fs")
const path = require("path")

const docsDir = path.join(__dirname, "docs/questions") // путь к Markdown-файлам
const sidebarFile = path.join(__dirname, "sidebars.ts")

function getAllMdFiles(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      results = results.concat(getAllMdFiles(fullPath))
    } else if (file.endsWith(".md")) {
      results.push({
        path: fullPath,
        birthtime: stat.birthtime, // дата создания файла
        relativePath: path.relative(path.join(__dirname, "docs"), fullPath).replace(/\\/g, "/"),
      })
    }
  })
  return results
}

const files = getAllMdFiles(docsDir)

// сортировка по дате создания (сначала новые)
files.sort((a, b) => b.birthtime - a.birthtime)

// строим массив для sidebar
const items = files.map((f) => `'${f.relativePath.replace(/\.md$/, "")}'`).join(",\n  ")

// генерируем sidebars.ts
const sidebarContent = `const sidebars = {
  tutorialSidebar: [
    ${items}
  ],
};

export default sidebars;
`

fs.writeFileSync(sidebarFile, sidebarContent)
console.log("✅ sidebars.ts сгенерирован автоматически!")
