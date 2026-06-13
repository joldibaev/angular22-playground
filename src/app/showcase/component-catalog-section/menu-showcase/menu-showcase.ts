import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiMenu } from '../../../components/ui-menu/ui-menu';
import { UiMenuItem } from '../../../components/ui-menu/ui-menu-item/ui-menu-item';
import { UiMenuTrigger } from '../../../components/ui-menu/ui-menu-trigger/ui-menu-trigger';

@Component({
  selector: 'app-menu-showcase',
  imports: [UiButton, UiMenu, UiMenuItem, UiMenuTrigger],
  templateUrl: './menu-showcase.html',
})
export class MenuShowcase {
  readonly selectedCommand = signal('No command selected yet');
}
