// Shared helpers for the mockup checks (hash routing, persona sign-in, localStorage demo db).
// Every project-specific value comes from mockup.config.ts. Run the browser checks against a
// preview build: `bun run build && bun run preview`, or `bun run check` (starts preview itself).
import { mkdirSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** mockup.config.ts, loaded with Bun or Node type stripping (Node 22.18+). */
export const config = (await import(path.join(ROOT, 'mockup.config.ts'))).default

export const BASE = (process.env.BASE ?? `http://127.0.0.1:${config.previewPort}/`).replace(
  /\/?$/,
  '/',
)
export const DB_KEY = config.storageKey
export const LANGS = (process.env.LANGS ?? config.languages.join(',')).split(',')

/** Output folder for reports and screenshots (gitignored). OUT_DIR overrides. */
export function outDir(...sub) {
  const dir = path.resolve(ROOT, process.env.OUT_DIR ?? config.checks.outDir, ...sub)
  mkdirSync(dir, { recursive: true })
  return dir
}

export const url = (route) => `${BASE}#${route}`

export const personaById = (id) => config.personas.find((p) => p.id === id)

/** Every route group from the config, with its persona's display name resolved. */
export function routeGroups() {
  return config.routeGroups.map((g) => ({
    ...g,
    personaName: g.persona ? personaById(g.persona)?.name.en : null,
  }))
}

function newestHeadlessShell() {
  const root = `${homedir()}/.cache/ms-playwright`
  try {
    const dirs = readdirSync(root)
      .filter((d) => d.startsWith('chromium_headless_shell-'))
      .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))
    for (const d of dirs) {
      for (const sub of readdirSync(`${root}/${d}`)) {
        if (!sub.startsWith('chrome-')) continue
        const files = readdirSync(`${root}/${d}/${sub}`)
        for (const bin of ['chrome-headless-shell', 'headless_shell'])
          if (files.includes(bin)) return `${root}/${d}/${sub}/${bin}`
      }
    }
  } catch {}
  return undefined
}

/**
 * Launch Chromium: Playwright's own bundled revision first; if that revision is not installed,
 * the newest headless shell in ~/.cache/ms-playwright (or CHROME=<path>).
 */
export async function launch() {
  try {
    return await chromium.launch()
  } catch {
    return await chromium.launch({ executablePath: process.env.CHROME ?? newestHeadlessShell() })
  }
}

/** Block third-party requests so they never add noise or hang networkidle. */
export async function blockThirdParty(ctx) {
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort())
}

/** Collect console errors and page errors on a page. */
export function collectErrors(page) {
  const errs = []
  page.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    const t = m.text()
    if (/favicon|net::ERR_|Failed to load resource/i.test(t)) return
    errs.push(t)
  })
  return errs
}

/**
 * Fresh start: clear storage on the sign-in page, then click the persona card (by its visible
 * name). `personaId` null leaves the visitor signed out with a fresh db.
 */
export async function signIn(page, personaId) {
  await page.goto(url(config.signInRoute))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  if (!personaId) return
  const name = personaById(personaId)?.name.en
  if (!name) throw new Error(`Unknown persona ${personaId} in mockup.config.ts`)
  await page
    .getByRole('button', { name: new RegExp(name) })
    .first()
    .click()
  await page.waitForTimeout(300)
}

/** Patch the persisted demo db, then reload so the app re-reads it. */
export async function patchDb(page, fn, { reload = true } = {}) {
  await page.evaluate(
    ([key, src]) => {
      const db = JSON.parse(localStorage.getItem(key))
      // biome-ignore lint/security/noGlobalEval: test helper evaluates a serialised function
      const next = new Function('db', `return (${src})(db)`)(db)
      localStorage.setItem(key, JSON.stringify(next))
    },
    [DB_KEY, fn.toString()],
  )
  if (reload) await page.reload()
}

/** Set the saved language (and any other prefs) without reloading. */
export async function setPrefs(page, prefs) {
  await page.evaluate(
    ([key, prefs]) => {
      const db = JSON.parse(localStorage.getItem(key))
      db.prefs = { ...db.prefs, ...prefs }
      localStorage.setItem(key, JSON.stringify(db))
    },
    [DB_KEY, prefs],
  )
}

export async function readDb(page) {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k)), DB_KEY)
}

/** Leave the app, then open a route, so the in-memory store reloads from patched storage. */
export async function open(page, route, { wait = 350 } = {}) {
  await page.goto('about:blank')
  await page.goto(url(route), { waitUntil: 'networkidle', timeout: 20000 })
  await page.waitForTimeout(wait)
}

/** Custom (Radix) select: open the trigger, then choose the option by its visible name. */
export async function pickOption(page, trigger, name) {
  await (typeof trigger === 'string' ? page.locator(trigger) : trigger).click()
  await page.getByRole('option', { name, exact: true }).click()
  await page.waitForTimeout(150)
}

/** Simple PASS/FAIL reporter. */
export function reporter(name) {
  const results = []
  return {
    ok(cond, label, detail = '') {
      results.push({ pass: !!cond, label, detail })
      console.log(
        `${cond ? 'PASS' : 'FAIL'} [${name}] ${label}${!cond && detail ? ` -- ${detail}` : ''}`,
      )
      return !!cond
    },
    results,
  }
}
