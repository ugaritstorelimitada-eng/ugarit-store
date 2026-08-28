import puppeteer from "puppeteer-core"
import { writeFile } from "node:fs/promises"

const EXE = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const OUT = "/Users/rodrigogallardoalvarado/.minimax/sessions/mvs_ed900717d77247cfbe55559f3bd249b4/workspace/ugarit-store/storefront/preview"
const BASE = "http://localhost:3000"

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
})

// 1. Header con MegaMenu cerrado
const t1 = await browser.newPage()
await t1.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
await t1.setViewport({ width: 1440, height: 600 })
await t1.screenshot({ type: "png" }).then((b) => writeFile(`${OUT}/v5b-01-header-cerrado.png`, b))
console.log("✓ header cerrado")
await t1.close()

// 2. Header con MegaMenu abierto
const t2 = await browser.newPage()
await t2.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
await t2.setViewport({ width: 1440, height: 700 })
const btn = await t2.waitForSelector('button[aria-haspopup="true"]', { timeout: 5000 })
await btn.hover()
await new Promise((r) => setTimeout(r, 800))
await t2.screenshot({ type: "png" }).then((b) => writeFile(`${OUT}/v5b-02-header-megamenu.png`, b))
console.log("✓ header megamenu abierto")
await t2.close()

// 3. Home full v5b
const t3 = await browser.newPage()
await t3.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
await t3.screenshot({ fullPage: true, type: "png" }).then((b) => writeFile(`${OUT}/v5b-03-home.png`, b))
console.log("✓ home full")
await t3.close()

// 4. Tienda
const t4 = await browser.newPage()
await t4.goto(`${BASE}/tienda`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1000))
await t4.screenshot({ fullPage: true, type: "png" }).then((b) => writeFile(`${OUT}/v5b-04-tienda.png`, b))
console.log("✓ tienda")
await t4.close()

await browser.close()
console.log("Done")
