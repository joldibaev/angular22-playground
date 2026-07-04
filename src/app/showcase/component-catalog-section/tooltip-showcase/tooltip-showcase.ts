import { Component } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiTooltip } from '../../../components/ui-tooltip/ui-tooltip';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
import { type UiPanelPlacement } from '../../../shared/arrow-panel';
@Component({
  selector: 'app-tooltip-showcase',
  imports: [UiButton, UiCard, UiTooltip, UiTab, UiTabItem],
  templateUrl: './tooltip-showcase.html',
  styleUrl: './tooltip-showcase.css',
})
export class TooltipShowcase {
  protected readonly placements: readonly UiPanelPlacement[] = ['top', 'right', 'bottom', 'left'];
  protected readonly defaultCode = `<button uiButton uiTooltip="Save changes">Save</button>`;
  protected readonly triggerCode = `<button uiTooltip="Archive order">Archive</button>\n<a href="/help" uiTooltip="Open help center">Help</a>`;
  protected readonly placementCode = `<button uiTooltip="Details" uiPlacement="right">Right</button>\n<button uiTooltip="Details" uiPlacement="bottom" uiWithFallback>Adaptive</button>`;
}
