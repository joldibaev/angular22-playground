import { Directive } from '@angular/core';
import { MenuTrigger } from '@angular/aria/menu';

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
    '[style.anchor-name]': "'--ui-menu-trigger'",
  },
})
export class UiMenuTrigger {}
