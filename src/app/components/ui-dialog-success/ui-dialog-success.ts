import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { nextId } from '../../shared/unique-id';
import { UiButton } from '../ui-button/ui-button';
import { UiDialog, type UiDialogDismiss } from '../ui-dialog/ui-dialog';

/**
 * A completion dialog composed from ui-dialog. The stable, always-mounted check
 * replays on every native open event; keeping it mounted also gives close a
 * matching fade instead of an enter-only animation.
 */
@Component({
  selector: 'ui-dialog-success',
  exportAs: 'uiDialogSuccess',
  imports: [UiButton, UiDialog],
  templateUrl: './ui-dialog-success.html',
  styleUrl: './ui-dialog-success.css',
})
export class UiDialogSuccess {
  private readonly id = nextId();

  readonly dialogId = input(`ui-dialog-success-${this.id}`);
  readonly title = input('Completed');
  readonly message = input('Your changes were saved successfully.');
  readonly actionLabel = input('Done');
  readonly dismiss = input<UiDialogDismiss>('any');
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: (value) => (value === undefined ? undefined : booleanAttribute(value)),
  });
  readonly openChange = output<boolean>();
  readonly acknowledge = output<void>();

  protected readonly messageId = `ui-dialog-success-message-${this.id}`;
  protected readonly checkPhase = signal<'out' | 'prepare' | 'in'>('out');
  private readonly checkRef = viewChild<ElementRef<HTMLElement>>('checkRef');

  constructor() {
    afterRenderEffect(() => {
      if (this.checkPhase() !== 'prepare') {
        return;
      }

      void this.checkRef()?.nativeElement.offsetWidth;
      this.checkPhase.set('in');
    });
  }

  protected onOpenChange(open: boolean): void {
    this.checkPhase.set(open ? 'prepare' : 'out');
    this.openChange.emit(open);
  }

  protected onAcknowledge(): void {
    this.acknowledge.emit();
  }
}
