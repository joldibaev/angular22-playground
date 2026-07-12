import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { GridCellHarness, GridHarness } from '@angular/aria/grid/testing';
import { FormField, form } from '@angular/forms/signals';
import { vi } from 'vitest';

import { UiDateRangePicker } from './ui-date-range-picker';

@Component({
  imports: [UiDateRangePicker],
  template: `
    <ui-date-range-picker
      label="Billing period"
      [value]="range()"
      (valueChange)="range.set($event)"
      minDate="2026-06-05"
      maxDate="2026-07-25"
    />
  `,
})
class TestHost {
  readonly range = signal({ start: '2026-06-15', end: '2026-06-20' });
  readonly rangePicker = viewChild.required(UiDateRangePicker);
}

@Component({
  imports: [FormField, UiDateRangePicker],
  template: `<ui-date-range-picker label="Report range" [formField]="formState.range" />`,
})
class SignalFormTestHost {
  readonly model = signal({ range: { start: '2026-06-15', end: '2026-06-20' } });
  readonly formState = form(this.model);
  readonly rangePicker = viewChild.required(UiDateRangePicker);
}

async function createHostFixture(): Promise<ComponentFixture<TestHost>> {
  const fixture = TestBed.createComponent(TestHost);

  await fixture.whenStable();
  await fixture.whenRenderingDone();

  return fixture;
}

async function openRangePicker(fixture: ComponentFixture<TestHost | SignalFormTestHost>) {
  fixture.componentInstance.rangePicker().open();

  await fixture.whenStable();
  await fixture.whenRenderingDone();
}

function getTrigger(fixture: ComponentFixture<unknown>): HTMLButtonElement {
  return fixture.nativeElement.querySelector('.ui-date-range-trigger');
}

function getPanel(fixture: ComponentFixture<unknown>): HTMLElement | null {
  return fixture.nativeElement.querySelector('.ui-date-range-panel');
}

function holdElementAnimations(element: Element): void {
  element.getAnimations = () =>
    [{ finished: new Promise<never>(() => undefined) }] as unknown as Animation[];
}

