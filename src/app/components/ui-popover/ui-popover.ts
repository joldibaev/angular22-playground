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
  TemplateRef,
} from '@angular/core';
import { syncPopover } from '../../shared/sync-popover';
import { nextId } from '../../shared/unique-id';
import { UiPopoverPanel } from './ui-popover-panel/ui-popover-panel';

export type UiPopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Tethers a templated popover panel to a `button`. The click-only contract
 * deliberately keeps rich popover content distinct from passive hover/focus
 * tooltips. The Invoker Commands API controls the `popover="auto"` panel,
 * which provides light dismiss, `Escape`, and focus handling. The panel's
 * `toggle` event is the single source of truth, which also makes the optional
 * `uiVisible` two-way binding work.
 */
@Directive({
  // Invoker Commands are button actions. Keeping the selector narrow avoids an
  // anchor that looks wired but cannot toggle its panel natively.
  selector: 'button[uiPopover]',
  exportAs: 'uiPopover',
  host: {
    class: 'ui-popover-trigger',
    '[attr.aria-describedby]': 'describedby() ? panelId() : null',
    '[style.anchor-name]': 'anchorName',
    command: 'toggle-popover',
    '[attr.commandfor]': 'panelId()',
  },
})
export class UiPopover {
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly id = nextId();
  private panelRef: ComponentRef<UiPopoverPanel> | null = null;
  private unlistenToggle: (() => void) | null = null;
  private visible = false;

  readonly content = input.required<TemplateRef<unknown>>({ alias: 'uiContent' });
  readonly placement = input<UiPopoverPlacement>('bottom', { alias: 'uiPlacement' });
  readonly withFallback = input(false, { alias: 'uiWithFallback', transform: booleanAttribute });
  readonly panelId = input(`ui-popover-${this.id}`, { alias: 'uiPanelId' });
  readonly role = input<string | null>(null, { alias: 'uiRole' });
  readonly maxWidth = input('', { alias: 'uiMaxWidth' });
  readonly describedby = input(false, {
    alias: 'uiDescribedby',
    transform: booleanAttribute,
  });
  readonly open = input<boolean | undefined, unknown>(undefined, {
    alias: 'uiVisible',
    transform: (value) => (value === undefined ? undefined : booleanAttribute(value)),
  });
  readonly openChange = output<boolean>({ alias: 'uiVisibleChange' });

  readonly anchorName = `--ui-popover-${this.id}`;

  constructor() {
    this.destroyRef.onDestroy(() => this.destroyPanel());

    afterRenderEffect(() => {
      // The panel must exist before the first interaction so that `commandfor`
      // can resolve it by id.
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

    if (isOpen === this.visible) {
      return;
    }

    this.visible = isOpen;
    this.openChange.emit(isOpen);
  }

  private ensurePanel(): void {
    if (this.panelRef) {
      return;
    }

    const panelRef = createComponent(UiPopoverPanel, {
      environmentInjector: this.environmentInjector,
    });
    const panel = panelRef.location.nativeElement;

    this.panelRef = panelRef;
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

    this.panelRef.setInput('content', this.content());
    this.panelRef.setInput('panelId', this.panelId());
    this.panelRef.setInput('anchorName', this.anchorName);
    this.panelRef.setInput('placement', this.placement());
    this.panelRef.setInput('withFallback', this.withFallback());
    this.panelRef.setInput('role', this.role());
    this.panelRef.setInput('maxWidth', this.maxWidth());
  }

  private destroyPanel(): void {
    if (!this.panelRef) {
      return;
    }

    syncPopover(this.panelRef.location.nativeElement, false);

    this.unlistenToggle?.();
    this.unlistenToggle = null;
    this.appRef.detachView(this.panelRef.hostView);
    this.panelRef.destroy();
    this.panelRef = null;
  }
}
