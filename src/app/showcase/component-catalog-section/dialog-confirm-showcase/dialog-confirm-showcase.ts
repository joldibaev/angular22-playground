import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiDialogConfirm } from '../../../components/ui-dialog-confirm/ui-dialog-confirm';

@Component({
  selector: 'app-dialog-confirm-showcase',
  imports: [ShowcaseExample, UiButton, UiDialogConfirm],
  templateUrl: './dialog-confirm-showcase.html',
  styleUrl: './dialog-confirm-showcase.css',
})
export class DialogConfirmShowcase {
  protected readonly lastAction = signal('No action yet');

  protected readonly defaultCode = `saveChanges(): void {
  // Persist the changes.
}

keepEditing(): void {
  // Keep the current form open.
}

<button
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

  protected readonly destructiveCode = `deleteItem(): void {
  // Delete the selected item after confirmation.
}

<ui-dialog-confirm
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

  protected readonly cancelCode = `discardDraft(): void {
  // Discard the draft after confirmation.
}

keepDraft(): void {
  // Preserve the current draft.
}

<ui-dialog-confirm
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
