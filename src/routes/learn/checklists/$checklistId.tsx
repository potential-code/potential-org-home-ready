import type { ChecklistTemplateId } from '@shared/types'
import { createFileRoute } from '@tanstack/react-router'
import { ChecklistDetailPage } from '@/features/learn-tools/pages/ChecklistDetailPage'

/** /learn/checklists/<id>; /learn/checklists/new?template=<id> creates one from a template. */
export const Route = createFileRoute('/learn/checklists/$checklistId')({
  validateSearch: (s: Record<string, unknown>): { template?: ChecklistTemplateId } =>
    typeof s.template === 'string' ? { template: s.template as ChecklistTemplateId } : {},
  component: ChecklistDetailPage,
})
