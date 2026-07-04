import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiDrawer } from '../../../components/ui-drawer/ui-drawer';
import { UiSwitch } from '../../../components/ui-switch/ui-switch';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

@Component({
  selector: 'app-drawer-showcase',
  imports: [UiButton, UiCard, UiDrawer, UiSwitch, UiTab, UiTabItem],
  templateUrl: './drawer-showcase.html',
  styleUrl: './drawer-showcase.css',
})
export class DrawerShowcase {
  protected readonly controlledOpen = signal(false);
  protected readonly onlyOpenOrders = signal(true);

  protected readonly defaultCode = `<button uiButton command="show-modal" [attr.commandfor]="drawer.drawerId()">
  Open filters
</button>

<ui-drawer #drawer="uiDrawer" title="Filters">
  <p>Choose which orders appear in the table.</p>
</ui-drawer>`;

  protected readonly sideCode = `<ui-drawer #startDrawer="uiDrawer" title="Navigation" side="start">...</ui-drawer>
<ui-drawer #endDrawer="uiDrawer" title="Filters" side="end">...</ui-drawer>`;

  protected readonly sizeCode = `<ui-drawer title="Compact" size="sm">...</ui-drawer>
<ui-drawer title="Default" size="md">...</ui-drawer>
<ui-drawer title="Wide" size="lg">...</ui-drawer>`;

  protected readonly footerCode = `<ui-drawer #drawer="uiDrawer" title="Filters">
  <ui-switch
    label="Only open orders"
    [checked]="onlyOpenOrders()"
    (checkedChange)="onlyOpenOrders.set($event)"
  />

  <div uiDrawerFooter>
    <button uiButton variant="outline" (click)="onlyOpenOrders.set(false)">Reset</button>
    <button uiButton command="close" [attr.commandfor]="drawer.drawerId()">Apply</button>
  </div>
</ui-drawer>`;

  protected readonly dismissCode = `<ui-drawer title="Light dismiss" dismiss="any">...</ui-drawer>
<ui-drawer title="Explicit choice" dismiss="closerequest">...</ui-drawer>
<ui-drawer title="Blocking task" dismiss="none">...</ui-drawer>`;

  protected readonly closeButtonCode = `<ui-drawer title="Checkout" closeLabel="Close checkout">...</ui-drawer>

<ui-drawer #drawer="uiDrawer" title="Required step" [withCloseButton]="false" dismiss="none">
  <button uiButton command="close" [attr.commandfor]="drawer.drawerId()">Done</button>
</ui-drawer>`;

  protected readonly controlledCode = `readonly drawerOpen = signal(false);

<button uiButton (click)="drawer.show()">Open from code</button>
<ui-drawer
  #drawer="uiDrawer"
  title="Controlled drawer"
  [open]="drawerOpen()"
  (openChange)="drawerOpen.set($event)"
>
  <button uiButton (click)="drawer.close()">Close from code</button>
</ui-drawer>`;
}
