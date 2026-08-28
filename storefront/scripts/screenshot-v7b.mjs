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

// 1. Header v7b con pastilla de borde
const t1 = await browser.newPage()
await t1.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
await t1.setViewport({ width: 1440, height: 700 })
await t1.screenshot({ type: "png" }).then((b) => writeFile(`${OUT}/v7b-01-header-pastilla.png`, b))
console.log("✓ header con pastilla")
await t1.close()

// 2. Hover en el bloque cuenta
const t2 = await browser.newPage()
await t2.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
await t2.setViewport({ width: 1440, height: 700 })
await t2.hover("a[href='/cuenta']")
await new Promise((r) => setTimeout(r, 500))
await t2.screenshot({ type: "png" }).then((b) => writeFile(`${OUT}/v7b-02-hover-cuenta.png`, b))
console.log("✓ hover en cuenta")
await t2.close()

// 3. Header con carrito (badge verde prominente)
const t3 = await browser.newPage()
await t3.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await t3.evaluate(() => {
  const cart = {
    state: {
      items: [
        { id: "eset-hsu-3D1Y", handle: "eset-home-security-ultimate", title: "ESET Home Security", price: 34990, image: "/ugarit-logo-corporate.png", quantity: 1, maxStock: 999, virtual: true },
        { id: "wp_27923-default", handle: "windows-11-pro", title: "Windows 11 Pro", price: 14990, image: "/ugarit-logo-corporate.png", quantity: 2, maxStock: 100, virtual: true },
      ],
      isOpen: false,
    },
    version: 0,
  }
  localStorage.setItem("ugarit-cart", JSON.stringify(cart))
})
await t3.reload({ waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
await t3.setViewport({ width: 1440, height: 700 })
await t3.screenshot({ type: "png" }).then((b) => writeFile(`${OUT}/v7b-03-carrito-badge-verde.png`, b))
console.log("✓ carrito con badge verde")
await t3.close()

// 4. Hover en carrito
const t4 = await browser.newPage()
await t4.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
await t4.setViewport({ width: 1440, height: 700 })
await t4.hover("a[href='/cart']")
await new Promise((r) => setTimeout(r, 500))
await t4.screenshot({ type: "png" }).then((b) => writeFile(`${OUT}/v7b-04-hover-carrito.png`, b))
console.log("✓ hover en carrito")
await t4.close()

// 5. Home full
const t5 = await browser.newPage()
await t5.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
await t5.screenshot({ fullPage: true, type: "png" }).then((b) => writeFile(`${OUT}/v7b-05-home.png`, b))
console.log("✓ home")
await t5.close()

await browser.close()
console.log("Done")
