import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTooltip } from './ui-tooltip';

@Component({
  imports: [UiTooltip],
  template: `
    <button uiTooltip="Hello">Button</button>
  `,
})
class TooltipTestHost {}

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

  function getGeneratedTooltip(trigger: HTMLElement): HTMLElement | null {
    return document.getElementById(trigger.getAttribute('aria-describedby') ?? '');
  }

  it('should create a generated tooltip for string content after render', () => {
    const trigger = hostFixture.nativeElement.querySelector('button');
    const tooltip = getGeneratedTooltip(trigger);

    expect(trigger.classList).toContain('ui-tooltip-trigger');
    expect(trigger.getAttribute('role')).toBeNull();
    expect(tooltip?.getAttribute('role')).toBe('tooltip');
    expect(tooltip?.getAttribute('popover')).toBe('hint');
    expect(tooltip?.getAttribute('hidden')).toBe('');
    expect(tooltip?.textContent).toContain('Hello');
  });

  it('should show and hide a generated tooltip from pointer interaction', async () => {
    const trigger = hostFixture.nativeElement.querySelector('button');
    const tooltip = getGeneratedTooltip(trigger);

    trigger.dispatchEvent(new Event('mouseenter'));
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    expect(tooltip?.hasAttribute('hidden')).toBe(false);

    trigger.dispatchEvent(new Event('mouseleave'));
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    expect(tooltip?.getAttribute('hidden')).toBe('');
  });

  it('should close a generated tooltip with trigger Escape', async () => {
    const trigger = hostFixture.nativeElement.querySelector('button');
    const tooltip = getGeneratedTooltip(trigger);

    trigger.dispatchEvent(new Event('mouseenter'));
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    expect(tooltip?.hasAttribute('hidden')).toBe(false);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    expect(tooltip?.getAttribute('hidden')).toBe('');
  });

  it('should remove generated tooltip nodes when destroyed', () => {
    const trigger = hostFixture.nativeElement.querySelector('button');
    const tooltipId = trigger.getAttribute('aria-describedby');

    expect(document.getElementById(tooltipId ?? '')).toBeTruthy();

    hostFixture.destroy();

    expect(document.getElementById(tooltipId ?? '')).toBeNull();
  });
});
