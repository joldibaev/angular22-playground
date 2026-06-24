import { Component, input, model, output } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';
import { UiDialog } from '../ui-dialog/ui-dialog';

export type UiDialogConfirmTone = 'default' | 'destructive';

/**
 * Confirmation dialog: a thin layer over {@link UiDialog} that renders a message
 * plus confirm/cancel actions. Open it programmatically via the `open` two-way
 * binding or `show()`. Dismissing with Escape/backdrop just closes (no `confirm`
 * is emitted); the explicit buttons drive `confirm`/`cancel`.
 */
@Component({
  selector: 'ui-dialog-confirm',
  imports: [UiDialog, UiButton],
  templateUrl: './ui-dialog-confirm.html',
  styleUrl: './ui-dialog-confirm.css',
})
export class UiDialogConfirm {
  readonly title = input('Are you sure?');
  readonly message = input('');
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');
  readonly tone = input<UiDialogConfirmTone>('default');
  readonly open = model(false);
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  show(): void {
    this.open.set(true);
  }

  close(): void {
    this.open.set(false);
  }

  protected onConfirm(): void {
    this.confirm.emit();
    this.open.set(false);
  }

  protected onCancel(): void {
    this.cancel.emit();
    this.open.set(false);
  }
}
