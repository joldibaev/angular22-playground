import { NgTemplateOutlet } from '@angular/common';
import { afterRenderEffect, Component, contentChildren, output, viewChild } from '@angular/core';
import { Menu, MenuContent, MenuItem } from '@angular/aria/menu';
import { UiMenuItem } from './ui-menu-item/ui-menu-item';

@Component({
  selector: 'ui-menu',
  imports: [NgTemplateOutlet, Menu, MenuContent, MenuItem],
  templateUrl: './ui-menu.html',
  styleUrl: './ui-menu.css',
})
export class UiMenu {
  readonly menu = viewChild<Menu<string>>('menuPanel');
  readonly items = contentChildren(UiMenuItem);

  itemSelected = output<string>();

  constructor() {
    afterRenderEffect(() => {
      const menu = this.menu();
      this.syncPopover(menu?.element, menu?.visible() ?? false);
    });
  }

  onItemSelected(value: string) {
    this.itemSelected.emit(value);
    queueMicrotask(() => this.menu()?.parent()?.close());
  }

  onPopoverToggle(event: Event) {
    if ((event as { newState?: string }).newState === 'closed') {
      this.menu()?.parent()?.close();
    }
  }

  private syncPopover(element: HTMLElement | undefined, expanded: boolean) {
    if (!element || !('showPopover' in element) || !('hidePopover' in element)) {
      return;
    }

    if (expanded && !element.matches(':popover-open')) {
      element.showPopover();
    } else if (!expanded && element.matches(':popover-open')) {
      element.hidePopover();
    }
  }
}
