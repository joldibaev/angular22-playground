import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDialog } from './ui-dialog';

@Component({
  imports: [UiDialog],
  template: `
    <ui-dialog
      [title]="title()"
      size="lg"
      dismiss="closerequest"
      [withCloseButton]="withClose()"
      (openChange)="lastOpen.set($event)"
    >
      <p class="dialog-body-text">Body</p>
      <div uiDialogFooter><button type="button" class="footer-action">OK</button></div>
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

  it('should render the title, link it via aria-labelledby, and reflect size', () => {
    const title = dialog().querySelector('.ui-dialog-title');

    expect(dialog().classList.contains('ui-dialog-lg')).toBe(true);
    expect(title?.textContent?.trim()).toBe('Invite');
    expect(dialog().getAttribute('aria-labelledby')).toBe(title?.id);
  });

  it('should generate a dialog id and map dismiss to the closedby attribute', () => {
    expect(dialog().id).toMatch(/^ui-dialog-\d+$/);
    expect(dialog().getAttribute('closedby')).toBe('closerequest');
  });

  it('should wire the close button with invoker commands targeting the dialog', () => {
    const close = dialog().querySelector('.ui-dialog-close') as HTMLButtonElement;

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
