import { DOCUMENT } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  DestroyRef,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';

let nextTooltipId = 0;

@Component({
  selector: '[uiTooltip]',
  template: '<ng-content />',
  styleUrl: './ui-tooltip.css',
  encapsulation: ViewEncapsulation.None,
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
  private readonly id = nextTooltipId++;
  readonly tooltipId = `ui-tooltip-${this.id}`;
  private readonly anchorName = `--ui-tooltip-anchor-${this.id}`;
  private tooltip: HTMLElement | null = null;
  private surface: HTMLElement | null = null;

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

    if (!this.tooltip) {
      return;
    }

    this.renderer.removeAttribute(this.tooltip, 'hidden');

    if ('showPopover' in this.tooltip && !this.tooltip.matches(':popover-open')) {
      this.tooltip.showPopover();
    }
  }

  hide(): void {
    if (!this.tooltip) {
      return;
    }

    if ('hidePopover' in this.tooltip && this.tooltip.matches(':popover-open')) {
      this.tooltip.hidePopover();
    }

    this.renderer.setAttribute(this.tooltip, 'hidden', '');
  }

  private syncTooltip(): void {
    if (!this.normalizedText()) {
      this.destroyTooltip();
      return;
    }

    this.ensureTooltip();

    if (!this.tooltip || !this.surface) {
      return;
    }

    this.renderer.setProperty(this.surface, 'textContent', this.normalizedText());
  }

  private ensureTooltip(): void {
    if (this.tooltip && this.surface) {
      return;
    }

    const tooltip = this.renderer.createElement('span') as HTMLElement;
    const surface = this.renderer.createElement('span') as HTMLElement;

    this.renderer.setAttribute(tooltip, 'id', this.tooltipId);
    this.renderer.setAttribute(tooltip, 'role', 'tooltip');
    this.renderer.setAttribute(tooltip, 'popover', 'hint');
    this.renderer.setAttribute(tooltip, 'hidden', '');
    this.renderer.addClass(tooltip, 'ui-tooltip');
    this.renderer.addClass(surface, 'ui-tooltip-surface');
    this.renderer.setStyle(tooltip, 'position-anchor', this.anchorName);
    this.renderer.appendChild(tooltip, surface);
    this.renderer.appendChild(this.document.body, tooltip);

    this.tooltip = tooltip;
    this.surface = surface;
  }

  private destroyTooltip(): void {
    if (!this.tooltip) {
      return;
    }

    if ('hidePopover' in this.tooltip && this.tooltip.matches(':popover-open')) {
      this.tooltip.hidePopover();
    }

    this.renderer.removeChild(this.document.body, this.tooltip);
    this.tooltip = null;
    this.surface = null;
  }
}
