import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  afterRenderEffect,
  ComponentRef,
  createComponent,
  Directive,
  DestroyRef,
  ElementRef,
  EnvironmentInjector,
  Renderer2,
  computed,
  inject,
  input,
} from '@angular/core';
import { UiTooltipPanel } from './ui-tooltip-panel/ui-tooltip-panel';

let nextTooltipId = 0;

@Directive({
  selector: '[uiTooltip]',
  host: {
    class: 'ui-tooltip-trigger',
    '[attr.aria-describedby]': 'normalizedText() ? tooltipId : null',
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focusin)': 'show()',
    '(focusout)': 'hide()',
    '(keydown.escape)': 'hide()',
  },
})
export class UiTooltip {
  readonly text = input('', { alias: 'uiTooltip' });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly id = nextTooltipId++;
  readonly tooltipId = `ui-tooltip-${this.id}`;
  private readonly anchorName = `--ui-tooltip-anchor-${this.id}`;
  private tooltipRef: ComponentRef<UiTooltipPanel> | null = null;

  readonly normalizedText = computed(() => this.text().trim());

  constructor() {
    this.renderer.setStyle(this.element.nativeElement, 'anchor-name', this.anchorName);
    this.destroyRef.onDestroy(() => this.destroyTooltip());

    afterRenderEffect(() => {
      this.syncTooltip();
    });
  }

  show(): void {
    if (!this.normalizedText()) {
      return;
    }

    this.ensureTooltip();

    if (!this.tooltipRef) {
      return;
    }

    const tooltip = this.tooltipRef.location.nativeElement;

    this.tooltipRef.instance.show();
    this.tooltipRef.changeDetectorRef.detectChanges();

    if ('showPopover' in tooltip && !tooltip.matches(':popover-open')) {
      tooltip.showPopover();
    }
  }

  hide(): void {
    if (!this.tooltipRef) {
      return;
    }

    const tooltip = this.tooltipRef.location.nativeElement;

    if ('hidePopover' in tooltip && tooltip.matches(':popover-open')) {
      tooltip.hidePopover();
    }

    this.tooltipRef.instance.hide();
    this.tooltipRef.changeDetectorRef.detectChanges();
  }

  private syncTooltip(): void {
    if (!this.normalizedText()) {
      this.destroyTooltip();
      return;
    }

    this.ensureTooltip();

    if (!this.tooltipRef) {
      return;
    }

    this.tooltipRef.setInput('text', this.normalizedText());
    this.tooltipRef.changeDetectorRef.detectChanges();
  }

  private ensureTooltip(): void {
    if (this.tooltipRef) {
      return;
    }

    const tooltipRef = createComponent(UiTooltipPanel, {
      environmentInjector: this.environmentInjector,
    });
    const tooltip = tooltipRef.location.nativeElement;

    tooltipRef.setInput('text', this.normalizedText());
    tooltipRef.setInput('tooltipId', this.tooltipId);
    tooltipRef.setInput('anchorName', this.anchorName);
    this.appRef.attachView(tooltipRef.hostView);
    this.renderer.appendChild(this.document.body, tooltip);
    tooltipRef.changeDetectorRef.detectChanges();

    this.tooltipRef = tooltipRef;
  }

  private destroyTooltip(): void {
    if (!this.tooltipRef) {
      return;
    }

    const tooltip = this.tooltipRef.location.nativeElement;

    if ('hidePopover' in tooltip && tooltip.matches(':popover-open')) {
      tooltip.hidePopover();
    }

    this.appRef.detachView(this.tooltipRef.hostView);
    this.tooltipRef.destroy();
    this.tooltipRef = null;
  }
}
