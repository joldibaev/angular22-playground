# Angular22 UI To Prod

This document is the migration plan for moving the Trade3 UI component library into
the Angular22 version.

Angular22 is not intended to be a file-by-file copy of Trade3. It is the second
version of the same UI system, rebuilt for Angular 22, Chrome 149+, modern CSS, and
less JavaScript-driven UI behavior.

## Goals

- Reach product parity with Trade3 UI components.
- Keep Angular22 components smaller, more focused, and easier to test.
- Prefer native browser primitives when Chrome 149+ supports them.
- Prefer CSS-driven positioning, state, layout, and animation over JavaScript glue.
- Preserve or improve accessibility behavior during every migration.
- Build a reusable foundation first, then port product-specific components on top.

## Non-Goals

- Do not copy Trade3 implementation details blindly.
- Do not preserve old APIs when a cleaner Angular22 API gives better developer
  experience.
- Do not optimize for browsers below Chrome 149.
- Do not introduce CDK Overlay where native Popover API and CSS Anchor Positioning
  can provide the required behavior.
- Do not migrate every component in one pass.

## Source Libraries

| Library | Path | Role |
|---|---|---|
| Trade3 UI | `/Users/nurlanjoldibaev/Desktop/Dev/trade3/apps/app-ng/src/app/core/ui` | Current production UI system. Broad product coverage. |
| Angular22 UI | `/Users/nurlanjoldibaev/Desktop/Dev/angular22/src/app/components` | New v2 UI system. Smaller, modern, still under development. |

## Current State Summary

| Area | Trade3 | Angular22 | Migration Meaning |
|---|---|---|---|
| Component coverage | Broad production set. | Partial foundation set. | Angular22 needs many components ported. |
| Architecture | Product-first components with app-specific APIs. | Primitive-first components with modern platform features. | Port behavior and UX, not necessarily old internals. |
| Forms | Strong usage of `@angular/forms/signals` `Field<T>`. | Uses `model()` and `FormValueControl` in key controls. | Prefer v2 form APIs that are reusable and composable. |
| Popup behavior | Mix of CDK Overlay and native Popover. | Native Popover and CSS anchor primitives are central. | New popup layer should become the base for menus, select, tooltip, popover, dialog-like surfaces where appropriate. |
| Tests | Very limited UI test coverage. | Better test coverage for current components. | Every migrated interactive component needs specs. |
| Styling | External CSS files, product data attributes. | External CSS files, modern CSS-first patterns. | Keep external CSS and improve consistency. |

## Migration Principles

### 1. Product Parity, Not Implementation Parity

Each Angular22 component must cover the useful product behavior from Trade3, but the
implementation can change.

Example: Trade3 `ui-select` uses CDK Overlay. Angular22 `ui-select` should continue
to prefer native Popover API and `syncPopup()` if it can satisfy the same UX and
accessibility requirements.

### 2. Foundation Before Product Components

Do not start with heavy components such as table, date range picker, or tree until
the base primitives are stable.

Base primitives:

- button
- icon
- input
- popup
- popover
- tooltip
- menu
- select
- autocomplete
- tabs

Product components:

- dialog
- drawer
- datepicker
- date range picker
- table
- table2
- tree
- sonner
- barcode

### 3. Less JavaScript

Prefer:

- Popover API for popup visibility.
- CSS Anchor Positioning for popup placement.
- CSS state selectors, `:popover-open`, `:has()`, and data attributes for styling.
- CSS transitions with `@starting-style`.
- Native form controls when semantics match.
- `@angular/aria` for complex keyboard and screen-reader patterns.

Avoid:

- Manual overlay positioning when CSS anchor positioning is enough.
- Scroll and resize listeners when CSS layout can solve the problem.
- Component state that duplicates native open/closed state without a reason.
- Imperative DOM manipulation except for dynamic global surfaces where Angular needs
  to attach a component to `document.body`.

### 4. Accessibility Is Part Of Done

Every migrated component must account for:

- Semantic host elements.
- Keyboard navigation.
- Visible focus states.
- Disabled states.
- Loading states when applicable.
- Accessible names.
- `aria-*` only when needed.
- Screen-reader behavior.
- Color contrast.
- Reduced-motion behavior for animations.
- Escape and outside interaction behavior for popup surfaces.

### 5. Small Components

Keep one Angular declaration per file.

When a component grows, split it into smaller root, item, panel, trigger, option,
group, content, or action components.

## Parity Checklist

Use this checklist for every component before marking it done.

