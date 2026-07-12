import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { GridCellHarness, GridHarness } from '@angular/aria/grid/testing';
import { FormField, form } from '@angular/forms/signals';
import { vi } from 'vitest';

import { UiDatepicker } from './ui-datepicker';

@Component({
  imports: [UiDatepicker],
  template: `
    <ui-datepicker label="Due date" value="2026-06-15" min="2026-06-05" max="2026-06-25" />
  `,
})
class TestHost {
  readonly datepicker = viewChild.required(UiDatepicker);
}

@Component({
  imports: [UiDatepicker],
  template: `<ui-datepicker label="Past date" value="2026-06-15" max="1900-01-01" />`,
})
class TodayDisabledTestHost {
  readonly datepicker = viewChild.required(UiDatepicker);
}

@Component({
  imports: [FormField, UiDatepicker],
  template: `<ui-datepicker label="Invoice date" [formField]="formState.date" />`,
})
class SignalFormTestHost {
  readonly model = signal({ date: '2026-06-15' });
  readonly formState = form(this.model);
  readonly datepicker = viewChild.required(UiDatepicker);
}

async function createHostFixture(): Promise<ComponentFixture<TestHost>> {
  const fixture = TestBed.createComponent(TestHost);

  await fixture.whenStable();
  await fixture.whenRenderingDone();

  return fixture;
}

async function openDatepicker(
  fixture: ComponentFixture<TestHost | SignalFormTestHost | TodayDisabledTestHost>,
) {
  fixture.componentInstance.datepicker().open();

  await fixture.whenStable();
  await fixture.whenRenderingDone();
}

function getTrigger(fixture: ComponentFixture<unknown>): HTMLButtonElement {
  return fixture.nativeElement.querySelector('.ui-datepicker-trigger');
}

function getPanel(fixture: ComponentFixture<unknown>): HTMLElement | null {
  return fixture.nativeElement.querySelector('.ui-datepicker-panel');
}

function holdElementAnimations(element: Element): void {
  element.getAnimations = () =>
    [{ finished: new Promise<never>(() => undefined) }] as unknown as Animation[];
}

