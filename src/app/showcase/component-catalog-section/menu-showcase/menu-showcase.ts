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
  protected readonly defaultCode = `<button
  uiButton
  type="button"
  uiMenuTrigger
  variant="outline"
  [menu]="defaultMenu.menu()"
>
  Actions
</button>
<ui-menu #defaultMenu (itemSelected)="selected.set($event)">
  <ui-menu-item value="duplicate">
    <ui-icon slot="start" name="outline-copy" decorative />
    <span>Duplicate</span>
    <kbd slot="end">⌘D</kbd>
  </ui-menu-item>
  <ui-menu-item value="archive">
    <ui-icon slot="start" name="outline-archive" decorative />
    <span>Archive</span>
  </ui-menu-item>
</ui-menu>`;
  protected readonly groupCode = `<button
  uiButton
  type="button"
  uiMenuTrigger
  variant="outline"
  [menu]="groupedMenu.menu()"
>
  Grouped actions
</button>
<ui-menu #groupedMenu (itemSelected)="selected.set($event)">
  <ui-menu-item value="inspect">
    <ui-icon slot="start" name="outline-search" decorative />
    <span>Inspect</span>
  </ui-menu-item>
  <ui-menu-group label="Editing">
    <ui-menu-item value="duplicate">
      <ui-icon slot="start" name="outline-copy" decorative />
      <span>Duplicate</span>
    </ui-menu-item>
    <ui-menu-item value="rename">
      <ui-icon slot="start" name="outline-edit" decorative />
      <span>Rename</span>
    </ui-menu-item>
  </ui-menu-group>
  <ui-menu-group label="Danger zone">
    <ui-menu-item value="archive">
      <ui-icon slot="start" name="outline-archive" decorative />
      <span>Archive</span>
    </ui-menu-item>
  </ui-menu-group>
</ui-menu>`;
  protected readonly stateCode = `<button
  uiButton
  type="button"
  uiMenuTrigger
  variant="outline"
  [menu]="stateMenu.menu()"
>
  Item states
</button>
<ui-menu #stateMenu (itemSelected)="selected.set($event)">
  <ui-menu-item value="edit">
    <ui-icon slot="start" name="outline-pencil" decorative />
    <span>Edit</span>
  </ui-menu-item>
  <ui-menu-item value="locked" disabled>
    <ui-icon slot="start" name="outline-lock" decorative />
    <span>Locked action</span>
  </ui-menu-item>
  <ui-menu-item value="remove" variant="destructive">
    <ui-icon slot="start" name="outline-trash" decorative />
    <span>Remove</span>
  </ui-menu-item>
</ui-menu>`;
}
