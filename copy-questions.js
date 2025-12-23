const fs = require("fs")
const path = require("path")

const srcDir = "/Users/artur/Library/Mobile Documents/iCloud~md~obsidian/Documents/moon/Interview"
const destDir = "/Users/artur/dev/interview/docs/questions"

function copyMdFiles(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true })

  entries.forEach((entry) => {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      // Создаём папку назначения, если её нет
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true })
      }
      copyMdFiles(srcPath, destPath) // рекурсивно копируем
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      // Копируем файл
      fs.copyFileSync(srcPath, destPath)
      console.log(`Копирован: ${srcPath} → ${destPath}`)
    }
  })
}

// Создаём корневую папку назначения, если нет
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

copyMdFiles(srcDir, destDir)

console.log("✅ Все .md файлы скопированы!")
