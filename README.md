# Taiwanna

A trip planner / itinerary tracker for Taiwan. Plan trips, order each day's stops,
see them on a map, and track the NT$ budget — all offline-friendly in the browser.

> Personal project. Storage is client-side (`localStorage`); there is no backend
> and no account. See `JSON export` for device-to-device handoff.

## Stack

- Vue 3 + Vite + TypeScript
- Pinia (+ `pinia-plugin-persistedstate`)
- Vue Router
- PrimeVue 4 (Aura theme, system dark mode)
- VueUse
- Leaflet + OpenStreetMap
- Vue Draggable Plus

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script               | What it does                        |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start the dev server                |
| `npm run build`      | Type-check and build for production |
| `npm run preview`    | Preview the production build        |
| `npm run typecheck`  | Type-check only (`vue-tsc`)         |
| `npm run lint`       | Lint and auto-fix                   |
| `npm run lint:check` | Lint without fixing                 |
| `npm run format`     | Format with Prettier                |
| `npm run test`       | Run unit tests once                 |
| `npm run test:watch` | Run unit tests in watch mode        |

## Deploy

Hosted on GitHub Pages. The Vite `base` is set to `/taiwan-itinerary/` for
production builds (see `vite.config.ts`), matching the repository subpath.

## Notes

- **PrimeVue is pinned to v4 (MIT).** PrimeVue v5 moved to a dual
  Community/Commercial license that requires a registered license key; v4 avoids
  that for this personal, non-commercial project. Do not upgrade to v5 without
  obtaining a key.
- **Known dev-only advisory:** `npm audit` reports a high-severity `braces`
  (via `@vue/eslint-config-typescript` → `fast-glob` → `micromatch`) issue. It is
  a build-time-only dependency, has no upstream patch at the time of writing, and
  is not reachable in app runtime. Re-check when upstream releases a fix.
