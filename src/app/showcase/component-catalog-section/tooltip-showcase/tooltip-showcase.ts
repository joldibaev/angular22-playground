import { Component } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiTooltip } from '../../../components/ui-tooltip/ui-tooltip';
import { type UiPanelPlacement } from '../../../shared/arrow-panel';

@Component({
  selector: 'app-tooltip-showcase',
  imports: [UiButton, UiTooltip],
  templateUrl: './tooltip-showcase.html',
  styleUrl: './tooltip-showcase.css',
})
export class TooltipShowcase {
  readonly placements: readonly UiPanelPlacement[] = ['top', 'right', 'bottom', 'left'];
  readonly fallbackStates = [
    { label: 'Fallback on', value: true },
    { label: 'Fallback off', value: false },
  ] as const;
}
