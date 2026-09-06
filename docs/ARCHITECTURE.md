# Architecture Specification: SoloOps

## System Overview
SoloOps uses a **Next.js Multi-Zones** composition model. A Shell application acts as the entry point at port 3000 and proxies sub-paths to four independently running widget apps via Next.js `rewrites`. Each widget app runs on its own port, has its own `basePath`, and is independently deployable.

```
                        ┌─────────────────────────┐
                        │       Shell (Host)      │
                        │  Layout · Routing · Theme│
                        │        Port 3000        │
                        └───────────┬─────────────┘
                              Next.js rewrites
             ┌──────────────┬───────┴─────┬──────────────┐
             │              │             │              │
     ┌───────▼──────┐ ┌─────▼──────┐ ┌────▼───────┐ ┌────▼────────┐
     │ Weather Zone │ │  Todo Zone │ │ Notes Zone │ │Analytics Zone│
     │  Port 3001   │ │ Port 3002  │ │ Port 3003  │ │  Port 3004  │
     │ basePath:    │ │ basePath:  │ │ basePath:  │ │ basePath:   │
     │  /weather    │ │   /todo    │ │   /notes   │ │  /analytics │
     └──────────────┘ └────────────┘ └────────────┘ └─────────────┘
```

## Directory Structure
```
/solo-ops
  /docs
    PROJECT_MEMORY.md
    ARCHITECTURE.md
    DECISIONS.md
    WIDGET_CONTRACTS.md
    PROGRESS.md
  /shell
  /widgets
    /weather
    /todo
    /notes
    /analytics
  /shared
    /design-tokens
```

## Port Allocation
- Shell (Host): `http://localhost:3000`
- Weather Zone: `http://localhost:3001` (also accessible via shell at `/weather`)
- Todo Zone: `http://localhost:3002` (also accessible via shell at `/todo`)
- Notes Zone: `http://localhost:3003` (also accessible via shell at `/notes`)
- Analytics Zone: `http://localhost:3004` (also accessible via shell at `/analytics`)

## Multi-Zones Integration Strategy
- Shell's `next.config.js` uses `rewrites()` to proxy each sub-path to the corresponding widget app.
- Each widget's `next.config.js` sets `basePath` matching its rewrite source path.
- Shell's dashboard page embeds each zone inside a same-origin `<iframe>` pointing to its rewrite path.
- Error boundaries wrap each iframe slot to localize failures.
- No shared runtime or plugin required — this is Vercel's officially supported composition pattern.

## Shared Styling & Design Tokens
- Design tokens reside in `shared/design-tokens/index.js`.
- Each application imports tokens build-time inside `tailwind.config.js`.
- Light and dark themes are standardized across typography, surface colors, borders, and accents.

## Cross-Application Communication
- **Theme sync mechanism:** `localStorage` key `soloops.theme` (value: `'light' | 'dark'`)
- Shell writes to `soloops.theme` on toggle; shell's `ZoneFrame` component listens for `storage` events and posts `{ type: 'soloops:themechange', theme }` via `postMessage` to each iframe's `contentWindow`.
- Each widget listens for both `message` (postMessage from shell) and `storage` (direct tab writes) events to apply the theme on mount and on change.
- On mount each widget reads `soloops.theme` from `localStorage` directly to apply the correct initial theme.

## State & Data Persistence
- Client-side `localStorage` partitioned by application domain:
  - Todo: `soloops.todo.*`
  - Notes: `soloops.notes.*`
  - Weather settings: `soloops.weather.*`
  - Theme preference: `soloops.theme`
