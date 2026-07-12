import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
import { UiMenu } from '../../../components/ui-menu/ui-menu';
import { UiMenuGroup } from '../../../components/ui-menu/ui-menu-group/ui-menu-group';
import { UiMenuItem } from '../../../components/ui-menu/ui-menu-item/ui-menu-item';
import { UiMenuTrigger } from '../../../components/ui-menu/ui-menu-trigger/ui-menu-trigger';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-menu-showcase',
  imports: [ShowcaseCode,
    UiButton,
    UiCard,
    UiIcon,
    UiMenu,
    UiMenuGroup,
    UiMenuItem,
    UiMenuTrigger,
    UiTab,
    UiTabItem,
  ],
  templateUrl: './menu-showcase.html',
  styleUrl: './menu-showcase.css',
})
export class MenuShowcase {
  protected readonly selected = signal('None');
  protected readonly defaultCode = `<button uiButton uiMenuTrigger [menu]="menu.menu()">Actions</button>\n<ui-menu #menu (itemSelected)="run($event)">\n  <ui-menu-item value="duplicate">Duplicate</ui-menu-item>\n  <ui-menu-item value="archive">Archive</ui-menu-item>\n</ui-menu>`;
  protected readonly groupCode = `<ui-menu #menu>\n  <ui-menu-group label="Editing">\n    <ui-menu-item value="rename">Rename</ui-menu-item>\n  </ui-menu-group>\n</ui-menu>`;
  protected readonly stateCode = `<ui-menu-item value="locked" disabled>Locked action</ui-menu-item>\n<ui-menu-item value="remove" variant="destructive">Remove</ui-menu-item>`;
  protected readonly iconCode = `<button uiButton uiMenuTrigger iconOnly aria-label="More actions" [menu]="menu.menu()">...</button>`;
}
