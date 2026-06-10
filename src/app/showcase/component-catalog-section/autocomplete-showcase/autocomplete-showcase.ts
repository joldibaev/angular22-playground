import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { UiAutocomplete } from '../../../components/ui-autocomplete/ui-autocomplete';
import { UiAutocompleteOption } from '../../../components/ui-autocomplete/ui-autocomplete-option/ui-autocomplete-option';

@Component({
  selector: 'app-autocomplete-showcase',
  imports: [FormField, JsonPipe, UiAutocomplete, UiAutocompleteOption],
  templateUrl: './autocomplete-showcase.html',
})
export class AutocompleteShowcase {
  readonly teams = ['Platform', 'Growth', 'Support', 'Finance', 'Legal'];
  readonly formModel = signal({
    team: 'team_support',
  });
  readonly formState = form(this.formModel);
}
