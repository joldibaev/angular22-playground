import {
  booleanAttribute,
  Component,
  ElementRef,
  inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'ui-select-option',
  imports: [],
  templateUrl: './ui-select-option.html',
})
export class UiSelectOption {
  readonly element = inject(ElementRef<HTMLElement>);
  readonly startTemplate = viewChild.required<TemplateRef<unknown>>('start');
  readonly endTemplate = viewChild.required<TemplateRef<unknown>>('end');

  value = input.required<string>();
  label = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });
}
