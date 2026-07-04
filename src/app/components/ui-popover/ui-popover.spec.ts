import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiPopover } from './ui-popover';

@Component({
  imports: [UiPopover],
  template: `
    <button type="button" uiPopover uiPlacement="right" uiWithFallback [uiContent]="content">
      Open
    </button>

    <ng-template #content>
      <strong>Details</strong>
      <span>Popover content</span>
    </ng-template>
  `,
})
class PopoverTestHost {}

describe('UiPopover', () => {
  let hostFixture: ComponentFixture<PopoverTestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverTestHost],
    }).compileComponents();

    hostFixture = TestBed.createComponent(PopoverTestHost);
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();
  });

  function getTrigger(): HTMLElement {
    return hostFixture.nativeElement.querySelector('button');
  }

  function getPanel(trigger: HTMLElement): HTMLElement | null {
    return document.getElementById(trigger.getAttribute('commandfor') ?? '');
  }

  it('wires the trigger to a generated click-only popover via an invoker command', () => {
    const trigger = getTrigger();
    const panel = getPanel(trigger);

    expect(trigger.classList).toContain('ui-popover-trigger');
    expect(trigger.getAttribute('command')).toBe('toggle-popover');
    expect(trigger.getAttribute('commandfor')).toBeTruthy();
    expect(trigger.hasAttribute('interestfor')).toBe(false);
    expect(panel?.getAttribute('popover')).toBe('auto');
    expect(panel?.classList).toContain('arrow-panel--right');
    expect(panel?.classList).toContain('arrow-panel--fallback');
    expect(panel?.textContent).toContain('Popover content');
  });

  it('removes the generated panel when destroyed', () => {
    const panelId = getTrigger().getAttribute('commandfor');

    expect(document.getElementById(panelId ?? '')).toBeTruthy();

    hostFixture.destroy();

    expect(document.getElementById(panelId ?? '')).toBeNull();
  });
});
