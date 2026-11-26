import type { LearnerRecord } from '@shared/types'
import { Compass, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { JOURNEY_BY_ID } from '@/data/journeys'
import { formatDate, useLocalized } from '@/i18n'
import { MessageDialog } from './MessageDialog'

/** Learner profile drawer with journey history and consents. */
export function LearnerDrawer({
  learner,
  onClose,
}: {
  learner: LearnerRecord | null
  onClose: () => void
}) {
  const { t } = useTranslation('owner')
  const { l, lang } = useLocalized()
  const [msg, setMsg] = useState(false)
  const yn = (b: boolean) => t(b ? 'common.yes' : 'common.no')
  return (
    <Sheet open={!!learner} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        {learner && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <Avatar name={learner.name} />
                <div className="min-w-0">
                  <SheetTitle>{learner.name}</SheetTitle>
                  <SheetDescription>
                    {learner.email} ·{' '}
                    {t('learners.drawer.joined', { date: formatDate(learner.joined, lang) })}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <div className="space-y-5 px-4 pb-6">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {[
                  [t('learners.col.emirate'), t(`emirate.${learner.emirate}`)],
                  [t('learners.col.track'), `${t(`track.${learner.track}`)}, ${learner.progress}%`],
                  [t('learners.drawer.situation'), t(`situation.${learner.situation}`)],
                  [t('learners.drawer.household'), t(`household.${learner.household}`)],
                  [
                    t('learners.drawer.budget'),
                    learner.budget.replace('u', 'under ').replace('o', 'over '),
                  ],
                  [t('learners.drawer.language'), t(`lang.${learner.language}`)],
                  [t('learners.source'), t(`source.${learner.source}`)],
                  [t('learners.col.lastActive'), formatDate(learner.lastActive, lang)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-tint-50 p-3">
                    <dt className="text-xs font-semibold text-ink-soft">{k}</dt>
                    <dd className="mt-0.5 font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <section>
                <h3 className="text-base">{t('learners.drawer.journeys')}</h3>
                {learner.journeys.length ? (
                  <ol className="mt-2 space-y-2">
                    {learner.journeys.map((j) => (
                      <li
                        key={`${j.journeyId}-${j.at}`}
                        className="card flex items-center gap-3 p-3"
                      >
                        <Compass className="size-5 shrink-0 text-brand" aria-hidden />
                        <span className="min-w-0 flex-1 text-sm">
                          <span className="block font-semibold">
                            {l(JOURNEY_BY_ID[j.journeyId]?.title)}
                          </span>
                          <span className="text-ink-soft">{formatDate(j.at, lang)}</span>
                        </span>
                        <span className="text-sm font-bold tabular-nums">
                          {t('learners.drawer.score', { score: j.score })}
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-2 text-sm text-ink-soft">{t('learners.drawer.noJourneys')}</p>
                )}
              </section>
              <section>
                <h3 className="text-base">{t('learners.drawer.consents')}</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    {t('learners.drawer.partnerConsents', { count: learner.partnerConsents })}
                  </li>
                  <li>{t('learners.drawer.marketing', { value: yn(learner.marketing) })}</li>
                  <li>{t('learners.drawer.reminders', { count: learner.reminders })}</li>
                  <li>{t('learners.drawer.returned30', { value: yn(learner.returned30) })}</li>
                </ul>
              </section>
              <Button onClick={() => setMsg(true)} className="w-full rounded-full">
                <MessageSquare aria-hidden />
                {t('learners.drawer.message')}
              </Button>
            </div>
            <MessageDialog name={learner.name} open={msg} onOpenChange={setMsg} />
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
