import { Directive, effect, inject } from '@angular/core';
import { MenuTrigger } from '@angular/aria/menu';
import { nextId } from '../../../shared/unique-id';

@Directive({
  selector: 'button[uiMenuTrigger]',
  hostDirectives: [
    {
      directive: MenuTrigger,
      inputs: ['menu', 'disabled', 'softDisabled'],
    },
  ],
  host: {
    class: 'ui-menu-trigger',
    '[style.anchor-name]': 'anchorName',
  },
})
export class UiMenuTrigger {
  readonly anchorName = `--ui-menu-trigger-${nextId()}`;

  private readonly menuTrigger = inject<MenuTrigger<string>>(MenuTrigger);

  constructor() {
    effect((onCleanup) => {
      const menuElement = this.menuTrigger.menu()?.element;

      if (!menuElement) {
        return;
      }

      menuElement.style.setProperty('position-anchor', this.anchorName);

      onCleanup(() => {
        if (menuElement.style.getPropertyValue('position-anchor') === this.anchorName) {
          menuElement.style.removeProperty('position-anchor');
        }
      });
    });
  }
}
