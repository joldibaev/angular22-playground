import { Component, signal } from '@angular/core';
import { UiTree } from '../../../components/ui-tree/ui-tree';
import { UiTreeItem } from '../../../components/ui-tree/ui-tree.type';

@Component({
  selector: 'app-tree-showcase',
  imports: [UiTree],
  templateUrl: './tree-showcase.html',
})
export class TreeShowcase {
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
            { id: 'ui-tree.ts', label: 'ui-tree.ts', icon: 'outline-file-import' },
            { id: 'ui-tree.css', label: 'ui-tree.css', icon: 'outline-file-import' },
          ],
        },
        {
          id: 'shared',
          label: 'shared',
          icon: 'outline-folder',
          children: [{ id: 'unique-id.ts', label: 'unique-id.ts', icon: 'outline-file-import' }],
        },
        { id: 'main.ts', label: 'main.ts', icon: 'outline-file-import' },
      ],
    },
    {
      id: 'dist',
      label: 'dist',
      icon: 'outline-folder',
      disabled: true,
      children: [{ id: 'bundle.js', label: 'bundle.js', icon: 'outline-file-import' }],
    },
    { id: 'package.json', label: 'package.json', icon: 'outline-tag' },
  ];

  readonly selected = signal<string[]>(['ui-tree.ts']);
}
