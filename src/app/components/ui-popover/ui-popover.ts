import { DOCUMENT } from '@angular/common';
import {
  afterRenderEffect,
  ApplicationRef,
  booleanAttribute,
  ComponentRef,
  createComponent,
  DestroyRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  inject,
  input,
  output,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { UiPopoverPanel } from './ui-popover-panel/ui-popover-panel';

let nextPopoverId = 0;

export type UiPopoverTrigger = 'click' | 'hover' | null;
export type UiPopoverPlacement = 'top' | 'bottom';

@Directive({
  selector: '[uiPopover]',
  exportAs: 'uiPopover',
  host: {
    '[attr.aria-describedby]': 'describedby() ? panelId() : null',
    '[style.anchor-name]': 'anchorName',
    '(click)': 'onClick()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'onFocusIn()',
    '(focusout)': 'onFocusOut()',
    '(keydown.escape)': 'hide()',
  },
})
export class UiPopover {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly id = nextPopoverId++;
  private panelRef: ComponentRef<UiPopoverPanel> | null = null;
  private unlistenOutsidePointer: (() => void) | null = null;
  private visible = false;

  readonly content = input.required<TemplateRef<unknown>>({ alias: 'uiContent' });
  readonly trigger = input<UiPopoverTrigger>('click', { alias: 'uiTrigger' });
  readonly placement = input<UiPopoverPlacement>('bottom', { alias: 'uiPlacement' });
  readonly panelId = input(`ui-popover-${this.id}`, { alias: 'uiPanelId' });
  readonly role = input<string | null>(null, { alias: 'uiRole' });
  readonly maxWidth = input('', { alias: 'uiMaxWidth' });
  readonly overlayClickable = input(true, {
    alias: 'uiOverlayClickable',
    transform: booleanAttribute,
  });
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
      const open = this.open();

      if (open === undefined) {
        if (this.visible) {
          this.syncPanelInputs();
          this.panelRef?.changeDetectorRef.detectChanges();
        }

        return;
      }

      if (open) {
        this.show();
        this.syncPanelInputs();
        this.panelRef?.changeDetectorRef.detectChanges();
      } else if (this.visible) {
        this.hide();
      }
    });
  }

  show(): void {
    if (this.visible) {
      return;
    }

    this.ensurePanel();

    if (!this.panelRef) {
      return;
    }

    const panel = this.panelRef.location.nativeElement;

    this.visible = true;
    this.syncPanelInputs();
    this.panelRef.instance.show();
    this.panelRef.changeDetectorRef.detectChanges();

    if ('showPopover' in panel && !panel.matches(':popover-open')) {
      panel.showPopover();
    }

    this.syncOutsidePointerListener();
    this.openChange.emit(true);
  }

  hide(): void {
    if (!this.visible || !this.panelRef) {
      return;
    }

    const panel = this.panelRef.location.nativeElement;

    if ('hidePopover' in panel && panel.matches(':popover-open')) {
      panel.hidePopover();
    }

    this.visible = false;
    this.panelRef.instance.hide();
    this.panelRef.changeDetectorRef.detectChanges();
    this.unlistenOutsidePointer?.();
    this.unlistenOutsidePointer = null;
    this.openChange.emit(false);
  }

  toggle(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  onClick(): void {
    if (this.trigger() === 'click') {
      this.toggle();
    }
  }

  onMouseEnter(): void {
    if (this.trigger() === 'hover') {
      this.show();
    }
  }

  onMouseLeave(): void {
    if (this.trigger() === 'hover') {
      this.hide();
    }
  }

  onFocusIn(): void {
    if (this.trigger() === 'hover') {
      this.show();
    }
  }

  onFocusOut(): void {
    if (this.trigger() === 'hover') {
      this.hide();
    }
  }

  private ensurePanel(): void {
    if (this.panelRef) {
      return;
    }

    const panelRef = createComponent(UiPopoverPanel, {
      environmentInjector: this.environmentInjector,
    });

    this.panelRef = panelRef;
    this.syncPanelInputs();
    this.appRef.attachView(panelRef.hostView);
    this.renderer.appendChild(this.document.body, panelRef.location.nativeElement);
    panelRef.changeDetectorRef.detectChanges();
  }

  private syncOutsidePointerListener(): void {
    if (this.trigger() !== 'click' || !this.overlayClickable() || this.unlistenOutsidePointer) {
      return;
    }

    this.unlistenOutsidePointer = this.renderer.listen(
      this.document,
      'pointerdown',
      (event: PointerEvent) => {
        const target = event.target;
        const panel = this.panelRef?.location.nativeElement;

        if (!(target instanceof Node) || this.element.nativeElement.contains(target)) {
          return;
        }

        if (panel?.contains(target)) {
          return;
        }

        this.hide();
      },
    );
  }

  private syncPanelInputs(): void {
    if (!this.panelRef) {
      return;
    }

    this.panelRef.setInput('content', this.content());
    this.panelRef.setInput('panelId', this.panelId());
    this.panelRef.setInput('anchorName', this.anchorName);
    this.panelRef.setInput('placement', this.placement());
    this.panelRef.setInput('role', this.role());
    this.panelRef.setInput('maxWidth', this.maxWidth());
  }

  private destroyPanel(): void {
    if (!this.panelRef) {
      return;
    }

    const panel = this.panelRef.location.nativeElement;

    if ('hidePopover' in panel && panel.matches(':popover-open')) {
      panel.hidePopover();
    }

    this.appRef.detachView(this.panelRef.hostView);
    this.panelRef.destroy();
    this.unlistenOutsidePointer?.();
    this.unlistenOutsidePointer = null;
    this.panelRef = null;
  }
}
