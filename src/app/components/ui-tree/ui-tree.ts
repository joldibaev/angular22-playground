import { UiIcon } from '../ui-icon/ui-icon';
import { UiTreeItem } from './ui-tree.type';
import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, input, model } from '@angular/core';

/**
 * Accessible, expandable tree built on the headless `@angular/aria` tree
 * primitives — they own the roles, roving focus, typeahead, and keyboard model,
 * so this component only contributes data binding and presentation.
 *
 * The hierarchy is rendered by a single self-referencing template
 * (`#nodeList`) instead of a recursive component: one template instance per
 * level keeps change detection cheap and avoids a wrapper component around
 * every node. Group content is deferred by `ngTreeItemGroup`, so collapsed
 * branches never enter the DOM until they are first opened.
 */
@Component({
  selector: 'ui-tree',
  imports: [NgTemplateOutlet, Tree, TreeItem, TreeItemGroup, UiIcon],
  templateUrl: './ui-tree.html',
  styleUrl: './ui-tree.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-tree-flush]': '!withGuides()',
  },
})
export class UiTree {
  readonly items = input.required<UiTreeItem[]>();

  /** Selected node ids. Two-way bound to the tree's value model. */
  readonly selected = model<string[]>([]);

  /**
   * Accessible name for the tree. Aliased to the native `aria-label` /
   * `aria-labelledby` so callers label `<ui-tree>` as they would any element;
   * the component forwards it to the inner element that actually owns the
   * `role="tree"`, where the screen reader expects to find the name.
   */
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | undefined>(undefined, { alias: 'aria-labelledby' });

  /** Allow more than one node to be selected at once. */
  readonly multi = input(false, { transform: booleanAttribute });

  /**
   * Navigation mode: the active row is marked with `aria-current="page"` rather
   * than `aria-selected`, matching a sidebar/file-explorer that drives routing.
   */
  readonly nav = input(false, { transform: booleanAttribute });

  /** Draw the connector guide lines linking children to their parent. */
  readonly withGuides = input(true, { transform: booleanAttribute });
}
