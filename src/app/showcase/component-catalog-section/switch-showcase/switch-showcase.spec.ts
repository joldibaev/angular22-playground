import { TestBed } from '@angular/core/testing';
import { SwitchShowcase } from './switch-showcase';
describe('SwitchShowcase', () => {
  it('documents states, sizes, and form feedback', async () => {
    const f = TestBed.createComponent(SwitchShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(4);
  });
});
