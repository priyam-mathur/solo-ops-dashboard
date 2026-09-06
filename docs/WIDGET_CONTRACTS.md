# Widget Contracts Specification: SoloOps

## Composition Model
Under Multi-Zones, each widget is an independently deployed Next.js app. Contracts are route-based,
not component-export-based. The shell composes them via HTTP rewrites and iframe embedding.

---

## Cross-Zone Theme Sync

### Mechanism
- Shell writes `localStorage.setItem('soloops.theme', 'light' | 'dark')` on toggle.
- Shell's `ZoneFrame` component listens for `StorageEvent` on `soloops.theme` and `postMessage`s each iframe's `contentWindow` with `{ type: 'soloops:themechange', theme: 'light' | 'dark' }`.
- Each widget listens for `window.addEventListener('message', ...)` and `window.addEventListener('storage', ...)` to apply the theme class.
- On mount each widget reads `localStorage.getItem('soloops.theme')` to initialize the correct theme.

---

## 1. Weather Zone (`widgets/weather`)
- **Port:** 3001
- **basePath:** `/weather`
- **Shell rewrite:** `source: '/weather/:path*' → destination: 'http://localhost:3001/weather/:path*'`
- **Shell embed:** `<iframe src="/weather" />`
- **LocalStorage Keys:**
  - `soloops.weather.city`: Stores user's selected city name
  - `soloops.theme`: Read on mount to initialize theme
- **Theme events listened:** `message` (postMessage) + `storage`
- **API Provider:** Keyless Open-Meteo Geocoding & Forecast APIs

---

## 2. Todo Zone (`widgets/todo`)
- **Port:** 3002
- **basePath:** `/todo`
- **Shell rewrite:** `source: '/todo/:path*' → destination: 'http://localhost:3002/todo/:path*'`
- **Shell embed:** `<iframe src="/todo" />`
- **LocalStorage Keys:**
  - `soloops.todo.items`: JSON array of tasks (`id`, `title`, `client`, `dueDate`, `completed`, `createdAt`)
  - `soloops.theme`: Read on mount to initialize theme
- **Theme events listened:** `message` (postMessage) + `storage`

---

## 3. Notes Zone (`widgets/notes`)
- **Port:** 3003
- **basePath:** `/notes`
- **Shell rewrite:** `source: '/notes/:path*' → destination: 'http://localhost:3003/notes/:path*'`
- **Shell embed:** `<iframe src="/notes" />`
- **LocalStorage Keys:**
  - `soloops.notes.items`: JSON array of client notes (`id`, `title`, `client`, `content`, `updatedAt`)
  - `soloops.theme`: Read on mount to initialize theme
- **Theme events listened:** `message` (postMessage) + `storage`

---

## 4. Analytics Zone (`widgets/analytics`)
- **Port:** 3004
- **basePath:** `/analytics`
- **Shell rewrite:** `source: '/analytics/:path*' → destination: 'http://localhost:3004/analytics/:path*'`
- **Shell embed:** `<iframe src="/analytics" />`
- **LocalStorage Keys:**
  - `soloops.theme`: Read on mount to initialize theme
- **Theme events listened:** `message` (postMessage) + `storage`
- **Data:** v1 uses mock/sample revenue datasets; no external API
