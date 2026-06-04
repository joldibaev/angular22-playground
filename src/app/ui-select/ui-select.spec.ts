import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComboboxHarness } from '@angular/aria/combobox/testing';
import { ListboxHarness } from '@angular/aria/listbox/testing';

import { UiSelect } from './ui-select';
import { Component, viewChild } from '@angular/core';
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

function getCombobox(fixture: ComponentFixture<TestHost>): HTMLElement {
  return fixture.nativeElement.querySelector('[role="combobox"]');
}

async function openPopup(fixture: ComponentFixture<TestHost>): Promise<HTMLElement> {
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

function getPopup(fixture: ComponentFixture<TestHost>): HTMLElement | null {
  return fixture.nativeElement.querySelector('.ui-select-popup');
}

function getOptions(): HTMLElement[] {
  return Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'));
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
  });

  it('should display the projected option label for the selected value', async () => {
    const hostFixture = await createHostFixture();

    hostFixture.componentInstance.select().selectedValues.set(['approved']);
    hostFixture.detectChanges();

    const label = hostFixture.nativeElement.querySelector('.selected-label-text');

    expect(label?.textContent).toContain('Approved');
  });

  it('should join labels for multiple selected values in option order', async () => {
    const hostFixture = await createHostFixture();

    hostFixture.componentInstance.select().selectedValues.set(['paid', 'created']);
    hostFixture.detectChanges();

    const label = hostFixture.nativeElement.querySelector('.selected-label-text');

    expect(label?.textContent).toContain('Created, Paid');
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
    expect(hostStyle.anchorScope).toBe('--ui-select-trigger');
    expect(comboboxStyle.anchorName).toBe('--ui-select-trigger');
    expect(style.position).toBe('fixed');
    expect(style.positionAnchor).toBe('--ui-select-trigger');
    expect(style.top).toContain('anchor(bottom)');
    expect(style.top).toContain('8px');
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
