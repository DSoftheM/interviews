const { spawn } = require("child_process")
const fs = require("fs")
const path = require("path")

const docsDir = "/Users/artur/Library/Mobile Documents/iCloud~md~obsidian/Documents/moon/Interview"
const sidebarFile = path.join(__dirname, "sidebars.ts")

function buildSidebarItems(dir, relative = "questions") {
  const list = fs.readdirSync(dir, { withFileTypes: true })
  let items = []

  // Сортируем список по дате создания
  list.sort((a, b) => {
    const aPath = path.join(dir, a.name)
    const bPath = path.join(dir, b.name)
    const aStat = fs.statSync(aPath)
    const bStat = fs.statSync(bPath)
    return bStat.birthtime - aStat.birthtime
  })

  list.forEach((entry) => {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.join(relative, entry.name).replace(/\\/g, "/")

    if (entry.isDirectory()) {
      // рекурсивно создаём категорию
      const subItems = buildSidebarItems(fullPath, relativePath)
      if (subItems.length > 0) {
        items.push(`{
  type: 'category',
  label: '${entry.name}',
  items: [
    ${subItems.join(",\n")}
  ]
}`)
      }
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      // убираем .md для Docusaurus
      const id = relativePath.replace(/\.md$/, "")
      items.push(`'${id}'`)
    }
  })

  return items
}

const items = buildSidebarItems(docsDir)

const sidebarContent = `const sidebars = {
  tutorialSidebar: [
    ${items.join(",\n")}
  ],
};

export default sidebars;
`

fs.writeFileSync(sidebarFile, sidebarContent)
spawn("npx", ["prettier", "--write", sidebarFile], { stdio: "inherit" })
console.log("✅ sidebars.ts сгенерирован с группировкой по папкам!")