| Check | Required |
|---|---|
| API reviewed | Compare Trade3 inputs/outputs/public methods with Angular22 intended API. |
| Template reviewed | Ensure semantic HTML and external `templateUrl`. |
| CSS reviewed | Use modern CSS where useful; keep focus/disabled/loading states clear. |
| Keyboard behavior | Test all expected keys for interactive controls. |
| Screen reader behavior | Validate roles, labels, descriptions, and state announcements. |
| Pointer behavior | Mouse, touch, outside click, and hover behavior where applicable. |
| Reduced motion | Avoid required animation; respect reduced motion. |
| Tests added | Add focused specs for meaningful behavior. |
| Product usage checked | Confirm likely Trade3 usage patterns have an Angular22 equivalent. |
| Docs/examples added | Add usage examples when the component API is non-trivial. |

## Current Angular22 Components

| Component | Current Role | Notes |
|---|---|---|
| `ui-autocomplete` | Searchable combobox primitive. | Uses `@angular/aria`, `FormValueControl`, native popup sync, inline suggestion. |
| `ui-button` | Basic button/link directive component. | Minimal API compared with Trade3. Needs product parity review. |
| `ui-card` | Simple card container. | Presentational. |
| `ui-icon` | Icon rendering component. | Presentational foundation. |
| `ui-input` | Input field component. | Includes `ui-input-error`. Needs parity with Trade3 form states. |
| `ui-menu` | Menu surface and items. | Uses `@angular/aria/menu` and CSS anchor positioning through trigger. |
| `ui-popover` | Generic popover directive and panel. | Important foundation for v2 popup behavior. |
| `ui-popup` | Shared popup CSS and sync helper. | Core utility layer for native Popover API. |
| `ui-segmented` | Directory exists, currently no files found in scan. | Needs implementation or cleanup. |
| `ui-select` | Select primitive. | Supports single/multi value model. Needs product parity with Trade3. |
| `ui-tab` | Tabs primitive. | Uses `@angular/aria/tabs`, query params, overflow handling. |
| `ui-tooltip` | Tooltip directive and panel. | Native popover + CSS anchor approach. |

## Trade3 Components To Migrate

### Priority Groups

| Priority | Components | Reason |
|---|---|---|
| P0 Foundation | `button`, `icon`, `input`, `popup`, `popover`, `tooltip`, `menu`, `select`, `autocomplete`, `tab` | Other components depend on these primitives and behavior patterns. |
| P1 Form Controls | `checkbox`, `radio`, `switch`, `select-native` | Required for production forms. |
| P1 Surfaces | `dialog`, `dialog-confirm`, `drawer` | Required for real app workflows. |
| P1 Feedback | `loading`, `badge`, `chip`, `sonner` | Common feedback and status UI. |
| P2 Data Display | `table`, `table2`, `list`, `tree` | Required for data-heavy product screens. |
| P2 Date Controls | `datepicker`, `date-range-picker` | Complex, should wait for stable form/popup primitives. |
| P3 Domain/Utility | `avatar`, `icon-container`, `barcode`, `card` | Important but lower migration risk. |

## Detailed Component Plan

### ui-button

Trade3 source:

- `ui-button/ui-button.ts`
- `ui-button/ui-button.html`
- `ui-button/ui-button.css`
- `ui-button/ui-button.type.ts`

Trade3 capabilities:

- Host selectors: `button[uiButton]`, `a[uiButton]`.
- Variants: `brand`, `success`, `warning`, `error`, `info`, `mono`.
- Modes: `solid`, `outline`, `secondary`, `ghost`, `link`.
- Sizes through shared `UiSize`.
- Rounded mode.
- Icon support through `UiIcon`.
- Icon position support.
- Icon-only mode.
- Fluid width.
- Alignment.
- Loading state as `boolean | string`.
- Disabled handling for both button and anchor.
- `aria-busy`, `aria-disabled`, disabled attr, anchor tabindex handling.

Angular22 current state:

- Exists.
- Host selectors: `button[uiButton]`, `a[uiButton]`.
- Supports `appearance`, backwards-compatible `variant`, `type`, `disabled`,
  `loading`.
- Handles disabled/loading click suppression.
- Much smaller API than Trade3.

Migration tasks:

- Decide final variant naming. Prefer `destructive` over `error` for destructive
  actions.
- Add product variants only if they are still needed in Angular22.
- Add size support.
- Add icon placement support without making icons mandatory.
- Add icon-only styling and accessible-name expectations.
- Add fluid width support.
- Decide whether `loading` should stay boolean only or support a loading label.
- Ensure anchor disabled behavior prevents click and removes keyboard activation.
- Add tests for button host type, anchor behavior, disabled, loading, icon-only,
  and variant classes.

Done when:

- All existing Trade3 button usage patterns can be expressed in Angular22.
- Button API remains simpler than Trade3 where old options are no longer needed.

### ui-icon

Trade3 source:

