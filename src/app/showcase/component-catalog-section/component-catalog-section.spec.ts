import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ComponentCatalogSection } from './component-catalog-section';

describe('ComponentCatalogSection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('renders a grouped desktop sidebar and a responsive drawer trigger', async () => {
    const fixture = TestBed.createComponent(ComponentCatalogSection);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.catalog-sidebar')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.mobile-catalog-toolbar')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('ui-drawer')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.desktop-navigation .catalog-link')).toHaveLength(
      34,
    );
    expect(fixture.nativeElement.querySelector('app-accordion-showcase')).toBeTruthy();
  });

  it('keeps the selected component in the query param and renders its showcase', async () => {
    const fixture = TestBed.createComponent(ComponentCatalogSection);
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    const button = Array.from(
      element.querySelectorAll<HTMLButtonElement>('.desktop-navigation .catalog-link'),
    ).find((candidate) => candidate.textContent?.trim().startsWith('Button'));

    button?.click();
    await fixture.whenStable();

    expect(router.parseUrl(router.url).queryParams['component']).toBe('button');
    expect(fixture.nativeElement.querySelector('app-button-showcase')).toBeTruthy();
    expect(button?.getAttribute('aria-current')).toBe('page');
  });

  it('filters navigation without hiding the active showcase', async () => {
    const fixture = TestBed.createComponent(ComponentCatalogSection);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector(
      '.catalog-sidebar input[type="search"]',
    ) as HTMLInputElement;

    input.value = 'sonner';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('.desktop-navigation .catalog-link');
    expect(links).toHaveLength(1);
    expect(links[0].textContent).toContain('Sonner');
    expect(fixture.nativeElement.querySelector('app-accordion-showcase')).toBeTruthy();
  });

  it('reads a valid initial selection from the component query param', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/?component=table');
    const fixture = TestBed.createComponent(ComponentCatalogSection);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-table-showcase')).toBeTruthy();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.desktop-navigation .catalog-link[aria-current="page"]',
      )?.textContent,
    ).toContain('Table');
  });
});
