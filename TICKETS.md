# Taiwanna — Build Plan & Tickets

The authoritative ticket breakdown for this repo. Recovered from the original
planning session (was not previously stored in the repo). Keep this file in sync as
tickets land.

- **App:** Taiwanna (package `taiwan-itinerary`) — client-only Taiwan trip planner.
- **Target trip:** Feb 1–16, 2027 (overlaps Lunar New Year, Feb 4–10 — see T-24/T-6).
- **Stack:** Vue 3 + Vite + TS · Pinia (+ persistedstate) · Vue Router · PrimeVue 4
  "Aura"/Tea Room · VueUse · Leaflet + OSM · vue-draggable-plus · Vitest · ESLint +
  Prettier.
- **Deploy:** GitHub Pages. **Storage:** `localStorage` + JSON export/import (no backend).

Status legend: ✅ done · ⬜ todo · 🧊 backlog.

## Ticket index

| ID   | Title                                            | Epic       | Priority | Depends on    | Status |
| ---- | ------------------------------------------------ | ---------- | -------- | ------------- | ------ |
| T-1  | Scaffold project                                 | E1 Found.  | high     | —             | ✅     |
| T-2  | PrimeVue + global setup (Tea Room design tokens) | E1 Found.  | high     | T-1           | ✅     |
| T-3  | Pinia persistence setup                          | E1 Found.  | high     | T-1           | ⬜     |
| T-4  | Router shell                                     | E1 Found.  | high     | T-2           | ⬜     |
| T-5  | TypeScript interfaces (+ import validation)      | E2 Data    | high     | —             | ⬜     |
| T-6  | Seed places data (CNY-proof, transit, localInfo) | E2 Data    | medium   | T-5           | ⬜     |
| T-7  | Trips store (CRUD)                               | E2 Data    | high     | T-3, T-5      | ⬜     |
| T-8  | Planner store (days/activities)                  | E2 Data    | high     | T-3, T-5      | ⬜     |
| T-9  | TripListView                                     | E3 Trip UI | high     | T-4, T-7      | ⬜     |
| T-10 | TripView (+ dashboard stat header)               | E3 Trip UI | high     | T-7, T-8, T-9 | ⬜     |
| T-11 | Activity editor (transit strip, local tips)      | E3 Trip UI | high     | T-8, T-10     | ⬜     |
| T-12 | DayView timeline (+ lock flags)                  | E4 Planner | high     | T-11          | ⬜     |
| T-13 | DayMap (markers + route polyline)                | E4 Planner | high     | T-8           | ⬜     |
| T-20 | Geo utils (haversine + mode multipliers)         | E4b Optim. | medium   | T-5           | ⬜     |
| T-21 | Route optimizer (NN + 2-opt)                     | E4b Optim. | medium   | T-20          | ⬜     |
| T-22 | "Auto-arrange" UI                                | E4b Optim. | medium   | T-12, T-21    | ⬜     |
| T-14 | MapPicker for custom places                      | E5 Launch  | medium   | T-13          | ⬜     |
| T-15 | Budget & TW formatting                           | E5 Launch  | medium   | T-10, T-12    | ⬜     |
| T-16 | PrintView / share page                           | E5 Launch  | medium   | T-10, T-12    | ⬜     |
| T-17 | PWA manifest (+ CSP meta)                        | E5 Launch  | low      | T-4           | ⬜     |
| T-18 | QA + deploy (GitHub Pages)                       | E5 Launch  | medium   | all           | ⬜     |
| T-24 | Holiday awareness layer                          | E5 Launch  | medium   | T-5           | ⬜     |
| T-19 | Tile caching (offline map tiles)                 | Backlog    | low      | post-launch   | 🧊     |
| T-23 | TDX live arrivals                                | Backlog    | low      | needs API key | 🧊     |

**Build order:** T-1 → T-2/T-3/T-4 → T-5 → T-6/T-7 → T-8 → T-9/T-10/T-11 →
T-12/T-13 → T-20/T-21/T-22 → T-14/T-15/T-16/T-24 → T-17/T-18.
T-2–T-4 and T-6–T-8 batch well.

## Ticket details

### E1 — Foundation

**T-1 — Scaffold project** · ✅ done
Vite `vue-ts` template, deps installed, strict TS, exact-pinned deps, git init,
Vitest + ESLint/Prettier wired, `lint/typecheck/test/build` green.

**T-2 — PrimeVue + global setup** · ✅ done
**Locked:** Pine accent + Fraunces (headings; Inter body).
Register PrimeVue 4 Aura via `definePreset` with Tea Room token overrides; Aura theme
from `@primevue/themes`; PrimeIcons CSS; global mobile-first CSS. Class-based dark mode
(`darkModeSelector: '.p-dark'`) driven by `useThemeMode()` (defaults to system, persisted
override). Live switches in `ThemePreview.vue` for mode, accent (`useAccent()` /
`updatePrimaryPalette`, 3 jade ramps) and font (`useFont()`, Inter / IBM Plex / Fraunces).
Design tokens: jade accent, warm off-white light / deep-ink dark, system type stack
with tabular numerals, per-category muted hues (food/sight/transport/hotel/shop)
reused across timeline/icon/tag/map marker, 12px radius, 44px+ tap targets,
`prefers-reduced-motion` respected.

**T-3 — Pinia persistence setup**
`pinia-plugin-persistedstate`; versioned key (e.g. `taiwanna.v1`); one key per store;
derived state (budget, durations) never persisted; graceful quota-error handling
(also T-8). `useStorage` only for lightweight prefs.

