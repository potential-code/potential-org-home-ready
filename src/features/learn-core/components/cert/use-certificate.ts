import type { Course } from '@shared/types'
import { certificateEarned, certificateId, postQuizUnit } from '@/domain/tracks'
import { useLocalized } from '@/i18n'
import { useCourse, useEnrollment, useMe } from '@/store/hooks'
import type { CertificateData } from './CertificateView'

/** Certificate data for the signed-in learner, or null until the track is earned (C9.1). */
export function useCertificate(courseId: string): {
  course?: Course
  data: CertificateData | null
} {
  const { l } = useLocalized()
  const me = useMe()
  const course = useCourse(courseId)
  const enr = useEnrollment(courseId)
  if (!course || !certificateEarned(course, enr)) return { course, data: null }
  const quiz = postQuizUnit(course)
  const pass = (enr?.attempts ?? []).filter((a) => a.unitId === quiz?.id && a.passed)
  return {
    course,
    data: {
      course,
      name: l(me.name),
      date: pass[0]?.at ?? enr?.enrolledAt ?? '',
      id: certificateId(course.id, me.id),
    },
  }
}
