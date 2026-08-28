import puppeteer from "puppeteer-core"
import { writeFile } from "node:fs/promises"

const EXE = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const OUT_DIR = "/Users/rodrigogallardoalvarado/.minimax/sessions/mvs_ed900717d77247cfbe55559f3bd249b4/workspace/ugarit-store/storefront/preview"
const PAGES = [
  { name: "01-home", path: "/" },
  { name: "02-tienda", path: "/tienda" },
  { name: "03-producto-eset", path: "/p/eset-home-security-ultimate" },
  { name: "04-producto-ms", path: "/p/windows-11-pro-licencia-digital" },
  { name: "05-software-eset", path: "/software/eset" },
  { name: "06-mercado-publico", path: "/mercado-publico" },
  { name: "07-contacto", path: "/contacto" },
]

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
})
for (const page of PAGES) {
  const tab = await browser.newPage()
  await tab.goto(`http://localhost:3000${page.path}`, { waitUntil: "networkidle0" })
  await new Promise((r) => setTimeout(r, 1000))
  const png = await tab.screenshot({ fullPage: true, type: "png" })
  await writeFile(`${OUT_DIR}/${page.name}.png`, png)
  console.log(`✓ ${page.name} (${(png.length / 1024).toFixed(0)} KB)`)
  await tab.close()
}
await browser.close()
console.log("Done")
