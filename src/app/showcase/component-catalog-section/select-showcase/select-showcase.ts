import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { UiSelect } from '../../../components/ui-select/ui-select';
import { UiSelectGroup } from '../../../components/ui-select/ui-select-group/ui-select-group';
import { UiSelectOption } from '../../../components/ui-select/ui-select-option/ui-select-option';

@Component({
  selector: 'app-select-showcase',
  imports: [FormField, JsonPipe, UiSelect, UiSelectGroup, UiSelectOption],
  templateUrl: './select-showcase.html',
})
export class SelectShowcase {
  readonly projectLabels = ['Roadmap', 'Research', 'Design review', 'Release candidate'];
  readonly formModel = signal({
    status: 'approved',
    labels: ['roadmap', 'research'],
  });
  readonly formState = form(this.formModel);
}
