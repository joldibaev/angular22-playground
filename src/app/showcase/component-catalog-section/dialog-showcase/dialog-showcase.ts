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

  protected readonly defaultCode = `<button uiButton type="button" [uiDialogTrigger]="dialog">
  Invite teammates
</button>

<ui-dialog #dialog="uiDialog" title="Invite teammates" caption="Workspace access">
  <p>Send an invitation link to a teammate. They receive access after accepting it.</p>
  <div uiDialogFooter class="dialog-actions">
    <button uiButton type="button" variant="outline" [uiDialogClose]="dialog">
      Cancel
    </button>
    <button uiButton type="button" [uiDialogClose]="dialog">Send invites</button>
  </div>
</ui-dialog>`;

  protected readonly sizeCode = `<ui-dialog title="Small dialog" size="sm">
  <p>For short confirmations and focused prompts.</p>
</ui-dialog>
<ui-dialog title="Default dialog" size="md">
  <p>The default for common forms and messages.</p>
</ui-dialog>
<ui-dialog title="Large dialog" size="lg">
  <p>For workflows that need more horizontal room.</p>
</ui-dialog>
<ui-dialog title="Extra-large dialog" size="xl">
  <p>For dense pickers and multi-column content.</p>
</ui-dialog>`;

  protected readonly descriptionCode = `<ui-dialog
  title="Delete workspace?"
  role="alertdialog"
  size="sm"
  [ariaDescribedBy]="'workspace-delete-description'"
>
  <p id="workspace-delete-description" class="dialog-copy">
    This permanently removes the workspace and cannot be undone.
  </p>
</ui-dialog>`;

  protected readonly dismissCode = `<ui-dialog title="Light dismiss" dismiss="any">
  <p>Backdrop, Escape, and the close button dismiss this dialog.</p>
</ui-dialog>
<ui-dialog title="Close request" dismiss="closerequest">
  <p>Escape works, but clicking the backdrop does not.</p>
</ui-dialog>
<ui-dialog title="Blocking task" dismiss="none">
  <p>Only an explicit close control dismisses this dialog.</p>
</ui-dialog>`;

  protected readonly scrollCode = `<ui-dialog #dialog="uiDialog" title="Review changes" caption="The body scrolls">
  <div>
    @for (change of changes; track change.id) {
      <p>{{ change.summary }}</p>
    }
  </div>
  <div uiDialogFooter>
    <button uiButton [uiDialogClose]="dialog">Apply</button>
  </div>
</ui-dialog>`;

  protected readonly nestedCode = `<ui-dialog #parent="uiDialog" title="Edit order">
  <p class="dialog-copy">Unsaved quantity and price changes remain in the parent.</p>
  <button uiButton type="button" variant="destructive" [uiDialogTrigger]="child">
    Discard changes
  </button>
  <ui-dialog #child="uiDialog" title="Discard changes?" role="alertdialog" size="sm" dismiss="closerequest">
    <p class="dialog-copy">The child closes independently while the parent remains open.</p>
    <div uiDialogFooter>
      <button uiButton type="button" [uiDialogClose]="child">Keep editing</button>
    </div>
  </ui-dialog>
</ui-dialog>`;

  protected readonly closeCode = `<ui-dialog title="Settings" closeLabel="Close settings">
  <p>The built-in close button has a context-specific accessible name.</p>
</ui-dialog>

<ui-dialog #dialog="uiDialog" title="Required decision" [withCloseButton]="false" dismiss="none">
  <p>Completion must be explicit when the header close button is omitted.</p>
  <button uiButton type="button" [uiDialogClose]="dialog">Continue</button>
</ui-dialog>`;

  protected readonly controlledCode = `readonly dialogOpen = signal(false);

<button uiButton (click)="dialog.show()">Open from code</button>
<ui-dialog
  #dialog="uiDialog"
  title="Controlled dialog"
  [open]="dialogOpen()"
  (openChange)="dialogOpen.set($event)"
>
  <p>The native toggle event keeps external state synchronized.</p>
  <button uiButton type="button" (click)="dialog.close()">Close from code</button>
</ui-dialog>`;
}
