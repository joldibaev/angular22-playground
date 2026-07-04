import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiButton } from '../ui-button/ui-button';
import { UiTooltip } from './ui-tooltip';

@Component({
  imports: [UiButton, UiTooltip],
  template: ` <button uiButton [uiTooltip]="text()">Button</button> `,
})
class TooltipTestHost {
  readonly text = signal('Hello');
}

describe('UiTooltip', () => {
  let hostFixture: ComponentFixture<TooltipTestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipTestHost],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TooltipTestHost);
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();
  });

  function getTrigger(): HTMLElement {
    return hostFixture.nativeElement.querySelector('button');
  }

  function getInterestTarget(trigger: HTMLElement): HTMLElement | null {
    return document.getElementById(trigger.getAttribute('interestfor') ?? '');
  }

  it('wires the trigger to a generated `popover="hint"` panel via interestfor', () => {
    const trigger = getTrigger();
    const tooltip = getInterestTarget(trigger);

    expect(trigger.classList).toContain('ui-tooltip-trigger');
    expect(trigger.getAttribute('interestfor')).toBeTruthy();
    expect(tooltip?.getAttribute('popover')).toBe('hint');
    expect(tooltip?.textContent).toContain('Hello');
  });

  it('keeps the panel text in sync with the input', async () => {
    const trigger = getTrigger();

    hostFixture.componentInstance.text.set('Updated');
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    expect(getInterestTarget(trigger)?.textContent).toContain('Updated');
  });

  it('removes the panel and interestfor link when the text is cleared', async () => {
    const trigger = getTrigger();
    const tooltipId = trigger.getAttribute('interestfor');

    expect(document.getElementById(tooltipId ?? '')).toBeTruthy();

    hostFixture.componentInstance.text.set('');
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    expect(trigger.getAttribute('interestfor')).toBeNull();
    expect(document.getElementById(tooltipId ?? '')).toBeNull();
  });

  it('removes generated tooltip nodes when destroyed', () => {
    const trigger = getTrigger();
    const tooltipId = trigger.getAttribute('interestfor');

    expect(document.getElementById(tooltipId ?? '')).toBeTruthy();

    hostFixture.destroy();

    expect(document.getElementById(tooltipId ?? '')).toBeNull();
  });
});
