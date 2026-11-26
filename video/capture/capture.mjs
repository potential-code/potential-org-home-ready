// Screen captures of the running Home Ready mockup for the executive video. Read-only: no app changes.
import { chromium } from 'playwright'
const EXE = `${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-1252/chrome-headless-shell-linux64/chrome-headless-shell`
const B = 'http://127.0.0.1:5211/'
const OUT = '../assets/shots'
const browser = await chromium.launch({ executablePath: EXE })
const only = process.argv[2]

async function fresh() {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, reducedMotion: 'no-preference' })
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort())
  const page = await ctx.newPage()
  await page.goto(B + '#/login'); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(1200)
  return { ctx, page }
}
async function login(page, username) {
  await page.goto(B + '#/login'); await page.waitForTimeout(800)
  await page.getByLabel(/username|email/i).first().fill(username)
  await page.getByLabel(/password/i).first().fill('password')
  await page.getByRole('button', { name: /^sign in$/i }).first().click()
  await page.waitForTimeout(1500)
}
async function go(page, route, wait = 2500) { await page.goto(B + '#' + route); await page.waitForTimeout(wait) }
const shot = (page, name, opts = {}) => page.screenshot({ path: `${OUT}/${name}.png`, ...opts }).then(() => console.log('shot', name))
const run = (k) => !only || only === k

if (run('m1')) {
  const { ctx, page } = await fresh()
  await go(page, '/', 3500); await shot(page, 'm1-landing-en')
  await page.getByRole('button', { name: /عربي|العربية/ }).first().click(); await page.waitForTimeout(3000)
  await shot(page, 'm1-landing-ar'); await ctx.close()
}
if (run('m2') || run('m3')) {
  const { ctx, page } = await fresh(); await login(page, 'aisha.renter')
  if (run('m2')) { await go(page, '/learn/home', 2500); await shot(page, 'm2-aisha-home') }
  if (run('m3')) {
    await go(page, '/learn/journeys/renew-or-move', 2500); await shot(page, 'm3-result')
    await page.getByRole('button', { name: /Play again/ }).click(); await page.waitForTimeout(1500)
    for (let s = 0; s < 6; s++) {
      const title = await page.locator('#step-title').innerText().catch(() => '')
      if (/Rental Index/i.test(title)) break
      const cont = page.getByRole('button', { name: /^(Continue|Start)/ })
      if (!title && await cont.count()) { await cont.first().click(); await page.waitForTimeout(1200); continue }
      await page.locator('#step-title').locator('xpath=ancestor::section').locator('button').first().click(); await page.waitForTimeout(600)
      await page.getByRole('button', { name: /Next decision/ }).click(); await page.waitForTimeout(1200)
    }
    await shot(page, 'm3-step-rental-index-pre', { fullPage: true })
    // pick the best option (marked in data) by trying each until feedback says best
    const opts = page.locator('#step-title').locator('xpath=ancestor::section').locator('button')
    await opts.nth(0).click(); await page.waitForTimeout(1200)
    await shot(page, 'm3-step-rental-index')
  }
  await ctx.close()
}
if (run('m4')) {
  const { ctx, page } = await fresh(); await login(page, 'rohan.buyer')
  await go(page, '/learn/calculator?tab=rent-vs-buy', 3000)
  await page.evaluate(() => window.scrollTo(0, 380)); await page.waitForTimeout(1500)
  await shot(page, 'm4-calc-8y')
  const slider = page.locator('#calc-horizon')
  await slider.focus(); for (let i = 0; i < 4; i++) { await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(150) }
  await page.waitForTimeout(2000); await shot(page, 'm4-calc-4y'); await ctx.close()
}
if (run('m5')) {
  const { ctx, page } = await fresh(); await login(page, 'aisha.renter')
  await go(page, '/learn/offers', 2500); await shot(page, 'm5-offers')
  await page.getByRole('button', { name: /Request a call/ }).first().click(); await page.waitForTimeout(1500)
  await shot(page, 'm5-consent'); await ctx.close()
}
if (run('m6')) {
  const { ctx, page } = await fresh(); await login(page, 'maya.owner')
  await go(page, '/admin/content', 2500); await shot(page, 'm6-content')
  await go(page, '/admin/approvals', 2500); await shot(page, 'm6-approvals'); await ctx.close()
}
if (run('m7')) {
  const { ctx, page } = await fresh(); await login(page, 'hessa.leadership')
  await go(page, '/leadership/impact', 3500); await shot(page, 'm7-impact')
  await go(page, '/leadership/funnel', 4000); await shot(page, 'm7-funnel'); await ctx.close()
}
await browser.close()
