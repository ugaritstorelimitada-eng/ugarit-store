import puppeteer from "puppeteer-core"
import { writeFile } from "node:fs/promises"

const EXE = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: "new",
  defaultViewport: { width: 1280, height: 1100 },
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
})
const tab = await browser.newPage()
await tab.goto("http://localhost:3000/contacto", { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 800))
const png = await tab.screenshot({ fullPage: true, type: "png" })
await writeFile(
  "/Users/rodrigogallardoalvarado/.minimax/sessions/mvs_ed900717d77247cfbe55559f3bd249b4/workspace/ugarit-store/storefront/preview/contacto-24-7.png",
  png
)
console.log("OK", png.length, "bytes")
await browser.close()
