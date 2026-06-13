import { Component, input, signal, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ui-tooltip-panel',
  templateUrl: './ui-tooltip-panel.html',
  styleUrl: './ui-tooltip-panel.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ui-tooltip',
    role: 'tooltip',
    popover: 'hint',
    '[id]': 'tooltipId()',
    '[hidden]': 'hidden()',
    '[style.position-anchor]': 'anchorName()',
  },
})
export class UiTooltipPanel {
  readonly text = input.required<string>();
  readonly tooltipId = input.required<string>();
  readonly anchorName = input.required<string>();
  readonly hidden = signal(true);

  show(): void {
    this.hidden.set(false);
  }

  hide(): void {
    this.hidden.set(true);
  }
}
