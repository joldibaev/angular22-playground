import { TestBed } from '@angular/core/testing';
import { SelectShowcase } from './select-showcase';
describe('SelectShowcase', () => {
  it('documents groups, states, and forms', async () => {
    const f = TestBed.createComponent(SelectShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(4);
  });
});
