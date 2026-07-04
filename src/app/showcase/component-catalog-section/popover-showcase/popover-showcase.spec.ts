import { TestBed } from '@angular/core/testing';
import { PopoverShowcase } from './popover-showcase';
describe('PopoverShowcase', () => {
  it('documents placement, fallback, semantics, and controlled state', async () => {
    const f = TestBed.createComponent(PopoverShowcase);
    await f.whenStable();
    await f.whenRenderingDone();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(5);
    expect(f.nativeElement.textContent).toContain('Controlled and programmatic');
    f.destroy();
  });
});
