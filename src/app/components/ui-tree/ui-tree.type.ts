import { IconName } from '../ui-icon/data';

/**
 * A single node in a {@link UiTree}. The data is plain and recursive: the tree
 * renders it through a self-referencing template, so depth is unbounded.
 *
 * `expanded` is intentionally mutable — the component writes the user's
 * collapse/expand state straight back onto the node via `(expandedChange)`,
 * which keeps the caller's array as the single source of truth without an extra
 * map of open ids to maintain.
 */
export interface UiTreeItem {
  /** Stable identity. Used both for `@for` tracking and as the selection value. */
  id: string;
  /** Visible text and the accessible name / typeahead term for the row. */
  label: string;

  /** Child nodes. Absent or empty marks a leaf (no twisty, no group). */
  children?: UiTreeItem[];
  /** Whether the node starts expanded; mutated as the user toggles it. */
  expanded?: boolean;

  /** Optional leading glyph shown before the label. */
  icon?: IconName;
  /** Non-interactive, dimmed, and skipped by keyboard navigation. */
  disabled?: boolean;
  /** Whether the row can be selected. Defaults to `true`. */
  selectable?: boolean;
}
