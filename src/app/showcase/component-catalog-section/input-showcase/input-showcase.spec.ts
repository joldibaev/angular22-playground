import { TestBed } from '@angular/core/testing';
import { InputShowcase } from './input-showcase';
describe('InputShowcase', () => {
  it('documents text, textarea, states, and validation', async () => {
    const f = TestBed.createComponent(InputShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(5);
    expect(f.nativeElement.querySelector('textarea')).toBeTruthy();
  });
});
