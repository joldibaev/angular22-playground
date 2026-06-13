import { Component } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiTooltip } from '../../../components/ui-tooltip/ui-tooltip';

@Component({
  selector: 'app-tooltip-showcase',
  imports: [UiButton, UiTooltip],
  templateUrl: './tooltip-showcase.html',
})
export class TooltipShowcase {}
