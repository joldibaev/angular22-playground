import { TestBed } from '@angular/core/testing';
import { BadgeShowcase } from './badge-showcase';
describe('BadgeShowcase', () => {
  it('documents variants, dots, and projected icons', async () => {
    const fixture = TestBed.createComponent(BadgeShowcase);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('ui-card')).toHaveLength(5);
    expect(fixture.nativeElement.textContent).toContain('Projected icon');
    expect(fixture.nativeElement.textContent).toContain('Notification');
  });

  it('toggles the notification badge without removing it', async () => {
    const fixture = TestBed.createComponent(BadgeShowcase);
    await fixture.whenStable();

    const badge = fixture.nativeElement.querySelector(
      'ui-badge.ui-badge-notification',
    ) as HTMLElement;
    const toggle = Array.from(fixture.nativeElement.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Show notification'),
    ) as HTMLButtonElement;

    expect(badge.getAttribute('aria-hidden')).toBe('true');

    toggle.click();
    await fixture.whenStable();

    expect(badge.classList).toContain('ui-badge-notification-visible');
    expect(badge.getAttribute('aria-hidden')).toBeNull();
  });
});
