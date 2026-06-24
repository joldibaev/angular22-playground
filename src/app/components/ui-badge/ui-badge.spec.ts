import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiBadge } from './ui-badge';

@Component({
  imports: [UiBadge],
  template: `
    <ui-badge>Default</ui-badge>
    <ui-badge variant="destructive" size="sm">Alert</ui-badge>
  `,
})
class TestHost {}

describe('UiBadge', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  function badges(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('ui-badge'));
  }

  it('should default to a neutral medium badge and project content', () => {
    const [badge] = badges();

    expect(badge.tagName.toLowerCase()).toBe('ui-badge');
    expect(badge.classList.contains('ui-badge-neutral')).toBe(true);
    expect(badge.classList.contains('ui-badge-md')).toBe(true);
    expect(badge.textContent?.trim()).toBe('Default');
  });

  it('should reflect variant and size inputs as host classes', () => {
    const [, badge] = badges();

    expect(badge.classList.contains('ui-badge-destructive')).toBe(true);
    expect(badge.classList.contains('ui-badge-sm')).toBe(true);
    expect(badge.classList.contains('ui-badge-neutral')).toBe(false);
  });
});
