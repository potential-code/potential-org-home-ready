// Static scan for the standing UI rules (CLAUDE.md "Design system v2" and hosting rules).
// Scans src/ always, and the build output (dist/<client>/<mockup>) when it exists.
// Prints `<rule-id> <file>:<line> <message>` per hit; exit 1 on any hit.
// Usage: node scripts/check-rules.mjs [--no-dist] [--dist <dir>]
// Silence one line only with a trailing comment: `check-rules-ignore <rule-id>: <reason>`.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { config, ROOT } from './lib.mjs'

const args = process.argv.slice(2)
const distArg = args.includes('--dist') ? args[args.indexOf('--dist') + 1] : null
const DIST = path.resolve(ROOT, distArg ?? path.join('dist', config.clientSlug, config.mockupSlug))
const SRC = path.join(ROOT, 'src')
const TOKENS = path.join(SRC, 'styles', 'tokens.css')

/** Files allowed to render <DemoTag>: the shell slots only. */
const DEMO_TAG_SLOTS = [
  'src/components/shared/DemoTag.tsx',
  'src/components/layout/TopBar.tsx',
  'src/components/layout/AppShell.tsx',
  'src/components/layout/AuthLayout.tsx',
  'src/components/layout/PublicFooter.tsx',
]

const RULES = {
  'icon-chip':
    'Icon wrapped in its own coloured rounded box. Put the icon inline beside its text, or as a large low-opacity watermark.',
  'decorative-blob':
    'Decorative blur/blob. Use the brand Motif from @/components/brand instead of blurred glows or white/10 circles.',
  'raw-hex': 'Raw hex colour. Add a token in src/styles/tokens.css and use a token class or var().',
  'em-dash': 'Em dash in UI copy. Use a colon, comma, full stop or "to".',
  'root-absolute-asset':
    'Root-absolute asset path breaks under a sub-path. Use asset() from @/lib/asset or a relative path.',
  'external-host':
    'External host in the build. Mockups must run offline from their own folder (self-host fonts and libraries).',
  'demo-tag-slot':
    'Demo label outside the shell slot. DemoTag lives only in TopBar/AppShell/AuthLayout/PublicFooter; no page-level demo banners.',
  'placeholder-label':
    'Visible "placeholder" label in UI copy (e.g. "placeholder video"). Show real-looking content instead (playbook E2). Input hints in keys ending "Placeholder" are fine.',
}

const hits = []
const rel = (f) => path.relative(ROOT, f)
function hit(rule, file, line, extra = '') {
  hits.push({ rule, where: `${rel(file)}:${line}`, extra })
}

function walk(dir, exts) {
  if (!existsSync(dir)) return []
  const out = []
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p, exts))
    else if (exts.some((e) => name.endsWith(e))) out.push(p)
  }
  return out
}

