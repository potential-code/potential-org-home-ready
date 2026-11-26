import config from '@config'

const boot = Date.now()

/** Demo clock: starts at `demoDate` from mockup.config.ts and moves with real time. */
export function now(): string {
  return new Date(Date.parse(config.demoDate) + (Date.now() - boot)).toISOString()
}
export function nowMs(): number {
  return Date.parse(now())
}
