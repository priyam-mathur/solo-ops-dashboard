# Microfrontends Architecture Guide: Understanding SoloOps

> **Target Audience**: Technical recruiters, engineering teams, and developers who want a clear, deep understanding of Microfrontends (MFEs) in theory and in practice.

---

## 1. What are Microfrontends?

### The Core Concept
Just as **Microservices** broke down backend monoliths into smaller, independently deployable services, **Microfrontends (MFEs)** apply the same architectural pattern to frontend web applications.

In a traditional **Frontend Monolith**:
- A single codebase houses every feature, page, and UI component.
- One team's broken code or failed build blocks the entire deployment for everyone.
- Scaling build times and team collaboration becomes painful as the codebase grows.

In a **Microfrontend Architecture**:
- The application is split into independent sub-apps called **Widgets** or **Remote Microfrontends**.
- A central host application (the **Shell**) composes them together into a single user interface.
- Each microfrontend can be built, tested, and deployed independently.

```
       +-------------------------------------------------------+
       |               SOLOOPS HOST SHELL                      |
       |                (Port 3000)                            |
       |                                                       |
       |  +--------------------+      +---------------------+  |
       |  |   Weather Widget   |      |     Todo Widget     |  |
       |  |   (Port 3001)      |      |     (Port 3002)     |  |
       |  +--------------------+      +---------------------+  |
       |                                                       |
       |  +--------------------+      +---------------------+  |
       |  |    Notes Widget    |      |   Analytics Widget  |  |
       |  |   (Port 3003)      |      |     (Port 3004)     |  |
       |  +--------------------+      +---------------------+  |
       +-------------------------------------------------------+
```

---

## 2. Microfrontend Implementation Strategies

There are several ways to integrate microfrontends:

| Strategy | Mechanism | Pros | Cons |
|---|---|---|---|
| **Next.js Multi-Zones** *(Used in SoloOps)* | HTTP Rewrites & Sub-paths | Native Next.js support, zero webpack dependency hacks, super stable | Requires route routing setup or iframe wrapper |
| **Module Federation** | Webpack 5 runtime dynamic JS loading | True shared JS components & React state | High risk of peer-dependency mismatches with framework internals |
| **Web Components** | Custom HTML elements (`<weather-app>`) | Framework agnostic (Vue, React, Svelte) | Complex CSS encapsulation & shadow DOM styling |
| **iFrame Embedding** | Browsers' built-in sandbox | Total CSS/JS isolation, zero crash cascade | Tricky cross-frame styling & event passing |

---

## 3. How SoloOps Works (The Technical Blueprint)

SoloOps combines **Next.js Multi-Zones** with **ZoneFrame iFrame Sandboxing** to achieve bulletproof fault tolerance.

### 3.1 Directory & Service Map

SoloOps is structured as a clean Monorepo:

```
soloops/
├── shell/                 # Host Shell Dashboard (Next.js - Port 3000)
├── widgets/
│   ├── weather/           # Weather App (Next.js - Port 3001)
│   ├── todo/              # Todo App (Next.js - Port 3002)
│   ├── notes/             # Notes App (Next.js - Port 3003)
│   └── analytics/         # Analytics App (Next.js - Port 3004)
├── shared/                # Common TypeScript contracts & utilities
└── docs/                  # Architectural decision records & guides
```

---

### 3.2 The Routing Layer (Next.js Rewrites + BasePaths)

The Shell application acts as a reverse proxy. When a user requests a path under `/weather/*`, the Shell proxies the request to port `3001`.

#### Shell Proxy (`/shell/next.config.js`):
```javascript
module.exports = {
  async rewrites() {
    return [
      { source: '/weather/:path*', destination: 'http://localhost:3001/weather/:path*' },
      { source: '/todo/:path*', destination: 'http://localhost:3002/todo/:path*' },
      { source: '/notes/:path*', destination: 'http://localhost:3003/notes/:path*' },
      { source: '/analytics/:path*', destination: 'http://localhost:3004/analytics/:path*' }
    ];
  }
};
```

#### Widget Config (`/widgets/weather/next.config.js`):
```javascript
module.exports = {
  reactStrictMode: true,
  basePath: '/weather' // Tells Next.js to serve assets and routes from /weather
};
```

---

### 3.3 UI Composition & Fault Isolation

In `/shell/src/pages/index.tsx`, the dashboard embeds each widget inside a `ZoneFrame` component:

```tsx
function ZoneFrame({ src, title }: { src: string; title: string }) {
  return (
    <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
      <iframe
        src={src}
        title={title}
        className="w-full h-full border-none"
        loading="lazy"
      />
    </div>
  );
}
```

#### Key Benefit: Total Fault Isolation
If the Weather API crashes or throws an unhandled error, **only the Weather frame breaks**. The host dashboard, task manager, notes app, and analytics charts continue running flawlessly.

---

## 4. Cross-Microfrontend Communication & State Sync

Microfrontends must remain decoupled, but they still need to share essential application state (such as Light/Dark Theme preference).

### How Theme Sync Works in SoloOps:

```
[ Theme Toggle Click in Shell ]
               │
               ▼
[ Write to localStorage: 'soloops.theme' = 'dark' ]
               │
               ▼
[ Window Storage Event Fires ]
               │
               ▼
[ Shell sends postMessage to frame.contentWindow ]
               │
               ▼
[ Widget iframe receives message -> applies 'dark' class ]
```

1. **Initial Mount**: Each widget checks `localStorage.getItem('soloops.theme')` on mount to render in the correct theme immediately.
2. **Runtime Updates**: When the user clicks the `ThemeToggle` button in the Shell:
   - The Shell updates `localStorage.setItem('soloops.theme', newTheme)`.
   - The Shell's `ZoneFrame` sends a `postMessage({ type: 'soloops:themechange', theme: newTheme })` to each iframe's `contentWindow`.
   - Each widget listens for window `message` events and dynamically toggles the CSS `.dark` class on `document.documentElement`.

---

## 5. Key Talking Points for Explaining SoloOps in Interviews

When explaining SoloOps, highlight these 5 core technical achievements:

1. **Monorepo Organization**: Microfrontends co-located in a monorepo for developer velocity while retaining strict runtime separation.
2. **Next.js Multi-Zones**: Leveraged native Next.js rewrites and basePaths for seamless routing without relying on brittle webpack plugin hacks.
3. **Resilient Sandboxing**: Used iframe wrappers to prevent CSS contamination and guarantee that a failure in one widget never crashes another.
4. **Decoupled Event Bus**: Implemented cross-frame state synchronization via browser native `postMessage` and `localStorage` events.
5. **Independent Deployability**: Every widget can be updated and redeployed independently without recompiling the host shell.

---

## Summary Cheat Sheet

| Question | Short Answer |
|---|---|
| **What architecture is SoloOps?** | Microfrontend architecture using Next.js Multi-Zones & iframe composition. |
| **How does routing work?** | Host shell on port 3000 proxies sub-paths `/weather`, `/todo`, `/notes`, `/analytics` to ports 3001-3004. |
| **How do widgets communicate?** | Cross-origin/same-origin `postMessage` API paired with `localStorage` persistence. |
| **Why not Module Federation?** | Avoided internal Next.js resolver version mismatches; Multi-Zones offer standard, fail-safe HTTP composition. |
