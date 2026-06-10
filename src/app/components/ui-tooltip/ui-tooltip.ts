import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

export type UiTooltipVariant = 'default' | 'inverted' | 'red' | 'danger';

let nextTooltipId = 0;

function optionalBooleanAttribute(value: unknown): boolean | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return value !== false && value !== 'false';
}

@Component({
  selector: '[uiTooltip]',
  template: '<ng-content />',
  styleUrl: './ui-tooltip.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ui-tooltip]': '!hasGeneratedTooltip()',
    '[class.ui-tooltip-trigger]': 'hasGeneratedTooltip()',
    '[class.ui-tooltip-visible]': 'visible()',
    '[class.ui-tooltip-inverted]': 'variant() === "inverted"',
    '[class.ui-tooltip-red]': 'isRedVariant()',
    '[attr.role]': 'hasGeneratedTooltip() ? null : "tooltip"',
    '[attr.aria-describedby]': 'describedBy()',
    '[attr.hidden]': '!hasGeneratedTooltip() && !visible() ? "" : null',
    '(mouseenter)': 'showFromInteraction()',
    '(mouseleave)': 'hideFromInteraction()',
    '(focusin)': 'showFromInteraction()',
    '(focusout)': 'hideFromInteraction()',
    '(keydown.escape)': 'hideFromInteraction()',
  },
})
export class UiTooltip {
  readonly text = input('', { alias: 'uiTooltip' });
  readonly open = input<boolean | undefined, unknown>(undefined, {
    alias: 'uiTooltipOpen',
    transform: optionalBooleanAttribute,
  });
  readonly variant = input<UiTooltipVariant>('default', { alias: 'uiTooltipVariant' });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly interactionOpen = signal(false);
  private readonly id = nextTooltipId++;
  private readonly tooltipId = `ui-tooltip-${this.id}`;
  private readonly anchorName = `--ui-tooltip-anchor-${this.id}`;
  private generatedTooltip: HTMLElement | null = null;
  private generatedSurface: HTMLElement | null = null;

  readonly normalizedText = computed(() => this.text().trim());
  readonly hasGeneratedTooltip = computed(() => this.normalizedText().length > 0);
  readonly visible = computed(() => {
    const open = this.open();

    if (open !== undefined) {
      return open;
    }

    if (this.hasGeneratedTooltip()) {
      return this.interactionOpen();
    }

    return true;
  });
  readonly describedBy = computed(() => (this.hasGeneratedTooltip() ? this.tooltipId : null));

  constructor() {
    this.renderer.setStyle(this.element.nativeElement, 'anchor-name', this.anchorName);
    this.destroyRef.onDestroy(() => {
      this.destroyGeneratedTooltip();
    });

    effect(() => {
      this.syncGeneratedTooltip();
    });
  }

  showFromInteraction(): void {
    if (this.open() === undefined) {
      this.interactionOpen.set(true);
    }
  }

  hideFromInteraction(): void {
    if (this.open() === undefined) {
      this.interactionOpen.set(false);
    }
  }

  isRedVariant(): boolean {
    return this.variant() === 'red' || this.variant() === 'danger';
  }

  private syncGeneratedTooltip(): void {
    if (!this.hasGeneratedTooltip()) {
      this.destroyGeneratedTooltip();
      return;
    }

    this.ensureGeneratedTooltip();
    const surface = this.generatedSurface;

    if (!surface) {
      return;
    }

    this.renderer.setProperty(surface, 'textContent', this.normalizedText());
    this.syncGeneratedTooltipState();
  }

  private ensureGeneratedTooltip(): void {
    if (this.generatedTooltip && this.generatedSurface) {
      return;
    }

    const tooltip = this.renderer.createElement('span') as HTMLElement;
    const surface = this.renderer.createElement('span') as HTMLElement;

    this.renderer.setAttribute(tooltip, 'id', this.tooltipId);
    this.renderer.setAttribute(tooltip, 'role', 'tooltip');
    this.renderer.addClass(tooltip, 'ui-tooltip');
    this.renderer.addClass(tooltip, 'ui-tooltip-generated');
    this.renderer.addClass(surface, 'ui-tooltip-surface');
    this.renderer.setStyle(tooltip, 'position-anchor', this.anchorName);
    this.renderer.appendChild(tooltip, surface);
    this.renderer.appendChild(this.document.body, tooltip);

    this.generatedTooltip = tooltip;
    this.generatedSurface = surface;
  }

  private syncGeneratedTooltipState(): void {
    if (!this.generatedTooltip) {
      return;
    }

    this.setClass(this.generatedTooltip, 'ui-tooltip-visible', this.visible());
    this.setClass(this.generatedTooltip, 'ui-tooltip-inverted', this.variant() === 'inverted');
    this.setClass(this.generatedTooltip, 'ui-tooltip-red', this.isRedVariant());

    if (this.visible()) {
      this.renderer.removeAttribute(this.generatedTooltip, 'hidden');
    } else {
      this.renderer.setAttribute(this.generatedTooltip, 'hidden', '');
    }
  }

  private setClass(element: HTMLElement, className: string, enabled: boolean): void {
    if (enabled) {
      this.renderer.addClass(element, className);
    } else {
      this.renderer.removeClass(element, className);
    }
  }

  private destroyGeneratedTooltip(): void {
    if (!this.generatedTooltip) {
      return;
    }

    this.renderer.removeChild(this.document.body, this.generatedTooltip);
    this.generatedTooltip = null;
    this.generatedSurface = null;
  }
}

@Directive({
  selector: '[uiTooltipSurface]',
  host: {
    class: 'ui-tooltip-surface',
  },
})
export class UiTooltipSurface {}
