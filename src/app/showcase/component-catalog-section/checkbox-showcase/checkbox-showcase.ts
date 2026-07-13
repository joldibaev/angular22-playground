import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { disabled, FormField, form, required } from '@angular/forms/signals';
import { UiCheckbox } from '../../../components/ui-checkbox/ui-checkbox';
@Component({
  selector: 'app-checkbox-showcase',
  imports: [ShowcaseExample, FormField, UiCheckbox],
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
  protected readonly validationCode = `import { signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';

readonly model = signal({terms: false});
readonly formState = form(this.model, path => {
  required(path.terms, {message: 'Accept the terms to continue'});
});

<ui-checkbox
  label="Accept terms"
  description="Required before continuing."
  withErrorMessage
  [formField]="formState.terms"
/>`;
  protected readonly disabledCode = `import { signal } from '@angular/core';
import { disabled, form } from '@angular/forms/signals';

readonly model = signal({audit: true});
readonly formState = form(this.model, path => {
  disabled(path.audit, {when: 'Managed by workspace policy'});
});

<ui-checkbox label="Audit logging" [formField]="formState.audit" />`;
}
