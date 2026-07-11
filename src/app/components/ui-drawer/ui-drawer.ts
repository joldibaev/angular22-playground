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

export type UiDrawerSide = 'start' | 'end';
export type UiDrawerSize = 'sm' | 'md' | 'lg';
/** Maps to the native `<dialog closedby>` light-dismiss attribute. */
export type UiDrawerDismiss = 'any' | 'closerequest' | 'none';

/**
 * Edge-anchored drawer built on the native modal `<dialog>` element — same
 * platform plumbing as {@link UiDialog} (Invoker Commands to open via
 * `command="show-modal"` + `commandfor`, `closedby` for light dismiss, native
 * top layer / focus trap / `::backdrop`), but the surface slides in from the
 * inline start or end instead of scaling in centered.
 */
@Component({
  selector: 'ui-drawer',
  exportAs: 'uiDrawer',
  imports: [UiIcon],
  templateUrl: './ui-drawer.html',
  styleUrl: './ui-drawer.css',
})
export class UiDrawer {
  private readonly id = nextId();

  readonly drawerId = input(`ui-drawer-${this.id}`);
  // A modal surface must always have an accessible name. Keep the visible title
  // required instead of offering an easy-to-forget unlabeled drawer mode.
  readonly title = input.required<string>();
  readonly side = input<UiDrawerSide>('end');
  readonly size = input<UiDrawerSize>('md');
  readonly dismiss = input<UiDrawerDismiss>('any');
  readonly closeLabel = input('Закрыть');
  readonly withCloseButton = input(true, { transform: booleanAttribute });
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: (value) => (value === undefined ? undefined : booleanAttribute(value)),
  });
  readonly openChange = output<boolean>();

  protected readonly titleId = `ui-drawer-title-${this.id}`;
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