**T-4 — Router shell**
Routes: `/` TripListView · `/trips/:id` TripView · `/trips/:id/days/:dayId` DayView ·
`/trips/:id/print` PrintView. Stub views + `<RouterView>`.

### E2 — Data Layer

**T-5 — TypeScript interfaces**
`src/types/index.ts`: `Trip`, `Day`, `Activity`, `Place`. `Place` includes
`transit?` (mrt/tra/thsr/bus/youbike/notes) and `localInfo`; `Activity` includes
`locked`. Pure typed helpers (e.g. `formatTWD`, `tripDateRange`). **Plus** JSON
import schema validation (zod or hand-rolled guards), reject unknown versions,
sanitize lengths, prototype-pollution guard (`__proto__`/`constructor` filtering).

**T-6 — Seed places data** (CNY-proof)
`src/data/seed-places.json`: ~20 curated spots, real lat/lng, **Taipei city + north
ring; exclude Jiufen/Shifen/Yeliu** (already visited). Prioritize CNY-operational
spots (temples 龍山寺/行天宮/大龍峒保安宮, night markets, 故宮, 中正紀念堂, Dihua
年貨大街, Beitou, Maokong, Elephant Mountain, Tamsui). Each place: `holidayInfo`
(expected-open / likely-closed / packed-but-worth-it), `bestTime` adjusted for CNY,
curated `transit`, and `localInfo` (vibe badge, what-to-order, tips). Chinese place
names included. `places` store read-only over seed + persisted custom places.

**T-7 — Trips store (CRUD)**
create/update/remove trip, companions utils. Derived (computed, not persisted):
`daysCount`, `totalBudgetTWD`, `activitiesCount`.

**T-8 — Planner store (days/activities)**
`addDay/removeDay/reorderActivities(dayId, from, to)` (splice matching
vue-draggable-plus), `addActivity/updateActivity/removeActivity/toggleDone`. Derived
per-day budget/totals. Quota/error handling in persistence.

### E3 — Trip UI

**T-9 — TripListView**
Trip cards (name, dates, companion `Tag`s, budget) via `Card`/`Tag`; new-trip
`Dialog` (name + `DatePicker` range + companions); delete via `ConfirmDialog`; empty state.

**T-10 — TripView**
Day list (date, title, activity count, per-day cost); add day (auto from trip range);
budget summary bar; Export/Import JSON. Dashboard stat header: countdown · days ·
activities done/total · budget spent/planned.

**T-11 — Activity editor**
`Dialog`: title, type `SelectButton`, `InputNumber` costTWD + duration, `DatePicker`
`timeOnly`, notes `Textarea`; attach place or custom coords (placeholder until T-14);
transit strip + local tips shown when a place is attached.

### E4 — Day Planner

**T-12 — DayView timeline**
Vertical timeline cards: type icon, time, title, cost, done `Checkbox`; handle-based
`vue-draggable-plus` reorder (touch verified); done-strike styling; per-day budget
footer; **lock flags** (lock icon) so optimizer anchors stay fixed.

**T-13 — DayMap**
Leaflet map; numbered `divIcon` markers in visit order + ordered polyline; Vite
default-marker icon fix; lazy-load via `defineAsyncComponent`; marker ↔ card
highlight (nice-to-have). Use `useEventListener`/`whenever()`.

**E4b — Optimizer**
`T-20` geo utils: `haversine()` + transport-mode multipliers (walk/MRT/drive), pure.
`T-21` `optimizeRoute(coords, startIndex?, endIndex?)` — NN + 2-opt, respects locks,
pure + unit-tested. `T-22` "Auto-arrange" button in DayView with mode selector,
reorders via planner store, toast summary, undo = pre-optimization snapshot. Caveat:
straight-line distance ≠ real transit. Within-a-day only (cross-day clustering is backlog).

### E5 — Extras & Launch

**T-14 — MapPicker** embedded Leaflet in editor; tap to set lat/lng; save as user `Place`.
**T-15 — Budget & TW formatting**: `Intl.NumberFormat('zh-TW', {style:'currency',
currency:'TWD'})` used in TripView/DayView/PrintView; guard null costs.
**T-16 — PrintView**: printable layout (days as tables), `@media print`, per-stop
transit line + holiday names annotated per day.
**T-17 — PWA manifest**: icons, theme color, offline data; `<meta>` CSP in
`index.html` (`default-src 'self'; img-src 'self' data: https://*.tile.openstreetmap.org;
style-src 'self' 'unsafe-inline'`); `useOnline()` offline banner.
**T-18 — QA + deploy**: mobile/iOS-Safari run-through, all-green gate
(`npm audit`, `lint`, `typecheck`, `test`, `build`), Lighthouse a11y + perf,
deploy to GitHub Pages + smoke test.
**T-24 — Holiday awareness layer**: static versioned `holidays.ts` (DGPA 2027,
CNY Feb 4–10), pure `isHoliday(date)` / `holidayName(date)` + Vitest; holiday badges
on day rows and a trip banner with booking/closure warnings.

## Backlog (explicitly out of v1)

- **T-19** tile caching via service worker; **T-23** TDX live arrivals (needs free API key).
- Cross-day auto-clustering; leg-level A→B directions; Supabase real-time sync;
  Google Places search.

## Standing constraints

- Client-only: no backend/accounts/secrets; `localStorage` + JSON only.
- Never `v-html`. Validate imported JSON. Component-first + KISS (see `AGENTS.md`).
- UI English; place names include Chinese.
