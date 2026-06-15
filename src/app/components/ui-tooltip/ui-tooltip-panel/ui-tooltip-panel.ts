import { Component, input, ViewEncapsulation } from '@angular/core';
import { type UiPanelPlacement } from '../../../shared/arrow-panel';

@Component({
  selector: 'ui-tooltip-panel',
  templateUrl: './ui-tooltip-panel.html',
  styleUrls: ['../../../shared/arrow-panel.css', './ui-tooltip-panel.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    // `popover="hint"` gives an implicit `tooltip` role and light-dismiss; the
    // associated `interestfor` trigger handles show/hide and aria wiring natively.
    class: 'ui-tooltip arrow-panel',
    popover: 'hint',
    '[id]': 'tooltipId()',
    '[class.arrow-panel--top]': "placement() === 'top'",
    '[class.arrow-panel--bottom]': "placement() === 'bottom'",
    '[class.arrow-panel--left]': "placement() === 'left'",
    '[class.arrow-panel--right]': "placement() === 'right'",
    '[class.arrow-panel--fallback]': 'fallback()',
  },
})
export class UiTooltipPanel {
  readonly text = input.required<string>();
  readonly tooltipId = input.required<string>();
  readonly placement = input<UiPanelPlacement>('top');
  readonly fallback = input(true);
}