describe('UiDateRangePicker', () => {
  beforeAll(() => {
    HTMLElement.prototype.scrollIntoView ??= () => {};
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDateRangePicker],
    }).compileComponents();
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(UiDateRangePicker);

    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.leftView().toString()).toBe('1970-01');
    expect(fixture.componentInstance.today()).toBe('');
  });

  it('should expose customizable preset and month navigation labels', async () => {
    const fixture = TestBed.createComponent(UiDateRangePicker);
    fixture.componentRef.setInput('presetsLabel', 'Quick ranges');
    fixture.componentRef.setInput('previousMonthLabel', 'Previous month');
    fixture.componentRef.setInput('nextMonthLabel', 'Next month');

    await fixture.whenStable();

    expect(
      fixture.nativeElement.querySelector('.ui-date-range-presets').getAttribute('aria-label'),
    ).toBe('Quick ranges');
    const buttons = fixture.nativeElement.querySelectorAll('.ui-date-range-nav');
    expect(buttons[0].getAttribute('aria-label')).toBe('Previous month');
    expect(buttons[1].getAttribute('aria-label')).toBe('Next month');
  });

  it('should expose a passive loading state without disabling the trigger', async () => {
    const fixture = TestBed.createComponent(UiDateRangePicker);
    fixture.componentRef.setInput('loading', true);

    await fixture.whenStable();

    const trigger = getTrigger(fixture);

    expect(trigger.getAttribute('aria-busy')).toBe('true');
    expect(trigger.disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('.ui-input-loading')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.ui-date-range-chevron')).toBeNull();
  });

  it('should render the selected range in the trigger', async () => {
    const fixture = await createHostFixture();
    const trigger = getTrigger(fixture);

    expect(trigger.textContent).toContain('15 июн. 2026 г. — 20 июн. 2026 г.');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should transition the trigger label when the selected range changes', async () => {
    const fixture = await createHostFixture();
    const rangePicker = fixture.componentInstance.rangePicker();
    const label = fixture.nativeElement.querySelector(
      '.ui-date-range-trigger-label',
    ) as HTMLElement;
    holdElementAnimations(label);

    rangePicker.value.set({ start: '2026-07-01', end: '2026-07-05' });
    await fixture.whenStable();

    expect(label.textContent).toContain('15 июн. 2026 г. — 20 июн. 2026 г.');
    expect(label.getAttribute('data-swap-phase')).toBe('exit');

    const exit = new Event('transitionend', { bubbles: true });
    Object.defineProperty(exit, 'propertyName', { value: 'opacity' });
    label.dispatchEvent(exit);
    await fixture.whenStable();

    expect(label.textContent).toContain('01 июл. 2026 г. — 05 июл. 2026 г.');
    expect(label.getAttribute('data-swap-phase')).toBe('idle');
  });

  it('should wire ui-input label to the button trigger', async () => {
    const fixture = await createHostFixture();
    const label = fixture.nativeElement.querySelector('.ui-input-label') as HTMLLabelElement;
    const trigger = getTrigger(fixture);

    expect(trigger.hasAttribute('uiInputControl')).toBe(true);
    expect(label.textContent).toContain('Billing period');
    expect(label.htmlFor).toBe(trigger.id);
    expect(trigger.getAttribute('aria-labelledby')).toContain(label.id);
  });

  it('should open a native popover dialog containing two aria grids', async () => {
    const fixture = await createHostFixture();
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await openRangePicker(fixture);

    const panel = getPanel(fixture);
    const grids = await loader.getAllHarnesses(GridHarness);

    expect(panel?.getAttribute('popover')).toBe('auto');
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-labelledby')).toBeTruthy();
    expect(grids).toHaveLength(2);
    expect(await grids[0].getCellTextByIndex()).toContainEqual(['1', '2', '3', '4', '5', '6', '7']);
    expect(getTrigger(fixture).getAttribute('aria-expanded')).toBe('true');
  });

  it('should transition both visible months in their spatial direction', async () => {
    const fixture = TestBed.createComponent(UiDateRangePicker);
    fixture.componentRef.setInput('value', { start: '2026-06-15', end: '2026-06-20' });
    await fixture.whenStable();

    fixture.componentInstance.open();
    await fixture.whenStable();
    const title = fixture.nativeElement.querySelector('.ui-date-range-title') as HTMLElement;
    holdElementAnimations(title);
    fixture.componentInstance.nextMonth();
    await fixture.whenStable();

    expect(fixture.componentInstance.leftView().toString()).toBe('2026-06');
    expect(title.getAttribute('data-swap-phase')).toBe('exit');
    expect(title.getAttribute('data-swap-direction')).toBe('next');

    const exit = new Event('transitionend', { bubbles: true });
    Object.defineProperty(exit, 'propertyName', { value: 'opacity' });
    title.dispatchEvent(exit);
    await fixture.whenStable();

    expect(fixture.componentInstance.leftView().toString()).toBe('2026-07');
    expect(title.getAttribute('data-swap-phase')).toBe('idle');
  });

  it('should leave Home navigation to the aria grid instead of changing months', async () => {
    const fixture = await createHostFixture();
    const rangePicker = fixture.componentInstance.rangePicker();

    await openRangePicker(fixture);
    rangePicker.today.set('2026-08-10');

    getPanel(fixture)?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();

    expect(rangePicker.leftView().toString()).toBe('2026-06');
    expect(rangePicker.monthSwapPhase()).toBe('idle');
  });

  it.each(['PageUp', 'PageDown'])(
    'should keep %s navigation inside the two-month min/max window',
    async (key) => {
      const fixture = await createHostFixture();
      await openRangePicker(fixture);
      const panel = getPanel(fixture)!;

      panel.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      await fixture.whenStable();

      expect(fixture.componentInstance.rangePicker().leftView().toString()).toBe('2026-06');
      expect(fixture.componentInstance.rangePicker().rightView().toString()).toBe('2026-07');
      expect(panel.querySelector('.ui-date-range-title')?.getAttribute('data-swap-phase')).toBe(
        'idle',
      );
    },
  );

  it('should expose selected range edges through the Angular Aria grid harness', async () => {
    const fixture = await createHostFixture();
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await openRangePicker(fixture);

    const grids = await loader.getAllHarnesses(GridHarness);
    const selected = [
      ...(await grids[0].getCells({ selected: true })),
      ...(await grids[1].getCells({ selected: true })),
    ];

    expect(selected).toHaveLength(2);
  });

  it('should mark both range edges with stable visual classes', async () => {
    const fixture = await createHostFixture();

    await openRangePicker(fixture);

    const edges = [...fixture.nativeElement.querySelectorAll('.ui-date-range-edge')].map((edge) =>
      edge.textContent.trim(),
    );

    expect(edges).toEqual(['15', '20']);
  });

  it('should layer range preview fill behind selected days', async () => {
    const fixture = await createHostFixture();

    await openRangePicker(fixture);

    const start = fixture.nativeElement.querySelector('[data-edge="start"]') as HTMLElement;
    const day = start.querySelector('.ui-date-range-day') as HTMLElement;
    const startStyle = getComputedStyle(start);
    const dayStyle = getComputedStyle(day);

    expect(startStyle.position).toBe('relative');
    expect(dayStyle.position).toBe('relative');
    expect(dayStyle.zIndex).toBe('1');
  });

  it('should not show range preview fill before an end date is previewed', async () => {
    const fixture = await createHostFixture();
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await openRangePicker(fixture);

    await (await loader.getHarness(GridCellHarness.with({ text: '9' }))).click();

    const pendingStart = [...fixture.nativeElement.querySelectorAll('.ui-date-range-cell')].find(
      (cell) => cell.textContent.trim() === '9',
    ) as HTMLElement;

    expect(pendingStart.classList.contains('ui-date-range-pending-range')).toBe(false);
  });

  it('should add edge metadata to pending range preview endpoints', async () => {
    const fixture = await createHostFixture();
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await openRangePicker(fixture);

    await (await loader.getHarness(GridCellHarness.with({ text: '9' }))).click();

    const cells = [...fixture.nativeElement.querySelectorAll('.ui-date-range-cell')];
    const hoverCell = cells.find((cell) => cell.textContent.trim() === '12') as HTMLElement;

    hoverCell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await fixture.whenStable();

    const pendingStart = cells.find((cell) => cell.textContent.trim() === '9') as HTMLElement;

    expect(pendingStart.getAttribute('data-edge')).toBe('start');
    expect(hoverCell.getAttribute('data-edge')).toBe('end');
  });

  it('should keep day clicks in draft until apply', async () => {
    const fixture = await createHostFixture();
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await openRangePicker(fixture);

    await (await loader.getHarness(GridCellHarness.with({ text: '16' }))).click();
    await (await loader.getHarness(GridCellHarness.with({ text: '18' }))).click();
    await fixture.whenStable();

    expect(fixture.componentInstance.rangePicker().value()).toEqual({
      start: '2026-06-15',
      end: '2026-06-20',
    });

    const apply = fixture.nativeElement.querySelector(
      '.ui-date-range-action-accent',
    ) as HTMLButtonElement;

    apply.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.range()).toEqual({
      start: '2026-06-16',
      end: '2026-06-18',
    });
    // The panel stays mounted (so its exit can animate); a closed picker is
    // expressed by aria-expanded, not by removing the node.
    expect(getTrigger(fixture).getAttribute('aria-expanded')).toBe('false');
  });

  it('should write the applied range back to a signal form field', async () => {
    const fixture = TestBed.createComponent(SignalFormTestHost);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await fixture.whenStable();
    await fixture.whenRenderingDone();
    await openRangePicker(fixture);

    await (await loader.getHarness(GridCellHarness.with({ text: '16' }))).click();
    await (await loader.getHarness(GridCellHarness.with({ text: '18' }))).click();

    const apply = fixture.nativeElement.querySelector(
      '.ui-date-range-action-accent',
    ) as HTMLButtonElement;

    apply.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.model().range).toEqual({
      start: '2026-06-16',
      end: '2026-06-18',
    });
    expect(fixture.componentInstance.formState.range().value()).toEqual({
      start: '2026-06-16',
      end: '2026-06-18',
    });
  });

  it('should mark dates outside min and max as disabled', async () => {
    const fixture = await createHostFixture();
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await openRangePicker(fixture);

    expect(
      await loader.getHarness(GridCellHarness.with({ text: '1', disabled: true })),
    ).toBeTruthy();
    expect(
      await loader.getHarness(GridCellHarness.with({ text: '15', disabled: false })),
    ).toBeTruthy();
  });

  it('should configure the panel with css anchor positioning', async () => {
    const fixture = await createHostFixture();

    await openRangePicker(fixture);

    const host = fixture.nativeElement.querySelector('ui-date-range-picker') as HTMLElement;
    const fieldSurface = host.querySelector('.ui-input-control') as HTMLElement;
    const panel = getPanel(fixture) as HTMLElement;
    const hostStyle = getComputedStyle(host);
    const fieldSurfaceStyle = getComputedStyle(fieldSurface);
    const panelStyle = getComputedStyle(panel);

    expect(hostStyle.anchorScope).toContain('--ui-date-range-trigger-');
    expect(fieldSurfaceStyle.anchorName).toContain('--ui-date-range-trigger-');
    expect(panelStyle.position).toBe('fixed');
    expect(panelStyle.positionAnchor).toContain('--ui-date-range-trigger-');
    expect(panelStyle.top).toContain('anchor(bottom)');
  });

  it('should space day tiles via the gap tokens and animate panel entry', async () => {
    const fixture = await createHostFixture();

    await openRangePicker(fixture);

    const grid = fixture.nativeElement.querySelector('.ui-date-range-grid') as HTMLElement;
    // The open/close transition lives on the inner shared .ui-popup-box (the
    // visible card), not the surface shell — the shell only transitions overlay/
    // display so it lingers in the top layer while the box animates out.
    const box = fixture.nativeElement.querySelector('.ui-popup-box') as HTMLElement;
    const gridStyle = getComputedStyle(grid);
    const boxStyle = getComputedStyle(box);

    // The day tiles are separated through the grid's border-spacing, driven by
    // the --ui-date-range-day-gap(-inline) tokens (jsdom leaves the var() refs
    // unresolved, so assert the wiring rather than a resolved length).
    expect(gridStyle.borderSpacing).toContain('--ui-date-range-day-gap');
    // Entry animation: the box sits at its hidden base state until the popover
    // opens. jsdom has no top layer, so :popover-open never matches and the box
    // stays hidden here — assert that closed base state plus the presence of a
    // transition (jsdom collapses the var()-timed shorthand to "all", so we
    // can't match the individual opacity/translate/scale property names).
    expect(boxStyle.opacity).toBe('0');
    expect(boxStyle.transitionProperty).not.toBe('none');
  });

  it('should clear the draft without committing until apply', async () => {
    const fixture = await createHostFixture();

    await openRangePicker(fixture);

    const clear = fixture.nativeElement.querySelector('.ui-date-range-action') as HTMLButtonElement;
    const apply = fixture.nativeElement.querySelector(
      '.ui-date-range-action-accent',
    ) as HTMLButtonElement;

    clear.click();
    await fixture.whenStable();

    expect(apply.disabled).toBe(false);

    apply.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.range()).toEqual({ start: '', end: '' });
  });

  it('should not emit touch twice when a programmatic close is followed by native toggle', async () => {
    const fixture = await createHostFixture();
    const touch = vi.fn();

    fixture.componentInstance.rangePicker().touch.subscribe(touch);

    await openRangePicker(fixture);

    fixture.componentInstance.rangePicker().cancel();
    fixture.componentInstance.rangePicker().onPanelToggle({ newState: 'closed' } as ToggleEvent);

    expect(touch).toHaveBeenCalledTimes(1);
  });
});
