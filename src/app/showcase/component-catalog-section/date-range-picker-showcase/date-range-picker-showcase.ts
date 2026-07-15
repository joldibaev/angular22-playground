import { Component } from '@angular/core';
import { UiDateRangePicker } from '../../../components/ui-date-range-picker/ui-date-range-picker';
import { ShowcaseExample } from '../showcase-example/showcase-example';

@Component({
  selector: 'app-date-range-picker-showcase',
  imports: [ShowcaseExample, UiDateRangePicker],
  templateUrl: './date-range-picker-showcase.html',
  styleUrl: './date-range-picker-showcase.css',
})
export class DateRangePickerShowcase {
  readonly range = { start: '2026-06-15', end: '2026-06-20' };

  protected readonly rangeCode = `readonly range = {start: '2026-06-15', end: '2026-06-20'};

<ui-date-range-picker label="Report range" [value]="range" />`;
  protected readonly presetsCode = `readonly range = {start: '2026-06-15', end: '2026-06-20'};

<ui-date-range-picker
  label="Custom range"
  [value]="range"
  [withPresets]="false"
/>`;
}
