import { booleanAttribute, Component, ElementRef, inject, input } from '@angular/core';

@Component({
  selector: 'ui-select-option',
  imports: [],
  templateUrl: './ui-select-option.html',
})
export class UiSelectOption {
  readonly element = inject(ElementRef<HTMLElement>);

  value = input.required<string>();
  label = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });
}
