import { describe, expect, test } from 'bun:test'
import { DALIL_ANSWERS, matchDalil } from './dalil'

describe('Dalil matcher', () => {
  test('each English sample prompt matches its own answer', () => {
    for (const a of DALIL_ANSWERS) expect(matchDalil(a.prompt.en)?.id).toBe(a.id)
  })
  test('each Arabic sample prompt matches its own answer', () => {
    for (const a of DALIL_ANSWERS) expect(matchDalil(a.prompt.ar)?.id).toBe(a.id)
  })
  test('Arabic phrasings match', () => {
    expect(matchDalil('هل يمكن رفع الإيجار عند التجديد؟')?.id).toBe('rent-increase')
    expect(matchDalil('كم أدفع مقدماً عند استئجار شقة؟')?.id).toBe('upfront-cost')
  })
  test('off-topic returns null', () => {
    expect(matchDalil('weather tomorrow')).toBeNull()
  })
  test('upfront answer uses the figures register', () => {
    const a = DALIL_ANSWERS.find((x) => x.id === 'upfront-cost')
    expect(a?.answer.en).toContain('177.75')
    expect(a?.answer.en).toContain('2,000')
  })
})
