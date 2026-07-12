import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component, signal } from '@angular/core';
import { disabled, FormField, form, required } from '@angular/forms/signals';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiCheckbox } from '../../../components/ui-checkbox/ui-checkbox';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-checkbox-showcase',
  imports: [ShowcaseCode, FormField, UiCard, UiCheckbox, UiTab, UiTabItem],
  templateUrl: './checkbox-showcase.html',
  styleUrl: './checkbox-showcase.css',
})
export class CheckboxShowcase {
  readonly model = signal({ terms: false, audit: true });
  readonly formState = form(this.model, (path) => {
    required(path.terms, { message: 'Accept the terms to continue' });
    disabled(path.audit, { when: 'Managed by workspace policy' });
  });
  protected readonly statesCode = `<ui-checkbox label="Unchecked" description="Optional setting." />\n<ui-checkbox label="Checked" [checked]="true" />\n<ui-checkbox label="Indeterminate" indeterminate />`;
  protected readonly sizesCode = `<ui-checkbox size="sm" label="Small" [checked]="true" />\n<ui-checkbox label="Medium" [checked]="true" />`;
  protected readonly validationCode = `<ui-checkbox
  label="Accept terms"
  description="Required before continuing."
  withErrorMessage
  [formField]="formState.terms"
/>`;
  protected readonly disabledCode = `disabled(path.audit, {when: 'Managed by workspace policy'});\n\n<ui-checkbox label="Audit logging" [formField]="formState.audit" />`;
}
