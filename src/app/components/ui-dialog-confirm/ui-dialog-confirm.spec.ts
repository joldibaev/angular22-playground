import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDialogConfirm } from './ui-dialog-confirm';

@Component({
  imports: [UiDialogConfirm],
  template: `
    <ui-dialog-confirm
      tone="destructive"
      title="Delete?"
      message="Cannot be undone"
      confirmLabel="Delete"
      cancelLabel="Keep"
      (confirm)="confirmed = confirmed + 1"
      (cancel)="cancelled = cancelled + 1"
    />
  `,
})
class TestHost {
  confirmed = 0;
  cancelled = 0;
}

function dispatchToggle(dialog: HTMLElement, newState: 'open' | 'closed'): void {
  const event = new Event('toggle');
  Object.defineProperty(event, 'newState', { value: newState });
  dialog.dispatchEvent(event);
}

describe('UiDialogConfirm', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  function actionButtons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.ui-dialog-confirm-actions button'));
  }

  it('should render the message, custom action labels, and alertdialog metadata', () => {
    const [cancel, confirm] = actionButtons();
    const dialog = fixture.nativeElement.querySelector('dialog');
    const message = fixture.nativeElement.querySelector('.ui-dialog-confirm-message');

    expect(message?.textContent).toContain('Cannot be undone');
    expect(dialog?.getAttribute('role')).toBe('alertdialog');
    expect(dialog?.getAttribute('aria-describedby')).toBe(message?.id);
    expect(cancel.textContent?.trim()).toBe('Keep');
    expect(confirm.textContent?.trim()).toBe('Delete');
  });

  it('should expose and forward a stable dialog id for command triggers', () => {
    const dialog = fixture.nativeElement.querySelector('dialog');
    const [cancel, confirm] = actionButtons();

    expect(dialog.id).toMatch(/^ui-dialog-confirm-\d+$/);
    expect(cancel.getAttribute('command')).toBe('close');
    expect(cancel.getAttribute('commandfor')).toBe(dialog.id);
    expect(confirm.getAttribute('command')).toBe('close');
    expect(confirm.getAttribute('commandfor')).toBe(dialog.id);
  });

  it('should style the confirm action with the destructive tone', () => {
    const [, confirm] = actionButtons();

    expect(confirm.classList.contains('ui-button-destructive')).toBe(true);
  });

  it('should emit confirm and close on the confirm action', () => {
    const [, confirm] = actionButtons();

    confirm.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.confirmed).toBe(1);
  });

  it('should emit cancel and close on the cancel action', () => {
    const [cancel] = actionButtons();

    cancel.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.cancelled).toBe(1);
  });

  it('should emit cancel when the dialog is dismissed without an action', () => {
    const dialog = fixture.nativeElement.querySelector('dialog');

    dispatchToggle(dialog, 'open');
    dispatchToggle(dialog, 'closed');

    expect(fixture.componentInstance.cancelled).toBe(1);
  });
});
