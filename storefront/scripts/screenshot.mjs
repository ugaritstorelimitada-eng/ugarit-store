/**
 * Genera screenshots del storefront local para preview.
 * Uso: node scripts/screenshot.mjs
 */
import puppeteer from "puppeteer-core"
import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"

const BASE = process.env.PREVIEW_URL || "http://localhost:3000"
const OUT = join(process.cwd(), "preview")

// Detectar Chrome en el sistema
const CHROME_PATHS = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
]
import { existsSync } from "node:fs"
const EXE = CHROME_PATHS.find((p) => existsSync(p))
if (!EXE) {
  console.error("❌ No encontré Chrome. Instala Google Chrome desde https://www.google.com/chrome")
  process.exit(1)
}

const PAGES = [
  { name: "01-home", path: "/" },
  { name: "02-tienda", path: "/tienda" },
  { name: "03-producto-eset", path: "/p/eset-home-security-ultimate" },
  { name: "04-categoria-eset", path: "/categoria/eset" },
  { name: "05-software-eset", path: "/software/eset" },
  { name: "06-mercado-publico", path: "/mercado-publico" },
  { name: "07-producto-ms", path: "/p/windows-11-pro-licencia-digital" },
  { name: "08-carrito", path: "/cart" },
  { name: "09-checkout", path: "/checkout" },
  { name: "10-cuenta", path: "/cuenta" },
]

async function main() {
  await mkdir(OUT, { recursive: true })

  const browser = await puppeteer.launch({
    executablePath: EXE,
    headless: "new",
    defaultViewport: { width: 1280, height: 900, deviceScaleFactor: 1 },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  for (const page of PAGES) {
    const url = `${BASE}${page.path}`
    const tab = await browser.newPage()
    try {
      console.log(`📸 ${page.name} → ${url}`)
      await tab.goto(url, { waitUntil: "networkidle0", timeout: 30000 })
      await new Promise((r) => setTimeout(r, 800))
      const screenshot = await tab.screenshot({ fullPage: true, type: "png" })
      const outPath = join(OUT, `${page.name}.png`)
      await writeFile(outPath, screenshot)
      console.log(`   ✓ ${(screenshot.length / 1024).toFixed(1)} KB`)
    } catch (err) {
      console.error(`   ✗ Error: ${err.message}`)
    } finally {
      await tab.close()
    }
  }

  await browser.close()
  console.log(`\n✅ Screenshots guardados en: ${OUT}`)
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
