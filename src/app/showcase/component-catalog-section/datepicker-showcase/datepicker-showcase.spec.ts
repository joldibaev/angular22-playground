import { TestBed } from '@angular/core/testing';
import { DatepickerShowcase } from './datepicker-showcase';
describe('DatepickerShowcase', () => {
  it('documents dates, ranges, limits, states, and forms', async () => {
    const f = TestBed.createComponent(DatepickerShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(6);
    expect(f.nativeElement.querySelector('ui-date-range-picker')).toBeTruthy();
  });
});
