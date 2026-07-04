import { ComponentFixture, TestBed } from '@angular/core/testing';

import { uiSonnerState } from '../ui-sonner.state';
import { type UiSonnerToast as UiSonnerToastModel } from '../ui-sonner.type';
import { UiSonnerToast } from './ui-sonner-toast';

describe('UiSonnerToast', () => {
  let fixture: ComponentFixture<UiSonnerToast>;
  let toast: UiSonnerToastModel;

  beforeEach(async () => {
    TestBed.overrideComponent(UiSonnerToast, { set: { styles: [] } });
    await TestBed.configureTestingModule({ imports: [UiSonnerToast] }).compileComponents();
    uiSonnerState.reset();

    toast = {
      id: 'toast-test',
      title: 'Saved',
      description: 'Changes are ready',
      type: 'success',
      dismissible: true,
      duration: Number.POSITIVE_INFINITY,
    };
    uiSonnerState.create(toast);
    fixture = TestBed.createComponent(UiSonnerToast);
    fixture.componentRef.setInput('toast', toast);
    fixture.componentRef.setInput('index', 0);
    fixture.componentRef.setInput('expanded', false);
    fixture.componentRef.setInput('invert', false);
    fixture.componentRef.setInput('position', 'bottom-right');
    fixture.componentRef.setInput('visibleToasts', 1);
    fixture.componentRef.setInput('expandByDefault', false);
    fixture.componentRef.setInput('closeButton', true);
    fixture.componentRef.setInput('closeLabel', 'Dismiss notification');
    fixture.componentRef.setInput('interacting', false);
    fixture.componentRef.setInput('gap', 8);
    fixture.componentRef.setInput('frontToastHeight', '40px');
    fixture.componentRef.setInput('width', '356px');
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
    uiSonnerState.reset();
  });

  it('should render content, status semantics, and stack metadata', () => {
    const host = fixture.nativeElement.querySelector('[data-sonner-toast]') as HTMLElement;

    expect(host.getAttribute('role')).toBe('status');
    expect(host.getAttribute('aria-live')).toBe('polite');
    expect(host.getAttribute('data-type')).toBe('success');
    expect(host.getAttribute('data-y-position')).toBe('bottom');
    expect(host.getAttribute('data-x-position')).toBe('right');
    expect(host.getAttribute('data-width')).toBe('356px');
    expect(host.textContent).toContain('Saved');
    expect(host.textContent).toContain('Changes are ready');
  });

  it('should expose a labelled close button and dismiss the toast', async () => {
    const onDismiss = vi.fn();
    toast.onDismiss = onDismiss;
    fixture.componentRef.setInput('toast', { ...toast });
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector(
      'button[data-close-button]',
    ) as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Dismiss notification');

    button.click();
    await fixture.whenStable();

    expect(onDismiss).toHaveBeenCalledOnce();
    expect(
      (fixture.nativeElement.querySelector('[data-sonner-toast]') as HTMLElement).getAttribute(
        'data-removed',
      ),
    ).toBe('true');
  });

  it('should hide toasts beyond the visible limit from assistive technology', async () => {
    fixture.componentRef.setInput('index', 2);
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('[data-sonner-toast]') as HTMLElement;
    expect(host.getAttribute('data-visible')).toBe('false');
    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(host.getAttribute('tabindex')).toBe('-1');
  });
});
