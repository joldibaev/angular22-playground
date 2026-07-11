import { Directive, input } from '@angular/core';
import { UiDialog } from '../ui-dialog';

/** Opens a UiDialog through the native Invoker Commands API. */
@Directive({
  selector: 'button[uiDialogTrigger]',
  host: {
    command: 'show-modal',
    '[attr.commandfor]': 'dialog().dialogId()',
  },
})
export class UiDialogTrigger {
  readonly dialog = input.required<UiDialog>({ alias: 'uiDialogTrigger' });
}
