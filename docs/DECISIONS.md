# Decisions Log: SoloOps

## [2026-09-06] Decision: Direct Workspace Root Placement
- **Decision:** Place `/docs`, `/shell`, `/widgets`, and `/shared` directly at workspace root `solo-ops`.
- **Reason:** Simplifies execution commands, tool invocation paths, and terminal directory handling in the IDE workspace.
- **Alternatives considered:** Nesting an extra `/soloops` root folder inside `solo-ops`.

## [2026-09-06] Decision: Pages Router for Module Federation Exposed Entry Points
- **Decision:** Use Next.js Pages Router internally for the remote widgets' exposed components to ensure stable Module Federation resolution.
- **Reason:** Next.js App Router has complex server component and streaming runtime requirements that complicate client-side federated component imports; Pages Router entry points provide predictable, rock-solid client-side federation.
- **Alternatives considered:** Pure App Router federation across remotes.

## [2026-09-06] Decision: Keyless Open-Meteo API for Weather
- **Decision:** Use Open-Meteo for live weather data fetching.
- **Reason:** Free, highly reliable, requires no API key or environment secret setup, satisfying PRD requirements `WT-1` and `WT-3` with zero friction.
- **Alternatives considered:** OpenWeatherMap, WeatherAPI.

## [2026-09-06] Decision: Shell Pages Router & Webpack 5.90.0 Pinning
- **Decision:** Use Pages Router (`pages/` directory) for the host shell and pin `webpack@5.90.0` with `NEXT_PRIVATE_LOCAL_WEBPACK='true'`.
- **Reason:** `@module-federation/nextjs-mf` strictly requires the Pages Router architecture and requires Webpack 5.90.0 matching Next.js 14 internals to prevent runtime template compilation mismatches.
- **Alternatives considered:** Next.js App Router (explicitly rejected by nextjs-mf plugin runtime).
- **SUPERSEDED** — see decision below.

## [2026-09-06] Decision: Abandon Module Federation, Pivot to Next.js Multi-Zones
- **Decision:** Removed `@module-federation/nextjs-mf` and `webpack` from all apps. Adopted Next.js Multi-Zones (rewrite-based composition) as the composition strategy.
- **Reason:** `@module-federation/nextjs-mf` v8.x is in maintenance mode and has an irreconcilable circular dependency conflict on Next.js 14.2.x: the plugin internally requires `webpack/lib/util/identifier` from a standalone webpack installation, but having standalone webpack installed separately causes a hook-signature mismatch (`_resolveContext_stack.delete is not a function`) in Next.js 14.2.x's `optional-peer-dependency-resolve-plugin`. No installable version of the plugin resolves both constraints simultaneously.
- **What changed:**
  - Shell `next.config.js` now uses `rewrites()` to proxy `/weather`, `/todo`, `/notes`, `/analytics` sub-paths to the respective widget dev servers.
  - Each widget's `next.config.js` sets `basePath` matching its rewrite source.
  - Shell dashboard embeds each zone via same-origin `<iframe>` pointing to the rewrite path.
  - Theme sync changes from `window.dispatchEvent(CustomEvent)` (same-page only) to `postMessage` from shell to each iframe's `contentWindow`, plus `storage` event listeners in each widget for resilience.
  - `remotes.d.ts` and all Module Federation plugin configurations removed from every app.
- **Core requirements verified:**
  - ✅ Independent deployability: each widget is a standalone Next.js app with its own build and port.
  - ✅ Fault isolation: if a widget server is down, the shell's iframe renders empty/blank; other zones unaffected. `WidgetErrorBoundary` wraps each slot.
  - ✅ Theme sync: `localStorage` + `postMessage` + `storage` events deliver theme across zone boundaries on same origin.


