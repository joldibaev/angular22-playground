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

    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(6);
    expect(f.nativeElement.querySelector('textarea')).toBeTruthy();
    expect(f.debugElement.queryAll(By.directive(UiMask))).toHaveLength(2);
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
