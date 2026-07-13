import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { UiTree } from '../../../components/ui-tree/ui-tree';
import { type UiTreeItem } from '../../../components/ui-tree/ui-tree.type';
const FILES: UiTreeItem[] = [
  {
    id: 'src',
    label: 'src',
    icon: 'outline-folder',
    expanded: true,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: 'outline-folder',
        selectable: false,
        expanded: true,
        children: [
          { id: 'tree-ts', label: 'ui-tree.ts', icon: 'outline-file-import' },
          { id: 'tree-css', label: 'ui-tree.css', icon: 'outline-file-import' },
        ],
      },
      { id: 'main', label: 'main.ts', icon: 'outline-file-import' },
    ],
  },
  {
    id: 'dist',
    label: 'dist',
    icon: 'outline-folder',
    disabled: true,
    children: [{ id: 'bundle', label: 'bundle.js' }],
  },
  { id: 'package', label: 'package.json', icon: 'outline-tag' },
];
@Component({
  selector: 'app-tree-showcase',
  imports: [ShowcaseExample, UiTree],
  templateUrl: './tree-showcase.html',
  styleUrl: './tree-showcase.css',
})
export class TreeShowcase {
  protected readonly files = FILES;
  protected readonly selected = signal<string[]>(['tree-ts']);
  protected readonly multiSelected = signal<string[]>(['tree-ts', 'package']);
  protected readonly expanded = signal<string[] | undefined>(['src', 'components']);
  protected readonly navSelected = signal<string[]>(['main']);
  protected readonly defaultCode = `import { signal } from '@angular/core';
import { UiTree } from './components/ui-tree/ui-tree';
import { type UiTreeItem } from './components/ui-tree/ui-tree.type';

// Add UiTree to the component's imports.
readonly files: UiTreeItem[] = [
  {
    id: 'src',
    label: 'src',
    icon: 'outline-folder',
    expanded: true,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: 'outline-folder',
        selectable: false,
        expanded: true,
        children: [
          {id: 'tree-ts', label: 'ui-tree.ts', icon: 'outline-file-import'},
          {id: 'tree-css', label: 'ui-tree.css', icon: 'outline-file-import'},
        ],
      },
      {id: 'main', label: 'main.ts', icon: 'outline-file-import'},
    ],
  },
  {
    id: 'dist',
    label: 'dist',
    icon: 'outline-folder',
    disabled: true,
    children: [{id: 'bundle', label: 'bundle.js'}],
  },
  {id: 'package', label: 'package.json', icon: 'outline-tag'},
];
readonly selected = signal<string[]>(['tree-ts']);

<ui-tree aria-label="Project files" [items]="files" [(selected)]="selected" />
<output>Selected: {{ selected().join(', ') || 'None' }}</output>`;
  protected readonly multiCode = `import { signal } from '@angular/core';
import { UiTree } from './components/ui-tree/ui-tree';
import { type UiTreeItem } from './components/ui-tree/ui-tree.type';

readonly files: UiTreeItem[] = [
  {id: 'src', label: 'src', children: [{id: 'main', label: 'main.ts'}]},
  {id: 'package', label: 'package.json'},
];
readonly multiSelected = signal<string[]>([
  'main',
  'package',
]);

<ui-tree
  aria-label="Multi-select project files"
  [items]="files"
  multi
  [(selected)]="multiSelected"
/>
<output>Selected: {{ multiSelected().join(', ') || 'None' }}</output>`;
  protected readonly expansionCode = `import { signal } from '@angular/core';
import { UiTree } from './components/ui-tree/ui-tree';
import { type UiTreeItem } from './components/ui-tree/ui-tree.type';

readonly files: UiTreeItem[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {id: 'components', label: 'components', children: [{id: 'tree', label: 'ui-tree.ts'}]},
    ],
  },
];
readonly expanded = signal<string[] | undefined>([
  'src',
  'components',
]);

<ui-tree
  aria-label="Tree with controlled expansion"
  [items]="files"
  [(expanded)]="expanded"
/>
<output>Expanded: {{ expanded()?.join(', ') || 'None' }}</output>`;
  protected readonly withoutGuidesCode = `import { UiTree } from './components/ui-tree/ui-tree';
import { type UiTreeItem } from './components/ui-tree/ui-tree.type';

readonly files: UiTreeItem[] = [
  {
    id: 'src',
    label: 'src',
    expanded: true,
    children: [
      {id: 'components', label: 'components'},
      {id: 'main', label: 'main.ts'},
    ],
  },
  {id: 'package', label: 'package.json'},
];

<ui-tree
  aria-label="Project files without guides"
  [items]="files"
  [withGuides]="false"
/>`;
  protected readonly navCode = `import { signal } from '@angular/core';
import { UiTree } from './components/ui-tree/ui-tree';
import { type UiTreeItem } from './components/ui-tree/ui-tree.type';

readonly navSelected = signal<string[]>(['main']);
readonly files: UiTreeItem[] = [
  {
    id: 'src',
    label: 'src',
    selectable: false,
    expanded: true,
    children: [{id: 'main', label: 'main.ts'}],
  },
  {id: 'dist', label: 'dist', disabled: true},
];

<ui-tree
  aria-label="Project navigation"
  [items]="files"
  nav
  [(selected)]="navSelected"
/>
<output>Current page: {{ navSelected()[0] || 'None' }}</output>`;
}
