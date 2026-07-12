import { Component, signal, viewChild } from '@angular/core';
import { disabled, FormField, form, required } from '@angular/forms/signals';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComboboxHarness } from '@angular/aria/combobox/testing';
import { ListboxHarness } from '@angular/aria/listbox/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UiAutocomplete } from './ui-autocomplete';
import { UiAutocompleteOption } from './ui-autocomplete-option/ui-autocomplete-option';

@Component({
  imports: [UiAutocomplete, UiAutocompleteOption],
  template: `
    <ui-autocomplete>
      <span slot="start">S</span>
      <span slot="end">E</span>
      <ui-autocomplete-option value="created" label="Created">
        <span slot="start" class="option-start"></span>
        <span slot="end" class="option-end"></span>
      </ui-autocomplete-option>
      <ui-autocomplete-option value="approved" label="Approved" />
      <ui-autocomplete-option value="paid" label="Paid" />
    </ui-autocomplete>
  `,
})
class TestHost {
  readonly autocomplete = viewChild.required(UiAutocomplete);
}

@Component({
  imports: [UiAutocomplete, UiAutocompleteOption],
  template: `
    <ui-autocomplete>
      <ui-autocomplete-option value="enabled" label="Enabled" />
      <ui-autocomplete-option value="disabled" label="Disabled" disabled />
    </ui-autocomplete>
  `,
})
class DisabledOptionTestHost {}

@Component({
  imports: [UiAutocomplete],
  template: `
    <ui-autocomplete placeholder="Find status" emptyText="Nothing found" />
  `,
})
class PlaceholderTestHost {
  readonly autocomplete = viewChild.required(UiAutocomplete);
}

@Component({
  imports: [UiAutocomplete],
  template: `
    <ui-autocomplete loading loadingText="Fetching statuses">
      <span slot="end">E</span>
    </ui-autocomplete>
  `,
})
class LoadingTestHost {
  readonly autocomplete = viewChild.required(UiAutocomplete);
}

@Component({
  imports: [UiAutocomplete, UiAutocompleteOption],
  template: `
    <ui-autocomplete [(query)]="query">
      @if (withResults()) {
        <ui-autocomplete-option value="new-york" label="New York" />
      }
    </ui-autocomplete>
  `,
})
class ExternalResultsTestHost {
  readonly autocomplete = viewChild.required(UiAutocomplete);
  readonly query = signal('');
  readonly withResults = signal(false);
}

@Component({
  imports: [FormField, UiAutocomplete, UiAutocompleteOption],
  template: `
    <ui-autocomplete [formField]="formState.status">
      <ui-autocomplete-option value="created" label="Created" />
      <ui-autocomplete-option value="approved" label="Approved" />
      <ui-autocomplete-option value="paid" label="Paid" />
    </ui-autocomplete>
  `,
})
class SignalFormTestHost {
  readonly model = signal({ status: 'approved' });
  readonly formState = form(this.model);
  readonly autocomplete = viewChild.required(UiAutocomplete);
}

@Component({
  imports: [FormField, UiAutocomplete, UiAutocompleteOption],
  template: `
    <ui-autocomplete label="Status" withErrorMessage [formField]="formState.status">
      <ui-autocomplete-option value="created" label="Created" />
      <ui-autocomplete-option value="approved" label="Approved" />
    </ui-autocomplete>

    <ui-autocomplete label="Locked status" [formField]="formState.lockedStatus">
      <ui-autocomplete-option value="created" label="Created" />
      <ui-autocomplete-option value="approved" label="Approved" />
    </ui-autocomplete>
  `,
})
class SignalFormStateTestHost {
  readonly model = signal({ status: '', lockedStatus: 'approved' });
  readonly formState = form(this.model, (path) => {
    required(path.status, { message: 'Status is required' });
    disabled(path.lockedStatus, { when: 'Status is locked by workflow' });
  });
}

function dispatchKeyboardEvent(element: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });

  element.dispatchEvent(event);

  return event;
}

