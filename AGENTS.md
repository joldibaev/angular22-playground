# Agent Instructions

- Do not start or run the project unless the user explicitly asks for it.
- Do not run verification commands, tests, builds, linters, format checks, or browser checks unless the user explicitly asks for them.
- Build only for Chrome 149+; compatibility with other browsers or Chrome versions below 149 is not required.
- Prefer modern CSS features when Chrome 149+ supports them. CSS Anchor Positioning, gap decorations, focusgroup, the Popover API, border-shape, CSS `if()` statements, CSS custom functions, `light-dark()`, and similar modern platform features are allowed and recommended.
- Prefer native CSS nesting for component styles when it keeps related selectors together and improves readability.
- Use CSS deliberately and correctly. Prefer logical properties (`padding-inline`, `padding-block`, `margin-inline`, `inset-inline`, etc.) only when their writing-mode and RTL behavior is intended; remember that inline/block properties react to text direction and writing mode. Use physical properties (`left`, `right`, `padding-left`, `padding-right`, etc.) when the layout must stay physically anchored.
- When nested rounded UI surfaces have an outer container with padding and inner controls or indicators with their own radius, derive the radii from the formula `outerR = innerR + padding`. For example, pill tabs, segmented controls, button groups, chips, and similar patterns should compute or document the inner radius as `innerR = outerR - padding` instead of choosing unrelated radius values.
- Accessibility is required, not optional. Every UI change must carefully account for semantic HTML, keyboard navigation, visible focus states, ARIA only when needed, accessible names/descriptions, color contrast, reduced-motion preferences, and screen-reader behavior.
- Keep Angular components and templates small and focused. When a component or template starts to grow, split it into smaller feature, section, showcase, or presentational components instead of continuing to add markup to a large file such as `src/app/app.html`.
