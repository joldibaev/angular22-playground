import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  contentChildren,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@angular/aria/menu';
import { syncPopover } from '../../shared/sync-popover';
import { nextId } from '../../shared/unique-id';
import { UiMenuGroup } from '../ui-menu/ui-menu-group/ui-menu-group';
import { UiMenuItem } from '../ui-menu/ui-menu-item/ui-menu-item';

type UiContextMenuSection = {
  readonly group?: UiMenuGroup;
  readonly items: readonly UiMenuItem[];
};

type UiContextMenuDeclaration = { readonly group: UiMenuGroup } | { readonly item: UiMenuItem };

export interface UiContextMenuSelection<T> {
  readonly value: string;
  readonly context: T;
}

const DOCUMENT_POSITION_FOLLOWING = 4;

@Component({
  selector: 'ui-context-menu',
  imports: [Menu, MenuContent, MenuItem, MenuTrigger, NgTemplateOutlet],
  templateUrl: './ui-context-menu.html',
  styleUrls: ['../../shared/ui-popup.css', '../ui-menu/ui-menu.css', './ui-context-menu.css'],
})
export class UiContextMenu<T = unknown> {
  readonly menu = viewChild<Menu<string>>('menuPanel');
  readonly trigger = viewChild.required<MenuTrigger<string>>('contextTrigger');
  readonly items = contentChildren(UiMenuItem, { descendants: true });
  readonly groups = contentChildren(UiMenuGroup);
  readonly context = signal<T | undefined>(undefined);
  readonly itemSelected = output<UiContextMenuSelection<T>>();

  protected readonly originId = `ui-context-menu-origin-${nextId()}`;
  protected readonly anchorName = `--${this.originId}`;
  protected readonly position = signal({ x: 0, y: 0 });
  private returnFocusTo: HTMLElement | undefined;
  protected readonly sections = computed<UiContextMenuSection[]>(() => {
    const groups = this.groups();
    const groupedItems = new Set(groups.flatMap((group) => group.items()));
    const declarations: UiContextMenuDeclaration[] = [
      ...groups.filter((group) => group.items().length > 0).map((group) => ({ group }) as const),
      ...this.items()
        .filter((item) => !groupedItems.has(item))
        .map((item) => ({ item }) as const),
    ].sort(compareDeclarations);
    const sections: UiContextMenuSection[] = [];

    for (const declaration of declarations) {
      if ('group' in declaration) {
        sections.push({ group: declaration.group, items: declaration.group.items() });
        continue;
      }

      const previous = sections.at(-1);

      if (previous && !previous.group) {
        sections[sections.length - 1] = { items: [...previous.items, declaration.item] };
      } else {
        sections.push({ items: [declaration.item] });
      }
    }

    return sections;
  });

  constructor() {
    afterRenderEffect(() => {
      const menu = this.menu();
      syncPopover(menu?.element, menu?.visible() ?? false);
    });
  }

  openAt(x: number, y: number, context: T, returnFocusTo?: HTMLElement): void {
    this.position.set({ x, y });
    this.context.set(context);
    this.returnFocusTo = returnFocusTo;
    this.trigger().open();
  }

  close(): void {
    this.trigger().close();
  }

  protected onItemSelected(value: string): void {
    const context = this.context();

    if (context !== undefined) {
      this.itemSelected.emit({ value, context });
    }

    queueMicrotask(() => this.trigger().close());
  }

  protected onPopoverToggle(event: ToggleEvent): void {
    if (event.newState === 'closed') {
      this.trigger().close();
      this.returnFocusTo?.focus({ preventScroll: true });
      this.returnFocusTo = undefined;
    }
  }
}

function compareDeclarations(
  first: UiContextMenuDeclaration,
  second: UiContextMenuDeclaration,
): number {
  const firstElement = ('group' in first ? first.group : first.item).element.nativeElement;
  const secondElement = ('group' in second ? second.group : second.item).element.nativeElement;
  const position = firstElement.compareDocumentPosition(secondElement);

  return position & DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
