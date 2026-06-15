# TODO

Remaining work from the panel/overlay refactor. Each item has enough context to
pick up cold in a new session.

> Note: per `AGENTS.md`, do not run build/tests/lint unless the user explicitly
> asks in the moment.

---

## 1. left/right arrow geometry for the panel primitive

**Status:** positioning works, arrow does NOT.

**Context.** The shared "tethered panel with an arrow" primitive lives in
`src/app/shared/arrow-panel.css` (+ type in `src/app/shared/arrow-panel.ts`). It
is consumed by `ui-tooltip-panel`, `ui-popover-panel`, and `ui-input-error`.
Both `ui-tooltip` and `ui-popover` expose `uiPlacement` = `top | bottom | left |
right` and `uiFallback` = `true|false`.

- `top` / `bottom`: fully done — `position-area`, the `::after` triangle, the
  integrated `border-shape` arrow, and the arrow-side swap on flip
  (`@container anchored(fallback: flip-block)`).
- `left` / `right`: **position only** (`position-area: inline-start/inline-end`
  + `align-self: anchor-center`). No arrow yet. See the `TODO(left/right)`
  marker at the bottom of `arrow-panel.css`.

**To do.** Author the horizontal arrow for left/right:
- `::after` fallback triangle pointing left/right,
- the integrated `border-shape` path for a side arrow,
- the flip swap on the inline axis (`@container anchored(fallback: flip-inline)`)
  so the arrow follows when the panel flips left<->right.
- Do this together with item 2 (pick the arrow mechanism first).

## 2. Decide the arrow mechanism: `::after` vs `border-shape`

**Context.** The arrow is built in 3 progressive-enhancement layers: `::after`
`clip-path: polygon()` → `::after` `clip-path: shape()` → integrated
`border-shape` (which sets `::after { content: none }`). We target Chrome 149+
ONLY, so only ONE layer should remain.

**To do.** Verify whether `border-shape` actually ships in Chrome 149. Keep the
single mechanism that 149 supports and delete the dead fallback layer(s). It is
all centralized in `arrow-panel.css` now, so this is a one-file change. Settle
this before/with item 1 so left/right only implements the chosen mechanism.

## 3. Tests — fix the 7 pre-existing failures

**Context.** `npm test` (vitest + jsdom). Current state: **7 failed / 79
passed**. These were verified to be PRE-EXISTING (identical failures at HEAD with
the refactor stashed) — they are NOT caused by the recent work. Two root causes:

**Group A — jsdom doesn't resolve `var()`/`anchor()` in `getComputedStyle`** (4):
- `ui-autocomplete.spec.ts:400`, `ui-menu.spec.ts:121`, `ui-select.spec.ts:572`
  — assert `'0.5rem'` in `top`, get `calc(anchor(bottom) + var(--ui-popup-offset))`.
- `ui-tab.spec.ts:243` — asserts `'2px'`, gets `var(--ui-tab-line-indicator-size)`.
- Fix = assert the raw/un-resolved value (weaker) or restructure the check.
  The CSS is correct; this is a jsdom limitation.

**Group B — logic/behavior under jsdom** (3) — investigate, may be real bugs:
- `ui-autocomplete.spec.ts:234` — `toContain` called on `undefined`.
- `ui-select.spec.ts:334` — selected-label order reversed (`' Paid, Created'`
  vs expected `'Created, Paid'`).
- `ui-select.spec.ts:458` — multi-select `popupExpanded` is `false`, expected `true`.

## 4. Showcase — demo the new features + more examples

**Context.** Showcase pages live under
`src/app/showcase/component-catalog-section/` (e.g. `popover-showcase.*`,
`tooltip-showcase.*`). New API not yet shown:
- `uiPlacement` (top/bottom/left/right) on both tooltip and popover,
- `uiFallback` (true/false) on both,
- popover click = Invoker Commands, hover = Interest Invokers.

**To do.** Add examples covering all 4 placements + fallback on/off for tooltip
and popover, and broaden the examples generally. Note: left/right won't show an
arrow until item 1 is done.

---

## Loose ends (optional)

- The whole refactor is uncommitted in the working tree — commit when ready
  (suggest splitting: "shared layer + DRY primitives", "interest invokers /
  invoker commands", "directional placement API").
- `AGENTS.md`: a rule about peer-component independence vs a shared foundation
  layer was drafted but never added. Wording proposed:
  "Peer UI components must not import another peer component's internals or reach
  into its implementation. Composition and depending on a deliberate shared layer
  (design tokens, style primitives, pure dependency-free utilities) are
  encouraged. Prefer DRY through that shared layer over duplicating logic or
  styles; keep such shared dependencies one-directional and free of cycles."
