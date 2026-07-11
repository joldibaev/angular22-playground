import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDialog } from './ui-dialog';
import { UiDialogClose } from './ui-dialog-close/ui-dialog-close';
import { UiDialogTrigger } from './ui-dialog-trigger/ui-dialog-trigger';

@Component({
  imports: [UiDialog, UiDialogClose, UiDialogTrigger],
  template: `
    <button type="button" [uiDialogTrigger]="dialog">Open</button>
    <ui-dialog
      #dialog="uiDialog"
      [title]="title()"
      caption="A short description"
      role="alertdialog"
      size="xl"
      dismiss="closerequest"
      [ariaDescribedBy]="'external-description'"
      [closeLabel]="'Dismiss invite dialog'"
      [withCloseButton]="withClose()"
      (openChange)="lastOpen.set($event)"
    >
      <p class="dialog-body-text">Body</p>
      <div uiDialogFooter>
        <button type="button" class="footer-action" [uiDialogClose]="dialog">OK</button>
      </div>
    </ui-dialog>
  `,
})
class TestHost {
  readonly title = signal('Invite');
  readonly withClose = signal(true);
  readonly lastOpen = signal<boolean | null>(null);
}

function dispatchToggle(dialog: HTMLElement, newState: 'open' | 'closed'): void {
  const event = new Event('toggle');
  Object.defineProperty(event, 'newState', { value: newState });
  dialog.dispatchEvent(event);
}

describe('UiDialog', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  function dialog(): HTMLDialogElement {
    return fixture.nativeElement.querySelector('dialog');
  }

  it('should render accessible labels, description, role, and size', () => {
    const title = dialog().querySelector('.ui-dialog-title');

    expect(dialog().classList.contains('ui-dialog-xl')).toBe(true);
    expect(dialog().getAttribute('role')).toBe('alertdialog');
    expect(title?.textContent?.trim()).toBe('Invite');
    expect(dialog().querySelector('.ui-dialog-caption')?.textContent?.trim()).toBe(
      'A short description',
    );
    expect(dialog().getAttribute('aria-labelledby')).toBe(title?.id);
    expect(dialog().getAttribute('aria-describedby')).toBe('external-description');
  });

  it('should generate a dialog id and map dismiss to the closedby attribute', () => {
    expect(dialog().id).toMatch(/^ui-dialog-\d+$/);
    expect(dialog().getAttribute('closedby')).toBe('closerequest');
  });

  it('should wire the close button with invoker commands targeting the dialog', () => {
    const close = dialog().querySelector('.ui-dialog-close') as HTMLButtonElement;

    expect(close.getAttribute('command')).toBe('close');
    expect(close.getAttribute('commandfor')).toBe(dialog().id);
    expect(close.getAttribute('aria-label')).toBe('Dismiss invite dialog');
  });

  it('should hide invoker command wiring behind trigger and close directives', () => {
    const trigger = fixture.nativeElement.querySelector('[uiDialogTrigger]') as HTMLButtonElement;
    const close = dialog().querySelector('[uiDialogClose]') as HTMLButtonElement;

    expect(trigger.getAttribute('command')).toBe('show-modal');
    expect(trigger.getAttribute('commandfor')).toBe(dialog().id);
    expect(close.getAttribute('command')).toBe('close');
    expect(close.getAttribute('commandfor')).toBe(dialog().id);
  });

  it('should hide the close button when withCloseButton is false', () => {
    fixture.componentInstance.withClose.set(false);
    fixture.detectChanges();

    expect(dialog().querySelector('.ui-dialog-close')).toBeNull();
  });

  it('should project body content and the footer slot', () => {
    expect(dialog().querySelector('.dialog-body-text')).toBeTruthy();
    expect(dialog().querySelector('.ui-dialog-footer .footer-action')).toBeTruthy();
  });

  it('should emit openChange from the native toggle event', () => {
    dispatchToggle(dialog(), 'open');
    expect(fixture.componentInstance.lastOpen()).toBe(true);

    dispatchToggle(dialog(), 'closed');
    expect(fixture.componentInstance.lastOpen()).toBe(false);
  });
});
