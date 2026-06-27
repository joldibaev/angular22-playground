import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SonnerService } from './sonner.service';
import { UiSonner } from './ui-sonner';
import { UiSonnerToast } from './ui-sonner-toast/ui-sonner-toast';

@Component({
  imports: [UiSonner],
  template: `
    <ui-sonner
      position="bottom-center"
      [visibleToasts]="2"
      [closeButton]="true"
      [gap]="8"
    />
  `,
})
class TestHost {}

describe('UiSonner', () => {
  let fixture: ComponentFixture<TestHost>;
  let sonner: SonnerService;

  beforeEach(async () => {
    // jsdom cannot parse Chrome's typed attr() expressions; these tests assert DOM behavior only.
    TestBed.overrideComponent(UiSonner, { set: { styles: [] } });
    TestBed.overrideComponent(UiSonnerToast, { set: { styles: [] } });
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    sonner = TestBed.inject(SonnerService);
    sonner.reset();
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  function toasts(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[data-sonner-toast]'));
  }

  it('should render visible toasts with live-region semantics', async () => {
    sonner.success('Saved', 'The order is ready');
    await fixture.whenStable();

    const list = fixture.nativeElement.querySelector('.ui-sonner-list') as HTMLElement;
    const host = fixture.nativeElement.querySelector('ui-sonner') as HTMLElement;
    const [toast] = toasts();

    expect(list.getAttribute('data-sonner-toaster')).toBe('');
    expect(list.getAttribute('aria-label')).toContain('Notifications');
    expect(list.hasAttribute('data-theme')).toBe(false);
    expect(host.hasAttribute('aria-label')).toBe(false);
    expect(toast.getAttribute('role')).toBe('status');
    expect(toast.getAttribute('aria-live')).toBe('polite');
    expect(toast.getAttribute('data-close-button')).toBe('true');
    expect(toast.textContent).toContain('Saved');
    expect(toast.textContent).toContain('The order is ready');
  });

  it('should respect visibleToasts and position groups', async () => {
    sonner.info('First');
    sonner.warning('Second');
    sonner.destructive('Third');
    sonner.success('Top', undefined, { position: 'top-left' });
    await fixture.whenStable();

    const lists = Array.from(
      fixture.nativeElement.querySelectorAll('.ui-sonner-list'),
    ) as HTMLElement[];

    expect(lists).toHaveLength(2);
    expect(lists[0].getAttribute('data-y-position')).toBe('bottom');
    expect(lists[0].getAttribute('data-x-position')).toBe('center');
    expect(lists[0].querySelectorAll('[data-sonner-toast]')).toHaveLength(3);
    expect(lists[0].querySelectorAll('[data-visible="true"]')).toHaveLength(2);
    expect(lists[0].querySelectorAll('[data-visible="false"]')).toHaveLength(1);
    expect(
      lists[0].querySelector('[data-visible="false"]')?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(
      lists[0].querySelector('[data-visible="false"]')?.getAttribute('tabindex'),
    ).toBe('-1');
    expect(lists[1].getAttribute('data-y-position')).toBe('top');
    expect(lists[1].getAttribute('data-x-position')).toBe('left');
  });

  it('should use the configured gap for stacked offsets', async () => {
    sonner.info('First');
    sonner.warning('Second');
    await fixture.whenStable();

    const [, secondToast] = toasts();

    expect(secondToast.getAttribute('data-offset')).toBe('8px');
  });

  it('should wire action and cancel buttons', async () => {
    const action = vi.fn();
    const cancel = vi.fn();
    sonner.show('Undo available', {
      action: { label: 'Undo', onClick: action },
      cancel: { label: 'Skip', onClick: cancel },
    });
    await fixture.whenStable();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];

    buttons.find((button) => button.textContent?.includes('Undo'))?.click();
    buttons.find((button) => button.textContent?.includes('Skip'))?.click();
    await fixture.whenStable();

    expect(action).toHaveBeenCalledOnce();
    expect(cancel).toHaveBeenCalledOnce();
    expect(toasts()[0].getAttribute('data-removed')).toBe('true');
  });

  it('should expose a close button when requested', async () => {
    sonner.info('Dismiss me');
    await fixture.whenStable();

    const close = fixture.nativeElement.querySelector(
      'button[aria-label="Close toast"]',
    ) as HTMLButtonElement;

    close.click();
    await fixture.whenStable();

    expect(toasts()[0].getAttribute('data-removed')).toBe('true');
  });

  it('should render loading toasts with the dedicated loading indicator', async () => {
    sonner.loading('Submitting order');
    await fixture.whenStable();

    const icon = toasts()[0].querySelector('[data-icon]');

    expect(icon?.querySelector('ui-loading')).toBeTruthy();
  });

  it('should dismiss a focused toast with Escape or Delete', async () => {
    sonner.info('Dismiss me');
    await fixture.whenStable();

    const [toast] = toasts();

    toast.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }),
    );
    await fixture.whenStable();

    expect(toast.getAttribute('data-removed')).toBe('true');
  });
});
