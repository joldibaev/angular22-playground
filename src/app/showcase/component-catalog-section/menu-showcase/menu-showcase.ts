import { Component, signal } from '@angular/core';
import { UiMenu } from '../../../components/ui-menu/ui-menu';
import { UiMenuItem } from '../../../components/ui-menu/ui-menu-item/ui-menu-item';
import { UiMenuTrigger } from '../../../components/ui-menu/ui-menu-trigger/ui-menu-trigger';

@Component({
  selector: 'app-menu-showcase',
  imports: [UiMenu, UiMenuItem, UiMenuTrigger],
  templateUrl: './menu-showcase.html',
})
export class MenuShowcase {
  readonly selectedCommand = signal('No command selected yet');
}
