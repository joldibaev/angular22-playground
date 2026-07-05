import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiIcon } from '../ui-icon/ui-icon';
import { UiBadge } from './ui-badge';

@Component({
  imports: [UiBadge, UiIcon],
  template: `
    <ui-badge>Secondary</ui-badge>
    <ui-badge variant="destructive" withDot>Alert</ui-badge>
    <ui-badge variant="brand">
      <ui-icon name="outline-circle-check" decorative [width]="14" [height]="14" />
      Verified
    </ui-badge>
    <ui-badge variant="contrast">High contrast</ui-badge>
    <ui-badge variant="brand" withNotificationAnimation [visible]="notificationVisible()">3</ui-badge>
  `,
})
class TestHost {
  readonly notificationVisible = signal(true);
}

describe('UiBadge', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  function badges(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('ui-badge'));
  }

  it('should render as a passive secondary badge by default', () => {
    const [badge] = badges();

    expect(badge.tagName.toLowerCase()).toBe('ui-badge');
    expect(badge.classList.contains('ui-badge-secondary')).toBe(true);
    expect(badge.textContent?.trim()).toBe('Secondary');
    expect(badge.hasAttribute('role')).toBe(false);
  });

  it('should reflect the variant input as a host class', () => {
    const [, badge] = badges();

    expect(badge.classList.contains('ui-badge-destructive')).toBe(true);
    expect(badge.classList.contains('ui-badge-secondary')).toBe(false);
  });

  it('should render a decorative status dot', () => {
    const [, badge] = badges();
    const dot = badge.querySelector('.ui-badge-dot');

    expect(dot).toBeTruthy();
    expect(dot?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should project arbitrary icon content', () => {
    const [, , badge] = badges();
    const icon = badge.querySelector('ui-icon');

    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(badge.textContent).toContain('Verified');
    expect(badge.classList.contains('ui-badge-brand')).toBe(true);
  });

  it('should expose the explicit high-contrast variant by name', () => {
    const [, , , badge] = badges();

    expect(badge.classList.contains('ui-badge-contrast')).toBe(true);
  });

  it('should animate notification visibility without removing the badge from the DOM', async () => {
    const badge = badges()[4];

    expect(badge?.classList).toContain('ui-badge-notification');
    expect(badge?.classList).toContain('ui-badge-notification-visible');
    expect(badge?.getAttribute('aria-hidden')).toBeNull();

    fixture.componentInstance.notificationVisible.set(false);
    await fixture.whenStable();

    expect(badges()[4]).toBe(badge);
    expect(badge?.classList).not.toContain('ui-badge-notification-visible');
    expect(badge?.getAttribute('aria-hidden')).toBe('true');
  });
});