describe('UiDatepicker', () => {
  beforeAll(() => {
    HTMLElement.prototype.scrollIntoView ??= () => {};
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDatepicker],
    }).compileComponents();
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(UiDatepicker);

    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.view().toString()).toBe('1970-01');
    expect(fixture.componentInstance.today()).toBe('');
  });

  it('should expose a passive loading state without disabling the trigger', async () => {
    const fixture = TestBed.createComponent(UiDatepicker);
    fixture.componentRef.setInput('loading', true);

    await fixture.whenStable();

    const trigger = getTrigger(fixture);

    expect(trigger.getAttribute('aria-busy')).toBe('true');
    expect(trigger.disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('.ui-input-loading')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.ui-datepicker-chevron')).toBeNull();
  });

  it('should expose customizable month navigation labels', async () => {
    const fixture = TestBed.createComponent(UiDatepicker);
    fixture.componentRef.setInput('previousMonthLabel', 'Previous month');
    fixture.componentRef.setInput('nextMonthLabel', 'Next month');

    await fixture.whenStable();

    const buttons = fixture.nativeElement.querySelectorAll('.ui-datepicker-nav');
    expect(buttons[0].getAttribute('aria-label')).toBe('Previous month');
    expect(buttons[1].getAttribute('aria-label')).toBe('Next month');
  });

  it('should render the selected value in the trigger', async () => {
    const fixture = await createHostFixture();
    const trigger = getTrigger(fixture);

    expect(trigger.textContent).toContain('15 июн. 2026 г.');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should transition the trigger label when the selected date changes', async () => {
    const fixture = await createHostFixture();
    const datepicker = fixture.componentInstance.datepicker();
    const label = fixture.nativeElement.querySelector(
      '.ui-datepicker-trigger-label',
    ) as HTMLElement;
    holdElementAnimations(label);

    datepicker.value.set('2026-06-16');
    await fixture.whenStable();

    expect(label.textContent).toContain('15 июн. 2026 г.');
    expect(label.getAttribute('data-swap-phase')).toBe('exit');

    const exit = new Event('transitionend', { bubbles: true });
    Object.defineProperty(exit, 'propertyName', { value: 'opacity' });
    label.dispatchEvent(exit);
    await fixture.whenStable();

    expect(label.textContent).toContain('16 июн. 2026 г.');
    expect(label.getAttribute('data-swap-phase')).toBe('idle');
  });

  it('should wire ui-input label to the button trigger', async () => {
    const fixture = await createHostFixture();
    const label = fixture.nativeElement.querySelector('.ui-input-label') as HTMLLabelElement;
    const trigger = getTrigger(fixture);

    expect(trigger.hasAttribute('uiInputControl')).toBe(true);
    expect(label.textContent).toContain('Due date');
    expect(label.htmlFor).toBe(trigger.id);
    expect(trigger.getAttribute('aria-labelledby')).toContain(label.id);
  });

  it('should open a native popover dialog containing an aria grid', async () => {
    const fixture = await createHostFixture();

    await openDatepicker(fixture);

    const panel = getPanel(fixture);
    const grid = fixture.nativeElement.querySelector('[role="grid"]') as HTMLElement;

    expect(panel?.getAttribute('popover')).toBe('auto');
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-labelledby')).toBeTruthy();
    expect(grid.getAttribute('aria-label')).toBe('июнь 2026 г.');
    expect(getTrigger(fixture).getAttribute('aria-expanded')).toBe('true');
  });

  it('should transition month navigation in its spatial direction', async () => {
    const fixture = TestBed.createComponent(UiDatepicker);
    fixture.componentRef.setInput('value', '2026-06-15');
    await fixture.whenStable();

    fixture.componentInstance.open();
    await fixture.whenStable();
    const title = fixture.nativeElement.querySelector('.ui-datepicker-title') as HTMLElement;
    holdElementAnimations(title);
    fixture.componentInstance.nextMonth();
    await fixture.whenStable();

    expect(fixture.componentInstance.view().toString()).toBe('2026-06');
    expect(title.getAttribute('data-swap-phase')).toBe('exit');
    expect(title.getAttribute('data-swap-direction')).toBe('next');

    const exit = new Event('transitionend', { bubbles: true });
    Object.defineProperty(exit, 'propertyName', { value: 'opacity' });
    title.dispatchEvent(exit);
    await fixture.whenStable();

    expect(fixture.componentInstance.view().toString()).toBe('2026-07');
    expect(title.getAttribute('data-swap-phase')).toBe('idle');
  });

  it('should leave Home navigation to the aria grid instead of changing months', async () => {
    const fixture = await createHostFixture();
    const datepicker = fixture.componentInstance.datepicker();

    await openDatepicker(fixture);
    datepicker.today.set('2026-07-10');

    getPanel(fixture)?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();

    expect(datepicker.view().toString()).toBe('2026-06');
    expect(datepicker.monthSwapPhase()).toBe('idle');
  });

  it.each(['PageUp', 'PageDown'])('should keep %s navigation inside min/max months', async (key) => {
    const fixture = await createHostFixture();
    await openDatepicker(fixture);
    const panel = getPanel(fixture)!;

    panel.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    await fixture.whenStable();

    expect(fixture.componentInstance.datepicker().view().toString()).toBe('2026-06');
    expect(panel.querySelector('.ui-datepicker-title')?.getAttribute('data-swap-phase')).toBe(
      'idle',
    );
  });

  it('should expose calendar cells through the Angular Aria grid harness', async () => {
    const fixture = await createHostFixture();
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await openDatepicker(fixture);

    const grid = await loader.getHarness(GridHarness);
    const rows = await grid.getCellTextByIndex();

    expect(await grid.isDisabled()).toBe(false);
    expect(rows[0]).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    expect(await grid.getCells({ selected: true })).toHaveLength(1);
  });

  it('should write a selected day back to a signal form field', async () => {
    const fixture = TestBed.createComponent(SignalFormTestHost);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await fixture.whenStable();
    await fixture.whenRenderingDone();
    await openDatepicker(fixture);

    const day = await loader.getHarness(GridCellHarness.with({ text: '16' }));

    await day.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.model().date).toBe('2026-06-16');
    expect(fixture.componentInstance.formState.date().value()).toBe('2026-06-16');
    // The panel stays mounted (so its exit can animate); a closed picker is
    // expressed by aria-expanded, not by removing the node.
    expect(getTrigger(fixture).getAttribute('aria-expanded')).toBe('false');
  });

  it('should mark dates outside min and max as disabled', async () => {
    const fixture = await createHostFixture();
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await openDatepicker(fixture);

    expect(
      await loader.getHarness(GridCellHarness.with({ text: '1', disabled: true })),
    ).toBeTruthy();
    expect(
      await loader.getHarness(GridCellHarness.with({ text: '15', disabled: false })),
    ).toBeTruthy();
    expect(
      await loader.getHarness(GridCellHarness.with({ text: '30', disabled: true })),
    ).toBeTruthy();
  });

  it('should configure the panel with css anchor positioning', async () => {
    const fixture = await createHostFixture();

    await openDatepicker(fixture);

    const host = fixture.nativeElement.querySelector('ui-datepicker') as HTMLElement;
    const trigger = getTrigger(fixture);
    const panel = getPanel(fixture) as HTMLElement;
    const hostStyle = getComputedStyle(host);
    const triggerStyle = getComputedStyle(trigger);
    const panelStyle = getComputedStyle(panel);

    expect(hostStyle.anchorScope).toContain('--ui-datepicker-trigger-');
    expect(triggerStyle.anchorName).toContain('--ui-datepicker-trigger-');
    expect(panelStyle.position).toBe('fixed');
    expect(panelStyle.inset).toBe('auto');
    expect(panelStyle.positionAnchor).toContain('--ui-datepicker-trigger-');
    expect(panelStyle.top).toContain('anchor(bottom)');
    expect(panelStyle.positionTryFallbacks).toContain('flip-block');
  });

  it('should clear the value from the footer action', async () => {
    const fixture = await createHostFixture();

    await openDatepicker(fixture);

    const clear = fixture.nativeElement.querySelector('.ui-datepicker-action') as HTMLButtonElement;
    clear.click();

    await fixture.whenStable();

    expect(fixture.componentInstance.datepicker().value()).toBe('');
    // The panel stays mounted (so its exit can animate); a closed picker is
    // expressed by aria-expanded, not by removing the node.
    expect(getTrigger(fixture).getAttribute('aria-expanded')).toBe('false');
  });

  it('should disable today action when today is outside the allowed range', async () => {
    const fixture = TestBed.createComponent(TodayDisabledTestHost);

    await fixture.whenStable();
    await fixture.whenRenderingDone();
    await openDatepicker(fixture);

    const today = fixture.nativeElement.querySelector(
      '.ui-datepicker-action-accent',
    ) as HTMLButtonElement;

    expect(today.disabled).toBe(true);
  });

  it('should not emit touch twice when a programmatic close is followed by native toggle', async () => {
    const fixture = await createHostFixture();
    const touch = vi.fn();

    fixture.componentInstance.datepicker().touch.subscribe(touch);

    await openDatepicker(fixture);

    fixture.componentInstance.datepicker().close();
    fixture.componentInstance.datepicker().onPanelToggle({ newState: 'closed' } as ToggleEvent);

    expect(touch).toHaveBeenCalledTimes(1);
  });
});
