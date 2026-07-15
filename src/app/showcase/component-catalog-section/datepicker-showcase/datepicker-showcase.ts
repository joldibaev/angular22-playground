import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { UiDatepicker } from '../../../components/ui-datepicker/ui-datepicker';
@Component({
  selector: 'app-datepicker-showcase',
  imports: [ShowcaseExample, FormField, UiDatepicker],
  templateUrl: './datepicker-showcase.html',
  styleUrl: './datepicker-showcase.css',
})
export class DatepickerShowcase {
  readonly model = signal({ requiredDate: '' });
  readonly formState = form(this.model, (path) =>
    required(path.requiredDate, { message: 'Pick a date before continuing' }),
  );
  protected readonly singleCode = `<ui-datepicker label="Invoice date" value="2026-06-15" />`;
  protected readonly limitsCode = `<ui-datepicker
  label="Delivery date"
  value="2026-06-15"
  min="2026-06-05"
  max="2026-06-25"
/>`;
  protected readonly statesCode = `<ui-datepicker label="Disabled" value="2026-06-15" disabled />\n<ui-datepicker label="Loading" value="2026-06-15" loading />`;
  protected readonly formCode = `import { signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';

readonly model = signal({requiredDate: ''});
readonly formState = form(this.model, path => {
  required(path.requiredDate, {message: 'Pick a date before continuing'});
});

<ui-datepicker
  label="Required date"
  withErrorMessage
  [formField]="formState.requiredDate"
/>`;
}
