# UI component audit backlog

This file records audit findings for later, selective review. An entry is not automatically a bug
or an instruction to change the code. Each item is labelled so a future session can distinguish a
reproducible correctness problem from an API/design choice.

Labels:

- **Bug** — current behaviour can produce an incorrect or inaccessible result.
- **Review** — a design/API decision worth reconsidering; keeping the current approach may be valid.
- **Consistency** — differs from conventions already established in `AGENTS.md`.
- **Tests** — missing deterministic coverage; not evidence that production behaviour is broken.

## ui-datepicker

### Review SSR-safe date initialization

**Label:** Bug candidate

The component initializes `view` and `today` from the ambient current date while the closed calendar
panel is still rendered. During SSR, the server and browser can disagree around midnight or when
their time zones differ, producing different month/day markup during hydration.

Relevant code:

- `ui-datepicker.ts`: `view = signal(monthFromDate(new Date()))`
- `ui-datepicker.ts`: `today = todayInputValue()`

Possible fixes:

- initialize the calendar view only when the picker opens; or
- inject a clock/date provider whose value is transferred consistently from server to client.

Before changing it, confirm whether this application actually renders the component through SSR and
whether hydration currently reports a mismatch.

### Review locale and text configuration

**Label:** Review

Dates, weekday names, month names, button labels and accessible names are fixed to English/`en-US`.
This is acceptable for an English-only product, but it makes the component unsuitable as a general UI
library component.

Relevant code:

- `calendar.utils.ts`: fixed `Intl.DateTimeFormat('en-US', ...)`
- `WEEKDAYS_MON_FIRST`
- template strings `Previous month`, `Next month`, `Clear`, `Today`

If localization is required, prefer one component-level locale/text configuration contract over many
individual inputs.

## ui-date-range-picker

### Review SSR-safe date initialization

**Label:** Bug candidate

Same risk as `ui-datepicker`: `leftView`, `today`, and presets depend on the ambient `new Date()` while
the panel markup is rendered during SSR.

Possible fixes should be shared with `ui-datepicker` rather than introducing a second clock contract.

### Review locale and text configuration

**Label:** Review

The component contains fixed English date formatting and UI copy: presets, `Quick ranges`, `No range`,
`Range`, `Clear`, `Apply`, navigation labels, `From`, and `Until`.

If localization is needed, share the calendar locale contract with `ui-datepicker` and provide a
range-picker-specific text configuration for presets and actions.

## ui-input

### Gate validation presentation on user interaction

**Label:** Bug candidate / accessibility

`showErrorTooltip` currently depends on `withErrorMessage`, `invalid`, and available messages, but not
on touched/dirty/user-invalid state. A required field may therefore become visually invalid and expose
a `role="alert"` message before the user interacts with it.

The preferred behaviour should be decided for the whole form family:

- show errors only after blur/touch;
- clear them while the user corrects the value; and
- always show them after an attempted submit.

Avoid fixing only `ui-input`; checkbox, switch, and radio group use the same policy.

### Remove stale generated label references

**Label:** Bug candidate

`syncLabelledControl()` adds the generated label id to a projected control's `aria-labelledby`, but its
empty-label branch does not remove a previously added token. If `label` changes from a value to an empty
string at runtime, the control may retain a reference to a label element that no longer exists.

Add a regression spec before changing the synchronization logic.

## ui-checkbox

### Gate validation presentation on user interaction

**Label:** Bug candidate / accessibility

`createFieldMessages()` shows the error whenever `withErrorMessage && invalid`. Review together with
`ui-input`, `ui-switch`, and `ui-radio-group`; all controls should use one validation-timing policy.

### Replace fixed shadow colors

**Label:** Consistency

The check mark uses `rgb(15 23 42 / 0.18)` in a drop shadow. `AGENTS.md` requires themed colors to react
through `color-scheme`, tokens, `Canvas`/`CanvasText`, or `color-mix()`.

This is low priority unless the shadow looks wrong in a pinned component theme.

## ui-switch

### Gate validation presentation on user interaction

**Label:** Bug candidate / accessibility

Same shared validation-timing issue as `ui-input` and `ui-checkbox`.

### Replace fixed shadow colors

