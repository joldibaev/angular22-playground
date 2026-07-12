import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiDialog } from '../../../components/ui-dialog/ui-dialog';
import { UiDialogClose } from '../../../components/ui-dialog/ui-dialog-close/ui-dialog-close';
import { UiDialogTrigger } from '../../../components/ui-dialog/ui-dialog-trigger/ui-dialog-trigger';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

@Component({
  selector: 'app-dialog-showcase',
  imports: [ShowcaseCode, UiButton, UiCard, UiDialog, UiDialogClose, UiDialogTrigger, UiTab, UiTabItem],
  templateUrl: './dialog-showcase.html',
  styleUrl: './dialog-showcase.css',
})
export class DialogShowcase {
  protected readonly controlledOpen = signal(false);

  protected readonly defaultCode = `<button uiButton [uiDialogTrigger]="dialog">
  Invite teammates
</button>

<ui-dialog #dialog="uiDialog" title="Invite teammates" caption="Workspace access">
  <p>Send an invitation link to a teammate.</p>
  <div uiDialogFooter>
    <button uiButton [uiDialogClose]="dialog">Done</button>
  </div>
</ui-dialog>`;

  protected readonly sizeCode = `<ui-dialog title="Small" size="sm">...</ui-dialog>
<ui-dialog title="Default" size="md">...</ui-dialog>
<ui-dialog title="Large" size="lg">...</ui-dialog>
<ui-dialog title="Extra large" size="xl">...</ui-dialog>`;

  protected readonly descriptionCode = `<ui-dialog
  title="Delete workspace?"
  role="alertdialog"
  [ariaDescribedBy]="'delete-description'"
>
  <p id="delete-description">This action cannot be undone.</p>
</ui-dialog>`;

  protected readonly dismissCode = `<ui-dialog title="Light dismiss" dismiss="any">...</ui-dialog>
<ui-dialog title="Explicit choice" dismiss="closerequest">...</ui-dialog>
<ui-dialog title="Blocking task" dismiss="none">...</ui-dialog>`;

  protected readonly scrollCode = `<ui-dialog #dialog="uiDialog" title="Review changes" caption="The body scrolls">
  <div><!-- Long content --></div>
  <div uiDialogFooter>
    <button uiButton [uiDialogClose]="dialog">Apply</button>
  </div>
</ui-dialog>`;

  protected readonly nestedCode = `<ui-dialog #parent="uiDialog" title="Edit order">
  <button uiButton [uiDialogTrigger]="child">Discard</button>
  <ui-dialog #child="uiDialog" title="Discard changes?" role="alertdialog" size="sm">
    ...
  </ui-dialog>
</ui-dialog>`;

  protected readonly closeCode = `<ui-dialog title="Settings" closeLabel="Close settings">...</ui-dialog>

<ui-dialog #dialog="uiDialog" title="Required decision" [withCloseButton]="false" dismiss="none">
  <button uiButton [uiDialogClose]="dialog">Continue</button>
</ui-dialog>`;

  protected readonly controlledCode = `readonly dialogOpen = signal(false);

<button uiButton (click)="dialog.show()">Open from code</button>
<ui-dialog
  #dialog="uiDialog"
  title="Controlled dialog"
  [open]="dialogOpen()"
  (openChange)="dialogOpen.set($event)"
>
  <button uiButton (click)="dialog.close()">Close from code</button>
</ui-dialog>`;
}
