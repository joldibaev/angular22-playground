# UI Components (Angular 22)

A UI component library. The goal: **rebuild the UI components from the `trade3` app from scratch — cleaner, more modern, better.**

`trade3` was built before Angular 22. Its components lean on the Angular CDK and hand-wired JavaScript. This project re-implements the same set on the current platform:

- **Angular 22** — signal-based components, signal forms, zoneless.
- **`@angular/aria`** — headless primitives own roles, keyboard, and focus; CSS reacts to ARIA/state.
- **Native platform over JS** — Popover API, Interest Invokers (`interestfor`), Invoker Commands (`command`/`commandfor`), native `<dialog>`, CSS Anchor Positioning — instead of CDK overlays and manual event wiring.
- **Modern CSS** — `@starting-style`, `color-mix()`, `contrast-color()`, `light-dark()`, `:has()`, design tokens; no Tailwind in components.
- **Chrome 149+ only** — no cross-browser fallbacks.

Components live in `src/app/components/*`; each is demoed in the showcase (`src/app/showcase`).

> **Conventions and constraints are in [AGENTS.md](./AGENTS.md) — read it before contributing.**

## Develop

```bash
ng serve     # dev server at http://localhost:4200/
ng build     # production build to dist/
ng test      # unit tests (Vitest)
```