- `ui-icon/ui-icon.ts`
- `ui-icon/ui-icon.html`
- `ui-icon/data.ts`

Trade3 capabilities:

- Named icon rendering through `IconName`.
- `label` input.
- `decorative` input.
- Width and height inputs.
- Host accessibility attributes.

Angular22 current state:

- Exists.
- Similar role and structure.

Migration tasks:

- Compare icon registry coverage between Trade3 and Angular22.
- Ensure all icons used by migrated components exist.
- Preserve decorative vs labelled behavior.
- Add tests for decorative icon, labelled icon, and custom sizing.

Done when:

- Component migrations do not need to invent ad hoc SVG/icon handling.

### ui-input

Trade3 source:

- `ui-input/ui-input.ts`
- `ui-input/ui-input.html`
- `ui-input/ui-input.css`
- `ui-input/ui-input-directive.ts`

Trade3 capabilities:

- Full input wrapper.
- Separate directive for native `input[uiInput]`, `textarea[uiInput]`.
- Label, field state, loading, error visibility.
- Integrates with forms signal `Field`.

Angular22 current state:

- Exists.
- Includes `ui-input-error`.
- Uses simpler input API with `label`, `placeholder`, `showError`.
- Used by `select` and `autocomplete`.

Migration tasks:

- Decide whether Angular22 keeps both wrapper component and native directive.
- Add missing textarea/native input directive if still needed.
- Align error rendering with Angular22 form model.
- Add loading affordance if required by product flows.
- Add disabled, required, invalid, describedby, and help/error text behavior.
- Add tests for label association, error display, disabled state, value binding,
  and textarea/native directive if added.

Done when:

- `ui-select`, `ui-autocomplete`, and ordinary forms share one input foundation.

### ui-popup

Trade3 source:

- Not a standalone Trade3 primitive.
- Popup behavior is embedded in components, often through CDK Overlay.

Angular22 current state:

- Exists as `ui-popup/sync-popup.ts` and shared CSS.
- Central to the v2 native Popover strategy.

Migration tasks:

- Treat `ui-popup` as a foundational internal primitive.
- Keep it small.
- Add shared CSS for popup animation, layering, anchor positioning, max-height,
  overflow, focus outline, and reduced motion.
- Avoid turning it into a heavy overlay service.
- Add tests around `syncPopup()` behavior if practical.

Done when:

- Select, autocomplete, menu, tooltip, and popover use consistent popup behavior.

### ui-popover

Trade3 source:

- No direct equivalent as a generic primitive.
- Similar behavior appears in tooltip/select/menu/dialog-like surfaces.

Angular22 current state:

- Exists.
- Directive with `uiContent`, `uiTrigger`, `uiPlacement`, `uiPanelId`, `uiRole`,
  `uiMaxWidth`, `uiOverlayClickable`, `uiDescribedby`, controlled `uiVisible`,
  and `uiVisibleChange`.
- Uses dynamic panel component attached to `document.body`.
- Uses Popover API and CSS anchor name.

Migration tasks:

- Keep as generic primitive for non-modal floating content.
- Add placement options beyond `top` and `bottom` if product needs them.
- Validate controlled/uncontrolled behavior.
- Add hover delay only if needed by real use cases.
- Add tests for click trigger, hover trigger, controlled visibility, outside
  pointer closing, escape closing, describedby, and max width.

Done when:

- Other components can reuse the pattern instead of re-implementing body-mounted
  popovers.

### ui-tooltip

Trade3 source:

- `ui-tooltip/ui-tooltip.ts`
- `ui-tooltip/ui-tooltip.type.ts`

Trade3 capabilities:

- Directive selector `[uiTooltip]`.
- Text tooltip.
- Position input.
- Touch gesture handling.
- Show/hide delays.
- Screen-reader description node.
- Uses native Popover API with `popover="hint"`.

Angular22 current state:

- Exists.
- Simpler native popover tooltip with dynamic panel.
- No position/touch delay parity yet.

Migration tasks:

- Add placement support if product still requires it.
- Add show/hide delays if needed.
- Add touch long-press behavior if mobile/tablet use matters.
- Preserve accessible description behavior.
- Ensure tooltip content never appears for empty text.
- Add tests for hover, focus, escape, empty text, text update, destroy cleanup,
  and aria-describedby.

Done when:

- Angular22 tooltip is at least as accessible as Trade3 and keeps less JS where
  possible.

### ui-menu

Trade3 source:

- `ui-menu/ui-menu.ts`
- `ui-menu/ui-menu.html`
- `ui-menu/ui-menu.css`
- `ui-menu/ui-menu-item/*`
- `ui-menu/ui-menu-group/*`

Trade3 capabilities:

- Menu surface.
- Menu items.
- Menu groups.
- Optional dividers.
- Product-specific layout/styling.

