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

// 1. Header v7 refinado (con bloque cuenta/carrito en 2 líneas)
const t1 = await browser.newPage()
await t1.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
await t1.setViewport({ width: 1440, height: 700 })
await t1.screenshot({ type: "png" }).then((b) => writeFile(`${OUT}/v7-01-header-refinado.png`, b))
console.log("✓ header refinado v7")
await t1.close()

// 2. Hover en el bloque de cuenta (muestra el bg-slate-100)
const t2 = await browser.newPage()
await t2.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
await t2.setViewport({ width: 1440, height: 700 })
// Hover sobre el link de "Iniciar sesión"
const accountLink = await t2.waitForSelector('a[aria-label="Iniciar sesión"].hidden', { timeout: 5000 }).catch(() => null)
// fallback: hover sobre cualquier link visible
await t2.hover("a[href='/cuenta']")
await new Promise((r) => setTimeout(r, 500))
await t2.screenshot({ type: "png" }).then((b) => writeFile(`${OUT}/v7-02-header-hover-cuenta.png`, b))
console.log("✓ hover en cuenta")
await t2.close()

// 3. Header con productos en carrito (badge visible verde)
// Simulamos agregando producto via localStorage antes de ir al home
const t3 = await browser.newPage()
await t3.goto(`${BASE}/`, { waitUntil: "networkidle0" })
// Inyectar carrito con 3 items
await t3.evaluate(() => {
  const cart = {
    state: {
      items: [
        { id: "eset-hsu-3D1Y", handle: "eset-home-security-ultimate", title: "ESET Home Security", price: 34990, image: "/ugarit-logo-corporate.png", quantity: 1, maxStock: 999, virtual: true },
        { id: "wp_27923-default", handle: "windows-11-pro", title: "Windows 11 Pro", price: 14990, image: "/ugarit-logo-corporate.png", quantity: 2, maxStock: 100, virtual: true },
        { id: "wp_27955-default", handle: "m365-personal", title: "Microsoft 365", price: 14990, image: "/ugarit-logo-corporate.png", quantity: 1, maxStock: 100, virtual: true },
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
await t3.screenshot({ type: "png" }).then((b) => writeFile(`${OUT}/v7-03-header-con-carrito.png`, b))
console.log("✓ header con carrito lleno (3 items)")
await t3.close()

// 4. Home v7 full
const t4 = await browser.newPage()
await t4.goto(`${BASE}/`, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
await t4.screenshot({ fullPage: true, type: "png" }).then((b) => writeFile(`${OUT}/v7-04-home.png`, b))
console.log("✓ home full")
await t4.close()

await browser.close()
console.log("Done")
