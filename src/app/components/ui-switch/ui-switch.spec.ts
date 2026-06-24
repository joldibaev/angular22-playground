import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { disabled, FormField, form, required } from '@angular/forms/signals';

import { UiSwitch } from './ui-switch';

@Component({
  imports: [FormField, UiSwitch],
  template: `
    <ui-switch
      [formField]="formState.notifications"
      label="Notifications"
      description="Send workflow updates"
      withErrorMessage
    />

    <ui-switch [formField]="formState.auditMode" label="Audit mode" />
  `,
})
class SignalFormTestHost {
  readonly model = signal({
    notifications: false,
    auditMode: true,
  });
  readonly formState = form(this.model, (path) => {
    required(path.notifications, { message: 'Notifications are required' });
    disabled(path.auditMode, { when: 'Audit mode is locked by workspace policy' });
  });
  readonly switchControl = viewChild.required(UiSwitch);
}

function changeSwitch(input: HTMLInputElement, checked: boolean): void {
  input.checked = checked;
  input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}

async function createSignalFormHostFixture(): Promise<ComponentFixture<SignalFormTestHost>> {
  const hostFixture = TestBed.createComponent(SignalFormTestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();

  return hostFixture;
}

function getSwitches(fixture: ComponentFixture<unknown>): HTMLInputElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('input[type="checkbox"]'));
}

describe('UiSwitch', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalFormTestHost, UiSwitch],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UiSwitch);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render label, description, and required marker from field state', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const switchField = hostFixture.nativeElement.querySelector('ui-switch');
    const title = switchField.querySelector('.ui-switch-title');
    const description = switchField.querySelector('.ui-switch-description');

    expect(title?.textContent).toContain('Notifications');
    expect(title?.textContent).toContain('*');
    expect(description?.textContent).toContain('Send workflow updates');
  });

  it('should render a native checkbox with switch semantics', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const [input] = getSwitches(hostFixture);

    expect(input.type).toBe('checkbox');
    expect(input.getAttribute('role')).toBe('switch');
  });

  it('should update the signal form value when checked', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const [input] = getSwitches(hostFixture);

    changeSwitch(input, true);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.model().notifications).toBe(true);
    expect(hostFixture.componentInstance.formState.notifications().value()).toBe(true);
  });

  it('should reset checked state', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const switchControl = hostFixture.componentInstance.switchControl();
    const [input] = getSwitches(hostFixture);

    changeSwitch(input, true);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    switchControl.reset();
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(switchControl.checked()).toBe(false);
    expect(hostFixture.componentInstance.formState.notifications().value()).toBe(false);
  });

  it('should show validation errors when withErrorMessage is enabled', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const switchField = hostFixture.nativeElement.querySelector('ui-switch');
    const message = switchField.querySelector('.ui-switch-error');
    const [input] = getSwitches(hostFixture);

    expect(message?.getAttribute('role')).toBe('alert');
    expect(message?.textContent).toContain('Notifications are required');
    expect(input.getAttribute('aria-describedby')).toContain(message?.id);
  });

  it('should show disabled reasons below the control', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const fields = hostFixture.nativeElement.querySelectorAll('ui-switch');
    const disabledField = fields[1];
    const input = getSwitches(hostFixture)[1];
    const reason = disabledField.querySelector('.ui-switch-disabled-reason');

    expect(input.disabled).toBe(true);
    expect(reason?.textContent).toContain('Audit mode is locked by workspace policy');
  });
});
