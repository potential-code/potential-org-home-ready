import { SearchX } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Stagger, StaggerItem } from '@/components/motion'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { courseState } from '@/domain/learning'
import { useLocalized } from '@/i18n'
import { useCourses, useEnrollments, useMe } from '@/store/hooks'
import { type CatalogueFilterState, CatalogueFilters } from '../components/CatalogueFilters'
import { CourseCard } from '../components/CourseCard'

const INITIAL: CatalogueFilterState = { q: '', level: 'all', state: 'all' }

/** Learner course catalogue: filter row, result count, card grid. Only published courses. */
export function CataloguePage() {
  const { t } = useTranslation('learning')
  const { l } = useLocalized()
  const me = useMe()
  const courses = useCourses()
  const enrollments = useEnrollments()
  const [filters, setFilters] = useState(INITIAL)
  const enrOf = (id: string) => enrollments.find((e) => e.courseId === id && e.learnerId === me.id)
  const q = filters.q.trim().toLowerCase()
  const published = courses.filter((c) => c.status === 'published')
  const rows = published.filter(
    (c) =>
      (filters.level === 'all' || c.level === filters.level) &&
      (filters.state === 'all' || courseState(c, enrOf(c.id)) === filters.state) &&
      (!q ||
        l(c.title).toLowerCase().includes(q) ||
        l(c.summary).toLowerCase().includes(q) ||
        c.tags.some((tag) => tag.includes(q))),
  )
  return (
    <>
      <PageHeader title={t('catalogue.title')} description={t('catalogue.subtitle')} />
      <CatalogueFilters value={filters} onChange={setFilters} />
      <p className="mb-4 text-sm text-ink-soft" aria-live="polite">
        {t('catalogue.count', { count: rows.length })}
      </p>
      {rows.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={t('catalogue.emptyTitle')}
          body={t('catalogue.emptyBody')}
          action={
            <Button variant="outline" size="sm" onClick={() => setFilters(INITIAL)}>
              {t('common:clearFilters')}
            </Button>
          }
        />
      ) : (
        <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <StaggerItem key={c.id}>
              <CourseCard course={c} enrollment={enrOf(c.id)} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </>
  )
}
