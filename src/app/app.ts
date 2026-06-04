import { Component } from '@angular/core';
import { UiAutocomplete } from './ui-autocomplete/ui-autocomplete';
import { UiAutocompleteOption } from './ui-autocomplete/ui-autocomplete-option/ui-autocomplete-option';
import { UiSelect } from './ui-select/ui-select';
import { UiSelectOption } from './ui-select/ui-select-option/ui-select-option';

@Component({
  selector: 'app-root',
  imports: [UiAutocomplete, UiAutocompleteOption, UiSelect, UiSelectOption],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
