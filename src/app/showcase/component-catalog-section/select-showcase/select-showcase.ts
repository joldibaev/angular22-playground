import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiSelect } from '../../../components/ui-select/ui-select';
import { UiSelectGroup } from '../../../components/ui-select/ui-select-group/ui-select-group';
import { UiSelectOption } from '../../../components/ui-select/ui-select-option/ui-select-option';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-select-showcase',
  imports: [FormField, UiCard, UiSelect, UiSelectGroup, UiSelectOption, UiTab, UiTabItem],
  templateUrl: './select-showcase.html',
  styleUrl: './select-showcase.css',
})
export class SelectShowcase {
  readonly formModel = signal({ status: 'approved' });
  readonly formState = form(this.formModel);
  protected readonly defaultCode = `<ui-select label="Status" placeholder="Choose status">\n  <ui-select-option value="created" label="Created" />\n  <ui-select-option value="approved" label="Approved" />\n</ui-select>`;
  protected readonly groupsCode = `<ui-select label="Project">\n  <ui-select-group label="Pinned">…</ui-select-group>\n  <ui-select-group label="Workflow">…</ui-select-group>\n</ui-select>`;
  protected readonly multiCode = `<ui-select label="Labels" multi [value]="['roadmap', 'research']">…</ui-select>`;
  protected readonly statesCode = `<ui-select label="Small" size="sm">…</ui-select>\n<ui-select label="Disabled" disabled>…</ui-select>\n<ui-select label="Loading" loading />`;
  protected readonly formCode = `readonly model = signal({status: 'approved'});\nreadonly formState = form(this.model);\n\n<ui-select [formField]="formState.status">…</ui-select>`;
}
