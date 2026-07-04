import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDrawer } from './ui-drawer';

@Component({
  imports: [UiDrawer],
  template: `
    <ui-drawer
      [title]="title()"
      side="start"
      size="sm"
      dismiss="any"
      closeLabel="Dismiss filters"
      (openChange)="lastOpen.set($event)"
    >
      <p class="drawer-body-text">Body</p>
      <div uiDrawerFooter><button type="button" class="footer-action">Apply</button></div>
    </ui-drawer>
  `,
})
class TestHost {
  readonly title = signal('Filters');
  readonly lastOpen = signal<boolean | null>(null);
}

function dispatchToggle(dialog: HTMLElement, newState: 'open' | 'closed'): void {
  const event = new Event('toggle');
  Object.defineProperty(event, 'newState', { value: newState });
  dialog.dispatchEvent(event);
}

describe('UiDrawer', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  function dialog(): HTMLDialogElement {
    return fixture.nativeElement.querySelector('dialog');
  }

  it('should reflect side and size as classes and generate a drawer id', () => {
    expect(dialog().classList.contains('ui-drawer-start')).toBe(true);
    expect(dialog().classList.contains('ui-drawer-sm')).toBe(true);
    expect(dialog().id).toMatch(/^ui-drawer-\d+$/);
  });

  it('should render the title with aria-labelledby and map dismiss to closedby', () => {
    const title = dialog().querySelector('.ui-drawer-title');

    expect(title?.textContent?.trim()).toBe('Filters');
    expect(dialog().getAttribute('aria-labelledby')).toBe(title?.id);
    expect(dialog().getAttribute('closedby')).toBe('any');
  });

  it('should wire the close button with invoker commands targeting the drawer', () => {
    const close = dialog().querySelector('.ui-drawer-close') as HTMLButtonElement;

    expect(close.getAttribute('command')).toBe('close');
    expect(close.getAttribute('commandfor')).toBe(dialog().id);
    expect(close.getAttribute('aria-label')).toBe('Dismiss filters');
  });

  it('should project body content and the footer slot', () => {
    expect(dialog().querySelector('.drawer-body-text')).toBeTruthy();
    expect(dialog().querySelector('.ui-drawer-footer .footer-action')).toBeTruthy();
  });

  it('should emit openChange from the native toggle event', () => {
    dispatchToggle(dialog(), 'open');
    expect(fixture.componentInstance.lastOpen()).toBe(true);

    dispatchToggle(dialog(), 'closed');
    expect(fixture.componentInstance.lastOpen()).toBe(false);
  });
});
