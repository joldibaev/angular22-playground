import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComboboxHarness } from '@angular/aria/combobox/testing';
import { ListboxHarness } from '@angular/aria/listbox/testing';

import { UiSelect } from './ui-select';
import { Component, signal, viewChild } from '@angular/core';
import { disabled, FormField, form, required } from '@angular/forms/signals';
import { UiSelectGroup } from './ui-select-group/ui-select-group';
import { UiSelectOption } from './ui-select-option/ui-select-option';

@Component({
  imports: [UiSelect, UiSelectOption],
  template: `
    <ui-select>
      <ui-select-option value="created">Created</ui-select-option>
      <ui-select-option value="approved">Approved</ui-select-option>
      <ui-select-option value="paid">Paid</ui-select-option>
    </ui-select>
  `,
})
class TestHost {
  readonly select = viewChild.required(UiSelect);
}

@Component({
  imports: [UiSelect, UiSelectOption],
  template: `
    <ui-select placeholder="Choose status">
      <ui-select-option value="created">Created</ui-select-option>
      <ui-select-option value="approved">Approved</ui-select-option>
    </ui-select>
  `,
})
class PlaceholderTestHost {
  readonly select = viewChild.required(UiSelect);
}

@Component({
  imports: [UiSelect, UiSelectGroup, UiSelectOption],
  template: `
    <ui-select>
      <ui-select-option value="all">All</ui-select-option>
      <ui-select-group label="Status">
        <ui-select-option value="created">Created</ui-select-option>
        <ui-select-option value="approved">Approved</ui-select-option>
      </ui-select-group>
      <ui-select-group label="Payment">
        <ui-select-option value="paid">Paid</ui-select-option>
      </ui-select-group>
    </ui-select>
  `,
})
class GroupedTestHost {
  readonly select = viewChild.required(UiSelect);
}

@Component({
  imports: [UiSelect, UiSelectGroup, UiSelectOption],
  template: `
    <ui-select>
      <ui-select-group label="Pinned">
        <ui-select-option value="research">Research</ui-select-option>
      </ui-select-group>
      <ui-select-group label="Workflow">
        <ui-select-option value="research">Research</ui-select-option>
      </ui-select-group>
    </ui-select>
  `,
})
class DuplicateValueTestHost {
  readonly select = viewChild.required(UiSelect);
}

@Component({
  imports: [UiSelect, UiSelectOption],
  template: `
    <ui-select multi [value]="['created', 'paid']">
      <ui-select-option value="created">Created</ui-select-option>
      <ui-select-option value="approved">Approved</ui-select-option>
      <ui-select-option value="paid">Paid</ui-select-option>
    </ui-select>
  `,
})
class MultiTestHost {
  readonly select = viewChild.required(UiSelect);
}

@Component({
  imports: [UiSelect, UiSelectOption],
  template: `
    <ui-select multi value="created,paid">
      <ui-select-option value="created">Created</ui-select-option>
      <ui-select-option value="approved">Approved</ui-select-option>
      <ui-select-option value="paid">Paid</ui-select-option>
    </ui-select>
  `,
})
class LegacyMultiStringTestHost {
  readonly select = viewChild.required(UiSelect);
}

@Component({
  imports: [FormField, UiSelect, UiSelectOption],
  template: `
    <ui-select [formField]="formState.status">
      <ui-select-option value="created">Created</ui-select-option>
      <ui-select-option value="approved">Approved</ui-select-option>
      <ui-select-option value="paid">Paid</ui-select-option>
    </ui-select>
  `,
})
class SignalFormTestHost {
  readonly model = signal({ status: 'approved' });
  readonly formState = form(this.model);
  readonly select = viewChild.required(UiSelect);
}

