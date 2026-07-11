import { Directive, input } from '@angular/core';
import { UiDrawer } from '../ui-drawer';

/** Opens a UiDrawer through the native Invoker Commands API. */
@Directive({
  selector: 'button[uiDrawerTrigger]',
  host: {
    command: 'show-modal',
    '[attr.commandfor]': 'drawer().drawerId()',
  },
})
export class UiDrawerTrigger {
  readonly drawer = input.required<UiDrawer>({ alias: 'uiDrawerTrigger' });
}
