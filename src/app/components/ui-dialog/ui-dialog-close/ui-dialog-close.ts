import { Directive, input } from '@angular/core';
import { UiDialog } from '../ui-dialog';

/** Closes a UiDialog through the native Invoker Commands API. */
@Directive({
  selector: 'button[uiDialogClose]',
  host: {
    command: 'close',
    '[attr.commandfor]': 'dialog().dialogId()',
  },
})
export class UiDialogClose {
  readonly dialog = input.required<UiDialog>({ alias: 'uiDialogClose' });
}
