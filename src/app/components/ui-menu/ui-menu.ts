import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  contentChildren,
  output,
  viewChild,
} from '@angular/core';
import { Menu, MenuContent, MenuItem } from '@angular/aria/menu';
import { UiMenuGroup } from './ui-menu-group/ui-menu-group';
import { UiMenuItem } from './ui-menu-item/ui-menu-item';
import { syncPopover } from '../../shared/sync-popover';

type UiMenuSection = {
  readonly group?: UiMenuGroup;
  readonly items: readonly UiMenuItem[];
};

type UiMenuDeclaration = { readonly group: UiMenuGroup } | { readonly item: UiMenuItem };

const DOCUMENT_POSITION_FOLLOWING = 4;

@Component({
  selector: 'ui-menu',
  imports: [NgTemplateOutlet, Menu, MenuContent, MenuItem],
  templateUrl: './ui-menu.html',
  styleUrls: ['../../shared/ui-popup.css', './ui-menu.css'],
})
export class UiMenu {
  readonly menu = viewChild<Menu<string>>('menuPanel');
  readonly items = contentChildren(UiMenuItem, { descendants: true });
  readonly groups = contentChildren(UiMenuGroup);

  // Groups and direct items come from separate content queries; sorting their hidden declaration
  // elements preserves the author's mixed DOM order without adding registration state.
  readonly sections = computed<UiMenuSection[]>(() => {
    const groups = this.groups();
    const groupedItems = new Set(groups.flatMap((group) => group.items()));
    const declarations: UiMenuDeclaration[] = [
      ...groups.filter((group) => group.items().length > 0).map((group) => ({ group }) as const),
      ...this.items()
        .filter((item) => !groupedItems.has(item))
        .map((item) => ({ item }) as const),
    ].sort(compareDeclarations);
    const sections: UiMenuSection[] = [];

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

  itemSelected = output<string>();

  constructor() {
    afterRenderEffect(() => {
      const menu = this.menu();
      syncPopover(menu?.element, menu?.visible() ?? false);
    });
  }

  onItemSelected(value: string) {
    this.itemSelected.emit(value);
    queueMicrotask(() => this.menu()?.parent()?.close());
  }

  onPopoverToggle(event: ToggleEvent) {
    if (event.newState === 'closed') {
      this.menu()?.parent()?.close();
    }
  }
}

function compareDeclarations(first: UiMenuDeclaration, second: UiMenuDeclaration): number {
  const firstElement = ('group' in first ? first.group : first.item).element.nativeElement;
  const secondElement = ('group' in second ? second.group : second.item).element.nativeElement;
  const position = firstElement.compareDocumentPosition(secondElement);

  return position & DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
