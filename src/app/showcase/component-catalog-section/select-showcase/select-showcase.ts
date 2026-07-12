import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
import { UiSelect } from '../../../components/ui-select/ui-select';
import { UiSelectGroup } from '../../../components/ui-select/ui-select-group/ui-select-group';
import { UiSelectOption } from '../../../components/ui-select/ui-select-option/ui-select-option';
@Component({
  selector: 'app-select-showcase',
  imports: [ShowcaseExample, FormField, UiIcon, UiSelect, UiSelectGroup, UiSelectOption],
  templateUrl: './select-showcase.html',
  styleUrl: './select-showcase.css',
})
export class SelectShowcase {
  readonly formModel = signal({ status: 'approved' });
  readonly formState = form(this.formModel);
  protected readonly defaultCode = `<ui-select label="Status" placeholder="Choose status">
  <ui-icon slot="start" name="outline-tag" decorative />
  <ui-select-option value="created" label="Created">
    <ui-icon slot="start" name="outline-notes" decorative />
  </ui-select-option>
  <ui-select-option value="approved" label="Approved">
    <ui-icon slot="start" name="outline-circle-check" decorative />
    <span slot="end">Ready</span>
  </ui-select-option>
  <ui-select-option value="paid" label="Paid" />
</ui-select>`;
  protected readonly groupsCode = `<ui-select label="Project" value="research">\n  <ui-select-group label="Pinned">\n    <ui-select-option value="roadmap" label="Roadmap" />\n    <ui-select-option value="research" label="Research" />\n  </ui-select-group>\n  <ui-select-group label="Workflow">\n    <ui-select-option value="review" label="Design review" />\n    <ui-select-option value="release" label="Release candidate" />\n  </ui-select-group>\n</ui-select>`;
  protected readonly statesCode = `<ui-select label="Disabled" disabled>\n  <ui-select-option value="locked" label="Locked" />\n</ui-select>\n<ui-select label="Loading" loading />`;
  protected readonly formCode = `readonly formModel = signal({status: 'approved'});\nreadonly formState = form(formModel);\n\n<ui-select label="Status" [formField]="formState.status">\n  <ui-select-option value="created" label="Created" />\n  <ui-select-option value="approved" label="Approved" />\n</ui-select>\n<output>{{ formModel().status }}</output>`;
}
