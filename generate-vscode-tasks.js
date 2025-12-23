const fs = require("fs")
const path = require("path")

// Путь к package.json
const packageJsonPath = path.join(__dirname, "package.json")
const vscodeTasksPath = path.join(__dirname, ".vscode", "tasks.json")

// Читаем package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))

// Создаем папку .vscode, если нет
if (!fs.existsSync(path.dirname(vscodeTasksPath))) {
  fs.mkdirSync(path.dirname(vscodeTasksPath), { recursive: true })
}

// Формируем массив задач
const tasks = Object.keys(packageJson.scripts).map((scriptName) => ({
  label: scriptName,
  type: "shell",
  command: `npm run ${scriptName}`,
}))

// Структура tasks.json
const tasksJson = {
  version: "2.0.0",
  tasks,
}

// Сохраняем tasks.json
fs.writeFileSync(vscodeTasksPath, JSON.stringify(tasksJson, null, 2), "utf-8")

console.log("✅ tasks.json успешно сгенерирован из package.json!")
