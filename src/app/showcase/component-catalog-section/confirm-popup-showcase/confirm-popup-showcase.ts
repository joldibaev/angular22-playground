import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiConfirmPopup } from '../../../components/ui-confirm-popup/ui-confirm-popup';
import { ShowcaseExample } from '../showcase-example/showcase-example';

@Component({
  selector: 'app-confirm-popup-showcase',
  imports: [ShowcaseExample, UiButton, UiConfirmPopup],
  templateUrl: './confirm-popup-showcase.html',
  styleUrl: './confirm-popup-showcase.css',
})
export class ConfirmPopupShowcase {
  protected readonly lastAction = signal('No action yet');
  protected readonly controlledOpen = signal(false);

  protected readonly defaultCode = `<button
  uiButton
  type="button"
  variant="outline"
  uiConfirmPopup
  uiConfirmMessage="Save these changes?"
  uiConfirmLabel="Save"
  (uiConfirm)="saveChanges()"
>
  Save changes
</button>`;

  protected readonly destructiveCode = `<button
  uiButton
  type="button"
  variant="destructive"
  uiConfirmPopup
  uiConfirmMessage="Delete this item? This cannot be undone."
  uiConfirmLabel="Delete"
  uiCancelLabel="Keep item"
  uiConfirmTone="destructive"
  (uiConfirm)="deleteItem()"
  (uiCancel)="keepItem()"
>
  Delete item
</button>`;

  protected readonly placementCode = `<button
  uiButton
  type="button"
  uiConfirmPopup
  uiPlacement="right"
  uiConfirmMessage="Publish this release?"
  uiConfirmLabel="Publish"
  (uiConfirm)="publishRelease()"
>
  Publish release
</button>`;

  protected readonly controlledCode = `import { signal } from '@angular/core';

readonly confirmOpen = signal(false);

<button
  #confirm="uiConfirmPopup"
  uiButton
  type="button"
  uiConfirmPopup
  uiConfirmMessage="Archive this report?"
  [uiVisible]="confirmOpen()"
  (uiVisibleChange)="confirmOpen.set($event)"
>
  Archive report
</button>

<button uiButton type="button" variant="ghost" (click)="confirm.show()">
  Open programmatically
</button>`;

  protected report(action: string): void {
    this.lastAction.set(action);
  }
}
