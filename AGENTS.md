# AGENTS.md

Taiwanna — a client-only Taiwan trip planner (Vue 3 + Vite + TS). Package name is
`taiwan-itinerary`; display name is **Taiwanna**.

## Commands

Run from the repo root (`~/Documents/taiwan-itinerary`):

- `npm run dev` — dev server (serves at `/`, not under the GH Pages base)
- `npm run build` — `vue-tsc -b && vite build`
- `npm run typecheck` — `vue-tsc -b`
- `npm run lint` — ESLint with `--fix`; `npm run lint:check` to only report
- `npm run format` — Prettier write; `npm run format:check` to only verify
- `npm run test` — Vitest run once; `npm run test:watch` to watch
- Single test file: `npx vitest run src/__tests__/<file>.spec.ts`
- Single test by name: `npx vitest run -t "mounts the app shell"`
- Tests live in `src/__tests__/` as `*.{test,spec}.ts` (`src/**/*.{test,spec}.ts` — not `.tsx`);
  Vitest runs in `jsdom` with `restoreMocks: true`, configured in `vite.config.ts`.

Before calling work done, run in order: `lint:check` → `typecheck` → `test` → `build` →
`format:check`. ESLint (`lint`) does **not** run Prettier — formatting is its own step.

## Hard constraints (do not break without asking)

- **Client-only by design.** No backend, no accounts, no API keys or secrets — ever.
  Data lives in `localStorage` (Pinia persistedstate) plus JSON export/import.
- **PrimeVue is pinned to v4.5.5 (MIT). Do NOT upgrade to v5.** v5 moved to a dual
  Community/Commercial license that requires a registered license key (registration +
  annual renewal, in-app notice if missing). The correct theme package for v4 is
  `@primevue/themes`; `@primeuix/themes` is for v5.
- **Never use `v-html`.** Enforced by `vue/no-v-html: 'error'` in `eslint.config.js`.
  It is the one real XSS vector in this app.
- **Prefer curated static data over live APIs** for transit info, local picks, and
  holidays (no keys, no network). This is a deliberate KISS choice.
- **UI is English, place names include Chinese** (e.g. 台北 101, 饒河夜市).
- Seed content must be **Lunar New Year aware**: the target trip window (Feb 1–16, 2027)
  overlaps the Feb 4–10 national holiday. Prioritize CNY-operational spots and note
  closures/crowds.

## Toolchain quirks (easy to get wrong)

- ESLint is **v10 flat config and must stay `eslint.config.js`** (a `.ts` config needs
  `jiti`). `withVueTs(...)` is async and must be the **direct default export** —
  wrapping it in `defineConfig` throws. `prettierConfig` must stay last.
- TypeScript is **v6**: `baseUrl` is deprecated. The `@/*` path alias is declared as
  `paths` in `tsconfig.app.json` (no `baseUrl`).
- The `@` → `src` alias is declared in **two** places: `vite.config.ts` (`resolve.alias`)
  and `tsconfig.app.json` (`paths`). Keep them in sync.
- `vite.config.ts` sets `base: '/taiwan-itinerary/'` **only for production builds**
  (GitHub Pages subpath). Dev serves from `/`. Don't set it unconditionally.
- TS is strict via `@vue/tsconfig`, with `noUnusedLocals`/`noUnusedParameters` and
  `erasableSyntaxOnly` (no enums, namespaces, or parameter properties).
- Icons come from the `primeicons` **CSS** package (`import 'primeicons/primeicons.css'`),
  not `@primeicons/vue` (which ties to PrimeVue v5).

## Conventions

- Component-first and KISS: everything visible is a reusable, prop/emit-driven
  component; views stay thin. No premature abstraction; PrimeVue defaults before custom CSS.
- Pure logic (route optimizer, haversine/geo, budget rollups) lives in framework-free
  modules with Vitest coverage — not inside components.
- Pinia is the single source of truth; derived values are computed, never persisted.
- Prettier house style: no semicolons, single quotes, `printWidth: 90`, trailing
  commas. `public/` and `package-lock.json` are ignored (`.prettierignore`).

## Status

- **Tickets live in `TICKETS.md`** (build plan, deps, statuses) — read it before starting work.
- T-1 done; next is T-2. Installed but not yet wired: PrimeVue, Pinia, Vue Router,
  VueUse, Leaflet, vue-draggable-plus.
- Deploy target: GitHub Pages.

## Known noise (don't chase)

- `npm audit` reports 4 high-severity `braces` issues. All are dev-only, in the ESLint
  toolchain (`@vue/eslint-config-typescript` → `fast-glob` → `micromatch`); latest
  `braces` is still flagged and the only "fix" is a breaking downgrade. Not reachable
  at runtime.

## Workflow

- Use subagents in parallel whenever tasks are independent.
- **One ticket = one feature branch** (e.g. `t-2-primevue-design-tokens`); branch before
  starting a ticket, never work a ticket on the default branch.
- **Before starting a ticket, ask whether to commit the current work** — do not begin a
  new ticket with uncommitted changes. Never commit or push without an explicit yes.
