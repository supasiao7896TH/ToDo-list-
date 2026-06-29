import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
import { readFileSync } from 'node:fs'

const svg = readFileSync(new URL('./icon.svg', import.meta.url), 'utf8')
const PUBLIC = new URL('../public/', import.meta.url)

// ไอคอนปกติ (เต็มกรอบ) และ maskable (มี safe-zone padding รอบๆ)
const targets = [
  { file: 'pwa-192.png', size: 192, pad: 0 },
  { file: 'pwa-512.png', size: 512, pad: 0 },
  { file: 'maskable-512.png', size: 512, pad: 64 },
  { file: 'apple-touch-icon.png', size: 180, pad: 0 },
]

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
const page = await browser.newPage()

for (const { file, size, pad } of targets) {
  const inner = size - pad * 2
  const html = `<!doctype html><html><body style="margin:0">
    <div style="width:${size}px;height:${size}px;background:#4338ca;display:flex;align-items:center;justify-content:center">
      <div style="width:${inner}px;height:${inner}px">${svg.replace('width="512" height="512"', `width="${inner}" height="${inner}"`)}</div>
    </div></body></html>`
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(html)
  await page.locator('div').first().screenshot({ path: new URL(file, PUBLIC).pathname })
  console.log('generated', file, `${size}x${size}`)
}

await browser.close()
