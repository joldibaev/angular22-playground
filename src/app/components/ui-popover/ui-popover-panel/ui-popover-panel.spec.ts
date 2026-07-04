import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiPopoverPanel } from './ui-popover-panel';

@Component({
  imports: [UiPopoverPanel],
  template: `
    <ng-template #content><strong>Details</strong></ng-template>
    <ui-popover-panel
      [content]="content"
      panelId="account-popover"
      anchorName="--account-trigger"
      placement="bottom"
      role="dialog"
      maxWidth="24rem"
      withFallback
    />
  `,
})
class TestHost {
  readonly panel = viewChild.required(UiPopoverPanel);
}

describe('UiPopoverPanel', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  it('should render template content in a native auto popover', () => {
    const panel = fixture.nativeElement.querySelector('ui-popover-panel') as HTMLElement;

    expect(panel.id).toBe('account-popover');
    expect(panel.getAttribute('popover')).toBe('auto');
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.textContent).toContain('Details');
  });

  it('should expose positioning and sizing inputs on the host', () => {
    const panel = fixture.nativeElement.querySelector('ui-popover-panel') as HTMLElement;

    expect(panel.classList).toContain('arrow-panel--bottom');
    expect(panel.classList).toContain('arrow-panel--fallback');
    expect(panel.style.positionAnchor).toBe('--account-trigger');
    expect(panel.style.getPropertyValue('--ui-popover-max-width')).toBe('24rem');
  });
});
