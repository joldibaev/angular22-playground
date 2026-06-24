import { Component } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiDrawer } from '../../../components/ui-drawer/ui-drawer';

@Component({
  selector: 'app-drawer-showcase',
  imports: [UiButton, UiDrawer],
  templateUrl: './drawer-showcase.html',
})
export class DrawerShowcase {}
