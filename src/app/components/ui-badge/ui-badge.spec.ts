import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiIcon } from '../ui-icon/ui-icon';
import { UiBadge } from './ui-badge';

@Component({
  imports: [UiBadge, UiIcon],
  template: `
    <ui-badge>Default</ui-badge>
    <ui-badge variant="destructive" rounded size="sm" withDot>Alert</ui-badge>
    <ui-badge variant="brand">
      <ui-icon name="outline-circle-check" decorative [width]="14" [height]="14" />
      Verified
    </ui-badge>
  `,
})
class TestHost {}

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

  it('should default to the same default variant vocabulary as ui-button', () => {
    const [badge] = badges();

    expect(badge.tagName.toLowerCase()).toBe('ui-badge');
    expect(badge.classList.contains('ui-badge-default')).toBe(true);
    expect(badge.classList.contains('ui-badge-md')).toBe(true);
    expect(badge.textContent?.trim()).toBe('Default');
    expect(badge.hasAttribute('role')).toBe(false);
  });

  it('should reflect variant, rounded, and size inputs as host classes', () => {
    const [, badge] = badges();

    expect(badge.classList.contains('ui-badge-destructive')).toBe(true);
    expect(badge.classList.contains('ui-badge-rounded')).toBe(true);
    expect(badge.classList.contains('ui-badge-sm')).toBe(true);
    expect(badge.classList.contains('ui-badge-default')).toBe(false);
  });

  it('should render a decorative status dot', () => {
    const [, badge] = badges();
    const dot = badge.querySelector('.ui-badge-dot');

    expect(dot).toBeTruthy();
    expect(dot?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should project arbitrary icon content like ui-button', () => {
    const [, , badge] = badges();
    const icon = badge.querySelector('ui-icon');

    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(badge.textContent).toContain('Verified');
    expect(badge.classList.contains('ui-badge-brand')).toBe(true);
  });
});
