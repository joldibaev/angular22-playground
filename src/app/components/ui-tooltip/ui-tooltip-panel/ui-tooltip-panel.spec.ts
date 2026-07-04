import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTooltipPanel } from './ui-tooltip-panel';

describe('UiTooltipPanel', () => {
  let fixture: ComponentFixture<UiTooltipPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UiTooltipPanel] }).compileComponents();
    fixture = TestBed.createComponent(UiTooltipPanel);
    fixture.componentRef.setInput('text', 'Helpful context');
    fixture.componentRef.setInput('tooltipId', 'help-tooltip');
    await fixture.whenStable();
  });

  it('should render a native hint popover with accessible text', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.id).toBe('help-tooltip');
    expect(host.getAttribute('popover')).toBe('hint');
    expect(host.textContent).toContain('Helpful context');
    expect(host.classList).toContain('arrow-panel--top');
  });

  it('should apply placement and fallback inputs', async () => {
    fixture.componentRef.setInput('placement', 'right');
    fixture.componentRef.setInput('withFallback', true);
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList).toContain('arrow-panel--right');
    expect(host.classList).toContain('arrow-panel--fallback');
    expect(host.classList).not.toContain('arrow-panel--top');
  });
});
