import type { Course } from '@shared/types'
import { GraduationCap } from 'lucide-react'
import { Motif } from '@/components/brand'
import { SmartImage } from '@/components/shared/SmartImage'
import { cn } from '@/lib/utils'
import { COVER_TONES } from '../config'

/**
 * Course cover: the course image when one exists, else a branded gradient with the motif and a
 * large low-opacity watermark (no generated images needed). Decorative: the title sits beside it.
 */
export function CourseCover({ course, className }: { course: Course; className?: string }) {
  const tone = Number(course.id.replace(/\D/g, '')) || 0
  if (course.cover) {
    return <SmartImage src={course.cover} alt="" className={cn('w-full', className)} />
  }
  return (
    <div
      aria-hidden
      className={cn('relative overflow-hidden', COVER_TONES[tone % COVER_TONES.length], className)}
    >
      <Motif variant="card" className="text-white/20" />
      <GraduationCap
        className="absolute start-5 bottom-4 size-16 text-white/25"
        strokeWidth={1.25}
      />
    </div>
  )
}
