import { Component, signal } from '@angular/core';
import { disabled, FormField, form, required } from '@angular/forms/signals';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiRadio } from '../../../components/ui-radio/ui-radio';
import { UiRadioGroup } from '../../../components/ui-radio/ui-radio-group/ui-radio-group';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-radio-showcase',
  imports: [FormField, UiCard, UiRadio, UiRadioGroup, UiTab, UiTabItem],
  templateUrl: './radio-showcase.html',
  styleUrl: './radio-showcase.css',
})
export class RadioShowcase {
  readonly model = signal({ plan: '', approval: 'manual' });
  readonly formState = form(this.model, (path) => {
    required(path.plan, { message: 'Choose a billing plan' });
    disabled(path.approval, { when: 'Managed by workspace policy' });
  });
  protected readonly defaultCode = `<ui-radio-group label="Density" value="comfortable">\n  <ui-radio value="compact">Compact</ui-radio>\n  <ui-radio value="comfortable">Comfortable</ui-radio>\n</ui-radio-group>`;
  protected readonly statesCode = `<ui-radio-group size="sm" label="Plan">\n  <ui-radio value="starter">Starter</ui-radio>\n  <ui-radio value="legacy" disabled>Legacy</ui-radio>\n</ui-radio-group>`;
  protected readonly validationCode = `<ui-radio-group withErrorMessage [formField]="formState.plan">…</ui-radio-group>`;
  protected readonly disabledCode = `disabled(path.approval, {when: 'Managed by workspace policy'});\n<ui-radio-group [formField]="formState.approval">…</ui-radio-group>`;
}
