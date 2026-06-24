import { DOCUMENT } from '@angular/common';
import {
  afterRenderEffect,
  ApplicationRef,
  booleanAttribute,
  ComponentRef,
  computed,
  createComponent,
  DestroyRef,
  Directive,
  EnvironmentInjector,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import { type UiPanelPlacement } from '../../shared/arrow-panel';
import { nextId } from '../../shared/unique-id';
import { UiTooltipPanel } from './ui-tooltip-panel/ui-tooltip-panel';

/**
 * Attaches a hover/focus/long-press tooltip to a `button` or `a` using the
 * native Interest Invokers API. The browser handles intent timing, light
 * dismiss, `Escape`, and the accessible description (`aria-describedby`), so the
 * directive only has to render the panel and point `interestfor` at it.
 */
@Directive({
  selector: 'button[uiTooltip], a[uiTooltip]',
  host: {
    class: 'ui-tooltip-trigger',
    '[attr.interestfor]': 'normalizedText() ? tooltipId : null',
  },
})
export class UiTooltip {
  readonly text = input('', { alias: 'uiTooltip' });
  readonly placement = input<UiPanelPlacement>('top', { alias: 'uiPlacement' });
  readonly withFallback = input(false, { alias: 'uiWithFallback', transform: booleanAttribute });

  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);

  readonly tooltipId = `ui-tooltip-${nextId()}`;
  private panelRef: ComponentRef<UiTooltipPanel> | null = null;

  readonly normalizedText = computed(() => this.text().trim());

  constructor() {
    this.destroyRef.onDestroy(() => this.destroyPanel());
    afterRenderEffect(() => this.syncPanel());
  }

  private syncPanel(): void {
    const text = this.normalizedText();

    if (!text) {
      this.destroyPanel();
      return;
    }

    this.ensurePanel();
    this.panelRef!.setInput('text', text);
    this.panelRef!.setInput('placement', this.placement());
    this.panelRef!.setInput('withFallback', this.withFallback());
    this.panelRef!.changeDetectorRef.detectChanges();
  }

  private ensurePanel(): void {
    if (this.panelRef) {
      return;
    }

    const panelRef = createComponent(UiTooltipPanel, {
      environmentInjector: this.environmentInjector,
    });

    panelRef.setInput('tooltipId', this.tooltipId);
    panelRef.setInput('text', this.normalizedText());
    this.appRef.attachView(panelRef.hostView);
    this.renderer.appendChild(this.document.body, panelRef.location.nativeElement);

    this.panelRef = panelRef;
  }

  private destroyPanel(): void {
    if (!this.panelRef) {
      return;
    }

    this.appRef.detachView(this.panelRef.hostView);
    this.panelRef.destroy();
    this.panelRef = null;
  }
}