const ignored = (line, rule) => line.includes(`check-rules-ignore ${rule}`)
const isComment = (line) => /^\s*(\/\/|\/\*|\*|\{\s*\/\*)/.test(line)

/** Class strings on a line: contents of "...", '...' and `...` literals. */
function classStrings(line) {
  return [...line.matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`/g)].map((m) => m[1] ?? m[2] ?? m[3])
}
/** Utility present without a variant prefix (hover:, md:, data-[...]: ...). */
const bare = (cls, re) => cls.split(/\s+/).some((c) => re.test(c))

const ICON_TAG = /<([A-Z][A-Za-z0-9]*|Icon)\b[^>]*\/>/
const INTERACTIVE = /^(button|Button|a|Link|label|summary|DropdownMenuTrigger|TooltipTrigger)$/

function openingTag(lines, i, col) {
  const before = `${lines.slice(Math.max(0, i - 3), i).join('\n')}\n${lines[i].slice(0, col)}`
  const m = [...before.matchAll(/<([A-Za-z][\w.]*)/g)].pop()
  return m?.[1] ?? ''
}

// ---------------------------------------------------------------- src/ code
for (const file of walk(SRC, ['.ts', '.tsx', '.css'])) {
  const text = readFileSync(file, 'utf8')
  const lines = text.split('\n')
  const isTsx = file.endsWith('.tsx') || file.endsWith('.ts')
  const relFile = rel(file)
  lines.forEach((line, i) => {
    const n = i + 1
    if (isComment(line)) return
    const code = line.replace(/\/\/\s.*$/, '').replace(/\/\*.*?\*\//g, '')

    // raw-hex: anywhere in src except tokens.css
    if (
      file !== TOKENS &&
      /(^|[\s'"`(,:[=])#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/.test(code)
    ) {
      if (!ignored(line, 'raw-hex')) hit('raw-hex', file, n, code.trim().slice(0, 80))
    }

    // root-absolute-asset
    if (
      /\bsrc=["'{`]*\/(?!\/)|url\(\s*["']?\/(?!\/)/.test(code) &&
      !ignored(line, 'root-absolute-asset')
    )
      hit('root-absolute-asset', file, n, code.trim().slice(0, 80))

    if (!isTsx) {
      if (/blur-(2xl|3xl)/.test(code)) hit('decorative-blob', file, n)
      return
    }

    // em-dash in TS/TSX code (JSX text and string literals that reach the UI)
    if (/—|&mdash;/.test(code) && !ignored(line, 'em-dash'))
      hit('em-dash', file, n, code.trim().slice(0, 80))

    // demo-tag-slot
    if (
      /<DemoTag\b/.test(code) &&
      !DEMO_TAG_SLOTS.includes(relFile) &&
      !ignored(line, 'demo-tag-slot')
    )
      hit('demo-tag-slot', file, n)
    if (/\bDemoBanner\b|demo-banner/.test(code) && !ignored(line, 'demo-tag-slot'))
      hit('demo-tag-slot', file, n, 'demo banner')

    for (const cls of classStrings(code)) {
      // decorative-blob
      const blob =
        /(^|\s)([\w-]+:)?blur-(2xl|3xl|\[)/.test(cls) ||
        (bare(cls, /^absolute$/) &&
          bare(cls, /^rounded-full$/) &&
          bare(cls, /^bg-white\/(\d+|\[[\d.]+\])$/))
      if (blob && !ignored(line, 'decorative-blob'))
        hit('decorative-blob', file, n, cls.slice(0, 80))

      // icon-chip: a fixed-size centred rounded box with a solid background around an icon
      const chip =
        bare(cls, /^items-center$/) &&
        bare(cls, /^justify-center$/) &&
        bare(cls, /^rounded-(full|md|lg|xl|2xl|3xl)$/) &&
        bare(cls, /^bg-(?!transparent|none)/) &&
        (bare(cls, /^size-(\d+|\[)/) || (bare(cls, /^h-\d+$/) && bare(cls, /^w-\d+$/)))
      if (!chip || ignored(line, 'icon-chip')) continue
      const tag = openingTag(lines, i, line.indexOf(cls))
      if (INTERACTIVE.test(tag)) continue
      const after = lines
        .slice(i, i + 5)
        .join('\n')
        .slice(line.indexOf(cls) + cls.length)
      const closeIdx = after.search(new RegExp(`</${tag}>`))
      const inner = closeIdx >= 0 ? after.slice(0, closeIdx) : after
      if (ICON_TAG.test(inner) && !/<(Avatar|SmartImage)\b/.test(inner.match(ICON_TAG)?.[0] ?? ''))
        hit('icon-chip', file, n, cls.slice(0, 80))
    }
  })
}

// ---------------------------------------------------------------- i18n values: em dashes
for (const file of walk(path.join(SRC, 'i18n'), ['.json'])) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (/—|&mdash;/.test(line)) hit('em-dash', file, i + 1, line.trim().slice(0, 80))
    // placeholder labels: "key": "...placeholder..." where the key is not an input hint
    const kv = line.match(/^\s*"([^"]+)"\s*:\s*"(.*)"\s*,?\s*$/)
    if (kv && /placeholder/i.test(kv[2]) && !/placeholder$/i.test(kv[1]))
      hit('placeholder-label', file, i + 1, line.trim().slice(0, 80))
  })
}

// ---------------------------------------------------------------- build output
const HOSTS =
  /\b(fonts\.googleapis\.com|fonts\.gstatic\.com|unpkg\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|cdn\.tailwindcss\.com|use\.typekit\.net|[\w-]+\.cdn\.[\w.]+|\/\/cdn\.[\w.]+)/
let distScanned = false
if (!args.includes('--no-dist') && existsSync(DIST)) {
  distScanned = true
  for (const file of walk(DIST, ['.html', '.css', '.js'])) {
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      const host = line.match(HOSTS)
      if (host) hit('external-host', file, i + 1, host[0])
      const abs = file.endsWith('.js')
        ? null
        : line.match(/\b(src|href)=["']\/(?!\/)[^"']*|url\(\s*["']?\/(?!\/)[^)]*/)
      if (abs) hit('root-absolute-asset', file, i + 1, abs[0].slice(0, 80))
    })
  }
}

// ---------------------------------------------------------------- report
for (const h of hits)
  console.log(`${h.rule} ${h.where} ${RULES[h.rule]}${h.extra ? `\n    ${h.extra}` : ''}`)
const counts = Object.keys(RULES).map((r) => `${r}=${hits.filter((h) => h.rule === r).length}`)
console.log(
  `\ncheck-rules: ${hits.length ? 'FAIL' : 'PASS'} (${counts.join(' ')})${distScanned ? '' : ' [dist not scanned: build first]'}`,
)
process.exit(hits.length ? 1 : 0)
