// Route sweep: every route in mockup.config.ts routeGroups at the configured widths, in every
// language, plus root text size 150% at 390. Checks console errors, horizontal overflow,
// exactly one h1, img alt, accessible names, html lang, target size < 44x44 (worst offenders) and
// visible focus on the first Tab stops.
// Usage: node scripts/sweep.mjs   env: BASE, WIDTHS=320,390,1440  LANGS=en,ar  TEXT150_WIDTHS=390
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import {
  blockThirdParty,
  collectErrors,
  config,
  LANGS,
  launch,
  outDir,
  routeGroups,
  setPrefs,
  signIn,
  url,
} from './lib.mjs'

const GROUPS = routeGroups()
const widths = (process.env.WIDTHS ?? config.checks.sweepWidths.join(',')).split(',').map(Number)
const configs = []
for (const w of widths) for (const lang of LANGS) configs.push({ w, lang, textSize: 100 })
for (const w of (process.env.TEXT150_WIDTHS ?? '390').split(',').filter(Boolean).map(Number))
  for (const lang of LANGS) configs.push({ w, lang, textSize: 150 })

const browser = await launch()
const findings = []
const add = (cfg, route, kind, detail) =>
  findings.push({
    cfg: `${cfg.w}/${cfg.lang}${cfg.textSize !== 100 ? `/text${cfg.textSize}` : ''}`,
    route,
    kind,
    detail,
  })

/** In-page audit. Returns plain data. */
function audit() {
  const vis = (el) => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'
  }
  const sel = (el) => {
    let s = el.tagName.toLowerCase()
    if (el.id && !/^:r|«/.test(el.id)) return `${s}#${el.id}`
    const label = (el.getAttribute('aria-label') || el.textContent || '')
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 40)
    const cls = (el.getAttribute('class') || '')
      .split(/\s+/)
      .filter((c) => /^(size-|h-|min-h|rtl|sr-)/.test(c))
      .slice(0, 2)
    if (cls.length) s += `.${cls.join('.')}`
    return `${s}"${label}"`
  }
  const accName = (el) => {
    const lb = el.getAttribute('aria-labelledby')
    if (lb)
      return lb
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent ?? '')
        .join(' ')
        .trim()
    const al = el.getAttribute('aria-label')
    if (al?.trim()) return al.trim()
    if (el.labels?.length)
      return [...el.labels]
        .map((l) => l.textContent)
        .join(' ')
        .trim()
    const txt = el.innerText?.trim() || el.textContent?.trim()
    if (txt) return txt
    const img = el.querySelector('img[alt]')
    if (img?.alt) return img.alt
    return el.getAttribute('title')?.trim() ?? ''
  }
  const se = document.scrollingElement
  const out = {
    overflow: se.scrollWidth - window.innerWidth,
    h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 50)),
    imgNoAlt: [...document.querySelectorAll('img')]
      .filter((i) => !i.hasAttribute('alt'))
      .map((i) => i.getAttribute('src')),
    noName: [],
    small: [],
    overflowers: [],
    errorScreen: /Something went wrong|Page not found|not found/i.test(
      document.querySelector('h1')?.textContent ?? '',
    ),
  }
  const interactive = document.querySelectorAll(
    'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [role=tab], [role=radio], [role=checkbox]',
  )
  for (const el of interactive) {
    if (!vis(el) && !(el.tagName === 'INPUT' && el.closest('label'))) continue
    if (el.closest('[aria-hidden=true]')) continue
    if (!accName(el)) out.noName.push(sel(el))
    if (!vis(el)) continue
    // Target size: for radios/checkboxes wrapped in a label, the label is the target.
    let target = el
    if (el.tagName === 'INPUT' && /radio|checkbox/.test(el.type) && el.closest('label'))
      target = el.closest('label')
    const r = target.getBoundingClientRect()
    if (r.right < 0 || r.left > window.innerWidth + 5 || r.bottom < -5) continue // off-screen
    if (r.width <= 1 && r.height <= 1) continue // sr-only (skip link until focused)
    if (r.width < 44 || r.height < 44) {
      const inline =
        el.tagName === 'A' &&
        getComputedStyle(el).display === 'inline' &&
        /^(P|LI|SPAN|TD)$/.test(el.parentElement?.tagName)
      out.small.push({ sel: sel(el), w: Math.round(r.width), h: Math.round(r.height), inline })
    }
  }
  if (out.overflow > 0) {
    const W = window.innerWidth
    for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect()
      let clipped = false
      for (let q = el.parentElement; q && q !== document.body; q = q.parentElement)
        if (/auto|scroll|hidden|clip/.test(getComputedStyle(q).overflowX)) {
          clipped = true
          break
        }
      if (
        !clipped &&
        r.width &&
        (r.right > W + 1 || r.left < -1) &&
        !el.closest('[class*=sr-only]') &&
        getComputedStyle(el).position !== 'fixed'
      ) {
        const p = el.parentElement?.getBoundingClientRect()
        if (p && p.right <= W + 1 && p.left >= -1)
          out.overflowers.push(`${sel(el)} [${Math.round(r.left)}..${Math.round(r.right)}]`)
      }
      if (out.overflowers.length >= 3) break
    }
  }
  return out
}

