import { TestBed } from '@angular/core/testing';
import { TooltipShowcase } from './tooltip-showcase';
describe('TooltipShowcase', () => {
  it('documents native triggers, placements, and fallback', async () => {
    const f = TestBed.createComponent(TooltipShowcase);
    await f.whenStable();
    await f.whenRenderingDone();
    expect(f.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(3);
    expect(f.nativeElement.querySelector('a[interestfor]')).toBeTruthy();
    f.destroy();
  });
});
