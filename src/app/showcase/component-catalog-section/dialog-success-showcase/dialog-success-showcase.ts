import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiDialogSuccess } from '../../../components/ui-dialog-success/ui-dialog-success';

@Component({
  selector: 'app-dialog-success-showcase',
  imports: [ShowcaseExample, UiButton, UiDialogSuccess],
  templateUrl: './dialog-success-showcase.html',
  styleUrl: './dialog-success-showcase.css',
})
export class DialogSuccessShowcase {
  protected readonly lastAction = signal('Not acknowledged yet');

  protected readonly defaultCode = `<button
  uiButton
  command="show-modal"
  [attr.commandfor]="success.dialogId()"
>
  Complete payment
</button>

<ui-dialog-success
  #success="uiDialogSuccess"
  title="Payment complete"
  message="A receipt has been sent to your email."
/>`;

  protected readonly customCode = `openWorkspace(): void {
  // Navigate to the newly created workspace.
}

<ui-dialog-success
  #success="uiDialogSuccess"
  title="Workspace created"
  message="Your team can now start collaborating."
  actionLabel="Open workspace"
  dismiss="closerequest"
  (acknowledge)="openWorkspace()"
/>`;

  protected acknowledge(): void {
    this.lastAction.set('Workspace opened');
  }
}
