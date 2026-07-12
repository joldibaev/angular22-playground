import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFieldError } from './ui-field-error';

@Component({
  imports: [UiFieldError],
  template: `
    <ui-field-error
      panelId="email-error"
      [messages]="['Email is required', 'Email is invalid']"
      [additionalAnchorName]="additionalAnchorName()"
    >
      <input type="email" />
    </ui-field-error>
  `,
})
class TestHost {
  readonly additionalAnchorName = signal('');
}

describe('UiFieldError', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  it('should project the control and render every validation message', () => {
    const control = fixture.nativeElement.querySelector('ui-field-error') as HTMLElement;
    const panel = fixture.nativeElement.querySelector('.ui-field-error-panel') as HTMLElement;
    const messages = panel.querySelectorAll('.ui-field-error-surface span');

    expect(control.querySelector('input[type="email"]')).toBeTruthy();
    expect(panel.id).toBe('email-error');
    expect(panel.getAttribute('role')).toBe('alert');
    expect(panel.getAttribute('popover')).toBe('manual');
    expect(Array.from(messages, (message) => message.textContent?.trim())).toEqual([
      'Email is required',
      'Email is invalid',
    ]);
  });

  it('should connect the error panel to its projected control with a stable anchor', () => {
    const control = fixture.nativeElement.querySelector('ui-field-error') as HTMLElement;
    const panel = fixture.nativeElement.querySelector('.ui-field-error-panel') as HTMLElement;

    expect(control.style.anchorName).toMatch(/^--ui-field-error-\d+$/);
    expect(panel.style.positionAnchor).toBe(control.style.anchorName);
  });

  it('should let a composed control share the surface with its popup anchor', async () => {
    fixture.componentInstance.additionalAnchorName.set('--composed-popup');
    await fixture.whenStable();

    const control = fixture.nativeElement.querySelector('ui-field-error') as HTMLElement;
    const panel = fixture.nativeElement.querySelector('.ui-field-error-panel') as HTMLElement;

    expect(control.style.anchorName).toContain('--composed-popup');
    expect(panel.style.positionAnchor).toMatch(/^--ui-field-error-\d+$/);
  });
});
