import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiAlert } from './ui-alert';

@Component({
  imports: [UiAlert],
  template: `
    <ui-alert>
      <strong>Market session</strong>
      <p>Trading closes today at 17:00.</p>
      <button type="button">Dismiss</button>
    </ui-alert>

    <ui-alert variant="destructive" role="alert">Order rejected</ui-alert>
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

  it('should project arbitrary content without adding structure', () => {
    const [alert] = alerts();

    expect(alert.classList.contains('ui-alert-default')).toBe(true);
    expect(alert.classList.contains('ui-alert-destructive')).toBe(false);
    expect(alert.querySelector('strong')?.textContent).toBe('Market session');
    expect(alert.querySelector('p')?.textContent).toContain('Trading closes');
    expect(alert.querySelector('button')?.textContent).toBe('Dismiss');
    expect(alert.hasAttribute('role')).toBe(false);
  });

  it('should reflect the destructive variant and preserve consumer semantics', () => {
    const [, alert] = alerts();

    expect(alert.classList.contains('ui-alert-destructive')).toBe(true);
    expect(alert.classList.contains('ui-alert-default')).toBe(false);
    expect(alert.getAttribute('role')).toBe('alert');
    expect(alert.textContent?.trim()).toBe('Order rejected');
  });
});
