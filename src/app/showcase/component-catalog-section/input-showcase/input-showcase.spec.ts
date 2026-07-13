import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, RouterLink, provideRouter } from '@angular/router';
import { UiMask } from '../../../components/ui-mask/ui-mask';
import { InputShowcase } from './input-showcase';
describe('InputShowcase', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('documents text, textarea, states, validation, and minimal mask composition', async () => {
    const f = TestBed.createComponent(InputShowcase);
    await f.whenStable();

    expect(f.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(9);
    expect(f.nativeElement.querySelector('input[type="number"]')).toBeTruthy();
    expect(f.nativeElement.querySelector('textarea')).toBeTruthy();
    expect(f.debugElement.queryAll(By.directive(UiMask))).toHaveLength(2);
  });

  it('demonstrates an accessible password visibility action in the end slot', async () => {
    const fixture = TestBed.createComponent(InputShowcase);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector(
      'input[autocomplete="current-password"]',
    ) as HTMLInputElement;
    const toggle = fixture.nativeElement.querySelector(
      'button[slot="end"][aria-label="Show password"]',
    ) as HTMLButtonElement;

    expect(input.type).toBe('password');
    expect(toggle.getAttribute('aria-label')).toBe('Show password');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');

    toggle.click();
    await fixture.whenStable();

    expect(input.type).toBe('text');
    expect(toggle.getAttribute('aria-label')).toBe('Hide password');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
  });

  it('demonstrates clear, loading replacement, and disabled slot states', async () => {
    const fixture = TestBed.createComponent(InputShowcase);
    await fixture.whenStable();

    const clear = fixture.nativeElement.querySelector(
      'button[aria-label="Clear search"]',
    ) as HTMLButtonElement;
    const fields = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('ui-input'),
    );
    const loadingField = fields.find((field) =>
      field.querySelector('.ui-input-label')?.textContent?.includes('Loading'),
    );
    const disabledField = fields.find((field) =>
      field.querySelector('.ui-input-label')?.textContent?.includes('Disabled'),
    );

    expect(clear.disabled).toBe(false);
    clear.click();
    await fixture.whenStable();
    expect(clear.disabled).toBe(true);
    expect(loadingField?.querySelector('.ui-input-loading')).toBeTruthy();
    expect(disabledField?.querySelector('input')?.disabled).toBe(true);
  });

  it('demonstrates start and interactive end content on a textarea', async () => {
    const fixture = TestBed.createComponent(InputShowcase);
    await fixture.whenStable();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    const field = textarea.closest('ui-input') as HTMLElement;
    const clear = field.querySelector('button[aria-label="Clear notes"]') as HTMLButtonElement;

    expect(field.querySelector('ui-icon[slot="start"]')).toBeTruthy();
    expect(textarea.value).toContain('delivery window');
    expect(clear.disabled).toBe(false);

    clear.click();
    await fixture.whenStable();

    expect(textarea.value).toBe('');
    expect(clear.disabled).toBe(true);
  });

  it('links to the dedicated mask showcase through the router', async () => {
    const fixture = TestBed.createComponent(InputShowcase);
    const router = TestBed.inject(Router);
    await fixture.whenStable();
    const link = fixture.debugElement.query(By.directive(RouterLink));

    expect(link.injector.get(RouterLink).queryParams).toEqual({ component: 'mask' });

    link.nativeElement.click();
    await fixture.whenStable();

    const url = router.parseUrl(router.url);
    expect(url.queryParams['component']).toBe('mask');
    expect(url.fragment).toBe('component-catalog');
  });
});
