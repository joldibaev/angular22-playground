# Showcase overhaul handoff

## Goal for the next session

Bring every page under `src/app/showcase/component-catalog-section/` to the same standard as the
Sonner showcase. A published showcase should let a developer discover every useful feature of a
component, try it, and copy the exact example they need without having to inspect the source or find
separate documentation.

Do this component by component. Before changing a showcase, audit the component's real public API,
its related subcomponents/directives/types, specs, and current showcase. Do not infer features only
from another framework's documentation: external docs are inspiration for presentation and can also
reveal gaps, but this repository's implementation is the source of truth.

## Sonner is the reference

Reference files:

- `src/app/showcase/component-catalog-section/sonner-showcase/`
- `src/app/components/ui-sonner/`

The resulting Sonner page is intentionally closer to good component documentation than to a single
large demo. It uses a short introduction followed by focused examples. Every example has its own
`Preview` and `Code` tabs inside the project's `UiCard` and `UiTab` components, so a developer can
copy one relevant variant without extracting it from a giant snippet.

Current example groups:

1. Default toast and minimal setup.
2. Types: success, info, warning, and destructive/error.
3. Promise lifecycle: loading, success, error, and `finally` in the code example.
4. Loading followed by an in-place update using the same toast ID.
5. Action and cancel controls.
6. Custom icon.
7. All six positions.
8. Behavior: persistent duration, important live-region announcement, non-dismissible toast, and
   lifecycle callbacks.
9. Stack behavior, multiple simultaneous position groups, and dismissing all toasts.
10. Toaster-level options, with interactive controls for visible toast count and expanded stacks,
    plus a concise code example for the remaining useful options.

The header keeps only genuinely useful information, such as the `Alt + T` shortcut focusing the
newest notification group. Avoid long API prose and tables when a small executable example explains
the feature better.

## Pattern to apply to other showcases

For each component:

1. Read its root component, template, styles, public types, exports, related directives and child
   components.
2. Read its specs to find behavior that is easy to miss from the template alone.
3. Inventory every public feature: variants, sizes, states, projected regions, configuration,
   keyboard interaction, events, programmatic API, accessibility behavior, and meaningful feature
   combinations.
4. Compare the inventory with the existing showcase and identify omissions, misleading examples,
   dead controls, and APIs that exist but should perhaps be removed rather than documented.
5. Look at strong documentation for the equivalent component when useful. The Sonner pass used:
   - `https://ui.shadcn.com/docs/components/radix/sonner`
   - `https://www.shadcn.io/ui/sonner`
   - `https://sonner.emilkowal.ski/`
   - `https://zardui.com/docs/components/toast`
6. Build small feature-focused sections. Give every section an accessible heading and a dedicated
   Preview/Code pair.
7. Use this project's UI components for the documentation shell and controls. Do not introduce
   custom tabs, cards, selects, switches, or buttons when `UiTab`, `UiCard`, `UiSelect`, `UiSwitch`,
   and `UiButton` already exist.
8. Keep code examples realistic, minimal, internally consistent, and copy-pasteable. Show imports or
   setup in the default example; later examples can focus on the one API being demonstrated.
9. Add or update the showcase `.spec.ts` to cover its deterministic rendering and interactions.
10. Search for tails after removing or replacing anything: files, imports, state, bindings, CSS,
    tests, examples, comments, types, and wording.

## Editorial and UX rules learned from the Sonner pass

- Completeness does not mean one enormous wall of text. Prefer many small runnable examples.
- The preview and its code must describe the same behavior. A snippet that contains options absent
  from the preview is documentation drift.
- A feature should usually get its own example when developers are likely to search for or copy it
  independently.
- Group closely related variants when comparison is more useful than separation, such as component
  sizes or semantic types.
- Use short titles and one-line context only where the behavior is not self-evident.
- Avoid showcasing low-value configurability merely because an input exists. During the Sonner pass,
  Theme and Invert colors were deliberately removed from `Toaster options`; they added noise and do
  not belong in the final showcase presentation.
- Examples should exercise the real component API rather than reproducing its appearance with local
  showcase-only markup.
- Keep the showcase visually quiet. The component and interaction are the subject; documentation
  chrome should not compete with them.
- Preserve accessibility in the documentation itself: semantic sections/headings, labelled tabs and
  controls, keyboard-accessible code blocks, visible focus, and no hover-only essential information.

## Sonner implementation knowledge worth preserving

The showcase work exposed and fixed real component issues, not just documentation gaps:

- The former arbitrary Angular custom-component toast feature was removed from both the showcase
  and `ui-sonner`. Do not reintroduce `toast.custom`, `component`, `componentProps`,
  `UiSonnerRenderable`, or `NgComponentOutlet` branches. Custom icons remain supported.
- There may still be an empty
  `src/app/showcase/component-catalog-section/sonner-showcase/sonner-custom-content/` directory in
  the working tree. Verify and remove it if it is truly empty; it is a tail of the deleted feature.
- Updating a `toast.loading()` entry by the same ID to a non-loading toast must clear the inherited
  infinite duration. Otherwise the updated success toast can disappear or time incorrectly. The
  state now resets the duration to the toaster default when the update does not supply one, and the
  timer avoids scheduling infinite/promise-loading timeouts. A regression spec was added.
- `toastOptions.class` is wired through `UiSonner` to the rendered toast element and has test
  coverage.
- The close button is an in-bounds `UiButton` with `variant="ghost"` and icon-only semantics. It is
  absolutely positioned in the toast's upper-right corner and must not consume the content/action
  layout.
- Toast content and action/cancel controls use a grid: content occupies the first row and controls
  sit in a second, right-aligned row. Padding reserves the close-button area. This prevents the close
  control from overlapping action buttons without making close a hover-only affordance.
- Keep the close button available without hover: hover-only dismissal would be poor for touch and
  keyboard users.
- The toaster shortcut and multiple position groups are useful but non-obvious behaviors and should
  remain discoverable.

## Scope and working rules for the next session

- Improve both the showcase and the underlying component when the audit reveals a genuine bug,
  inaccessible behavior, misleading API, or low-value feature. Explain meaningful API removals
  before making them when the trade-off is not already clear.
- Do not blindly make every existing input prominent. The aim is complete useful documentation and
  a clean component API, not maximum option count.
- Keep showcase components focused; split out reusable documentation presentation only if repetition
  becomes substantial enough to justify the abstraction.
- Follow `AGENTS.md`, especially the Angular, accessibility, CSS token, Chrome 150, cleanup, and spec
  requirements.
- Do not run the app, browser, build, tests, lint, or formatting unless the user explicitly asks in
  that session. The user performs visual and full-project verification.
- The current working tree contains uncommitted Sonner and shared-style work. Preserve unrelated
  edits and inspect diffs before modifying overlapping files.

## Suggested next action

List the remaining showcase folders, choose one component, audit its complete public API against its
current page, and present the missing/low-value feature findings before or alongside the focused
Preview/Code rewrite. Repeat until the catalog is consistently documented.
