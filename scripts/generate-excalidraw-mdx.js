#!/usr/bin/env node
const fs = require("fs").promises
const path = require("path")
const matter = require("gray-matter")

const SRC = path.join(process.cwd(), "docs")
const OUT = path.join(process.cwd(), "docs")

async function findFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const results = []
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      results.push(...(await findFiles(full)))
    } else if (e.isFile() && full.endsWith(".excalidraw.md")) {
      results.push(full)
    }
  }
  return results
}

function extractJson(text) {
  const m = /```json\s*([\s\S]*?)```/m.exec(text)
  return m ? m[1].trim() : null
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function main() {
  try {
    const files = await findFiles(SRC)
    if (!files.length) {
      console.log("No .excalidraw.md files found under docs/")
      return
    }

    let created = 0
    for (const f of files) {
      const rel = path.relative(SRC, f)
      const raw = await fs.readFile(f, "utf8")
      const fm = matter(raw)
      const jsonText = extractJson(fm.content || raw)
      if (!jsonText) {
        console.warn(`Skipping ${rel}: no JSON block found`)
        continue
      }

      let parsed
      try {
        parsed = JSON.parse(jsonText)
      } catch (e) {
        console.warn(`Skipping ${rel}: invalid JSON block - ${e.message}`)
        continue
      }

      const outRel = rel.replace(/\.excalidraw\.md$/i, ".mdx")
      const outPath = path.join(OUT, outRel)
      await ensureDir(path.dirname(outPath))

      const id = outRel.replace(/[\/]/g, "-").replace(/\.mdx$/i, "")
      const title = fm.data && fm.data.title ? fm.data.title : path.basename(outRel, ".mdx")

      const mdx = `
import BrowserOnly from '@docusaurus/BrowserOnly'

<BrowserOnly>
    {() => {
        const React = require('react');
        const { Excalidraw } = require('@excalidraw/excalidraw');
        require('@excalidraw/excalidraw/index.css');

        return <div style={{ height: "600px", width: "100%" }}>
            <Excalidraw initialData={${JSON.stringify(parsed, null, 2)}} />
        </div>
    }}
</BrowserOnly>
`

      await fs.writeFile(outPath, mdx, "utf8")
      console.log(`Generated ${path.relative(process.cwd(), outPath)}`)
      created++
    }

    console.log(`Done. ${created} MDX files generated in ${path.relative(process.cwd(), OUT)}`)
  } catch (err) {
    console.error("Error generating MDX files:", err)
    process.exitCode = 1
  }
}

main()
