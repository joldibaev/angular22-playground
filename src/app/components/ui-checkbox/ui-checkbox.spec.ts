import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { disabled, FormField, form, required } from '@angular/forms/signals';

import { UiCheckbox } from './ui-checkbox';

@Component({
  imports: [FormField, UiCheckbox],
  template: `
    <ui-checkbox
      [formField]="formState.acceptTerms"
      label="Accept terms"
      description="Required for onboarding"
      withErrorMessage
    />

    <ui-checkbox [formField]="formState.archived" label="Archived" />
  `,
})
class SignalFormTestHost {
  readonly model = signal({
    acceptTerms: false,
    archived: true,
  });
  readonly formState = form(this.model, (path) => {
    required(path.acceptTerms, { message: 'Accept terms is required' });
    disabled(path.archived, { when: 'Archived flag is controlled by policy' });
  });
  readonly checkbox = viewChild.required(UiCheckbox);
}

@Component({
  imports: [UiCheckbox],
  template: '<ui-checkbox label="Select all" [indeterminate]="indeterminate()" />',
})
class IndeterminateTestHost {
  readonly indeterminate = signal(true);
}

function changeCheckbox(input: HTMLInputElement, checked: boolean): void {
  input.checked = checked;
  input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}

async function createSignalFormHostFixture(): Promise<ComponentFixture<SignalFormTestHost>> {
  const hostFixture = TestBed.createComponent(SignalFormTestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();

  return hostFixture;
}

function getCheckboxes(fixture: ComponentFixture<unknown>): HTMLInputElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('input[type="checkbox"]'));
}

describe('UiCheckbox', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalFormTestHost, IndeterminateTestHost, UiCheckbox],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UiCheckbox);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should apply the compact size class for sm', () => {
    const fixture = TestBed.createComponent(UiCheckbox);
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).classList.contains('ui-checkbox-sm')).toBe(true);
  });

  it('should render label, description, and required marker from field state', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const checkbox = hostFixture.nativeElement.querySelector('ui-checkbox');
    const title = checkbox.querySelector('.ui-checkbox-title');
    const description = checkbox.querySelector('.ui-checkbox-description');

    expect(title?.textContent).toContain('Accept terms');
    expect(title?.textContent).toContain('*');
    expect(description?.textContent).toContain('Required for onboarding');
  });

  it('should bind the label to the native checkbox input', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const label = hostFixture.nativeElement.querySelector('.ui-checkbox-label') as HTMLLabelElement;
    const [input] = getCheckboxes(hostFixture);

    expect(label.htmlFor).toBe(input.id);
  });

  it('should update the signal form value when checked', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const [input] = getCheckboxes(hostFixture);

    changeCheckbox(input, true);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.model().acceptTerms).toBe(true);
    expect(hostFixture.componentInstance.formState.acceptTerms().value()).toBe(true);
  });

  it('should reset checked state', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const checkbox = hostFixture.componentInstance.checkbox();
    const [input] = getCheckboxes(hostFixture);

    changeCheckbox(input, true);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    checkbox.reset();
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(checkbox.checked()).toBe(false);
    expect(hostFixture.componentInstance.formState.acceptTerms().value()).toBe(false);
  });

  it('should show validation errors when withErrorMessage is enabled', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const checkbox = hostFixture.nativeElement.querySelector('ui-checkbox');
    const message = checkbox.querySelector('.ui-checkbox-error');
    const [input] = getCheckboxes(hostFixture);

    expect(message?.getAttribute('role')).toBe('alert');
    expect(message?.textContent).toContain('Accept terms is required');
    expect(input.getAttribute('aria-describedby')).toContain(message?.id);
  });

  it('should show disabled reasons below the control', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const fields = hostFixture.nativeElement.querySelectorAll('ui-checkbox');
    const disabledField = fields[1];
    const input = getCheckboxes(hostFixture)[1];
    const reason = disabledField.querySelector('.ui-checkbox-disabled-reason');

    expect(input.disabled).toBe(true);
    expect(reason?.textContent).toContain('Archived flag is controlled by policy');
  });

  it('should sync the indeterminate state to the native input', async () => {
    const hostFixture = TestBed.createComponent(IndeterminateTestHost);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const input = getCheckboxes(hostFixture)[0];

    expect(input.indeterminate).toBe(true);

    hostFixture.componentInstance.indeterminate.set(false);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(input.indeterminate).toBe(false);
  });
});
