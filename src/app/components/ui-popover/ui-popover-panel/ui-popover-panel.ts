import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, Component, input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { type UiPanelPlacement } from '../../../shared/arrow-panel';

@Component({
  selector: 'ui-popover-panel',
  imports: [NgTemplateOutlet],
  templateUrl: './ui-popover-panel.html',
  styleUrls: ['../../../shared/arrow-panel.css', './ui-popover-panel.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    // `popover="auto"` gives native light dismiss, `Escape`, and top-layer
    // focus handling; visibility is driven by the trigger's command.
    class: 'ui-popover-panel arrow-panel',
    popover: 'auto',
    '[id]': 'panelId()',
    '[attr.role]': 'role()',
    '[class.arrow-panel--top]': "placement() === 'top'",
    '[class.arrow-panel--bottom]': "placement() === 'bottom'",
    '[class.arrow-panel--left]': "placement() === 'left'",
    '[class.arrow-panel--right]': "placement() === 'right'",
    '[class.arrow-panel--fallback]': 'withFallback()',
    '[style.position-anchor]': 'anchorName()',
    '[style.--ui-popover-max-width]': 'maxWidth() || null',
  },
})
export class UiPopoverPanel {
  readonly content = input.required<TemplateRef<unknown>>();
  readonly panelId = input.required<string>();
  readonly anchorName = input.required<string>();
  readonly placement = input<UiPanelPlacement>('top');
  readonly withFallback = input(false, { transform: booleanAttribute });
  readonly role = input<string | null>(null);
  readonly maxWidth = input('');
}
