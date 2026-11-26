import { chromium } from 'playwright'
const EXE = `${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-1252/chrome-headless-shell-linux64/chrome-headless-shell`
const B = 'http://127.0.0.1:5211/'
const KEY = 'potentialorg-home-ready-demo-db'
const browser = await chromium.launch({ executablePath: EXE })
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort())
const page = await ctx.newPage()
const shots = [
  [null, '/'], ['L01', '/learn/home'], ['L01', '/learn/journeys/renew-or-move'], ['L02', '/learn/calculator?tab=rent-vs-buy'],
  ['L01', '/learn/offers'], ['O01', '/admin/content'], ['O01', '/admin/approvals'], ['H01', '/leadership/impact'], ['H01', '/leadership/funnel'], [null,'/login']]
await page.goto(B + '#/login'); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(800)
await page.getByRole('button', { name: /Aisha/ }).first().click(); await page.waitForTimeout(800)
for (const [i, [p, r]] of shots.entries()) {
  await page.evaluate(([k, id]) => { const db = JSON.parse(localStorage.getItem(k)); db.session = id ? { personaId: id } : null; localStorage.setItem(k, JSON.stringify(db)) }, [KEY, p])
  await page.goto(B + '#' + r); await page.reload(); await page.waitForTimeout(1800)
  await page.screenshot({ path: `explore/${i}.png` })
  const btns = await page.$$eval('main button, main a, header button, header a, main input, main [role=slider], main [role=tab]', (els) => els.map((e) => `${e.tagName}:${(e.getAttribute('aria-label')||e.innerText||e.getAttribute('name')||e.id||'').trim().slice(0,50)}`).filter(Boolean))
  console.log(`== ${i} ${r}\n` + btns.slice(0, 70).join(' | '))
}
await browser.close()