@Component({
  imports: [FormField, UiSelect, UiSelectOption],
  template: `
    <ui-select label="Status" showError [formField]="formState.status">
      <ui-select-option value="created">Created</ui-select-option>
      <ui-select-option value="approved">Approved</ui-select-option>
    </ui-select>

    <ui-select label="Locked status" [formField]="formState.lockedStatus">
      <ui-select-option value="created">Created</ui-select-option>
      <ui-select-option value="approved">Approved</ui-select-option>
    </ui-select>
  `,
})
class SignalFormStateTestHost {
  readonly model = signal({ status: '', lockedStatus: 'approved' });
  readonly formState = form(this.model, (path) => {
    required(path.status, { message: 'Status is required' });
    disabled(path.lockedStatus, { when: 'Status is locked by workflow' });
  });
}

type SelectHost = {
  select(): UiSelect;
};

function dispatchKeyboardEvent(element: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });

  element.dispatchEvent(event);

  return event;
}

async function createHostFixture(): Promise<ComponentFixture<TestHost>> {
  const hostFixture = TestBed.createComponent(TestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();
  await hostFixture.whenRenderingDone();

  return hostFixture;
}

async function createGroupedHostFixture(): Promise<ComponentFixture<GroupedTestHost>> {
  const hostFixture = TestBed.createComponent(GroupedTestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();
  await hostFixture.whenRenderingDone();

  return hostFixture;
}

async function createDuplicateValueHostFixture(): Promise<ComponentFixture<DuplicateValueTestHost>> {
  const hostFixture = TestBed.createComponent(DuplicateValueTestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();
  await hostFixture.whenRenderingDone();

  return hostFixture;
}

async function createMultiHostFixture(): Promise<ComponentFixture<MultiTestHost>> {
  const hostFixture = TestBed.createComponent(MultiTestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();
  await hostFixture.whenRenderingDone();

  return hostFixture;
}

async function createLegacyMultiStringHostFixture(): Promise<
  ComponentFixture<LegacyMultiStringTestHost>
> {
  const hostFixture = TestBed.createComponent(LegacyMultiStringTestHost);
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

function getCombobox(fixture: ComponentFixture<SelectHost>): HTMLElement {
  return fixture.nativeElement.querySelector('[role="combobox"]');
}

async function openPopup(fixture: ComponentFixture<SelectHost>): Promise<HTMLElement> {
  const combobox = getCombobox(fixture);

  combobox.focus();
  fixture.componentInstance.select().popupExpanded.set(true);
  fixture.detectChanges();
  await fixture.whenStable();
  await fixture.whenRenderingDone();

  return combobox;
}

function getListbox(): HTMLElement {
  return document.body.querySelector('[role="listbox"]') as HTMLElement;
}

function getPopup(fixture: ComponentFixture<SelectHost>): HTMLElement | null {
  return fixture.nativeElement.querySelector('.ui-select-popup');
}

function getOptions(): HTMLElement[] {
  return Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'));
}

function getGroups(): HTMLElement[] {
  return Array.from(document.body.querySelectorAll<HTMLElement>('[role="group"]'));
}

function getActiveOption(): HTMLElement | null {
  return document.body.querySelector('[role="option"][data-active="true"]');
}

describe('UiSelect', () => {
  let component: UiSelect;
  let fixture: ComponentFixture<UiSelect>;

  beforeAll(() => {
    HTMLElement.prototype.scrollIntoView ??= () => {};
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render placeholder when no value is selected', async () => {
    const hostFixture = await createHostFixture();

    const label = hostFixture.nativeElement.querySelector('.selected-label-text');

    expect(label?.textContent).toContain('Select a label');
    expect(label?.classList).toContain('selected-label-placeholder');
  });

  it('should support a custom placeholder', async () => {
    const hostFixture = TestBed.createComponent(PlaceholderTestHost);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const label = hostFixture.nativeElement.querySelector('.selected-label-text');

    expect(label?.textContent).toContain('Choose status');
  });

  it('should display the projected option label for the selected value', async () => {
    const hostFixture = await createHostFixture();

    hostFixture.componentInstance.select().selectedValues.set(['approved']);
    hostFixture.detectChanges();

    const label = hostFixture.nativeElement.querySelector('.selected-label-text');

    expect(label?.textContent).toContain('Approved');
    expect(label?.classList).not.toContain('selected-label-placeholder');
  });

  it('should keep placeholder display when the selected value has no matching option', async () => {
    const hostFixture = await createHostFixture();

    hostFixture.componentInstance.select().selectedValues.set(['missing']);
    hostFixture.detectChanges();

    const label = hostFixture.nativeElement.querySelector('.selected-label-text');

    expect(label?.textContent).toContain('Select a label');
    expect(label?.classList).toContain('selected-label-placeholder');
  });

  it('should join labels for multiple selected values in option order', async () => {
    const hostFixture = await createHostFixture();

    hostFixture.componentInstance.select().selectedValues.set(['paid', 'created']);
    hostFixture.detectChanges();

    const label = hostFixture.nativeElement.querySelector('.selected-label-text');

    expect(label?.textContent).toContain('Created, Paid');
  });

  it('should sync selected value from a signal form field', async () => {
    const hostFixture = await createSignalFormHostFixture();

    expect(hostFixture.componentInstance.select().value()).toBe('approved');
    expect(hostFixture.componentInstance.select().selectedValues()).toEqual(['approved']);
    expect(hostFixture.nativeElement.querySelector('.selected-label-text')?.textContent).toContain(
      'Approved',
    );
  });

  it('should write selected value back to a signal form field', async () => {
    const hostFixture = await createSignalFormHostFixture();
    const loader = TestbedHarnessEnvironment.loader(hostFixture);
    const select = await loader.getHarness(ComboboxHarness);

    await select.open();

    const listbox = await select.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();

    await options[2].click();

    expect(hostFixture.componentInstance.model().status).toBe('paid');
    expect(hostFixture.componentInstance.formState.status().value()).toBe('paid');
  });

  it('should render signal form errors and disabled reasons through ui-input', async () => {
    const hostFixture = await createSignalFormStateHostFixture();
    const fields = hostFixture.nativeElement.querySelectorAll('ui-select');
    const invalidField = fields[0] as HTMLElement;
    const disabledField = fields[1] as HTMLElement;

    expect(invalidField.querySelector('.ui-input-label')?.textContent).toContain('Status');
    expect(invalidField.querySelector('.ui-input-label')?.textContent).toContain('*');
    expect(invalidField.querySelector('.ui-floating-message')?.textContent).toContain(
      'Status is required',
    );
    expect(disabledField.querySelector('[role="combobox"]')?.getAttribute('aria-disabled')).toBe(
      'true',
    );
    expect(disabledField.querySelector('.ui-floating-message')).toBeNull();
    expect(disabledField.querySelector('.ui-input-disabled-reason')?.textContent).toContain(
      'Status is locked by workflow',
    );
  });

  it('should collapse the popup when a selection is committed', () => {
    component.popupExpanded.set(true);

    component.onCommit();

    expect(component.popupExpanded()).toBe(false);
  });

  it('should expose projected options to build the display value', async () => {
    const hostFixture = await createHostFixture();

    const selectDebugElement = hostFixture.debugElement.query(By.directive(UiSelect));
    const select = selectDebugElement.componentInstance as UiSelect;

    expect(select.options().map((option) => option.value())).toEqual([
      'created',
      'approved',
      'paid',
    ]);
  });

  it('should expose grouped options to build the display value', async () => {
    const hostFixture = await createGroupedHostFixture();

    hostFixture.componentInstance.select().selectedValues.set(['approved']);
    hostFixture.detectChanges();

    const label = hostFixture.nativeElement.querySelector('.selected-label-text');

    expect(label?.textContent).toContain('Approved');
  });

  it('should display a duplicate selected value only once', async () => {
    const hostFixture = await createDuplicateValueHostFixture();

    hostFixture.componentInstance.select().selectedValues.set(['research']);
    hostFixture.detectChanges();

    const label = hostFixture.nativeElement.querySelector('.selected-label-text');

    expect(label?.textContent?.trim()).toBe('Research');
  });

  it('should support multi selection from an array value', async () => {
    const hostFixture = await createMultiHostFixture();
    const select = hostFixture.componentInstance.select();

    expect(select.multi()).toBe(true);
    expect(select.selectedValues()).toEqual(['created', 'paid']);
    expect(hostFixture.nativeElement.querySelector('.selected-label-text')?.textContent).toContain(
      'Created, Paid',
    );
  });

  it('should parse legacy comma-delimited values in multi mode', async () => {
    const hostFixture = await createLegacyMultiStringHostFixture();
    const select = hostFixture.componentInstance.select();

    expect(select.selectedValues()).toEqual(['created', 'paid']);
    expect(hostFixture.nativeElement.querySelector('.selected-label-text')?.textContent).toContain(
      'Created, Paid',
    );
  });

  it('should keep a multi select popup open when committing a selection', async () => {
    const hostFixture = await createMultiHostFixture();
    const select = hostFixture.componentInstance.select();

    select.popupExpanded.set(true);
    select.selectedValues.set(['created', 'approved']);
    hostFixture.detectChanges();

    select.onCommit();

    expect(select.value()).toEqual(['created', 'approved']);
    expect(select.popupExpanded()).toBe(true);
  });

  it('should expose combobox accessibility attributes when collapsed', async () => {
    const hostFixture = await createHostFixture();
    const combobox = getCombobox(hostFixture);

    expect(combobox).toBeTruthy();
    expect(combobox.getAttribute('tabindex')).toBe('0');
    expect(combobox.getAttribute('aria-expanded')).toBe('false');
    expect(combobox.getAttribute('aria-autocomplete')).toBe('none');
    expect(combobox.textContent).toContain('Select a label');
    expect(getPopup(hostFixture)).toBeNull();
  });

  it('should expose listbox and option accessibility attributes when expanded', async () => {
    const hostFixture = await createHostFixture();

    const combobox = await openPopup(hostFixture);
    const listbox = getListbox();
    const options = getOptions();

    expect(combobox.getAttribute('aria-expanded')).toBe('true');
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
  });

  it('should render optgroup-like groups without changing option order', async () => {
    const hostFixture = await createGroupedHostFixture();

    await openPopup(hostFixture);
    const groups = getGroups();
    const options = getOptions();

    expect(groups.map((group) => group.getAttribute('aria-label'))).toEqual(['Status', 'Payment']);
    expect(options.map((option) => option.textContent?.trim())).toEqual([
      'All',
      'Created',
      'Approved',
      'Paid',
    ]);
  });

  it('should not collapse the popup when a group label is clicked', async () => {
    const hostFixture = await createGroupedHostFixture();

    await openPopup(hostFixture);
    const groupLabel = document.body.querySelector<HTMLElement>('.ui-select-group-label');

    groupLabel?.click();
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.select().popupExpanded()).toBe(true);
    expect(hostFixture.componentInstance.select().selectedValues()).toEqual([]);
  });

  it('should allow selecting an option with Angular Aria harnesses', async () => {
    const hostFixture = await createHostFixture();
    const loader = TestbedHarnessEnvironment.loader(hostFixture);
    const select = await loader.getHarness(ComboboxHarness);

    expect(await select.isOpen()).toBe(false);

    await select.open();

    expect(await select.isOpen()).toBe(true);

    const listbox = await select.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();

    expect(options.length).toBe(3);
    expect(await options[1].getText()).toBe('Approved');

    await options[1].click();

    expect(await select.isOpen()).toBe(false);
    expect(hostFixture.componentInstance.select().selectedValues()).toEqual(['approved']);
    expect(hostFixture.nativeElement.querySelector('.selected-label-text')?.textContent).toContain(
      'Approved',
    );
  });

  it('should configure the popup to flip above the trigger when needed', async () => {
    const hostFixture = await createHostFixture();
    await openPopup(hostFixture);

    const host = hostFixture.nativeElement.querySelector('ui-select') as HTMLElement;
    const combobox = getCombobox(hostFixture);
    const popup = getPopup(hostFixture) as HTMLElement;
    const hostStyle = getComputedStyle(host);
    const comboboxStyle = getComputedStyle(combobox);
    const style = getComputedStyle(popup);

    expect(popup).toBeTruthy();
    expect(popup.getAttribute('popover')).toBe('auto');
    expect(hostStyle.anchorScope).toBe('--ui-select-trigger');
    expect(comboboxStyle.anchorName).toBe('--ui-select-trigger');
    expect(style.position).toBe('fixed');
    expect(style.inset).toBe('auto');
    expect(style.positionAnchor).toBe('--ui-select-trigger');
    expect(style.top).toContain('anchor(bottom)');
    expect(style.top).toContain('0.5rem');
    expect(style.margin).toBe('0px');
    expect(style.positionTryFallbacks).toContain('flip-block');
  });

  it('should keep the popup in the component DOM instead of rendering a CDK overlay pane', async () => {
    const hostFixture = await createHostFixture();
    await openPopup(hostFixture);

    expect(getPopup(hostFixture)).toBeTruthy();
    expect(document.body.querySelector('.cdk-overlay-pane')).toBeNull();
  });

  it('should open the popup with ArrowDown and close it with Escape', async () => {
    const hostFixture = await createHostFixture();
    const combobox = getCombobox(hostFixture);

    combobox.focus();
    hostFixture.debugElement
      .query(By.css('[role="combobox"]'))
      .triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    expect(hostFixture.componentInstance.select().popupExpanded()).toBe(true);

    hostFixture.debugElement
      .query(By.css('[role="combobox"]'))
      .triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'Escape' }));
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    expect(hostFixture.componentInstance.select().popupExpanded()).toBe(false);
    expect(combobox.getAttribute('aria-expanded')).toBe('false');
    expect(getPopup(hostFixture)).toBeNull();
    expect(document.activeElement).toBe(combobox);
  });

  it('should keep focus on the combobox and update aria-activedescendant while navigating', async () => {
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

  it('should move the active option with ArrowDown and ArrowUp', async () => {
    const hostFixture = await createHostFixture();
    await openPopup(hostFixture);
    const listbox = getListbox();

    expect(getActiveOption()?.textContent?.trim()).toBe('Created');

    dispatchKeyboardEvent(listbox, 'ArrowDown');
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(getActiveOption()?.textContent?.trim()).toBe('Approved');

    dispatchKeyboardEvent(listbox, 'ArrowUp');
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(getActiveOption()?.textContent?.trim()).toBe('Created');
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

    expect(hostFixture.componentInstance.select().selectedValues()).toEqual(['approved']);
    expect(hostFixture.componentInstance.select().popupExpanded()).toBe(false);
    expect(getPopup(hostFixture)).toBeNull();
    expect(hostFixture.nativeElement.querySelector('.selected-label-text')?.textContent).toContain(
      'Approved',
    );
  });

  it('should select the active option with Space and collapse the popup', async () => {
    const hostFixture = await createHostFixture();
    await openPopup(hostFixture);
    const listbox = getListbox();

    dispatchKeyboardEvent(listbox, 'ArrowDown');
    dispatchKeyboardEvent(listbox, 'ArrowDown');
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    dispatchKeyboardEvent(listbox, ' ');
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.select().selectedValues()).toEqual(['paid']);
    expect(hostFixture.componentInstance.select().popupExpanded()).toBe(false);
    expect(getPopup(hostFixture)).toBeNull();
  });
});