Angular22 current state:

- Exists.
- Includes `ui-menu`, `ui-menu-item`, `ui-menu-trigger`.
- Uses `@angular/aria/menu`.
- Trigger assigns CSS anchor name to menu element.

Migration tasks:

- Compare group and divider behavior with Trade3.
- Add missing group component if Angular22 does not have parity.
- Ensure disabled item behavior matches keyboard and pointer expectations.
- Ensure menu closes on item activation where appropriate.
- Add support for icons, shortcuts, destructive items, and selected/checkable items
  only if product screens use them.
- Add tests for trigger, keyboard navigation, disabled items, outside close,
  escape close, item activation, group rendering.

Done when:

- Product dropdown/action menus can move from Trade3 to Angular22 without custom
  one-off logic.

### ui-select

Trade3 source:

- `ui-select/ui-select.ts`
- `ui-select/ui-select.html`
- `ui-select/ui-select.css`
- `ui-select/ui-select-option/*`
- `ui-select/ui-select-group/*`

Trade3 capabilities:

- Single select.
- Required `id`.
- Optional `label`, `size`, `placeholder`.
- Empty option label.
- Empty message.
- Loading state.
- Icon.
- Divider option.
- `valueChange`.
- Required `formField: Field<string>`.
- Groups and options.
- Uses `@angular/aria` combobox/listbox.
- Uses CDK connected overlay.

Angular22 current state:

- Exists.
- Uses `FormValueControl<UiSelectValue>`.
- Supports single and multi value.
- Uses `@angular/aria` combobox/listbox.
- Uses native popover sync.
- Has `label`, `multi`, `placeholder`, `showError`, `touch`.

Migration tasks:

- Decide final form integration:
  - Keep `FormValueControl` for reusable v2 foundation.
  - Provide adapters or examples for forms signal `Field<T>` usage if needed.
- Add missing `size` if product needs multiple sizes.
- Add loading state.
- Add empty message.
- Add optional empty value behavior.
- Add icon support if still useful.
- Add grouped option parity.
- Add divider support only if needed.
- Confirm multi-select UX and whether Trade3 product needs it.
- Ensure popup placement and max height are CSS-anchor based.
- Add tests for single select, multi select, groups, empty option, empty message,
  loading, disabled, keyboard navigation, form touch, reset, and popup close.

Done when:

- Angular22 select replaces Trade3 select in forms without losing product behavior.

### ui-autocomplete

Trade3 source:

- `ui-autocomplete/ui-autocomplete.ts`
- `ui-autocomplete/ui-autocomplete.html`
- `ui-autocomplete-option/*`

Trade3 capabilities:

- Required `id`.
- Optional `label`, `placeholder`, `icon`.
- Loading state.
- Empty text.
- Required `formField: Field<string>`.
- Emits `selected`.
- Emits `queryChange`.
- Uses `@angular/aria` combobox/listbox.
- Uses CDK connected overlay.
- Designed for async/product search.

Angular22 current state:

- Exists.
- Uses `FormValueControl<string>`.
- Has local filtering and inline suggestion.
- Uses native popover sync.

Migration tasks:

- Preserve async search use case from Trade3.
- Add loading state.
- Add query change output or equivalent.
- Keep inline suggestion if it improves UX and does not conflict with async search.
- Add option for local filtering vs externally filtered options.
- Add empty state parity.
- Add icon support if needed.
- Add tests for query typing, inline suggestion, selecting option, async/loading
  state, empty state, keyboard navigation, reset, popup close.

Done when:

- Trade3 autocomplete usage can migrate without losing async search behavior.

### ui-tab

Trade3 source:

- `ui-tab/ui-tab.ts`
- `ui-tab/ui-tab.html`
- `ui-tab/ui-tab.css`
- `ui-tab-item.*`

Trade3 capabilities:

- `appearance`: default/line.
- Horizontal/vertical orientation.
- Follow/explicit selection mode.
- Selected tab input and change output.
- Query param support.
- Preserve content option.
- Fluid layout.
- Icons through `UiIcon`.
- Uses `@angular/aria/tabs`.

Angular22 current state:

- Exists.
- Uses `@angular/aria/tabs`.
- Has controlled/uncontrolled behavior.
- Has query param support.
- Has overflow tracking and scroll selected tab into view.
- Has `appearance`, `orientation`, `selectionMode`, `preserveContent`, `fluid`,
  `aria-label`, `aria-labelledby`.

Migration tasks:

- Compare naming: `queryParamKey` vs Trade3 query param API.
- Preserve icon support if product tabs use icons.
- Confirm default `preserveContent` value.
- Keep overflow affordances from Angular22.
- Add missing appearance variants if needed.
- Add tests for default selected tab, disabled tab, controlled selected tab,
  query param, overflow behavior, vertical orientation, preserve content.

