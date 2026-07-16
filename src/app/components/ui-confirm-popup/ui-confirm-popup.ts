import { DOCUMENT } from '@angular/common';
import {
  afterRenderEffect,
  ApplicationRef,
  booleanAttribute,
  ComponentRef,
  createComponent,
  DestroyRef,
  Directive,
  EnvironmentInjector,
  inject,
  input,
  output,
  Renderer2,
} from '@angular/core';
import { syncPopover } from '../../shared/sync-popover';
import { nextId } from '../../shared/unique-id';
import {
  type UiConfirmPopupDefaultFocus,
  UiConfirmPopupPanel,
  type UiConfirmPopupTone,
} from './ui-confirm-popup-panel/ui-confirm-popup-panel';
import { type UiPanelPlacement } from '../../shared/arrow-panel';

export type UiConfirmPopupPlacement = UiPanelPlacement;
export type {
  UiConfirmPopupDefaultFocus,
  UiConfirmPopupTone,
} from './ui-confirm-popup-panel/ui-confirm-popup-panel';

/**
 * Anchored, non-modal confirmation for decisions that should stay near their
 * trigger. Keep consequential modal flows on UiDialogConfirm: a native popover
 * intentionally allows light dismiss and does not pretend to trap focus.
 */
@Directive({
  selector: 'button[uiConfirmPopup]',
  exportAs: 'uiConfirmPopup',
  host: {
    class: 'ui-confirm-popup-trigger',
    '[attr.aria-controls]': 'panelId()',
    '[attr.aria-expanded]': 'panelVisible',
    'aria-haspopup': 'dialog',
    '[style.anchor-name]': 'anchorName',
    command: 'toggle-popover',
    '[attr.commandfor]': 'panelId()',
  },
})
export class UiConfirmPopup {
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly id = nextId();
  private panelRef: ComponentRef<UiConfirmPopupPanel> | null = null;
  private unlistenToggle: (() => void) | null = null;
  private resolved = false;

  readonly message = input.required<string>({ alias: 'uiConfirmMessage' });
  readonly confirmLabel = input('Подтвердить', { alias: 'uiConfirmLabel' });
  readonly cancelLabel = input('Отмена', { alias: 'uiCancelLabel' });
  readonly tone = input<UiConfirmPopupTone>('default', { alias: 'uiConfirmTone' });
  readonly defaultFocus = input<UiConfirmPopupDefaultFocus>('cancel', {
    alias: 'uiDefaultFocus',
  });
  readonly placement = input<UiConfirmPopupPlacement>('bottom', { alias: 'uiPlacement' });
  readonly withFallback = input(true, {
    alias: 'uiWithFallback',
    transform: booleanAttribute,
  });
  readonly panelId = input(`ui-confirm-popup-${this.id}`, { alias: 'uiPanelId' });
  readonly open = input<boolean | undefined, unknown>(undefined, {
    alias: 'uiVisible',
    transform: (value) => (value === undefined ? undefined : booleanAttribute(value)),
  });
  readonly confirm = output<void>({ alias: 'uiConfirm' });
  readonly cancel = output<void>({ alias: 'uiCancel' });
  readonly openChange = output<boolean>({ alias: 'uiVisibleChange' });

  readonly anchorName = `--ui-confirm-popup-${this.id}`;
  protected panelVisible = false;
  private readonly messageId = `ui-confirm-popup-message-${this.id}`;

  constructor() {
    this.destroyRef.onDestroy(() => this.destroyPanel());

    afterRenderEffect(() => {
      this.ensurePanel();
      this.syncPanelInputs();
      this.panelRef?.changeDetectorRef.detectChanges();

      const open = this.open();

      if (open !== undefined) {
        this.applyOpen(open);
      }
    });
  }

  show(): void {
    this.applyOpen(true);
  }

  hide(): void {
    this.applyOpen(false);
  }

  toggle(): void {
    this.panelRef?.location.nativeElement.togglePopover();
  }

  private applyOpen(open: boolean): void {
    syncPopover(this.panelRef?.location.nativeElement, open);
  }

  private onPanelToggle(event: ToggleEvent): void {
    const isOpen = event.newState === 'open';

    if (isOpen) {
      this.resolved = false;
    } else if (!this.resolved) {
      this.resolve(false);
    }

    if (isOpen === this.panelVisible) {
      return;
    }

    this.panelVisible = isOpen;
    this.openChange.emit(isOpen);
  }

  private ensurePanel(): void {
    if (this.panelRef) {
      return;
    }

    const panelRef = createComponent(UiConfirmPopupPanel, {
      environmentInjector: this.environmentInjector,
    });
    const panel = panelRef.location.nativeElement;

    this.panelRef = panelRef;
    panelRef.instance.confirm.subscribe(() => this.resolve(true));
    panelRef.instance.cancel.subscribe(() => this.resolve(false));
    this.syncPanelInputs();
    this.appRef.attachView(panelRef.hostView);
    this.renderer.appendChild(this.document.body, panel);
    this.unlistenToggle = this.renderer.listen(panel, 'toggle', (event: ToggleEvent) =>
      this.onPanelToggle(event),
    );
    panelRef.changeDetectorRef.detectChanges();
  }

  private syncPanelInputs(): void {
    if (!this.panelRef) {
      return;
    }

    this.panelRef.setInput('message', this.message());
    this.panelRef.setInput('confirmLabel', this.confirmLabel());
    this.panelRef.setInput('cancelLabel', this.cancelLabel());
    this.panelRef.setInput('tone', this.tone());
    this.panelRef.setInput('defaultFocus', this.defaultFocus());
    this.panelRef.setInput('panelId', this.panelId());
    this.panelRef.setInput('messageId', this.messageId);
    this.panelRef.setInput('anchorName', this.anchorName);
    this.panelRef.setInput('placement', this.placement());
    this.panelRef.setInput('withFallback', this.withFallback());
  }

  private resolve(confirmed: boolean): void {
    if (this.resolved) {
      return;
    }

    this.resolved = true;

    if (confirmed) {
      this.confirm.emit();
    } else {
      this.cancel.emit();
    }
  }

  private destroyPanel(): void {
    if (!this.panelRef) {
      return;
    }

    // Teardown is not a user cancellation and must not leak an outcome.
    this.resolved = true;
    syncPopover(this.panelRef.location.nativeElement, false);
    this.unlistenToggle?.();
    this.unlistenToggle = null;
    this.appRef.detachView(this.panelRef.hostView);
    this.panelRef.destroy();
    this.panelRef = null;
  }
}
