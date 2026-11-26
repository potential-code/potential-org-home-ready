// axe-core run (wcag2a, wcag2aa, wcag21aa) on every route in mockup.config.ts routeGroups, in
// every language. Exit 1 on any violation.
// Usage: node scripts/contrast.mjs   env: BASE, WIDTH (default config.checks.contrastWidth), LANGS
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import {
  blockThirdParty,
  config,
  LANGS,
  launch,
  open,
  outDir,
  routeGroups,
  setPrefs,
  signIn,
} from './lib.mjs'

const require = createRequire(import.meta.url)
const axeSrc = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')

const width = Number(process.env.WIDTH ?? config.checks.contrastWidth)
const browser = await launch()
const byRule = new Map()
let total = 0

for (const lang of LANGS) {
  for (const group of routeGroups()) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } })
    await blockThirdParty(ctx)
    const page = await ctx.newPage()
    await signIn(page, group.persona)
    await setPrefs(page, { lang, reducedMotion: true })
    for (const route of group.routes) {
      await open(page, route, { wait: 500 })
      await page.addScriptTag({ content: axeSrc })
      const res = await page.evaluate(async () => {
        const r = await window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
          resultTypes: ['violations'],
        })
        return r.violations.map((x) => ({
          id: x.id,
          impact: x.impact,
          help: x.help,
          nodes: x.nodes.map((n) => ({
            target: n.target.join(' '),
            summary: (n.any[0]?.message ?? n.failureSummary ?? '').slice(0, 160),
          })),
        }))
      })
      for (const viol of res) {
        const cur = byRule.get(viol.id) ?? { impact: viol.impact, help: viol.help, hits: [] }
        for (const n of viol.nodes) {
          cur.hits.push({ where: `${lang} ${route}`, target: n.target, summary: n.summary })
          total++
        }
        byRule.set(viol.id, cur)
      }
    }
    await ctx.close()
  }
}
await browser.close()

const order = { critical: 0, serious: 1, moderate: 2, minor: 3 }
console.log(`=== axe (wcag2a/2aa/21aa) @${width}px: ${byRule.size} rules, ${total} nodes ===`)
for (const [id, r] of [...byRule].sort((a, b) => order[a[1].impact] - order[b[1].impact])) {
  console.log(`\nFAIL ${id} [${r.impact}] ${r.help} (${r.hits.length} nodes)`)
  const seen = new Map()
  for (const h of r.hits) {
    const k = `${h.target} :: ${h.summary}`
    seen.set(k, [...(seen.get(k) ?? []), h.where])
  }
  for (const [k, w] of [...seen].slice(0, 10))
    console.log(
      `   ${k}\n      on: ${w.slice(0, 4).join(', ')}${w.length > 4 ? ` +${w.length - 4}` : ''}`,
    )
  if (seen.size > 10) console.log(`   ... ${seen.size - 10} more distinct`)
}
writeFileSync(path.join(outDir(), 'contrast.json'), JSON.stringify([...byRule], null, 1))
if (!byRule.size) console.log('PASS no axe violations')
process.exit(byRule.size ? 1 : 0)
