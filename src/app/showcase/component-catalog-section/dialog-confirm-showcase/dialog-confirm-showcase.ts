import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiDialogConfirm } from '../../../components/ui-dialog-confirm/ui-dialog-confirm';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

@Component({
  selector: 'app-dialog-confirm-showcase',
  imports: [UiButton, UiCard, UiDialogConfirm, UiTab, UiTabItem],
  templateUrl: './dialog-confirm-showcase.html',
  styleUrl: './dialog-confirm-showcase.css',
})
export class DialogConfirmShowcase {
  protected readonly lastAction = signal('No action yet');

  protected readonly defaultCode = `<button
  uiButton
  command="show-modal"
  [attr.commandfor]="confirm.dialogId()"
>
  Save changes
</button>

<ui-dialog-confirm
  #confirm="uiDialogConfirm"
  title="Save changes?"
  message="The new values become visible immediately."
  confirmLabel="Save"
  cancelLabel="Cancel"
  (confirm)="saveChanges()"
  (cancel)="keepEditing()"
/>`;

  protected readonly destructiveCode = `<ui-dialog-confirm
  #confirm="uiDialogConfirm"
  tone="destructive"
  title="Delete item?"
  message="This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Keep item"
  (confirm)="deleteItem()"
/>`;

  protected readonly copyCode = `<ui-dialog-confirm
  #confirm="uiDialogConfirm"
  title="Publish release?"
  message="Version 2.4.0 will become available to every workspace."
  confirmLabel="Publish now"
  cancelLabel="Review again"
/>`;

  protected readonly cancelCode = `<ui-dialog-confirm
  #confirm="uiDialogConfirm"
  title="Discard draft?"
  message="Your unpublished changes will be lost."
  (confirm)="discardDraft()"
  (cancel)="keepDraft()"
/>

<!-- cancel also emits for Escape, backdrop light dismiss, and the close button. -->`;

  protected report(action: string): void {
    this.lastAction.set(action);
  }
}
