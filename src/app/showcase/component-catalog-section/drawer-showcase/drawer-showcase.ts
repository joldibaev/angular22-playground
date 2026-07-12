import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiDrawer } from '../../../components/ui-drawer/ui-drawer';
import { UiDrawerClose } from '../../../components/ui-drawer/ui-drawer-close/ui-drawer-close';
import { UiDrawerTrigger } from '../../../components/ui-drawer/ui-drawer-trigger/ui-drawer-trigger';
import { UiSwitch } from '../../../components/ui-switch/ui-switch';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

@Component({
  selector: 'app-drawer-showcase',
  imports: [ShowcaseCode, UiButton, UiCard, UiDrawer, UiDrawerClose, UiDrawerTrigger, UiSwitch, UiTab, UiTabItem],
  templateUrl: './drawer-showcase.html',
  styleUrl: './drawer-showcase.css',
})
export class DrawerShowcase {
  protected readonly controlledOpen = signal(false);
  protected readonly onlyOpenOrders = signal(true);

  protected readonly defaultCode = `<button uiButton [uiDrawerTrigger]="drawer">
  Open filters
</button>

<ui-drawer #drawer="uiDrawer" title="Filters">
  <p>Choose which orders appear in the table.</p>
</ui-drawer>`;

  protected readonly sideCode = `<ui-drawer #startDrawer="uiDrawer" title="Navigation" side="start">
  <p>Primary destinations appear from the inline start.</p>
</ui-drawer>
<ui-drawer #endDrawer="uiDrawer" title="Filters" side="end">
  <p>Contextual tools appear from the inline end.</p>
</ui-drawer>`;

  protected readonly sizeCode = `<ui-drawer title="Compact" size="sm">
  <p>For short navigation or focused controls.</p>
</ui-drawer>
<ui-drawer title="Default" size="md">
  <p>The balanced default for most workflows.</p>
</ui-drawer>
<ui-drawer title="Wide" size="lg">
  <p>For forms and denser supporting content.</p>
</ui-drawer>`;

  protected readonly footerCode = `<ui-drawer #drawer="uiDrawer" title="Filters">
  <ui-switch
    label="Only open orders"
    [checked]="onlyOpenOrders()"
    (checkedChange)="onlyOpenOrders.set($event)"
  />

  <div uiDrawerFooter class="drawer-actions">
    <button uiButton type="button" variant="outline" (click)="onlyOpenOrders.set(false)">Reset</button>
    <button uiButton type="button" [uiDrawerClose]="drawer">Apply</button>
  </div>
</ui-drawer>`;

  protected readonly dismissCode = `<ui-drawer title="Light dismiss" dismiss="any">
  <p>Backdrop, Escape, and the close button dismiss this drawer.</p>
</ui-drawer>
<ui-drawer title="Close request" dismiss="closerequest">
  <p>Escape closes the drawer, but the backdrop does not.</p>
</ui-drawer>
<ui-drawer title="Blocking task" dismiss="none">
  <p>An explicit action is required before closing.</p>
</ui-drawer>`;

  protected readonly closeButtonCode = `<ui-drawer title="Checkout" closeLabel="Close checkout">
  <p>The built-in close button has a context-specific accessible name.</p>
</ui-drawer>

<ui-drawer #drawer="uiDrawer" title="Required step" [withCloseButton]="false" dismiss="none">
  <p>A workflow can omit the header close button when completion must be explicit.</p>
  <button uiButton type="button" [uiDrawerClose]="drawer">Done</button>
</ui-drawer>`;

  protected readonly controlledCode = `readonly drawerOpen = signal(false);

<button uiButton (click)="drawer.show()">Open from code</button>
<ui-drawer
  #drawer="uiDrawer"
  title="Controlled drawer"
  [open]="drawerOpen()"
  (openChange)="drawerOpen.set($event)"
>
  <p>The native toggle event keeps external state synchronized.</p>
  <button uiButton type="button" (click)="drawer.close()">Close from code</button>
</ui-drawer>`;
}
