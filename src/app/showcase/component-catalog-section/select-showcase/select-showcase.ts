import { Component } from '@angular/core';
import { UiSelect } from '../../../components/ui-select/ui-select';
import { UiSelectGroup } from '../../../components/ui-select/ui-select-group/ui-select-group';
import { UiSelectOption } from '../../../components/ui-select/ui-select-option/ui-select-option';

@Component({
  selector: 'app-select-showcase',
  imports: [UiSelect, UiSelectGroup, UiSelectOption],
  templateUrl: './select-showcase.html',
})
export class SelectShowcase {
  readonly projectLabels = ['Roadmap', 'Research', 'Design review', 'Release candidate'];
}
