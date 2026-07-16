import { booleanAttribute, Component, input, output, ViewEncapsulation } from '@angular/core';
import { type UiPanelPlacement } from '../../../shared/arrow-panel';
import { UiButton } from '../../ui-button/ui-button';

export type UiConfirmPopupTone = 'default' | 'destructive';
export type UiConfirmPopupDefaultFocus = 'confirm' | 'cancel' | 'none';

@Component({
  selector: 'ui-confirm-popup-panel',
  imports: [UiButton],
  templateUrl: './ui-confirm-popup-panel.html',
  styleUrls: ['../../../shared/arrow-panel.css', './ui-confirm-popup-panel.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ui-confirm-popup-panel arrow-panel',
    popover: 'auto',
    role: 'dialog',
    '[id]': 'panelId()',
    '[attr.aria-labelledby]': 'messageId()',
    '[class.arrow-panel--top]': "placement() === 'top'",
    '[class.arrow-panel--bottom]': "placement() === 'bottom'",
    '[class.arrow-panel--left]': "placement() === 'left'",
    '[class.arrow-panel--right]': "placement() === 'right'",
    '[class.arrow-panel--fallback]': 'withFallback()',
    '[style.position-anchor]': 'anchorName()',
  },
})
export class UiConfirmPopupPanel {
  readonly message = input.required<string>();
  readonly confirmLabel = input('Подтвердить');
  readonly cancelLabel = input('Отмена');
  readonly tone = input<UiConfirmPopupTone>('default');
  readonly defaultFocus = input<UiConfirmPopupDefaultFocus>('cancel');
  readonly panelId = input.required<string>();
  readonly messageId = input.required<string>();
  readonly anchorName = input.required<string>();
  readonly placement = input<UiPanelPlacement>('bottom');
  readonly withFallback = input(false, { transform: booleanAttribute });
  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
