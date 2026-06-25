import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { UiDateRangePicker } from '../../../components/ui-date-range-picker/ui-date-range-picker';
import { UiDatepicker } from '../../../components/ui-datepicker/ui-datepicker';

@Component({
  selector: 'app-datepicker-showcase',
  imports: [FormField, JsonPipe, UiDateRangePicker, UiDatepicker],
  templateUrl: './datepicker-showcase.html',
})
export class DatepickerShowcase {
  readonly preselectedRange = { start: '2026-06-15', end: '2026-06-20' };

  readonly model = signal({
    invoiceDate: '2026-06-15',
    requiredDate: '',
    reportRange: { start: '2026-06-15', end: '2026-06-20' },
  });

  readonly formState = form(this.model, (path) => {
    required(path.requiredDate, { message: 'Pick a date before continuing' });
  });
}
