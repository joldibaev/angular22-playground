import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDialogSuccess } from './ui-dialog-success';

@Component({
  imports: [UiDialogSuccess],
  template: `
    <ui-dialog-success
      title="Payment complete"
      message="Receipt sent"
      actionLabel="Continue"
      dismiss="closerequest"
      (acknowledge)="acknowledged = acknowledged + 1"
    />
  `,
})
class TestHost {
  acknowledged = 0;
}

function dispatchToggle(dialog: HTMLElement, newState: 'open' | 'closed'): void {
  const event = new Event('toggle');
  Object.defineProperty(event, 'newState', { value: newState });
  dialog.dispatchEvent(event);
}

describe('UiDialogSuccess', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  it('should compose an accessible dialog with custom success copy', () => {
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    const message = fixture.nativeElement.querySelector('.ui-dialog-success-content p');

    expect(dialog.id).toMatch(/^ui-dialog-success-\d+$/);
    expect(dialog.getAttribute('closedby')).toBe('closerequest');
    expect(dialog.querySelector('.ui-dialog-title')?.textContent?.trim()).toBe('Payment complete');
    expect(message?.textContent?.trim()).toBe('Receipt sent');
    expect(dialog.getAttribute('aria-describedby')).toBe(message?.id);
  });

  it('should wire the acknowledgement action to the native close command', () => {
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    const button = fixture.nativeElement.querySelector(
      '.ui-dialog-success-actions button',
    ) as HTMLButtonElement;

    expect(button.textContent?.trim()).toBe('Continue');
    expect(button.getAttribute('command')).toBe('close');
    expect(button.getAttribute('commandfor')).toBe(dialog.id);

    button.click();
    expect(fixture.componentInstance.acknowledged).toBe(1);
  });

  it('should replay the success check when the dialog opens', async () => {
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    const check = fixture.nativeElement.querySelector('.ui-dialog-success-check') as HTMLElement;

    expect(check.getAttribute('data-state')).toBe('out');

    dispatchToggle(dialog, 'open');
    await fixture.whenStable();
    expect(check.getAttribute('data-state')).toBe('in');

    dispatchToggle(dialog, 'closed');
    await fixture.whenStable();
    expect(check.getAttribute('data-state')).toBe('out');
  });
});