/** Tab through the first N stops and check a visible focus indicator. */
async function focusCheck(page, n = 6) {
  await page.evaluate(() => {
    document.activeElement?.blur()
    window.scrollTo(0, 0)
  })
  const bad = []
  for (let i = 0; i < n; i++) {
    await page.keyboard.press('Tab')
    const r = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      const s = getComputedStyle(el)
      const lab = el.closest('label')
      const ls = lab ? getComputedStyle(lab) : null
      const has = (st) =>
        st &&
        ((st.outlineStyle !== 'none' && parseFloat(st.outlineWidth) >= 1) ||
          (st.boxShadow && st.boxShadow !== 'none'))
      return {
        ok: has(s) || has(ls),
        name: `${el.tagName.toLowerCase()}"${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30)}"`,
      }
    })
    if (r && !r.ok) bad.push(r.name)
  }
  return bad
}

for (const cfg of configs) {
  for (const group of GROUPS) {
    const ctx = await browser.newContext({ viewport: { width: cfg.w, height: 800 } })
    await blockThirdParty(ctx)
    // Text size 150%: scale the root font size (every rem-based size follows, like a browser
    // text-size setting).
    if (cfg.textSize !== 100)
      await ctx.addInitScript((pct) => {
        document.addEventListener('DOMContentLoaded', () => {
          document.documentElement.style.fontSize = `${pct}%`
        })
      }, cfg.textSize)
    const page = await ctx.newPage()
    const errs = collectErrors(page)
    await signIn(page, group.persona)
    await setPrefs(page, { lang: cfg.lang })
    for (const route of group.routes) {
      errs.length = 0
      try {
        await page.goto('about:blank')
        await page.goto(url(route), { waitUntil: 'networkidle', timeout: 20000 })
        await page.waitForTimeout(350)
        const a = await page.evaluate(audit)
        const html = await page.evaluate(() => [
          document.documentElement.lang,
          document.documentElement.dir,
        ])
        if (html[0] !== cfg.lang) add(cfg, route, 'lang', `html lang=${html[0]} dir=${html[1]}`)
        if (a.overflow > 0)
          add(cfg, route, 'overflow', `+${a.overflow}px ${a.overflowers.join(' ; ')}`)
        if (a.h1.length !== 1) add(cfg, route, 'h1', `${a.h1.length} h1: ${JSON.stringify(a.h1)}`)
        if (a.errorScreen) add(cfg, route, 'error-screen', a.h1[0])
        for (const s of a.imgNoAlt) add(cfg, route, 'img-no-alt', s)
        for (const s of a.noName) add(cfg, route, 'no-name', s)
        for (const s of a.small)
          add(cfg, route, s.inline ? 'small-inline' : 'small', `${s.w}x${s.h} ${s.sel}`)
        if (errs.length) add(cfg, route, 'console', errs.slice(0, 2).join(' | ').slice(0, 240))
        if (cfg.textSize === 100 && (cfg.w === 1440 || cfg.w === 390)) {
          const bad = await focusCheck(page)
          for (const b of bad) add(cfg, route, 'focus-invisible', b)
        }
      } catch (e) {
        add(cfg, route, 'load-failed', e.message.split('\n')[0])
      }
    }
    await ctx.close()
  }
  console.log(`swept ${cfg.w}/${cfg.lang}/text${cfg.textSize}`)
}
await browser.close()

// ---- report
const out = process.env.OUT ?? path.join(outDir(), 'sweep.json')
writeFileSync(out, JSON.stringify(findings, null, 1))
const kinds = [...new Set(findings.map((f) => f.kind))]
const blocking = [
  'console',
  'overflow',
  'h1',
  'img-no-alt',
  'no-name',
  'error-screen',
  'load-failed',
  'lang',
  'focus-invisible',
]
console.log('\n=== SWEEP SUMMARY ===')
for (const k of blocking) {
  const fs = findings.filter((f) => f.kind === k)
  console.log(`${fs.length ? 'FAIL' : 'PASS'} ${k}: ${fs.length}`)
  const seen = new Map()
  for (const f of fs) {
    const key = `${f.route} :: ${f.detail}`
    seen.set(key, [...(seen.get(key) ?? []), f.cfg])
  }
  for (const [k2, cfgs] of [...seen].slice(0, 12)) console.log(`   ${k2}  [${cfgs.join(',')}]`)
  if (seen.size > 12) console.log(`   ... ${seen.size - 12} more`)
}
for (const k of ['small', 'small-inline']) {
  const fs = findings.filter((f) => f.kind === k)
  console.log(
    `${k === 'small' && fs.length ? 'WARN' : 'INFO'} ${k} (<44x44): ${fs.length} instances`,
  )
  const agg = new Map()
  for (const f of fs) {
    const [dim, ...rest] = f.detail.split(' ')
    const key = rest.join(' ')
    const [w, h] = dim.split('x').map(Number)
    const cur = agg.get(key) ?? { min: Infinity, dim, routes: new Set() }
    if (Math.min(w, h) < cur.min) Object.assign(cur, { min: Math.min(w, h), dim })
    cur.routes.add(f.route)
    agg.set(key, cur)
  }
  const worst = [...agg].sort((a, b) => a[1].min - b[1].min).slice(0, 15)
  for (const [key, v] of worst)
    console.log(`   ${v.dim} ${key}  (${v.routes.size} routes, e.g. ${[...v.routes][0]})`)
}
console.log(
  `other kinds: ${kinds.filter((k) => !blocking.includes(k) && !k.startsWith('small')).join(',') || 'none'}`,
)
console.log(`full findings: ${out}`)
process.exit(findings.some((f) => blocking.includes(f.kind)) ? 1 : 0)
