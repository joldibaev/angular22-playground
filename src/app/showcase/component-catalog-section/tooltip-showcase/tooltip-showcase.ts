import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiTooltip } from '../../../components/ui-tooltip/ui-tooltip';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
import { type UiPanelPlacement } from '../../../shared/arrow-panel';
@Component({
  selector: 'app-tooltip-showcase',
  imports: [ShowcaseCode, UiButton, UiCard, UiTooltip, UiTab, UiTabItem],
  templateUrl: './tooltip-showcase.html',
  styleUrl: './tooltip-showcase.css',
})
export class TooltipShowcase {
  protected readonly placements: readonly UiPanelPlacement[] = ['top', 'right', 'bottom', 'left'];
  protected readonly defaultCode = `<button uiButton type="button" uiTooltip="Save changes">Save</button>`;
  protected readonly triggerCode = `<button uiButton type="button" variant="outline" uiTooltip="Archive order">Archive</button>\n<a href="#component-catalog" uiTooltip="Return to catalog heading">Catalog link</a>`;
  protected readonly placementCode = `@for (placement of placements; track placement) {
  <button
    uiButton
    type="button"
    variant="outline"
    uiTooltip="Saved changes are available"
    [uiPlacement]="placement"
    uiWithFallback
  >
    {{ placement }}
  </button>
}`;
}
