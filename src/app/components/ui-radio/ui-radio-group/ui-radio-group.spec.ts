import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { disabled, FormField, form, required } from '@angular/forms/signals';

import { UiRadio } from '../ui-radio';
import { UiRadioGroup } from './ui-radio-group';

@Component({
  imports: [FormField, UiRadio, UiRadioGroup],
  template: `
    <ui-radio-group
      [formField]="formState.priority"
      label="Priority"
      description="Used by the queue"
      withErrorMessage
    >
      <ui-radio value="low" label="Low" />
      <ui-radio value="high" label="High" />
    </ui-radio-group>

    <ui-radio-group [formField]="formState.routing" label="Routing">
      <ui-radio value="manual" label="Manual" />
      <ui-radio value="automatic" label="Automatic" />
    </ui-radio-group>
  `,
})
class SignalFormTestHost {
  readonly model = signal({
    priority: '',
    routing: 'automatic',
  });
  readonly formState = form(this.model, (path) => {
    required(path.priority, { message: 'Priority is required' });
    disabled(path.routing, { when: 'Routing is controlled by workflow rules' });
  });
  readonly radioGroup = viewChild.required(UiRadioGroup);
}

function changeRadio(input: HTMLInputElement): void {
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}

async function createSignalFormHostFixture(): Promise<ComponentFixture<SignalFormTestHost>> {
  const hostFixture = TestBed.createComponent(SignalFormTestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();

  return hostFixture;
}

function getRadios(fixture: ComponentFixture<unknown>): HTMLInputElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('input[type="radio"]'));
}

describe('UiRadioGroup', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalFormTestHost],
    }).compileComponents();
  });

  it('should create', async () => {
    const hostFixture = await createSignalFormHostFixture();

    expect(hostFixture.componentInstance.radioGroup()).toBeTruthy();
  });

  it('should render legend, description, and required marker from field state', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const group = hostFixture.nativeElement.querySelector('ui-radio-group');
    const legend = group.querySelector('.ui-radio-group-legend');
    const description = group.querySelector('.ui-radio-group-description');

    expect(legend?.textContent).toContain('Priority');
    expect(legend?.textContent).toContain('*');
    expect(description?.textContent).toContain('Used by the queue');
  });

  it('should pass group name and describedby state to child radios', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const [lowRadio, highRadio] = getRadios(hostFixture);
    const description = hostFixture.nativeElement.querySelector('.ui-radio-group-description');
    const error = hostFixture.nativeElement.querySelector('.ui-radio-group-error');

    // The group's name (auto-generated; it can't be set as an attribute on a
    // [formField] node) must propagate to every child radio so native grouping
    // works.
    const groupName = hostFixture.componentInstance.radioGroup().name();
    expect(groupName).toBeTruthy();
    expect(lowRadio.name).toBe(groupName);
    expect(highRadio.name).toBe(groupName);
    expect(lowRadio.getAttribute('aria-describedby')).toContain(description?.id);
    expect(lowRadio.getAttribute('aria-describedby')).toContain(error?.id);
  });

  it('should update the signal form value when an option is selected', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const [, highRadio] = getRadios(hostFixture);

    changeRadio(highRadio);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.model().priority).toBe('high');
    expect(hostFixture.componentInstance.formState.priority().value()).toBe('high');
  });

  it('should show validation errors when withErrorMessage is enabled', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const group = hostFixture.nativeElement.querySelector('ui-radio-group');
    const message = group.querySelector('.ui-radio-group-error');

    expect(message?.getAttribute('role')).toBe('alert');
    expect(message?.textContent).toContain('Priority is required');
  });

  it('should show disabled reasons and disable child radios', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const groups = hostFixture.nativeElement.querySelectorAll('ui-radio-group');
    const disabledGroup = groups[1];
    const [, , manualRadio, automaticRadio] = getRadios(hostFixture);
    const reason = disabledGroup.querySelector('.ui-radio-group-disabled-reason');

    expect(manualRadio.disabled).toBe(true);
    expect(automaticRadio.disabled).toBe(true);
    expect(reason?.textContent).toContain('Routing is controlled by workflow rules');
  });

  it('should reset to an empty value', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const [, highRadio] = getRadios(hostFixture);

    changeRadio(highRadio);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    hostFixture.componentInstance.radioGroup().reset();
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.model().priority).toBe('');
    expect(hostFixture.componentInstance.formState.priority().value()).toBe('');
  });
});
