import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';
import { nextId } from '../../shared/unique-id';

export type UiDialogRole = 'dialog' | 'alertdialog';
export type UiDialogSize = 'sm' | 'md' | 'lg' | 'xl';
/** Maps to the native `<dialog closedby>` light-dismiss attribute. */
export type UiDialogDismiss = 'any' | 'closerequest' | 'none';

/**
 * Modal dialog built on the native `<dialog>` element. Opening is delegated to
 * the platform: UiDialogTrigger/UiDialogClose hide the Invoker Commands wiring,
 * and `closedby` provides
 * backdrop/Escape light dismiss. The browser handles the top layer, focus trap,
 * and `::backdrop`; this component only renders the surface and keeps the
 * optional `open` two-way binding in sync via the dialog's `toggle` event.
 *
 * Keep this component command/template driven. A general `dialog.open(Component)`
 * service was rejected because dynamic hosts made animation cleanup, focus
 * policy, SSR, tests, and nested dialogs drift back toward the old overlay model.
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
  readonly title = input.required<string>();
  readonly caption = input('');
  readonly role = input<UiDialogRole>('dialog');
  readonly size = input<UiDialogSize>('md');
  readonly dismiss = input<UiDialogDismiss>('any');
  readonly ariaDescribedBy = input<string | null>(null);
  readonly closeLabel = input('Закрыть');
  readonly withCloseButton = input(true, { transform: booleanAttribute });
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: (value) => (value === undefined ? undefined : booleanAttribute(value)),
  });
  readonly openChange = output<boolean>();

  protected readonly titleId = `ui-dialog-title-${this.id}`;
  protected readonly captionId = `ui-dialog-caption-${this.id}`;
  protected readonly describedBy = computed(
    () => this.ariaDescribedBy() ?? (this.caption() ? this.captionId : null),
  );
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