Done when:

- Angular22 tabs are the source of truth and Trade3 tab behavior is fully covered.

### ui-checkbox

Trade3 source:

- `ui-checkbox/ui-checkbox.ts`
- `ui-checkbox/ui-checkbox.html`
- `ui-checkbox/ui-checkbox.css`

Trade3 capabilities:

- Form checkbox component.
- Product styling.
- Label/error layout.

Angular22 current state:

- Missing.

Migration tasks:

- Build on native `<input type="checkbox">`.
- Prefer CSS for checked/unchecked/indeterminate visuals.
- Support label, disabled, required, invalid, describedby, and form integration.
- Decide whether to support indeterminate.
- Add visible focus state.
- Add tests for checked binding, disabled, label click, keyboard space, required,
  indeterminate if supported, and error description.

Done when:

- Trade3 checkbox usages can migrate with native semantics preserved.

### ui-radio

Trade3 source:

- `ui-radio/ui-radio-group.*`
- `ui-radio/ui-radio-item.*`

Trade3 capabilities:

- Radio group and items.
- Disabled state.
- Product layout.

Angular22 current state:

- Missing.

Migration tasks:

- Build on native radio inputs or `@angular/aria` if custom roving behavior is
  needed.
- Support group label, disabled group, disabled item, required, invalid, and
  describedby.
- Support vertical and horizontal layout if product uses both.
- Add tests for selection, keyboard arrows, label click, disabled item/group,
  required and error state.

Done when:

- Radio groups work without custom per-screen code.

### ui-switch

Trade3 source:

- `ui-switch/ui-switch.ts`
- `ui-switch/ui-switch.html`
- `ui-switch/ui-switch.css`

Trade3 capabilities:

- Switch control.
- Disabled state.
- Product styling.

Angular22 current state:

- Missing.

Migration tasks:

- Use native checkbox semantics with switch styling, or `role="switch"` only when
  native semantics need enhancement.
- Support checked, disabled, label, description, invalid if needed.
- Add reduced-motion friendly thumb animation.
- Add tests for checked state, keyboard space, disabled, label click, and
  accessible role/state.

Done when:

- Product toggles can migrate from Trade3 without losing semantics.

### ui-select-native

Trade3 source:

- `ui-select-native/*`

Trade3 capabilities:

- Native select wrapper.
- Option and group components.
- Empty label/message.
- Loading.

Angular22 current state:

- Missing.

Migration tasks:

- Decide whether native select is still required in v2.
- If required, implement separately from custom `ui-select`.
- Use real `<select>`, `<option>`, `<optgroup>` where possible.
- Keep API minimal.
- Add tests for selection, disabled options, optgroups, placeholder/empty value,
  required and invalid states.

Done when:

- Screens that need native select behavior do not use custom combobox unnecessarily.

### ui-dialog

Trade3 source:

- `ui-dialog/ui-dialog.ts`
- `ui-dialog/ui-dialog.html`
- `ui-dialog/ui-dialog.css`

Trade3 capabilities:

- Declarative dialog component.
- `id`, `title`, `caption`, `role`, `size`, `ariaDescribedBy`.
- Close label and close output.
- Drag-drop dependency.
- Uses `UiButton` and `UiTooltip`.

Angular22 current state:

- Missing.

Migration tasks:

- Decide whether v2 dialog should be:
  - declarative component only,
  - programmatic service only,
  - both, with shared dialog container.
- Prefer native `<dialog>` only if it satisfies styling, focus, backdrop, nesting,
  and product needs.
- Otherwise use a small body-mounted Angular component with modal semantics.
- Implement focus management, escape close, backdrop click policy, labelledby,
  describedby, initial focus, restore focus, scroll lock.
- Use `destructive` naming for destructive actions.
- Add tests for open/close, role, labels, escape, backdrop, focus restore,
  close action, sizes.

Done when:

- Product modal workflows can migrate safely.

### ui-dialog-confirm

Trade3 source:

- `ui-dialog-confirm/*`

Trade3 capabilities:

- Confirmation dialog built on top of dialog.
- Type definitions for confirm options.
- Product-specific action layout.

Angular22 current state:

- Missing.

Migration tasks:

- Build after `ui-dialog`.
- Keep confirm as a small composition layer, not a separate modal implementation.
- Support title, message/body, confirm/cancel labels, destructive variant,
  loading/disabled states.
- Add tests for confirm, cancel, destructive action, close behavior, keyboard.

Done when:

- Delete/confirm workflows use one consistent confirmation API.

### ui-drawer

Trade3 source:

- `ui-drawer/*`

Trade3 capabilities:

