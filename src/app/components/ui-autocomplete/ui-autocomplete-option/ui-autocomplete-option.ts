import { booleanAttribute, Component, input, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'ui-autocomplete-option',
  imports: [],
  templateUrl: './ui-autocomplete-option.html',
  host: { class: 'hidden' },
})
export class UiAutocompleteOption {
  readonly startTemplate = viewChild.required<TemplateRef<unknown>>('start');
  readonly endTemplate = viewChild.required<TemplateRef<unknown>>('end');

  value = input.required<string>();
  label = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });
}
