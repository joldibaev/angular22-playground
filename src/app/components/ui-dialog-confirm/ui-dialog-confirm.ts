import { Component, input, output } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';
import { UiDialog } from '../ui-dialog/ui-dialog';
import { nextId } from '../../shared/unique-id';

export type UiDialogConfirmTone = 'default' | 'destructive';

/**
 * Declarative confirmation dialog. Open it with native `show-modal` commands
 * and handle `confirm`/`cancel`; do not replace it with a programmatic
 * `confirm()` service unless a future requirement cannot be modeled in HTML.
 */
@Component({
  selector: 'ui-dialog-confirm',
  exportAs: 'uiDialogConfirm',
  imports: [UiDialog, UiButton],
  templateUrl: './ui-dialog-confirm.html',
  styleUrl: './ui-dialog-confirm.css',
})
export class UiDialogConfirm {
  private readonly id = nextId();

  readonly dialogId = input(`ui-dialog-confirm-${this.id}`);
  readonly title = input('Вы уверены?');
  readonly message = input('');
  readonly confirmLabel = input('Подтвердить');
  readonly cancelLabel = input('Отмена');
  readonly tone = input<UiDialogConfirmTone>('default');
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected readonly messageId = `ui-dialog-confirm-message-${this.id}`;
  private resolved = false;

  protected onConfirm(): void {
    this.resolved = true;
    this.confirm.emit();
  }

  protected onCancel(): void {
    this.resolved = true;
    this.cancel.emit();
  }

  protected onOpenChange(open: boolean): void {
    if (open) {
      this.resolved = false;
    } else if (!this.resolved) {
      // Every dismissal that did not confirm is cancellation, including Escape and light dismiss.
      this.resolved = true;
      this.cancel.emit();
    }
  }
}
