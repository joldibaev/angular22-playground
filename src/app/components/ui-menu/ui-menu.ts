import { NgTemplateOutlet } from '@angular/common';
import { afterRenderEffect, Component, contentChildren, output, viewChild } from '@angular/core';
import { Menu, MenuContent, MenuItem } from '@angular/aria/menu';
import { UiMenuItem } from './ui-menu-item/ui-menu-item';
import { syncPopover } from '../ui-popover/sync-popover';

@Component({
  selector: 'ui-menu',
  imports: [NgTemplateOutlet, Menu, MenuContent, MenuItem],
  templateUrl: './ui-menu.html',
  styleUrls: ['../ui-popover/ui-popover.css', './ui-menu.css'],
})
export class UiMenu {
  readonly menu = viewChild<Menu<string>>('menuPanel');
  readonly items = contentChildren(UiMenuItem);

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
