import type { Enrollment, PersonaId, Unit } from '@shared/types'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { isUnitDone } from '@/domain/learning'
import { completeBlock, completeUnit } from '@/store/actions'
import { BlockPlayer } from './BlockPlayer'
import { BlockSteps } from './BlockSteps'
import { UnitFooter } from './UnitFooter'
import { UnitHeader } from './UnitHeader'

/**
 * Lesson unit player: step nav over the learning blocks, the current block, then
 * Previous / Mark complete / Next. Next walks the blocks, then moves to the next unit.
 */
export function LessonPanel({
  courseId,
  cover,
  unit,
  enrollment,
  learnerId,
  onPrevUnit,
  onNextUnit,
}: {
  courseId: string
  cover?: string
  unit: Unit
  enrollment?: Enrollment
  learnerId: PersonaId
  onPrevUnit?: () => void
  onNextUnit?: () => void
}) {
  const { t } = useTranslation('learning')
  const [index, setIndex] = useState(0)
  const block = unit.blocks[index]
  const done = isUnitDone(enrollment, unit.id)
  const last = index >= unit.blocks.length - 1
  const markBlock = () => block && completeBlock(learnerId, courseId, block.id)
  const next = () => {
    markBlock()
    if (!last) setIndex(index + 1)
    else onNextUnit?.()
  }
  const complete = () => {
    completeUnit(learnerId, courseId, unit.id)
    toast.success(t('player.unitCompleted'))
  }
  return (
    <section aria-labelledby="unit-title" className="card grid min-w-0 gap-6 p-5 sm:p-7">
      <UnitHeader unit={unit} />
      {block ? (
        <>
          <BlockSteps
            blocks={unit.blocks}
            index={index}
            doneIds={enrollment?.completedBlockIds ?? []}
            onSelect={setIndex}
          />
          <BlockPlayer key={block.id} block={block} cover={cover} onDone={markBlock} />
        </>
      ) : (
        <p className="text-ink-soft">{t('player.noBlocks')}</p>
      )}
      <UnitFooter unit={unit} />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5">
        <Button
          variant="outline"
          disabled={index === 0 && !onPrevUnit}
          onClick={() => (index > 0 ? setIndex(index - 1) : onPrevUnit?.())}
        >
          <ArrowLeft className="rtl-mirror" aria-hidden /> {t('player.previous')}
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          {done ? (
            <span className="inline-flex h-10 items-center gap-1.5 px-2 text-sm font-semibold text-success">
              <CheckCircle2 className="size-4" aria-hidden /> {t('player.completed')}
            </span>
          ) : (
            <Button className="rounded-full" onClick={complete}>
              <CheckCircle2 aria-hidden /> {t('player.markComplete')}
            </Button>
          )}
          <Button
            variant={done ? 'default' : 'outline'}
            disabled={last && !onNextUnit}
            onClick={next}
          >
            {last ? t('player.nextUnit') : t('player.next')}
            <ArrowRight className="rtl-mirror" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  )
}
