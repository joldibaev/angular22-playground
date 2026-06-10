import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTooltip, UiTooltipSurface } from './ui-tooltip';

@Component({
  imports: [UiTooltip, UiTooltipSurface],
  template: `
    <button uiTooltip="Hello" uiTooltipVariant="inverted">Button</button>

    <span uiTooltip uiTooltipVariant="red" [uiTooltipOpen]="false">
      <span uiTooltipSurface>Required</span>
    </span>
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
  });

  it('should create a generated tooltip for string content', () => {
    const trigger = hostFixture.nativeElement.querySelector('button');
    const tooltipId = trigger.getAttribute('aria-describedby');
    const tooltip = document.getElementById(tooltipId ?? '');

    expect(trigger.classList).toContain('ui-tooltip-trigger');
    expect(trigger.getAttribute('role')).toBeNull();
    expect(tooltip?.getAttribute('role')).toBe('tooltip');
    expect(tooltip?.getAttribute('hidden')).toBe('');
    expect(tooltip?.classList).toContain('ui-tooltip-inverted');
    expect(tooltip?.textContent).toContain('Hello');
  });

  it('should apply custom tooltip semantics and variants', () => {
    const tooltip = hostFixture.nativeElement.querySelector('span[uiTooltip]');
    const surface = hostFixture.nativeElement.querySelector('[uiTooltipSurface]');

    expect(tooltip.classList).toContain('ui-tooltip');
    expect(tooltip.classList).toContain('ui-tooltip-red');
    expect(tooltip.getAttribute('role')).toBe('tooltip');
    expect(tooltip.getAttribute('hidden')).toBe('');
    expect(surface.classList).toContain('ui-tooltip-surface');
  });
});