function dispatchInputEvent(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

async function createHostFixture(): Promise<ComponentFixture<TestHost>> {
  const hostFixture = TestBed.createComponent(TestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();
  await hostFixture.whenRenderingDone();

  return hostFixture;
}

async function createSignalFormHostFixture(): Promise<ComponentFixture<SignalFormTestHost>> {
  const hostFixture = TestBed.createComponent(SignalFormTestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();
  await hostFixture.whenRenderingDone();

  return hostFixture;
}

async function createSignalFormStateHostFixture(): Promise<
  ComponentFixture<SignalFormStateTestHost>
> {
  const hostFixture = TestBed.createComponent(SignalFormStateTestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();
  await hostFixture.whenRenderingDone();

  return hostFixture;
}

function getCombobox(fixture: ComponentFixture<unknown>): HTMLInputElement {
  return fixture.nativeElement.querySelector('[role="combobox"]');
}

async function openPopup(fixture: ComponentFixture<TestHost>): Promise<HTMLInputElement> {
  const combobox = getCombobox(fixture);

  combobox.focus();
  fixture.componentInstance.autocomplete().popupExpanded.set(true);
  fixture.detectChanges();
  await fixture.whenStable();
  await fixture.whenRenderingDone();

  return combobox;
}

function getListbox(): HTMLElement {
  return document.body.querySelector('[role="listbox"]') as HTMLElement;
}

function getPopup(fixture: ComponentFixture<unknown>): HTMLElement | null {
  return fixture.nativeElement.querySelector('.ui-autocomplete-popup');
}

function getOptions(): HTMLElement[] {
  return Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'));
}

function getActiveOption(): HTMLElement | null {
  return document.body.querySelector('[role="option"][data-active="true"]');
}

describe('UiAutocomplete', () => {
  let component: UiAutocomplete;
  let fixture: ComponentFixture<UiAutocomplete>;

  beforeAll(() => {
    HTMLElement.prototype.scrollIntoView ??= () => {};
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiAutocomplete],
    }).compileComponents();

    fixture = TestBed.createComponent(UiAutocomplete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should forward start and end content to the wrapped ui-input', async () => {
    const hostFixture = await createHostFixture();
    const start = hostFixture.nativeElement.querySelector(
      '.ui-autocomplete-start > [slot="start"]',
    );
    const end = hostFixture.nativeElement.querySelector(
      '.ui-autocomplete-end > [slot="end"]',
    );

    expect(start?.textContent).toBe('S');
    expect(end?.textContent).toBe('E');
    expect(
      hostFixture.nativeElement.querySelector('.ui-input-slot-start > .ui-autocomplete-start'),
    ).toBeTruthy();
    expect(
      hostFixture.nativeElement.querySelector('.ui-input-slot-end > .ui-autocomplete-end'),
    ).toBeTruthy();
  });

  it('should expose disabled suggestions through Angular Aria', async () => {
    const hostFixture = TestBed.createComponent(DisabledOptionTestHost);
    await hostFixture.whenStable();
    const loader = TestbedHarnessEnvironment.loader(hostFixture);
    const autocomplete = await loader.getHarness(ComboboxHarness);

    await autocomplete.open();
    const listbox = await autocomplete.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();

    expect(await options[0].isDisabled()).toBe(false);
    expect(await options[1].isDisabled()).toBe(true);
  });

  it('should expose every supplied option without applying business filtering', async () => {
    const hostFixture = await createHostFixture();
    const autocomplete = hostFixture.componentInstance.autocomplete();

    autocomplete.query.set('does-not-match');
    hostFixture.detectChanges();

    expect(autocomplete.options().map((option) => option.value())).toEqual([
      'created',
      'approved',
      'paid',
    ]);
    expect(autocomplete.options().map((option) => option.label())).toEqual([
      'Created',
      'Approved',
      'Paid',
    ]);
  });

  it('should provide an inline suggestion for prefix matches', async () => {
    const hostFixture = await createHostFixture();
    const autocomplete = hostFixture.componentInstance.autocomplete();

    autocomplete.query.set('app');
    hostFixture.detectChanges();

    expect(autocomplete.inlineSuggestion()).toBe('Approved');
  });

  it('should expose combobox accessibility attributes when collapsed', async () => {
    const hostFixture = await createHostFixture();
    const combobox = getCombobox(hostFixture);

    expect(combobox).toBeTruthy();
    expect(combobox.getAttribute('tabindex')).toBe('0');
    expect(combobox.getAttribute('aria-expanded')).toBe('false');
    // The listbox popup directive is always present now (its content stays
    // mounted after first open so the exit can animate), so the combobox reports
    // its stable aria-autocomplete='list' instead of flipping to 'none' while
    // collapsed. The popup *content* is still lazy — getPopup is null until the
    // first open.
    expect(combobox.getAttribute('aria-autocomplete')).toBe('list');
    expect(combobox.getAttribute('placeholder')).toBe('Поиск значений');
    expect(getPopup(hostFixture)).toBeNull();
  });

  it('should support custom placeholder and empty text', async () => {
    const hostFixture = TestBed.createComponent(PlaceholderTestHost);
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    const combobox = getCombobox(hostFixture);
    const autocomplete = hostFixture.componentInstance.autocomplete();

    expect(combobox.getAttribute('placeholder')).toBe('Find status');

    combobox.focus();
    dispatchInputEvent(combobox, 'missing');
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    expect(getPopup(hostFixture)?.textContent).toContain('Nothing found');
  });

  it('should expose a passive loading state instead of an empty result', async () => {
    const hostFixture = TestBed.createComponent(LoadingTestHost);
    await hostFixture.whenStable();

    const combobox = getCombobox(hostFixture);

    expect(combobox.getAttribute('aria-busy')).toBe('true');
    expect(combobox.disabled).toBe(false);
    expect(hostFixture.nativeElement.querySelector('.ui-input-loading')).toBeTruthy();
    expect(hostFixture.nativeElement.querySelector('.ui-autocomplete-end')).toBeNull();

    combobox.focus();
    dispatchInputEvent(combobox, 'pending');
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    const popup = getPopup(hostFixture);

    expect(popup?.querySelector('.ui-popup-status')?.textContent).toContain('Fetching statuses');
    expect(popup?.textContent).not.toContain('Ничего не найдено');
  });

  it('should preserve the consumer query when external results arrive', async () => {
    const hostFixture = TestBed.createComponent(ExternalResultsTestHost);
    await hostFixture.whenStable();
    const combobox = getCombobox(hostFixture);

    dispatchInputEvent(combobox, 'NYC');
    await hostFixture.whenStable();
    hostFixture.componentInstance.withResults.set(true);
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.query()).toBe('NYC');
    expect(hostFixture.componentInstance.autocomplete().query()).toBe('NYC');
    expect(hostFixture.componentInstance.autocomplete().options()[0].label()).toBe('New York');
  });

  it('should sync selected value from a signal form field', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const autocomplete = hostFixture.componentInstance.autocomplete();
    const combobox = getCombobox(hostFixture);

    expect(autocomplete.value()).toBe('approved');
    expect(autocomplete.query()).toBe('Approved');
    expect(autocomplete.selectedValues()).toEqual(['approved']);
    expect(combobox.value).toBe('Approved');
  });

  it('should clear a committed option when the user edits its visible label', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const autocomplete = hostFixture.componentInstance.autocomplete();
    const combobox = getCombobox(hostFixture);

    dispatchInputEvent(combobox, 'Appro');
    await hostFixture.whenStable();

    expect(autocomplete.query()).toBe('Appro');
    expect(autocomplete.selectedValues()).toEqual([]);
    expect(autocomplete.value()).toBe('');
    expect(hostFixture.componentInstance.model().status).toBe('');
  });

  it('should write selected value back to a signal form field', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const loader = TestbedHarnessEnvironment.loader(hostFixture);
    const autocomplete = await loader.getHarness(ComboboxHarness);

    await autocomplete.setValue('p');

    const listbox = await autocomplete.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();

    await options[2].click();

    expect(hostFixture.componentInstance.model().status).toBe('paid');
    expect(hostFixture.componentInstance.formState.status().value()).toBe('paid');
    expect(await autocomplete.getValue()).toBe('Paid');
  });

  it('should render signal form errors and disabled reasons through ui-input', async () => {
    const hostFixture = await createSignalFormStateHostFixture();
    const fields = hostFixture.nativeElement.querySelectorAll('ui-autocomplete');
    const invalidField = fields[0] as HTMLElement;
    const disabledField = fields[1] as HTMLElement;

    expect(invalidField.querySelector('.ui-input-label')?.textContent).toContain('Status');
    expect(invalidField.querySelector('.ui-input-label')?.textContent).toContain('*');
    expect(invalidField.querySelector('.ui-field-error-panel')?.textContent).toContain(
      'Status is required',
    );
    expect(disabledField.querySelector('[role="combobox"]')?.getAttribute('aria-disabled')).toBe(
      'true',
    );
    // The error panel is always in the DOM (a manual popover), so "no error"
    // means it renders no message rather than being absent.
    expect(disabledField.querySelector('.ui-field-error-panel')?.textContent?.trim()).toBe('');
    expect(disabledField.querySelector('.ui-input-disabled-reason')?.textContent).toContain(
      'Status is locked by workflow',
    );
  });

  it('should expose listbox and option accessibility attributes when expanded', async () => {
    const hostFixture = await createHostFixture();

    const combobox = await openPopup(hostFixture);
    const listbox = getListbox();
    const options = getOptions();

    expect(combobox.getAttribute('aria-expanded')).toBe('true');
    expect(combobox.getAttribute('aria-autocomplete')).toBe('list');
    expect(combobox.getAttribute('aria-haspopup')).toBe('listbox');
    expect(combobox.getAttribute('aria-controls')).toBe(listbox.id);
    expect(listbox.getAttribute('aria-multiselectable')).toBe('false');
    expect(listbox.getAttribute('aria-orientation')).toBe('vertical');
    expect(options.map((option) => option.getAttribute('role'))).toEqual([
      'option',
      'option',
      'option',
    ]);
    expect(options.map((option) => option.textContent?.trim())).toEqual([
      'Created',
      'Approved',
      'Paid',
    ]);
    expect(options[0].querySelector('.option-start')).toBeTruthy();
    expect(options[0].querySelector('.option-end')).toBeTruthy();
  });

  it('should open the popup without filtering consumer-supplied options', async () => {
    const hostFixture = await createHostFixture();
    const combobox = getCombobox(hostFixture);

    combobox.focus();
    dispatchInputEvent(combobox, 'p');
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    expect(hostFixture.componentInstance.autocomplete().popupExpanded()).toBe(true);
    expect(getOptions().map((option) => option.textContent?.trim())).toEqual([
      'Created',
      'Approved',
      'Paid',
    ]);
  });

  it('should select a supplied option with Angular Aria harnesses', async () => {
    const hostFixture = await createHostFixture();
    const loader = TestbedHarnessEnvironment.loader(hostFixture);
    const autocomplete = await loader.getHarness(ComboboxHarness);

    expect(await autocomplete.isOpen()).toBe(false);

    await autocomplete.setValue('p');

    expect(await autocomplete.isOpen()).toBe(true);

    const listbox = await autocomplete.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();

    expect(await Promise.all(options.map((option) => option.getText()))).toEqual([
      'Created',
      'Approved',
      'Paid',
    ]);

    await options[1].click();

    expect(await autocomplete.isOpen()).toBe(false);
    expect(await autocomplete.getValue()).toBe('Approved');
    expect(hostFixture.componentInstance.autocomplete().selectedValues()).toEqual(['approved']);
  });

  it('should not commit when the listbox padding is clicked', async () => {
    const hostFixture = await createHostFixture();
    await openPopup(hostFixture);

    const autocomplete = hostFixture.componentInstance.autocomplete();
    const listbox = getListbox();

    autocomplete.selectedValues.set(['approved']);
    listbox.click();
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(autocomplete.value()).toBe('');
    expect(autocomplete.query()).toBe('');
    expect(autocomplete.popupExpanded()).toBe(true);
  });

  it('should keep supplied options visible when the query does not match their labels', async () => {
    const hostFixture = await createHostFixture();
    const combobox = getCombobox(hostFixture);

    combobox.focus();
    dispatchInputEvent(combobox, 'zzz');
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    expect(getOptions()).toHaveLength(3);
    expect(getPopup(hostFixture)?.textContent).not.toContain('Ничего не найдено');
  });

  it('should configure the popup with css anchor positioning', async () => {
    const hostFixture = await createHostFixture();
    await openPopup(hostFixture);

    const host = hostFixture.nativeElement.querySelector('ui-autocomplete') as HTMLElement;
    const fieldSurface = host.querySelector('.ui-input-control') as HTMLElement;
    const popup = getPopup(hostFixture) as HTMLElement;
    const hostStyle = getComputedStyle(host);
    const fieldSurfaceStyle = getComputedStyle(fieldSurface);
    const style = getComputedStyle(popup);

    expect(popup).toBeTruthy();
    expect(popup.getAttribute('popover')).toBe('auto');
    expect(hostStyle.anchorScope).toBe('--ui-autocomplete-trigger');
    expect(fieldSurfaceStyle.anchorName).toContain('--ui-autocomplete-trigger');
    expect(style.position).toBe('fixed');
    expect(style.inset).toBe('auto');
    expect(style.positionAnchor).toBe('--ui-autocomplete-trigger');
    expect(style.top).toContain('anchor(bottom)');
    expect(style.top).toContain('var(--ui-popup-offset)');
    expect(style.width).toBe('var(--ui-popup-width)');
    expect(style.getPropertyValue('--ui-popup-width')).toBe('fit-content');
    expect(style.getPropertyValue('--ui-popup-min-width')).toContain('anchor-size(width)');
    expect(style.margin).toBe('0px');
    expect(style.positionTryFallbacks).toContain('flip-block');
    expect(style.positionTryFallbacks).toContain('flip-inline');
  });

  it('should keep focus on the input and update aria-activedescendant while navigating', async () => {
    const hostFixture = await createHostFixture();
    const combobox = await openPopup(hostFixture);
    const listbox = getListbox();
    const firstActiveOption = getActiveOption();

    expect(document.activeElement).toBe(combobox);
    expect(combobox.getAttribute('aria-activedescendant')).toBe(firstActiveOption?.id);
    expect(listbox.getAttribute('aria-activedescendant')).toBe(firstActiveOption?.id);
    expect(listbox.getAttribute('tabindex')).toBe('-1');

    dispatchKeyboardEvent(combobox, 'ArrowDown');
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    const nextActiveOption = getActiveOption();

    expect(document.activeElement).toBe(combobox);
    expect(nextActiveOption?.textContent?.trim()).toBe('Approved');
    expect(combobox.getAttribute('aria-activedescendant')).toBe(nextActiveOption?.id);
    expect(listbox.getAttribute('aria-activedescendant')).toBe(nextActiveOption?.id);
  });

  it('should select the active option with Enter and collapse the popup', async () => {
    const hostFixture = await createHostFixture();
    await openPopup(hostFixture);
    const listbox = getListbox();

    dispatchKeyboardEvent(listbox, 'ArrowDown');
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    dispatchKeyboardEvent(listbox, 'Enter');
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const autocomplete = hostFixture.componentInstance.autocomplete();

    expect(autocomplete.selectedValues()).toEqual(['approved']);
    expect(autocomplete.query()).toBe('Approved');
    expect(autocomplete.popupExpanded()).toBe(false);
    // Popup persists after close (preserveContent) so its exit can animate.
    expect(getPopup(hostFixture)).not.toBeNull();
  });

  it('should close the popup with Escape', async () => {
    const hostFixture = await createHostFixture();
    const combobox = getCombobox(hostFixture);

    combobox.focus();
    hostFixture.debugElement
      .query(By.css('[role="combobox"]'))
      .triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    expect(hostFixture.componentInstance.autocomplete().popupExpanded()).toBe(true);

    hostFixture.debugElement
      .query(By.css('[role="combobox"]'))
      .triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'Escape' }));
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    expect(hostFixture.componentInstance.autocomplete().popupExpanded()).toBe(false);
    expect(combobox.getAttribute('aria-expanded')).toBe('false');
    // Popup persists after close (preserveContent) so its exit can animate.
    expect(getPopup(hostFixture)).not.toBeNull();
    expect(document.activeElement).toBe(combobox);
  });
});
