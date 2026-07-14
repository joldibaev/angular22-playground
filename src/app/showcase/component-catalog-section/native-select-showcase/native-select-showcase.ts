import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
import { UiNativeSelect } from '../../../components/ui-native-select/ui-native-select';
import { ShowcaseExample } from '../showcase-example/showcase-example';

@Component({
  selector: 'app-native-select-showcase',
  imports: [FormField, ShowcaseExample, UiIcon, UiNativeSelect],
  templateUrl: './native-select-showcase.html',
  styleUrl: './native-select-showcase.css',
})
export class NativeSelectShowcase {
  readonly value = signal('approved');
  readonly formModel = signal({ project: 'research' });
  readonly formState = form(this.formModel);

  protected readonly defaultCode = `<ui-native-select
  [(value)]="status"
  label="Status"
  placeholder="Choose status"
>
  <ui-icon slot="start" name="outline-tag" decorative />
  <option value="created">Created</option>
  <option value="approved">Approved</option>
  <option value="paid">Paid</option>
</ui-native-select>`;

  protected readonly groupsCode = `<ui-native-select label="Project" value="research">
  <optgroup label="Pinned">
    <option value="roadmap">Roadmap</option>
    <option value="research">Research</option>
  </optgroup>
  <optgroup label="Workflow">
    <option value="review">Design review</option>
    <option value="release">Release candidate</option>
  </optgroup>
</ui-native-select>`;

  protected readonly statesCode = `<ui-native-select label="Disabled" value="locked" disabled>
  <option value="locked">Locked</option>
</ui-native-select>

<ui-native-select label="Loading" loading />`;

  protected readonly formCode = `readonly formModel = signal({ project: 'research' });
readonly formState = form(this.formModel);

<ui-native-select label="Project" [formField]="formState.project">
  <option value="roadmap">Roadmap</option>
  <option value="research">Research</option>
</ui-native-select>
<output>{{ formModel().project }}</output>`;
}
