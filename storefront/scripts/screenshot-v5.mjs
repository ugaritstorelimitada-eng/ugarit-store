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

// 1. Home con MegaMenu cerrado
const tab1 = await browser.newPage()
await tab1.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
await tab1.screenshot({ fullPage: true, type: "png" }).then((b) =>
  writeFile(`${OUT}/v5-01-home.png`, b)
)
console.log("✓ home")
await tab1.close()

// 2. Home con MegaMenu abierto (hover)
const tab2 = await browser.newPage()
await tab2.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
// Hover sobre el botón del MegaMenu
const button = await tab2.waitForSelector('button[aria-haspopup="true"]', { timeout: 5000 })
await button.hover()
await new Promise((r) => setTimeout(r, 800))
await tab2.screenshot({ fullPage: false, type: "png" }).then((b) =>
  writeFile(`${OUT}/v5-02-megamenu-abierto.png`, b)
)
console.log("✓ megamenu abierto")
await tab2.close()

// 3. Vista solo del header con MegaMenu (para ver limpio)
const tab3 = await browser.newPage()
await tab3.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1200))
await tab3.setViewport({ width: 1440, height: 600 })
const btn = await tab3.waitForSelector('button[aria-haspopup="true"]', { timeout: 5000 })
await btn.hover()
await new Promise((r) => setTimeout(r, 800))
await tab3.screenshot({ fullPage: false, type: "png" }).then((b) =>
  writeFile(`${OUT}/v5-03-header-megamenu.png`, b)
)
console.log("✓ header con megamenu")
await tab3.close()

// 4. Vista del home "above the fold" (sin scroll) con MegaMenu
const tab4 = await browser.newPage()
await tab4.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1200))
await tab4.setViewport({ width: 1440, height: 900 })
await tab4.screenshot({ fullPage: false, type: "png" }).then((b) =>
  writeFile(`${OUT}/v5-04-home-fold.png`, b)
)
console.log("✓ home fold")
await tab4.close()

// 5. Tienda
const tab5 = await browser.newPage()
await tab5.goto(`${BASE}/tienda`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1000))
await tab5.screenshot({ fullPage: true, type: "png" }).then((b) =>
  writeFile(`${OUT}/v5-05-tienda.png`, b)
)
console.log("✓ tienda")
await tab5.close()

await browser.close()
console.log("Done")
