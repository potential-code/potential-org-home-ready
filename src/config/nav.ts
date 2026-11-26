import type { Role } from '@shared/types'
import {
  Award,
  BarChart3,
  BellRing,
  BookOpen,
  Calculator,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Filter,
  Gift,
  GitCompareArrows,
  Heart,
  Home,
  Inbox,
  LayoutDashboard,
  Library,
  ListChecks,
  type LucideIcon,
  Megaphone,
  MessageCircleQuestion,
  Route as RouteIcon,
  Settings,
  ShieldCheck,
  Sparkles,
  Tags,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react'

export interface NavItem {
  /** i18n key under common:nav.<role>. */
  key: string
  to: string
  icon: LucideIcon
  /** Exact match only (role home). */
  exact?: boolean
}

/** Sidebar per role (brief C8 tabs, C4 paths). */
export const NAV: Record<Role, NavItem[]> = {
  learner: [
    { key: 'home', to: '/learn/home', icon: Home },
    { key: 'tracks', to: '/learn/tracks', icon: BookOpen },
    { key: 'journeys', to: '/learn/journeys', icon: RouteIcon },
    { key: 'calculator', to: '/learn/calculator', icon: Calculator },
    { key: 'checklists', to: '/learn/checklists', icon: ListChecks },
    { key: 'shortlist', to: '/learn/shortlist', icon: Heart },
    { key: 'reminders', to: '/learn/reminders', icon: BellRing },
    { key: 'events', to: '/learn/events', icon: CalendarDays },
    { key: 'offers', to: '/learn/offers', icon: Gift },
    { key: 'assistant', to: '/learn/assistant', icon: MessageCircleQuestion },
    { key: 'achievements', to: '/learn/achievements', icon: Award },
    { key: 'profile', to: '/learn/profile', icon: UserRound },
  ],
  owner: [
    { key: 'overview', to: '/admin/overview', icon: LayoutDashboard },
    { key: 'learners', to: '/admin/learners', icon: Users },
    { key: 'content', to: '/admin/content', icon: Library },
    { key: 'approvals', to: '/admin/approvals', icon: ClipboardCheck },
    { key: 'sponsors', to: '/admin/sponsors', icon: Tags },
    { key: 'communications', to: '/admin/communications', icon: Megaphone },
    { key: 'reports', to: '/admin/reports', icon: BarChart3 },
    { key: 'settings', to: '/admin/settings', icon: Settings },
  ],
  reviewer: [
    { key: 'queue', to: '/review/queue', icon: Inbox },
    { key: 'sources', to: '/review/sources', icon: ShieldCheck },
  ],
  leadership: [
    { key: 'impact', to: '/leadership/impact', icon: Sparkles },
    { key: 'funnel', to: '/leadership/funnel', icon: Filter },
    { key: 'reports', to: '/leadership/reports', icon: FileText },
  ],
  sponsor: [
    { key: 'placements', to: '/sponsor/placements', icon: Tags },
    { key: 'performance', to: '/sponsor/performance', icon: TrendingUp },
    { key: 'guidelines', to: '/sponsor/guidelines', icon: GitCompareArrows },
  ],
}
