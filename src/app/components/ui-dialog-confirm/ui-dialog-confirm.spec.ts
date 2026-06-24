import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDialogConfirm } from './ui-dialog-confirm';

@Component({
  imports: [UiDialogConfirm],
  template: `
    <ui-dialog-confirm
      [(open)]="open"
      tone="destructive"
      title="Delete?"
      message="Cannot be undone"
      confirmLabel="Delete"
      cancelLabel="Keep"
      (confirm)="confirmed.set(confirmed() + 1)"
      (cancel)="cancelled.set(cancelled() + 1)"
    />
  `,
})
class TestHost {
  readonly open = signal(false);
  readonly confirmed = signal(0);
  readonly cancelled = signal(0);
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

  it('should render the message and the custom action labels', () => {
    const [cancel, confirm] = actionButtons();

    expect(fixture.nativeElement.querySelector('.ui-dialog-confirm-message')?.textContent).toContain(
      'Cannot be undone',
    );
    expect(cancel.textContent?.trim()).toBe('Keep');
    expect(confirm.textContent?.trim()).toBe('Delete');
  });

  it('should style the confirm action with the destructive tone', () => {
    const [, confirm] = actionButtons();

    expect(confirm.classList.contains('ui-button-destructive')).toBe(true);
  });

  it('should emit confirm and close on the confirm action', () => {
    const [, confirm] = actionButtons();

    confirm.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.confirmed()).toBe(1);
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('should emit cancel and close on the cancel action', () => {
    const [cancel] = actionButtons();

    cancel.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.cancelled()).toBe(1);
    expect(fixture.componentInstance.open()).toBe(false);
  });
});
