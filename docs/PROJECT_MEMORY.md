# Project Memory: SoloOps

## Purpose & Overview
SoloOps is a unified operations dashboard tailored for freelancers and independent professionals, exemplified by the target persona Priyam Mathur (Freelance UX Designer working across 3-4 concurrent clients). It addresses tool fragmentation by consolidating daily planning, live weather forecasts, prioritized multi-client task tracking, client interaction notes, and financial income visibility into a single morning command center.

The architecture is built upon client-side runtime microfrontends using Next.js, Tailwind CSS, and Module Federation. Each functional area runs as an autonomous, independently deployable application composed into a resilient host shell with localized fault boundaries.

## Target User & Core Jobs-to-be-Done
1. Check urgent cross-client tasks and deadlines at workday start.
2. Quick-log and search client conversation notes before and after calls.
3. Check weather for on-site client visits without context switching.
4. Assess monthly income breakdown per client without opening spreadsheets.

## Current State
- Phase 1 completed: Repository structure, context files, and design tokens established.
- Phase 2 completed: Shell application operational on port 3000 with personalized greeting (SH-1), 4-slot responsive grid (SH-2), localized WidgetErrorBoundary (SH-4), WidgetLoadingState skeleton (SH-6), and theme toggle with `soloops:themechange` event dispatch (SH-5). Build verified clean.
- Phase 3 completed: Weather widget operational on port 3001 with live Open-Meteo fetching (WT-1, WT-3), city search & switch (WT-2), inline error handling (WT-4), theme synchronization, and federated integration into Shell Slot 1. Both standalone and federated builds verified clean.
- Phase 4 starting: Todo remote widget.

## Navigation & References
- System Architecture: `docs/ARCHITECTURE.md`
- Widget Contracts & Interfaces: `docs/WIDGET_CONTRACTS.md`
- Decisions Log: `docs/DECISIONS.md`
- Execution Progress: `docs/PROGRESS.md`
