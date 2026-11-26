import { createFileRoute } from '@tanstack/react-router'
import { CourseViewPage } from '@/features/learn-core/pages/CourseViewPage'

export const Route = createFileRoute('/learn/tracks/$trackId/$unitId')({
  component: CourseViewPage,
})
