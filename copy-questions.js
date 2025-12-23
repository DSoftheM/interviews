const fs = require("fs")
const path = require("path")

const srcDir = "/Users/artur/Library/Mobile Documents/iCloud~md~obsidian/Documents/moon/Interview"
const destDir = "/Users/artur/dev/interview/docs/questions"

// Функция для удаления папки и всего её содержимого
function removeDirRecursive(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = path.join(dir, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDirRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(dir)
  }
}

// Функция для копирования .md файлов рекурсивно
function copyMdFiles(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true })

  entries.forEach((entry) => {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true })
      }
      copyMdFiles(srcPath, destPath)
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      fs.copyFileSync(srcPath, destPath)
      console.log(`Копирован: ${srcPath} → ${destPath}`)
    }
  })
}

// Удаляем папку назначения целиком
if (fs.existsSync(destDir)) {
  removeDirRecursive(destDir)
}

// Создаём пустую папку назначения
fs.mkdirSync(destDir, { recursive: true })

// Копируем файлы
copyMdFiles(srcDir, destDir)

console.log("✅ Все .md файлы скопированы заново!")
