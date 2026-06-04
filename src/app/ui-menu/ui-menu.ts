import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChildren, output, viewChild } from '@angular/core';
import { Menu, MenuContent, MenuItem } from '@angular/aria/menu';
import { UiMenuItem } from './ui-menu-item/ui-menu-item';

@Component({
  selector: 'ui-menu',
  imports: [NgTemplateOutlet, Menu, MenuContent, MenuItem],
  templateUrl: './ui-menu.html',
  styleUrl: './ui-menu.css',
})
export class UiMenu {
  readonly menu = viewChild<Menu<string>>('menuPanel');
  readonly items = contentChildren(UiMenuItem);

  itemSelected = output<string>();

  onItemSelected(value: string) {
    this.itemSelected.emit(value);
    queueMicrotask(() => this.menu()?.parent()?.close());
  }
}
