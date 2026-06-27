import { Component, contentChildren, ElementRef, inject, input } from '@angular/core';
import { UiMenuItem } from '../ui-menu-item/ui-menu-item';

@Component({
  selector: 'ui-menu-group',
  imports: [],
  templateUrl: './ui-menu-group.html',
  host: { class: 'hidden' },
})
export class UiMenuGroup {
  readonly element = inject(ElementRef<HTMLElement>);

  readonly label = input<string>();
  readonly items = contentChildren(UiMenuItem, { descendants: true });
}