**Label:** Consistency

The thumb shadow uses fixed `rgb(15 23 42 / ...)` colors. Consider deriving it from `CanvasText` or a
shared shadow token so per-component light/dark scoping remains correct.

## ui-radio / ui-radio-group

### Gate validation presentation on user interaction

**Label:** Bug candidate / accessibility

Same shared validation-timing issue as the other form controls.

### Review per-radio size override

**Label:** Review

The group owns a size while each `ui-radio` can override it. This is flexible, but mixed-size options
inside one group are usually undesirable. Consider whether `ui-radio.size` should remain public or
whether size should be owned exclusively by `ui-radio-group`.

### Replace fixed shadow colors

**Label:** Consistency

The control shadow uses fixed `rgb(15 23 42 / ...)` values instead of a theme-reactive token.

## ui-dialog

### Require an accessible name

**Label:** Bug candidate / accessibility

When `title` is empty, the native dialog receives no `aria-labelledby` and there is no alternative
`aria-label` API. Projected content may contain a heading, but the component cannot associate it with
the dialog automatically.

Possible contract:

- keep `title` optional for visually custom dialogs;
- add `ariaLabel`/`ariaLabelledBy`; and
- document that one naming mechanism is required.

Do not make the visible `title` unconditionally required; that would prevent legitimate custom headers.

## ui-drawer

### Require an accessible name

**Label:** Bug candidate / accessibility

Same naming gap as `ui-dialog`: an empty `title` produces an unnamed modal dialog. Add an alternative
accessible naming API if title-less custom headers are supported.

### Make the close label configurable

**Label:** Review / localization

The close button has a hardcoded `aria-label="Close"`, while `ui-dialog` already exposes `closeLabel`.
Aligning the two APIs would improve consistency and localization.

## ui-avatar

### Do not expose an unnamed image role

**Label:** Bug / accessibility

The host always has `role="img"`, but `aria-label` is removed when `name` is empty. The placeholder can
therefore appear in the accessibility tree as an unnamed image.

Suggested behaviour:

- when `name` is non-empty, expose `role="img"` and use it as the accessible name;
- when `name` is empty, make the avatar decorative with `aria-hidden="true"` and no image role.

## ui-tree

### Stop mutating the input item model

**Label:** Bug candidate / API design

The template handles expansion with `(expandedChange)="node.expanded = $event"`. This mutates objects
received through the required `items` input. It fails for frozen/readonly data and makes state ownership
unclear to consumers.

Possible alternatives:

- maintain an internal set of expanded ids;
- expose an `expanded` model; or
- emit an expansion event and require the consumer to update immutable data.

Choose the ownership model before implementing; each option produces a different public API.

## ui-tab

### Fall back when the query-param value is invalid

**Label:** Bug

When `queryParam` contains a truthy value that does not match an enabled tab, initialization returns
without selecting the first enabled tab. The component can render with no valid selection.

Expected policy to decide:

- select the first enabled tab while leaving the URL untouched; or
- select it and replace the invalid query-param value.

Add coverage for unknown, disabled, and removed tab values.

### Review duplicated interaction listeners

**Label:** Review

The tab list and every trigger listen to several overlapping pointer/click/keyboard events only to mark
that interaction occurred. Event bubbling may allow this to be reduced to one listener on the list.
This is cleanup rather than a functional problem; retain the current code if the duplication protects
against a specific `@angular/aria` event path.

## ui-badge

### Rename or remove the `default` variant

**Label:** Review / API clarity

The component now defaults to `secondary`, but `UiBadgeVariant` still contains a visually strong variant
named `default`. Consequently, `variant="default"` does not request the actual default appearance.

Options:

- rename it to `contrast`/`strong`; or
- remove it if no real badge use case needs the high-contrast surface.

This is not a rendering bug; it is a potentially misleading API name.

## ui-alert

### Define whether the component has live alert semantics

**Label:** Review

`ui-alert` currently provides only a styled surface and no role. That is correct for static content that
already exists when the page loads, but the component name may lead consumers to assume announcements
are handled automatically.

Decide and document one of these approaches:

- keep it purely presentational and explicitly say consumers own semantics; or
- add a narrowly typed semantic mode such as passive/status/alert.

