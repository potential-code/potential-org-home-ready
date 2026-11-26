// Screenshots.
//   node scripts/shot.mjs --all
//       every route in mockup.config.ts routeGroups at checks.shotWidths, default language,
//       into <outDir>/shots/<group>-<route>-<width>.png
//   node scripts/shot.mjs <personaId|none> <route> <width> <lang> [out.png]
// env: BASE, FULL=1 for full-page shots, OUT_DIR
import path from 'node:path'
import {
  blockThirdParty,
  config,
  launch,
  open,
  outDir,
  routeGroups,
  setPrefs,
  signIn,
} from './lib.mjs'

const slug = (route) => route.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-') || 'home'
const browser = await launch()

async function shoot(persona, route, width, lang, out) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } })
  await blockThirdParty(ctx)
  const page = await ctx.newPage()
  await signIn(page, persona)
  await setPrefs(page, { lang })
  await open(page, route, { wait: 1500 })
  await page.screenshot({ path: out, fullPage: process.env.FULL === '1' })
  await ctx.close()
  console.log(out)
}

const args = process.argv.slice(2)
if (args[0] === '--all') {
  const dir = outDir('shots')
  for (const g of routeGroups())
    for (const route of g.routes)
      for (const w of config.checks.shotWidths)
        await shoot(
          g.persona,
          route,
          w,
          config.defaultLanguage,
          path.join(dir, `${g.id}-${slug(route)}-${w}.png`),
        )
} else {
  const [persona = 'none', route = '/', width = '1440', lang = config.defaultLanguage, out] = args
  await shoot(
    persona === 'none' ? null : persona,
    route,
    Number(width),
    lang,
    out ?? path.join(outDir('shots'), `${persona}-${slug(route)}-${width}-${lang}.png`),
  )
}
await browser.close()
