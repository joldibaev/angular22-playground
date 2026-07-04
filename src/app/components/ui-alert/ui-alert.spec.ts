import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiAlert } from './ui-alert';

@Component({
  imports: [UiAlert],
  template: `
    <ui-alert title="Market session">
      Trading closes today at 17:00.
      <button uiAlertAction type="button">Review hours</button>
    </ui-alert>

    <ui-alert title="Order rejected" variant="destructive" role="alert">
      The quantity exceeds the available balance.
    </ui-alert>
  `,
})
class TestHost {}

describe('UiAlert', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  function alerts(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('ui-alert'));
  }

  it('should render its required title, default icon, description, and action slot', () => {
    const [alert] = alerts();

    expect(alert.classList.contains('ui-alert-default')).toBe(true);
    expect(alert.classList.contains('ui-alert-destructive')).toBe(false);
    expect(alert.querySelector('.ui-alert-title')?.textContent).toBe('Market session');
    expect(alert.querySelector('.ui-alert-description')?.textContent).toContain('Trading closes');
    expect(alert.querySelector('.ui-alert-description button')).toBeNull();
    expect(alert.querySelector('.ui-alert-actions button')?.textContent).toBe('Review hours');
    expect(alert.querySelector('ui-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(alert.hasAttribute('role')).toBe(false);
  });

  it('should render the destructive treatment without imposing live-region semantics', () => {
    const [, alert] = alerts();

    expect(alert.classList.contains('ui-alert-destructive')).toBe(true);
    expect(alert.classList.contains('ui-alert-default')).toBe(false);
    expect(alert.getAttribute('role')).toBe('alert');
    expect(alert.querySelector('.ui-alert-title')?.textContent).toBe('Order rejected');
    expect(alert.querySelector('.ui-alert-description')?.textContent).toContain(
      'exceeds the available balance',
    );
  });
});
