import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiDateRangePicker } from '../../../components/ui-date-range-picker/ui-date-range-picker';
import { UiDatepicker } from '../../../components/ui-datepicker/ui-datepicker';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-datepicker-showcase',
  imports: [ShowcaseCode, FormField, UiCard, UiDateRangePicker, UiDatepicker, UiTab, UiTabItem],
  templateUrl: './datepicker-showcase.html',
  styleUrl: './datepicker-showcase.css',
})
export class DatepickerShowcase {
  readonly range = { start: '2026-06-15', end: '2026-06-20' };
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
  protected readonly rangeCode = `<ui-date-range-picker label="Report range" [value]="range" />`;
  protected readonly presetsCode = `<ui-date-range-picker
  label="Custom range"
  [value]="range"
  [withPresets]="false"
/>`;
  protected readonly statesCode = `<ui-datepicker label="Small" size="sm" value="2026-06-15" />\n<ui-datepicker label="Disabled" value="2026-06-15" disabled />\n<ui-datepicker label="Loading" value="2026-06-15" loading />`;
  protected readonly formCode = `required(path.requiredDate, {message: 'Pick a date before continuing'});\n\n<ui-datepicker
  label="Required date"
  withErrorMessage
  [formField]="formState.requiredDate"
/>`;
}
