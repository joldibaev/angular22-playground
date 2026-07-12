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
  protected readonly defaultCode = `<ui-tree aria-label="Project files" [items]="files" [(selected)]="selected" />`;
  protected readonly multiCode = `<ui-tree
  aria-label="Multi-select project files"
  [items]="files"
  multi
  [(selected)]="multiSelected"
/>`;
  protected readonly expansionCode = `<ui-tree
  aria-label="Tree without guides"
  [items]="files"
  [(expanded)]="expanded"
  [withGuides]="false"
/>`;
  protected readonly navCode = `<ui-tree
  aria-label="Project navigation"
  [items]="files"
  nav
  [(selected)]="navSelected"
/>`;
}
