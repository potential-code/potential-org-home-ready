import { chromium } from 'playwright'
import fs from 'node:fs'
const groups = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const base = 'http://127.0.0.1:5211/'
const user = { L01: 'aisha.renter', L02: 'rohan.buyer', O01: 'maya.owner', R01: 'khalid.reviewer', H01: 'hessa.leadership', S01: 'oasis.sponsor' }
const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1252/chrome-headless-shell-linux64/chrome-headless-shell' })
const out = {}
for (const g of groups) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage()
  await p.goto(base + '#/login'); await p.waitForTimeout(500)
  if (g.p) { const i = p.locator('input'); await i.nth(0).fill(user[g.p]); await i.nth(1).fill('password'); await p.locator('form button[type=submit]').first().click(); await p.waitForTimeout(800) }
  await p.evaluate(() => { const k = Object.keys(localStorage).find(k => k.includes('demo')); const db = JSON.parse(localStorage.getItem(k)); db.prefs.lang = 'ar'; localStorage.setItem(k, JSON.stringify(db)) })
  await p.reload(); await p.waitForTimeout(600)
  for (const r of g.r) {
    await p.goto(base + '#' + r); await p.waitForTimeout(900)
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)) } })
    const res = await p.evaluate(() => {
      const allow = /^(potential\.org|potential\.com|Home Ready|AED|DLD|RERA|DEWA|Ejari|PDF|XLSX|CSV|EN|AR|K[1-4]|[A-B][1-5]|AQ|BQ|[a-z]+\.[a-z]+|@|https?:.*|www\..*)$/i
      const bad = new Set(); let total = 0
      const w = document.createTreeWalker(document.querySelector('main') || document.body, NodeFilter.SHOW_TEXT)
      while (w.nextNode()) {
        const el = w.currentNode.parentElement; if (!el || el.closest('[aria-hidden=true],script,style,svg')) continue
        const t = w.currentNode.textContent.trim(); if (!t) continue
        if (getComputedStyle(el).visibility === 'hidden' || el.offsetParent === null && getComputedStyle(el).position !== 'fixed') continue
        const words = t.match(/[A-Za-z][A-Za-z'’-]{2,}/g) || []
        const eng = words.filter(x => !allow.test(x) && !/^(Oasis|Home|Finance|SwiftMove|SafeNest|Aisha|Rahman|Rohan|Mehta|Maya|Khalid|Hessa|Mansoori|Suwaidi|Ready)$/.test(x))
        if (eng.length >= 2) { bad.add(t.slice(0, 70)); total++ }
      }
      return { dir: document.documentElement.dir, total, sample: [...bad].slice(0, 4) }
    })
    out[`${g.p}${r}`] = res
  }
  await ctx.close()
}
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1))
await b.close()
