import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiPopover, type UiPopoverPlacement } from '../../../components/ui-popover/ui-popover';
@Component({
  selector: 'app-popover-showcase',
  imports: [ShowcaseExample, UiButton, UiPopover],
  templateUrl: './popover-showcase.html',
  styleUrl: './popover-showcase.css',
})
export class PopoverShowcase {
  protected readonly placements: readonly UiPopoverPlacement[] = ['top', 'right', 'bottom', 'left'];
  protected readonly controlledOpen = signal(false);
  protected readonly defaultCode = `<button uiButton type="button" uiPopover [uiContent]="defaultContent">
  Open details
</button>
<ng-template #defaultContent>
  <strong>Order details</strong>
  <span>Updated two minutes ago</span>
</ng-template>`;
  protected readonly placementCode = `import { type UiPopoverPlacement } from './components/ui-popover/ui-popover';

readonly placements: readonly UiPopoverPlacement[] = ['top', 'right', 'bottom', 'left'];

@for (placement of placements; track placement) {
  <button
    uiButton
    type="button"
    variant="outline"
    uiPopover
    [uiPlacement]="placement"
    [uiContent]="placementContent"
  >
    {{ placement }}
  </button>
}
<ng-template #placementContent>
  <strong>Milestone</strong>
  <span>Ready for review</span>
</ng-template>`;
  protected readonly fallbackCode = `<button
  uiButton
  type="button"
  variant="outline"
  uiPopover
  uiWithFallback
  uiPlacement="bottom"
  [uiContent]="fallbackContent"
>
  Adaptive placement
</button>
<ng-template #fallbackContent>
  <span>Flips when the preferred side overflows.</span>
</ng-template>`;
  protected readonly richCode = `<button
  uiButton
  type="button"
  uiPopover
  uiRole="note"
  uiDescribedby
  uiMaxWidth="min(28rem, calc(100vw - 2rem))"
  [uiContent]="richContent"
>
  Quarterly review
</button>
<ng-template #richContent>
  <div class="rich">
    <strong>Quarterly review</strong>
    <p>Revenue is ahead of plan while onboarding remains the main friction point.</p>
    <dl>
      <div><dt>ARR</dt><dd>$2.4M</dd></div>
      <div><dt>Activation</dt><dd>68%</dd></div>
    </dl>
  </div>
</ng-template>`;
  protected readonly controlledCode = `import { signal } from '@angular/core';

readonly controlledOpen = signal(false);

<button
  #controlled="uiPopover"
  uiButton
  type="button"
  uiPopover
  uiPanelId="controlled-popover-example"
  [uiContent]="controlledContent"
  [uiVisible]="controlledOpen()"
  (uiVisibleChange)="controlledOpen.set($event)"
>
  Toggle content
</button>
<div class="row">
  <button uiButton type="button" size="sm" variant="ghost" (click)="controlled.show()">Show</button>
  <button uiButton type="button" size="sm" variant="ghost" (click)="controlled.hide()">Hide</button>
</div>
<ng-template #controlledContent>
  <span>Controlled by component state.</span>
</ng-template>`;
}
