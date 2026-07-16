import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiConfirmPopupPanel } from './ui-confirm-popup-panel';

@Component({
  imports: [UiConfirmPopupPanel],
  template: `
    <ui-confirm-popup-panel
      message="Delete this item?"
      confirmLabel="Delete"
      cancelLabel="Keep"
      tone="destructive"
      defaultFocus="cancel"
      panelId="delete-confirm-popup"
      messageId="delete-confirm-popup-message"
      anchorName="--delete-trigger"
      placement="right"
      withFallback
      (confirm)="confirmed = confirmed + 1"
      (cancel)="cancelled = cancelled + 1"
    />
  `,
})
class TestHost {
  confirmed = 0;
  cancelled = 0;
}

describe('UiConfirmPopupPanel', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('renders an accessible anchored popover with confirmation actions', () => {
    const panel = fixture.nativeElement.querySelector('ui-confirm-popup-panel') as HTMLElement;
    const message = panel.querySelector('.ui-confirm-popup-message') as HTMLElement;
    const [cancel, confirm] = Array.from(
      panel.querySelectorAll<HTMLButtonElement>('.ui-confirm-popup-actions button'),
    );

    expect(panel.id).toBe('delete-confirm-popup');
    expect(panel.getAttribute('popover')).toBe('auto');
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-labelledby')).toBe(message.id);
    expect(panel.classList).toContain('arrow-panel--right');
    expect(panel.classList).toContain('arrow-panel--fallback');
    expect(panel.style.positionAnchor).toBe('--delete-trigger');
    expect(message.textContent).toContain('Delete this item?');
    expect(cancel.textContent?.trim()).toBe('Keep');
    expect(cancel.classList).toContain('ui-button-sm');
    expect(cancel.hasAttribute('autofocus')).toBe(true);
    expect(confirm.textContent?.trim()).toBe('Delete');
    expect(confirm.classList).toContain('ui-button-sm');
    expect(confirm.hasAttribute('autofocus')).toBe(false);
    expect(confirm.classList).toContain('ui-button-destructive');
    expect(cancel.getAttribute('command')).toBe('hide-popover');
    expect(confirm.getAttribute('commandfor')).toBe(panel.id);
  });

  it('emits explicit confirm and cancel outcomes', async () => {
    const [cancel, confirm] = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>(
        '.ui-confirm-popup-actions button',
      ),
    );

    confirm.click();
    cancel.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.confirmed).toBe(1);
    expect(fixture.componentInstance.cancelled).toBe(1);
  });
});