- Drawer/sheet surface.
- Open/close outputs.
- Product CSS.

Angular22 current state:

- Missing.

Migration tasks:

- Build after shared modal/surface decisions.
- Decide placement support: right, left, bottom, top.
- Support modal and non-modal if product needs both.
- Implement focus management for modal drawers.
- Add responsive sizing.
- Add tests for placement, escape close, backdrop close, focus restore, open/close.

Done when:

- Product side panels can move from Trade3.

### ui-loading

Trade3 source:

- `ui-loading/ui-loading.ts`
- `ui-loading/ui-loading.html`

Trade3 capabilities:

- Simple loading indicator.
- Width and height inputs.

Angular22 current state:

- Missing.

Migration tasks:

- Decide whether loading is standalone or only part of button/input states.
- If standalone, keep it tiny.
- Provide accessible label strategy for meaningful loading states.
- Respect reduced motion.
- Add tests for sizing and aria behavior.

Done when:

- Components no longer duplicate loading spinner markup.

### ui-badge

Trade3 source:

- `ui-badge/*`

Trade3 capabilities:

- Variants and rounded mode.
- Product status styling.

Angular22 current state:

- Missing.

Migration tasks:

- Implement as presentational component.
- Normalize variant names:
  - use `destructive` for destructive/error semantics,
  - avoid color-name variants where semantic names work better.
- Support sizes only if needed.
- Add tests for variants and host attributes/classes.

Done when:

- Status labels from Trade3 screens can migrate.

### ui-chip

Trade3 source:

- `ui-chip/*`

Trade3 capabilities:

- Chip with variants.
- Rounded mode.
- Optional close button.
- Close button label.

Angular22 current state:

- Missing.

Migration tasks:

- Implement as token/chip component.
- Ensure close button has accessible name.
- Support keyboard focus on close button.
- Add tests for removable chip, close output, disabled if needed, variants.

Done when:

- Filters/tags/status chips can migrate.

### ui-sonner

Trade3 source:

- `ui-sonner/*`
- `ui-sonner/components/ui-sonner-toast/*`
- `sonner.service.ts`

Trade3 capabilities:

- Toast service.
- Toast container.
- Toast item component.
- Duration and type definitions.

Angular22 current state:

- Missing.

Migration tasks:

- Decide whether to keep `sonner` naming or rename to `toast`.
- Build on a small service plus container component.
- Support toast types, duration, dismiss, action, pause on hover/focus if needed.
- Ensure live region behavior is correct.
- Avoid overusing toast for critical errors.
- Add tests for service queue, auto dismiss, manual dismiss, live region, action.

Done when:

- Product notifications migrate from Trade3.

### ui-card

Trade3 source:

- `ui-card/*`

Trade3 capabilities:

- Presentational container.
- Variant input.

Angular22 current state:

- Exists.

Migration tasks:

- Compare Trade3 card variant support with Angular22.
- Keep simple; do not create card-within-card patterns.
- Add tests only if card has meaningful variant behavior.

Done when:

- Angular22 card covers all product card layouts or product screens use plain
  layout instead where card abstraction is unnecessary.

### ui-avatar

Trade3 source:

- `ui-avatar/*`

Trade3 capabilities:

- Avatar display.
- Computed fallback likely from name/initials.
- Product sizing/styling.

Angular22 current state:

- Missing.

Migration tasks:

- Support image URL, alt text, fallback text/initials.
- Handle image loading failure.
- Support sizes if product uses them.
- Ensure decorative vs meaningful avatar semantics are clear.
- Add tests for image, fallback, alt, broken image fallback.

Done when:

- User/entity avatars migrate without custom markup.

### ui-icon-container

Trade3 source:

- `ui-icon-container/*`

Trade3 capabilities:

- Icon wrapper with variant, size, rounded, label/decorative behavior.

Angular22 current state:

- Missing.

Migration tasks:

- Decide whether this remains separate from `ui-icon`.
- If kept, implement as presentational wrapper for icon backgrounds.
- Support accessible label only when the container itself conveys meaning.
- Add tests for decorative vs labelled modes and variants.

Done when:

- Screens do not repeat icon badge/container CSS manually.

### ui-list

Trade3 source:

- `ui-list/*`

Trade3 capabilities:

- List and list item components.
- Product list styling.

Angular22 current state:

- Missing.

Migration tasks:

- Decide if abstraction is needed or plain semantic lists are enough.
- If component is kept, preserve semantic `<ul>/<ol>/<li>` where possible.
- Support interactive list items only if behavior is explicitly defined.
- Add tests for semantic structure and disabled/interactive behavior if present.

Done when:

- Product list layouts have a consistent v2 path.

### ui-table

Trade3 source:

