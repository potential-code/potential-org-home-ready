// Runs commands against a fresh `vite preview` of the current build, then stops the server.
// Commands are separated by `--`. Every command runs even if an earlier one fails; exit code is 1
// if any failed.  Example: node scripts/with-preview.mjs node scripts/sweep.mjs -- node scripts/contrast.mjs
import { spawn, spawnSync } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'
import { BASE, ROOT } from './lib.mjs'

const commands = []
let cur = []
for (const a of process.argv.slice(2)) {
  if (a === '--') {
    if (cur.length) commands.push(cur)
    cur = []
  } else cur.push(a)
}
if (cur.length) commands.push(cur)

const server = spawn('bunx', ['--bun', 'vite', 'preview'], { cwd: ROOT, stdio: 'ignore' })
let up = false
for (let i = 0; i < 60 && !up; i++) {
  await sleep(500)
  up = await fetch(BASE)
    .then((r) => r.ok)
    .catch(() => false)
}
if (!up) {
  server.kill()
  process.stderr.write(`preview did not start at ${BASE}\n`)
  process.exit(1)
}

const failed = []
for (const [cmd, ...args] of commands) {
  process.stdout.write(`\n=== ${cmd} ${args.join(' ')}\n`)
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit' })
  if (r.status !== 0) failed.push(`${cmd} ${args.join(' ')}`)
}
server.kill()
process.stdout.write(`\n=== checks: ${commands.length - failed.length}/${commands.length} passed\n`)
for (const f of failed) process.stdout.write(`FAIL ${f}\n`)
process.exit(failed.length ? 1 : 0)
