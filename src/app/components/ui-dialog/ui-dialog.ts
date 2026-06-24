import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';
import { nextId } from '../../shared/unique-id';

export type UiDialogSize = 'sm' | 'md' | 'lg';
/** Maps to the native `<dialog closedby>` light-dismiss attribute. */
export type UiDialogDismiss = 'any' | 'closerequest' | 'none';

/**
 * Modal dialog built on the native `<dialog>` element. Opening is delegated to
 * the platform: a trigger button uses the Invoker Commands API
 * (`command="show-modal"` + `commandfor="<dialogId>"`), and `closedby` provides
 * backdrop/Escape light dismiss. The browser handles the top layer, focus trap,
 * and `::backdrop`; this component only renders the surface and keeps the
 * optional `open` two-way binding in sync via the dialog's `toggle` event.
 */
@Component({
  selector: 'ui-dialog',
  exportAs: 'uiDialog',
  imports: [UiIcon],
  templateUrl: './ui-dialog.html',
  styleUrl: './ui-dialog.css',
})
export class UiDialog {
  private readonly id = nextId();

  readonly dialogId = input(`ui-dialog-${this.id}`);
  readonly title = input('');
  readonly size = input<UiDialogSize>('md');
  readonly dismiss = input<UiDialogDismiss>('any');
  readonly withCloseButton = input(true, { transform: booleanAttribute });
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: (value) => (value === undefined ? undefined : booleanAttribute(value)),
  });
  readonly openChange = output<boolean>();

  protected readonly titleId = `ui-dialog-title-${this.id}`;
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private visible = false;

  constructor() {
    afterRenderEffect(() => {
      const open = this.open();

      if (open !== undefined) {
        this.applyOpen(open);
      }
    });
  }

  show(): void {
    this.applyOpen(true);
  }

  close(): void {
    this.applyOpen(false);
  }

  private applyOpen(open: boolean): void {
    const element = this.dialog()?.nativeElement;

    if (!element) {
      return;
    }

    if (open && !element.open) {
      element.showModal();
    } else if (!open && element.open) {
      element.close();
    }
  }

  protected onToggle(event: ToggleEvent): void {
    const isOpen = event.newState === 'open';

    if (isOpen === this.visible) {
      return;
    }

    this.visible = isOpen;
    this.openChange.emit(isOpen);
  }
}
