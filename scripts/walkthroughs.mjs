// Scripted demo flows. Prints PASS/FAIL lines; exit code 1 on any FAIL.
// Golden path (brief C16 click-path) and persona landing checks. Feature agents add one block per
// acceptance row, reusing the helpers.
// Usage: node scripts/walkthroughs.mjs   env: BASE
import { blockThirdParty, collectErrors, config, launch, open, reporter, signIn } from './lib.mjs'

const browser = await launch()
const all = []

async function newPage(width = 1280) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } })
  await blockThirdParty(ctx)
  const page = await ctx.newPage()
  const errs = collectErrors(page)
  return { ctx, page, errs }
}

/** Switch persona without clearing the db (keeps the cross-role state). */
async function switchTo(page, personaId) {
  await page.evaluate(
    ([key, id]) => {
      const db = JSON.parse(localStorage.getItem(key))
      db.session = { personaId: id }
      localStorage.setItem(key, JSON.stringify(db))
    },
    [config.storageKey, personaId],
  )
}

// ---------------------------------------------------------------- Golden path (C16 click-path)
// Mirrors src/data/golden-demo.ts: visit each step's route as its persona and assert key text.
const GOLDEN = [
  { persona: null, to: '/', text: /Home Ready/ },
  { persona: null, to: '/register', text: /Join Home Ready/ },
  { persona: 'L01', to: '/learn/home', text: /Aisha/ },
  { persona: 'L01', to: '/learn/tracks/renting/A4', text: /The contract and renewal/ },
  { persona: 'L01', to: '/learn/journeys/renew-or-move', text: /Renew or move/ },
  { persona: 'L01', to: '/learn/assistant', text: /Ask Dalil/ },
  { persona: 'L01', to: '/learn/offers', text: /Offers/ },
  { persona: 'L02', to: '/learn/calculator?tab=rent-vs-buy', text: /calculator/i },
  { persona: 'O01', to: '/admin/content', text: /Content/ },
  { persona: 'S01', to: '/sponsor/performance', text: /Performance/ },
  { persona: 'H01', to: '/leadership/impact', text: /Impact/ },
]
{
  const R = reporter('golden')
  all.push(R)
  const { ctx, page, errs } = await newPage()
  try {
    await signIn(page, null)
    for (const [i, step] of GOLDEN.entries()) {
      await switchTo(page, step.persona)
      await open(page, step.to)
      const main = page.locator('main').first()
      const body = (await main.innerText().catch(() => '')) || (await page.innerText('body'))
      R.ok(step.text.test(body), `Step ${i + 1} ${step.to} shows ${step.text}`, page.url())
    }
    R.ok(errs.length === 0, 'No console errors', errs.join(' | '))
  } catch (e) {
    R.ok(false, 'Golden path ran', e.message.split('\n')[0])
  }
  await ctx.close()
}

// ---------------------------------------------------------------- Every persona signs in and lands home
{
  const R = reporter('personas')
  all.push(R)
  const { ctx, page } = await newPage()
  for (const p of config.personas) {
    try {
      await signIn(page, p.id)
      R.ok(page.url().endsWith(`#${p.home}`), `${p.username} lands on ${p.home}`, page.url())
    } catch (e) {
      R.ok(false, `${p.username} signs in`, e.message.split('\n')[0])
    }
  }
  await ctx.close()
}

await browser.close()
const fails = all.flatMap((r) => r.results).filter((r) => !r.pass)
console.log(
  `\nSUMMARY: ${all.flatMap((r) => r.results).length - fails.length} pass, ${fails.length} fail`,
)
process.exit(fails.length ? 1 : 0)