- `ui-table/*`
- `table-infinite-scroll.directive.ts`
- `ui-sortable-column.*`
- `ui-table-sort.*`

Trade3 capabilities:

- CDK table wrapper.
- Sortable columns.
- Infinite scroll directive.
- Sort UI component.
- Sticky positioning providers.

Angular22 current state:

- Missing.

Migration tasks:

- Decide whether v2 table should wrap CDK table or use native table patterns.
- Preserve semantic table markup.
- Migrate sortable column behavior.
- Separate visual table styling from data behavior.
- Add accessibility for sort state through `aria-sort`.
- Add tests for table styling, sortable headers, sort output, disabled sort,
  keyboard activation, infinite scroll if kept.

Done when:

- Existing Trade3 table screens can render with Angular22 table primitives.

### ui-table2

Trade3 source:

- `ui-table2/ui-table2.ts`
- `ui-table2/ui-table2.css`
- `ui-table2-row-action.ts`

Trade3 capabilities:

- Directive selector `table[uiTable2]`.
- Data source input.
- Optional virtual scroll.
- Item size and preload rows.
- Scroll height.
- Emits `scrolledNearEnd`.
- Row action directive.
- Manages scroll wrapper dynamically.

Angular22 current state:

- Missing.

Migration tasks:

- Treat separately from simple `ui-table`.
- Validate whether virtual scroll belongs in UI component or feature code.
- If kept, reduce JS where possible but keep correctness for large data.
- Preserve `scrolledNearEnd`.
- Revisit dynamic wrapper creation; prefer explicit markup if it improves clarity.
- Add tests for non-virtual render, virtual render range, spacer heights,
  near-end emit, scrollTo, row action disabled behavior.

Done when:

- Data-heavy production tables can migrate without performance regression.

### ui-tree

Trade3 source:

- `ui-tree/*`

Trade3 capabilities:

- Tree data and types.
- Expanded/collapsed model.
- Product styling.

Angular22 current state:

- Missing.

Migration tasks:

- Decide if tree is product-specific or generic.
- Define keyboard model:
  - arrow navigation,
  - expand/collapse,
  - home/end,
  - focus management.
- Use correct tree roles if custom tree is required.
- Add tests for expand/collapse, selection if supported, keyboard navigation,
  disabled nodes if supported.

Done when:

- Tree is accessible, not just visually nested.

### ui-datepicker

Trade3 source:

- `ui-datepicker/*`
- `calendar.utils.ts`

Trade3 capabilities:

- Date picker.
- Calendar utilities.
- Placeholder.
- Loading.
- Product CSS.

Angular22 current state:

- Missing.

Migration tasks:

- Build after popup, input, button, icon, and form controls are stable.
- Extract calendar primitive first.
- Define date type and formatting/parsing strategy.
- Support keyboard calendar navigation.
- Support min/max/disabled dates if product needs them.
- Use native popover for calendar surface if feasible.
- Add tests for date selection, keyboard navigation, disabled dates, formatting,
  parsing, close behavior.

Done when:

- Single-date product filters/forms migrate safely.

### ui-date-range-picker

Trade3 source:

- `ui-date-range-picker/*`
- `range-calendar.utils.ts`

Trade3 capabilities:

- Date range picker.
- Range calendar utilities.
- Placeholder.
- Loading.
- Product CSS.

Angular22 current state:

- Missing.

Migration tasks:

- Build after `ui-datepicker` or shared calendar primitive.
- Define range model clearly.
- Support partial range selection.
- Support hover preview if product needs it.
- Support keyboard range selection.
- Support clear/reset.
- Add tests for start/end selection, reversed selection, partial range, disabled
  dates, keyboard behavior, clear/reset, close behavior.

Done when:

- Date range filters from Trade3 can migrate.

### ui-barcode

Trade3 source:

- `ui-barcode/*`
- `barcode.utils.ts`
- `barcode.utils.spec.ts`

Trade3 capabilities:

- Barcode rendering.
- Width and height.
- Optional text.
- Utility tests.

Angular22 current state:

- Missing.

Migration tasks:

- Keep as domain/utility component.
- Port utility tests.
- Ensure output is accessible: provide text alternative or label.
- Confirm rendering approach remains appropriate.
- Add component tests for width, height, value, showText.

Done when:

- Product barcode use cases migrate without changing feature code.

## Suggested Migration Order

### Phase 1: Stabilize Existing Angular22 Foundation

- [ ] `ui-button`
- [ ] `ui-icon`
- [ ] `ui-input`
- [ ] `ui-popup`
- [ ] `ui-popover`
- [ ] `ui-tooltip`
- [ ] `ui-menu`
- [ ] `ui-select`
- [ ] `ui-autocomplete`
- [ ] `ui-tab`

Outcome:

