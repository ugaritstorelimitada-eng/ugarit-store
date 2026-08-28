import puppeteer from "puppeteer-core"
import { writeFile } from "node:fs/promises"

const EXE = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const OUT = "/Users/rodrigogallardoalvarado/.minimax/sessions/mvs_ed900717d77247cfbe55559f3bd249b4/workspace/ugarit-store/storefront/preview/home-fresco.png"

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
})
const tab = await browser.newPage()
await tab.goto("http://localhost:3000/", { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1500))
const png = await tab.screenshot({ fullPage: true, type: "png" })
await writeFile(OUT, png)
console.log("OK", png.length, "bytes")
await browser.close()
