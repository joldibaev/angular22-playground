import { Component } from '@angular/core';
import { UiAutocomplete } from '../../../components/ui-autocomplete/ui-autocomplete';
import { UiAutocompleteOption } from '../../../components/ui-autocomplete/ui-autocomplete-option/ui-autocomplete-option';

@Component({
  selector: 'app-autocomplete-showcase',
  imports: [UiAutocomplete, UiAutocompleteOption],
  templateUrl: './autocomplete-showcase.html',
})
export class AutocompleteShowcase {
  readonly teams = ['Platform', 'Growth', 'Support', 'Finance', 'Legal'];
}
