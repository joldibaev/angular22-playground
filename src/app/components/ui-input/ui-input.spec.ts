import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { disabled, FormField, form, required } from '@angular/forms/signals';

import { UiInput } from './ui-input';

@Component({
  imports: [FormField, UiInput],
  template: `
    <ui-input label="Ticket title" withErrorMessage>
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
    <ui-input label="Notes">
      <textarea placeholder="Add notes"></textarea>
    </ui-input>
  `,
})
class TextareaTestHost {}

@Component({
  imports: [UiInput],
  template: `
    <ui-input label="Search" [loading]="loading()">
      <input type="search" />
    </ui-input>
  `,
})
class LoadingTestHost {
  readonly loading = signal(true);
}

@Component({
  imports: [UiInput],
  template: `
    <ui-input [label]="label()">
      <input type="text" />
    </ui-input>
  `,
})
class DynamicLabelTestHost {
  readonly label = signal('Account name');
}

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

function getTextareas(fixture: ComponentFixture<unknown>): HTMLTextAreaElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('textarea'));
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

  it('should associate the label with a projected textarea', async () => {
    const hostFixture = TestBed.createComponent(TextareaTestHost);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const label = hostFixture.nativeElement.querySelector('.ui-input-label') as HTMLLabelElement;
    const textarea = getTextareas(hostFixture)[0];

    expect(label.htmlFor).toBe(textarea.id);
    expect(textarea.placeholder).toBe('Add notes');
  });

  it('should remove its aria-labelledby token when a dynamic label is cleared', async () => {
    const hostFixture = TestBed.createComponent(DynamicLabelTestHost);
    await hostFixture.whenStable();

    const input = getInputs(hostFixture)[0];
    const labelId = input.getAttribute('aria-labelledby');

    expect(labelId).toBeTruthy();

    hostFixture.componentInstance.label.set('');
    await hostFixture.whenStable();

    expect(input.getAttribute('aria-labelledby')).toBeNull();
  });

  it('should preserve a native placeholder when ui-input placeholder is not set', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const [titleInput] = getInputs(hostFixture);

    expect(titleInput.placeholder).toBe('Ticket title');
  });

  it('should expose a passive loading state without disabling the control', async () => {
    const hostFixture = TestBed.createComponent(LoadingTestHost);
    await hostFixture.whenStable();

    const input = hostFixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('aria-busy')).toBe('true');
    expect(input.disabled).toBe(false);
    expect(hostFixture.nativeElement.querySelector('ui-loading')).toBeTruthy();

    hostFixture.componentInstance.loading.set(false);
    await hostFixture.whenStable();

    expect(input.getAttribute('aria-busy')).toBeNull();
    expect(hostFixture.nativeElement.querySelector('ui-loading')).toBeNull();
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

  it('should show validation errors in a floating message when withErrorMessage is enabled', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const firstField = hostFixture.nativeElement.querySelector('ui-input');
    const message = firstField.querySelector('.ui-input-error-panel');
    const input = firstField.querySelector('input') as HTMLInputElement;

    expect(message?.getAttribute('role')).toBe('alert');
    expect(message?.textContent).toContain('Ticket title is required');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-errormessage')).toBe(message?.id);
  });

  it('should show disabled reasons below the control', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const fields = hostFixture.nativeElement.querySelectorAll('ui-input');
    const disabledField = fields[1];
    const input = getInputs(hostFixture)[1];
    const reason = disabledField.querySelector('.ui-input-disabled-reason');

    expect(input.disabled).toBe(true);
    // The error panel is always in the DOM (a manual popover), so "no error"
    // means it renders no message rather than being absent.
    expect(disabledField.querySelector('.ui-input-error-panel')?.textContent?.trim()).toBe('');
    expect(reason?.textContent).toContain('Routing note is managed automatically');
  });
});
