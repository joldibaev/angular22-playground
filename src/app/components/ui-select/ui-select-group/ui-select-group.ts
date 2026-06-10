import { Component, contentChildren, ElementRef, inject, input } from '@angular/core';
import { UiSelectOption } from '../ui-select-option/ui-select-option';

@Component({
  selector: 'ui-select-group',
  imports: [],
  templateUrl: './ui-select-group.html',
  styleUrl: './ui-select-group.css',
})
export class UiSelectGroup {
  readonly element = inject(ElementRef<HTMLElement>);

  label = input.required<string>();
  options = contentChildren(UiSelectOption);
}