- Angular22 has stable primitives.
- Native popup/anchor pattern is proven.
- Tests cover the core interactive behavior.

### Phase 2: Add Basic Form Controls

- [ ] `ui-checkbox`
- [ ] `ui-radio`
- [ ] `ui-switch`
- [ ] `ui-select-native`

Outcome:

- Angular22 can support real forms without falling back to Trade3.

### Phase 3: Add Surfaces

- [ ] `ui-dialog`
- [ ] `ui-dialog-confirm`
- [ ] `ui-drawer`

Outcome:

- Angular22 can support modal and sheet workflows.

### Phase 4: Add Feedback And Status Components

- [ ] `ui-loading`
- [ ] `ui-badge`
- [ ] `ui-chip`
- [ ] `ui-avatar`
- [ ] `ui-icon-container`
- [ ] `ui-sonner`

Outcome:

- Common product feedback states are covered.

### Phase 5: Add Data Display

- [ ] `ui-list`
- [ ] `ui-table`
- [ ] `ui-table2`
- [ ] `ui-tree`

Outcome:

- Product data screens can migrate.

### Phase 6: Add Date Components

- [ ] `ui-datepicker`
- [ ] `ui-date-range-picker`

Outcome:

- Product filters and date forms can migrate.

### Phase 7: Add Domain Components

- [ ] `ui-barcode`

Outcome:

- Remaining domain-specific UI is covered.

## Per-Component TODO Index

Use this as the migration board.

| Status | Component | Priority | Notes |
|---|---|---:|---|
| In progress | `ui-button` | P0 | Exists in Angular22; needs Trade3 API parity review. |
| In progress | `ui-icon` | P0 | Exists in Angular22; compare icon data coverage. |
| In progress | `ui-input` | P0 | Exists in Angular22; needs native directive/error parity review. |
| In progress | `ui-popup` | P0 | Exists only in Angular22; foundation primitive. |
| In progress | `ui-popover` | P0 | Exists only in Angular22; should remain generic primitive. |
| In progress | `ui-tooltip` | P0 | Exists in Angular22; needs delay/placement/touch parity review. |
| In progress | `ui-menu` | P0 | Exists in Angular22; needs group/divider/product parity. |
| In progress | `ui-select` | P0 | Exists in Angular22; needs loading/empty/icon/group parity. |
| In progress | `ui-autocomplete` | P0 | Exists in Angular22; needs async search parity. |
| In progress | `ui-tab` | P0 | Exists in Angular22; likely best v2 implementation base. |
| Missing | `ui-checkbox` | P1 | Build native-first. |
| Missing | `ui-radio` | P1 | Build group/item pair. |
| Missing | `ui-switch` | P1 | Native checkbox semantics with switch styling. |
| Missing | `ui-select-native` | P1 | Decide if still needed. |
| Missing | `ui-dialog` | P1 | Requires modal/focus strategy. |
| Missing | `ui-dialog-confirm` | P1 | Build on dialog. |
| Missing | `ui-drawer` | P1 | Build on surface/modal strategy. |
| Missing | `ui-loading` | P1 | Small shared spinner/loading indicator. |
| Missing | `ui-badge` | P1 | Presentational status component. |
| Missing | `ui-chip` | P1 | Presentational/removable token component. |
| Missing | `ui-sonner` | P1 | Toast service/container. |
| Missing | `ui-list` | P2 | Validate abstraction need. |
| Missing | `ui-table` | P2 | Table styling + sorting. |
| Missing | `ui-table2` | P2 | Virtual/infinite table behavior. |
| Missing | `ui-tree` | P2 | Needs full accessibility plan. |
| Missing | `ui-datepicker` | P2 | Build after popup/input foundation. |
| Missing | `ui-date-range-picker` | P2 | Build after calendar primitive. |
| Missing | `ui-avatar` | P3 | Presentational entity identity component. |
| Missing | `ui-icon-container` | P3 | Presentational icon wrapper. |
| Missing | `ui-card` | P3 | Exists in Angular22; parity review only. |
| Missing | `ui-barcode` | P3 | Domain utility component. |

## Definition Of Done For Angular22 UI Production Readiness

- [ ] All P0 components have parity with Trade3 where needed.
- [ ] All P1 components are implemented and tested.
- [ ] Product screens can use Angular22 components without importing Trade3 UI.
- [ ] Interactive components have keyboard and screen-reader tests where practical.
- [ ] Popup components use native Popover/CSS Anchor Positioning unless there is a
  documented reason not to.
- [ ] Destructive variants use `destructive`, not `red` or `error`.
- [ ] Components use external templates.
- [ ] One Angular declaration per file.
- [ ] Component folders follow the root/secondary component structure.
- [ ] No component grows into a large multi-purpose file without being split.

