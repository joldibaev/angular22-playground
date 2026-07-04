import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiPopover, type UiPopoverPlacement } from '../../../components/ui-popover/ui-popover';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-popover-showcase',
  imports: [UiButton, UiCard, UiPopover, UiTab, UiTabItem],
  templateUrl: './popover-showcase.html',
  styleUrl: './popover-showcase.css',
})
export class PopoverShowcase {
  protected readonly placements: readonly UiPopoverPlacement[] = ['top', 'right', 'bottom', 'left'];
  protected readonly controlledOpen = signal(false);
  protected readonly defaultCode = `<button uiButton uiPopover [uiContent]="content">Open details</button>\n<ng-template #content>Popover content</ng-template>`;
  protected readonly placementCode = `<button uiPopover uiPlacement="top" [uiContent]="content">Top</button>\n<button uiPopover uiPlacement="right" [uiContent]="content">Right</button>`;
  protected readonly fallbackCode = `<button uiPopover uiWithFallback uiPlacement="bottom" [uiContent]="content">Adaptive</button>`;
  protected readonly richCode = `<button uiPopover uiRole="note" uiDescribedby uiMaxWidth="min(28rem, calc(100vw - 2rem))" [uiContent]="details">Quarterly review</button>`;
  protected readonly controlledCode = `readonly open = signal(false);\n\n<button #popover="uiPopover" uiPopover [uiVisible]="open()" (uiVisibleChange)="open.set($event)" [uiContent]="content">Toggle</button>\n<button (click)="popover.show()">Show</button>\n<button (click)="popover.hide()">Hide</button>`;
}
