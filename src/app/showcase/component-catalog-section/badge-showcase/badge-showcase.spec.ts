import { TestBed } from '@angular/core/testing';
import { BadgeShowcase } from './badge-showcase';
describe('BadgeShowcase', () => {
  it('documents variants, dots, and projected icons', async () => {
    const fixture = TestBed.createComponent(BadgeShowcase);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('ui-card')).toHaveLength(4);
    expect(fixture.nativeElement.textContent).toContain('Projected icon');
  });
});
