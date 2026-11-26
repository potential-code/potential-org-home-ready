/**
 * Single source of truth for one mockup. Read by vite.config.ts, the app (src/store/db.ts,
 * src/lib/clock.ts, src/hooks/use-page-title.ts, src/data/personas.ts, src/i18n) and every check
 * script in scripts/. When you copy the starter for a new client, edit this file first.
 *
 * Keep it plain, erasable TypeScript (no enums, no runtime imports): the check scripts load it
 * directly with Bun or Node type stripping.
 */
import type { Lang, Localized, Role } from './shared/types'

export interface PersonaConfig {
  /** Stable id stored in the demo db session. */
  id: string
  role: Role
  name: Localized
  /** One-line role description on the sign-in card. */
  title: Localized
  /** Route the persona lands on after sign-in. */
  home: string
  /** Optional photo relative to public/ (Avatar falls back to initials). */
  image?: string
  /** Demo username (brief C16); the sign-in form accepts it or the demo email. */
  username: string
  /** Fictional demo email. */
  email: string
}

export interface RouteGroup {
  id: string
  /** Persona id to sign in as before visiting these routes; null = signed out. */
  persona: string | null
  routes: string[]
}

const config = {
  clientSlug: 'potentialorg',
  mockupSlug: 'home-ready',
  devPort: 5200,
  previewPort: 5201,
  title: { en: 'Home Ready', ar: 'جاهز للسكن' },
  /** localStorage key of the versioned demo db. Unique per mockup so demos never collide. */
  storageKey: 'potentialorg-home-ready-demo-db',
  /** Demo "today": the clock starts here and moves with real time. */
  demoDate: '2026-11-25T15:00:00+04:00',
  /** IANA zone used by formatDate/formatTime. */
  timeZone: 'Asia/Dubai',
  languages: ['en', 'ar'] as Lang[],
  defaultLanguage: 'en' as Lang,
  roles: ['learner', 'owner', 'reviewer', 'leadership', 'sponsor'] as Role[],
  /* Brief C16 personas. All six use the password "password"; sign-in accepts username or email. */
  personas: [
    {
      id: 'L01',
      role: 'learner',
      name: { en: 'Aisha Rahman', ar: 'عائشة رحمن' },
      title: { en: 'Learner, renting in Dubai', ar: 'متعلمة، مستأجرة في دبي' },
      home: '/learn/home',
      username: 'aisha.renter',
      email: 'aisha.rahman@example.com',
    },
    {
      id: 'L02',
      role: 'learner',
      name: { en: 'Rohan Mehta', ar: 'روهان ميهتا' },
      title: { en: 'Learner, first-time buyer', ar: 'متعلم، مشترٍ لأول مرة' },
      home: '/learn/home',
      username: 'rohan.buyer',
      email: 'rohan.mehta@example.com',
    },
    {
      id: 'O01',
      role: 'owner',
      name: { en: 'Maya', ar: 'مايا' },
      title: { en: 'Programme owner, Potential.org', ar: 'مالكة البرنامج، Potential.org' },
      home: '/admin/overview',
      username: 'maya.owner',
      email: 'maya@example.com',
    },
    {
      id: 'R01',
      role: 'reviewer',
      name: { en: 'Khalid Al Mansoori', ar: 'خالد المنصوري' },
      title: { en: 'Qualified reviewer (fictional)', ar: 'مراجع مؤهل (خيالي)' },
      home: '/review/queue',
      username: 'khalid.reviewer',
      email: 'khalid.almansoori@example.com',
    },
    {
      id: 'H01',
      role: 'leadership',
      name: { en: 'Hessa Al Suwaidi', ar: 'حصة السويدي' },
      title: { en: 'Leadership (fictional)', ar: 'القيادة (خيالية)' },
      home: '/leadership/impact',
      username: 'hessa.leadership',
      email: 'hessa.alsuwaidi@example.com',
    },
    {
      id: 'S01',
      role: 'sponsor',
      name: { en: 'Oasis Home Finance', ar: 'أويسس للتمويل السكني' },
      title: { en: 'Sample sponsor (fictional)', ar: 'راعٍ نموذجي (خيالي)' },
      home: '/sponsor/placements',
      username: 'oasis.sponsor',
      email: 'partners@oasis-home-finance.example.com',
    },
  ] as PersonaConfig[],
  /** Demo password for every persona (brief C16, Aliya Gate 1 answer 4). */
  demoPassword: 'password',
  signInRoute: '/login',
  /** Route lists for the check scripts (sweep, contrast, shots). */
  routeGroups: [
    {
      id: 'public',
      persona: null,
      routes: [
        '/',
        '/register',
        '/login',
        '/forgot-password',
        '/invite',
        '/faq',
        '/terms',
        '/privacy',
        '/contact',
        '/editorial-policy',
      ],
    },
    {
      id: 'onboarding',
      persona: 'L01',
      routes: ['/onboarding/1', '/onboarding/2', '/onboarding/3', '/onboarding/4'],
    },
    {
      id: 'learner',
      persona: 'L01',
      routes: [
        '/learn/home',
        '/learn/tracks',
        '/learn/tracks/renting',
        '/learn/tracks/renting/A4',
        '/learn/tracks/buying',
        '/learn/journeys',
        '/learn/journeys/renew-or-move',
        '/learn/journeys/rent-or-buy',
        '/learn/calculator',
        '/learn/checklists',
        '/learn/checklists/CL-A1',
        '/learn/shortlist',
        '/learn/reminders',
        '/learn/events',
        '/learn/offers',
        '/learn/assistant',
        '/learn/achievements',
        '/learn/profile',
      ],
    },
    { id: 'learner-buyer', persona: 'L02', routes: ['/learn/home', '/learn/calculator'] },
    {
      id: 'owner',
      persona: 'O01',
      routes: [
        '/admin/overview',
        '/admin/learners',
        '/admin/content',
        '/admin/approvals',
        '/admin/sponsors',
        '/admin/communications',
        '/admin/reports',
        '/admin/settings',
      ],
    },
    {
      id: 'reviewer',
      persona: 'R01',
      routes: ['/review/queue', '/review/item/RV1', '/review/sources'],
    },
    {
      id: 'leadership',
      persona: 'H01',
      routes: ['/leadership/impact', '/leadership/funnel', '/leadership/reports'],
    },
    {
      id: 'sponsor',
      persona: 'S01',
      routes: ['/sponsor/placements', '/sponsor/performance', '/sponsor/guidelines'],
    },
  ] as RouteGroup[],
  checks: {
    /** Output folder for reports and screenshots (gitignored). */
    outDir: '.checks',
    sweepWidths: [320, 390, 1440],
    shotWidths: [1440, 390],
    contrastWidth: 1280,
  },
}

export default config
export type MockupConfig = typeof config
