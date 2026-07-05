import { Component, signal } from '@angular/core';
import {
  UiContextMenu,
  UiContextMenuSelection,
} from '../../../components/ui-context-menu/ui-context-menu';
import { UiContextMenuTrigger } from '../../../components/ui-context-menu/ui-context-menu-trigger/ui-context-menu-trigger';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
import { UiMenuGroup } from '../../../components/ui-menu/ui-menu-group/ui-menu-group';
import { UiMenuItem } from '../../../components/ui-menu/ui-menu-item/ui-menu-item';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

interface DemoFile {
  readonly name: string;
  readonly kind: string;
}

@Component({
  selector: 'app-context-menu-showcase',
  imports: [
    UiCard,
    UiContextMenu,
    UiContextMenuTrigger,
    UiIcon,
    UiMenuGroup,
    UiMenuItem,
    UiTab,
    UiTabItem,
  ],
  templateUrl: './context-menu-showcase.html',
  styleUrl: './context-menu-showcase.css',
})
export class ContextMenuShowcase {
  protected readonly files: readonly DemoFile[] = [
    { name: 'Q3 forecast.xlsx', kind: 'Spreadsheet' },
    { name: 'Product brief.docx', kind: 'Document' },
    { name: 'Campaign assets', kind: 'Folder' },
  ];
  protected readonly lastAction = signal('None');
  protected readonly defaultCode = `<div
  tabindex="0"
  [uiContextMenuTrigger]="menu"
  [uiContextMenuContext]="file"
>...</div>

<ui-context-menu #menu (itemSelected)="run($event)">
  <ui-menu-item value="open">Open</ui-menu-item>
  <ui-menu-item value="delete" variant="destructive">Delete</ui-menu-item>
</ui-context-menu>`;

  protected run(selection: UiContextMenuSelection<unknown>): void {
    if (!isDemoFile(selection.context)) {
      return;
    }

    this.lastAction.set(`${selection.value}: ${selection.context.name}`);
  }
}

function isDemoFile(value: unknown): value is DemoFile {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof value.name === 'string' &&
    'kind' in value &&
    typeof value.kind === 'string'
  );
}
