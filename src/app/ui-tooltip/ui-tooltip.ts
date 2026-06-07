import { Directive } from '@angular/core';

@Directive({
  selector: '[uiTooltip]',
  host: {
    class: 'ui-tooltip',
    role: 'tooltip',
  },
})
export class UiTooltip {}

@Directive({
  selector: '[uiTooltipSurface]',
  host: {
    class: 'ui-tooltip-surface',
  },
})
export class UiTooltipSurface {}
