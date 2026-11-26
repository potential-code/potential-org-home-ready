import type { Course, Enrollment } from '@shared/types'
import { CheckCircle2, ChevronDown, Circle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isUnitDone, moduleProgress } from '@/domain/learning'
import { useLocalized } from '@/i18n'
import { cn } from '@/lib/utils'
import { UNIT_ICON } from '../config'

/** Course menu: modules (collapsible) with their published units and completion checks. */
export function CourseMenu({
  course,
  enrollment,
  currentUnitId,
  onSelect,
}: {
  course: Course
  enrollment?: Enrollment
  currentUnitId?: string
  onSelect: (unitId: string) => void
}) {
  const { t } = useTranslation('learning')
  const { l } = useLocalized()
  const [closed, setClosed] = useState<string[]>([])
  const toggle = (id: string) =>
    setClosed((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
  return (
    <nav aria-label={t('view.menu')} className="card overflow-hidden">
      <div className="border-b border-border/70 px-4 py-3.5">
        <p className="text-[11px] font-bold tracking-widest text-brand uppercase">
          {t('view.menu')}
        </p>
        <p className="font-semibold leading-snug text-ink">{l(course.title)}</p>
      </div>
      <ul className="divide-y divide-border/70">
        {course.modules.map((m, i) => {
          const units = m.units.filter((u) => u.published)
          if (!units.length) return null
          const p = moduleProgress(m, enrollment)
          const open = !closed.includes(m.id)
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => toggle(m.id)}
                aria-expanded={open}
                className="flex min-h-11 w-full items-center gap-3 px-4 py-3 text-start hover:bg-tint-50"
              >
                <span
                  className={cn(
                    'w-5 shrink-0 text-sm font-bold tabular-nums',
                    p.complete ? 'text-success' : 'text-brand',
                  )}
                >
                  {i + 1}.
                </span>
                <span className="grid min-w-0 flex-1">
                  <span className="text-sm font-semibold text-ink">{l(m.title)}</span>
                  <span className="text-xs text-ink-soft">
                    {t('meta.unitsDone', { done: p.done, total: p.total })}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 text-ink-soft transition-transform',
                    !open && '-rotate-90 rtl:rotate-90',
                  )}
                  aria-hidden
                />
              </button>
              {open && (
                <ul className="bg-tint-50/60 pb-1">
                  {units.map((u) => {
                    const Icon = UNIT_ICON[u.kind]
                    const done = isUnitDone(enrollment, u.id)
                    const active = u.id === currentUnitId
                    return (
                      <li key={u.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(u.id)}
                          aria-current={active ? 'step' : undefined}
                          className={cn(
                            'relative flex min-h-11 w-full items-center gap-3 py-2.5 ps-8 pe-4 text-start text-sm transition-colors',
                            active
                              ? 'bg-tint-100 before:absolute before:inset-y-0 before:start-0 before:w-1 before:bg-brand'
                              : 'hover:bg-tint-100/70',
                          )}
                        >
                          <Icon className="size-4 shrink-0 text-brand" aria-hidden />
                          <span className="grid min-w-0 flex-1">
                            <span
                              className={cn(
                                'leading-snug',
                                active ? 'font-semibold text-brand-deep' : 'text-ink',
                              )}
                            >
                              {l(u.title)}
                            </span>
                            <span className="text-xs text-ink-soft">
                              {t(`unitKinds.${u.kind}`)} · {t('meta.minutes', { count: u.minutes })}
                            </span>
                          </span>
                          {done ? (
                            <CheckCircle2
                              className="size-4 shrink-0 text-success"
                              aria-label={t('view.done')}
                            />
                          ) : (
                            <Circle
                              className="size-4 shrink-0 text-ink-soft/60"
                              aria-label={t('view.notDone')}
                            />
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
