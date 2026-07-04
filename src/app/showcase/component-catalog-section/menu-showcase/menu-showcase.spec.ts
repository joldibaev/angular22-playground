import { TestBed } from '@angular/core/testing';
import { MenuShowcase } from './menu-showcase';
describe('MenuShowcase', () => {
  it('documents groups, item states, icons, and selection output', async () => {
    const f = TestBed.createComponent(MenuShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(4);
    expect(f.nativeElement.textContent).toContain('Disabled and destructive');
    f.destroy();
  });
});
