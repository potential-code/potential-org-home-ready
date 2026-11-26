# Mockup starter

Client-neutral base for clickable front-end mockups: React 19, Vite, TanStack Router (hash history, relative base), Tailwind 4, shadcn (radix-ui), Motion, GSAP and Lenis (landing only), i18next EN/AR, Bun, Biome. Ships a sample landing, split sign-in with persona cards, learner, trainer and admin dashboards in a branded sidebar shell, and a neutral LMS module (catalogue, course view, unit player, quiz, admin course list and builder), all with fictional data. Conventions: `CLAUDE.md`.

## Create a new mockup

```bash
rsync -a --exclude node_modules --exclude dist --exclude .checks --exclude .git \
  ~/Projects/work/mockup-starter/ ~/Projects/work/<client>-<mockup>/
cd ~/Projects/work/<client>-<mockup> && git init && bun install
```

Then:

1. `mockup.config.ts`: `clientSlug`, `mockupSlug`, `devPort`/`previewPort` (pick free ones), `title`, `storageKey` (unique), `demoDate`, `timeZone`, `languages`, `roles`, `personas`, `signInRoute`, `routeGroups`.
2. Brief into `docs/brief/` (see its README); fill `docs/ANALYSIS.md`, `docs/OPEN-QUESTIONS.md`, `docs/STATE.md`.
3. Brand: replace the values in `src/styles/tokens.css` from the client's site, the `Logo`, the motif in `src/components/brand/`, `public/favicon.svg` and the `theme-color` in `index.html`. Log it in `docs/DESIGN.md`.
4. Replace the sample domain (`shared/types.ts` entities, `src/data`, `src/domain`, `src/store/actions`, `src/features`, `src/routes`) and the golden path in `src/data/golden-demo.ts`.

## Run

```bash
bun run dev        # http://127.0.0.1:<devPort>
bun run test       # domain rules, store flow, EN/AR key parity
bun run lint
bun run build      # typecheck + build to dist/<clientSlug>/<mockupSlug>
bun run preview    # http://127.0.0.1:<previewPort>, serves the build
```

## Check

All values (URL, port, DB key, personas, routes, widths, languages, output folder) come from `mockup.config.ts`. Reports and screenshots go to `.checks/` (gitignored). Chromium: Playwright's bundled browser, or the newest headless shell in `~/.cache/ms-playwright` (override with `CHROME=<path>`).

| Script                        | Verifies                                                                                                                                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bun run check:rules`         | Static scan of `src/` and the build: icon chips, decorative blobs, raw hex outside `tokens.css`, em dashes in copy, root-absolute asset paths, external hosts (fonts/CDNs) in `dist`, `DemoTag` outside its shell slots. |
| `bun run check:sweep`         | Every route at 320/390/1440 in EN and AR, plus 150% text: console errors, horizontal overflow, one h1, img alt, accessible names, html lang, focus visibility; small targets as warnings.                                |
| `bun run check:contrast`      | axe-core WCAG 2.1 AA on every route, EN and AR.                                                                                                                                                                          |
| `bun run check:walk`          | Scripted demo flows (sample: learner submits, trainer approves, reset; admin filters; LMS: admin publishes a unit, learner completes it, passes the quiz).                                                               |
| `bun run check:shot -- --all` | Screenshots of every route at the configured widths into `.checks/shots/`.                                                                                                                                               |
| `bun run check`               | Build, rules, then starts a preview and runs sweep, contrast, walkthroughs and shots.                                                                                                                                    |

The browser checks (`sweep`, `contrast`, `walk`, `shot`) need a preview running; `bun run check` starts and stops it for you.

## Publish

Only after explicit approval: copy `dist/<clientSlug>/<mockupSlug>/` into `potential-mockups/sites/<client>/<mockup>/`. The build uses relative assets and hash routing, so it works from any sub-folder with no server rewrites.
