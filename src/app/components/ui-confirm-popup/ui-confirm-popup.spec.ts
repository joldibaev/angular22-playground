import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiConfirmPopup } from './ui-confirm-popup';

@Component({
  imports: [UiConfirmPopup],
  template: `
    <button
      type="button"
      uiConfirmPopup
      uiConfirmMessage="Delete this item?"
      uiConfirmLabel="Delete"
      uiCancelLabel="Keep"
      uiConfirmTone="destructive"
      uiPlacement="right"
      (uiConfirm)="confirmed = confirmed + 1"
      (uiCancel)="cancelled = cancelled + 1"
      (uiVisibleChange)="visibility.push($event)"
    >
      Delete
    </button>
  `,
})
class TestHost {
  confirmed = 0;
  cancelled = 0;
  visibility: boolean[] = [];
}

function dispatchToggle(panel: HTMLElement, newState: 'open' | 'closed'): void {
  const event = new Event('toggle');
  Object.defineProperty(event, 'newState', { value: newState });
  panel.dispatchEvent(event);
}

describe('UiConfirmPopup', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  });

  afterEach(() => fixture.destroy());

  function trigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  function panel(): HTMLElement {
    return document.getElementById(trigger().getAttribute('commandfor') ?? '') as HTMLElement;
  }

  it('wires the button to an accessible generated confirmation popover', () => {
    const button = trigger();
    const popup = panel();

    expect(button.classList).toContain('ui-confirm-popup-trigger');
    expect(button.getAttribute('command')).toBe('toggle-popover');
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.getAttribute('aria-controls')).toBe(popup.id);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(popup.getAttribute('popover')).toBe('auto');
    expect(popup.getAttribute('role')).toBe('dialog');
    expect(popup.classList).toContain('arrow-panel--right');
    expect(popup.classList).toContain('arrow-panel--fallback');
    expect(popup.textContent).toContain('Delete this item?');
    expect(popup.textContent).toContain('Delete');
    expect(popup.textContent).toContain('Keep');
  });

  it('emits confirm once without also treating the subsequent close as cancellation', async () => {
    const popup = panel();
    const confirm = popup.querySelector('.ui-button-destructive') as HTMLButtonElement;

    dispatchToggle(popup, 'open');
    confirm.click();
    dispatchToggle(popup, 'closed');
    await fixture.whenStable();

    expect(fixture.componentInstance.confirmed).toBe(1);
    expect(fixture.componentInstance.cancelled).toBe(0);
    expect(fixture.componentInstance.visibility).toEqual([true, false]);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('treats light dismiss or Escape as one cancellation', async () => {
    const popup = panel();

    dispatchToggle(popup, 'open');
    dispatchToggle(popup, 'closed');
    dispatchToggle(popup, 'closed');
    await fixture.whenStable();

    expect(fixture.componentInstance.confirmed).toBe(0);
    expect(fixture.componentInstance.cancelled).toBe(1);
  });

  it('removes its generated panel without emitting cancellation on teardown', () => {
    const panelId = panel().id;
    const host = fixture.componentInstance;

    fixture.destroy();

    expect(document.getElementById(panelId)).toBeNull();
    expect(host.cancelled).toBe(0);
  });
});
