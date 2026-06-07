import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTooltip, UiTooltipSurface } from './ui-tooltip';

@Component({
  imports: [UiTooltip, UiTooltipSurface],
  template: `
    <span uiTooltip>
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

  it('should apply tooltip semantics and styling hooks', () => {
    const tooltip = hostFixture.nativeElement.querySelector('[uiTooltip]');
    const surface = hostFixture.nativeElement.querySelector('[uiTooltipSurface]');

    expect(tooltip.classList).toContain('ui-tooltip');
    expect(tooltip.getAttribute('role')).toBe('tooltip');
    expect(surface.classList).toContain('ui-tooltip-surface');
  });
});
