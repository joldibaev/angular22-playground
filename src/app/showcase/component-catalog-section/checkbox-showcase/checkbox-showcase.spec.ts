import { TestBed } from '@angular/core/testing';
import { CheckboxShowcase } from './checkbox-showcase';
describe('CheckboxShowcase', () => {
  it('documents states, sizes, and form feedback', async () => {
    const f = TestBed.createComponent(CheckboxShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(4);
    expect(f.nativeElement.querySelector('ui-checkbox[indeterminate]')).toBeTruthy();
  });
});
