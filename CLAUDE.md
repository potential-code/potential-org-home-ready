# Mockup starter

Client-neutral base for clickable front-end mockups (learning and portal platforms). Copy it for each new mockup, then follow this file. Per mockup the brief lives in `docs/brief/` and is the source of truth; `docs/CHECKLIST.md` maps it to the definition of done; `docs/STATE.md` says where the work is. All data is fictional.

## Start here (new mockup)

1. Edit `mockup.config.ts`: client and mockup slugs, ports, title, storage key, demo date, time zone, roles, personas, sign-in route, route groups for the checks.
2. Replace the placeholder brand: values in `src/styles/tokens.css` (from the client's site), `Logo`, the motif in `src/components/brand/`, favicon. Log sources in `docs/DESIGN.md`.
3. Replace the sample domain (`shared/types.ts` entities, `src/data`, `src/domain`, `src/store/actions`, features, routes). Keep the shell, store mechanics and checks.

## Run

- `bun run dev` (port `devPort`), `bun run build` (typecheck + vite build to `dist/<clientSlug>/<mockupSlug>`), `bun run test`, `bun run lint`.
- Checks: `bun run check:rules` (static), and with a preview running (`bun run preview`): `check:sweep`, `check:contrast`, `check:walk`, `check:shot -- --all`. `bun run check` builds, starts preview and runs all of them. Output goes to `.checks/` (gitignored).
- Publishing: copy `dist/<client>/<mockup>/` to `potential-mockups/sites/<client>/<mockup>/`, only after explicit approval. Needs `base: './'` and hash routing (already set). Never use root-absolute asset paths; use `asset()` from `@/lib/asset` or `SmartImage`/`Avatar`.

## Architecture (one-way imports)

`mockup.config.ts` + `shared/types.ts` → `src/data` (pure seed) → `src/domain` (pure rules, unit tested) → `src/store` (db + actions) → `src/features/<area>` → `src/routes` (thin).

- `mockup.config.ts` is the single source for slugs, ports, title, storage key, demo date, languages, roles, personas and route groups. Import it as `@config`; never hardcode those values elsewhere (scripts read it too).
- Pages never import seed data for mutable state; read state through store hooks (`useDb`, `useMe`, plus one hook per collection in `src/store/hooks.ts`) and change it only through `src/store/actions/*`. Static catalogue data may be imported from `src/data`.
- The demo db is one versioned localStorage record (`src/store/db.ts`): bump `VERSION` when its shape changes. `resetDemo()` restores the seed and keeps session and prefs.
- Rules (scoring, progress, completion, stages, KPI maths, access scope) live in `src/domain`. Do not duplicate them in components.
- Routes: one file per URL in `src/routes/<role>/...`, each only `createFileRoute(...)({ component: XPage })` importing from `@/features/<area>/pages/XPage`. Role layouts use `requireRole()` and `AppShell`.
- Features: `src/features/<area>/{pages,components,hooks}`. Pages under ~250 lines; one component per file; static config arrays in `src/data` or the feature's `config.ts`, not inside pages.
- Shared and frozen (do not edit without the lead): `mockup.config.ts`, `shared/`, `src/data`, `src/domain`, `src/store`, `src/components/{ui,layout,shared,motion,brand,charts}`, `src/styles`, `src/i18n/index.ts`, `src/i18n/*/common.json`, `src/config`, `src/lib`. Need a new shared piece? Build it inside your feature folder.
- Shell pieces: `AppShell` (branded sidebar + `TopBar`), `AuthLayout` (split sign-in), `PublicHeader`/`PublicFooter` (landing; nav scrolls to `SECTIONS` ids), `DemoControls` (presenter menu), `DemoGuide` (golden-path stepper from `src/data/golden-demo.ts`), `PrefsSync` (lang, dir, reduced motion on `<html>`).
- Landing is built from blocks, not a fixed layout: a hero plus `Section` bands (`src/features/public/components`).
- Tables: `DataTable` from `@/components/shared/DataTable` (sorting, pagination, mobile cards); pass already-filtered rows.

## UI rules

- Brand: token classes only, never raw hex (only `src/styles/tokens.css` holds colour values). Colours: `brand` (primary), `brand-deep`, `brand-accent` (+`-600`), `brand-highlight`, `brand-warm`, `brand-red`, tints `tint-50/100/200`, `brand-50`. Gradients: `bg-grad-brand`, `bg-grad-brand-v`, `bg-grad-soft`, `bg-grad-warm`, `text-grad-brand`; photo scrim `bg-scrim-brand`. Never `brand-accent` text on white (fails contrast); use `text-brand`.
- Tone: public site and learner screens are energetic (bold type, colour blocks, playful cards, motion). Trainer and admin screens are calm and data-first.
- Motion: heavy scroll effects (Lenis, GSAP ScrollTrigger, pinned sections, parallax, SplitWords, CountUp) on the public landing only. Elsewhere use light Motion (`Reveal`, `Stagger`, `StaggerItem`, `MotionPage`, hover lifts). Import GSAP only from `@/lib/gsap`. Respect `useReducedMotion` from `@/hooks/use-reduced-motion` (also for initial opacity, not only transforms).
- Shape: pill buttons for primary CTAs (`rounded-full`), `rounded-2xl` cards, `shadow-sm` → `shadow-lg` on hover (`lift`).
- Every string through i18n: your area's namespace in `src/i18n/{en,ar}/<ns>.json` (both languages, same keys; the parity test enforces it). Seed content is `Localized`; render with `useLocalized().l(x)`; when `isPlaceholder(x)` is true show a small "Arabic content placeholder" label (`t('common:arabicPlaceholder')`).
- RTL: logical classes only (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`). Directional icons get `rtl-mirror`.
- Status is always text plus optional icon (`StatusBadge`), never colour alone. Tap targets ≥ 44px. Labels on every input. Inline validation and success toasts (`sonner`).
- Empty, no-results and error states on every list (`EmptyState`). Empty states explain the next step.
- Show `DemoTag` only in its shell slots (TopBar, AppShell mobile footer, AuthLayout, PublicFooter); no page-level demo banners. Never write "accredited", never promise jobs or funding, never show a hiring probability.
- No em dashes in UI copy. No `any`, no `console.log`.
- Dates: `formatDate`/`formatTime` from `@/i18n` (zone from `mockup.config.ts`). Demo clock: `now()` from `@/lib/clock`, never `new Date()` for record timestamps.

## Demo

- Personas in `mockup.config.ts` (exposed by `src/data/personas.ts`) drive the sign-in cards, the presenter switcher (`DemoControls`) and the check scripts. Reset restores the seeded snapshot.
- Golden path: `src/data/golden-demo.ts`; the presenter opens it from the Presenter menu.
- Images: `public/images/...` (log every file in `docs/ASSET-INVENTORY.md`); `SmartImage`/`Avatar` fall back to a branded gradient or initials if a file is missing.

## LMS module (courses)

A neutral, working LMS ships with the starter. Layout follows `potential-template` `mockup-references/platform/learning/` and playbook D2 (see `docs/REFERENCES.md` for the screen to reference map).

- **Where things live.** Types: `Course`, `Module`, `Unit` (`lesson` | `quiz`), `Block` (`video` | `read` | `summary` | `question` | `practice`), `Question`, `Quiz`, `Enrollment`, `QuizAttempt` in `shared/types.ts`. Seed: `src/data/courses.ts` (3 courses, one draft unit in C01 for the publish demo, one quiz). Rules: `src/domain/learning.ts` (+ `learning.test.ts`): learner-visible units, progress, module completion, next unit, quiz scoring. Store: `courses` and `enrollments` in `src/store/db.ts`; hooks `useCourses`, `useCourse`, `useEnrollments`, `useEnrollment`; learner actions `src/store/actions/learning.ts` (complete block/unit, submit quiz; opening a course enrols), admin actions `src/store/actions/authoring.ts` (course, module, unit, block create/edit/move/delete, publish toggles). UI: `src/features/learning/` (`pages/`, `components/` learner, `components/admin/` builder, `hooks/use-course-columns.tsx`, `config.ts`). Strings: `learning` namespace. Home Ready: the module lives in `src/features/learn-core` (builder UI removed); seed `src/data/tracks.ts` (courses `renting`, `buying`); routes `/learn/tracks`, `/learn/tracks/$trackId`, `/learn/tracks/$trackId/$unitId`; track rules (5 lessons, certificate 5/5 + post-quiz 70%) in `src/domain/tracks.ts`.
- **Course view (D2).** Opening a course lands on the course view directly: `CourseTopCard` (details + progress bar) on top, `CourseMenu` at the start side (a sheet below `lg`), the current unit in the main area (`LessonPanel` with `BlockSteps` + `BlockPlayer`, or `QuizPanel`). No separate preview or outline page.
- **Reuse it.** Replace the seed in `src/data/courses.ts` with the client's courses (keep ids stable for the golden path and `mockup.config.ts` route groups), rename roles in nav if needed, add client-specific blocks as a new `BlockKind` plus a case in `BlockPlayer` and `BLOCK_KINDS`. Real video: swap `VideoBlock` for a player using `asset()` paths. Covers: set `Course.cover` (relative to `public/`); without it `CourseCover` draws the branded gradient.
- **Delete it** (mockup without courses): remove `src/features/learning`, `src/routes/{learner,admin}/courses`, `src/data/courses.ts`, `src/domain/learning*.ts`, `src/store/actions/{learning,authoring}.ts` (and their exports), the `courses`/`enrollments` fields and seeds in `db.ts` (bump `VERSION`), the hooks, the LMS types, the `learning` namespace (both languages and `src/i18n/index.ts`), the `courses` nav items and keys, `ContinueLearning` on the learner dashboard, the LMS steps in `golden-demo.ts`, the LMS route-group entries and the `lms` block in `scripts/walkthroughs.mjs`, and the LMS tests in `src/store/store.test.ts`.

## Design system v2 (mandatory)

- **Brand motifs, not blobs.** Never use decorative blurred blobs, `rounded-full bg-white/10` circles, `blur-3xl` glows or random rings. Use `@/components/brand`: `Motif` (variants `banner`, `card`, `corner`, `sidebar`, `auth`), `GeoMark`, `GeoFrames`. The geometric art is a placeholder: drop the client's motif (emblem, pattern, logo geometry) into `src/components/brand/` and wire it into `Motif`, keeping the variant API. Colour motifs with low-opacity text classes (`text-white/[0.12]` on primary, `text-brand/10` on white). Parent needs `relative overflow-hidden`.
- **Stat cards.** Every metric/KPI/count tile uses `StatCard` from `@/components/shared/StatCard` with a coloured `tone` (`primary`, `accent`, `deep`, `highlight`, `warm`, `tint`); cycle `STAT_TONES` in a row so neighbours differ; pass `to` when the card links somewhere (whole card clickable). Delete feature-local tile components (`MetricTile`, `KpiTile`, …) or make them thin wrappers around `StatCard`. Denominator/definition goes in `hint`.
- **No icon chips.** Do not put icons in their own coloured circles/squares (`flex size-10 items-center justify-center rounded-full bg-…`). Put the icon inline beside its text (`size-4`/`size-5`, brand colour), or as a large low-opacity watermark inside a coloured card. Choice cards (assessment options, route cards, tabs) are whole selectable cards: quiet letter or icon, selected state = primary background + white text + check.
- **Badges** use `BadgeMedal` (neutral medallion; earned vs locked; swap its frame for the client motif).
- **Cards** always lift: use the `card` utility (`rounded-2xl border border-border/70 bg-white shadow-md`) or shadcn `Card`; clickable cards add `card-hover`. No flat bordered boxes without shadow. Tables live inside a `card` with `overflow-hidden`.
- **Compact controls.** Buttons default h-10 (`size="sm"` h-9 in toolbars/filters), inputs and selects h-10 (filters: `size="sm"` select, h-9). Filter bars: one compact row/grid, labels `text-xs font-semibold text-ink-soft`, search input h-10 with a leading icon, no giant pill inputs. No `min-h-12`/`min-h-14`/`h-14` controls.
- **Contrast.** On `brand`/`brand-deep`/`brand-warm` backgrounds text is white (secondary `text-white/80` minimum). On `brand-accent`/`brand-highlight` backgrounds text is `text-ink`. Never ink text on `brand-warm`, never deep buttons on `brand-warm`, never `brand-accent` text on white, never gradients fading to grey. A button on a coloured banner is white (`bg-white text-brand-deep`) or highlight (`bg-brand-highlight text-ink`). Re-check all of this when the client palette replaces the placeholder.
- **Page banners** (hero strip at the top of a page): `bg-grad-brand` (or `bg-grad-brand-v`), white text, `Motif variant="banner"`, `shadow-lg`, `rounded-3xl`.
- **Tables:** use `DataTable` or the shadcn `Table` (compact uppercase header, row hover). Cells wrap; never force horizontal scroll on desktop. Content-like lists (ledgers, rules) can be row cards instead of tables.

`bun run check:rules` enforces the machine-checkable parts (icon chips, blobs, raw hex, em dashes, root-absolute assets, external hosts in the build, DemoTag outside its slots).

## Frozen after foundation (Home Ready, 25 Nov 2026)

Feature agents must not edit these. Need a change? Ask the lead; build local pieces inside your feature folder.

- `mockup.config.ts`, `shared/types.ts`
- `src/data/**` (figures register `figures.ts` is the single source for every fee, default and KPI; never retype a number)
- `src/domain/**` and its tests
- `src/store/**` (db, hooks, actions, tests)
- `src/components/{ui,layout,shared,motion,brand,charts}/**`, `src/styles/**`, `src/lib/**`, `src/config/nav.ts`, `src/hooks/**`
- `src/i18n/index.ts`, `src/i18n/*/common.json`, `src/i18n/i18n.test.ts`
- `src/routes/__root.tsx` and the role layouts `src/routes/{_public,learn,admin,review,leadership,sponsor,onboarding}.tsx`
- `scripts/**`, `vite.config.ts`, `package.json`, `tsconfig.json`, `biome.json`

Each feature agent owns `src/features/<area>/**`, the route files of its area (keep them thin) and its namespaces in `src/i18n/{en,ar}/<ns>.json` (same keys in both).
