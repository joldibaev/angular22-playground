import { Directive, input } from '@angular/core';
import { UiDrawer } from '../ui-drawer';

/** Closes a UiDrawer through the native Invoker Commands API. */
@Directive({
  selector: 'button[uiDrawerClose]',
  host: {
    command: 'close',
    '[attr.commandfor]': 'drawer().drawerId()',
  },
})
export class UiDrawerClose {
  readonly drawer = input.required<UiDrawer>({ alias: 'uiDrawerClose' });
}
