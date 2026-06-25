import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiDialog } from '../../../components/ui-dialog/ui-dialog';
import { UiDialogConfirm } from '../../../components/ui-dialog-confirm/ui-dialog-confirm';

@Component({
  selector: 'app-dialog-showcase',
  imports: [UiButton, UiDialog, UiDialogConfirm],
  templateUrl: './dialog-showcase.html',
})
export class DialogShowcase {
  protected readonly lastAction = signal('');

  protected onConfirm(): void {
    this.lastAction.set('Deleted');
  }

  protected onCancel(): void {
    this.lastAction.set('Cancelled');
  }
}
