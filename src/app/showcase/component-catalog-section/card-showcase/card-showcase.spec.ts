import { TestBed } from '@angular/core/testing';
import { CardShowcase } from './card-showcase';
describe('CardShowcase', () => {
  it('documents variants and padding', async () => {
    const f = TestBed.createComponent(CardShowcase);
    await f.whenStable();
    expect(f.nativeElement.textContent).toContain('Custom padding');
  });
});
