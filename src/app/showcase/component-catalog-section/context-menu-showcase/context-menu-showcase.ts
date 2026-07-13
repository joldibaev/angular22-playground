import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import {
  UiContextMenu,
  UiContextMenuSelection,
} from '../../../components/ui-context-menu/ui-context-menu';
import { UiContextMenuTrigger } from '../../../components/ui-context-menu/ui-context-menu-trigger/ui-context-menu-trigger';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
import { UiMenuGroup } from '../../../components/ui-menu/ui-menu-group/ui-menu-group';
import { UiMenuItem } from '../../../components/ui-menu/ui-menu-item/ui-menu-item';

interface DemoFile {
  readonly name: string;
  readonly kind: string;
}

@Component({
  selector: 'app-context-menu-showcase',
  imports: [ShowcaseExample, UiContextMenu, UiContextMenuTrigger, UiIcon, UiMenuGroup, UiMenuItem],
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
  protected readonly defaultCode = `import { signal } from '@angular/core';
import { type UiContextMenuSelection } from './components/ui-context-menu/ui-context-menu';

interface FileItem {
  name: string;
  kind: string;
}

readonly files: readonly FileItem[] = [
  {name: 'Q3 forecast.xlsx', kind: 'Spreadsheet'},
  {name: 'Product brief.docx', kind: 'Document'},
  {name: 'Campaign assets', kind: 'Folder'},
];
readonly lastAction = signal('None');

run(selection: UiContextMenuSelection<FileItem>): void {
  this.lastAction.set(selection.value + ': ' + selection.context.name);
}

@for (file of files; track file.name) {
  <div
    class="file"
    tabindex="0"
    [uiContextMenuTrigger]="fileMenu"
    [uiContextMenuContext]="file"
  >
    <ui-icon name="outline-file-import" decorative />
    <strong>{{ file.name }}</strong>
    <span>{{ file.kind }}</span>
  </div>
}

<ui-context-menu #fileMenu (itemSelected)="run($event)">
  <ui-menu-item value="open">Open</ui-menu-item>
  <ui-menu-group label="Organize">
    <ui-menu-item value="rename">
      <ui-icon slot="start" name="outline-edit" decorative />
      <span>Rename</span>
    </ui-menu-item>
    <ui-menu-item value="duplicate">
      <ui-icon slot="start" name="outline-copy" decorative />
      <span>Duplicate</span>
    </ui-menu-item>
  </ui-menu-group>
  <ui-menu-item value="delete" variant="destructive">
    <ui-icon slot="start" name="outline-trash" decorative />
    <span>Delete</span>
  </ui-menu-item>
</ui-context-menu>
<output>Last action: {{ lastAction() }}</output>`;

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