Do not add `role="alert"` unconditionally: static alerts would then be needlessly announced.

## ui-card

### Review the persistent-surface token

**Label:** Consistency

The card uses `--background-color-surface`, while `AGENTS.md` says persistent solid panels should use
`--background-color-elevated`. Confirm whether `surface` is an intentional separate card role. If not,
align it with the documented contract.

### Add a component spec

**Label:** Tests

`ui-card` has no `.spec.ts`. A minimal spec should cover projected content, the default elevated variant,
and the outlined variant.

## ui-menu / ui-select / ui-autocomplete / ui-datepicker popup surfaces

### Review transient popup background

**Label:** Consistency

The shared `ui-popup.css` defaults `--ui-popup-background` to
`--background-color-elevated`. `AGENTS.md` specifies `Canvas` for transient overlays such as menus and
select popups.

Because this shared primitive affects several components at once, compare both themes before changing
it. This is a design-token contract mismatch, not proof of a visible defect.

## ui-tooltip

### Review tooltip surface role

**Label:** Consistency / visual review

The tooltip panel uses `CanvasText` as its background, producing an inverted dark/light tooltip. The
project convention says transient overlays use `Canvas` with a derived foreground.

Keeping the inverted tooltip may be an intentional visual distinction. Decide whether tooltip should be
an explicit exception before replacing its surface.

## ui-popover

### Narrow the role input

**Label:** Review / API safety

`uiRole` accepts any string. Invalid or incompatible roles can therefore be passed without type feedback.
Consider a small union of roles actually supported by the popover content, or remove the role API and
let projected content own semantics.

### Review `uiDescribedby` for rich content

**Label:** Review / accessibility

When enabled, the entire popover panel becomes the trigger's accessible description. This is useful for
plain explanatory text but unsuitable for rich or interactive content. Document the limitation or split
simple descriptions from interactive popovers.

## ui-sonner

### Handle multiple position groups in keyboard focus logic

**Label:** Bug candidate / accessibility

The template can render several `<ol #listRef>` groups, but the component reads one `viewChild`. The
hotkey therefore focuses only the resolved list, and Escape/focus restoration operates on that group.

Reproduce with simultaneous top and bottom toasts before changing it. If confirmed, use `viewChildren`
and define which group the hotkey should focus.

### Make the close label configurable

**Label:** Review / localization

Toast close buttons use a fixed `aria-label="Close toast"`. Add a shared configurable label only if the
library needs localization; avoid adding an input solely for theoretical flexibility.

### Synchronize delayed unmount with CSS motion

**Label:** Bug candidate / motion

`TIME_BEFORE_UNMOUNT = 200` is independent of the shared CSS duration tokens. A token change can remove
the toast before its exit finishes or retain it longer than necessary.

Prefer `transitionend` with a defensive fallback, or expose the resolved duration through a shared
contract. Verify the current token values before treating this as an active defect.

### Add a direct toast component spec

**Label:** Tests

`ui-sonner-toast` is covered indirectly by `ui-sonner` tests but has no colocated spec. Direct coverage
would be useful for timer pause/resume, dismissibility, keyboard dismissal, swipe threshold, actions,
and reduced deterministic DOM state.

## Component test coverage

### Review components without colocated specs

**Label:** Tests

The following Angular declarations do not have their own colocated `.spec.ts`:

- `ui-card`
- `ui-input-error`
- `ui-menu-trigger`
- `ui-popover-panel`
- `ui-radio` (covered through the group spec)
- `ui-sonner-toast`
- `ui-tab-item`
- `ui-tooltip-panel`

Some are already exercised indirectly by their parent component. Add separate specs only where the
declaration has meaningful independent behaviour; do not create repetitive tests merely to satisfy a
file-count rule.

## Components with no current audit action

No concrete issue was recorded for the following components after static review:

- `ui-barcode`
- `ui-button`
- `ui-chip`
- `ui-dialog-confirm`
- `ui-icon`
- `ui-loading`
- `ui-progress`
- `ui-skeleton`
- `ui-table`

This does not mean they are proven bug-free. The audit did not run the application, browser interaction,
build, linters, or tests, in accordance with the project instructions.
