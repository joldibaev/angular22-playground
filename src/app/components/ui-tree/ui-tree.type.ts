import { IconName } from '../ui-icon/data';

/**
 * A single node in a {@link UiTree}. The data is plain and recursive: the tree
 * renders it through a self-referencing template, so depth is unbounded.
 *
 * `expanded` seeds initial state only. UiTree publishes later interaction
 * through its `expanded` model and never mutates the caller's objects.
 */
export interface UiTreeItem {
  /** Stable identity. Used both for `@for` tracking and as the selection value. */
  id: string;
  /** Visible text and the accessible name / typeahead term for the row. */
  label: string;

  /** Child nodes. Absent or empty marks a leaf (no twisty, no group). */
  children?: readonly UiTreeItem[];
  /** Whether the node starts expanded when no explicit expanded model is bound. */
  expanded?: boolean;

  /** Optional leading glyph shown before the label. */
  icon?: IconName;
  /** Non-interactive, dimmed, and skipped by keyboard navigation. */
  disabled?: boolean;
  /** Whether the row can be selected. Defaults to `true`. */
  selectable?: boolean;
}
