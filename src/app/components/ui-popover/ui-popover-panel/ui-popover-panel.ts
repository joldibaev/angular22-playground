import { NgTemplateOutlet } from '@angular/common';
import { Component, input, signal, TemplateRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ui-popover-panel',
  imports: [NgTemplateOutlet],
  templateUrl: './ui-popover-panel.html',
  styleUrl: './ui-popover-panel.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ui-popover-panel',
    popover: 'manual',
    '[id]': 'panelId()',
    '[hidden]': 'hidden()',
    '[attr.role]': 'role()',
    '[class.ui-popover-panel-top]': 'placement() === "top"',
    '[class.ui-popover-panel-bottom]': 'placement() === "bottom"',
    '[style.position-anchor]': 'anchorName()',
    '[style.--ui-popover-max-width]': 'maxWidth() || null',
  },
})
export class UiPopoverPanel {
  readonly content = input.required<TemplateRef<unknown>>();
  readonly panelId = input.required<string>();
  readonly anchorName = input.required<string>();
  readonly placement = input<'top' | 'bottom'>('top');
  readonly role = input<string | null>(null);
  readonly maxWidth = input('');
  readonly hidden = signal(true);

  show(): void {
    this.hidden.set(false);
  }

  hide(): void {
    this.hidden.set(true);
  }
}
