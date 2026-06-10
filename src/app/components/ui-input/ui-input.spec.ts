import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { disabled, FormField, form, required } from '@angular/forms/signals';

import { UiInput } from './ui-input';

@Component({
  imports: [FormField, UiInput],
  template: `
    <ui-input label="Ticket title" showError>
      <input [formField]="formState.title" placeholder="Ticket title" />
    </ui-input>

    <ui-input label="Routing note">
      <input [formField]="formState.routingNote" placeholder="Routing note" />
    </ui-input>
  `,
})
class SignalFormTestHost {
  readonly model = signal({
    title: '',
    routingNote: 'Managed by workflow rules',
  });
  readonly formState = form(this.model, (path) => {
    required(path.title, { message: 'Ticket title is required' });
    disabled(path.routingNote, { when: 'Routing note is managed automatically' });
  });
  readonly titleInput = viewChild.required(UiInput);
}

@Component({
  imports: [UiInput],
  template: `
    <ui-input label="Assignee" placeholder="Search teammates">
      <input />
    </ui-input>
  `,
})
class PlaceholderTestHost {}

function dispatchInputEvent(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

async function createSignalFormHostFixture(): Promise<ComponentFixture<SignalFormTestHost>> {
  const hostFixture = TestBed.createComponent(SignalFormTestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();

  return hostFixture;
}

function getInputs(fixture: ComponentFixture<unknown>): HTMLInputElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('input'));
}

describe('UiInput', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [UiInput],
    }).compileComponents();

    const fixture = TestBed.createComponent(UiInput);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render label and required marker from field state', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const label = hostFixture.nativeElement.querySelector('.ui-input-label');

    expect(label?.textContent).toContain('Ticket title');
    expect(label?.textContent).toContain('*');
  });

  it('should associate the label with the projected input without wrapping it', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const label = hostFixture.nativeElement.querySelector('.ui-input-label') as HTMLLabelElement;
    const input = getInputs(hostFixture)[0];

    expect(label.tagName).toBe('LABEL');
    expect(label.contains(input)).toBe(false);
    expect(label.htmlFor).toBe(input.id);
  });

  it('should sync placeholder to the projected input', async () => {
    const hostFixture = TestBed.createComponent(PlaceholderTestHost);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const input = getInputs(hostFixture)[0];

    expect(input.placeholder).toBe('Search teammates');
  });

  it('should preserve a native placeholder when ui-input placeholder is not set', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const [titleInput] = getInputs(hostFixture);

    expect(titleInput.placeholder).toBe('Ticket title');
  });

  it('should project a native input bound to the same signal form field', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const [titleInput] = getInputs(hostFixture);

    dispatchInputEvent(titleInput, 'Enterprise onboarding path');
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.model().title).toBe('Enterprise onboarding path');
    expect(hostFixture.componentInstance.formState.title().value()).toBe(
      'Enterprise onboarding path',
    );
  });

  it('should show validation errors in a floating message when showError is enabled', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const firstField = hostFixture.nativeElement.querySelector('ui-input');
    const message = firstField.querySelector('.ui-floating-message');

    expect(message?.getAttribute('role')).toBe('alert');
    expect(message?.textContent).toContain('Ticket title is required');
  });

  it('should show disabled reasons below the control', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const fields = hostFixture.nativeElement.querySelectorAll('ui-input');
    const disabledField = fields[1];
    const input = getInputs(hostFixture)[1];
    const reason = disabledField.querySelector('.ui-input-disabled-reason');

    expect(input.disabled).toBe(true);
    expect(disabledField.querySelector('.ui-floating-message')).toBeNull();
    expect(reason?.textContent).toContain('Routing note is managed automatically');
  });
});
