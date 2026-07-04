import { TestBed } from '@angular/core/testing';
import { RadioShowcase } from './radio-showcase';
describe('RadioShowcase', () => {
  it('documents groups, sizing, validation, and disabled reasons', async () => {
    const f = TestBed.createComponent(RadioShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(4);
    expect(f.nativeElement.querySelector('ui-radio[disabled]')).toBeTruthy();
  });
});
