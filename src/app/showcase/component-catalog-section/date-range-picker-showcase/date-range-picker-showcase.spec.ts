import { TestBed } from '@angular/core/testing';
import { DateRangePickerShowcase } from './date-range-picker-showcase';

describe('DateRangePickerShowcase', () => {
  it('documents ranges with and without presets', async () => {
    const fixture = TestBed.createComponent(DateRangePickerShowcase);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(2);
    expect(fixture.nativeElement.querySelectorAll('ui-date-range-picker')).toHaveLength(2);
  });
});
