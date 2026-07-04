import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiInputError } from './ui-input-error';

@Component({
  imports: [UiInputError],
  template: `
    <ui-input-error panelId="email-error" [messages]="['Email is required', 'Email is invalid']">
      <input type="email" />
    </ui-input-error>
  `,
})
class TestHost {}

describe('UiInputError', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  it('should project the control and render every validation message', () => {
    const control = fixture.nativeElement.querySelector('.ui-input-control') as HTMLElement;
    const panel = fixture.nativeElement.querySelector('.ui-input-error-panel') as HTMLElement;
    const messages = panel.querySelectorAll('.ui-input-error-surface span');

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
    const control = fixture.nativeElement.querySelector('.ui-input-control') as HTMLElement;
    const panel = fixture.nativeElement.querySelector('.ui-input-error-panel') as HTMLElement;

    expect(control.style.anchorName).toMatch(/^--ui-input-error-\d+$/);
    expect(panel.style.positionAnchor).toBe(control.style.anchorName);
  });
});
