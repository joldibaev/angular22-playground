import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'ui-autocomplete-option',
  imports: [],
  templateUrl: './ui-autocomplete-option.html',
  host: { class: 'hidden' },
})
export class UiAutocompleteOption {
  value = input.required<string>();
  label = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });
}
