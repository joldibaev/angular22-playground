import { Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { UiAutocomplete } from '../../../components/ui-autocomplete/ui-autocomplete';
import { UiAutocompleteOption } from '../../../components/ui-autocomplete/ui-autocomplete-option/ui-autocomplete-option';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-autocomplete-showcase',
  imports: [FormField, UiAutocomplete, UiAutocompleteOption, UiButton, UiCard, UiTab, UiTabItem],
  templateUrl: './autocomplete-showcase.html',
  styleUrl: './autocomplete-showcase.css',
})
export class AutocompleteShowcase {
  protected readonly teams = ['Platform', 'Growth', 'Support', 'Finance', 'Legal'];
  protected readonly selectedTeam = signal('team_support');
  protected readonly formModel = signal({ team: '' });
  protected readonly formState = form(this.formModel, (path) => {
    required(path.team, { message: 'Choose a team' });
  });
  protected readonly defaultCode = `<ui-autocomplete label="Team">\n  <ui-autocomplete-option value="platform" label="Platform" />\n  <ui-autocomplete-option value="growth" label="Growth" />\n</ui-autocomplete>`;
  protected readonly valueCode = `readonly team = signal('team_support');\n\n<ui-autocomplete label="Team" [(value)]="team">...</ui-autocomplete>`;
  protected readonly stateCode = `<ui-autocomplete label="Small" size="sm">...</ui-autocomplete>\n<ui-autocomplete label="Loading" loading />\n<ui-autocomplete label="Disabled" disabled>...</ui-autocomplete>`;
  protected readonly copyCode = `<ui-autocomplete label="Owner" placeholder="Search people" emptyText="No people found" loadingText="Loading people" loading>...</ui-autocomplete>`;
  protected readonly formCode = `readonly state = form(model, path => required(path.team, {message: 'Choose a team'}));\n\n<ui-autocomplete label="Team" withErrorMessage [formField]="state.team">...</ui-autocomplete>`;
}
