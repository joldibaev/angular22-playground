import { TestBed } from '@angular/core/testing';
import { SelectShowcase } from './select-showcase';
describe('SelectShowcase', () => {
  it('documents groups, multi-select, states, and forms', async () => {
    const f = TestBed.createComponent(SelectShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(5);
    expect(f.nativeElement.querySelector('ui-select[multi]')).toBeTruthy();
  });
});
